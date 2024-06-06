import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { statsaveCreate } from "./../../redux/actions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import MapWindViewGraf from "./MapPKComponents/MapWindViewGraf";

import { Directions } from "./../../App"; // интерфейс massForm

import MapRouteBindForm from "./MapRouteBindForm";

import { StrokaMenuFooterBind, ReplaceInSvg } from "./../MapServiceFunctions";
import { HeaderBind, BindInput, MaskFormWay } from "./../MapServiceFunctions";
import { HeaderTablBindContent, BindTablFrom } from "./../MapServiceFunctions";
import { BadExit, KnopProps } from "./../MapServiceFunctions";

import { MODE, debug } from "./../MainMapGl";
import { KolFrom, KolIn, INCOM, OUTGO, optionsMiniGraf } from "./../MapConst";

import { styleSetImg, styleModalEndBind } from "./../MainMapStyle";
import { styleBind042, MakeStyleBind00, styleBind043 } from "./../MainMapStyle";
import { styleBind03, styleBind033, styleBind041 } from "./../MainMapStyle";
import { styleBind01, styleBind04, styleBind05 } from "./../MainMapStyle";
import { styleBind06, styleBind07, styleBind08 } from "./../MainMapStyle";
import { styleBind0333 } from "./../MainMapStyle";

