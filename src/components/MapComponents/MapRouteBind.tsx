import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import { Directions } from "./../../App"; // интерфейс massForm

import MapRouteBindForm from "./MapRouteBindForm";

import { StrokaMenuFooterBind, ReplaceInSvg } from "./../MapServiceFunctions";
import { HeaderBind, BindInput, MaskFormWay } from "./../MapServiceFunctions";
import { HeaderTablBindContent, BindTablFrom } from "./../MapServiceFunctions";

import { styleSetImg, styleModalEndBind } from "./../MainMapStyle";
import { styleBind042, MakeStyleBind00 } from "./../MainMapStyle";
import { styleBind03, styleBind033, styleBind041 } from "./../MainMapStyle";
import { styleBind01, styleBind04, styleBind05 } from "./../MainMapStyle";

let massBind = [0, 0];
let SvgA = true;
let SvgB = true;
let masSvg = ["", ""];

let kolFrom = 4;
let kolIn = 5;
let oldIdxA = -1;
let oldIdxB = -1;
let IDX: number = -1;

let massTotal: any = [];
let beginMassTotal = 0;
let massTotTrFrom: Array<number> = []; // нижняя таблица - интенсивность 'из'
let massTotTrIn: Array<number> = []; // нижняя таблица - интенсивность 'пришло'
let massTotPr: Array<number> = []; // нижняя таблица - интенсивность в %
let massTotTm: Array<number> = []; // нижняя таблица - время проезда
let masFormFrom: any = []; // верхняя левая таблица
let masFormIn: any = []; // верхняя правая таблица

let nameA = "";
let nameB = "";
let Route: any = null;
let From = "";

let maskForm: Directions = JSON.parse(JSON.stringify(MaskFormWay()));
let massForm: Directions = JSON.parse(JSON.stringify(MaskFormWay()));

