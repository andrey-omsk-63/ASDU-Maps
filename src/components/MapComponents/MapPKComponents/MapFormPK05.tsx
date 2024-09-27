import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { TablStr } from "../../MapServiceFunctions";
import { FormPKnamePK, FormPKsubareaPK } from "../../MapServiceFunctions";

import { styleModalEndBind, stylePKForm00 } from "../../MainMapStyle";
import { styleFormPK01, stylePKForm01 } from "../../MainMapStyle";
import { stylePKForm03, stylePKForm033 } from "../../MainMapStyle";
import { stylePKForm02, stylePKForm04 } from "../../MainMapStyle";
import { stylePKForm05 } from "../../MainMapStyle";

const MapFormPK05 = (props: { view: boolean; handleClose: Function }) => {
  //== Piece of Redux =======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //=== инициализация ======================================
  let plan = massplan.plans[datestat.idxMenu];
  //========================================================
  const handleClose = () => props.handleClose(false);

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };

  const StrokaFormPK05 = () => {
    return plan.coordPlan.map((planCoordPlan: any, idx: number) => {
      let nameVert = "";
      for (let j = 0; j < massroute.vertexes.length; j++) {
        if (
          massroute.vertexes[j].area === plan.areaPK &&
          massroute.vertexes[j].id === planCoordPlan.id
        ) {
          nameVert = massroute.vertexes[j].name;
          break;
        }
      }
      let brb: any =
        idx === plan.coordPlan.length - 1 ? 0 : "1px solid #d4d4d4";

      return (
        <Grid key={idx} container>
          {TablStr(0.25, idx + 1, stylePKForm03(brb))}
          {TablStr(0.5, planCoordPlan.id, stylePKForm03(brb))}
          {TablStr(3.25, nameVert, stylePKForm033(brb))}
          {TablStr(0.89, 107, stylePKForm03(brb))}
          {TablStr(0.89, 3, stylePKForm03(brb))}
          {TablStr(0.89, 15, stylePKForm03(brb))}
          {TablStr(0.89, 1, stylePKForm03(brb))}
          {TablStr(0.89, 40, stylePKForm03(brb))}
          {TablStr(0.89, 3, stylePKForm03(brb))}
          {TablStr(0.89, 61, stylePKForm03(brb))}
          {TablStr(0.89, 4, stylePKForm03(brb))}
          {TablStr(0, 71, stylePKForm03(brb))}
        </Grid>
      );
    });
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
        {massplan.plans.length > 0 ? (
          <>
            <Box sx={styleFormPK01}>
              <b>Программа координации ПК №{plan.nomPK}</b>
            </Box>
            <Grid container sx={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
              {FormPKnamePK(plan)}
              <Grid item xs={2.1}>
                <Box sx={stylePKForm05}>
                  <em>Время эфф.зелёного = 1</em>
                </Box>
              </Grid>
              {FormPKsubareaPK(plan)}
            </Grid>
            {HeaderTabl()}
            <Box sx={stylePKForm00}>{StrokaFormPK05()}</Box>
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

export default MapFormPK05;
