import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { styleModalEnd } from "./../MainMapStyle";

const MapVertexForma = (props: { setOpen: any; idx: number }) => {
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //===========================================================
  console.log("!!!:", props.idx, massdk[props.idx]);

  const handleCloseSetEnd = () => {
    props.setOpen(false);
  };

  const styleSetInf = {
    outline: "none",
    position: "absolute",
    left: "77%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 460,
    bgcolor: "background.paper",
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  return (
    <Box sx={styleSetInf}>
      <Button sx={styleModalEnd} onClick={() => handleCloseSetEnd()}>
        <b>&#10006;</b>
      </Button>
      <Box sx={{ marginTop: -0.5, textAlign: "center" }}>
        <b>Здесь будет информация о светофоре:</b>
      </Box>
      <Box sx={{ marginTop: 0.5 }}>
        <Grid container sx={{ bgcolor: "#C0E2C3" }}>
          <Grid item xs={6} sx={{ border: 0, textAlign: "center" }}>
            <b>Выход</b>
          </Grid>
          <Grid item xs={6} sx={{ border: 0, textAlign: "center" }}>
            <b>Вход</b>
          </Grid>
        </Grid>
        <Box sx={{ border: 0, overflowX: "auto", height: "73vh" }}></Box>
      </Box>
    </Box>
  );
};

export default MapVertexForma;
