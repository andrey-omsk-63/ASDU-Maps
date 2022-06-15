import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSetInf } from "./MainMapStyle";

const MapRouteInfo = (props: {
  activeRoute: any;
  name1: string;
  name2: string;
  setOpen: any;
}) => {
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
    tmRoute1 = tm.substring(0, tm.length - 1);
  }
  return (
    <Modal open={openSetInf} onClose={handleCloseSetEndInf} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Начальная точка связи:</b>
          <br />
          {props.name1}
          <br />
          <b>Конечная точка связи:</b>
          <br />
          {props.name2}
          <br />
          <b>Длина связи: </b>
          {dlRoute1} м<br />
          <b>Время прохождения: </b>
          {tmRoute1}
          <br />
        </Box>
        {props.activeRoute && props.activeRoute.properties.get("blocked") && (
          <Box>Имеются участки с перекрытыми дорогами</Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapRouteInfo;
