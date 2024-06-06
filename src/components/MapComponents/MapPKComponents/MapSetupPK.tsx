import * as React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { InputFromList, WaysInput, BadExit } from "../../MapServiceFunctions";
import { FooterContent } from "../../MapServiceFunctions";

import { PLANER } from "../../MainMapGl";

import { PlanCoord } from "../../../interfacePlans.d"; // интерфейс

import { styleModalEnd, styleSetPK03 } from "../../MainMapStyle";
import { styleSetPK01, styleSetPK02 } from "../../MainMapStyle";
import { styleSetPK05, styleSetPK06, styleCalc03 } from "../../MainMapStyle";

let idxPK = 0;
let flagInput = true;
let HAVE = 0;

let currenciesPlan: any = [];
let plan: Array<PlanCoord> = [];

const MapSetupPK = (props: {
  close: Function;
  plan: PlanCoord | null;
  setplan: Function | null;
}) => {
  //== Piece of Redux =======================================
  let massplan = useSelector((state: any) => {
    const { massplanReducer } = state;
    return massplanReducer.massplan;
  });
  console.log("massplan:", PLANER, massplan);
  //========================================================
  const [open, setOpen] = React.useState(true);
  const [badExit, setBadExit] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  //=== инициализация ======================================
  if (flagInput) {
    //console.log('props.plan:',props.plan)
    plan = JSON.parse(JSON.stringify(massplan.plans));
    if (props.plan) {
      // вызов из MapCreatePK
      plan.splice(0, plan.length); // plan = [];
      plan.push(props.plan);
    }
    HAVE = idxPK = 0;
    currenciesPlan = [];
    let dat: Array<string> = [];
    for (let i = 0; i < plan.length; i++) {
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
  const [currencyPlan, setCurrencyPlan] = React.useState(idxPK.toString());

  const handleClose = () => {
    flagInput = true;
    setOpen(false);
    props.close(false);
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    !HAVE && handleClose();
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseBad();
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && handleClose(); // выход без сохранения
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

  const SetOptim = () => {
    plan[idxPK].phaseOptim = !plan[idxPK].phaseOptim;
    HAVE++;
    setTrigger(!trigger);
  };

  const SaveForm = (mode: number) => {
    if (mode) {
      if (props.setplan) {
        props.setplan(plan); // вызов из MapCreatePK
      } else massplan.plans = plan;
      handleClose();
    } else handleCloseBad();
  };
  //========================================================
  const StrokaSetup01 = () => {
    return (
      <Grid container sx={{ marginTop: 1.5 }}>
        <Grid item xs={1.5} sx={{ border: 0 }}>
          <b>Номер ПК</b>
        </Grid>
        <Grid item xs={1.5} sx={{ textAlign: "center", marginTop: -0.5 }}>
          {plan.length > 1 ? (
            <>{InputFromList(handleChangePlan, currencyPlan, currenciesPlan)}</>
          ) : (
            <Box sx={{ textAlign: "left", marginTop: 0.5 }}>
              {plan[idxPK].nomPK}{" "}
            </Box>
          )}
        </Grid>
        <Grid item xs sx={{ border: 0 }}>
          <em>{plan[idxPK].namePK}</em>
        </Grid>
      </Grid>
    );
  };

  const StrokaSetup02 = () => {
    let illum = plan[idxPK].phaseOptim ? styleSetPK06 : styleSetPK05;
    let metka = plan[idxPK].phaseOptim ? "✔" : "";
    return (
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs={5.4} sx={{ border: 0 }}>
          <Box sx={{ marginTop: -0.8, display: "flex" }}>
            <b>{soob1}</b>
            <Box sx={{ marginTop: -0.3, display: "inline-block" }}>
              {WaysInput(0, plan[idxPK].timeCycle, SetCycle, 0, 100)}
            </Box>
            <b>сек.</b>
          </Box>
        </Grid>
        <Grid item xs sx={{ marginTop: -1.1, border: 0 }}>
          <Grid container>
            <Grid item xs={1} sx={styleCalc03}>
              <b>{metka}</b>
            </Grid>
            <Grid item xs sx={{ fontSize: 12.9, border: 0 }}>
              <Button sx={illum} onClick={() => SetOptim()}>
                Оптимизировать длительность фаз
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const StrokaSetup03 = () => {
    return (
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ marginTop: -0.7, display: "flex" }}>
            <b>{soob2}</b>
            <Box sx={{ marginTop: -0.4, display: "inline-block" }}>
              {WaysInput(0, plan[idxPK].ki, SetKi, 0, 100)}
            </Box>
            <b>%</b>
          </Box>
        </Grid>
        <Grid item xs>
          <Box sx={{ marginTop: -0.7, display: "flex" }}>
            <b>{soob3}</b>
            <Box sx={{ marginTop: -0.4, display: "inline-block" }}>
              {WaysInput(0, plan[idxPK].ks, SetKs, 0, 100)}
            </Box>
            <b>%</b>
          </Box>
        </Grid>
      </Grid>
    );
  };

  const SetupContent = () => {
    return (
      <>
        {plan.length > 0 ? (
          <>
            {StrokaSetup01()}
            {StrokaSetup02()}
            {StrokaSetup03()}
          </>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            Отсутствуют планы координации в списке планов
          </Box>
        )}
      </>
    );
  };

  let soob1 = "Длительность цикла" + "\xa0".repeat(3);
  let soob2 = "Коэффициент Ki" + "\xa0".repeat(3);
  let soob3 = "Коэффициент Ks" + "\xa0".repeat(3);

  return (
    <>
      <Modal open={open} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={styleSetPK01(700, 248)}>
          <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
            <b>&#10006;</b>
          </Button>
          <Box sx={styleSetPK02}>
            <b>Изменение параметров планов координации</b>
          </Box>
          <Box sx={styleSetPK03}>{SetupContent()}</Box>
          {HAVE > 0 && <>{FooterContent(SaveForm)}</>}
        </Box>
      </Modal>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default MapSetupPK;
