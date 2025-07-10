//import { Way } from "./../interfaceRoute";
import { debug, WS } from "./../App";

import { TypeDefinit } from "./MapServiceFunctions";

//=== SendSocket ===================================
export const SendSocketCreatePoint = (
  codCoord: string,
  adress: string,
  subarea: number // на самом деле это подрайон
) => {
  console.log("CreatePoint:", adress, subarea, typeof subarea);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "createPoint",
            data: {
              position: codCoord,
              name: adress,
              area: subarea, // на самом деле это подрайон
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketDeletePoint = (id: number) => {
  console.log("DeletePoint:", id);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(JSON.stringify({ type: "deletePoint", data: { id } }));
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketCreateVertex = (
  region: number,
  area: number,
  ID: number
) => {
  console.log("CreateVertex:", region, area, ID);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketDeleteVertex = (
  region: string,
  area: string,
  id: number
) => {
  console.log("DeleteVertex:", area, id);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({ type: "deleteVertex", data: { region, area, id } })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketCreateWay = (
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  console.log("CreateWay:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketDeleteWay = (fromCr: any, toCr: any) => {
  console.log("DeleteWay:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
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
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketCreateWayFromPoint = (
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  console.log("CreateWayFromPoint:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "createWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
              toCross: {
                region: toCr.pointBbRegin,
                area: toCr.pointBbArea,
                id: toCr.pointBbID,
              },
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketDeleteWayFromPoint = (fromCr: any, toCr: any) => {
  console.log("DeleteWayFromPoint:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "deleteWayFromPoint",
            data: {
              fromPoint: fromCr.pointAaID,
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
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketCreateWayToPoint = (
  fromCr: any,
  toCr: any,
  massBind: Array<number>,
  reqRoute: any
) => {
  console.log("CreateWayToPoint:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "createWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              lsource: massBind[0],
              ltarget: massBind[1],
              lenght: reqRoute.dlRoute,
              time: reqRoute.tmRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketDeleteWayToPoint = (fromCr: any, toCr: any) => {
  console.log("DeleteWayToPoint:", fromCr, toCr);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "deleteWayToPoint",
            data: {
              fromCross: {
                region: fromCr.pointAaRegin,
                area: fromCr.pointAaArea,
                id: fromCr.pointAaID,
              },
              toPoint: toCr.pointBbID,
              // lenght: reqRoute.dlRoute,
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};

export const SendSocketGetSvg = (
  region: number,
  areaIn: number, // нужен обязвтельно район, а не подрайон
  idIn: number,
  areaOn: number, // нужен обязвтельно район, а не подрайон
  idOn: number
) => {
  console.log("SendSocketGetSvg:", region, areaIn, idIn, areaOn, idOn);

  if (!debug) {
    const handleSendOpen = () => {
      if (WS.readyState === WebSocket.OPEN) {
        WS.send(
          JSON.stringify({
            type: "getSvg",
            data: {
              devices: [
                {
                  region: region.toString(),
                  area: areaIn.toString(),
                  id: idIn,
                },
                {
                  region: region.toString(),
                  area: areaOn.toString(),
                  id: idOn,
                },
              ],
            },
          })
        );
      } else {
        setTimeout(() => {
          handleSendOpen();
        }, 100);
      }
    };
    handleSendOpen();
  }
};
//==================================================
export const SocketDeleteWay = (massroute: any, i: number) => {
  let ways = massroute.ways[i];
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

  fromCross.pointAaRegin = ways.region.toString();
  fromCross.pointAaArea = ways.sourceArea.toString();
  fromCross.pointAaID = ways.sourceID;
  fromCross.pointAcod = ways.starts;
  toCross.pointBbRegin = ways.region.toString();
  toCross.pointBbArea = ways.targetArea.toString();
  toCross.pointBbID = ways.targetID;
  toCross.pointBcod = ways.stops;
  // if (ways.sourceArea === 0) {
  if (!TypeDefinit(massroute, ways.sourceID)) {
    SendSocketDeleteWayFromPoint(fromCross, toCross);
  } else {
    // if (ways.targetArea === 0) {
    if (!TypeDefinit(massroute, ways.targetID)) {
      SendSocketDeleteWayToPoint(fromCross, toCross);
    } else {
      SendSocketDeleteWay(fromCross, toCross);
    }
  }
};
//=== SoobErrorSocket ==============================
export const SoobErrorCreateWay = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (подрайон:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (подрайон:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWay = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (подрайон:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c перекрёстком (подрайон:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorCreateWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи перекрёстка (подрайон:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorDeleteWayToPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи перекрёстка (подрайон:" +
    data.fromCross.area +
    " ID:" +
    data.fromCross.id +
    ") c точкой";
  return soob;
};

export const SoobErrorCreateWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при создании связи точки с перекрёстком (подрайон:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};

export const SoobErrorDeleteWayFromPoint = (data: any) => {
  let soob =
    "Произошла ошибка при удалении связи точки с перекрёстком (подрайон:" +
    data.toCross.area +
    " ID:" +
    data.toCross.id +
    ")";
  return soob;
};
