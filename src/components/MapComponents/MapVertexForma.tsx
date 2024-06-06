import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { massdkCreate, statsaveCreate } from "../../redux/actions";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import MapPointDataError from "./MapPointDataError";

import { WaysInput, DelStrokaFaz, MainTablInp } from "./../MapServiceFunctions";
import { BadExit, InputFromList, StrTablVert } from "./../MapServiceFunctions";
import { HeaderTablFaz, ShiftOptimal } from "./../MapServiceFunctions";
import { CombOrder, DelCross } from "./../MapServiceFunctions";
import { SaveFormVert, PreparCurrenciesPlan } from "./../MapServiceFunctions";
import { PreparCurrenciesFaza } from "./../MapServiceFunctions";

import { SUMPK, MaxFaz } from "./../MapConst";

import { styleModalEnd, styleFormName } from "./../MainMapStyle";
import { styleFormVert, styleFT033, styleFT03 } from "./../MainMapStyle";
import { styleFormTabl00 } from "./../MainMapStyle";
import { styleFormTabl01, styleFormTabl02 } from "./../MainMapStyle";

import { PLANER } from "../MainMapGl";

let oldIdx = -1;
let massForm: any = null;
let HAVE = 0;
let CURR: any = [];

let currenciesPlan: any = [];
let currenciesFaza: any = [];
let currencies: any = [];
let FAZA = 0;
let MASSFAZA: Array<number> = [];
let newFAZA = 0;
let nomDelFaz = -1;

let soobErr =
  "Начальная длительность фаз не может быть меньше минимальной длительности, будьте внимательны!";

const maskFaz: any = {
  NumPhase: 0,
  MinDuration: 1, // миним. длительность фазы
  StartDuration: 1, // начальная длительность фазы
  PhaseOrder: 0, // порядок фазы
};