const MapRouteBind = (props: {
  setOpen: any;
  svg: any;
  setSvg: any;
  idxA: number;
  idxB: number;
  reqRoute: any;
  func: any;
}) => {
  //== Piece of Redux ======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //========================================================
  const [openSetBind, setOpenSetBind] = React.useState(true);
  const [openFormFrom, setOpenFormFrom] = React.useState(false);
  const [openFormIn, setOpenFormIn] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);

  const CloseEnd = () => {
    oldIdxA = -1;
    oldIdxB = -1;
    props.setOpen(false);
    setOpenSetBind(false);
    props.setSvg(null);
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") CloseEnd();
  };

  const handleClose = (mode: any) => {
    CloseEnd();
    if (mode && typeof mode === "number") props.func(false, massBind);
  };

  if (props.idxA < 0 && props.idxA < 0) {
    console.log("Косяк!!!");
  } else {
    nameA = massroute.vertexes[props.idxA].name;
    nameB = massroute.vertexes[props.idxB].name;
    Route = props.reqRoute;
    From = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
  }

  const SEC = props.reqRoute.tmRoute;
  let heightImg = Math.round(window.innerWidth / 7);
  let widthHeight = heightImg.toString();
  const styleBind00 = MakeStyleBind00(heightImg); // стиль для главного мод.окна

  //=== инициализация ======================================
  if (oldIdxA !== props.idxA || oldIdxB !== props.idxB) {
    massBind = [1, 2];
    oldIdxA = props.idxA;
    oldIdxB = props.idxB;
    masSvg = ["", ""];
    SvgA = SvgB = true;
    if (!massroute.vertexes[props.idxA].area) {
      SvgA = false;
      massBind[0] = 0;
    }
    if (!massroute.vertexes[props.idxB].area) {
      SvgB = false;
      massBind[1] = 0;
    }
    maskForm.peregon = props.reqRoute.dlRoute;
    massTotPr = [];
    massTotTrFrom = [];
    massTotTrIn = [];
    massTotTm = [];
    massTotal = [];
    masFormFrom = [];
    masFormIn = [];
    beginMassTotal = 0;
    let nom = 1;
    for (let j = 0; j < kolIn; j++) {
      let nameIn = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
      nameIn += (j + 1).toString();
      masFormIn.push(JSON.parse(JSON.stringify(maskForm)));
      masFormIn[j].name = nameIn + (j + 1).toString();
      for (let i = 0; i < kolFrom; i++) {
        let nameFrom = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
        nameFrom += (i + 1).toString();
        let maskTotal: any = {
          have: false,
          nom: nom++,
          name: nameIn + "/" + nameFrom,
          intensTrFrom: 0,
          intensTrIn: 0,
          intensPr: 0,
          editIntensPr: false,
          time: SEC,
        };
        massTotal.push(maskTotal);
        massTotTrFrom.push(0); // нижняя таблица - интенсивность 'из'
        massTotTrIn.push(-1); // нижняя таблица - интенсивность 'пришло'
        massTotPr.push(0); // нижняя таблица - интенсивность в %
        massTotTm.push(SEC); // нижняя таблица - время проезда
      }
    }
    for (let i = 0; i < kolFrom; i++) {
      masFormFrom.push(JSON.parse(JSON.stringify(maskForm)));
      let nameFrom = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
      masFormFrom[i].name = nameFrom + (i + 1).toString();
    }
  }
  //=== Ожидания получения изображений перекрёстков ========
  React.useMemo(() => {
    if (props.svg && masSvg[0] === "" && masSvg[1] === "") {
      let dat = props.svg;
      masSvg = [];
      for (let key in dat) masSvg.push(dat[key]);
      if (masSvg[0] !== "") masSvg[0] = ReplaceInSvg(masSvg, widthHeight, 0);
      if (masSvg[1] !== "") masSvg[1] = ReplaceInSvg(masSvg, widthHeight, 1);
    }
  }, [props.svg, widthHeight]);
  //=== Функции - обработчики ==============================
  const ReCalcIntensTr = () => {
    if (!masFormIn[beginMassTotal / kolFrom].edited) {
      let chPr = 0;
      for (let i = 0; i < kolFrom; i++) {
        if (massTotal[beginMassTotal + i].have)
          chPr += massTotal[beginMassTotal + i].intensTrIn;
      }
      masFormIn[beginMassTotal / kolFrom].intensTr = chPr;
    }
  };

  const SetFrom = (mode: number, valueInp: number) => {
    masFormFrom[mode].intensTr = valueInp; // из левой верхней таблицы
    for (let i = 0; i < kolIn; i++) {
      massTotal[kolFrom * i + mode].intensTrFrom = valueInp;
      massTotTrFrom[kolFrom * i + mode] = valueInp;
    }
    setTrigger(!trigger);
  };

  const SetIn = (mode: number, valueInp: number) => {
    masFormIn[mode].intensTr = valueInp; // из правой верхней таблицы
    masFormIn[mode].edited = true;
    setTrigger(!trigger);
  };

  const SetTotTrIn = (mode: number, valueInp: number) => {
    massTotTrIn[mode] = valueInp; // из нижней таблицы
    massTotal[mode].intensTrIn = valueInp;
    ReCalcIntensTr();
    setTrigger(!trigger);
  };

  const SetTotPr = (mode: number, valueInp: number) => {
    massTotPr[mode] = valueInp; // из нижней таблицы
    massTotal[mode].intensPr = valueInp;
    massTotal[mode].editIntensPr = true;
    setTrigger(!trigger);
  };

  const SetTotTm = (mode: number, valueInp: number) => {
    massTotTm[mode] = valueInp; // из нижней таблицы
    massTotal[mode].time = valueInp;
    setTrigger(!trigger);
  };

  const SetOpenFormFrom = (mode: boolean, mask: Directions, idx: number) => {
    if (mode) {
      masFormFrom[idx] = mask; // из левой формы
      for (let i = 0; i < kolIn; i++) {
        massTotal[kolFrom * i + idx].intensTrFrom = mask.intensTr;
        massTotTrFrom[kolFrom * i + idx] = mask.intensTr;
      }
      setTrigger(!trigger);
    }
    setOpenFormFrom(false);
  };

  const SetOpenFormIn = (mode: boolean, mask: Directions, idx: number) => {
    if (mode) {
      let pr = JSON.parse(JSON.stringify(masFormIn[idx].intensTr)); // из правой формы
      masFormIn[idx] = mask;
      if (pr !== masFormIn[idx].intensTr) masFormIn[idx].edited = true;
      setTrigger(!trigger);
    }
    setOpenFormIn(false);
  };

  const hClFrom = (idx: number) => {
    massForm = JSON.parse(JSON.stringify(masFormFrom[idx]));
    //============ потом исправить
    massForm.name = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
    massForm.name += (idx + 1).toString();
    for (let i = 0; i < 8; i++) massForm.phases.push(-1);
    IDX = idx;
    setOpenFormFrom(true);
  };

  const hClIn = (idx: number) => {
    massForm = JSON.parse(JSON.stringify(masFormIn[idx]));
    //============ потом исправить
    massForm.name = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
    massForm.name += (idx + 1).toString();
    for (let i = 0; i < 8; i++) massForm.phases.push(-1);
    IDX = idx;
    setOpenFormIn(true);
  };

  const handleCloseIn = (i: number) => {
    beginMassTotal = i * kolFrom;
    setTrigger(!trigger);
  };

  const handleCloseTotal = (idx: number) => {
    massTotal[idx].have = !massTotal[idx].have;
    let pusto = massTotal[idx].have ? 1 : 0;
    if (pusto && massTotTrIn[idx] < 0) {
      massTotTrIn[idx] = masFormFrom[idx % kolFrom].intensTr;
      massTotal[idx].intensTrIn += massTotTrIn[idx];
    }
    ReCalcIntensTr();
    setTrigger(!trigger);
  };
  //========================================================
  const FooterBind = () => {
    let have = 0;
    for (let i = 0; i < massTotal.length; i++) {
      if (massTotal[i].have) have++;
    }
    return (
      <Grid container sx={{ marginTop: "1vh", height: 27, width: "100%" }}>
        <Grid item xs={3.5}></Grid>
        <Grid item xs={5} sx={{ border: 0 }}>
          {have ? (
            <Box sx={{ textAlign: "center" }}>
              {StrokaMenuFooterBind("Отмена", 0, handleClose)}
              {StrokaMenuFooterBind("Сохранение связи", 1, handleClose)}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              {StrokaMenuFooterBind("Отмена", 0, handleClose)}
            </Box>
          )}
        </Grid>
        {!SvgB && <Grid item xs={4}></Grid>}
      </Grid>
    );
  };

  const StrokaTablIn = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxB].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolIn; i++) {
      let nr = nameRoute + (i + 1).toString();
      let illum = beginMassTotal / kolFrom === i ? styleBind042 : styleBind041;
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid item xs={1} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            {i + 1}
          </Grid>
          <Grid item xs={3} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={illum} onClick={() => handleCloseIn(i)}>
              {nr}
            </Button>
          </Grid>
          <Grid item xs={4} sx={{ display: "grid", justifyContent: "center" }}>
            {BindInput(masFormIn[i].intensTr, i, SetIn, 1, 10000)}
          </Grid>
          <Grid item xs sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind05} onClick={() => hClIn(i)}>
              просмотр/изменение
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const BindTablIn = () => {
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind03}>
          <em>Входящие направления</em>
        </Box>
        <Box sx={styleBind033}>
          <Grid container item xs={12}>
            {HeaderTablBindContent(1, "№")}
            {HeaderTablBindContent(3, "Наименование")}
            {HeaderTablBindContent(4, "Интенсивность(т.е./ч)")}
            {HeaderTablBindContent(4, "Свойства")}
          </Grid>
        </Box>
        <Grid container sx={{ height: "26vh" }}>
          {StrokaTablIn()}
        </Grid>
      </Grid>
    );
  };

  const TablTotalContent = (idx: number) => {
    let i = beginMassTotal + idx;
    let metka = massTotal[i].have ? "✔" : "";
    let pusto = massTotal[i].have ? 1 : 0;
    if (pusto) {
      if (massTotTrFrom[i] && massTotTrIn[i] > 0 && !massTotal[i].editIntensPr)
        massTotPr[i] = Math.round((massTotTrIn[i] * 100) / massTotTrFrom[i]);
    }
    return (
      <>
        <Grid item xs={0.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <b>{metka}</b>
        </Grid>
        <Grid item xs={0.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <Button sx={styleBind04} onClick={() => handleCloseTotal(i)}>
            {idx + 1}
          </Button>
        </Grid>
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <b>{massTotal[i].name}</b>
        </Grid>
        <Grid item xs={3.5}>
          <Grid container item xs={12} sx={{ fontSize: 14 }}>
            <Grid item xs={5} sx={styleBind01}>
              <Box sx={{ display: "flex", marginTop: 0.5 }}>
                {pusto !== 0 && (
                  <>
                    из&nbsp;<b>{massTotTrFrom[i]}</b>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={6} sx={styleBind01}>
              <Box sx={{ display: "flex" }}>
                <Box sx={{ marginTop: 0.5 }}>
                  {pusto !== 0 && <>пришло&nbsp;&nbsp;</>}
                </Box>
                {BindInput(massTotTrIn[i], i, SetTotTrIn, pusto, 10000)}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2.5} sx={styleBind01}>
          <Box sx={{ display: "flex" }}>
            {BindInput(massTotPr[i], i, SetTotPr, pusto, 1000)}
            <Box sx={{ marginTop: 0.5 }}>{pusto !== 0 && <>%</>}</Box>
          </Box>
        </Grid>
        <Grid item xs={2.5} sx={styleBind01}>
          {BindInput(massTotTm[i], i, SetTotTm, pusto, 10000)}
        </Grid>
      </>
    );
  };

  const StrokaTablTotal = () => {
    let resStr: any = [];
    for (let i = 0; i < kolFrom; i++) {
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          {TablTotalContent(i)}
        </Grid>
      );
    }
    return resStr;
  };

  const TablTotal = () => {
    let nom = beginMassTotal / kolFrom + 1;
    let nameRoute = "00" + massroute.vertexes[props.idxB].id;
    nameRoute = nameRoute.slice(-3) + nom.toString();
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind03}>
          <em>
            Состав входящего направления <b>{nameRoute}</b>
          </em>
        </Box>
        <Box sx={styleBind033}>
          <Grid container item xs={12}>
            {HeaderTablBindContent(0.5, "")}
            {HeaderTablBindContent(0.5, "№")}
            {HeaderTablBindContent(2.5, "Наименование")}
            {HeaderTablBindContent(3.5, "Интенсивность(т.е./ч)")}
            {HeaderTablBindContent(2.5, "Интенсивность(%)")}
            {HeaderTablBindContent(2.5, "Время проезда(сек)")}
          </Grid>
        </Box>
        <Grid container sx={{ overflowX: "auto", height: "24vh" }}>
          {StrokaTablTotal()}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Modal open={openSetBind} onClose={handleCloseEnd}>
        <Box sx={styleBind00}>
          <Button sx={styleModalEndBind} onClick={() => handleClose(0)}>
            <b>&#10006;</b>
          </Button>
          {HeaderBind(nameA, nameB, Route, heightImg, masSvg, SvgA, SvgB)}
          <Grid container sx={{ marginTop: "1.25vh", height: "30vh" }}>
            {BindTablFrom(
              kolFrom,
              From,
              hClFrom,
              BindInput,
              masFormFrom,
              SetFrom
            )}
            <Grid item xs={1}></Grid>
            {BindTablIn()}
          </Grid>
          <Grid container sx={{ marginTop: "1vh", height: "28vh" }}>
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              {TablTotal()}
            </Grid>
          </Grid>
          {FooterBind()}
        </Box>
      </Modal>
      {openFormFrom && (
        <MapRouteBindForm
          setOpen={SetOpenFormFrom}
          maskForm={massForm}
          IDX={IDX}
          idxA={props.idxA}
          idxB={props.idxB}
        />
      )}
      {openFormIn && (
        <MapRouteBindForm
          setOpen={SetOpenFormIn}
          maskForm={massForm}
          IDX={IDX}
          idxA={props.idxA}
          idxB={props.idxB}
        />
      )}
    </>
  );
};

export default MapRouteBind;
