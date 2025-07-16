import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, massrouteCreate, massplanCreate } from "./redux/actions";
import { massrouteproCreate, coordinatesCreate } from "./redux/actions";
import { massdkCreate, statsaveCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import axios from "axios";

import MainMap from "./components/MainMapGl";
import AppSocketError from "./AppSocketError";
import { SoobErrorCreateWay } from "./components/MapSocketFunctions";
import { SoobErrorDeleteWay } from "./components/MapSocketFunctions";
import { SoobErrorCreateWayToPoint } from "./components/MapSocketFunctions";
import { SoobErrorDeleteWayToPoint } from "./components/MapSocketFunctions";
import { SoobErrorCreateWayFromPoint } from "./components/MapSocketFunctions";
import { SoobErrorDeleteWayFromPoint } from "./components/MapSocketFunctions";

import { ZONE, zoomStart } from "./components/MapConst";

import { PlanCoord } from "./interfacePlans.d";
//import { DatePlan } from "./interfacePlans.d";
//import { DateRoute } from "./interfaceRoute.d";
//import { Tflight } from "./interfaceMAP.d";
import { dataMap } from "./otladkaMaps";
import { dataRoute } from "./otladkaRoutes";
import { dataPlan } from "./otladkaPlans";

export let dateMapGl: any;
export let dateRouteGl: any;
export let dateRouteProGl: any;
export let datePlan: any;

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
  subarea: number;
  phases: number[];
  newCoordinates: number;
}
export let massDk: Pointer[] = [];

export interface Router {
  region: number;
  sourceArea: number;
  sourceID: number;
  targetArea: number;
  targetID: number;
  lsource: number;
  ltarget: number;
  starts: string;
  stops: string;
  lenght: number;
  time: number;
}

export interface Directions {
  name: string; // номер направления
  satur: number; // Насыщение(т.е./ч.)
  intensTr: number; // Интенсивность(т.е./ч.)
  dispers: number; // Дисперсия пачки(%)
  peregon: number; // Длинна перегона(м)
  wtStop: number; // Вес остановки
  wtDelay: number; // Вес задержки
  offsetBeginGreen: number; // Смещ.начала зелёного(сек)
  offsetEndGreen: number; // Смещ.конца зелёного(сек)
  intensFl: number; // Интенсивность пост.потока(т.е./ч.)
  phases: Array<number>; // зелёные фазы для данного направления
  edited: boolean; //
  opponent: string; // Левый поворот конкурирует с направлением...
}

export interface Stater {
  ws: any;
  debug: boolean;
  oldIdxForm: number;
  needMakeSpisPK: boolean; // вызов списка ПК после корректровки ПК
  lockUp: boolean; // блокировка меню районов и меню режимов
  needMenuForm: boolean; // выводить меню форм ПК
  idxMenu: number; // активная строка списка ПК
  nomMenu: number; // номер активного плана ПК
  exampleImg1: any; // отладочное изображение перекрёстка
  exampleImg2: any; // отладочное изображение перекрёстка
  have: number; // счётчик изменений в форме параметров перекрёстка
  permitСreatPoint: boolean; // разрешение создания новой точки
  permitСreatVertex: boolean; // разрешение создания нового перекрёстка
}

export let dateStat: Stater = {
  ws: null,
  debug: false,
  oldIdxForm: -1,
  needMakeSpisPK: true,
  lockUp: false,
  needMenuForm: false,
  idxMenu: 0,
  nomMenu: -1, // номер активного плана ПК
  exampleImg1: null,
  exampleImg2: null,
  have: 0,
  permitСreatPoint: true, // разрешение создания новой точки
  permitСreatVertex: true, // разрешение создания нового перекрёстка
};

export let massRoute: Router[] = [];
export let massPlan: PlanCoord[] = [];
export let massRoutePro: Router[] = [];
export let Coordinates: Array<Array<number>> = []; // массив координат
export let WS: any = null;
export let debug = false;

let flagOpen = true;
let flagOpenКостыль = true;
let flagOpenWS = true;
let homeRegion: any = "";
let soob = "";

