import * as React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";

import MapRouteBindFormFrom from "./MapRouteBindFormFrom";

import { StrokaMenuFooterBind } from "./../MapServiceFunctions";

import { styleSetImg, styleBind02, styleModalEndBind } from "./../MainMapStyle";
import { styleBind03, styleBind033, styleBind04 } from "./../MainMapStyle";
import { styleBind05 } from "./../MainMapStyle";

let massBind = [0, 0];
let haveSvgA = true;
let haveSvgB = true;

let masSvg = ["", ""];
let kolFaz = 4;
let massFazFrom: Array<number> = [];
let massFazIn: Array<number> = [];
let oldIdxA = -1;
let oldIdxB = -1;
let idxFrom = -1;

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
    console.log("MapRouteBind: ИНИЦИАЛИЗАЦИЯ");
    massBind = [0, 0];
    oldIdxA = props.idxA;
    oldIdxB = props.idxB;
    masSvg = ["", ""];
    massFazFrom = [];
    for (let i = 0; i < kolFaz; i++) massFazFrom.push(-1);
    for (let i = 0; i < kolFaz; i++) massFazIn.push(-1);
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
  }
  //========================================================

  const styleBind00 = {
    outline: "none",
    border: "3px solid #000",
    borderColor: "#F0F0F0",
    borderRadius: 2,
    marginTop: "3vh",
    marginLeft: 1,
    marginRight: 1,
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
    let sec = props.reqRoute.tmRoute;
    let sRoute = (props.reqRoute.dlRoute / 1000 / sec) * 3600;
    sRoute = Math.round(sRoute * 10) / 10;
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
        <Grid item xs={7.5}>
          <Box sx={styleBind02}>
            <b>Привязка направлений</b>
          </Box>

          <Box sx={{ p: 1, fontSize: 16, textAlign: "center" }}>
            из <b>{massroute.vertexes[props.idxA].name}</b>
          </Box>
          <Box sx={{ p: 1, fontSize: 16, textAlign: "center" }}>
            в <b>{massroute.vertexes[props.idxB].name}</b>
          </Box>
          <Box sx={{ p: 1, fontSize: 14, textAlign: "center" }}>
            Длина связи: <b>{props.reqRoute.dlRoute}</b> м&nbsp;&nbsp;Время
            прохождения: <b>{Math.round(sec / 60)} мин&nbsp;&nbsp;</b>Средняя
            скорость прохождения: <b>{sRoute}</b> км/ч
          </Box>
        </Grid>
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
    idxFrom = idx
    setOpenFormFrom(true)
  };

  const StrokaMainTablFrom = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxA].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolFaz; i++) {
      let nr = nameRoute + (i + 1).toString();
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid item xs={1} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            {i + 1}
          </Grid>
          <Grid item xs={4} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            {nr}
          </Grid>
          <Grid item xs={2} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            0
          </Grid>
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

  const handleCloseTabIn = (idx: number) => {
    if (massFazFrom[idx] === -1) {
      massFazFrom[idx] = 1;
    } else {
      massFazFrom[idx] = -1;
    }
    setTrigger(!trigger);
  };

  const StrokaMainTablIn = () => {
    let resStr = [];
    let nameRoute = "00" + massroute.vertexes[props.idxB].id;
    nameRoute = nameRoute.slice(-3);
    for (let i = 0; i < kolFaz; i++) {
      let nr = nameRoute + (i + 1).toString();
      let metka = massFazFrom[i] > 0 ? "✔" : "";
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          <Grid item xs={0.5} sx={{ marginTop: 0.5, textAlign: "center" }}>
            <b>{metka}</b>
          </Grid>
          <Grid item xs={0.5} sx={{ lineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind04} onClick={() => handleCloseTabIn(i)}>
              <b>{i + 1}</b>
            </Button>
          </Grid>
          <Grid item xs={8} sx={{ border: 0, p: 0.5 }}>
            {nr}
          </Grid>
          <Grid item xs sx={{ textAlign: "center", p: 0.5 }}>
            0
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
            <Grid item xs={1} sx={{ textAlign: "center" }}>
              №
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              Наименование
            </Grid>
            <Grid item xs={2} sx={{ textAlign: "center" }}>
              Интенсивность
            </Grid>
            <Grid item xs sx={{ textAlign: "center" }}>
              Свойства
            </Grid>
          </Grid>
        </Box>
        <Grid container sx={{ height: "24vh" }}>
          {StrokaMainTablFrom()}
        </Grid>
      </Grid>
    );
  };

  const TablIn = () => {
    return (
      <Grid item xs sx={styleSetImg}>
        <Box sx={styleBind03}>
          <em>Входящие направления</em>
        </Box>
        <Box sx={styleBind03}>
          <Grid container item xs={12}>
            <Grid item xs={1} sx={{ textAlign: "center" }}>
              №
            </Grid>
          </Grid>
        </Box>
        <Grid container sx={{ height: "24vh" }}>
          {StrokaMainTablIn()}
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
          <Grid item xs={3} sx={{ border: 0 }}></Grid>
          <Grid item xs={6} sx={{ border: 1 }}></Grid>
        </Grid>
        {FooterBind()}
      </Box>
      {openFormFrom && <MapRouteBindFormFrom setOpen={setOpenFormFrom} idx={idxFrom}  />}
      </>
    </Modal>
  );
};

export default MapRouteBind;

// const Inputer = (soob: string, mode: number) => {
//   return (
//     <>
//       <Grid item xs={3.5} sx={styleBind01}>
//         <b>{soob}</b>&nbsp;
//       </Grid>
//       <Grid item xs={0.5}>
//         {InputDirect(mode)}
//       </Grid>
//     </>
//   );
// };

// const InputDirect = (mode: number) => {
//   const handleKey = (event: any) => {
//     if (event.key === "Enter") event.preventDefault();
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrency(Number(event.target.value));
//     if (mode) {
//       massBind[1] = massDat[Number(event.target.value)];
//     } else {
//       massBind[0] = massDat[Number(event.target.value)];
//     }
//     setTrigger(!trigger);
//   };

//   let dat = massroute.vertexes[props.idxA].lin;
//   if (mode) dat = massroute.vertexes[props.idxB].lout;
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

//   const [currency, setCurrency] = React.useState(massBind[mode]);
//   const [trigger, setTrigger] = React.useState(true);

//   return (
//     <Box sx={styleSetNapr}>
//       <Box component="form" sx={styleBoxFormNapr}>
//         <TextField
//           select
//           size="small"
//           onKeyPress={handleKey} //отключение Enter
//           value={currency}
//           onChange={handleChange}
//           InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
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

//const InputDirectMass = (mode: number) => {};
