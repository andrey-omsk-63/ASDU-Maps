import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { SendSocketDeleteWay } from "./../MapServiceFunctions";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapPointDataError = (props: {
  sErr: string;
  setOpen: any;
  debugging: boolean;
  ws: WebSocket;
  fromCross: any;
  toCross: any;
}) => {
  const styleModalMenu = {
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSetEr(false);
  };

  const handleCloseSetEndEr = () => {
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const handleClose = (mode: number) => {
    if (mode === 1)
      SendSocketDeleteWay(
        props.debugging,
        props.ws,
        props.fromCross,
        props.toCross
      );
    handleCloseSetEndEr();
  };

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEr} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndEr}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ textAlign: "center", color: "red" }}>
          {props.sErr}
        </Typography>
        {props.sErr === "Дубликатная связь" && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">Удалить исходную связь?</Typography>
            <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
              Да
            </Button>
            &nbsp;
            <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
              Нет
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
