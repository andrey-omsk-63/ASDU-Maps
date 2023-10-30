import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { styleModalEnd, styleSpisPK05 } from "../../MainMapStyle";
import { styleFormPK01, styleSpisPK04 } from "../../MainMapStyle";
import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapViewPK = (props: {
  view: boolean;
  idx: number;
  handleClose: Function;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log("massplan:", massplan);
  //=== инициализация ======================================
  let plan = massplan.plans[props.idx];
  let nameArea = "";
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    let num = Number(map.dateMap.tflight[i].area.num);
    if (num === plan.areaPK) {
      nameArea = map.dateMap.tflight[i].area.nameArea;
      break;
    }
  }
  //========================================================
  const handleClose = (mode: boolean) => {
    props.handleClose(mode);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose(false);
  };

  const StrokaPK = () => {
    let resStr = [];
    for (let i = 0; i < plan.coordPlan.length; i++) {
      let nameVert = "";
      for (let j = 0; j < massroute.vertexes.length; j++) {
        if (
          massroute.vertexes[j].area === plan.areaPK &&
          massroute.vertexes[j].id === plan.coordPlan[i].id
        ) {
          nameVert = massroute.vertexes[j].name;
          break;
        }
      }
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 1.5 }}>
          <Grid item xs={1} sx={{ padding: "1px 0px 1px 5px", border: 0 }}>
            {plan.coordPlan[i].id}
          </Grid>
          <Grid item xs sx={{ border: 0 }}>
            {nameVert}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={styleSpisPK04}>
        <Button sx={styleModalEnd} onClick={() => handleClose(false)}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>План координации №{plan.nomPK}</b>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Название ПК:</b>&nbsp;&nbsp;
          </Box>
          <Box sx={{ fontSize: 15 }}>
            <em>{plan.namePK.slice(0, 53)}</em>
          </Box>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Pайон: {plan.areaPK}</b> &nbsp;
          </Box>
          <Box sx={{ fontSize: 15 }}>
            <em>{nameArea}</em>
          </Box>
        </Box>
        <Box sx={MakeStylSpisPK06()}>{StrokaPK()}</Box>
      </Box>
    </Modal>
  );
};

export default MapViewPK;
