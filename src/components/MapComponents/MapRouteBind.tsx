import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import TextField from "@mui/material/TextField";
//import MenuItem from "@mui/material/MenuItem";

import { Directions } from "./../../App"; // интерфейс massForm

import MapRouteBindFormFrom from "./MapRouteBindFormFrom";

import { StrokaMenuFooterBind, ReplaceInSvg } from "./../MapServiceFunctions";
import { HeaderBind, BindInput } from "./../MapServiceFunctions";
import { ArgTablBindContent } from "./../MapServiceFunctions";
import { HeaderTablBindContent, BindTablFrom } from "./../MapServiceFunctions";

import { styleSetImg, styleModalEndBind } from "./../MainMapStyle";
import { styleBind03, styleBind033 } from "./../MainMapStyle";
import { styleBind01, styleBind04, styleBind05 } from "./../MainMapStyle";

let massBind = [0, 0];
let SvgA = true;
let SvgB = true;
let masSvg = ["", ""];

let kolFrom = 7;
let kolIn = 4;
let massFazFrom: Array<number> = [];
let massFazIn: Array<number> = [];
let oldIdxA = -1;
let oldIdxB = -1;
let massTotal: any = [];
let beginMassTotal = 0;

let massFrom: Array<number> = [];
let massIn: Array<number> = [];
let massTotPr: Array<number> = [];
let massTotTrFrom: Array<number> = [];
let massTotTrIn: Array<number> = [];
let massTotTm: Array<number> = [];

let nameA = "";
let nameB = "";
let Route: any = null;
let From = "";

