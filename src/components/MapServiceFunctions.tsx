import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

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
import { styleInpKnop } from "./MainMapStyle";
import { styleBind02, styleTypography, searchControl } from "./MainMapStyle";

const handleKey = (event: any) => {
  if (event.key === "Enter") event.preventDefault();
};

export const MassCoord = (mass: any) => {
  return [mass.coordinates[0], mass.coordinates[1]];
};

export const MapssdkNewPoint = (
  homeRegion: number,
  coords: any,
  name: string,
  area: number,
  id: number
) => {
  let masskPoint: Pointer = {
    ID: 0,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    newCoordinates: 0,
  };

  masskPoint.ID = id;
  masskPoint.coordinates = coords;
  masskPoint.nameCoordinates = name;
  masskPoint.region = homeRegion;
  masskPoint.area = area;
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
  AREA: string,
  FlagDemo: boolean,
  massroute: any
) => {
  let massRoute: any = [];
  if (AREA === "0" && FlagDemo) massRoute = massroute.ways;
  if (AREA !== "0" && FlagDemo) {
    for (let i = 0; i < massroute.ways.length; i++)
      if (
        massroute.ways[i].sourceArea.toString() === AREA ||
        massroute.ways[i].targetArea.toString() === AREA
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
  // let pointAcod = CodingCoord(pointA);
  // let pointBcod = CodingCoord(pointB);
  // for (let i = 0; i < massroute.length; i++) {
  //   if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
  //     flDubl = true;
  // }
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
  let dat = ["Создание связей", "Перекрёстки"];
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

export const PreparCurrencies = (dat: any) => {
  const currencies: any = [];
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
  currencies.push({ ...maskCurrencies });
  for (let i = 0; i < massKey.length; i++) {
    maskCurrencies.value = massKey[i];
    maskCurrencies.label = massDat[i];
    currencies.push({ ...maskCurrencies });
  }
  return currencies;
};

export const InputMenu = (func: any, currency: any, currencies: any) => {
  const styleSet = {
    width: "150px",
    maxHeight: "2px",
    minHeight: "2px",
    marginLeft: 0.3,
    bgcolor: "#93D145",
    border: 1,
    borderRadius: 1,
    borderColor: "#93D145",
    textAlign: "center",
    p: 1.25,
  };

  const styleBoxForm = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "175px",
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
  map: any,
  MODE: string
) => {
  let idxMap = ComplianceMapMassdk(index, massdk, map);
  let cont3 = ", null";
  if (idxMap >= 0) cont3 = ", " + map.dateMap.tflight[idxMap].idevice;
  let cont1 = massdk[index].nameCoordinates + "<br/>";
  //let cont2 = '[' + massdk[index].region + ', ' + massdk[index].area;
  let cont2 = "[" + massdk[index].area;
  cont2 += ", " + massdk[index].ID + cont3 + "]";
  let textBalloon = "";
  if (index === pointAaIndex && MODE === "0") textBalloon = "Начало";
  if (index === pointBbIndex && MODE === "0") textBalloon = "Конец";

  return {
    hintContent: cont1 + cont2,
    iconContent: textBalloon,
  };
};

export const getPointOptions = (
  debug: boolean,
  index: number,
  AREA: string,
  MODE: string,
  map: any,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  massroute: any
) => {
  let idxMap = -1;
  let Area = massdk[index].area.toString();
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    if (
      map.dateMap.tflight[i].ID === massdk[index].ID &&
      Number(map.dateMap.tflight[i].area.num) === massdk[index].area
    ) {
      idxMap = i;
      break;
    }
  }
  const Hoster = () => {
    let host = "";
    if (idxMap >= 0) {
      if (Area === AREA || AREA === "0") {
        host = "http://localhost:3000/1.svg";
        if (!debug && idxMap >= 0)
          host = window.location.origin + "/free/img/trafficLights/1.svg";
        if (!debug && idxMap < 0) host = "";
      }
    }
    //================================= потом исправить ======
    if (massdk[index].newCoordinates > 0) {
      if (Area === AREA || AREA === "0") {
        host = "http://localhost:3000/18.svg";
        if (!debug)
          host = window.location.origin + "/free/img/trafficLights/18.svg";
      }
    }
    //========================================================
    if (MODE === "1") {
      if (index === pointBbIndex || index === pointAaIndex) {
        host = "http://localhost:3000/4.svg";
        if (!debug)
          host = window.location.origin + "/free/img/trafficLights/4.svg";
      }
    }
    return host;
  };

  let colorBalloon = "islands#violetCircleDotIcon";
  if (massroute.vertexes[index].area === 0) {
    colorBalloon = "islands#violetCircleIcon";
    if (massdk[index].newCoordinates > 0)
      colorBalloon = "islands#darkOrangeCircleIcon";
  }
  //  else {
  //   if (massdk[index].newCoordinates > 0)
  //     colorBalloon = "islands#darkOrangeCircleDotIcon";
  // }
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

//=== addRoute =====================================

export const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

export const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 5,
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 1.5,
    wayPointVisible: false,
  };
};

export const getMassPolyRouteOptions = () => {
  return {
    balloonCloseButton: false,
    strokeColor: "#1A9165",
    strokeWidth: 1,
  };
};

export const getMassMultiRouteOptions = () => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    strokeColor: "#1A9165",
    routeActiveStrokeWidth: 2,
    routeStrokeWidth: 0,
    wayPointVisible: false,
  };
};

