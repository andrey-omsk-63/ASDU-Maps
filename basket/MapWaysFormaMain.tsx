import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { ComplianceMapMassdk } from "./../MapServiceFunctions";
import { WaysInput } from "./../MapServiceFunctions";

import { Directions } from "./../../App";  // интерфейс massForm

import { styleModalEnd, styleFormInf, styleFW03 } from "./../MainMapStyle";
import { styleFormNameRoute, styleFormFWTabl } from "./../MainMapStyle";
import { styleFormMenu } from "./../MainMapStyle";

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
};

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
  //console.log("map:", map);
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log("massdk:", massdk);
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //console.log("massroute:", massroute);
  //========================================================
  const [trigger, setTrigger] = React.useState(false);
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  const MAP = map.dateMap.tflight[idxMap];
  const propsArea = massroute.vertexes[props.idx].area;
  const propsId = massroute.vertexes[props.idx].id;
  //=== инициализация ======================================
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    //massFaz = [];
    soob2 = " c перекрёстком ";
    let maskForm: Directions = {
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
    };
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    //============
    lng = 8; // для отладки, потом убрать !!!
    //============
    for (let i = 0; i < lng; i++) maskForm.phases.push(-1);
    massForm = maskForm;
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
  }

  const handleCloseSetEnd = () => {
    oldIdx = -1;
    props.setOpen(false);
  };

  const handleCloseFaz = (mode: number) => {
    if (massForm.phases[mode] === -1) {
      massForm.phases[mode] = 1;
    } else {
      massForm.phases[mode] = -1;
    }
    setTrigger(!trigger);
  };

  const StrokaMainTabl = () => {
    let resStr = [];
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    //============
    lng = 8; // для отладки, потом убрать !!!
    //============
    for (let i = 0; i < lng; i++) {
      let metka = massForm.phases[i] > 0 ? "✔" : "";
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={2} item sx={{ marginTop: 1, textAlign: "center" }}>
            <b>{metka}</b>
          </Grid>
          <Grid xs item>
            <Button
              key={i}
              sx={styleFW03}
              variant="contained"
              onClick={() => handleCloseFaz(i)}
            >
              <b>{i + 1} -я фаза</b>
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const StrTab = (recLeft: string, recRight: any) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={8.5} sx={{ fontSize: 15 }}>
            <b>{recLeft}</b>
          </Grid>
          <Grid item xs sx={{ fontSize: 12 }}>
            {recRight}
          </Grid>
        </Grid>
      </>
    );
  };

  const SaveForm = (mode: boolean) => {
    handleCloseSetEnd();
  };

  const SetSatur = (valueInp: number) => {
    massForm.satur = valueInp;
  };

  const SetIntensTr = (valueInp: number) => {
    massForm.intensTr = valueInp;
  };

  const SetDispers = (valueInp: number) => {
    massForm.dispers = valueInp;
  };

  const SetPeregon = (valueInp: number) => {
    massForm.peregon = valueInp;
  };

  const SetWtStop = (valueInp: number) => {
    massForm.wtStop = valueInp;
  };

  const SetWtDelay = (valueInp: number) => {
    massForm.wtDelay = valueInp;
  };

  const SetOffsetBeginGreen = (valueInp: number) => {
    massForm.offsetBeginGreen = valueInp;
  };

  const SetOffsetEndGreen = (valueInp: number) => {
    massForm.offsetEndGreen = valueInp;
  };

  const MainWaysForma = (massForm: any, SaveForm: Function) => {
    return (
      <>
        <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Основные свойства</Box>
        {StrTab("№ Направления", massForm.name)}
        {StrTab(
          "Насыщение(т.е./ч.)",
          WaysInput(massForm.satur, SetSatur, 10000)
        )}
        {StrTab(
          "Интенсивность(т.е./ч.)",
          WaysInput(massForm.intensTr, SetIntensTr, 10000)
        )}
        {StrTab(
          "Дисперсия пачки(%)",
          WaysInput(massForm.dispers, SetDispers, 100)
        )}
        {StrTab(
          "Длинна перегона(м)",
          WaysInput(massForm.peregon, SetPeregon, 99999)
        )}
        {StrTab("Вес остановки", WaysInput(massForm.wtStop, SetWtStop, 10))}
        {StrTab("Вес задержки", WaysInput(massForm.wtDelay, SetWtDelay, 10))}
        {StrTab(
          "Смещ.начала зелёного(сек)",
          WaysInput(massForm.offsetBeginGreen, SetOffsetBeginGreen, 20)
        )}
        {StrTab(
          "Смещ.конца зелёного(сек)",
          WaysInput(massForm.offsetEndGreen, SetOffsetEndGreen, 20)
        )}
        {StrTab("Интенсивность пост.потока(т.е./ч.)", massForm.intensFl)}
        <Box sx={{ fontSize: 12, marginTop: 1.5 }}>
          Выберите зелёные фазы для данного направления
        </Box>
        <Box sx={styleFormFWTabl}>{StrokaMainTabl()}</Box>
        <Grid container>
          <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
              Сохранить изменения
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleFormMenu} onClick={() => SaveForm(false)}>
              Выйти без сохранения
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  let soob1 = massdk[props.idx].area ? " перекрёстка " : " объекта ";

  return (
    <>
      <Box sx={styleFormInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseSetEnd()}>
          <b>&#10006;</b>
        </Button>
        {massdk.length > props.idx && (
          <>
            <Box sx={styleFormNameRoute}>
              Входящая связь {soob1}
              <b>{massdk[props.idx].nameCoordinates}</b>
              {soob2}
              <b>{massTargetName[props.nomInMass]}</b>
            </Box>
            {MainWaysForma(massForm, SaveForm)}
          </>
        )}
      </Box>
    </>
  );
};

export default MapWaysForma;
