import * as React from "react";
//import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import "./MainMapStyle.css";

import { Directions } from "./../App"; // интерфейс massForm

import { FullscreenControl, GeolocationControl } from "react-yandex-maps";
import { RulerControl, SearchControl } from "react-yandex-maps";
import { TrafficControl, TypeSelector, ZoomControl } from "react-yandex-maps";

import { SendSocketCreatePoint } from "./MapSocketFunctions";
import { SendSocketCreateVertex } from "./MapSocketFunctions";
import { SocketDeleteWay } from "./MapSocketFunctions";
import { SendSocketDeletePoint } from "./MapSocketFunctions";
import { SendSocketDeleteVertex } from "./MapSocketFunctions";

import { Pointer, Router } from "./../App";
import { Vertex } from "./../interfaceRoute";

import { styleModalMenu, styleModalEndMapGl } from "./MainMapStyle";
import { styleSetPoint, styleFT02, styleFormMenu } from "./MainMapStyle";
import { styleFormPK03, styleBind05, styleBind0333 } from "./MainMapStyle";
import { styleModalEndAttent, styleFT03, styleFT033 } from "./MainMapStyle";
import { styleBind02, styleTypography, searchControl } from "./MainMapStyle";
import { styleBind03, styleBind033, styleSetImg } from "./MainMapStyle";
import { styleFT04, styleFT05, styleModalEnd } from "./MainMapStyle";
import { styleSetPK04 } from "./MainMapStyle";

import { styleModalMenuErr, styleHeadError } from "./MapPointDataErrorStyle";
import { styleBoxFormArea, styleSetArea } from "./MapPointDataErrorStyle";

import { debug, SUBAREA, MODE, MASSPK, SubArea, AREA } from "./MainMapGl";
import { ZONE, OUTGO } from "./MapConst";
import { dateMapGl } from "./../App";

export const handleKey = (event: any) => {
  if (event.key === "Enter") event.preventDefault();
};

export const RandomNumber = (min: number, max: number) => {
  let rand = Math.random() * (max - min) + min;
  return Math.floor(rand);
};

export const MassCoord = (mass: any) => {
  return [mass.coordinates[0], mass.coordinates[1]];
};

export const UniqueName = () => {
  let nameMode =
    "(" +
    new Date().toLocaleDateString() +
    " " +
    new Date().toLocaleTimeString() +
    ")";
  return nameMode;
};

export const KnopProps = (styleXX: any, func: any, rec: any, idx: any) => {
  return (
    <Button sx={styleXX} onClick={() => func(idx)}>
      {rec}
    </Button>
  );
};

export const SubareaFindById = (massdk: any, area: number, id: number) => {
  let subarea = -1;
  let areA = area ? Number(AREA) : 0;

  for (let j = 0; j < massdk.length; j++) {
    if (massdk[j].ID === id && massdk[j].area === areA)
      subarea = massdk[j].subarea;
  }

  return subarea;
};

export const MasrouteAgreeMap = (massroute: any) => {
  let mass = ZONE ? [] : massroute.vertexes;
  if (ZONE) {
    for (let i = 0; i < massroute.vertexes.length; i++) {
      for (let j = 0; j < dateMapGl.tflight.length; j++) {
        if (
          massroute.vertexes[i].area ===
            Number(dateMapGl.tflight[j].area.num) &&
          massroute.vertexes[i].id === dateMapGl.tflight[j].ID
        )
          mass.push(massroute.vertexes[i]);
      }
    }
  }
  return mass;
};

export const MapssdkNewPoint = (
  homeRegion: number,
  coords: any,
  name: string,
  area: number,
  subarea: number,
  id: number
) => {
  let masskPoint: Pointer = {
    ID: 0,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    subarea: 0,
    phases: [1, 2, 3],
    newCoordinates: 0,
  };

  masskPoint.ID = id;
  masskPoint.coordinates = coords;
  masskPoint.nameCoordinates = name;
  masskPoint.region = homeRegion;
  masskPoint.area = area;
  masskPoint.subarea = subarea;
  masskPoint.newCoordinates = 1;
  return masskPoint;
};

export const MassrouteNewPoint = (
  homeRegion: number,
  coords: any,
  name: string,
  area: number,
  id: number
) => {
  let masskPoint: Vertex = {
    region: 0,
    area: 0,
    id: 0,
    dgis: "",
    scale: 0,
    lin: [1, 3, 5, 7, 9, 11],
    lout: [2, 4, 6, 8, 10, 12],
    name: "",
  };

  masskPoint.region = homeRegion;
  masskPoint.area = area;
  masskPoint.id = id;
  masskPoint.dgis = CodingCoord(coords);
  masskPoint.name = name;
  masskPoint.scale = 0;
  return masskPoint;
};

export const RecordMassRoute = (
  fromCross: any,
  toCross: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  let masskRoute: Router = {
    region: 0,
    sourceArea: 0,
    sourceID: 0,
    targetArea: 0,
    targetID: 0,
    lsource: 0,
    ltarget: 0,
    starts: "",
    stops: "",
    lenght: 0,
    time: 0,
  };

  masskRoute.region = Number(fromCross.pointAaRegin);
  masskRoute.sourceArea = Number(fromCross.pointAaArea);
  masskRoute.sourceID = fromCross.pointAaID;
  masskRoute.targetArea = Number(toCross.pointBbArea);
  masskRoute.targetID = toCross.pointBbID;
  masskRoute.starts = fromCross.pointAcod;
  masskRoute.stops = toCross.pointBcod;
  masskRoute.lsource = massBind[0];
  masskRoute.ltarget = massBind[1];
  masskRoute.lenght = reqRoute.dlRoute;
  masskRoute.time = reqRoute.tmRoute;

  return masskRoute;
};

export const FillMassRouteContent = (
  FlagDemo: boolean,
  massroute: any,
  massdk: any
) => {
  let massRoute: any = [];
  if (SUBAREA === "0" && FlagDemo) massRoute = massroute.ways;
  if (SUBAREA !== "0" && FlagDemo) {
    for (let i = 0; i < massroute.ways.length; i++)
      if (
        SubareaFindById(massdk, 1, massroute.ways[i].sourceID).toString() ===
          SUBAREA ||
        SubareaFindById(massdk, 1, massroute.ways[i].targetID).toString() ===
          SUBAREA
      )
        massRoute.push(massroute.ways[i]);
  }
  return massRoute;
};

export const MakeFromCross = (mass: any) => {
  let fromCross: any = {
    pointAaRegin: "",
    pointAaArea: "",
    pointAaID: 0,
    pointAcod: "",
  };
  fromCross.pointAaRegin = mass.region.toString();
  fromCross.pointAaArea = mass.area.toString();
  fromCross.pointAaID = mass.ID;
  return fromCross;
};

