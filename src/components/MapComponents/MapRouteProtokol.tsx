import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapRouteProtokol = (props: { massPro: Array<number>; setOpen: any }) => {
  console.log("MASSPRO", props.massPro);
  const [openSetPro, setOpenSetPro] = React.useState(true);

  const handleCloseSetEndPro = () => {
    props.setOpen(false);
    setOpenSetPro(false);
  };

  return (
    <Modal open={openSetPro} onClose={handleCloseSetEndPro} hideBackdrop>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={handleCloseSetEndPro}>
          <b>&#10006;</b>
        </Button>
        <Box>
          <b>Протокол созданных связей:</b>
          <br />
        </Box>
      </Box>
    </Modal>
  );
};

export default MapRouteProtokol;
