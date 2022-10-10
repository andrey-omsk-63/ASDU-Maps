import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

let dlRoute1 = 0;
let flagSave = false;
let sec = 0;
let sRoute1 = 0;
let maskRoute: any = {
  dlRoute: 0,
  tmRoute: 0,
};

const MapRouteInfo = (props: {
  activeRoute: any;
  idxA: number;
  idxB: number;
  setOpen: any;
  reqRoute: any;
  setReqRoute: any;
  needLinkBind: boolean;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //========================================================
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

  const [openSetInf, setOpenSetInf] = React.useState(true);
  let tmRoute1 = "";

  if (dlRoute1 === 0) {
    maskRoute = props.reqRoute; // инициализация
    sec = maskRoute.tmRoute;
    dlRoute1 = maskRoute.dlRoute;
    sRoute1 = (dlRoute1 / 1000 / sec) * 3600;
    let sec2 = dlRoute1 / (sRoute1 / 3.6);
    tmRoute1 = Math.round(sec2 / 60) + " мин";
    sRoute1 = Math.round(sRoute1 * 10) / 10;
  }

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
    props.setReqRoute(maskRoute,props.needLinkBind);
    handleCloseSetEndInf();
  };

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
      bgcolor: "background.paper",
      minWidth: "100px",
      maxWidth: "100px",
      maxHeight: "19px",
      minHeight: "19px",
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

        <Grid container sx={{ marginTop: 1 }}>
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

        <Box sx={{ marginTop: 1 }}>
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
