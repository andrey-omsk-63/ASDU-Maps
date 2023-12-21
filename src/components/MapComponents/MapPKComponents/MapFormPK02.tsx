import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { TablStr } from "../../MapServiceFunctions";

import { styleModalEndBind, stylePKForm00 } from "../../MainMapStyle";
import { styleFormPK01, stylePKForm01 } from "../../MainMapStyle";
import { stylePKForm03, stylePKForm033 } from "../../MainMapStyle";
import { stylePKForm02, styleSpisPK05 } from "../../MainMapStyle";
import { stylePKForm04 } from "../../MainMapStyle";

const MapFormPK02 = (props: { view: boolean; handleClose: Function }) => {
  //== Piece of Redux =======================================
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
  //========================================================
  const handleClose = () => {
    props.handleClose(false);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };
  //========================================================
  const StrokaFormPK02 = () => {
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
      let brb: any = i === plan.coordPlan.length - 1 ? 0 : "1px solid #d4d4d4";
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 0 }}>
          {TablStr(0.125, i + 1, stylePKForm03(brb))}
          {TablStr(0.365, plan.coordPlan[i].id, stylePKForm03(brb))}
          {TablStr(2.125, nameVert, stylePKForm033(brb))}
          {TablStr(0.5, 107, stylePKForm03(brb))}
          {TablStr(0.5, 4, stylePKForm03(brb))}
          {TablStr(0.5, 3, stylePKForm03(brb))}
          {TablStr(0.99, "1(2)", stylePKForm03(brb))}
          {TablStr(0.99, "3(4)", stylePKForm03(brb))}
          {TablStr(0.99, "4(5)", stylePKForm03(brb))}
          {TablStr(0.99, "3(5)", stylePKForm03(brb))}
          {TablStr(0.99, "4(5)", stylePKForm03(brb))}
          {TablStr(0.99, "3(4)", stylePKForm03(brb))}
          {TablStr(0.99, "4(6)", stylePKForm03(brb))}
          {TablStr(0, "3(5)", stylePKForm03(brb))}
        </Grid>
      );
    }
    return resStr;
  };

  const HeaderTabl = () => {
    return (
      <Grid container sx={stylePKForm02}>
        {TablStr(0.125, "№", stylePKForm04)}
        {TablStr(0.365, "№пер", stylePKForm04)}
        {TablStr(2.125, "Название", stylePKForm04)}
        {TablStr(0.5, "Кол-во фаз", stylePKForm04)}
        {TablStr(0.5, "Кол-во напр", stylePKForm04)}
        {TablStr(0.5, "Смещ", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 1Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 2Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 3Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 4Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 5Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 6Ф", stylePKForm04)}
        {TablStr(0.99, "Длит / (мин.длит) 7Ф", stylePKForm04)}
        {TablStr(0, "Длит / (мин.длит) 8Ф", stylePKForm04)}
      </Grid>
    );
  };

  return (
    <Modal open={props.view} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={stylePKForm01}>
        <Button sx={styleModalEndBind} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        {massplan.plans.length > 0 ? (
          <>
            <Box sx={styleFormPK01}>
              <b>Начальные параметры перекрёстков ПК №{plan.nomPK}</b>
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
                <Box sx={{ position: "absolute", right: "6px", border: 0 }}>
                  <Box sx={styleSpisPK05}>
                    <Box sx={{}}>
                      <b>Подрайон: {plan.subareaPK}</b> &nbsp;
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {HeaderTabl()}
            <Box sx={stylePKForm00}>{StrokaFormPK02()}</Box>
          </>
        ) : (
          <Box sx={styleFormPK01}>
            <b>Вы пытаетесь посмотреть форму несуществующего плана!!!</b>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default MapFormPK02;
