import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { styleModalEnd, styleSetInf } from "./../MainMapStyle";

const MapPointDataError = (props: { sErr: string; setOpen: any }) => {
  const [openSetEr, setOpenSetEr] = React.useState(true);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== "backdropClick") setOpenSetEr(false);
  };

  const handleCloseSetEndEr = () => {
    props.setOpen(false);
    setOpenSetEr(false);
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
      </Box>
    </Modal>
  );
};

export default MapPointDataError;
