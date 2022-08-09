import { Pointer, Router } from "./../App";
import { Vertex, Way } from "./../interfaceRoute";

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
  activeRoute: any
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
  if (activeRoute) {
    masskRoute.time = Math.round(activeRoute.properties.get("duration").value);
    masskRoute.lenght = Math.round(
      activeRoute.properties.get("distance").value
    );
  }
  console.log("masskRoute:", masskRoute);
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

//=== Placemark =====================================

export const getPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any
) => {
  let textBalloon = "";
  if (index === pointAaIndex) textBalloon = "Начало";
  if (index === pointBbIndex) textBalloon = "Конец";
  return {
    hintContent: "ID:" + massdk[index].ID + " " + massdk[index].nameCoordinates, //balloonContent: PressBalloon(index), iconCaption: textBalloon,
    iconContent: textBalloon,
  };
};

export const getPointOptions = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any,
  massroute: any
) => {
  //let colorBalloon = "islands#violetStretchyIcon";
  let colorBalloon = "islands#violetCircleDotIcon";
  if (massroute.vertexes[index].area === 0) {
    colorBalloon = "islands#violetCircleIcon";
    if (massdk[index].newCoordinates > 0)
      colorBalloon = "islands#darkOrangeCircleIcon";
  } else {
    if (massdk[index].newCoordinates > 0)
      colorBalloon = "islands#darkOrangeCircleDotIcon";
  }
  if (index === pointAaIndex) colorBalloon = "islands#redStretchyIcon";
  if (index === pointBbIndex) colorBalloon = "islands#darkBlueStretchyIcon";
  return {
    preset: colorBalloon,
  };
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
  };
};

export const getMassPolyRouteOptions = () => {
  return {
    balloonCloseButton: false,
    strokeColor: "#1A9165",
    strokeWidth: 2,
  };
};

export const getMassMultiRouteOptions = () => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    strokeColor: "#1A9165",
    routeActiveStrokeWidth: 2,
    routeStrokeWidth: 0,
  };
};

export const getMassMultiRouteInOptions = () => {
  return {
    routeActiveStrokeWidth: 2,
    routeStrokeStyle: "dot",
    routeActiveStrokeColor: "#E91427",
    routeStrokeWidth: 0,
  };
};

//=== SendSocket ===================================

