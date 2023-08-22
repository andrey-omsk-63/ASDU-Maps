import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "./MapPointDataError";

import { styleModalEnd, styleFW01, styleFW02 } from "./../MainMapStyle";

let openSetErr = false;
let soobErr = "";
let OpenMenu = false;
let massTargetRoute: Array<number> = [];
let massTargetNum: Array<number> = [];
let massTargetName: Array<string> = [];
let oldIdx = -1;
//let pusto = -1;

const MapWaysFormMenu = (props: { setOpen: any; idx: number }) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //console.log("massroute:", massroute);
  //========================================================
  const propsArea = massroute.vertexes[props.idx].area;
  const propsId = massroute.vertexes[props.idx].id;

  const handleCloseSetEnd = () => {
    oldIdx = -1;
    props.setOpen(-1, -1, -1);
  };
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    openSetErr = false;
    //pusto = -1;
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
      soobErr =
        "На перекрёстке " +
        massroute.vertexes[props.idx].name +
        " нет входящих направлений";
    } else {
      //pusto = 1;
      OpenMenu = true;
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
        props.setOpen(mode, massTargetNum[mode], 1);
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
        Входящая связь перекрёстка <b>{massdk[props.idx].nameCoordinates}</b> с
        перекрёстком
      </Box>
    );
    for (let i = 0; i < massTargetName.length; i++) {
      resStr.push(
        <Button
          key={i}
          sx={styleFW02}
          variant="contained"
          onClick={() => handleClose(i)}
        >
          <b>{massTargetName[i].slice(0, 60)}</b>
        </Button>
      );
    }
    return resStr;
  };

  return (
    <>
      {OpenMenu && massTargetRoute.length > 1 && (
        <Box sx={styleFW01}>{SpisRoutes()}</Box>
      )}
      {OpenMenu && massTargetRoute.length === 1 && (
        <>{ props.setOpen(0, massTargetNum[0], 1)}</>
      )}
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={handleCloseSetEnd}
          ws={{}}
          fromCross={0}
          toCross={0}
          update={0}
        />
      )}
    </>
  );
};

export default MapWaysFormMenu;