let maskForm: Directions = {
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
};

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
};

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
  const [trigger, setTrigger] = React.useState(false);

  const handleClose = (mode: number) => {
    console.log("handleClose:", mode);
    oldIdxA = -1;
    oldIdxB = -1;
    props.setOpen(false);
    setOpenSetBind(false);
    props.setSvg(null);
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

  //=== инициализация ======================================
  if (oldIdxA !== props.idxA || oldIdxB !== props.idxB) {
    massBind = [0, 0];
    oldIdxA = props.idxA;
    oldIdxB = props.idxB;
    masSvg = ["", ""];
    massFazFrom = [];
    for (let i = 0; i < kolFrom; i++) massFazFrom.push(-1);
    for (let i = 0; i < kolIn; i++) massFazIn.push(-1);
    SvgA = true;
    SvgB = true;
    if (!massroute.vertexes[props.idxA].area) {
      SvgA = false;
      massBind[0] = 0;
    }
    if (!massroute.vertexes[props.idxB].area) {
      SvgB = false;
      massBind[1] = 0;
    }
    massFrom = [0, 0, 0, 0, 0, 0, 0];
    massIn = [0, 0, 0, 0, 0, 0, 0];
    massTotPr = [];
    massTotTrFrom = [];
    massTotTrIn = [];
    massTotTm = [];
    massTotal = [];
    let nom = 1;
    for (let j = 0; j < kolIn; j++) {
      for (let i = 0; i < kolFrom; i++) {
        let nameFrom = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
        nameFrom += (i + 1).toString();
        let nameIn = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
        nameIn += (j + 1).toString();
        let maskTotal: any = {
          have: false,
          nom: nom++,
          name: nameIn + "/" + nameFrom,
          intensTrFrom: 0,
          intensTrIn: 0,
          intensPr: 0,
          time: SEC,
        };
        massTotal.push(maskTotal);
        massTotTrFrom.push(0);
        massTotTrIn.push(0);
        massTotPr.push(0);
        massTotTm.push(SEC);
      }
    }
  }

  React.useMemo(() => {
    if (props.svg && masSvg[0] === "" && masSvg[1] === "") {
      console.log("Пришли картинки!!!");
      let dat = props.svg;
      masSvg = [];
      for (let key in dat) masSvg.push(dat[key]);
      if (masSvg[0] !== "") masSvg[0] = ReplaceInSvg(masSvg, widthHeight, 0);
      if (masSvg[1] !== "") masSvg[1] = ReplaceInSvg(masSvg, widthHeight, 1);
    }
  }, [props.svg, widthHeight]);
  //========================================================
  const styleBind00 = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    border: "3px solid #000",
    borderColor: "#F0F0F0",
    borderRadius: 2,
    width: "98%",
    height: heightImg + window.innerHeight * 0.645,
    bgcolor: "#F0F0F0",
  };
  //=== Функции - обработчики ==============================
  const SetFrom = (mode: number, valueInp: number) => {
    massFrom[mode] = valueInp;
    for (let i = 0; i < kolIn; i++) {
      massTotal[kolFrom * i + mode].intensTrFrom = valueInp;
      massTotTrFrom[kolFrom * i + mode] = valueInp;
    }
    setTrigger(!trigger);
  };

  const SetIn = (mode: number, valueInp: number) => {
    massIn[mode] = valueInp;
    for (let i = 0; i < kolFrom; i++) {
      massTotal[mode * kolFrom + i].intensTrIn = valueInp;
      massTotTrIn[mode * kolFrom + i] = valueInp;
    }
    setTrigger(!trigger);
  };

  const SetTotTrFrom = (mode: number, valueInp: number) => {
    massTotTrFrom[mode] = valueInp;
    massTotal[mode].intensTrFrom = valueInp;
  };

  const SetTotTrIn = (mode: number, valueInp: number) => {
    massTotTrIn[mode] = valueInp;
    massTotal[mode].intensTrIn = valueInp;
  };

  const SetTotPr = (mode: number, valueInp: number) => {
    massTotPr[mode] = valueInp;
    massTotal[mode].intensPr = valueInp;
  };

  const SetTotTm = (mode: number, valueInp: number) => {
    massTotTm[mode] = valueInp;
    massTotal[mode].time = valueInp;
  };
  //========================================================
  const FooterBind = () => {
    let have = 0;
    for (let i = 0; i < massTotal.length; i++) {
      if (massTotal[i].have) have++;
    }
    return (
      <Grid container sx={{ marginTop: "2vh", height: 27, width: "100%" }}>
        <Grid item xs={4.5}></Grid>
        <Grid item xs={3} sx={{ border: 0 }}>
          {have ? (
            <Box sx={{ textAlign: "center" }}>
              {StrokaMenuFooterBind("Отмена", 0, handleClose)}
              {StrokaMenuFooterBind("Привязываем", 1, handleClose)}
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

  const hClFrom = (idx: number) => {
    console.log("Переход в форму просмотра", idx);
    massForm = JSON.parse(JSON.stringify(maskForm));
    //============ потом исправить
    massForm.name = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
    massForm.name += (idx + 1).toString();
    for (let i = 0; i < 8; i++) massForm.phases.push(-1);
    setOpenFormFrom(true);
  };

  const hClIn = (idx: number) => {
    console.log("Переход в форму просмотра", idx);
    massForm = JSON.parse(JSON.stringify(maskForm));
    //============ потом исправить
    massForm.name = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
    massForm.name += (idx + 1).toString();
    for (let i = 0; i < 8; i++) massForm.phases.push(-1);
    setOpenFormFrom(true);
  };

  const handleCloseIn = (i: number) => {
    beginMassTotal = i * kolFrom;
    setTrigger(!trigger);
  };

  const StrokaTablIn = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxB].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolIn; i++) {
      let nr = nameRoute + (i + 1).toString();
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid item xs={1} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind04} onClick={() => handleCloseIn(i)}>
              {i + 1}
            </Button>
          </Grid>
          {ArgTablBindContent(3, nr)}
          <Grid item xs={4} sx={{ display: "grid", justifyContent: "center" }}>
            {BindInput(massIn, i, SetIn, 1, 10000)}
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
        <Grid container sx={{ height: "24vh" }}>
          {StrokaTablIn()}
        </Grid>
      </Grid>
    );
  };

  const handleCloseTotal = (idx: number) => {
    massTotal[idx].have = !massTotal[idx].have;
    setTrigger(!trigger);
  };

  const TablTotalContent = (idx: number) => {
    let i = beginMassTotal + idx;
    let metka = massTotal[i].have ? "✔" : "";
    let pusto = massTotal[i].have ? 1 : 0;

    return (
      <>
        <Grid item xs={0.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {metka}
        </Grid>
        <Grid item xs={0.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <Button sx={styleBind04} onClick={() => handleCloseTotal(i)}>
            {massTotal[i].nom}
          </Button>
        </Grid>
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].name}
        </Grid>
        <Grid item xs={3.5}>
          <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
            <Grid item xs={6} sx={styleBind01}>
              <Box sx={{ display: "flex" }}>
                {BindInput(massTotTrFrom, i, SetTotTrFrom, pusto, 10000)}
                {pusto !== 0 && <>&nbsp;исх</>}
              </Box>
            </Grid>
            <Grid item xs={6} sx={styleBind01}>
              <Box sx={{ display: "flex" }}>
                {BindInput(massTotTrIn, i, SetTotTrIn, pusto, 10000)}
                {pusto !== 0 && <>&nbsp;вх</>}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2.5} sx={styleBind01}>
          {BindInput(massTotPr, i, SetTotPr, pusto, 100)}
        </Grid>
        <Grid item xs={2.5} sx={styleBind01}>
          {BindInput(massTotTm, i, SetTotTm, pusto, 10000)}
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
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind03}>
          <em>
            Состав входящего направления <b>{beginMassTotal / kolFrom + 1}</b>
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
    <Modal open={openSetBind} onClose={handleClose}>
      <>
        <Box sx={styleBind00}>
          <Button sx={styleModalEndBind} onClick={() => handleClose(0)}>
            <b>&#10006;</b>
          </Button>
          {HeaderBind(nameA, nameB, Route, heightImg, masSvg, SvgA, SvgB)}
          <Grid container sx={{ marginTop: "1vh", height: "28vh" }}>
            {BindTablFrom(kolFrom, From, hClFrom, BindInput, massFrom, SetFrom)}
            <Grid item xs={1}></Grid>
            {BindTablIn()}
          </Grid>
          <Grid container sx={{ marginTop: "1vh", height: "28vh" }}>
            <Grid item xs={2} sx={{ border: 0 }}></Grid>
            <Grid item xs={8} sx={{ border: 0 }}>
              {TablTotal()}
            </Grid>
          </Grid>
          {FooterBind()}
        </Box>
        {openFormFrom && (
          <MapRouteBindFormFrom setOpen={setOpenFormFrom} maskForm={massForm} />
        )}
      </>
    </Modal>
  );
};

export default MapRouteBind;
