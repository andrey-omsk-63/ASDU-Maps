import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "./MapPointDataError";
import MapRouteBind from "./MapRouteBind";

import { RecevKeySvg } from "./../MapServiceFunctions";

import { SendSocketGetSvg } from "./../MapSocketFunctions";

import { styleModalEnd, styleFW01, styleFW02 } from "./../MainMapStyle";

import { masSvg } from "./../MainMapGl";

let openSetErr = false;
let soobErr = "";
let OpenMenu = false;
let massTargetRoute: Array<number> = [];
let massTargetNum: Array<number> = [];
let massTargetName: Array<string> = [];
let oldIdx = -1;

let fromIdx = -1;
let inIdx = -1;

let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

let MasSvg: any = ["", ""];
let propsSvg: any;
let waitPict = false;

const MapWaysFormMenu = (props: {
  setOpen: any;
  idx: number;
  setSvg: any;
}) => {
  //console.log("MapWaysFormMenu:", oldIdx);

  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log("massdk:", props.idx, massdk);
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log("massroute:", massroute);
  //========================================================
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const WS = datestat.ws;
  const propsArea = massroute.vertexes[props.idx].area;
  const propsId = massroute.vertexes[props.idx].id;
  let what = massdk[props.idx].area ? "перекрёстка" : "объекта";

  const handleCloseSetEnd = () => {
    oldIdx = -1;
    props.setOpen(-1, -1, -1);
  };

  const OpenBind = (mode: number) => {
    reqRoute.dlRoute = massroute.ways[massTargetRoute[mode]].lenght;
    reqRoute.tmRoute = massroute.ways[massTargetRoute[mode]].time;
    let homeRegion = massroute.vertexes[fromIdx].region;
    let arIn = massroute.vertexes[fromIdx].area;
    let idIn = massroute.vertexes[fromIdx].id;
    let arOn = massroute.vertexes[inIdx].area;
    let idOn = massroute.vertexes[inIdx].id;
    SendSocketGetSvg(WS, homeRegion, arIn, idIn, arOn, idOn);
    waitPict = true;
    setOpenSetBind(true);
  };

  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    inIdx = props.idx;
    openSetErr = false;
    waitPict = false;
    MasSvg = ["", ""];
    OpenMenu = false;
    massTargetRoute = [];
    massTargetNum = [];
    massTargetName = [];
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        massroute.ways[i].targetArea === propsArea &&
        massroute.ways[i].targetID === propsId
      ) {
        massTargetRoute.push(i);
        for (let j = 0; j < massroute.vertexes.length; j++) {
          if (
            massroute.ways[i].sourceArea === massroute.vertexes[j].area &&
            massroute.ways[i].sourceID === massroute.vertexes[j].id
          ) {
            massTargetName.push(massroute.vertexes[j].name);
            massTargetNum.push(j);
          }
        }
      }
    }
    if (!massTargetRoute.length) {
      openSetErr = true;
      let what = propsArea ? "На перекрёстке " : "На точке ";
      soobErr =
        what + massroute.vertexes[props.idx].name + " нет входящих направлений";
    } else {
      if (massTargetRoute.length === 1) {
        fromIdx = massTargetNum[0];
        OpenBind(0);
      } else {
        OpenMenu = true;
      }
    }
  }
  //==========================================================
  const handleClose = (mode: number) => {
    if (typeof mode !== "number") {
      handleCloseSetEnd();
    } else {
      if (mode === 777) {
        handleCloseSetEnd();
      } else {
        fromIdx = massTargetNum[mode];
        OpenBind(mode);
      }
    }
  };

  const SpisRoutes = () => {
    let resStr = [];
    resStr.push(
      <Button
        key={Math.random()}
        sx={styleModalEnd}
        onClick={() => handleClose(777)}
      >
        <b>&#10006;</b>
      </Button>
    );
    resStr.push(
      <Box key={Math.random()} sx={{ textAlign: "center", marginBottom: 1 }}>
        Входящая связь {what} <b>{massdk[props.idx].nameCoordinates}</b> с
      </Box>
    );
    for (let i = 0; i < massTargetName.length; i++) {
      resStr.push(
        <Button key={i} sx={styleFW02} onClick={() => handleClose(i)}>
          <b>{massTargetName[i].slice(0, 60)}</b>
        </Button>
      );
    }
    return resStr;
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    props.setSvg(null);
    massTargetRoute.length === 1 && handleCloseSetEnd();
  };

  if (masSvg[0] !== "" && waitPict) {
    propsSvg = masSvg[0];
    MasSvg[0] = propsSvg[RecevKeySvg(massroute.vertexes[fromIdx])];
    MasSvg[1] = propsSvg[RecevKeySvg(massroute.vertexes[inIdx])];
    waitPict = false;
    setTrigger(!trigger);
  }

  return (
    <>
      {OpenMenu && massTargetRoute.length > 1 && (
        <Box sx={styleFW01}>{SpisRoutes()}</Box>
      )}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={handleCloseSetEnd}
          fromCross={0}
          toCross={0}
          update={0}
          setSvg={{}}
        />
      )}
      {openSetBind && fromIdx >= 0 && inIdx >= 0 && (
        <MapRouteBind
          setOpen={setOpenSetBind}
          svg={MasSvg}
          idxA={fromIdx}
          idxB={inIdx}
          reqRoute={reqRoute}
          func={MakeRecordMassRoute}
          mode={1}
        />
      )}
    </>
  );
};

export default MapWaysFormMenu;