export const SendSocketCreatePoint = (
  debugging: boolean,
  ws: WebSocket,
  codCoord: string,
  adress: string
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createPoint",
            data: {
              position: codCoord,
              name: adress,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeletePoint = (
  debugging: boolean,
  ws: WebSocket,
  id: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "deletePoint", data: { id } }));
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateVertex = (
  debugging: boolean,
  ws: WebSocket,
  region: number,
  area: number,
  ID: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createVertex",
            data: {
              region: region.toString(),
              area: area.toString(),
              id: ID,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteVertex = (
  debugging: boolean,
  ws: WebSocket,
  region: string,
  area: string,
  id: number
) => {
  const handleSendOpen = () => {
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "deleteVertex", data: { region, area, id } })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWay = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  activeRoute: any
) => {
  const handleSendOpen = () => {
    console.log("SendSocketCreateWay");
    if (!debugging) {
      let lengthRoute = Math.round(
        activeRoute.properties.get("distance").value
      );
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWay",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              length: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWay = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any
) => {
  const handleSendOpen = () => {
    console.log("SendSocketDeleteWay");
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWay",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWayFromPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  activeRoute: any
) => {
  const handleSendOpen = () => {
    console.log("SendSocketCreateWayFromPoint");
    if (!debugging) {
      let lengthRoute = Math.round(
        activeRoute.properties.get("distance").value
      );
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              length: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWayFromPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  lengthRoute: number
) => {
  const handleSendOpen = () => {
    console.log("SendSocketDeleteWayFromPoint", lengthRoute);
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              length: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketCreateWayToPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  activeRoute: any
) => {
  const handleSendOpen = () => {
    console.log("SendSocketCreateWayToPoint:", activeRoute);
    if (!debugging) {
      let lengthRoute = Math.round(
        activeRoute.properties.get("distance").value
      );
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "createWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              length: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};

export const SendSocketDeleteWayToPoint = (
  debugging: boolean,
  ws: WebSocket,
  fromCr: any,
  toCr: any,
  lengthRoute: number
) => {
  const handleSendOpen = () => {
    console.log("SendSocketDeleteWayToPoint:", lengthRoute);
    if (!debugging) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "deleteWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              length: lengthRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 1000);
      }
    }
  };
  handleSendOpen();
};
//==================================================
export const SocketDeleteWay = (
  debugging: boolean,
  WS: WebSocket,
  ways: Way
) => {
  let fromCross: any = {
    pointAaRegin: "",
    pointAaArea: "",
    pointAaID: 0,
    pointAcod: "",
  };
  let toCross: any = {
    pointBbRegin: "",
    pointBbArea: "",
    pointBbID: 0,
    pointBcod: "",
  };
  let lengthRoute = ways.lenght;

  fromCross.pointAaRegin = ways.region.toString();
  fromCross.pointAaArea = ways.sourceArea.toString();
  fromCross.pointAaID = ways.sourceID;
  fromCross.pointAcod = ways.starts;
  toCross.pointBbRegin = ways.region.toString();
  toCross.pointBbArea = ways.targetArea.toString();
  toCross.pointBbID = ways.targetID;
  toCross.pointBcod = ways.stops;
  if (ways.sourceArea === 0) {
    SendSocketDeleteWayFromPoint(
      debugging,
      WS,
      fromCross,
      toCross,
      lengthRoute
    );
  } else {
    if (ways.targetArea === 0) {
      SendSocketDeleteWayToPoint(
        debugging,
        WS,
        fromCross,
        toCross,
        lengthRoute
      );
    } else {
      SendSocketDeleteWay(debugging, WS, fromCross, toCross);
    }
  }
};

//=== SoobErrorSocket ==============================

export const SoobErrorCreateWay = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWay = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorCreateWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorDeleteWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (район:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorCreateWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи точки с перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи точки с перекрёстком (район:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

//=== костыль ======================================
let a0 = {
  region: 0,
  starts: "55.7276995,36.8193915",
  stops: "55.69928816060674,37.39474443074465",
  length: 56425,
  time: 2792,
};
let a1 = {
  region: 0,
  starts: "55.7276995,36.8193915",
  stops: "55.60238311111584,36.483017680936115",
  length: 30452,
  time: 1790,
};
let a2 = {
  region: 0,
  starts: "55.7276995,36.8193915",
  stops: "55.62968055298542,37.021400723452174",
  length: 22476,
  time: 1430,
};
let a3 = {
  region: 0,
  starts: "55.62968055298542,37.021400723452174",
  stops: "55.69928816060674,37.39474443074465",
  length: 31326,
  time: 1808,
};
let a4 = {
  region: 0,
  starts: "55.69928816060674,37.39474443074465",
  stops: "55.905786101735075,37.7174511711464",
  length: 46435,
  time: 2667,
};
let a5 = {
  region: 0,
  starts: "55.69928816060674,37.39474443074465",
  stops: "55.913241655910504,37.8378230903432",
  length: 50578,
  time: 2600,
};
let a6 = {
  region: 0,
  starts: "55.913241655910504,37.8378230903432",
  stops: "55.905786101735075,37.7174511711464",
  length: 11600,
  time: 1174,
};
let a7 = {
  region: 0,
  starts: "55.69928816060674,37.39474443074465",
  stops: "55.65943211246696,37.92773938370481",
  length: 47717,
  time: 2627,
};
let a8 = {
  region: 0,
  starts: "55.65619605179316,38.10076639140717",
  stops: "55.408054,36.7174221",
  length: 112201,
  time: 6766,
};
let a9 = {
  region: 0,
  starts: "55.60238311111584,36.483017680936115",
  stops: "55.7276995,36.8193915",
  length: 32653,
  time: 1924,
};
export let massOtladka = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9];
