import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { TablStr, RandomNumber } from "../../MapServiceFunctions";

import { styleModalEndBind, stylePKForm00 } from "../../MainMapStyle";
import { styleFormPK01, stylePKForm01 } from "../../MainMapStyle";
import { stylePKForm02, styleSpisPK05 } from "../../MainMapStyle";
import { stylePKForm04 } from "../../MainMapStyle";

const MapFormPK04 = (props: { view: boolean; handleClose: Function }) => {
  //== Piece of Redux =======================================
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  //console.log("###massplan:", massplan);
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
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
  const StrokaFormPK04 = () => {
    let resStr = [];
    for (let i = 0; i < 48; i++) {
      let aa = RandomNumber(0, 5);
      let bb = RandomNumber(1, 12) * 100;
      let arg7 = !aa ? 0 : aa === 1 ? -bb : bb;
      const stylePKForm03 = {
        padding: "10px 0px 10px 0px",
        borderBottom: "1px solid #d4d4d4",
      };
      resStr.push(
        <Grid key={i} container sx={{ marginBottom: 0 }}>
          {TablStr(0.25, i + 1, stylePKForm03)}
          {TablStr(0.75, i * 10 - i + 2, stylePKForm03)}
          {TablStr(1.4, RandomNumber(5, 12) * 100, stylePKForm03)}
          {TablStr(1.4, RandomNumber(18, 55) * 100, stylePKForm03)}
          {TablStr(1.4, "1, 2, 4", stylePKForm03)}
          {TablStr(1.4, RandomNumber(6, 11), stylePKForm03)}
          {TablStr(1.4, 0, stylePKForm03)}
          {TablStr(1.4, arg7, stylePKForm03)}
          {TablStr(0, "№21, 500 авт/ч, 18с.", stylePKForm03)}
        </Grid>
      );
    }
    return resStr;
  };

  const HeaderTabl = () => {
    return (
      <Grid container sx={stylePKForm02}>
        {TablStr(0.25, "№", stylePKForm04)}
        {TablStr(0.75, "№ напр", stylePKForm04)}
        {TablStr(1.4, "Инт.(авт/ч)", stylePKForm04)}
        {TablStr(1.4, "Нас.(авт/ч)", stylePKForm04)}
        {TablStr(1.4, "№ зел.фазы", stylePKForm04)}
        {TablStr(1.4, "Начало зел.фазы", stylePKForm04)}
        {TablStr(1.4, "Конец зел.фазы", stylePKForm04)}
        {TablStr(1.4, "Пост. поток", stylePKForm04)}
        {TablStr(0, "Состав направлений", stylePKForm04)}
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
              <b>Начальные параметры направлений ПК №{plan.nomPK}</b>
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
            <Box sx={stylePKForm00}>{StrokaFormPK04()}</Box>
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

export default MapFormPK04;
