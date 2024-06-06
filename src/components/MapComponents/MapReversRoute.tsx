import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapReversRoute = (props: {
  setOpen: any;
  makeRevers: any;
  needRevers: any;
}) => {
  const styleModalMenu = {
    fontSize: 16,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };

  const [openSetEr, setOpenSetEr] = React.useState(true);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
    setOpenSetEr(false);
  };

  const handleClose = (mode: number) => {
    props.makeRevers(true);
    props.needRevers(mode);
    handleCloseSetEnd();
  };

  return (
    <Modal open={openSetEr} onClose={handleCloseSetEnd}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={() => handleClose(0)}>
          <b>&#10006;</b>
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">Создать реверсную связь?</Typography>
          <Box>
            <Button sx={styleModalMenu} onClick={() => handleClose(1)}>
              Да, создать
            </Button>
          </Box>
          <Box sx={{ marginTop: 0.5 }}>
            <Button sx={styleModalMenu} onClick={() => handleClose(2)}>
              Создать с редактированием
            </Button>
          </Box>
          <Box sx={{ marginTop: 0.5 }}>
            <Button sx={styleModalMenu} onClick={() => handleClose(0)}>
              Нет, не создавать
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapReversRoute;