export const getMassMultiRouteInOptions = () => {
  return {
    routeActiveStrokeWidth: 2,
    routeStrokeStyle: "dot",
    routeActiveStrokeColor: "#E91427",
    routeStrokeWidth: 0,
    //=======
    wayPointVisible: false,
  };
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
    marginLeft: 0.2,
    width: MesssgeLength(soob, 14) + 32,
    maxHeight: "21px",
    minHeight: "21px",
    backgroundColor: "#C4EAA2",
    //backgroundColor: "#E9F5D8",
    color: "black",
    textTransform: "unset !important",
    p: 1.5,
  };

  return (
    <Button sx={styleApp01} onClick={() => func(mode)}>
      <b>{soob}</b>
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
      {!flagDemo && <>{StrokaMenuGlob("Формальн.Связи", PressButton, 3)}</>}
      {flagDemo && <>{StrokaMenuGlob("Отключить ФС", PressButton, 6)}</>}
    </>
  );
};

export const MenuProcesRoute = (
  flagPusk: boolean,
  flagBind: boolean,
  flagRoute: boolean,
  PressButton: Function
) => {
  return (
    <>
      {flagPusk && !flagBind && (
        <>{StrokaMenuGlob("Отм.назначений", PressButton, 77)}</>
      )}
      {flagPusk && flagRoute && !flagBind && (
        <>
          {StrokaMenuGlob("Сохр.связь", PressButton, 33)}
          {StrokaMenuGlob("Реверc связи", PressButton, 12)}
          {StrokaMenuGlob("Редакт.связи", PressButton, 69)}
        </>
      )}
      {flagPusk && flagRoute && flagBind && (
        <>
          {StrokaMenuGlob("Сохр.связь", PressButton, 33)}
          {StrokaMenuGlob("Отм.связь", PressButton, 77)}
          {StrokaMenuGlob("Редакт.связи", PressButton, 69)}
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
    <>
      <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
        <b>&#10006;</b>
      </Button>
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        {!areaPoint && (
          <>{StrokaBalloon("Редактирование адреса", handleClose, 4)}</>
        )}
      </Box>
      <Typography variant="h6" sx={styleTypography}>
        Перестроение связи:
      </Typography>
      <Box sx={{ marginTop: 1, textAlign: "center" }}>
        {StrokaBalloon("Начальная точка", handleClose, 1)}
        {StrokaBalloon("Конечная точка", handleClose, 2)}
      </Box>
    </>
  );
};

export const MasskPoint = (massrouteVertexes: any) => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    newCoordinates: 0,
  };
  masskPoint.ID = massrouteVertexes.id;
  masskPoint.coordinates = DecodingCoord(massrouteVertexes.dgis);
  masskPoint.nameCoordinates = massrouteVertexes.name;
  masskPoint.region = massrouteVertexes.region;
  masskPoint.area = massrouteVertexes.area;
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

export const DelVertexOrPoint = (
  openSetDelete: boolean,
  massdk: any,
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
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
  };

  return (
    <Modal
      open={openSetDelete}
      onClose={() => handleCloseDel(false)}
      hideBackdrop
    >
      <Box sx={styleSetPoint}>
        <Button sx={styleModalEndMapGl} onClick={() => handleCloseDel(false)}>
          <b>&#10006;</b>
        </Button>
        <Typography variant="h6" sx={{ color: "red" }}>
          Предупреждение
        </Typography>
        <Box>
          Будут удалены {soob}&nbsp;
          <b>
            [{massdk[idx].area}, {massdk[idx].ID}
            ]&nbsp;&nbsp;
            {massdk[idx].nameCoordinates}
          </b>{" "}
          и все связи с ним
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
    border: "3px solid #000",
    borderColor: "primary.main",
    borderRadius: 2,
    boxShadow: 24,
    textAlign: "center",
    p: 1,
  };

  const styleModalMenu = {
    marginTop: 0.5,
    backgroundColor: "#E6F5D6",
    textTransform: "unset !important",
    color: "black",
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

export const InputAdressVertex = (
  openSetInpAdres: boolean,
  handleCloseInp: Function,
  valueAdr: string,
  setValueAdr: Function
) => {
  const styleSetAdres = {
    marginTop: "26vh",
    marginLeft: "46px",
    width: "318px",
    height: "7vh",
    border: "3px solid #000",
    borderColor: "#FFFEF7",
    borderRadius: 2,
    boxShadow: 24,
    bgcolor: "#FFFEF7",
    opacity: 0.85,
  };

  const styleSetAd = {
    width: "230px",
    maxHeight: "3px",
    minHeight: "3px",
    bgcolor: "#FAFAFA",
    boxShadow: 3,
    textAlign: "center",
    p: 1.5,
  };

  const styleBoxFormAdres = {
    "& > :not(style)": {
      marginTop: "-9px",
      marginLeft: "-12px",
      width: "253px",
    },
  };

  const handleChangeAdr = (event: any) => {
    let valueInp = event.target.value.replace(/^0+/, "");
    setValueAdr(valueInp);
  };

  return (
    <Modal
      open={openSetInpAdres}
      onClose={() => handleCloseInp(false)}
      hideBackdrop
    >
      <Grid item container sx={styleSetAdres}>
        <Grid item xs={9.7}>
          <Box sx={styleSetAd}>
            <Box component="form" sx={styleBoxFormAdres}>
              <TextField
                size="small"
                onKeyPress={handleKey} //отключение Enter
                type="text"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: 13.3, backgroundColor: "#FFFBE5" },
                }}
                value={valueAdr}
                onChange={handleChangeAdr}
                variant="standard"
                helperText="Введите наименование (адрес)"
                color="secondary"
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2.3}>
          <Button sx={styleInpKnop} onClick={() => handleCloseInp(true)}>
            Ввод
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};
//=== RouteBind =======================================================
export const StrokaMenuFooterBind = (
  soob: string,
  mode: number,
  handleClose: Function
) => {
  const styleAppBind = {
    fontSize: 14,
    marginRight: 0.5,
    border: "2px solid #000",
    bgcolor: "#E6F5D6",
    width: (soob.length + 9) * 7,
    maxHeight: "21px",
    minHeight: "21px",
    borderColor: "#E6F5D6",
    borderRadius: 1,
    color: "black",
    textTransform: "unset !important",
  };

  return (
    <Button
      variant="contained"
      sx={styleAppBind}
      onClick={() => handleClose(mode)}
    >
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
  return (
    <Grid item xs={7.5}>
      <Box sx={styleBind02}>
        <b>Привязка направлений</b>
      </Box>
      <Box sx={{ p: 1, fontSize: 16, textAlign: "center" }}>
        из <b>{nameA}</b>
      </Box>
      <Box sx={{ p: 1, fontSize: 16, textAlign: "center" }}>
        в <b>{nameB}</b>
      </Box>
      <Box sx={{ p: 1, fontSize: 14, textAlign: "center" }}>
        Длина связи: <b>{reqRoute.dlRoute}</b> м&nbsp;&nbsp;Время прохождения:{" "}
        <b>{Math.round(sec / 60)} мин&nbsp;&nbsp;</b>Средняя скорость
        прохождения: <b>{sRoute}</b> км/ч
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