export const MakeToCross = (mass: any) => {
  let toCross: any = {
    pointBbRegin: "",
    pointBbArea: "",
    pointBbID: 0,
    pointBcod: "",
  };
  toCross.pointBbRegin = mass.region.toString();
  toCross.pointBbArea = mass.area.toString();
  toCross.pointBbID = mass.ID;
  return toCross;
};

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  for (let i = 0; i < massroute.length; i++) {
    let corStart = DecodingCoord(massroute[i].starts);
    let corStop = DecodingCoord(massroute[i].stops);
    let distStart = Distance(corStart, pointA);
    let distStop = Distance(corStop, pointB);
    if (distStart < 100 && distStop < 100) flDubl = true;
  }
  return flDubl;
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};

export const CenterCoordBegin = (map: any) => {
  return CenterCoord(
    map.dateMap.boxPoint.point0.Y,
    map.dateMap.boxPoint.point0.X,
    map.dateMap.boxPoint.point1.Y,
    map.dateMap.boxPoint.point1.X
  );
};

export const MakeNewPointContent = (
  WS: any,
  coords: any,
  avail: boolean,
  homeRegion: number,
  massroute: any
) => {
  let coor: string = CodingCoord(coords);
  let areaV = massroute.vertexes[massroute.vertexes.length - 1].area;
  let idV = massroute.vertexes[massroute.vertexes.length - 1].id;
  let adress = massroute.vertexes[massroute.vertexes.length - 1].name;
  areaV && avail && SendSocketCreateVertex(WS, homeRegion, areaV, idV); // светофор
  !areaV && SendSocketCreatePoint(WS, coor, adress); // объект
};

export const DelPointVertexContent = (
  WS: any,
  massroute: any,
  idxDel: number
) => {
  let massRouteRab: any = []; // удаление из массива сети связей
  let coordPoint = massroute.vertexes[idxDel].dgis;
  let idPoint = massroute.vertexes[idxDel].id;
  let regionV = massroute.vertexes[idxDel].region.toString();
  let areaV = massroute.vertexes[idxDel].area.toString();
  areaV === "0" && SendSocketDeletePoint(WS, idPoint); // объкт
  areaV !== "0" && SendSocketDeleteVertex(WS, regionV, areaV, idPoint); // светофор
  for (let i = 0; i < massroute.ways.length; i++) {
    let iffer =
      coordPoint !== massroute.ways[i].starts &&
      coordPoint !== massroute.ways[i].stops;
    iffer && massRouteRab.push(massroute.ways[i]);
    !iffer && SocketDeleteWay(WS, massroute.ways[i]);
  }
  return massRouteRab;
};

