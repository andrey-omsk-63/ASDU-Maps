import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { StrokaMenuErr, СontentStrErr } from "./../MapServiceFunctions";
import { InputerDlTm } from "./../MapServiceFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";
import { styleFooterError } from "../MapPointDataErrorStyle";

let dlRoute1 = 0;
let dlRouteBegin = 0;
let tmRoute1 = "";
let flagSave = false;
let sec = 0;
let tmRouteBegin = 0;
let sRoute1 = 0;
let sRouteBegin = 0;
let maskRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

const MapRouteInfo = (props: {
  setOpen: any;
  activeRoute: any;
  idxA: number;
  idxB: number;
  reqRoute: any;
  setReqRoute: any;
  needLinkBind: boolean;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //=== инициализация ======================================
  if (dlRoute1 === 0) {
    maskRoute = props.reqRoute;
    sec = maskRoute.tmRoute;
    tmRouteBegin = maskRoute.tmRoute;
    dlRoute1 = maskRoute.dlRoute;
    dlRouteBegin = maskRoute.dlRoute;
    sRoute1 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = dlRoute1 / (sRoute1 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    sRoute1 = Math.round(sRoute1 * 10) / 10;
    sRouteBegin = sRoute1;
  }
  //========================================================
  const [openSetInf, setOpenSetInf] = React.useState(true);
  const [valueDl, setValueDl] = React.useState(dlRoute1);
  const [valueTm, setValueTm] = React.useState(sec);

  const handleCloseSetEndInf = () => {
    props.setOpen(false);
    setOpenSetInf(false);
    dlRoute1 = 0;
    flagSave = false;
  };

  const handleClose = () => {
    maskRoute.dlRoute = Number(dlRoute1);
    maskRoute.tmRoute = Number(sec);
    props.setReqRoute(maskRoute, props.needLinkBind);
    handleCloseSetEndInf();
  };

  const handleChangeDl = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    if (Number(valueInp) < 1000000) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      dlRoute1 = valueInp;
      let sec2 = dlRoute1 / (sRoute1 / 3.6);
      tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      setValueDl(valueInp);
      setValueTm(Math.round(sec2));
      setTmRoute2(tmRoute1);
    }
  };

  const handleChangeTm = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    if (Number(valueInp) < 66300) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      sec = valueInp;
      sRoute1 = (dlRoute1 / 1000 / sec) * 3600;
      let sec2 = dlRoute1 / (sRoute1 / 3.6);
      tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      sRoute1 = Math.round(sRoute1 * 10) / 10;
      setValueTm(valueInp);
      setTmRoute2(tmRoute1);
    }
  };

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

  const [tmRoute2, setTmRoute2] = React.useState(tmRoute1);

  return (
    <Modal open={openSetInf} onClose={handleCloseSetEndInf}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Исходящая точка связи:</b> <br />
          Район: <b>{massdk[props.idxA].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxA].ID}</b> <br />
          {massdk[props.idxA].nameCoordinates} <br /> <br />
          <b>Входящая точка связи:</b> <br />
          Pайон: <b>{massdk[props.idxB].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxB].ID}</b> <br />
          {massdk[props.idxB].nameCoordinates} <br /> <br />
        </Box>
        <Grid container>
          {СontentStrErr(3.5, "Длина связи:", 1)}
          {СontentStrErr(2.3, InputerDlTm(valueDl, handleChangeDl), 0)}
          {СontentStrErr(0.5, "м", 0)}
          {flagSave && <>{StrokaMenuErr(handleClose)}</>}
        </Grid>
        <Grid container sx={{ marginTop: 1.5 }}>
          {СontentStrErr(5.4, "Время прохождения:", 1)}
          {СontentStrErr(2.3, tmRoute2, 0)}
          {СontentStrErr(0.25, "(", 0)}
          {СontentStrErr(2.3, InputerDlTm(valueTm, handleChangeTm), 0)}
          {СontentStrErr(1.75, "сек)", 0)}
        </Grid>
        <Box sx={{ marginTop: 1.5 }}>
          <b>Средняя скорость прохождения:</b> {sRoute1} км/ч <br />
        </Box>
        {props.activeRoute && props.activeRoute.properties.get("blocked") && (
          <Box>Имеются участки с перекрытыми дорогами</Box>
        )}
        {flagSave && <>{FooterError()}</>}
      </Box>
    </Modal>
  );
};

export default MapRouteInfo;
