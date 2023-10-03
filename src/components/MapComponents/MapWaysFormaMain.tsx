import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { WaysInput, BadExit, InputOpponent } from "./../MapServiceFunctions";

import { Directions } from "./../../App"; // интерфейс massForm

import { styleFW03, styleFormFWTabl } from "./../MainMapStyle";
import { styleFormMenu, styleFW04 } from "./../MainMapStyle";
import { styleFW05, styleFW06 } from "./../MainMapStyle";

let oldName = "";
let HAVE = 0;
let oldOpponent = "";
let currenciesOpp: any = [];

let massForm: Directions = {
  name: "0121/0212",
  satur: 0,
  intensTr: 0,
  dispers: 0,
  peregon: 0,
  wtStop: 0,
  wtDelay: 0,
  offsetBeginGreen: 0,
  offsetEndGreen: 0,
  intensFl: 1200,
  phases: [],
  edited: false,
  opponent: "",
};

const MapWaysFormaMain = (props: {
  maskForm: Directions;
  setClose: Function;
  setHave: Function;
  massDir: Array<string>;
}) => {
  //console.log("massDir:", props.massDir);
  const [badExit, setBadExit] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [currencyOpp, setCurrencyOpp] = React.useState(
    props.maskForm.opponent === ""
      ? "0"
      : props.massDir.indexOf(props.maskForm.opponent)
  );

  const PreparCurrenciesOpponent = () => {
    const currencies: any = [];
    let dat = props.massDir;
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
      currencies.push({ ...maskCurrencies });
    }
    return currencies;
  };

  //=== инициализация ======================================
  if (oldName !== props.maskForm.name) {
    oldName = props.maskForm.name;
    massForm = props.maskForm;
    HAVE = 0;
    oldOpponent = props.maskForm.opponent;
    if (!oldOpponent) oldOpponent = props.massDir[0];
    currenciesOpp = PreparCurrenciesOpponent();
  }
  //========================================================

  const handleCloseFaz = (mode: number) => {
    if (massForm.phases[mode] === -1) {
      massForm.phases[mode] = 1;
    } else {
      massForm.phases[mode] = -1;
    }
    HAVE++;
    props.setHave(HAVE);
    setTrigger(!trigger);
  };

  const StrokaMainTabl = () => {
    let resStr = [];
    for (let i = 0; i < massForm.phases.length; i++) {
      let metka = massForm.phases[i] > 0 ? "✔" : "";
      let illum = massForm.phases[i] > 0 ? styleFW04 : styleFW03;
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={1.2} item sx={{ marginTop: 1, textAlign: "center" }}>
            <b>{metka}</b>
          </Grid>
          <Grid xs item>
            <Button key={i} sx={illum} onClick={() => handleCloseFaz(i)}>
              <b>{i + 1} -я фаза</b>
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const StrTab = (recLeft: string, recRight: any) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={8.5} sx={{ fontSize: 15 }}>
            <b>{recLeft}</b>
          </Grid>
          {typeof recRight === "object" ? (
            <Grid item xs sx={{ fontSize: 12 }}>
              {recRight}
            </Grid>
          ) : (
            <Grid item xs sx={{ fontSize: 14.5, color: "#5B1080" }}>
              <b>{recRight}</b>
            </Grid>
          )}
        </Grid>
      </>
    );
  };
  /////======================================???????????
  const SaveForm = (mode: boolean) => {
    if (mode) {
      oldName = "";
      HAVE = 0;
      props.setClose(mode, massForm);
    } else {
      setBadExit(true);
    }
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && SaveForm(true);
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    !HAVE && SaveForm(true);
  };

  const SetSatur = (valueInp: number) => {
    massForm.satur = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetIntensTr = (valueInp: number) => {
    massForm.intensTr = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetDispers = (valueInp: number) => {
    massForm.dispers = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetPeregon = (valueInp: number) => {
    massForm.peregon = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetWtStop = (valueInp: number) => {
    massForm.wtStop = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetWtDelay = (valueInp: number) => {
    massForm.wtDelay = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetOffsetBeginGreen = (valueInp: number) => {
    massForm.offsetBeginGreen = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const SetOffsetEndGreen = (valueInp: number) => {
    massForm.offsetEndGreen = valueInp;
    HAVE++;
    props.setHave(HAVE);
  };

  const handleCloseOpponent = () => {
    if (massForm.opponent) {
      massForm.opponent = "";
    } else {
      massForm.opponent = oldOpponent;
    }
    HAVE++;
    props.setHave(HAVE);
    setTrigger(!trigger);
  };

  const handleChangeOpp = (event: React.ChangeEvent<HTMLInputElement>) => {
    oldOpponent = event.target.value;
    HAVE++;
    props.setHave(HAVE);
    setCurrencyOpp(event.target.value);
  };

  const OpponentDirect = () => {
    let illum = massForm.opponent ? styleFW06 : styleFW05;
    let metka = massForm.opponent ? "✔" : "";
    let vkl = massForm.opponent;
    return (
      <Box sx={{ marginTop: 1.5, marginLeft: -0.5, marginRight: -0.5 }}>
        <Grid container>
          <Grid item xs={1.2} sx={{ fontSize: 14, textAlign: "center" }}>
            <b>{metka}</b>
          </Grid>
          <Grid item xs={7.5} sx={{ fontSize: 12.9, border: 0 }}>
            <Button sx={illum} onClick={() => handleCloseOpponent()}>
              Левый поворот конкурирует с направлением
            </Button>
          </Grid>
          <Grid item xs>
            {InputOpponent(handleChangeOpp, currencyOpp, currenciesOpp, vkl)}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Основные свойства</Box>
      {StrTab("№ Направления", massForm.name)}
      {StrTab(
        "Насыщение(т.е./ч.)",
        WaysInput(0, massForm.satur, SetSatur, 10000)
      )}
      {StrTab(
        "Интенсивность(т.е./ч.)",
        WaysInput(0, massForm.intensTr, SetIntensTr, 10000)
      )}
      {StrTab(
        "Дисперсия пачки(%)",
        WaysInput(0, massForm.dispers, SetDispers, 100)
      )}
      {StrTab(
        "Длинна перегона(м)",
        WaysInput(0, massForm.peregon, SetPeregon, 99999)
      )}
      {StrTab("Вес остановки", WaysInput(0, massForm.wtStop, SetWtStop, 10))}
      {StrTab("Вес задержки", WaysInput(0, massForm.wtDelay, SetWtDelay, 10))}
      {StrTab(
        "Смещ.начала зелёного(сек)",
        WaysInput(0, massForm.offsetBeginGreen, SetOffsetBeginGreen, 20)
      )}
      {StrTab(
        "Смещ.конца зелёного(сек)",
        WaysInput(0, massForm.offsetEndGreen, SetOffsetEndGreen, 20)
      )}
      {StrTab("Интенсивность пост.потока(т.е./ч.)", massForm.intensFl)}
      {OpponentDirect()}
      <Box sx={{ fontSize: 12, marginTop: 1.5 }}>
        Выберите зелёные фазы для данного направления
      </Box>
      <Box sx={styleFormFWTabl}>{StrokaMainTabl()}</Box>
      <Grid container>
        {HAVE > 0 ? (
          <>
            <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
              <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
                Сохранить изменения
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
              <Button sx={styleFormMenu} onClick={() => handleCloseBad()}>
                Выйти без сохранения
              </Button>
            </Grid>
          </>
        ) : (
          <Box sx={{ marginTop: 1, height: "25px" }}> </Box>
        )}
      </Grid>
    </>
  );
};

export default MapWaysFormaMain;
