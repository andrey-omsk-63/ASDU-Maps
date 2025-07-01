import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { ExitCross } from "../../MapServiceFunctions";

import { styleSpisPK05 } from "../../MainMapStyle";
import { styleFormPK01, styleSpisPK04 } from "../../MainMapStyle";
import { MakeStylSpisPK06 } from "../../MainMapStyle";

const MapViewPK = (props: {
  view: boolean;
  idx: number;
  handleClose: Function;
}) => {
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  //=== инициализация ======================================
  let plan = massplan.plans[props.idx];
  //========================================================
  const handleClose = () => props.handleClose(false);

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  const ExitArrowView = (id: number) => {
    let inputId = -1;
    let area = plan.areaPK;
    for (let i = 0; i < plan.coordPlan.length; i++)
      if (i !== plan.coordPlan.length - 1 && plan.coordPlan[i].id === id)
        inputId = plan.coordPlan[i + 1].id;
    let have = false;
    if (inputId >= 0) {
      for (let i = 0; i < massroute.ways.length; i++) {
        let rec = massroute.ways[i];
        if (rec.sourceArea === area && rec.sourceID === id)
          if (rec.targetID === inputId) have = true;
      }
    }
    return (
      <Box sx={{ color: !have ? "#F1F5FB" : "#9265ff" }}>
        <b>⬇</b>
      </Box>
    );
  };

  const InputArrowView = (id: number) => {
    let exitId = -1;
    let area = plan.areaPK;
    for (let i = 0; i < plan.coordPlan.length; i++)
      if (i && plan.coordPlan[i].id === id) exitId = plan.coordPlan[i - 1].id;
    let have = false;
    if (exitId >= 0) {
      for (let i = 0; i < massroute.ways.length; i++) {
        let rec = massroute.ways[i];
        if (rec.targetArea === area && rec.targetID === id)
          if (rec.sourceID === exitId) have = true;
      }
    }

    return (
      <Box sx={{ color: !have ? "#F1F5FB" : "#7dc36b" }}>
        <b>⬆</b>
      </Box>
    );
  };

  const StrokaPK = () => {
    return plan.coordPlan.map((planCoordPlan: any, idx: number) => {
      let nameVert = "";
      for (let j = 0; j < massroute.vertexes.length; j++) {
        if (
          massroute.vertexes[j].area === plan.subareaPK &&
          massroute.vertexes[j].id === planCoordPlan.id
        ) {
          nameVert = massroute.vertexes[j].name;
          break;
        }
      }
      return (
        <Grid key={idx} container sx={{ marginBottom: 1.5 }}>
          <Grid item xs={0.6} sx={{ padding: "1px 0px 1px 5px" }}>
            <Box sx={{ display: "flex", justifyContent: "left" }}>
              {ExitArrowView(planCoordPlan.id)}
              {InputArrowView(planCoordPlan.id)}
            </Box>
          </Grid>
          <Grid item xs={1} sx={{ padding: "1px 0px 1px 5px" }}>
            {planCoordPlan.id}
          </Grid>
          <Grid item xs>
            {nameVert}
          </Grid>
        </Grid>
      );
    });
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={styleSpisPK04}>
        {ExitCross(handleClose)}
        <Box sx={styleFormPK01}>
          <b>План координации №{plan.nomPK}</b>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Название ПК:</b>&nbsp;&nbsp;
          </Box>
          <Box sx={{ fontSize: 15, color: "#5B1080" }}>
            <em>{plan.namePK.slice(0, 96)}</em>
          </Box>
        </Box>
        <Box sx={styleSpisPK05}>
          <Box sx={{}}>
            <b>Подрайон:</b> &nbsp;
          </Box>
          <Box sx={{ color: "#5B1080" }}>
            <em> {plan.subareaPK}</em> &nbsp;
          </Box>
        </Box>
        <Box sx={MakeStylSpisPK06()}>{StrokaPK()}</Box>
      </Box>
    </Modal>
  );
};

export default MapViewPK;
