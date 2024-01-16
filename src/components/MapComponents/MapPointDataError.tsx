import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapRouteBind from "./MapRouteBind";

import { questionForDelete, HeadDoublError } from "./../MapServiceFunctions";
import { InputerDlTm, СontentStrErr } from "./../MapServiceFunctions";
import { StrokaMenuErr, BadExit } from "./../MapServiceFunctions";

import { SendSocketDeleteWay } from "./../MapSocketFunctions";
import { SendSocketDeleteWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWayToPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWay } from "./../MapSocketFunctions";
import { SendSocketCreateWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketCreateWayToPoint } from "./../MapSocketFunctions";
import { SendSocketGetSvg } from "./../MapSocketFunctions";

import { styleModalEndErr, styleSetInfErr } from "../MapPointDataErrorStyle";
import { styleModalEditBind } from "../MapPointDataErrorStyle";
import { styleFooterError } from "../MapPointDataErrorStyle";

import { masSvg } from "./../MainMapGl";

let lengthRoute = 0;
let index = -1;
let fromIdx = -1;
let inIdx = -1;
let massBindNew = [-1, -1];

let dlRoute1 = 0;
let dlRouteBegin = 0;
let flagSave = false;
let sec = 0;
let tmRouteBegin = 0;
let sRoute0 = 0;
let sRouteBegin = 0;
let tmRoute1 = "";

let reqRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

let whatFrom = "";
let whatIn = "";
let nameFrom = "";
let nameIn = "";

let flagInput = true;
let HAVE = 0;