const App = () => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });

  let coordinates = useSelector((state: any) => {
    const { coordinatesReducer } = state;
    return coordinatesReducer.coordinates;
  });

  const dispatch = useDispatch();
  //========================================================
  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  const [openMapGl, setOpenMapGl] = React.useState(false);
  const [findMapInfo, setFindMapInfo] = React.useState(false);
  const [findGraphInfo, setFindGraphInfo] = React.useState(false);
  const [openSetErr, setOpenSetErr] = React.useState(false);
  const [trigger, setTrigger] = React.useState(false);
  const [addRoute, setAddRoute] = React.useState(false);
  const [svg, setSvg] = React.useState<any>(null);

  const FilterMapInfo = React.useCallback(
    (data: any) => {
      console.log("MAP:", homeRegion, ZONE, JSON.parse(JSON.stringify(data)));
      dateMapGl = data;
      if (homeRegion) {
        dateMapGl.tflight = dateMapGl.tflight.filter(
          (user: { region: { num: any } }) =>
            user.region.num === homeRegion.toString()
        );
      }
      if (ZONE) {
        dateMapGl.tflight = dateMapGl.tflight.filter(
          (user: { area: { num: string } }) => user.area.num === ZONE.toString()
        );
      }
      //console.log("!3FilterArea:", JSON.parse(JSON.stringify(dateMapGl)));
      dispatch(mapCreate(dateMapGl));
      setFindMapInfo(true);
    },
    [dispatch]
  );
  const FilterGraphInfo = React.useCallback(() => {
    //console.log("1dateRouteGl:", ZONE, JSON.parse(JSON.stringify(dateRouteGl)));
    if (ZONE) {
      dateRouteGl.vertexes = dateRouteGl.vertexes.filter(
        (user: { area: number }) => user.area === ZONE
      );
    }
  }, []);

  const Initialisation = () => {
    // достать начальный zoom Yandex-карты Map из LocalStorage
    if (window.localStorage.ZoomMap === undefined)
      window.localStorage.ZoomMap = zoomStart;

    // достать центр координат [0] Yandex-карты Map из LocalStorage
    if (window.localStorage.PointCenterMap0 === undefined)
      window.localStorage.PointCenterMap0 = 0;

    // достать центр координат [1] Yandex-карты Map из LocalStorage
    if (window.localStorage.PointCenterMap1 === undefined)
      window.localStorage.PointCenterMap1 = 0;
  };
  //=== инициализация ======================================
  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
    dateStat.ws = WS;
    if (
      WS.url.slice(0, 20) === "wss://localhost:3000" ||
      WS.url.slice(0, 27) === "wss://andrey-omsk-63.github"
    )
      dateStat.debug = debug = true;
    dispatch(statsaveCreate(dateStat));
    let pageUrl = new URL(window.location.href);
    homeRegion = Number(pageUrl.searchParams.get("Region"));
    //if (!debug) homeRegion = 2; // костыль, потом поменять

    console.log("WS.url:", WS.url, homeRegion);
  }

  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log("WS.current.onopen:", event);
    };

    WS.onclose = function (event: any) {
      console.log("WS.current.onclose:", event);
    };

    WS.onerror = function (event: any) {
      console.log("WS.current.onerror:", event);
    };

    WS.onmessage = function (event: any) {
      let allData = JSON.parse(event.data);
      let data = allData.data;
      console.log("пришло:", allData.type, data);
      switch (allData.type) {
        case "mapInfo":
          FilterMapInfo(data); // берём в работу заданный район и регион
          break;
        case "graphInfo":
          let pointRab = JSON.parse(JSON.stringify(data));
          pointRab.points = []; // массив протоколов
          pointRab.vertexes = [];
          pointRab.ways = [];
          dateRouteProGl = JSON.parse(JSON.stringify(pointRab));
          dateRouteGl = JSON.parse(JSON.stringify(data));
          if (dateRouteGl.points === null) dateRouteGl.points = [];
          if (dateRouteGl.vertexes === null) dateRouteGl.vertexes = [];
          if (dateRouteGl.ways === null) dateRouteGl.ways = [];
          FilterGraphInfo();
          dispatch(massrouteCreate(dateRouteGl));
          dispatch(massrouteproCreate(dateRouteProGl));
          setFindGraphInfo(true);
          break;
        case "createPoint":
          if (data.status) {
            dateRouteGl.vertexes[dateRouteGl.vertexes.length - 1].id = data.id; // прописывакм реальное ID
            dateRouteGl.vertexes[dateRouteGl.points.length - 1].id = data.id;
            massdk[massdk.length - 1].ID = data.id;
            //console.log("createPoint:", { ...dateRouteGl }, { ...massdk });
            setTrigger(!trigger);
          } else {
            dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1); // произошла ошибка
            dateRouteGl.vertexes.splice(dateRouteGl.points.length - 1, 1);
            massdk.splice(massdk.length - 1, 1);
            coordinates.splice(coordinates.length - 1, 1);
            soob = "Произошла ошибка при создании точки";
            setOpenSetErr(true);
            dispatch(coordinatesCreate(coordinates));
          }
          dateStat.permitСreatPoint = true; // можно создавать новые точки
          dispatch(statsaveCreate(dateStat));
          dispatch(massrouteCreate(dateRouteGl));
          dispatch(massdkCreate(massdk));
          //console.log("createPoint:", data, dateRouteGl, massdk);
          break;
        case "deletePoint":
          if (!data.status) {
            soob = "Произошла ошибка при удалении точки";
            setOpenSetErr(true);
          }
          break;
        case "createVertex":
          if (!data.status) {
            dateRouteGl.vertexes.splice(dateRouteGl.vertexes.length - 1, 1);
            massdk.splice(massdk.length - 1, 1);
            coordinates.splice(coordinates.length - 1, 1);
            soob = "Произошла ошибка при создании перекрёстка";
            setOpenSetErr(true);
            dispatch(coordinatesCreate(coordinates));
            dispatch(massrouteCreate(dateRouteGl));
            dispatch(massdkCreate(massdk));
          }
          break;
        case "deleteVertex":
          if (!data.status) {
            soob = "Произошла ошибка при удалении перекрёстка";
            setOpenSetErr(true);
          }
          break;
        case "createWay": //
          if (data) {
            if (!data.status) {
              soob = SoobErrorCreateWay(data);
              dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
              dateRouteProGl.ways.splice(dateRouteProGl.ways.length - 1, 1);
              dispatch(massrouteproCreate(dateRouteProGl));
              dispatch(massrouteCreate(dateRouteGl));
              setOpenSetErr(true); // запрос на вывод сообщения об ошибке
              setAddRoute(true); // запрос на перерисовку связей
            }
          }
          //console.log("createWay:", data, { ...dateRouteGl });
          break;
        case "deleteWay":
          if (!data.status) {
            soob = SoobErrorDeleteWay(data);
            setOpenSetErr(true);
          }
          break;
        case "createWayToPoint":
          if (!data.status) {
            soob = SoobErrorCreateWayToPoint(data);
            dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
            dispatch(massrouteCreate(dateRouteGl));
            dateRouteProGl.ways.splice(dateRouteProGl.ways.length - 1, 1);
            dispatch(massrouteproCreate(dateRouteProGl));
            setOpenSetErr(true);
            setAddRoute(true); // запрос на перерисовку связей
          }
          break;
        case "deleteWayToPoint":
          if (!data.status) {
            soob = SoobErrorDeleteWayToPoint(data);
            setOpenSetErr(true);
          }
          break;
        case "createWayFromPoint":
          if (!data.status) {
            soob = SoobErrorCreateWayFromPoint(data);
            console.log("createWayFromPoint:", soob);
            dateRouteGl.ways.splice(dateRouteGl.ways.length - 1, 1);
            dispatch(massrouteCreate(dateRouteGl));
            dateRouteProGl.ways.splice(dateRouteProGl.ways.length - 1, 1);
            dispatch(massrouteproCreate(dateRouteProGl));
            setOpenSetErr(true);
            setAddRoute(true); // запрос на перерисовку связей
          }
          break;
        case "deleteWayFromPoint":
          if (!data.status) {
            soob = SoobErrorDeleteWayFromPoint(data);
            setOpenSetErr(true);
          }
          break;
        case "getSvg":
          if (data) {
            if (!data.status) {
              soob = "Ошибка при получении изображений перекрёстков";
              setOpenSetErr(true);
              setSvg(null);
            } else setSvg(data.svg);
            //} else setSvg(null);
          }
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [
    dispatch,
    massdk,
    coordinates,
    trigger,
    FilterMapInfo,
    FilterGraphInfo,
  ]);

  if (dateStat.debug && flagOpen) {
    console.log("РЕЖИМ ОТЛАДКИ!!!");
    flagOpen = false;
    let road =
      window.location.origin.slice(0, 22) === "https://localhost:3000"
        ? "https://localhost:3000/"
        : "./";
    FilterMapInfo(dataMap); // берём в работу заданный район и регион
    dateRouteGl = { ...dataRoute.data };
    // массив протоколов
    dateRouteProGl = { ...dataRoute.data };
    dateRouteProGl.points = [];
    dateRouteProGl.vertexes = [];
    dateRouteProGl.ways = [];
    FilterGraphInfo();
    dispatch(massrouteCreate(dateRouteGl));
    dispatch(massrouteproCreate(dateRouteProGl));

    axios.get(road + "otladkaPlans.json").then(({ data }) => {
      datePlan = data.data;
      dispatch(massplanCreate(datePlan));
    });
    axios.get(road + "examplSvg0.svg").then(({ data }) => {
      dateStat.exampleImg1 = data;
      dispatch(statsaveCreate(dateStat));
    });
    axios.get(road + "examplSvg2.svg").then(({ data }) => {
      dateStat.exampleImg2 = data;
      dispatch(statsaveCreate(dateStat));
    });
    setFindGraphInfo(true);
  } else {
    if (flagOpenКостыль) {
      datePlan = { ...dataPlan.data }; // временный костыль
      dispatch(massplanCreate(datePlan));
      console.log("datePlan:", datePlan);
      flagOpenКостыль = false;
    }
  }

  //console.log('Add:',openMapGl, findMapInfo, findGraphInfo)

  if (!openMapGl && findMapInfo && findGraphInfo) {
    Initialisation();
    setOpenMapGl(true);
  }

  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#E9F5D8" }}>
      <Grid item xs>
        {openSetErr && <AppSocketError sErr={soob} setOpen={setOpenSetErr} />}
        {openMapGl && (
          <MainMap
            region={homeRegion}
            svg={svg}
            setSvg={setSvg}
            add={addRoute}
            setAdd={setAddRoute}
            trigger={trigger}
            //openSetErr={openSetErr}
            sErr={soob}
            //setOpenSetErr={{}}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default App;
