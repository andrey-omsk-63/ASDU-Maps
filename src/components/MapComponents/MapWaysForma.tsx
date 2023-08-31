import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { ComplianceMapMassdk } from "./../MapServiceFunctions";
import { WaysInput } from "./../MapServiceFunctions";

import { styleModalEnd, styleFormInf, styleFW03 } from "./../MainMapStyle";
import { styleFormNameRoute, styleFormFWTabl } from "./../MainMapStyle";
import { styleFormMenu } from "./../MainMapStyle";

let massTargetRoute: Array<number> = [];
let massTargetName: Array<string> = [];
let oldIdx = -1;
let massFaz: Array<number> = [];
let soob2 = "";

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
    massFaz = [];
    soob2 = " c перекрёстком ";
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    lng = 8; // для отладки, потом убрать !!!
    for (let i = 0; i < lng; i++) massFaz.push(-1);
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
    if (massFaz[mode] === -1) {
      massFaz[mode] = 1;
    } else {
      massFaz[mode] = -1;
    }
    setTrigger(!trigger);
  };

  const StrokaMainTabl = () => {
    let resStr = [];
    let lng = idxMap >= 0 ? MAP.phases.length : 0;
    lng = 8; // для отладки, потом убрать !!!
    for (let i = 0; i < lng; i++) {
      let metka = massFaz[i] > 0 ? "✔" : "";
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

  const StrokaTabl = (recLeft: string, recRight: any) => {
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

  //let massTot = 3;
  let massForm = {
    name: "",
    satur: 0,
    intensTr: 0,
  };

  const SetForm02 = (valueInp: number) => {
    massForm.satur = valueInp;
  };

  const SetForm03 = (valueInp: number) => {
    massForm.intensTr = valueInp;
  };

  const MainWaysForma = (SaveForm: Function) => {
    return (
      <>
        <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Основные свойства</Box>
        {StrokaTabl("№ Направления", "нет информации")}
        {StrokaTabl(
          "Насыщение(т.е./ч.)",
          WaysInput(massForm.satur, SetForm02, 10000)
        )}
        {StrokaTabl(
          "Интенсивность(т.е./ч.)",
          WaysInput(massForm.intensTr, SetForm03, 10000)
        )}
        {StrokaTabl("Дисперсия пачки(%)", "нет информации")}
        {StrokaTabl("Длинна перегона(м)", "нет информации")}
        {StrokaTabl("Вес остановки", "нет информации")}
        {StrokaTabl("Вес задержки", "нет информации")}
        {StrokaTabl("Смещ.начала зелёного(сек)", "нет информации")}
        {StrokaTabl("Смещ.конца зелёного(сек)", "нет информации")}
        {StrokaTabl("Интенсивность пост.потока(т.е./ч.)", "1200")}
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
            {MainWaysForma(SaveForm)}
          </>
        )}
      </Box>
    </>
  );
};

export default MapWaysForma;