const MapPointDataError = (props: {
  setOpen: any;
  sErr: string;
  fromCross: any;
  toCross: any;
  update: any;
  setSvg: any;
}) => {
  //console.log("MapPointDataError_svg:", props.svg);
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //========================================================
  const [openSetEr, setOpenSetEr] = React.useState(true);
  const [tmRoute2, setTmRoute2] = React.useState(tmRoute1);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);

  const WS = datestat.ws;
  let colorBorder = props.sErr === "Дубликатная связь" ? "#FFFFFF" : "red";
  let colorEnd = props.sErr === "Дубликатная связь" ? "black" : "red";
  let styleModalEnd = styleModalEndErr(colorEnd);
  let styleSetInf = styleSetInfErr(colorBorder);
  let soob = flagSave
    ? "Редактирование ранее созданной связи между"
    : "Вы пытаетесть создать дубликатную связь между";
  //=== инициализация ======================================
  if (flagInput) {
    HAVE = 0;
    flagInput = false;
  }
  if (index < 0) flagSave = false;
  if (index < 0 && props.sErr === "Дубликатная связь") {
    for (let i = 0; i < massroute.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin === massroute.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroute.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroute.ways[i].sourceID &&
        props.toCross.pointBbID === massroute.ways[i].targetID &&
        props.toCross.pointBbArea === massroute.ways[i].targetArea.toString()
      ) {
        index = i;
        lengthRoute = massroute.ways[i].lenght;
        dlRoute1 = lengthRoute;
        break;
      }
    }
    sec = massroute.ways[index].time;
    tmRouteBegin = sec;
    dlRouteBegin = dlRoute1;
    reqRoute.dlRoute = Number(dlRoute1);
    reqRoute.tmRoute = Number(sec);
    sRoute0 = 0;
    if (sec) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = 0;
    if (sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    sRoute0 = Math.round(sRoute0 * 10) / 10;
    sRouteBegin = sRoute0;
    fromIdx = -1;
    inIdx = -1;
    for (let i = 0; i < massroute.vertexes.length; i++) {
      if (
        massroute.vertexes[i].region === massroute.ways[index].region &&
        massroute.vertexes[i].area === massroute.ways[index].sourceArea &&
        massroute.vertexes[i].id === massroute.ways[index].sourceID
      ) {
        fromIdx = i; // выход
        whatFrom = massroute.vertexes[i].area ? "перекрёстком" : "объектом";
        nameFrom = massroute.vertexes[i].name;
      }
      if (
        massroute.vertexes[i].region === massroute.ways[index].region &&
        massroute.vertexes[i].area === massroute.ways[index].targetArea &&
        massroute.vertexes[i].id === massroute.ways[index].targetID
      ) {
        inIdx = i; // вход
        whatIn = massroute.vertexes[i].area ? "перекрёстком" : "объектом";
        nameIn = massroute.vertexes[i].name;
      }
    }
  }
  //========================================================
  const handleCloseEnd = () => {
    index = -1;
    flagInput = true;
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    !HAVE && handleCloseEnd();
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseBad();
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleClose(); // выход без сохранения
  };
  //=== Функции - обработчики ==============================
  const DeleteWay = () => {
    massroute.ways.splice(index, 1); // удаление из базы
    dispatch(massrouteCreate(massroute));
    let idx = -1; // удаление из протокола
    for (let i = 0; i < massroutepro.ways.length; i++) {
      if (
        props.fromCross.pointAaRegin ===
          massroutepro.ways[i].region.toString() &&
        props.fromCross.pointAaArea ===
          massroutepro.ways[i].sourceArea.toString() &&
        props.fromCross.pointAaID === massroutepro.ways[i].sourceID &&
        props.toCross.pointBbID === massroutepro.ways[i].targetID &&
        props.toCross.pointBbArea === massroutepro.ways[i].targetArea.toString()
      ) {
        idx = i;
      }
    }
    if (idx >= 0) {
      massroutepro.ways.splice(idx, 1);
      dispatch(massrouteproCreate(massroutepro));
    }
    props.update();
  };

  const handleCloseDel = (mode: number) => {
    if (mode === 1) {
      DeleteWay();
      if (props.fromCross.pointAaArea === "0") {
        SendSocketDeleteWayFromPoint(WS, props.fromCross, props.toCross);
      } else {
        if (props.toCross.pointBbArea === "0") {
          SendSocketDeleteWayToPoint(WS, props.fromCross, props.toCross);
        } else {
          SendSocketDeleteWay(WS, props.fromCross, props.toCross);
        }
      }
    }
    handleCloseEnd();
  };

  const handleClose = () => {
    massroute.ways[index].lsource = massBindNew[0];
    massroute.ways[index].ltarget = massBindNew[1];
    massroute.ways[index].lenght = Number(dlRoute1);
    reqRoute.dlRoute = Number(dlRoute1);
    massroute.ways[index].time = Number(sec);
    reqRoute.tmRoute = Number(sec);
    dispatch(massrouteCreate(massroute));
    let frCr = props.fromCross;
    let toCr = props.toCross;
    if (props.fromCross.pointAaArea === "0") {
      SendSocketDeleteWayFromPoint(WS, frCr, toCr);
      SendSocketCreateWayFromPoint(WS, frCr, toCr, massBindNew, reqRoute);
    } else {
      if (props.toCross.pointBbArea === "0") {
        SendSocketDeleteWayToPoint(WS, frCr, props.toCross);
        SendSocketCreateWayToPoint(WS, frCr, toCr, massBindNew, reqRoute);
      } else {
        SendSocketDeleteWay(WS, frCr, props.toCross);
        SendSocketCreateWay(WS, frCr, toCr, massBindNew, reqRoute);
      }
    }
    handleCloseEnd();
  };

  const [valueDl, setValueDl] = React.useState(dlRoute1);
  const [valueTm, setValueTm] = React.useState(sec);

  const handleChangeDl = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp));
    if (Number(valueInp) < 1000000) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      dlRoute1 = valueInp;
      reqRoute.dlRoute = Number(dlRoute1);
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      setValueDl(valueInp);
      setValueTm(Math.round(sec2));
      setTmRoute2(tmRoute1);
      HAVE++;
    }
  };

  const handleChangeTm = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp));
    if (Number(valueInp) < 66300) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      sec = valueInp;
      reqRoute.tmRoute = Number(sec);
      if (dlRoute1) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      sRoute0 = Math.round(sRoute0 * 10) / 10;
      setValueTm(valueInp);
      setTmRoute2(tmRoute1);
      HAVE++;
    }
  };
  //========================================================
  const FooterError = () => {
    return (
      <Box sx={styleFooterError}>
        Исходная длина связи: {dlRouteBegin} м<br />
        Исходное время прохождения: {tmRouteBegin} сек
        <br />
        Исходная скорость прохождения: {sRouteBegin} км/ч
      </Box>
    );
  };

  const CallEditorBind = () => {
    flagSave = true;
    let homeRegion = massroute.vertexes[fromIdx].region;
    let arIn = massroute.vertexes[fromIdx].area;
    let idIn = massroute.vertexes[fromIdx].id;
    let arOn = massroute.vertexes[inIdx].area;
    let idOn = massroute.vertexes[inIdx].id;
    SendSocketGetSvg(WS, homeRegion, arIn, idIn, arOn, idOn);
    setOpenSetBind(true);
  };

  const MakeRecordMassRoute = (mode: boolean, mass: any) => {
    props.setSvg(null);
    console.log("!!!MakeRecordMassRoute:", mode, mass);
  };

  return (
    <>
      <Modal open={openSetEr} onClose={CloseEnd}>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
            <b>&#10006;</b>
          </Button>
          {HeadDoublError(flagSave, props.sErr)}
          {props.sErr === "Дубликатная связь" && (
            <>
              <Box sx={{ textAlign: "center" }}>{soob}</Box>
              <Box sx={{ marginTop: -1, p: 1 }}>
                {whatFrom} <b>{nameFrom}</b> и {whatIn} <b>{nameIn}</b>
              </Box>
              <Button sx={styleModalEditBind} onClick={() => CallEditorBind()}>
                <b>Редактирование привязки исходной связи</b>
              </Button>
              <Grid container sx={{ marginLeft: 1.5, marginTop: 1.2 }}>
                {СontentStrErr(3.5, "Длина связи:", 1)}
                {СontentStrErr(2.3, InputerDlTm(valueDl, handleChangeDl), 0)}
                {СontentStrErr(0.5, "м", 0)}
                {flagSave && <>{StrokaMenuErr(handleClose)}</>}
              </Grid>
              <Grid container sx={{ marginLeft: 1.5, marginTop: 1.5 }}>
                {СontentStrErr(5.4, "Время прохождения:", 1)}
                {СontentStrErr(2.3, tmRoute2, 0)}
                {СontentStrErr(0.25, "(", 0)}
                {СontentStrErr(2.3, InputerDlTm(valueTm, handleChangeTm), 0)}
                {СontentStrErr(1.75, "сек)", 0)}
              </Grid>
              <Box sx={{ marginLeft: 1.5, marginTop: 1.5 }}>
                <b> Средняя скорость прохождения:</b>&nbsp;{sRoute0} км/ч
              </Box>
              {flagSave && <>{FooterError()}</>}
              {!flagSave && <>{questionForDelete(handleCloseDel)}</>}
            </>
          )}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      {openSetBind && fromIdx >= 0 && inIdx >= 0 && (
        <MapRouteBind
          setOpen={setOpenSetBind}
          svg={masSvg}
          idxA={fromIdx}
          idxB={inIdx}
          reqRoute={reqRoute}
          func={MakeRecordMassRoute}
          mode={2}
        />
      )}
    </>
  );
};

export default MapPointDataError;
