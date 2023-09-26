import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { statsaveCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "./MapPointDataError";

import { ComplianceMapMassdk, WaysInput } from "./../MapServiceFunctions";
import { BadExit, InputFromList } from "./../MapServiceFunctions";
import { HeaderTablFaz } from "./../MapServiceFunctions";

import { styleModalEnd, styleFormInf, styleFormName } from "./../MainMapStyle";
import { styleFT03, styleFT033 } from "./../MainMapStyle";
import { styleFormTabl, styleFormMenu } from "./../MainMapStyle";

let oldIdx = -1;
let massForm: any = null;
//let idx = 0;
let HAVE = 0;

let currenciesPlan: any = [];
let currenciesFaza: any = [];
let FAZA = 0;
let newFAZA = 0;
let soobErr =
  "Начальная длительность фаз не может быть больше минимальной длительности, будьте внимательны!";

const maskFaz: any = {
  MinDuration: 0,
  StartDuration: 0,
  PhaseOrder: 0,
};

const MapVertexForma = (props: {
  setOpen: any;
  idx: number;
  forma: any;
  openErr: boolean;
}) => {
  //== Piece of Redux =======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  //console.log("map:", map);
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  //console.log("datestat:", datestat);
  const dispatch = useDispatch();
  //===========================================================
  const idxMap = ComplianceMapMassdk(props.idx, massdk, map);
  const MAP = map.dateMap.tflight[idxMap];
  const sumPlan = 24;
  const maxFaz = 8;

  const [badExit, setBadExit] = React.useState(false);
  const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  const [currencyPlan, setCurrencyPlan] = React.useState(
    props.forma === null ? "0" : (props.forma.nomPlan - 1).toString()
  );
  const [currencyFaza, setCurrencyFaza] = React.useState(
    props.forma === null
      ? (MAP.phases.length - 1).toString()
      : (props.forma.kolFaz - 1).toString()
  );

  const PreparCurrenciesPlan = (sumPlan: number) => {
    const currencies: any = [];
    let dat: Array<string> = [];
    for (let i = 0; i < sumPlan; i++) dat.push((i + 1).toString());
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

  const PreparCurrenciesFaza = (mazFaz: number) => {
    const currencies: any = [];
    let dat: Array<string> = [];
    for (let i = 1; i < mazFaz + 1; i++) dat.push(i.toString());
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
  //console.log("Inic:", oldIdx, props.idx, datestat.oldIdxForm, props.forma);
  if (datestat.oldIdxForm === -1 && props.forma === null) oldIdx = -1;
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    datestat.oldIdxForm = oldIdx;
    dispatch(statsaveCreate(datestat));
    currenciesPlan = PreparCurrenciesPlan(sumPlan);
    currenciesFaza = PreparCurrenciesFaza(maxFaz);
    if (props.forma === null) {
      HAVE = 0;
      FAZA = idxMap >= 0 ? MAP.phases.length : 0;
      let maskForm: any = {
        nomPlan: 1,
        kolFaz: idxMap >= 0 ? MAP.phases.length : 0,
        offset: 0,
        phases: [],
      };
      massForm = maskForm;

      for (let i = 0; i < FAZA; i++) {
        massForm.phases.push({ ...maskFaz });
      }
      //console.log("111MapVertexForma", FAZA, massForm);
    } else {
      massForm = props.forma;
      FAZA = massForm.kolFaz;
      //setOpenSetErr(props.openErr);
      //console.log("222MapVertexForma", FAZA, massForm);
    }
  }
  //========================================================
  const CloseEnd = React.useCallback(() => {
    oldIdx = -1;
    HAVE = 0;
    props.setOpen(false, massForm); // полный выход
  }, [props]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  // const handleCloseEnd = (event: any, reason: string) => {
  //   if (reason === "escapeKeyDown") handleCloseBad();
  // };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  //=== Функции - обработчики ==============================
  const SaveForm = (mode: boolean) => {
    if (mode) {
      CloseEnd(); // здесь должно быть сохранение
    } else {
      handleCloseBad();
    }
  };

  const SetOffset = (valueInp: number) => {
    massForm.offset = valueInp;
    HAVE++;
  };

  const SetMinDuration = (valueInp: number, idx: number) => {
    massForm.phases[idx].MinDuration = valueInp;
    if (massForm.phases[idx].StartDuration > valueInp) {
      massForm.phases[idx].StartDuration = valueInp;
      console.log("!!!:", massForm.phases);
      //setOpenSetErr(true);
      props.setOpen(true, massForm, true); // полный ререндер
    }
    HAVE++;
  };
  const SetStDuration = (valueInp: number, idx: number) => {
    if (massForm.phases[idx].MinDuration >= valueInp) {
      massForm.phases[idx].StartDuration = valueInp;
      HAVE++;
    } else {
      massForm.phases[idx].StartDuration = massForm.phases[idx].MinDuration;
      //setOpenSetErr(true);
      props.setOpen(true, massForm, true); // полный ререндер
    }
  };

  const SetPhaseOrder = (valueInp: number, idx: number) => {
    massForm.phases[idx].PhaseOrder = valueInp;
    HAVE++;
  };

  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyPlan(event.target.value);
    massForm.nomPlan = Number(event.target.value) + 1;
    HAVE++;
  };

  const handleChangeFaza = (event: React.ChangeEvent<HTMLInputElement>) => {
    newFAZA = Number(event.target.value) + 1;
    if (newFAZA === FAZA) return;
    let massRab = JSON.parse(JSON.stringify(massForm));
    if (newFAZA < FAZA) {
      // количество фаз уменьшилось
      massRab.phases.splice(0, massRab.phases.length); // massRab.phases = [];
      for (let i = 0; i < newFAZA; i++) massRab.phases.push(massForm.phases[i]);
    }
    if (newFAZA > FAZA) {
      // количество фаз увеличелось
      for (let i = 0; i < newFAZA - FAZA; i++)
        massRab.phases.push({ ...maskFaz });
    }
    massRab.kolFaz = newFAZA;
    HAVE++;
    oldIdx = -1;
    props.setOpen(true, massRab, openSetErr);
    setCurrencyFaza(event.target.value);
  };
  //========================================================
  const StrokaMainTabl = () => {
    let resStr = [];
    let lng = idxMap >= 0 ? FAZA : 0;
    for (let i = 0; i < lng; i++) {
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={1} item sx={styleFT03}>
            <Box sx={{ p: 0.2 }}>{i + 1}</Box>
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            <Box sx={{ display: "grid", justifyContent: "center" }}>
              {WaysInput(i, massForm.phases[i].MinDuration, SetMinDuration, 20)}
            </Box>
          </Grid>
          <Grid xs={3.5} item sx={styleFT03}>
            <Box sx={{ display: "grid", justifyContent: "center" }}>
              {WaysInput(
                i,
                massForm.phases[i].StartDuration,
                SetStDuration,
                20
              )}
            </Box>
          </Grid>
          <Grid xs={4} item sx={styleFT033}>
            <Box sx={{ display: "grid", justifyContent: "center" }}>
              {WaysInput(i, massForm.phases[i].PhaseOrder, SetPhaseOrder, 20)}
            </Box>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const StrokaTabl = (recLeft: string, recRight: any) => {
    return (
      <>
        <Grid container sx={{ marginTop: 1 }}>
          <Grid item xs={0.25}></Grid>
          <Grid item xs={6}>
            <b>{recLeft}</b>
          </Grid>
          {typeof recRight === "object" ? (
            <Grid item xs>
              {recRight}
            </Grid>
          ) : (
            <Grid item xs sx={{ fontSize: 15, color: "#5B1080" }}>
              <b>{recRight}</b>
            </Grid>
          )}
        </Grid>
      </>
    );
  };

  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        console.log("ESC!!!", HAVE);
        oldIdx = -1;
        HAVE = 0;
        props.setOpen(false, null); // полный выход
        event.preventDefault();
        // handleCloseBad();
      }
    },
    [props]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================

  let aa = idxMap >= 0 ? MAP.area.nameArea : "";
  let bb = massdk.length > props.idx ? massdk[props.idx].area : "";
  let soob1 = bb + " " + aa;

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={styleFormInf}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        {massdk.length > props.idx && (
          <>
            <Box sx={styleFormName}>
              <b>
                <em>{massdk[props.idx].nameCoordinates}</em>
              </b>
            </Box>
            <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Общие</Box>
            {StrokaTabl("Район", soob1)}
            {StrokaTabl("Номер перекрёстка", massdk[props.idx].ID)}
            {StrokaTabl(
              "Номер плана координации",
              InputFromList(handleChangePlan, currencyPlan, currenciesPlan)
            )}
            {StrokaTabl("Время цикла cек.", "80 сек.")}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>Свойства фаз</Box>
            {StrokaTabl(
              "Количество фаз",
              InputFromList(handleChangeFaza, currencyFaza, currenciesFaza)
            )}
            {StrokaTabl(
              "Начальное смещение сек.",
              WaysInput(0, massForm.offset, SetOffset, 100)
            )}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>
              Таблица параметров фаз
            </Box>
            <Box sx={styleFormTabl}>
              {HeaderTablFaz()}
              <Box sx={{ height: 230, overflowX: "auto" }}>
                {StrokaMainTabl()}
              </Box>
            </Box>
            <Grid container>
              {HAVE > 0 ? (
                <>
                  <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
                    <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
                      Сохранить изменения
                    </Button>
                  </Grid>
                  <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
                    <Button sx={styleFormMenu} onClick={() => SaveForm(false)}>
                      Выйти без сохранения
                    </Button>
                  </Grid>
                </>
              ) : (
                <Box sx={{ marginTop: 1, height: "25px" }}> </Box>
              )}
            </Grid>
          </>
        )}
      </Box>
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          ws={{}}
          fromCross={0}
          toCross={0}
          update={0}
          svg={{}}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapVertexForma;