export const PreparCurrenciesMode = () => {
  const currencies: any = [];
  let dat = [
    "Перекрёстки и связи:",
    "Работа с перекрёстками",
    "Создание связей",
    "Настройки",
  ];
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

export const PreparCurrenciesPK = () => {
  const currencies: any = [];
  let dat = [
    "ПК и модели:",
    "Создание нового ПК",
    "Список ПК",
    "Список моделей",
    "Настройки",
  ];
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

export const PreparCurrenciesCalc = () => {
  const currencies: any = [];
  let dat = [
    "Расчёты:",
    "Оптимальное время цикла",
    "Устойчивость программы координации",
  ];
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

export const PreparCurrenciesOptim = () => {
  const currencies: any = [];
  let dat = [
    "Оптимизация ПК:",
    "Относительно начального сдвига фаз",
    "Относительно длительности фаз",
  ];
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

export const PreparCurrenciesForm = () => {
  const currencies: any = [];
  let dat = [
    "Выхоные формы:",
    "Данные о перекрёстках",
    "Начальные параметры перекрёстков",
    "Выходные данные по направлениям",
    "Начальные параметры направлений",
    "Программа координации",
  ];
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

export const PreparCurrencies = () => {
  const currencies: any = [];
  let dat: Array<string> = [];
  dat.push("Все подрайоны");
  for (let i = 0; i < SubArea.length; i++) {
    dat.push(SubArea[i].toString() + "-й подрайон");
  }
  let massKey: any = [];
  let massDat: any = [];
  for (let key in dat) {
    massKey.push(key);
    massDat.push(dat[key]);
  }
  let maskCurrencies = {
    value: "0",
    label: "Все районы",
  };
  for (let i = 0; i < massKey.length; i++) {
    maskCurrencies.value = massKey[i];
    maskCurrencies.label = massDat[i];
    currencies.push({ ...maskCurrencies });
  }
  if (debug) {
    maskCurrencies.value = (massKey.length + 1).toString();
    maskCurrencies.label = "Добавить подрайон";
    currencies.push({ ...maskCurrencies });
  }
  return currencies;
};

export const PreparCurrenciesFaza = (mazFaz: number) => {
  const currencies: any = [];
  let dat: Array<string> = [];
  for (let i = 2; i < mazFaz + 1; i++) dat.push(i.toString());
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

export const InputMenu = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "120px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "145px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color:
                  currency === (SubArea.length + 1).toString()
                    ? "green"
                    : currency === "0"
                    ? "blue"
                    : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color:
                    option.label === "Добавить подрайон" ? "green" : "black",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};
//color: currency === "0" ? "blue" : "black",
export const InputMenuMODE = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "160px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "185px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color: currency === "0" ? "blue" : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color:
                    option.label === "Перекрёстки и связи:" ? "blue" : "black",
                  cursor:
                    option.label === "Перекрёстки и связи:"
                      ? "none"
                      : "pointer",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export const InputMenuPK = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "100px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "125px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color: currency === "0" ? "blue" : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color: option.label === "ПК и модели:" ? "blue" : "black",
                  cursor: option.label === "ПК и модели:" ? "none" : "pointer",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export const InputMenuCalc = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "75px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "100px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color: currency === "0" ? "blue" : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color: option.label === "Расчёты:" ? "blue" : "black",
                  cursor: option.label === "Расчёты:" ? "none" : "pointer",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export const InputMenuOptim = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "130px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "155px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color: currency === "0" ? "blue" : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color: option.label === "Оптимизация ПК:" ? "blue" : "black",
                  cursor:
                    option.label === "Оптимизация ПК:" ? "none" : "pointer",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export const InputMenuForm = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "150px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#BAE186", // салатовый
    border: "1px solid #93D145", // тёмно салатовый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "175px",
    },
  };

  return (
    <>
      <Box sx={styleSet}>
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{
              disableUnderline: true,
              style: {
                fontWeight: 700,
                color: currency === "0" ? "blue" : "black",
                marginLeft: 10,
                fontSize: 14,
              },
            }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color: option.label === "Выхоные формы:" ? "blue" : "black",
                  cursor: option.label === "Выхоные формы:" ? "none" : "pointer",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export const Distance = (coord1: Array<number>, coord2: Array<number>) => {
  if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
    return 0;
  } else {
    let radlat1 = (Math.PI * coord1[0]) / 180;
    let radlat2 = (Math.PI * coord2[0]) / 180;
    let theta = coord1[1] - coord2[1];
    let radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1609.344;
    return dist;
  }
};

export const NearestPoint = (massdk: any, newPointCoord: any) => {
  let minDist = 999999;
  let nomInMass = -1;
  for (let i = 0; i < massdk.length; i++) {
    let corFromMap = [massdk[i].coordinates[0], massdk[i].coordinates[1]];
    let dister = Distance(newPointCoord, corFromMap);
    if (dister < 100 && minDist > dister) {
      minDist = dister;
      nomInMass = i;
    }
  }
  return nomInMass;
};

export const ComplianceMapMassdk = (index: number, massdk: any, map: any) => {
  let idxMap = -1;
  if (index >= 0 && map.dateMap.tflight.length > index) {
    for (let i = 0; i < map.dateMap.tflight.length; i++) {
      if (
        map.dateMap.tflight[i].ID === massdk[index].ID &&
        Number(map.dateMap.tflight[i].area.num) === massdk[index].area
      ) {
        idxMap = i;
        break;
      }
    }
  }
  return idxMap;
};

//=== Placemark =====================================
export const getPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  map: any
) => {
  let idxMap = ComplianceMapMassdk(index, massdk, map);
  let cont3 = ", null";
  if (idxMap >= 0) cont3 = ", " + map.dateMap.tflight[idxMap].idevice;
  let cont1 = massdk[index].nameCoordinates + "<br/>";
  let cont2 = "[" + massdk[index].subarea;
  cont2 += ", " + massdk[index].ID + cont3 + "]";
  let textBalloon = "";
  if (index === pointAaIndex && MODE === "0") textBalloon = "Начало";
  if (index === pointBbIndex && MODE === "0") textBalloon = "Конец";

  return {
    hintContent: cont1 + cont2,
    iconContent: textBalloon,
  };
};

export const GetPointOptions = (
  index: number,
  map: any,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any
  //massroute: any
) => {
  let idxMap = -1;
  let SubArea = massdk[index].subarea.toString();
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    if (map.dateMap.tflight[i].ID === massdk[index].ID) {
      idxMap = i;
      break;
    }
  }

  const Hoster = () => {
    let host = "";
    if (idxMap >= 0) {
      if (SubArea === SUBAREA || SUBAREA === "0") {
        host = "http://localhost:3000/1.svg";
        if (!debug && idxMap >= 0)
          host = window.location.origin + "/free/img/trafficLights/1.svg";
        if (!debug && idxMap < 0) host = "";
      }
    }
    //================================= потом исправить ======
    if (massdk[index].newCoordinates > 0) {
      if (SubArea === SUBAREA || SUBAREA === "0") {
        host = "http://localhost:3000/3.svg";
        if (!debug)
          host = window.location.origin + "/free/img/trafficLights/3.svg";
      }
    }
    //========================================================
    const HosterIllum = (nom: string) => {
      host = "http://localhost:3000/" + nom + ".svg";
      if (!debug)
        host =
          window.location.origin + "/free/img/trafficLights/" + nom + ".svg";
    };

    if (SubArea === SUBAREA)
      if (MASSPK.indexOf(massdk[index].ID) >= 0) HosterIllum("4");
    if (MODE === "1")
      if (index === pointBbIndex || index === pointAaIndex) HosterIllum("2");
    return host;
  };

  let colorBalloon = "islands#violetCircleDotIcon";
  if (massdk[index].area === 0 && (SubArea === SUBAREA || SUBAREA === "0")) {
    colorBalloon = "islands#violetCircleIcon";
    if (massdk[index].newCoordinates > 0)
      colorBalloon = "islands#darkOrangeCircleIcon";
  }

  if (index === pointAaIndex && MODE === "0")
    colorBalloon = "islands#redStretchyIcon";
  if (index === pointBbIndex && MODE === "0")
    colorBalloon = "islands#darkBlueStretchyIcon";

  const NoImg = () => {
    return {
      preset: colorBalloon,
    };
  };

  const YesImg = () => {
    return {
      // данный тип макета
      iconLayout: "default#image",
      // изображение иконки метки
      iconImageHref: Hoster(),
      // размеры метки
      iconImageSize: [30, 30],
      // её "ножки" (точки привязки)
      //iconImageOffset: [-15, -30], // нижняя часть
      iconImageOffset: [-15, -15], // центр
    };
  };

  return colorBalloon === "islands#violetCircleDotIcon" ? YesImg() : NoImg();
};
//=== Разное =======================================
export const RecevKeySvg = (recMassroute: any) => {
  let keySvg =
    recMassroute.region.toString() +
    "-" +
    recMassroute.area.toString() +
    "-" +
    recMassroute.id.toString();
  return keySvg;
};

export const StrokaMenuGlob = (soob: string, func: Function, mode: number) => {
  const MesssgeLength = (text: string, fontSize: number) => {
    function textWidth(text: string, fontProp: any) {
      let tag = document.createElement("div");
      tag.style.position = "absolute";
      tag.style.left = "-999em";
      tag.style.whiteSpace = "nowrap";
      tag.style.font = fontProp;
      tag.innerHTML = text;
      document.body.appendChild(tag);
      let result = tag.clientWidth;
      document.body.removeChild(tag);
      return result;
    }
    let theCSSprop = window
      .getComputedStyle(document.body, null)
      .getPropertyValue("font-family");
    let bb = "bold " + fontSize + "px " + theCSSprop;
    return textWidth(text, bb);
  };

  const styleApp01 = {
    fontSize: 14,
    marginLeft: 0.4,
    width: MesssgeLength(soob, 14) + 32,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#C4EAA2", // салатовый
    color: "#676767", // тёмно серый
    textTransform: "unset !important",
    p: 1.5,
    boxShadow: 6,
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      {soob}
    </Button>
  );
};

export const MakeRevers = (
  makeRevers: boolean,
  needRevers: number,
  PressButton: Function
) => {
  return (
    <>
      {makeRevers && needRevers === 0 && <>{PressButton(35)}</>}
      {makeRevers && needRevers === 1 && <>{PressButton(36)}</>}
      {makeRevers && needRevers === 2 && <>{PressButton(37)}</>}
    </>
  );
};

export const ShowFormalRoute = (flagDemo: boolean, PressButton: Function) => {
  return (
    <>
      {!flagDemo && <>{StrokaMenuGlob("Формальн.связи", PressButton, 3)}</>}
      {flagDemo && <>{StrokaMenuGlob("Отключить Фс", PressButton, 6)}</>}
    </>
  );
};

export const MainMenu = (
  flagPusk: boolean,
  flagRoute: boolean,
  PressButton: Function
) => {
  return (
    <>
      {flagPusk && flagRoute && (
        <>
          {StrokaMenuGlob("Отмена", PressButton, 77)}
          {StrokaMenuGlob("Сохр-е", PressButton, 33)}
          {StrokaMenuGlob("Реверc", PressButton, 12)}
          {StrokaMenuGlob("Редактир-е", PressButton, 69)}
        </>
      )}
    </>
  );
};

export const YandexServices = () => {
  return (
    <>
      <FullscreenControl />
      <GeolocationControl options={{ float: "left" }} />
      <RulerControl options={{ float: "right" }} />
      <SearchControl options={searchControl} />
      <TrafficControl options={{ float: "right" }} />
      <TypeSelector options={{ float: "right" }} />
      <ZoomControl options={{ float: "right" }} />
    </>
  );
};

export const StrokaBalloon = (soob: string, func: any, mode: number) => {
  return (
    <Button sx={styleModalMenu} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const СontentModalPressBalloon = (
  setOpenSet: Function,
  handleClose: Function,
  areaPoint: number
) => {
  return (
    <Box sx={styleSetPoint}>
      <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
        <b>&#10006;</b>
      </Button>
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        {!areaPoint && (
          <>{StrokaBalloon("Редактированиее адреса точки", handleClose, 4)}</>
        )}
      </Box>
      <Typography variant="h6" sx={styleTypography}>
        Перестроение связи:
      </Typography>
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        {StrokaBalloon("Начальная точка", handleClose, 1)}
        {StrokaBalloon("Конечная точка", handleClose, 2)}
      </Box>
    </Box>
  );
};

export const MasskPoint = (massrouteVertexes: any) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    subarea: 3, // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    phases: [1, 2, 7],
    newCoordinates: 0,
  };
  masskPoint.ID = massrouteVertexes.id;
  masskPoint.coordinates = DecodingCoord(massrouteVertexes.dgis);
  masskPoint.nameCoordinates = massrouteVertexes.name;
  masskPoint.region = massrouteVertexes.region;
  masskPoint.area = massrouteVertexes.area;
  //=============================================================
  if (masskPoint.area) {
    let subarea = -1;
    let phases = [1, 2, 7];
    for (let j = 0; j < dateMapGl.tflight.length; j++) {
      if (dateMapGl.tflight[j].ID === masskPoint.ID) {
        subarea = dateMapGl.tflight[j].subarea;
        phases = dateMapGl.tflight[j].phases;
      }
    }
    masskPoint.subarea = subarea;
    masskPoint.phases = phases;
  }
  //=============================================================
  masskPoint.newCoordinates = 0;
  return masskPoint;
};

export const ChangeCrossFunc = (fromCross: any, toCross: any) => {
  let cross: any = {
    Region: "",
    Area: "",
    ID: 0,
    Cod: "",
  };
  cross.Region = fromCross.pointAaRegin;
  cross.Area = fromCross.pointAaArea;
  cross.ID = fromCross.pointAaID;
  cross.Cod = fromCross.pointAcod;
  fromCross.pointAaRegin = toCross.pointBbRegin;
  fromCross.pointAaArea = toCross.pointBbArea;
  fromCross.pointAaID = toCross.pointBbID;
  fromCross.pointAcod = toCross.pointBcod;
  toCross.pointBbRegin = cross.Region;
  toCross.pointBbArea = cross.Area;
  toCross.pointBbID = cross.ID;
  toCross.pointBcod = cross.Cod;
  let mass: any = [];
  mass.push(fromCross);
  mass.push(toCross);
  return mass;
};

export const DelVerOrPoint = (
  openSetDelete: boolean,
  massdk: any,
  massroute: any,
  idx: number,
  handleCloseDel: Function
) => {
  let soob = massdk[idx].area === 0 ? "объект" : "перекрёсток";

  const styleSetPoint = {
    outline: "none",
    position: "absolute",
    marginTop: "15vh",
    marginLeft: "24vh",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: "red",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    border: "1px solid #d4d4d4", // серый
    bgcolor: "#E6F5D6", // светло салатовый
    textTransform: "unset !important",
    color: "black",
    boxShadow: 3,
  };

  const NotHaveWays = () => {
    return (
      <>
        <Box>
          Будет удален {soob}&nbsp;
          <b>
            [{massdk[idx].area}, {massdk[idx].ID}
            ]&nbsp;&nbsp;
            {massdk[idx].nameCoordinates}
          </b>
        </Box>
        <Box sx={{ marginTop: 1.2 }}>
          <Typography variant="h6" sx={{ color: "red" }}>
            Удалять данный {soob}?
          </Typography>
          <Button sx={styleModalMenu} onClick={() => handleCloseDel(true)}>
            Да
          </Button>
          &nbsp;
          <Button sx={styleModalMenu} onClick={() => handleCloseDel(false)}>
            Нет
          </Button>
        </Box>
      </>
    );
  };

  const HaveWays = () => {
    return (
      <>
        <Box>
          Вы пытаетесь удалить {soob}&nbsp;
          <b>
            [{massdk[idx].area}, {massdk[idx].ID}
            ]&nbsp;&nbsp;
            {massdk[idx].nameCoordinates}
          </b>
          , который имеет связи с другими перекрёстками/объектами. Сначала нужно
          удалить эти связи, после чего можно удалять данный {soob}.
        </Box>
      </>
    );
  };

  let idV = massroute.vertexes[idx].id;
  let areaV = massroute.vertexes[idx].area;
  let have = 0;
  for (let i = 0; i < massroute.ways.length; i++) {
    let rec = massroute.ways[i];
    if (
      (rec.sourceArea === areaV && rec.sourceID === idV) ||
      (rec.targetArea === areaV && rec.targetID === idV)
    )
      have++;
  }

  return (
    <Modal open={openSetDelete} onClose={() => handleCloseDel(false)}>
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndAttent} onClick={() => handleCloseDel(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          Предупреждение
        </Typography>
        {have === 0 && <>{NotHaveWays()}</>}
        {have !== 0 && <>{HaveWays()}</>}
      </Box>
    </Modal>
  );
};

export const NoVertex = (openSetErr: boolean, handleCloseErr: Function) => {
  const styleSetPoint = {
    outline: "none",
    position: "absolute",
    marginTop: "15vh",
    marginLeft: "24vh",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #FFFFFF", // белый
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
    boxShadow: 6,
  };

  return (
    <Modal open={openSetErr} onClose={() => handleCloseErr(false)} hideBackdrop>
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndMapGl} onClick={() => handleCloseErr(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          Предупреждение
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Box sx={{ marginBottom: 1.2 }}>
            <b>
              В Базе Данных нет информации по данному перекрёстку. Продолжать?
            </b>
          </Box>
          <Button sx={styleModalMenu} onClick={() => handleCloseErr(true)}>
            Да
          </Button>
          &nbsp;
          <Button sx={styleModalMenu} onClick={() => handleCloseErr(false)}>
            Нет
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
//=== RouteBind =======================================================
export const ReplaceInSvg = (
  Svg: any,
  widthHeight: string
  //: number
) => {
  let ch = "";
  let svgPipa = Svg;
  let vxod = Svg.indexOf("width=");
  for (let i = 0; i < 100; i++) {
    if (isNaN(Number(svgPipa[vxod + 7 + i]))) break;
    ch = ch + svgPipa[vxod + 7 + i];
  }
  for (let i = 0; i < 6; i++) {
    svgPipa = svgPipa.replace(ch, widthHeight);
  }
  let chh = "";
  let vxodh = Svg.indexOf("height=");
  for (let i = 0; i < 100; i++) {
    if (isNaN(Number(svgPipa[vxodh + 8 + i]))) break;
    chh = chh + svgPipa[vxodh + 8 + i];
  }
  for (let i = 0; i < 6; i++) {
    svgPipa = svgPipa.replace(chh, widthHeight);
  }
  return svgPipa;
};

export const StrokaMenuFooterBind = (
  soob: string,
  mode: number,
  handleClose: Function
) => {
  const styleAppBind = {
    fontSize: 14,
    marginRight: 1,
    border: "1px solid #d4d4d4", // серый
    bgcolor: "#E6F5D6", // светло салатовый
    width: (soob.length + 9) * 7,
    maxHeight: "24px",
    minHeight: "24px",
    borderRadius: 1,
    color: "black",
    textTransform: "unset !important",
    boxShadow: 3,
  };

  return (
    <Button sx={styleAppBind} onClick={() => handleClose(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const HeaderBindMiddle = (
  reqRoute: any,
  nameA: string,
  nameB: string
) => {
  let sec = reqRoute.tmRoute;
  let sRoute = (reqRoute.dlRoute / 1000 / sec) * 3600;
  sRoute = Math.round(sRoute * 10) / 10;
  let bindTitle = reqRoute.mode
    ? "Изменение привязки направлений"
    : "Привязка направлений";
  return (
    <Grid item xs={7.5} sx={{ textShadow: "2px 2px 3px rgba(0,0,0,0.3)" }}>
      <Box sx={styleBind02}>
        <b>{bindTitle}</b>
      </Box>
      <Box sx={{ p: 0.5, marginTop: 1, fontSize: 16, textAlign: "center" }}>
        из <b>{nameA}</b>
      </Box>
      <Box sx={{ p: 0.5, fontSize: 16, textAlign: "center" }}>
        в <b>{nameB}</b>
      </Box>
      <Box sx={{ p: 0.5, marginTop: 1, fontSize: 14, textAlign: "center" }}>
        Длина связи: <b>{reqRoute.dlRoute}</b> м&nbsp;&nbsp;Время проезда:{" "}
        <b>
          {Math.round(sec / 60)} мин {"("}
          {sec}
          {" сек)"}
        </b>
      </Box>
      <Box sx={{ p: 0.5, fontSize: 14, textAlign: "center" }}>
        Средняя скорость проезда: <b>{sRoute}</b> км/ч
      </Box>
    </Grid>
  );
};

export const HeaderTablBindContent = (xss: number, soob: string) => {
  return (
    <Grid item xs={xss} sx={{ textAlign: "center" }}>
      {soob}
    </Grid>
  );
};

export const ArgTablBindContent = (xss: number, soob: any, mode: number) => {
  return (
    <>
      {mode ? (
        <Grid item xs={xss} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          <b>{soob}</b>
        </Grid>
      ) : (
        <Grid item xs={xss} sx={{ lineHeight: "3vh", textAlign: "center" }}>
          {soob}
        </Grid>
      )}
    </>
  );
};

export const ExampleComponent = (idx: number, masSvg: any) => {
  return (
    <Box sx={{ padding: "4px 0px 0px 0px" }}>
      <div dangerouslySetInnerHTML={{ __html: masSvg[idx] }} />
    </Box>
  );
};

export function AppIconAsdu(heightImg: number) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={heightImg + 6}
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

let HeaderBindIDX = -1;
export const HeaderBind = (
  nameA: string,
  nameB: string,
  Route: any,
  heightImg: number,
  masSvg: any,
  haveSvgA: boolean,
  haveSvgB: boolean
) => {
  const [openSvg, setOpenSvg] = React.useState(false);
  const heightWind = window.innerHeight * 0.8;

  const ClickBlok = (idx: number) => {
    HeaderBindIDX = idx;
    setOpenSvg(true);
  };

  const ViewSvg = (idx: number) => {
    const handleClose = () => {
      setOpenSvg(false);
    };

    const CloseEnd = (event: any, reason: string) => {
      if (reason === "escapeKeyDown") handleClose();
    };

    const stylePKForm01 = {
      outline: "none",
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: heightWind + 5,
      bgcolor: "background.paper",
      border: "1px solid #FFFFFF",
      borderRadius: 1,
      boxShadow: 24,
      textAlign: "center",
      padding: "10px 5px 5px 5px",
    };

    const styleWindPK04 = {
      border: "1px solid #d4d4d4",
      marginTop: 1,
      bgcolor: "#F1F5FB",
      height: heightWind + 4,
      borderRadius: 1,
      overflowX: "auto",
      boxShadow: 6,
    };

    let lngth = Math.round(heightWind).toString();
    let expSvg = ReplaceInSvg(masSvg[idx], lngth);

    return (
      <Modal open={openSvg} onClose={CloseEnd} hideBackdrop={false}>
        <Box sx={stylePKForm01}>
          <Button sx={styleModalEnd} onClick={() => handleClose()}>
            <b>&#10006;</b>
          </Button>
          <Box sx={styleWindPK04}>
            <div dangerouslySetInnerHTML={{ __html: expSvg }} />
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <Grid container sx={{ marginTop: "1vh", height: heightImg + 5 }}>
        <Grid item xs={0.25}></Grid>
        {!haveSvgA && <Grid item xs={2}></Grid>}
        {haveSvgA && (
          <Grid item xs={2} onClick={() => ClickBlok(0)} sx={styleSetImg}>
            <Box sx={{ textAlign: "center", cursor: "pointer" }}>
              {masSvg[0] === "" && <>{AppIconAsdu(heightImg)}</>}
              {masSvg[0] !== "" && <>{ExampleComponent(0, masSvg)}</>}
            </Box>
          </Grid>
        )}
        {HeaderBindMiddle(Route, nameA, nameB)}
        {haveSvgB && (
          <Grid item xs={2} onClick={() => ClickBlok(1)} sx={styleSetImg}>
            <Box sx={{ textAlign: "center", cursor: "pointer" }}>
              {masSvg[1] === "" && <>{AppIconAsdu(heightImg)}</>}
              {masSvg[1] !== "" && <>{ExampleComponent(1, masSvg)}</>}
            </Box>
          </Grid>
        )}
        <Grid item xs={0.25}></Grid>
      </Grid>
      {openSvg && <>{ViewSvg(HeaderBindIDX)}</>}
    </>
  );
};

export const StrTablFrom = (
  kolFazFrom: number,
  nameRoute: string,
  hClTabFrom: Function,
  InputPr: Function
) => {
  let resStr = [];
  for (let i = 0; i < kolFazFrom; i++) {
    let nr = nameRoute + (i + 1).toString();
    resStr.push(
      <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
        {ArgTablBindContent(1, i + 1, 0)}
        {ArgTablBindContent(4, nr, 1)}
        <Grid item xs={3} sx={{ display: "grid", justifyContent: "center" }}>
          {InputPr(i)}
        </Grid>
        <Grid item xs={4} sx={{ ineHeight: "3vh", textAlign: "center" }}>
          <Button sx={styleBind05} onClick={() => hClTabFrom(i)}>
            просмотр/изменение
          </Button>
        </Grid>
      </Grid>
    );
  }
  return resStr;
};

export const BindInput = (
  massBind: any,
  mode: number,
  SetMass: Function,
  pusto: number,
  MAX: number
) => {
  const [trigger, setTrigger] = React.useState(false);
  let value = massBind;

  const styleSetID = {
    width: "28px",
    maxHeight: "1px",
    minHeight: "1px",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    bgcolor: "#FFFBE5", // топлёное молоко
    boxShadow: 6,
    textAlign: "center",
    p: 1.6,
  };

  const styleSetIDpusto = {
    bgcolor: "white",
  };

  const styleBoxFormID = {
    "& > :not(style)": {
      marginTop: "-12px",
      marginLeft: "-10px",
      width: "49px",
    },
  };

  const handleChange = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < 0) valueInp = 0;
    if (valueInp === "") valueInp = 0;
    valueInp = Math.trunc(Number(valueInp));
    if (valueInp <= MAX) {
      value = valueInp.toString();
      SetMass(mode, valueInp);
      setTrigger(!trigger);
    }
  };

  let styleSet = pusto ? styleSetID : styleSetIDpusto;

  return (
    <Box sx={styleSet}>
      {pusto > 0 && (
        <Box component="form" sx={styleBoxFormID}>
          <TextField
            size="small"
            onKeyPress={handleKey} //отключение Enter
            type="number"
            InputProps={{
              disableUnderline: true,
              style: { fontSize: 13.3, backgroundColor: "#FFFBE5" },
            }}
            value={value}
            onChange={handleChange}
            variant="standard"
            color="secondary"
          />
        </Box>
      )}
    </Box>
  );
};

export const BindTablFrom = (
  kolFazFrom: number,
  nameRoute: string,
  hClTabFrom: Function,
  BindInput: Function,
  massPrFrom: any,
  SetMass: Function
) => {
  let nRoute = nameRoute;
  const StrTablFrom = () => {
    let resStr = [];
    for (let i = 0; i < kolFazFrom; i++) {
      let nr = OUTGO + (i + 1).toString();
      resStr.push(
        <Grid key={i} container item xs={12} sx={{ fontSize: 14 }}>
          {ArgTablBindContent(1, i + 1, 0)}
          {ArgTablBindContent(3, nr, 1)}
          <Grid item xs={4} sx={{ display: "grid", justifyContent: "center" }}>
            {BindInput(massPrFrom[i].intensTr, i, SetMass, 1, 10000)}
          </Grid>
          <Grid item xs={4} sx={{ ineHeight: "3vh", textAlign: "center" }}>
            <Button sx={styleBind05} onClick={() => hClTabFrom(i)}>
              просмотр/изменение
            </Button>
          </Grid>
        </Grid>
      );
    }
    return resStr;
  };

  return (
    <Grid item xs={5.5} sx={styleSetImg}>
      <Box sx={styleBind0333}>
        <Box sx={styleBind03}>
          <em>
            Исходящие направления <b>{nRoute}</b>
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
        {StrTablFrom()}
      </Grid>
    </Grid>
  );
};

export const MaskFormWay = () => {
  const maskForm: Directions = {
    name: "0121/0212",
    satur: 0,
    intensTr: 0,
    dispers: 50,
    peregon: 0,
    wtStop: 1,
    wtDelay: 1,
    offsetBeginGreen: 0,
    offsetEndGreen: 0,
    intensFl: 0,
    phases: [],
    edited: false,
    opponent: "",
  };
  return maskForm;
};

export const BadExit = (badExit: boolean, handleCloseEnd: Function) => {
  const styleSetPoint = {
    outline: "none",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    borderColor: "red",
    borderRadius: 1,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    maxHeight: "24px",
    minHeight: "24px",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    backgroundColor: "#E6F5D6", // светло салатовый
    color: "black",
    textTransform: "unset !important",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
    boxShadow: 6,
  };

  const handleClose = (mode: boolean) => {
    handleCloseEnd(mode);
  };

  const CloseEnd = (event: any, reason: string) => {
    if (reason === "escapeKeyDown") handleClose(false);
  };

  return (
    <Modal open={badExit} onClose={CloseEnd} hideBackdrop>
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndAttent} onClick={() => handleClose(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          Предупреждение
        </Typography>
        <Box sx={{ marginTop: 0.5 }}>
          <Box sx={{ marginBottom: 1.2 }}>
            <b>Будет произведён выход без сохранения. Продолжать?</b>
          </Box>
          <Button sx={styleModalMenu} onClick={() => handleClose(false)}>
            Нет
          </Button>
          &nbsp;
          <Button sx={styleModalMenu} onClick={() => handleClose(true)}>
            Да
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
//=== WaysForma =======================================================
export const WaysInput = (
  idx: number,
  VALUE: any,
  SetValue: Function,
  MIN: number,
  MAX: number
) => {
  let value = VALUE;

  const styleSetID = {
    width: "33px",
    maxHeight: "1px",
    minHeight: "1px",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    bgcolor: "#FFFBE5", // топлёное молоко
    boxShadow: 6,
    textAlign: "center",
    p: 1.5,
  };

  const styleBoxFormID = {
    "& > :not(style)": {
      marginTop: "3px",
      marginLeft: "-9px",
      width: "53px",
    },
  };

  const handleChange = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    if (Number(valueInp) < MIN) valueInp = MIN;
    if (valueInp === "") valueInp = MIN;
    valueInp = Math.trunc(Number(valueInp));
    if (valueInp <= MAX) {
      value = valueInp.toString();
      SetValue(valueInp, idx);
    }
  };

  return (
    <Box sx={styleSetID}>
      <Box component="form" sx={styleBoxFormID}>
        <TextField
          size="small"
          onKeyPress={handleKey} //отключение Enter
          type="number"
          InputProps={{
            disableUnderline: true,
            style: {
              maxHeight: "1px",
              minHeight: "1px",
              fontSize: 14,
              backgroundColor: "#FFFBE5", // топлёное молоко
            },
          }}
          value={value}
          onChange={handleChange}
          variant="standard"
          color="secondary"
        />
      </Box>
    </Box>
  );
};

export const InputOpponent = (
  func: any,
  currency: any,
  currencies: any,
  pusto: string
) => {
  const styleSetOpp = {
    width: "36px",
    maxHeight: "6px",
    minHeight: "6px",
    marginTop: "-0px",
    bgcolor: "#FFFBE5", // топлёное молоко
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textAlign: "center",
    p: 1.25,
    boxShadow: 6,
  };

  const styleSetOppNull = {
    width: "36px",
    maxHeight: "8px",
    minHeight: "8px",
    marginTop: "-3px",
    p: 1.25,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-7px",
      marginLeft: "-9px",
      width: "59px",
    },
  };

  let styleSet = pusto ? styleSetOpp : styleSetOppNull;

  return (
    <Box sx={styleSet}>
      {pusto !== "" && (
        <Box component="form" sx={styleBoxForm}>
          <TextField
            select
            size="small"
            onKeyPress={handleKey} //отключение Enter
            value={currency}
            onChange={func}
            InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
            variant="standard"
            color="secondary"
          >
            {currencies.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}
    </Box>
  );
};
//=== WertexForma =====================================================
export const InputFromList = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "36px",
    maxHeight: "6px",
    minHeight: "6px",
    bgcolor: "#FFFBE5",
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textAlign: "center",
    p: 1.2,
    boxShadow: 6,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-7px",
      marginLeft: "-12px",
      width: "58px",
    },
  };

  return (
    <Box sx={styleSet}>
      <Box component="form" sx={styleBoxForm}>
        <TextField
          select
          size="small"
          onKeyPress={handleKey} //отключение Enter
          value={currency}
          onChange={func}
          InputProps={{ disableUnderline: true, style: { fontSize: 14 } }}
          variant="standard"
          color="secondary"
        >
          {currencies.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
};

export const StrTablVert = (xss: number, recLeft: string, recRight: any) => {
  return (
    <>
      <Grid container sx={{ marginTop: 1 }}>
        <Grid item xs={0.25}></Grid>
        <Grid item xs={xss} sx={{ border: 0 }}>
          <b>{recLeft}</b>
        </Grid>
        {typeof recRight === "object" ? (
          <Grid item xs>
            {recRight}
          </Grid>
        ) : (
          <Grid item xs sx={{ fontSize: 15, color: "#5B1080", border: 0 }}>
            <b>{recRight}</b>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export const HeaderTablFaz = () => {
  return (
    <Grid container sx={styleFT02}>
      <Grid item xs={2.75}>
        № фазы
      </Grid>
      <Grid item xs={2.75}>
        Мин.длит.фаз(с)
      </Grid>
      <Grid item xs={2.75}>
        Нач.длит.фаз(с)
      </Grid>
      <Grid item xs={2.75}>
        Порядок фаз
      </Grid>
    </Grid>
  );
};

export const ShiftOptimal = (
  mode: boolean,
  ChangeOptimal: Function,
  shift: number
) => {
  const styleOptimalNo = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#E6F5D6", // светло салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 2,
    color: "black",
  };

  const styleOptimalYes = {
    marginTop: shift,
    marginRight: 1,
    maxHeight: "27px",
    minHeight: "27px",
    maxWidth: 58,
    minWidth: 58,
    backgroundColor: "#bae186", // тёмно салатовый
    border: "1px solid #bae186", // тёмно салатовый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };

  let illum = mode ? styleOptimalYes : styleOptimalNo;
  let soob = mode ? "Да" : "Нет";

  return (
    <Button sx={illum} onClick={() => ChangeOptimal()}>
      {soob}
    </Button>
  );
};

export const SaveFormVert = (HAVE: number, SaveForm: any) => {
  return (
    <Grid container>
      {HAVE > 0 ? (
        <>
          <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleFormMenu} onClick={() => SaveForm(false)}>
              Выйти без сохранения
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ marginTop: 1, textAlign: "center" }}>
            <Button sx={styleFormMenu} onClick={() => SaveForm(true)}>
              Сохранить изменения
            </Button>
          </Grid>
        </>
      ) : (
        <Box sx={{ marginTop: 1, height: "25px" }}> </Box>
      )}
    </Grid>
  );
};

export const DelStrokaFaz = (DeleteFaza: Function) => {
  const styleFormMenu = {
    maxHeight: "21px",
    minHeight: "21px",
    bgcolor: "#bae186", // тёмно салатовый
    border: "1px solid #bae186", // тёмно салатовый
    borderRadius: 1,
    textTransform: "unset !important",
    boxShadow: 6,
    color: "black",
  };
  return (
    <Grid container>
      <Grid item xs={2.5}></Grid>
      <Grid item xs={3.5} sx={{ marginTop: 0.4, textAlign: "center" }}>
        <Button sx={styleFormMenu} onClick={() => DeleteFaza(true)}>
          Удалить фазу
        </Button>
      </Grid>
      <Grid item xs={3.5} sx={{ marginTop: 0.4, textAlign: "center" }}>
        <Button sx={styleFormMenu} onClick={() => DeleteFaza(false)}>
          Отмена
        </Button>
      </Grid>
    </Grid>
  );
};

export const PreparCurrenciesPlan = (
  sumPlan: number,
  contrast: Array<number>
) => {
  const currencies: any = [];
  let dat: Array<string> = [];
  for (let i = 0; i < sumPlan; i++) {
    if (contrast.indexOf(i + 1) < 0) dat.push((i + 1).toString());
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
    currencies.push({ ...maskCurrencies });
  }
  return currencies;
};

export const MainTablInp = (xss: number, func: any, st: number) => {
  let style = st === 3 ? styleFT03 : styleFT033;
  return (
    <Grid xs={xss} item sx={style}>
      <Box sx={{ display: "grid", justifyContent: "center" }}>{func}</Box>
    </Grid>
  );
};

export const CombOrder = (massForm: any, newFAZA: number) => {
  let temp1: Array<number> = [];
  let temp2: Array<number> = [];
  for (let i = 0; i < newFAZA; i++) {
    temp1.push(massForm.phases[i].PhaseOrder);
    temp2.push(-1);
  }
  for (let i = 0; i < newFAZA; i++) {
    const minValue = Math.min.apply(null, temp1);
    const poz = temp1.indexOf(minValue);
    temp1[poz] = 100 + i;
    temp2[poz] = i + 1;
  }
  return temp2;
};

export const DelCross = (i: number, nomDelFaz: number) => {
  return (
    <Box sx={styleFT04}>
      {i === nomDelFaz ? (
        <Box sx={styleFT05}>
          <b>&#10006;</b>
        </Box>
      ) : (
        <Box>&#215;</Box>
      )}
    </Box>
  );
};
//=== PointDataError ==================================================
export const HeadDoublError = (flagSave: boolean, propsErr: string) => {
  return (
    <>
      {!flagSave ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "red",
            textShadow: "2px 2px 3px rgba(0,0,0,0.3)",
          }}
        >
          {propsErr}
        </Typography>
      ) : (
        <Typography variant="h6" sx={styleHeadError}>
          Редактирование параметров связи:
        </Typography>
      )}
    </>
  );
};

export const questionForDelete = (handleCloseDel: Function) => {
  return (
    <Box sx={{ textAlign: "center", marginTop: 1.2 }}>
      <Typography
        variant="h6"
        sx={{ color: "red", textShadow: "2px 2px 3px rgba(0,0,0,0.3)" }}
      >
        Удалить исходную связь?
      </Typography>
      <Button sx={styleModalMenuErr} onClick={() => handleCloseDel(2)}>
        Нет
      </Button>
      &nbsp;
      <Button sx={styleModalMenuErr} onClick={() => handleCloseDel(1)}>
        Да
      </Button>
    </Box>
  );
};

export const InputerDlTm = (value: any, func: any) => {
  return (
    <Box sx={styleSetArea}>
      <Box component="form" sx={styleBoxFormArea}>
        <TextField
          size="small"
          onKeyPress={handleKey} //отключение Enter
          type="number"
          InputProps={{ disableUnderline: true, style: { fontSize: 14.2 } }}
          value={value}
          onChange={func}
          variant="standard"
          color="secondary"
        />
      </Box>
    </Box>
  );
};

export const СontentStrErr = (xss: number, soob: any, mode: number) => {
  return (
    <>
      {mode > 0 ? (
        <Grid item xs={xss} sx={{ border: 0 }}>
          <b>{soob}</b>
        </Grid>
      ) : (
        <Grid item xs={xss} sx={{ border: 0 }}>
          {soob}
        </Grid>
      )}
    </>
  );
};

export const StrokaMenuErr = (handleClose: Function) => {
  const styleSave = {
    fontSize: 14,
    marginRight: 0.1,
    bgcolor: "#E6F5D6", // салатовый
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    width: "100px",
    maxHeight: "24px",
    minHeight: "24px",
    color: "black",
    textTransform: "unset !important",
    boxShadow: 6,
  };
  return (
    <Grid item xs sx={{ textAlign: "center", border: 0 }}>
      <Button sx={styleSave} onClick={() => handleClose()}>
        <b>Сохранить</b>
      </Button>
    </Grid>
  );
};
//=== CreatePK ========================================================
export const InputNamePK = (handleChangeName: any, valuen: string) => {
  const styleFormPK05 = {
    width: "585px",
    maxHeight: "10px",
    minHeight: "10px",
    marginTop: -0.2,
    bgcolor: "#FFFBE5", // топлёное молоко
    border: "1px solid #d4d4d4", // серый
    borderRadius: 1,
    boxShadow: 4,
    textAlign: "center",
    p: 0.95,
  };

  const styleFormPK055 = {
    "& > :not(style)": {
      marginTop: "-7px",
      marginLeft: "-5px",
      width: "600px",
    },
  };

  return (
    <Box sx={styleFormPK05}>
      <Box component="form" sx={styleFormPK055}>
        <TextField
          size="small"
          onKeyPress={handleKey} //отключение Enter
          InputProps={{
            disableUnderline: true,
            style: { fontSize: 15 },
          }}
          value={valuen}
          onChange={handleChangeName}
          variant="standard"
        />
      </Box>
    </Box>
  );
};

export const SaveFormPK = (SaveForm: any, create: boolean) => {
  return (
    <Box sx={styleSetPK04}>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 0px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(0)}>
          Выйти без сохранения
        </Button>
      </Box>

      {create && (
        <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
          <Button sx={styleFormPK03} onClick={() => SaveForm(2)}>
            Сохранить как новый
          </Button>
        </Box>
      )}

      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(1)}>
          Сохранить изменения
        </Button>
      </Box>
    </Box>
  );
};

export const ExitArrow = (board: any, id: number, massroute: any) => {
  let inputId = -1;
  let area = board.items[0].area;
  for (let i = 0; i < board.items.length; i++) {
    if (i !== board.items.length - 1 && board.items[i].id === id)
      inputId = board.items[i + 1].id;
  }
  let have = false;
  if (inputId >= 0) {
    for (let i = 0; i < massroute.ways.length; i++) {
      let rec = massroute.ways[i];
      if (rec.sourceArea === area && rec.sourceID === id)
        if (rec.targetID === inputId) have = true;
    }
  }
  return (
    <Box sx={{ color: !have ? "#F8FCF3" : "#9265ff" }}>
      <b>⬇</b>
    </Box>
  );
};

export const InputArrow = (board: any, id: number, massroute: any) => {
  let exitId = -1;
  let area = board.items[0].area;
  for (let i = 0; i < board.items.length; i++) {
    if (i && board.items[i].id === id) exitId = board.items[i - 1].id;
  }
  let have = false;
  if (exitId >= 0) {
    for (let i = 0; i < massroute.ways.length; i++) {
      let rec = massroute.ways[i];
      if (rec.targetArea === area && rec.targetID === id)
        if (rec.sourceID === exitId) have = true;
    }
  }
  return (
    <Box sx={{ color: !have ? "#F8FCF3" : "#7dc36b" }}>
      <b>⬆</b>
    </Box>
  );
};
//=== PKFormXX ========================================================
export const TablStr = (xss: number, arg: any, style: any) => {
  return (
    <>
      {xss ? (
        <Grid item xs={xss} sx={style}>
          {arg}
        </Grid>
      ) : (
        <Grid item xs sx={style}>
          {arg}
        </Grid>
      )}
    </>
  );
};
//=== WindPK ==========================================================
export const StrokaTablWindPK = (rec1: string, rec2: any) => {
  return (
    <Grid container sx={{ marginBottom: 0.5 }}>
      <Grid item xs={8} sx={{ border: 0 }}>
        {rec1}
      </Grid>
      <Grid item xs sx={{ border: 0 }}>
        <b>{rec2}</b>
      </Grid>
    </Grid>
  );
};
//=== SetupPK =========================================================
export const FooterContent = (SaveForm: Function) => {
  return (
    <Box sx={styleSetPK04}>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 0px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(0)}>
          Выйти без сохранения
        </Button>
      </Box>
      <Box sx={{ display: "inline-block", margin: "0px 5px 0px 5px" }}>
        <Button sx={styleFormPK03} onClick={() => SaveForm(1)}>
          Сохранить изменения
        </Button>
      </Box>
    </Box>
  );
};
//=====================================================================