import { Chart as ChartJS, CategoryScale } from "chart.js";
import { LinearScale, PointElement } from "chart.js";
import { LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataGl {
  labels: string[];
  datasets: Datasets[];
}

interface Datasets {
  label: string;
  data: number[];
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  pointRadius: number;
}

let massBind = [0, 0];
let SvgA = true;
let SvgB = true;
let masSvg = ["", ""];

let kolFrom = KolFrom;
let kolIn = KolIn;
let oldIdxA = -1;
let oldIdxB = -1;
let IDX: number = -1;
let idxGraf: number = -1;

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
let Route: any = {
  dlRoute: 0,
  tmRoute: 0,
  mode: 0,
};
let From = "";
let HAVE = 0;
let timeInterval = 80;

let maskForm: Directions = JSON.parse(JSON.stringify(MaskFormWay()));
let massForm: Directions = JSON.parse(JSON.stringify(MaskFormWay()));

const MapRouteBind = (props: {
  setOpen: any; //
  svg: any;
  idxA: number;
  idxB: number;
  reqRoute: any;
  func: any; // функция возврата в родительский компонент
  mode: number; // режим открытия RouteBind
}) => {
  //console.log('MapRouteBind:', props.mode, props.reqRoute);
  //== Piece of Redux ======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  let datestat = useSelector((state: any) => {
    const { statsaveReducer } = state;
    return statsaveReducer.datestat;
  });
  const dispatch = useDispatch();
  //========================================================
  const [openSetBind, setOpenSetBind] = React.useState(true);
  const [openFormFrom, setOpenFormFrom] = React.useState(false);
  const [openFormIn, setOpenFormIn] = React.useState(false);
  const [openGraf, setOpenGraf] = React.useState(false);
  const [badExit, setBadExit] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const SEC = props.reqRoute.tmRoute;
  let heightImg = Math.round(window.innerWidth / 7);
  let widthHeight = heightImg.toString();
  const styleBind00 = MakeStyleBind00(heightImg); // стиль для главного мод.окна
  const labels: string[] = [];
  let data: DataGl = {
    labels,
    datasets: [
      {
        label: "Вх.поток",
        data: [],
        borderWidth: 1,
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: 1,
      },
      {
        label: "Вых.поток",
        data: [],
        borderWidth: 1,
        borderColor: "orange",
        backgroundColor: "orange",
        pointRadius: 1,
      },
      {
        label: "Очередь",
        data: [],
        borderWidth: 1,
        borderColor: "red",
        backgroundColor: "red",
        pointRadius: 1,
      },
    ],
  };

  const ReplaceSizeImg = () => {
    if (masSvg[0] !== "") masSvg[0] = ReplaceInSvg(masSvg[0], widthHeight);
    if (masSvg[1] !== "") masSvg[1] = ReplaceInSvg(masSvg[1], widthHeight);
  };

  const CloseEnd = () => {
    oldIdxA = -1;
    oldIdxB = -1;
    props.setOpen(false);
    setOpenSetBind(false);
    //props.setSvg(null);
    if (MODE === "2") {
      datestat.needMenuForm = false; //  не выдавать меню форм
      dispatch(statsaveCreate(datestat));
    }
  };

  const handleCloseBadExit = (mode: boolean) => {
    setBadExit(false);
    if (mode) {
      props.func(false, massBind); // выход без сохранения
      CloseEnd();
    }
  };

  const handleCloseBad = () => {
    HAVE && setBadExit(true);
    if (!HAVE) {
      props.func(false, massBind);
      CloseEnd();
    }
  };

  const handleCloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleCloseBad();
  };

  const handleCloseGood = () => {
    props.func(true, massBind);
    CloseEnd();
  };

  if (props.idxA < 0 && props.idxA < 0) {
    console.log("Косяк!!!");
  } else {
    nameA = "[id" + massroute.vertexes[props.idxA].id + "] ";
    nameA += massroute.vertexes[props.idxA].name;
    nameB = "[id" + massroute.vertexes[props.idxB].id + "] ";
    nameB += massroute.vertexes[props.idxB].name;
    From = massroute.vertexes[props.idxA].id;
  }

  //=== инициализация ======================================
  if (oldIdxA !== props.idxA || oldIdxB !== props.idxB) {
    massBind = [1, 2];
    HAVE = 0;
    oldIdxA = props.idxA;
    oldIdxB = props.idxB;
    Route.dlRoute = props.reqRoute.dlRoute;
    Route.tmRoute = props.reqRoute.tmRoute;
    Route.mode = props.mode;
    masSvg = ["", ""];
    if (debug) {
      masSvg[0] = datestat.exampleImg1;
      masSvg[1] = datestat.exampleImg2;
      ReplaceSizeImg();
    }
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
      let nameIn = INCOM + (j + 1).toString();
      masFormIn.push(JSON.parse(JSON.stringify(maskForm)));
      masFormIn[j].name = nameIn;
      for (let i = 0; i < kolFrom; i++) {
        let nameFrom = OUTGO + (i + 1).toString();
        let maskTotal: any = {
          have: false,
          nom: nom++,
          name: nameFrom + "/" + nameIn,
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
      masFormFrom[i].name = OUTGO + (i + 1).toString();
    }
  }
  //=== Ожидания получения изображений перекрёстков ========
  if (props.svg && masSvg[0] === "" && masSvg[1] === "") {
    let dat = props.svg;
    masSvg = [];
    for (let key in dat) masSvg.push(dat[key]);
    ReplaceSizeImg();
  }
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

  const ReCalcIntensFl = () => {
    let sumIntensTrIn = 0;
    for (let i = 0; i < kolFrom; i++) {
      if (massTotal[beginMassTotal + i].have)
        sumIntensTrIn += massTotal[beginMassTotal + i].intensTrIn;
    }
    masFormIn[beginMassTotal / kolFrom].intensFl =
      masFormIn[beginMassTotal / kolFrom].intensTr - sumIntensTrIn;
  };

  const SetFrom = (mode: number, valueInp: number) => {
    HAVE++
    masFormFrom[mode].intensTr = valueInp; // из левой верхней таблицы
    for (let i = 0; i < kolIn; i++) {
      massTotal[kolFrom * i + mode].intensTrFrom = valueInp;
      massTotTrFrom[kolFrom * i + mode] = valueInp;
    }
    setTrigger(!trigger);
  };

  const SetIn = (mode: number, valueInp: number) => {
    HAVE++
    masFormIn[mode].intensTr = valueInp; // из правой верхней таблицы
    masFormIn[mode].edited = true;
    ReCalcIntensFl();
    setTrigger(!trigger);
  };

  const SetTotTrIn = (mode: number, valueInp: number) => {
    massTotTrIn[mode] = valueInp; // из нижней таблицы
    massTotal[mode].intensTrIn = valueInp;
    ReCalcIntensTr();
    ReCalcIntensFl();
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
      HAVE++;
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
      HAVE++;
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
    massForm.name = massroute.vertexes[props.idxA].id.toString() + ".";
    massForm.name += (idx + 1).toString();
    for (let i = 0; i < 8; i++) massForm.phases.push(-1);
    IDX = idx;
    setOpenFormFrom(true);
  };

  const hClIn = (idx: number) => {
    massForm = JSON.parse(JSON.stringify(masFormIn[idx]));
    //============ потом исправить
    massForm.name = massroute.vertexes[props.idxB].id.toString() + ".";
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
    ReCalcIntensFl();
    setTrigger(!trigger);
  };

  const ClickBlok = (idx: number) => {
    idxGraf = idx;
    setOpenGraf(true);
  };
  //========================================================
  const FooterBind = () => {
    let have = 0;
    for (let i = 0; i < massTotal.length; i++) {
      if (massTotal[i].have) have++;
    }
    HAVE = HAVE + have;
    let saveTitle = props.mode ? "Сохранение изменений" : "Сохранение связи";
    return (
      <Grid container sx={{ marginTop: "2vh", height: 27, width: "100%" }}>
        <Grid item xs={3.5}></Grid>
        <Grid item xs={5} sx={{ border: 0 }}>
          {HAVE ? (
            <Box sx={{ textAlign: "center" }}>
              {StrokaMenuFooterBind("Отмена", 0, handleCloseBad)}
              {StrokaMenuFooterBind(saveTitle, 1, handleCloseGood)}
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              {StrokaMenuFooterBind("Отмена", 0, handleCloseBad)}
            </Box>
          )}
        </Grid>
        {!SvgB && <Grid item xs={4}></Grid>}
      </Grid>
    );
  };

  const OutputProps = (xss: number, rec: any) => {
    return (
      <Grid item xs={xss} sx={{ lineHeight: "3vh", textAlign: "center" }}>
        {rec}
      </Grid>
    );
  };

  const StrokaTablIn = () => {
    let resStr = [];
    let knopka = "просмотр/изменение";
    for (let i = 0; i < kolIn; i++) {
      let nr = INCOM + (i + 1).toString();
      let illum = beginMassTotal / kolFrom === i ? styleBind042 : styleBind041;
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          {OutputProps(1, i + 1)}
          {OutputProps(3, KnopProps(illum, handleCloseIn, nr, i))}
          <Grid item xs={4} sx={{ display: "grid", justifyContent: "center" }}>
            {BindInput(masFormIn[i].intensTr, i, SetIn, 1, 10000)}
          </Grid>
          {OutputProps(4, KnopProps(styleBind05, hClIn, knopka, i))}
        </Grid>
      );
    }
    return resStr;
  };

  const BindTablIn = () => {
    let nameRoute = massroute.vertexes[props.idxB].id;
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind0333}>
          <Box sx={styleBind03}>
            <em>
              Входящие направления <b>{nameRoute}</b>
            </em>
          </Box>
          <Box sx={styleBind033}>
            <Grid container item xs={12}>
              {HeaderTablBindContent(1, "№")}
              {HeaderTablBindContent(3, "Наименование")}
              {HeaderTablBindContent(4, "Интенсивность(т.е./ч)")}
              {HeaderTablBindContent(4, "Свойства")}
            </Grid>
          </Box>
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
    let illum = massTotal[i].have ? styleBind043 : styleBind04;
    let pusto = massTotal[i].have ? 1 : 0;
    if (pusto) {
      if (massTotTrFrom[i] && massTotTrIn[i] > 0 && !massTotal[i].editIntensPr)
        massTotPr[i] = Math.round((massTotTrIn[i] * 100) / massTotTrFrom[i]);
    }

    return (
      <>
        {OutputProps(0.5, <b>{metka}</b>)}
        {OutputProps(0.5, KnopProps(illum, handleCloseTotal, idx + 1, i))}
        {OutputProps(2.5, <b>{massTotal[i].name}</b>)}
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
    let nameRoute = massroute.vertexes[props.idxB].id + "." + nom.toString();
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind0333}>
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
        </Box>
        <Grid container sx={{ overflowX: "auto", height: "24vh" }}>
          {StrokaTablTotal()}
        </Grid>
      </Grid>
    );
  };

  const PointsGraf00 = () => {
    while (labels.length > 0) labels.pop(); // labels = [];
    for (let i = 0; i < timeInterval; i++) labels.push(i.toString());
    //for (let i = 0; i < timeInterval; i++) labels.push(i.toString());
    // let int = 0;
    // //график прямого
    // let datas = [];
    // // for (let i = 0; i < pointer[namer].length; i++) {
    // //   datas.push(pointer[namer][i].Value[0]);
    // // }
    // if (pointer[namer].length !== 0)
    //   int = pointer[namer][pointer[namer].length - 1].Value[0];
    // datas.push(int);
    // for (let i = 0; i < pointer[namer].length - 1; i++) {
    //   int = 0;
    //   if (pointer[namer].length !== 0) int = pointer[namer][i].Value[0];
    //   datas.push(int);
    // }
    // data.datasets[0].data = datas;
    // //график обратного
    // datas = [];
    // // for (let i = 0; i < pointer[namer].length; i++) {
    // //   datas.push(pointer[namer][i].Value[1]);
    // // }
    // if (pointer[namer].length !== 0)
    //   int = pointer[namer][pointer[namer].length - 1].Value[1];
    // datas.push(int);
    // for (let i = 0; i < pointer[namer].length - 1; i++) {
    //   int = 0;
    //   if (pointer[namer].length !== 0) int = pointer[namer][i].Value[1];
    //   datas.push(int);
    // }
    // data.datasets[1].data = datas;

    return <Line options={optionsMiniGraf} data={data} />;
  };

  const OutputGraf = () => {
    let nom = beginMassTotal / kolFrom + 1;
    let nameRoute = massroute.vertexes[props.idxB].id + "." + nom.toString();
    return (
      <Box sx={styleBind06} onClick={() => ClickBlok(nom)}>
        <Grid container>
          <Grid item xs={0.3} sx={{}}>
            <Box sx={styleBind07}>
              <b>Tе:Тцикла*C</b>
            </Box>
          </Grid>
          <Grid item xs={11.7} sx={{ textAlign: "center" }}>
            Изменение потока на направлении <b>{nameRoute}</b>
            <Box sx={styleBind08}>{PointsGraf00()}</Box>
          </Grid>
        </Grid>
        <Box sx={{ marginTop: -0.3, textAlign: "center" }}>
          <b>Тцикла</b>
        </Box>
      </Box>
    );
  };

  let hBD = props.mode === 2 ? true : false;

  return (
    <>
      <Modal open={openSetBind} onClose={handleCloseEnd} hideBackdrop={hBD}>
        <Box sx={styleBind00}>
          <Button sx={styleModalEndBind} onClick={() => handleCloseBad()}>
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
            <Grid item xs={8}>
              {TablTotal()}
            </Grid>
            <Grid item xs={0.05}></Grid>
            <Grid item xs sx={styleSetImg}>
              {OutputGraf()}
            </Grid>
          </Grid>
          {FooterBind()}
        </Box>
      </Modal>
      {openGraf && (
        <MapWindViewGraf
          close={setOpenGraf}
          idx={idxGraf - 1}
          name={massroute.vertexes[props.idxB].id}
        />
      )}
      {openFormFrom && (
        <MapRouteBindForm
          setOpen={SetOpenFormFrom}
          maskForm={massForm}
          IDX={IDX}
          idxA={props.idxA}
          idxB={props.idxB}
          kolDir={kolFrom}
        />
      )}
      {openFormIn && (
        <MapRouteBindForm
          setOpen={SetOpenFormIn}
          maskForm={massForm}
          IDX={IDX}
          idxA={props.idxA}
          idxB={props.idxB}
          kolDir={kolIn}
        />
      )}
      {badExit && <>{BadExit(badExit, handleCloseBadExit)}</>}
    </>
  );
};

export default MapRouteBind;
