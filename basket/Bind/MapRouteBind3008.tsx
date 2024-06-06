import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
//import TextField from "@mui/material/TextField";
//import MenuItem from "@mui/material/MenuItem";

import MapRouteBindFormFrom from "./MapRouteBindFormFrom";

import { StrokaMenuFooterBind } from "./../MapServiceFunctions";
import { HeaderBind, BindInput } from "./../MapServiceFunctions";
import { ArgTablBindContent } from "./../MapServiceFunctions";
import { HeaderTablBindContent, BindTablFrom } from "./../MapServiceFunctions";

import { styleSetImg, styleModalEndBind } from "./../MainMapStyle";
import { styleBind03, styleBind033 } from "./../MainMapStyle";
import { styleBind04, styleBind05 } from "./../MainMapStyle";
//import { styleSetNapr, styleBoxFormNapr } from "./../MainMapStyle";

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
let idxFrom = -1;
let massTotal: any = [];
let beginMassTotal = 0;

let massFrom: Array<number> = [];
let massIn: Array<number> = [];
let massTotPr: Array<number> = [];

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

  const nameA = massroute.vertexes[props.idxA].name;
  const nameB = massroute.vertexes[props.idxB].name;
  const Route = props.reqRoute;

  let heightImg = Math.round(window.innerWidth / 7);
  let widthHeight = heightImg.toString();

  const ReplaceInSvg = (idx: number) => {
    let ch = "";
    let svgPipa = masSvg[idx];
    let vxod = masSvg[idx].indexOf("width=");
    for (let i = 0; i < 100; i++) {
      if (isNaN(Number(svgPipa[vxod + 7 + i]))) break;
      ch = ch + svgPipa[vxod + 7 + i];
    }
    for (let i = 0; i < 6; i++) {
      svgPipa = svgPipa.replace(ch, widthHeight);
    }
    let chh = "";
    let vxodh = masSvg[idx].indexOf("height=");
    for (let i = 0; i < 100; i++) {
      if (isNaN(Number(svgPipa[vxodh + 8 + i]))) break;
      chh = chh + svgPipa[vxodh + 8 + i];
    }
    for (let i = 0; i < 6; i++) {
      svgPipa = svgPipa.replace(chh, widthHeight);
    }
    return svgPipa;
  };

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
          intensTr: 0,
          intensPr: 0,
          time: 0,
        };
        massTotal.push(maskTotal);
        massTotPr.push(0);
      }
    }
    console.log("MapRouteBind: ИНИЦИАЛИЗАЦИЯ", massTotPr);
  }

  if (props.svg && masSvg[0] === "" && masSvg[1] === "") {
    let dat = props.svg;
    masSvg = [];
    for (let key in dat) masSvg.push(dat[key]);
    if (masSvg[0] !== "") masSvg[0] = ReplaceInSvg(0);
    if (masSvg[1] !== "") masSvg[1] = ReplaceInSvg(1);
  }
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
    height: heightImg + window.innerHeight * 0.63,
    bgcolor: "#F0F0F0",
  };

  const handleClose = (mode: number) => {
    oldIdxA = -1;
    oldIdxB = -1;
    props.setOpen(false);
    setOpenSetBind(false);
    props.setSvg(null);
    if (mode && typeof mode === "number") props.func(false, massBind);
  };

  const FooterBind = () => {
    let have = 0;
    for (let i = 0; i < massTotal.length; i++) {
      if (massTotal[i].have) have++;
    }
    return (
      <Grid container sx={{ marginTop: "1vh", height: 27, width: "100%" }}>
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
    idxFrom = idx;
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
          {ArgTablBindContent(4, nr)}
          <Grid item xs={3} sx={{ display: "grid", justifyContent: "center" }}>
            {BindInput(massIn, i, SetIn, 1)}
          </Grid>
          <Grid item xs sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind05} onClick={() => hClFrom(i)}>
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
            {HeaderTablBindContent(4, "Наименование")}
            {HeaderTablBindContent(3, "Интенсивность(%)")}
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
        <Grid item xs={1} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <Button sx={styleBind04} onClick={() => handleCloseTotal(i)}>
            {massTotal[i].nom}
          </Button>
        </Grid>
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].name}
        </Grid>
        <Grid item xs={3} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].intensTr}
        </Grid>

        {/* <Grid item xs={2.5} sx={{ display: "grid", justifyContent: "center" }}>
          {massTotal[i].have && <>{BindInput(massTotPr, i, SetTotPr)}</>}
        </Grid> */}

        {/* <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].intensPr}
        </Grid> */}

        <Grid item xs={2.5} sx={{ display: "grid", justifyContent: "center" }}>
          {BindInput(massTotPr, i, SetTotPr, pusto)}
        </Grid>

        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].time}
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
          <em>Состав направлений</em>
        </Box>
        <Box sx={styleBind033}>
          <Grid container item xs={12}>
            {HeaderTablBindContent(0.5, "")}
            {HeaderTablBindContent(1, "№")}
            {HeaderTablBindContent(2.5, "Наименование")}
            {HeaderTablBindContent(3, "Интенсивность(т.е./ч)")}
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

  const SetFrom = (mode: number, valueInp: number) => {
    massFrom[mode] = valueInp;
  };

  const SetIn = (mode: number, valueInp: number) => {
    massIn[mode] = valueInp;
  };

  const SetTotPr = (mode: number, valueInp: number) => {
    massTotPr[mode] = valueInp;
    massTotal[mode].intensPr = valueInp;
  };

  let From = ("00" + massroute.vertexes[props.idxA].id).slice(-3);

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
          <MapRouteBindFormFrom setOpen={setOpenFormFrom} idx={idxFrom} />
        )}
      </>
    </Modal>
  );
};

