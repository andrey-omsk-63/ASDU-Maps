import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapRouteBind = (props: { setOpen: any }) => {
  const [openSetBind, setOpenSetBind] = React.useState(true);

  const handleCloseSetEndBind = () => {
    props.setOpen(false);
    setOpenSetBind(false);
  };

  return (
    <Modal open={openSetBind} onClose={handleCloseSetEndBind} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndBind}>
          <b>&#10006;</b>
        </Button>
        <Box sx={{ textAlign: "center" }}>
          <br />
          <br />
          <b>Здесь будет привязка направления</b>
          <br /> <br />
          <br />
        </Box>
      </Box>
    </Modal>
  );
};

export default MapRouteBind;
