import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { massrouteCreate, massrouteproCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { SendSocketDeleteWay } from "./../MapSocketFunctions";
import { SendSocketDeleteWayFromPoint } from "./../MapSocketFunctions";
import { SendSocketDeleteWayToPoint } from "./../MapSocketFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

let lengthRoute = 0;
let index = -1;

let dlRoute1 = 0;
let dlRouteBegin = 0;
let flagSave = false;
let sec = 0;
let tmRouteBegin = 0;
let sRoute0 = 0;
let sRouteBegin = 0;
let tmRoute1 = "";
let maskRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

const MapPointDataError = (props: {
  sErr: string;
  setOpen: any;
  debug: boolean;
  ws: any;
  fromCross: any;
  toCross: any;
  activeRoute: any;
  update: any;
}) => {
  const WS = props.ws;
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  const dispatch = useDispatch();
  //=========================================================
  const styleModalMenu = {
    marginTop: 0.5,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const styleSetArea = {
    width: "55px",
    maxHeight: "6px",
    minHeight: "6px",
    bgcolor: "#FFFBE5",
    boxShadow: 3,
    textAlign: "center",
    p: 1,
  };

  const styleBoxFormArea = {
    "& > :not(style)": {
      marginTop: "-8px",
      marginLeft: "-10px",
      width: "73px",
    },
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);

  //=== инициализация ======================================
  if (index < 0) {
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
    sRoute0 = 0;
    if (sec) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = 0;
    if (sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    console.log("0tmRoute1", tmRoute1);
    sRoute0 = Math.round(sRoute0 * 10) / 10;
    sRouteBegin = sRoute0;
  }

  const handleCloseSetEnd = () => {
    index = -1;
    props.setOpen(false);
    setOpenSetEr(false);
  };

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
        SendSocketDeleteWayFromPoint(
          props.debug,
          WS,
          props.fromCross,
          props.toCross
        );
      } else {
        if (props.toCross.pointBbArea === "0") {
          SendSocketDeleteWayToPoint(
            props.debug,
            WS,
            props.fromCross,
            props.toCross
          );
        } else {
          SendSocketDeleteWay(props.debug, WS, props.fromCross, props.toCross);
        }
      }
    }
    handleCloseSetEnd();
  };

  const handleClose = () => {
    maskRoute.dlRoute = Number(dlRoute1);
    maskRoute.tmRoute = Number(sec);
    // props.setReqRoute(maskRoute,props.needLinkBind);
    // handleCloseSetEndInf();
  };

  const [valueDl, setValueDl] = React.useState(dlRoute1);
  const [valueTm, setValueTm] = React.useState(sec);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChangeDl = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    if (Number(valueInp) < 1000000) {
      valueInp = Math.trunc(Number(valueInp)).toString();
      dlRoute1 = valueInp;
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
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
      if (dlRoute1) sRoute0 = (dlRoute1 / 1000 / sec) * 3600;
      let sec2 = 0;
      if (dlRoute1 && sRoute0) sec2 = dlRoute1 / (sRoute0 / 3.6);
      if (sec2) tmRoute1 = Math.round(sec2 / 60) + " мин";
      flagSave = true;
      sRoute0 = Math.round(sRoute0 * 10) / 10;
      setValueTm(valueInp);
      setTmRoute2(tmRoute1);
    }
  };

  const InputerDl = () => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={valueDl}
            inputProps={{ style: { fontSize: 14.2 } }}
            onChange={handleChangeDl}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const InputerTm = () => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={valueTm}
            inputProps={{ style: { fontSize: 14.2 } }}
            onChange={handleChangeTm}
            variant="standard"
            color="secondary"
          />
        </Box>
      </Box>
    );
  };

  const StrokaMenu = () => {
    const styleSave = {
      fontSize: 14,
      marginRight: 0.1,
      border: "2px solid #000",
      bgcolor: "#E6F5D6",
      //bgcolor: "background.paper",
      minWidth: "100px",
      maxWidth: "100px",
      maxHeight: "19px",
      minHeight: "19px",
      // borderColor: "primary.main",
      borderColor: "#E6F5D6",
      borderRadius: 2,
      color: "black",
      textTransform: "unset !important",
    };

    return (
      <Button variant="contained" sx={styleSave} onClick={() => handleClose()}>
        <b>Сохранить</b>
      </Button>
    );
  };

  const [tmRoute2, setTmRoute2] = React.useState(tmRoute1);

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEnd} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEnd}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          {props.sErr}
        </Typography>
        {props.sErr === "Дубликатная связь" && (
          <>
            <Grid container sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <Grid item xs={1.9} sx={{ border: 0 }}>
                <b>Выход</b>
              </Grid>
              <Grid item xs={2.8} sx={{ border: 0 }}>
                Район: <b>{massroute.ways[index].sourceArea}</b>
              </Grid>
              <Grid item xs={1.9} sx={{ border: 0 }}>
                ID: <b>{massroute.ways[index].sourceID}</b>
              </Grid>
              <Grid item xs sx={{ border: 0 }}>
                Напр: <b>{massroute.ways[index].lsource}</b>
              </Grid>
            </Grid>

            <Grid container sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <Grid item xs={1.9} sx={{ border: 0 }}>
                <b>Вход</b>
              </Grid>
              <Grid item xs={2.8} sx={{ border: 0 }}>
                Район: <b>{massroute.ways[index].targetArea}</b>
              </Grid>
              <Grid item xs={1.9} sx={{ border: 0 }}>
                ID: <b>{massroute.ways[index].targetID}</b>
              </Grid>
              <Grid item xs sx={{ border: 0 }}>
                Напр: <b>{massroute.ways[index].ltarget}</b>
              </Grid>
            </Grid>

            
            {/* <Box sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <b>Вход</b> &nbsp;&nbsp;&nbsp;&nbsp;Район:{" "}
              <b>{massroute.ways[index].targetArea}</b>
              &nbsp;&nbsp;ID:&nbsp;
              <b>{massroute.ways[index].targetID}&nbsp;</b> Напр:&nbsp;
              <b>{massroute.ways[index].ltarget}</b>
            </Box> */}

            <Grid container sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <Grid item xs={3.5} sx={{ border: 0 }}>
                <b>Длина связи:</b>
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {InputerDl()}
              </Grid>
              <Grid item xs={0.5} sx={{ border: 0 }}>
                м
              </Grid>
              {flagSave && (
                <Grid item xs sx={{ textAlign: "center", border: 0 }}>
                  {StrokaMenu()}
                </Grid>
              )}
            </Grid>

            <Grid container sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <Grid item xs={5.4} sx={{ border: 0 }}>
                <b>Время прохождения:</b>
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {tmRoute2}
              </Grid>
              <Grid item xs={0.25} sx={{ border: 0 }}>
                (
              </Grid>
              <Grid item xs={2.3} sx={{ border: 0 }}>
                {InputerTm()}
              </Grid>
              <Grid item xs sx={{ border: 0 }}>
                сек)
              </Grid>
            </Grid>

            <Box sx={{ marginLeft: 1.5, marginTop: 1 }}>
              <b> Средняя скорость прохождения:</b>&nbsp;{sRoute0} км/ч
            </Box>

            {flagSave && (
              <Box sx={{ marginLeft: 1.5, marginTop: 1 }}>
                Исходная длина связи: {dlRouteBegin} м<br />
                Исходное время прохождения: {tmRouteBegin} сек
                <br />
                Исходная скорость прохождения: {sRouteBegin} км/ч
              </Box>
            )}

            <Box sx={{ textAlign: "center", marginTop: 1 }}>
              <Typography variant="h6" sx={{ color: "red" }}>
                Удалить исходную связь?
              </Typography>
              <Button sx={styleModalMenu} onClick={() => handleCloseDel(1)}>
                Да
              </Button>
              &nbsp;
              <Button sx={styleModalMenu} onClick={() => handleCloseDel(2)}>
                Нет
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