export default MapRouteBind;

// const InputDirect = (nomInn: number) => {
//   const handleKey = (event: any) => {
//     if (event.key === "Enter") event.preventDefault();
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrency(Number(event.target.value));
//     let nomFrom = Number(event.target.value) + 1;
//     let nomIn = nomInn + 1;
//     //console.log("###:", nomIn, nomFrom);
//     let ch = 0;
//     let nomer = -1;
//     let nmFrom = massTotal[0].name.slice(0, 3) + nomFrom.toString();
//     let nmIn = massTotal[0].name.slice(5, 8) + nomIn.toString();
//     let nm = nmFrom + "/" + nmIn;
//     console.log("@@@:", nmFrom, nmIn);
//     for (let i = 0; i < massTotal.length; i++) {
//       if (massTotal[i].name === nm) nomer = ch;
//       ch++;
//     }
//     massTotal[nomer].have = true;
//   };

//   let dat: Array<number> = [];
//   for (let i = 0; i < kolFazFrom; i++) dat.push(i + 1);
//   let massKey = [];
//   let massDat: any[] = [];
//   const currencies: any = [];
//   for (let key in dat) {
//     massKey.push(key);
//     massDat.push(dat[key]);
//   }
//   for (let i = 0; i < massKey.length; i++) {
//     let maskCurrencies = {
//       value: "",
//       label: "",
//     };
//     maskCurrencies.value = massKey[i];
//     maskCurrencies.label = massDat[i];
//     currencies.push(maskCurrencies);
//   }

//   const [currency, setCurrency] = React.useState(0);

//   return (
//     <Box sx={styleSetNapr}>
//       <Box component="form" sx={styleBoxFormNapr}>
//         <TextField
//           select
//           size="small"
//           onKeyPress={handleKey} //отключение Enter
//           value={currency}
//           onChange={handleChange}
//           InputProps={{ disableUnderline: true, style: { fontSize: 12 } }}
//           variant="standard"
//           color="secondary"
//         >
//           {currencies.map((option: any) => (
//             <MenuItem
//               key={option.value}
//               value={option.value}
//               sx={{ fontSize: 14 }}
//             >
//               {option.label}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Box>
//     </Box>
//   );
// };