const MapVertexForma = (props: {
  setOpen: any; //
  idx: number;
  forma: any;
  openErr: boolean;
}) => {
  //console.log("MapVertexForma:", props.idx, oldIdx, props.forma);
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //===========================================================
  const MASSDK = massdk[props.idx];
  const [badExit, setBadExit] = React.useState(false);
  const [openSetErr, setOpenSetErr] = React.useState(props.openErr);
  const [trigger, setTrigger] = React.useState(false);

  const [currencyPlan, setCurrencyPlan] = React.useState(
    props.forma === null ? "0" : (props.forma.nomPlan - 1).toString()
  );

  const [currencyFaza, setCurrencyFaza] = React.useState(
    props.forma === null
      ? (MASSDK.phases.length - 2).toString()
      : (props.forma.kolFaz - 2).toString()
  );
  //=== инициализация ======================================
  if (datestat.oldIdxForm === -1 && props.forma === null) oldIdx = -1;
  if (oldIdx !== props.idx) {
    oldIdx = props.idx;
    datestat.oldIdxForm = oldIdx;
    dispatch(statsaveCreate(datestat));
    currenciesPlan = PreparCurrenciesPlan(SUMPK, []);
    currenciesFaza = PreparCurrenciesFaza(MaxFaz);
    if (props.forma === null) {
      HAVE = 0; // первое вхождение из 'родителя'
      datestat.have = HAVE;
      dispatch(statsaveCreate(datestat));
      nomDelFaz = -1;
      FAZA = MASSDK.phases.length;
      MASSFAZA = JSON.parse(JSON.stringify(MASSDK.phases));
      let maskForm: any = {
        ID: MASSDK.ID,
        timeCycle: 80,
        nomPlan: 1,
        optimal: false,
        kolFaz: MASSDK.phases.length,
        offset: 0,
        phases: [],
      };
      massForm = maskForm;
      for (let i = 0; i < FAZA; i++) {
        maskFaz.NumPhase = MASSDK.phases[i];
        maskFaz.PhaseOrder = i + 1;
        massForm.phases.push({ ...maskFaz });
      }
    } else {
      massForm = props.forma; // повторноеое вхождение из 'родителя'
      FAZA = massForm.kolFaz;
    }
  }
  //========================================================
  const CloseEnd = React.useCallback(() => {
    oldIdx = -1;
    HAVE = 0;
    datestat.have = HAVE;
    dispatch(statsaveCreate(datestat));
    props.setOpen(false, null); // полный выход
  }, [props, dispatch, datestat]);

  const handleCloseBad = React.useCallback(() => {
    HAVE && setBadExit(true);
    !HAVE && CloseEnd(); // выход без сохранения
  }, [CloseEnd]);

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    mode && CloseEnd(); // выход без сохранения
  };

  const Haver = () => {
    HAVE++;
    datestat.have = HAVE;
    dispatch(statsaveCreate(datestat));
    setTrigger(!trigger); // ререндер
  };
  //=== Функции - обработчики ==============================
  const SaveForm = (mode: boolean) => {
    if (mode) {
      // выход с сохранением
      MASSFAZA = [];
      for (let i = 0; i < massForm.kolFaz; i++) {
        for (let j = 0; j < massForm.kolFaz; j++)
          if (massForm.phases[j].PhaseOrder === i + 1)
            MASSFAZA.push(massForm.phases[j].NumPhase);
      }
      MASSDK.phases = MASSFAZA;
      dispatch(massdkCreate(massdk));
      CloseEnd(); // здесь должно быть сохранение
    } else {
      handleCloseBad();
    }
  };

  const SetOffset = (valueInp: number) => {
    massForm.offset = valueInp;
    Haver();
  };

  const SetMinDuration = (valueInp: number, idx: number) => {
    // massForm.phases[idx].MinDuration = valueInp;
    // if (massForm.phases[idx].StartDuration > valueInp) {
    //   massForm.phases[idx].StartDuration = valueInp;
    //   props.setOpen(true, massForm, true); // полный ререндер
    // }
    // HAVE++;
    // setTrigger(!trigger); // ререндер
    if (massForm.phases[idx].StartDuration < valueInp) {
      props.setOpen(true, massForm, true); // полный ререндер
    } else {
      massForm.phases[idx].MinDuration = valueInp;
      Haver();
      //setTrigger(!trigger); // ререндер
    }
  };

  const SetStDuration = (valueInp: number, idx: number) => {
    // if (massForm.phases[idx].MinDuration >= valueInp) {
    //   massForm.phases[idx].StartDuration = valueInp;
    //   HAVE++;
    //   setTrigger(!trigger); // ререндер
    // } else {
    //   massForm.phases[idx].StartDuration = massForm.phases[idx].MinDuration;
    //   props.setOpen(true, massForm, true); // полный ререндер
    // }
    if (massForm.phases[idx].MinDuration > valueInp) {
      props.setOpen(true, massForm, true); // полный ререндер
    } else {
      massForm.phases[idx].StartDuration = valueInp;
      Haver();
      //setTrigger(!trigger); // ререндер
    }
  };

  const SetPhaseOrder = (valueInp: number, idx: number) => {
    let oldPhOrder = massForm.phases[idx].PhaseOrder;
    for (let i = 0; i < massForm.phases.length; i++)
      if (massForm.phases[i].PhaseOrder === valueInp)
        massForm.phases[i].PhaseOrder = oldPhOrder;
    massForm.phases[idx].PhaseOrder = valueInp;
    Haver();
    //setTrigger(!trigger); // ререндер
  };

  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrencyPlan(event.target.value);
    massForm.nomPlan = Number(event.target.value) + 1;
    massForm.optimal = false;
    Haver();
  };

  const FirstFree = (MASSFAZA: Array<number>) => {
    let freeNum = -1;
    for (let i = 0; i < MaxFaz; i++) {
      freeNum = MASSFAZA.indexOf(i + 1);
      if (freeNum < 0) {
        freeNum = i + 1;
        break;
      }
    }
    return freeNum;
  };

  const handleChangeFaza = (event: React.ChangeEvent<HTMLInputElement>) => {
    newFAZA = Number(event.target.value) + 2;
    if (newFAZA === FAZA) return;
    let massRab = JSON.parse(JSON.stringify(massForm));
    if (newFAZA < FAZA) {
      // количество фаз уменьшилось
      massRab.phases.splice(0, massRab.phases.length); // massRab.phases = [];
      MASSFAZA = [];
      for (let i = 0; i < newFAZA; i++) {
        massRab.phases.push(massForm.phases[i]);
        MASSFAZA.push(massForm.phases[i].NumPhase);
      }
      let temp2: any = CombOrder(massForm, newFAZA);
      for (let i = 0; i < newFAZA; i++)
        massForm.phases[i].PhaseOrder = temp2[i];
    }
    if (newFAZA > FAZA) {
      // количество фаз увеличелось
      for (let i = 0; i < newFAZA - FAZA; i++) {
        maskFaz.NumPhase = FirstFree(MASSFAZA);
        MASSFAZA.push(maskFaz.NumPhase);
        maskFaz.MinDuration = maskFaz.StartDuration = 0;
        maskFaz.PhaseOrder = FAZA + i + 1;
        massRab.phases.push({ ...maskFaz });
      }
    }
    FAZA = newFAZA;
    massRab.kolFaz = newFAZA;
    Haver();
    oldIdx = -1;
    props.setOpen(true, massRab, openSetErr); // полный ререндер
    setCurrencyFaza(event.target.value);
  };

  const ChangeOptimal = () => {
    massForm.optimal = !massForm.optimal;
    Haver();
    setTrigger(!trigger); // ререндер
  };

  const ChangeStrDel = (idx: number) => {
    //====== сделать проверку ======
    if (nomDelFaz === idx) {
      nomDelFaz = -1;
    } else nomDelFaz = idx;
    setTrigger(!trigger); // ререндер
  };

  const DeleteFaza = (mode: boolean) => {
    if (!mode) {
      nomDelFaz = -1; // отмена удаления
      setTrigger(!trigger); // ререндер
    } else {
      // удаление
      let massRab = JSON.parse(JSON.stringify(massForm));
      massRab.phases.splice(0, massRab.phases.length); // massRab.phases = [];
      MASSFAZA = [];
      for (let i = 0; i < massRab.kolFaz; i++)
        if (i !== nomDelFaz) {
          massRab.phases.push(massForm.phases[i]);
          MASSFAZA.push(massForm.phases[i].NumPhase);
        }
      massRab.kolFaz--;
      let temp2: any = CombOrder(massRab, massRab.kolFaz);
      for (let i = 0; i < massRab.kolFaz; i++)
        massRab.phases[i].PhaseOrder = temp2[i];
      nomDelFaz = -1;
      Haver();
      oldIdx = -1;
      props.setOpen(true, massRab, openSetErr); // полный ререндер
    }
  };

  const hChPhase = (event: any, i: number) => {
    Haver();
    let num = Number(event.target.value);
    let currencies = CURR[i];
    MASSFAZA[i] = Number(currencies[num].label);
    massForm.phases[i].NumPhase = MASSFAZA[i];
    setTrigger(!trigger); // ререндер
  };
  //========================================================
  const StrokaMainTabl = () => {
    let resStr = [];
    let currency = "0";
    CURR = [];
    for (let i = 0; i < FAZA; i++) {
      let startDur = massForm.phases[i].StartDuration;
      let minDur = massForm.phases[i].MinDuration;
      let phOrder = massForm.phases[i].PhaseOrder;
      let numPh = massForm.phases[i].NumPhase;
      let massRab = JSON.parse(JSON.stringify(MASSFAZA));
      for (let j = massRab.length - 1; j >= 0; j--)
        if (massRab[j] === numPh) massRab.splice(j, 1);
      currencies = PreparCurrenciesPlan(MaxFaz, massRab);
      CURR.push(currencies);
      for (let j = 0; j < Object.keys(currencies).length; j++)
        if (Number(currencies[j].label) === numPh)
          currency = currencies[j].value;

      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid xs={2.75} item sx={styleFT03}>
            <Box sx={{ display: "grid", justifyContent: "center" }}>
              {InputFromList((e: any) => hChPhase(e, i), currency, currencies)}
            </Box>
          </Grid>
          {MainTablInp(2.75, WaysInput(i, minDur, SetMinDuration, 1, 20), 3)}
          {MainTablInp(2.75, WaysInput(i, startDur, SetStDuration, 1, 20), 3)}
          {MainTablInp(2.75, WaysInput(i, phOrder, SetPhaseOrder, 1, FAZA), 3)}
          <Grid xs={1} item sx={styleFT033} onClick={() => ChangeStrDel(i)}>
            {DelCross(i, nomDelFaz)}
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };
  //=== обработка Esc ======================================
  const escFunction = React.useCallback(
    (event) => {
      if (event.keyCode === 27) {
        oldIdx = -1;
        HAVE = 0;
        nomDelFaz = -1;
        props.setOpen(false, null); // полный выход
        datestat.oldIdxForm = -1;
        dispatch(statsaveCreate(datestat));
        event.preventDefault();
      }
    },
    [props, datestat, dispatch]
  );

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);
    return () => document.removeEventListener("keydown", escFunction);
  }, [escFunction]);
  //========================================================
  let subId: any = massdk[props.idx].ID + "\xa0".repeat(10);
  subId += "Подрайон" + "\xa0".repeat(3) + MASSDK.subarea;

  return (
    <>
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
      <Box sx={styleFormVert(PLANER)}>
        <Button sx={styleModalEnd} onClick={() => handleCloseBad()}>
          <b>&#10006;</b>
        </Button>
        {massdk.length > props.idx && (
          <>
            <Box sx={styleFormName}>
              <em>
                [id{massdk[props.idx].ID}]{" "}
                <b>{massdk[props.idx].nameCoordinates}</b>
              </em>
            </Box>
            <Box sx={{ fontSize: 12, marginTop: 0.5 }}>Общие</Box>
            {StrTablVert(6, "Время цикла cек.", massForm.timeCycle + " сек.")}
            {StrTablVert(6, "Номер перекрёстка", subId)}
            {StrTablVert(
              6,
              "Номер плана координации",
              InputFromList(handleChangePlan, currencyPlan, currenciesPlan)
            )}
            {StrTablVert(
              6,
              "Участвует в автоматической оптимизации",
              ShiftOptimal(massForm.optimal, ChangeOptimal, 0.5)
            )}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>Свойства фаз</Box>
            {StrTablVert(
              6,
              "Количество фаз",
              InputFromList(handleChangeFaza, currencyFaza, currenciesFaza)
            )}
            {StrTablVert(
              6,
              "Начальное смещение сек.",
              WaysInput(0, massForm.offset, SetOffset, 0, 100)
            )}
            <Box sx={{ fontSize: 12, marginTop: 2.5 }}>
              Таблица параметров фаз
            </Box>
            <Box sx={styleFormTabl00}>
              {HeaderTablFaz()}
              <Box sx={styleFormTabl01}>
                <Box sx={styleFormTabl02}>{StrokaMainTabl()}</Box>
                {nomDelFaz >= 0 && <>{DelStrokaFaz(DeleteFaza)}</>}
              </Box>
            </Box>
            {SaveFormVert(HAVE, SaveForm)}
          </>
        )}
      </Box>
      {openSetErr && (
        <MapPointDataError
          sErr={soobErr}
          setOpen={setOpenSetErr}
          fromCross={0}
          toCross={0}
          update={0}
          setSvg={{}}
        />
      )}
    </>
  );
};

export default MapVertexForma;
