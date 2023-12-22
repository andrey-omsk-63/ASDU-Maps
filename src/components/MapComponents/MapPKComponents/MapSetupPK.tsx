import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { InputFromList, WaysInput } from "../../MapServiceFunctions";

import { PLANER } from "../../MainMapGl";

import { styleModalEnd, styleFormPK03 } from "../../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "../../MainMapStyle";
import { styleSetPK03, styleSetPK04 } from "../../MainMapStyle";
//import { MakeStylSpisPK06 } from "../../MainMapStyle";

let idxPK = 0;
let flagInput = true;
let HAVE = 0;

let currenciesPlan: any = [];

const MapSetupPK = (props: { close: Function }) => {
  //== Piece of Redux =======================================
  // let massroute = useSelector((state: any) => {
  //   const { massrouteReducer } = state;
  //   return massrouteReducer.massroute;
  // });
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log("massplan:", PLANER, massplan);
  //========================================================
  let plan = massplan.plans;
  const sumPlan = plan.length;

  //=== инициализация ======================================
  if (flagInput) {
    HAVE = idxPK = 0;
    currenciesPlan = [];
    let dat: Array<string> = [];
    for (let i = 0; i < sumPlan; i++) {
      dat.push(plan[i].nomPK.toString());
      if (plan[i].nomPK === PLANER) idxPK = i;
    }
    let massKey: any = [];
    let massDat: any = [];
    for (let key in dat) {
      massKey.push(key);
      massDat.push(dat[key]);
    }
    let maskCurrencies = {
      value: "0",
      label: "Все режимы",
    };
    for (let i = 0; i < massKey.length; i++) {
      maskCurrencies.value = massKey[i];
      maskCurrencies.label = massDat[i];
      currenciesPlan.push({ ...maskCurrencies });
    }
    flagInput = false;
  }
  //========================================================
  const [open, setOpen] = React.useState(true);
  const [currencyPlan, setCurrencyPlan] = React.useState(idxPK.toString());
  const [trigger, setTrigger] = React.useState(false);

  const handleClose = () => {
    flagInput = true;
    setOpen(false);
    props.close(false);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose();
  };
  //=== Функции - обработчики ==============================
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyPlan(event.target.value);
    idxPK = Number(event.target.value);
  };

  const SetCycle = (valueInp: number, idx: number) => {
    plan[idxPK].timeCycle = valueInp;
    setTrigger(!trigger);
    HAVE++;
  };

  const SetKi = (valueInp: number, idx: number) => {
    plan[idxPK].ki = valueInp;
    setTrigger(!trigger);
    HAVE++;
  };

  const SetKs = (valueInp: number, idx: number) => {
    plan[idxPK].ks = valueInp;
    setTrigger(!trigger);
    HAVE++;
  };
  //========================================================
  const StrokaSetup01 = () => {
    return (
      <Grid container sx={{ marginTop: 1 }}>
        <Grid item xs={1.5} sx={{ border: 0 }}>
          <b>Номер ПК</b>
        </Grid>
        <Grid item xs={1.5} sx={{ textAlign: "center", marginTop: -0.5 }}>
          {InputFromList(handleChangePlan, currencyPlan, currenciesPlan)}
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          <em>{plan[idxPK].namePK}</em>
        </Grid>
      </Grid>
    );
  };

  const StrokaSetup02 = () => {
    return (
      <Grid container sx={{ marginTop: 2 }}>
        <Grid item xs={6} sx={{ border: 0 }}>
          <Box sx={{ marginTop: -0.8, display: "flex" }}>
            <b>{soob1}</b>
            <Box sx={{ marginTop: -0.3, display: "inline-block" }}>
              {WaysInput(0, plan[idxPK].timeCycle, SetCycle, 0, 100)}
            </Box>
            <b>сек.</b>
          </Box>
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          Оптимизировать длительность фаз
        </Grid>
      </Grid>
    );
  };

  let soob1 = "Длительность цикла" + "\xa0".repeat(3);
  let soob2 = "Коэффициент Ki" + "\xa0".repeat(3);
  let soob3 = "Коэффициент Ks" + "\xa0".repeat(3);

  return (
    <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
      <Box sx={styleSetPK01}>
        <Button sx={styleModalEnd} onClick={() => handleClose()}>
          <b>&#10006;</b>
        </Button>
        <Box sx={styleSetPK02}>
          <b>Изменение параметров планов координации</b>
        </Box>
        <Box sx={styleSetPK03}>
          {StrokaSetup01()}
          {StrokaSetup02()}

          <Grid container sx={{ marginTop: 2 }}>
            <Grid item xs={6} sx={{ border: 0 }}>
              <Box sx={{ marginTop: -0.7, display: "flex" }}>
                <b>{soob2}</b>
                <Box sx={{ marginTop: -0.3, display: "inline-block" }}>
                  {WaysInput(0, plan[idxPK].ki, SetKi, 0, 100)}
                </Box>
                <b>%</b>
              </Box>
            </Grid>
            <Grid item xs sx={{ border: 0 }}>
              <Box sx={{ marginTop: -0.7, display: "flex" }}>
                <b>{soob3}</b>
                <Box sx={{ marginTop: -0.3, display: "inline-block" }}>
                  {WaysInput(0, plan[idxPK].ks, SetKs, 0, 100)}
                </Box>
                <b>%</b>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={styleSetPK04}>
          <Box sx={{ display: "inline-block", margin: "0px 5px 0px 0px" }}>
            <Button
              sx={styleFormPK03}
              //onClick={() => SaveForm(0)}
            >
              Выйти без сохранения
            </Button>
          </Box>

          <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
            <Button
              sx={styleFormPK03}
              //onClick={() => SaveForm(1)}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MapSetupPK;
