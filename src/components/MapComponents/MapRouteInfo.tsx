import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapRouteInfo = (props: {
  activeRoute: any;
  idxA: number;
  idxB: number;
  setOpen: any;
}) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });

  //========================================================

  const [openSetInf, setOpenSetInf] = React.useState(true);

  const handleCloseSetEndInf = () => {
    props.setOpen(false);
    setOpenSetInf(false);
  };
  let dlRoute1 = 0;
  let tmRoute1 = "";
  if (props.activeRoute) {
    dlRoute1 = Math.round(props.activeRoute.properties.get("distance").value);
    let tm = props.activeRoute.properties.get("duration").text;
    tmRoute1 =
      tm.substring(0, tm.length - 1) +
      " (" +
      Math.round(props.activeRoute.properties.get("duration").value) +
      " сек)";
  }
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
          <b>Длина связи:</b> {dlRoute1} м <br />
          <b>Время прохождения:</b> {tmRoute1} <br />
        </Box>
        {props.activeRoute && props.activeRoute.properties.get("blocked") && (
          <Box>Имеются участки с перекрытыми дорогами</Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapRouteInfo;
