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
    for (let j = 0; j < massArea.length; j++)
      if (massPro[i].sourceArea === massArea[j]) flagAvail = true;
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
    for (let j = 0; j < masSpis.length; j++) massProtokol.push(masSpis[j]);
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
    borderRadius: 1,
    boxShadow: 24,
    p: 1.5,
  };

  const styleProtokol01 = {
    marginTop: 0.5,
    overflowX: "auto",
    bgcolor: "#F1F5FB",
    border: "1px solid #d4d4d4",
    borderRadius: 1,
    boxShadow: 6,
  };

  const styleProtokol02 = {
    marginTop: -0.5,
    textAlign: "center",
    color: "#5B1080", // сиреневый
    textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
    cursor: "default",
  };

  const StrokaProtokol = () => {
    return massProtokol.map((mProtokol: any, idx: number, array: any) => {
      let tSh = "2px 2px 3px rgba(0,0,0,0.3)";
      return (
        <Grid key={idx} container sx={{ cursor: "default", textShadow: tSh }}>
          <Grid item xs={1.3}></Grid>
          <Grid item xs={6.1}>
            &nbsp;&nbsp;Район: <b>{mProtokol.sourceArea}</b>
            &nbsp;ID:&nbsp;
            <b>{mProtokol.sourceID}</b>
          </Grid>
          <Grid item xs>
            &nbsp;&nbsp;Район: <b>{mProtokol.targetArea}</b>
            &nbsp;ID:&nbsp;
            <b>{mProtokol.targetID}</b>
          </Grid>
        </Grid>
      );
    });
  };

  return (
    <Modal open={openMenu} onClose={handleCloseEnd} hideBackdrop={false}>
      <Box sx={styleSetInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseSetEndPro()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleProtokol02}>
          <b>Протокол созданных связей:</b>
        </Box>
        <Box sx={styleProtokol01}>
          <Grid container sx={{ cursor: "default", bgcolor: "#C0E2C3" }}>
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
