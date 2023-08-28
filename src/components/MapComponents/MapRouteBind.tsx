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
import { HeaderBindMiddle, ArgTablBindContent } from "./../MapServiceFunctions";
import { HeaderTablBindContent } from "./../MapServiceFunctions";

import { styleSetImg, styleModalEndBind } from "./../MainMapStyle";
import { styleBind03, styleBind033 } from "./../MainMapStyle";
import { styleBind04, styleBind05 } from "./../MainMapStyle";
//import { styleSetNapr, styleBoxFormNapr } from "./../MainMapStyle";

let massBind = [0, 0];
let haveSvgA = true;
let haveSvgB = true;
let masSvg = ["", ""];

let kolFazFrom = 7;
let kolFazIn = 4;
let massFazFrom: Array<number> = [];
let massFazIn: Array<number> = [];
let oldIdxA = -1;
let oldIdxB = -1;
let idxFrom = -1;
let massTotal: any = [];
let beginMassTotal = 0;

const MapRouteBind = (props: {
  setOpen: any;
  svg: any;
  setSvg: any;
  idxA: number;
  idxB: number;
  reqRoute: any;
  func: any;
}) => {
  console.log("MapRouteBind:", props.reqRoute);

  //== Piece of Redux ======================================
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  //========================================================
  const [openSetBind, setOpenSetBind] = React.useState(true);
  const [openFormFrom, setOpenFormFrom] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);

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
    for (let i = 0; i < kolFazFrom; i++) massFazFrom.push(-1);
    for (let i = 0; i < kolFazIn; i++) massFazIn.push(-1);
    if (props.svg) {
      let dat = props.svg;
      masSvg = [];
      for (let key in dat) masSvg.push(dat[key]);
    }
    haveSvgA = true;
    haveSvgB = true;
    if (!massroute.vertexes[props.idxA].area) {
      haveSvgA = false;
      massBind[0] = 0;
    }
    if (!massroute.vertexes[props.idxB].area) {
      haveSvgB = false;
      massBind[1] = 0;
    }
    if (masSvg[0] !== "") masSvg[0] = ReplaceInSvg(0);
    if (masSvg[1] !== "") masSvg[1] = ReplaceInSvg(1);
    massTotal = [];

    let nom = 1;
    for (let j = 0; j < kolFazIn; j++) {
      for (let i = 0; i < kolFazFrom; i++) {
        let nameFrom = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
        nameFrom += (i + 1).toString();
        let nameIn = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
        nameIn += (j + 1).toString();
        let maskTotal: any = {
          have: false,
          nom: nom++,
          name: nameFrom + "/" + nameIn,
          intensTr: 0,
          intensPr: 0,
          time: 0,
        };
        massTotal.push(maskTotal);
      }
    }
    console.log("MapRouteBind: ИНИЦИАЛИЗАЦИЯ", massTotal);
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

  const ExampleComponent = (idx: number) => {
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: masSvg[idx] }} />
      </div>
    );
  };

  function AppIconAsdu() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={heightImg - 10}
        height={heightImg - 10}
        version="1"
        viewBox="0 0 91 54"
      >
        <path
          d="M425 513C81 440-106 190 91 68 266-41 640 15 819 176c154 139 110 292-98 341-73 17-208 15-296-4zm270-14c208-38 257-178 108-308C676 79 413 8 240 40 29 78-30 199 100 329c131 131 396 207 595 170z"
          transform="matrix(.1 0 0 -.1 0 54)"
        ></path>
        <path
          d="M425 451c-11-18-5-20 74-30 108-14 157-56 154-133-2-52-41-120-73-129-44-12-110-10-110 4 1 6 7 62 14 122 7 61 12 113 10 117-4 6-150 1-191-8-45-9-61-40-74-150-10-90-14-104-30-104-12 0-19-7-19-20 0-11 7-20 15-20s15-7 15-15c0-11 11-15 35-15 22 0 38 6 41 15 4 9 19 15 35 15 22 0 29 5 29 20s-7 20-25 20c-29 0-31 10-14 127 12 82 31 113 71 113 18 0 20-5 15-42-4-24-9-74-12-113-3-38-8-87-11-107l-6-38h46c34 0 46 4 46 15s12 15 48 15c97 0 195 47 227 110 59 115-44 225-223 237-56 4-81 2-87-6z"
          transform="matrix(.1 0 0 -.1 0 54)"
        ></path>
      </svg>
    );
  }

  const HeaderBind = () => {
    let nameA = massroute.vertexes[props.idxA].name;
    let nameB = massroute.vertexes[props.idxB].name;
    return (
      <Grid container sx={{ marginTop: "1vh", height: heightImg }}>
        <Grid item xs={0.25}></Grid>
        {!haveSvgA && <Grid item xs={2}></Grid>}
        {haveSvgA && (
          <Grid item xs={2} sx={styleSetImg}>
            {masSvg[0] === "" && <>{AppIconAsdu()}</>}
            {masSvg[0] !== "" && <>{ExampleComponent(0)}</>}
          </Grid>
        )}
        {HeaderBindMiddle(props.reqRoute, nameA, nameB)}
        {haveSvgB && (
          <Grid item xs={2} sx={styleSetImg}>
            {masSvg[1] === "" && <>{AppIconAsdu()}</>}
            {masSvg[1] !== "" && <>{ExampleComponent(1)}</>}
          </Grid>
        )}
        <Grid item xs={0.25}></Grid>
      </Grid>
    );
  };

  const FooterBind = () => {
    let have = 0
    for (let i = 0; i < massTotal.length; i++) {
      if (massTotal[i].have) have++
    }
    return (
      <Grid container sx={{ marginTop: "1vh", height: 27, width: "100%" }}>
        <Grid item xs={4.5}></Grid>
        <Grid item xs={3} sx={{ border: 0 }}>
          {(massBind[0] && massBind[1]) ||
          (!haveSvgA && massBind[1]) ||
          (!haveSvgB && massBind[0]) ? (
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
        {!haveSvgB && <Grid item xs={4}></Grid>}
      </Grid>
    );
  };

  const handleCloseTabFrom = (idx: number) => {
    console.log("Переход в форму просмотра", idx);
    idxFrom = idx;
    setOpenFormFrom(true);
  };

  const StrokaTablFrom = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxA].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolFazFrom; i++) {
      let nr = nameRoute + (i + 1).toString();
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          {ArgTablBindContent(1, i + 1)}
          {ArgTablBindContent(4, nr)}
          {ArgTablBindContent(3, 0)}
          <Grid item xs={4} sx={{ ineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind05} onClick={() => handleCloseTabFrom(i)}>
              просмотр/изменение
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const TablFrom = () => {
    return (
      <Grid item xs={5.5} sx={styleSetImg}>
        <Box sx={styleBind03}>
          <em>Исходящие направления</em>
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
          {StrokaTablFrom()}
        </Grid>
      </Grid>
    );
  };

  const handleCloseIn = (i: number) => {
    beginMassTotal = i * kolFazFrom;
    setTrigger(!trigger);
  };

  const StrokaTablIn = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxB].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolFazIn; i++) {
      let nr = nameRoute + (i + 1).toString();
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid item xs={1} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind04} onClick={() => handleCloseIn(i)}>
              {i + 1}
            </Button>
          </Grid>
          {ArgTablBindContent(4, nr)}
          {ArgTablBindContent(3, 0)}
          <Grid item xs sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind05} onClick={() => handleCloseTabFrom(i)}>
              просмотр/изменение
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  const TablIn = () => {
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
  }

  const TablTotalContent = (idx: number) => {
    let i = beginMassTotal + idx;
    let metka = massTotal[i].have ? "✔" : "";
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
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].intensTr}
        </Grid>
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].intensPr}
        </Grid>
        <Grid item xs={2.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {massTotal[i].time}
        </Grid>
      </>
    );
  };

  const StrokaTablTotal = () => {
    let resStr: any = [];
    // let nom = 0;
    // for (let i = 0; i < kolFazFrom; i++) {
    //   for (let j = 0; j < kolFazIn; j++) {
    //     let nameFrom = ("00" + massroute.vertexes[props.idxA].id).slice(-3);
    //     nameFrom += (i + 1).toString();
    //     let nameIn = ("00" + massroute.vertexes[props.idxB].id).slice(-3);
    //     nameIn += (j + 1).toString();
    //     let nameRoute = nameFrom + "/" + nameIn;
    //     resStr.push(
    //       <Grid key={nom} container item xs={12} sx={{ fontSize: 14 }}>
    //         {TablTotalContent(nom, nameRoute)}
    //       </Grid>
    //     );
    //     nom++;
    //   }
    // }
    for (let i = 0; i < kolFazFrom; i++) {
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

  return (
    <Modal open={openSetBind} onClose={handleClose}>
      <>
        <Box sx={styleBind00}>
          <Button sx={styleModalEndBind} onClick={() => handleClose(0)}>
            <b>&#10006;</b>
          </Button>
          {HeaderBind()}
          <Grid container sx={{ marginTop: "1vh", height: "28vh" }}>
            {TablFrom()}
            <Grid item xs={1}></Grid>
            {TablIn()}
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
