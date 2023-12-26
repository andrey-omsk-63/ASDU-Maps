import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapWaysFormaMain from "./MapWaysFormaMain";

import { ComplianceMapMassdk, BadExit } from "./../MapServiceFunctions";

import { MaxFaz } from "./../MapConst";

import { Directions } from "./../../App"; // интерфейс massForm

import { styleModalEnd, styleFormInf } from "./../MainMapStyle";
import { styleFormNameRoute } from "./../MainMapStyle";

let massTargetRoute: Array<number> = [];
let massTargetName: Array<string> = [];
let oldIdx = -1;
let soob2 = "";

let massForm: Directions = {
  name: "0121/0212",
  satur: 0,
  intensTr: 0,
  dispers: 0,
  peregon: 0,
  wtStop: 0,
  wtDelay: 0,
  offsetBeginGreen: 0,
  offsetEndGreen: 0,
  intensFl: 1200,
  phases: [],
  edited: false,
  opponent: "",
};

let HAVE = 0;

const MapWaysForma = (props: {
  setOpen: any;
  idx: number;
  nomInMass: number;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //========================================================
  const [badExit, setBadExit] = React.useState(false);
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  const MAP = map.dateMap.tflight[idxMap];
  const propsArea = massroute.vertexes[props.idx].area;
  const propsId = massroute.vertexes[props.idx].id;
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    HAVE = 0;
    soob2 = " c перекрёстком ";
    massTargetRoute = [];
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
            if (
              massTargetName.length - 1 === props.nomInMass &&
              !massdk[j].area
            )
              soob2 = " c объектом ";
          }
        }
      }
    }
    let nomRoute = massTargetRoute[props.nomInMass];
    let dlina = massroute.ways[nomRoute].lenght;
    let maskForm: Directions = {
      name: "0121/0212",
      satur: 0,
      intensTr: 0,
      dispers: 50,
      peregon: dlina,
      wtStop: 1,
      wtDelay: 1,
      offsetBeginGreen: 0,
      offsetEndGreen: 0,
      intensFl: 1200,
      phases: [],
      edited: false,
      opponent: "",
    };
    massForm = maskForm;
    let lng = idxMap >= 0 ? MAP.phases.length : MaxFaz;

    console.log("Lng:", lng, idxMap, MAP.phases);

    for (let i = 0; i < lng; i++) maskForm.phases.push(-1);
  }

  const handleCloseEnd = React.useCallback(() => {
    oldIdx = -1;
    props.setOpen(false);
  }, [props]);

  const handleCloseSetEnd = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && handleCloseEnd(); // выход без сохранения
  }, [handleCloseEnd]);

  const SaveForm = (mode: boolean, massForm: Directions) => {
    console.log("SaveForm:", mode, massForm);
    handleCloseEnd();
  };

  const SetHave = (have: number) => {
    HAVE = have;
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleCloseEnd(); // выход без сохранения
  };

  let soob1 = massdk[props.idx].area ? " перекрёстка " : " объекта ";

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) handleCloseSetEnd();
    },
    [handleCloseSetEnd]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================

  let massNameDir: Array<string> = [];

  return (
    <>
      <Box sx={styleFormInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseSetEnd()}>
          <b>&#10006;</b>
        </Button>
        {massdk.length > props.idx && (
          <>
            <Box sx={styleFormNameRoute}>
              Входящая связь1 {soob1}
              <b>{massdk[props.idx].nameCoordinates}</b>
              {soob2}
              <b>{massTargetName[props.nomInMass]}</b>
            </Box>
            <MapWaysFormaMain
              maskForm={massForm}
              setClose={SaveForm}
              setHave={SetHave}
              massDir={massNameDir}
            />
          </>
        )}
      </Box>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default MapWaysForma;
