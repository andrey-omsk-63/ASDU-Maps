import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd } from "./../MainMapStyle";

const MapRouteProtokol = (props: { setOpen: any }) => {
  //== Piece of Redux =======================================
  let massroutepro = useSelector((state: any) => {
    const { massrouteproReducer } = state;
    return massrouteproReducer.massroutepro;
  });
  //===========================================================
  const [openMenu, setOpenMenu] = React.useState(true);

  const handleCloseSetEndPro = () => {
    props.setOpen(false);
    setOpenMenu(false);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseSetEndPro();
  };

  let massPro = massroutepro.ways;

  let massProtokol: any = [];
  let massArea: Array<number> = [];
  for (let i = 0; i < massPro.length; i++) {
    let flagAvail = false;
    for (let j = 0; j < massArea.length; j++) {
      if (massPro[i].sourceArea === massArea[j]) flagAvail = true;
    }
    if (!flagAvail) massArea.push(massPro[i].sourceArea);
  }
  let massAreaSort = massArea.sort(function (a, b) {
    return a - b;
  });

  for (let i = 0; i < massAreaSort.length; i++) {
    let masSpis: any = [];
    masSpis = massPro.filter(
      (mass: { sourceArea: number }) => mass.sourceArea === massAreaSort[i]
    );

    masSpis.sort((x: any, y: any) => x.sourceID - y.sourceID);
    for (let j = 0; j < masSpis.length; j++) {
      massProtokol.push(masSpis[j]);
    }
  }

  const styleSetInf = {
    outline: "none",
    position: "relative",
    marginTop: "9vh",
    marginLeft: "auto",
    marginRight: "3px",
    width: 460,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF",
    //borderColor: "primary.main",
    borderRadius: 1,
    boxShadow: 24,
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
    p: 1.5,
  };

  const StrokaProtokol = () => {
    let resStr = [];
    for (let i = 0; i < massProtokol.length; i++) {
      resStr.push(
        <Grid key={i} container>
          <Grid item xs={1.3}></Grid>
          <Grid item xs={6.1}>
            &nbsp;&nbsp;Район: <b>{massProtokol[i].sourceArea}</b>
            &nbsp;ID:&nbsp;
            <b>{massProtokol[i].sourceID}</b>
          </Grid>
          <Grid item xs>
            &nbsp;&nbsp;Район: <b>{massProtokol[i].targetArea}</b>
            &nbsp;ID:&nbsp;
            <b>{massProtokol[i].targetID}</b>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={openMenu} onClose={handleCloseEnd} hideBackdrop={false}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseSetEndPro()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={{ marginTop: -0.5, textAlign: "center" }}>
          <b>Протокол созданных связей:</b>
        </Box>
        <Box sx={{ marginTop: 0.5 }}>
          <Grid container sx={{ bgcolor: "#C0E2C3" }}>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <b>Выход</b> (из)
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <b>Вход</b> (в)
            </Grid>
          </Grid>
          <Box sx={{ border: 0, overflowX: "auto", height: "73vh" }}>
            {StrokaProtokol()}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapRouteProtokol;
