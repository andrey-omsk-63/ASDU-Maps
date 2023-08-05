import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import { Pointer, Router } from "./../App";
import { Vertex } from "./../interfaceRoute";

import { styleModalMenu } from "./MainMapStyle";

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
    lin: [],
    lout: [],
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

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const DoublRoute = (massroute: any, pointA: any, pointB: any) => {
  let flDubl = false;
  let pointAcod = CodingCoord(pointA);
  let pointBcod = CodingCoord(pointB);
  for (let i = 0; i < massroute.length; i++) {
    if (massroute[i].starts === pointAcod && massroute[i].stops === pointBcod)
      flDubl = true;
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

export const InputArea = (func: any, currency: any, currencies: any) => {
  const handleKey = (event: any) => {
    if (event.key === "Enter") event.preventDefault();
  };

  const styleSetArea = {
    width: "150px",
    maxHeight: "2px",
    minHeight: "2px",
    bgcolor: "#93D145",
    border: 1,
    borderRadius: 1.5,
    borderColor: "#93D145",
    textAlign: "center",
    p: 1.25,
  };

  const styleBoxFormArea = {
    "& > :not(style)": {
      marginTop: "-10px",
      marginLeft: "-15px",
      width: "175px",
    },
  };

  return (
    <Box sx={styleSetArea}>
      <Box component="form" sx={styleBoxFormArea}>
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

//=== Placemark =====================================
export const getPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  map: any
) => {
  let idxMap = -1;
  for (let i = 0; i < map.dateMap.tflight.length; i++) {
    if (
      map.dateMap.tflight[i].ID === massdk[index].ID &&
      Number(map.dateMap.tflight[i].area.num) === massdk[index].area
    ) {
      idxMap = i;
      break;
    }
  }
  let cont3 = "";
  //console.log("!!!", index, idxMap, massdk[index].area);
  //if (massdk[index].area) cont3 = ', ' + map.dateMap.tflight[idxMap].idevice;
  if (idxMap >= 0) cont3 = ", " + map.dateMap.tflight[idxMap].idevice;
  let cont1 = massdk[index].nameCoordinates + "<br/>";
  //let cont2 = '[' + massdk[index].region + ', ' + massdk[index].area;
  let cont2 = "[" + massdk[index].area;
  cont2 += ", " + massdk[index].ID + cont3 + "]";
  let textBalloon = "";
  if (index === pointAaIndex) textBalloon = "Начало";
  if (index === pointBbIndex) textBalloon = "Конец";
  return {
    hintContent: cont1 + cont2,
    iconContent: textBalloon,
  };
};

export const getPointOptions = (
  debug: boolean,
  index: number,
  AREA: string,
  map: any,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  massroute: any
) => {
  let idxMap = -1;
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
    if (map.dateMap.tflight[idxMap].area.num === AREA || AREA === "0") {
      host = "https://localhost:3000/1.svg";
      if (!debug && idxMap >= 0)
        host = window.location.origin + "/free/img/trafficLights/1.svg";
      if (!debug && idxMap < 0) host = "";
    }
    return host;
  };

  let colorBalloon = "islands#violetCircleDotIcon";
  if (massroute.vertexes[index].area === 0) {
    colorBalloon = "islands#violetCircleIcon";
    if (massdk[index].newCoordinates > 0)
      colorBalloon = "islands#darkOrangeCircleIcon";
  } else {
    if (massdk[index].newCoordinates > 0) colorBalloon = 'islands#darkOrangeCircleDotIcon';
  }
  if (index === pointAaIndex) colorBalloon = "islands#redStretchyIcon";
  if (index === pointBbIndex) colorBalloon = "islands#darkBlueStretchyIcon";

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
      //iconImageHref: '/faza.png',
      // размеры метки
      iconImageSize: [30, 30],
      // её "ножки" (точки привязки)
      iconImageOffset: [-15, -30],
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
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.1,
    width: (soob.length + 10) * 6.5,
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

export const StrokaBalloon = (soob: string, func: any, mode: number) => {
  return (
    <Button sx={styleModalMenu} onClick={() => func(mode)}>
      <b>{soob}</b>
    </Button>
  );
};

export const MasskPoint = () => {
  let masskPoint: Pointer = {
    ID: -1,
    coordinates: [],
    nameCoordinates: "",
    region: 0,
    area: 0,
    newCoordinates: 0,
  };
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
