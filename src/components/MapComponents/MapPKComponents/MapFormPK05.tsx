import * as React from "react";
import { useSelector } from "react-redux";
//import { massplanCreate, statsaveCreate } from './../../../redux/actions';

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

//import { AREA } from "../../MainMapGl";

import { styleModalEndBind, stylePKForm00 } from "../../MainMapStyle";
import { styleFormPK01, stylePKForm01 } from "../../MainMapStyle";
//import { StylSpisPK02, styleSpisPK03, StylSpisPK022 } from '../../MainMapStyle';
import { stylePKForm02, styleSpisPK05 } from "../../MainMapStyle";

const MapFormPK05 = (props: { view: boolean; handleClose: Function }) => {
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
  //console.log('###massplan:', massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log('massplan:', massplan, massSpis);
  //=== инициализация ======================================
  let plan = massplan.plans[datestat.idxMenu];
  let nameArea = "";
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    let num = Number(map.dateMap.tflight[i].area.num);
    if (num === plan.areaPK) {
      nameArea = map.dateMap.tflight[i].area.nameArea;
      break;
    }
  }
  //========================================================
  const handleClose = () => {
    props.handleClose(false);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };
  //========================================================
  const stylePKForm04 = {
    padding: "5px 0px 5px 0px",
    border: 0,
  };

  const TablStr = (xss: number, arg: any, style: any) => {
    return (
      <>
        {xss ? (
          <Grid item xs={xss} sx={style}>
            {arg}
          </Grid>
        ) : (
          <Grid item xs sx={style}>
            {arg}
          </Grid>
        )}
      </>
    );
  };

  const StrokaFormPK01 = () => {
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
      let brb = i === plan.coordPlan.length - 1 ? 0 : 1;
      const stylePKForm03 = {
        padding: "10px 0px 10px 0px",
        borderBottom: brb,
      };

      const stylePKForm033 = {
        textAlign: "left",
        padding: "10px 0px 10px 0px",
        borderBottom: brb,
      };
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 0 }}>
          {TablStr(0.25, i + 1, stylePKForm03)}
          {TablStr(0.5, plan.coordPlan[i].id, stylePKForm03)}
          {TablStr(3.25, nameVert, stylePKForm033)}
          {TablStr(0.89, 107, stylePKForm03)}
          {TablStr(0.89, 3, stylePKForm03)}
          {TablStr(0.89, 15, stylePKForm03)}
          {TablStr(0.89, 1, stylePKForm03)}
          {TablStr(0.89, 40, stylePKForm03)}
          {TablStr(0.89, 3, stylePKForm03)}
          {TablStr(0.89, 61, stylePKForm03)}
          {TablStr(0.89, 4, stylePKForm03)}
          {TablStr(0, 71, stylePKForm03)}
        </Grid>
      );
    }
    return resStr;
  };

  const HeaderTabl = () => {
    return (
      <Grid container sx={stylePKForm02}>
        {TablStr(0.25, "№", stylePKForm04)}
        {TablStr(0.5, "№пер", stylePKForm04)}
        {TablStr(3.25, "Название", stylePKForm04)}
        {TablStr(0.89, "ТЦ", stylePKForm04)}
        {TablStr(0.89, "№ Фазы", stylePKForm04)}
        {TablStr(0.89, "Нач. Фаза", stylePKForm04)}
        {TablStr(0.89, "№ Фазы", stylePKForm04)}
        {TablStr(0.89, "Нач. Фаза", stylePKForm04)}
        {TablStr(0.89, "№ Фазы", stylePKForm04)}
        {TablStr(0.89, "Нач. Фаза", stylePKForm04)}
        {TablStr(0.89, "№ Фазы", stylePKForm04)}
        {TablStr(0, "Нач. Фаза", stylePKForm04)}
      </Grid>
    );
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleFormPK01}>
          <b>Программа координации ПК №{plan.nomPK}</b>
        </Box>
        <Grid container>
          <Grid item xs={8} sx={{ border: 0 }}>
            <Box sx={styleSpisPK05}>
              <Box sx={{}}>
                <b>Название ПК:</b>&nbsp;&nbsp;
              </Box>
              <Box sx={{ fontSize: 15 }}>
                <em>{plan.namePK.slice(0, 53)}</em>
              </Box>
            </Box>
          </Grid>
          <Grid item xs sx={{ textAlign: "right", border: 0 }}>
            <Box sx={{ position: "absolute", right: "15px", border: 0 }}>
              <Box sx={styleSpisPK05}>
                <Box sx={{}}>
                  <b>Pайон: {plan.areaPK}</b> &nbsp;
                </Box>
                <Box sx={{ fontSize: 15 }}>
                  <em>{nameArea}</em>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {HeaderTabl()}
        <Box sx={stylePKForm00}>{StrokaFormPK01()}</Box>
      </Box>
    </Modal>
  );
};

export default MapFormPK05;
