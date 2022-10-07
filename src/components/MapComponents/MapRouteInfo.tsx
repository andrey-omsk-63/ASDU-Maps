import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

let dlRoute1 = 0;
let sec = 0;
let sRoute1 = 0;

const MapRouteInfo = (props: {
  activeRoute: any;
  idxA: number;
  idxB: number;
  setOpen: any;
  dlRoute: number;
  setDlRoute: any;
}) => {
  //console.log("111111", dlRoute1, props.dlRoute);
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //========================================================
  const styleSetArea = {
    width: "100px",
    //marginTop: "-4px",
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
      width: "118px",
    },
  };

  const [openSetInf, setOpenSetInf] = React.useState(true);
  let tmRoute1 = "";

  const handleCloseSetEndInf = () => {
    props.setOpen(false);
    setOpenSetInf(false);
    dlRoute1 = 0;
  };

  const handleClose = () => {
    console.log("Выход", dlRoute1);
    props.setDlRoute(dlRoute1);
    props.setOpen(false);
    setOpenSetInf(false);
    dlRoute1 = 0;
  };

  if (dlRoute1 === 0) {
    sec = Math.round(props.activeRoute.properties.get("duration").value);
    if (props.activeRoute) {
      dlRoute1 = Math.round(props.activeRoute.properties.get("distance").value);
      let tm = props.activeRoute.properties.get("duration").text;
      tmRoute1 =
        tm.substring(0, tm.length - 1) + " (" + Math.round(sec) + " сек)";
    }
    sRoute1 = (dlRoute1 / 1000 / sec) * 3600;

    if (dlRoute1 !== props.dlRoute) {
      let sec2 = props.dlRoute / (sRoute1 / 3.6);
      tmRoute1 = Math.round(sec2 / 60) + " мин (" + Math.round(sec2) + " сек)";
      dlRoute1 = props.dlRoute;
    }
    sRoute1 = Math.round(sRoute1 * 10) / 10;
  }

  const [valuen, setValuen] = React.useState(dlRoute1);

  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const handleChange = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp)).toString();
    dlRoute1 = valueInp;
    let sec2 = dlRoute1 / (sRoute1 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин (" + Math.round(sec2) + " сек)";
    setValuen(valueInp);
    setTmRoute2(tmRoute1);
    // console.log("###", dlRoute1, tmRoute1);
  };

  const Inputer = () => {
    return (
      <Box sx={styleSetArea}>
        <Box component="form" sx={styleBoxFormArea}>
          <TextField
            size="small"
            type="number"
            onKeyPress={handleKey} //отключение Enter
            value={valuen}
            inputProps={{ style: { fontSize: 14.2 } }}
            onChange={handleChange}
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
      bgcolor: "background.paper",
      minWidth: "85px",
      maxWidth: "85px",
      maxHeight: "21px",
      minHeight: "21px",
      borderColor: "primary.main",
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
    <Modal open={openSetInf} onClose={handleCloseSetEndInf} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Входная точка связи:</b> <br />
          Район: <b>{massdk[props.idxA].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxA].ID}</b> <br />
          {massdk[props.idxA].nameCoordinates} <br /> <br />
          <b>Выходная точка связи:</b> <br />
          Pайон: <b>{massdk[props.idxB].area}</b>
          &nbsp;ID:&nbsp;<b>{massdk[props.idxB].ID}</b> <br />
          {massdk[props.idxB].nameCoordinates} <br /> <br />
        </Box>

        <Grid container>
          <Grid item xs={3.9} sx={{ border: 0 }}>
            <b>Длина связи:</b>&nbsp;
          </Grid>
          <Grid item xs={4.2} sx={{ border: 0 }}>
            {Inputer()}
          </Grid>
          <Grid item xs={0.5} sx={{ border: 0 }}>
            м
          </Grid>
          {dlRoute1 !== props.dlRoute && (
            <Grid item xs sx={{ textAlign: "center", border: 0 }}>
              {StrokaMenu()}
            </Grid>
          )}
        </Grid>

        <Box sx={{ marginTop: 0.5 }}>
          <b>Время прохождения:</b> {tmRoute2} <br />
        </Box>
        <Box sx={{ marginTop: 0.5 }}>
          <b>Средняя скорость прохождения:</b> {sRoute1} км/ч <br />
        </Box>
        {props.activeRoute && props.activeRoute.properties.get("blocked") && (
          <Box>Имеются участки с перекрытыми дорогами</Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapRouteInfo;
