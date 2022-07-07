import React from "react";
import {
  useDispatch,
  //useSelector
} from "react-redux";
import {
  mapCreate,
  massrouteCreate,
  //commCreate,
  // massdkCreate
} from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMap from "./components/MainMapGl";
//import { CenterCoord } from "./components/MapServiceFunctions";

//import { DateMAP } from './interfaceMAP.d';
import { DateRoute } from './interfaceRoute.d';
//import { Tflight } from "./interfaceMAP.d";
import { dataMap } from "./otladkaMaps";
import { dataRoute } from "./otladkaRoutes";

export let dateMapGl: any;
export let dateRouteGl: any;
//export let dateRouteGl: dataRoute;

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: number;
  area: number;
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
  length: number;
  time: number;
}
export let massRoute: Router[] = [];

let flagOpen = true;
let flagRoute = 0;

let flagOpenWS = true;
//let flagWS = true;
let WS: any = null;
let homeRegion: any = "";

const App = () => {
  //== Piece of Redux ======================================
  // const comm = useSelector((state: any) => {
  //   const { commReducer } = state;
  //   return commReducer.comm;
  // });
  // //console.log('comm_App:', comm);

  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  //console.log("map_App:", map);

  // const massdk = useSelector((state: any) => {
  //   const { massdkReducer } = state;
  //   return massdkReducer.massdk;
  // });
  //console.log("massdk_App:", massdk);

  const dispatch = useDispatch();
  //========================================================

  //const host = "wss://192.168.115.25/mapW";
  //const host = "wss://192.168.115.25/user/andrey_omsk/graphManageW";
  const host =
    "wss://" +
    window.location.host +
    window.location.pathname +
    "W" +
    window.location.search;

  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
    let pageUrl = new URL(window.location.href);
    homeRegion = pageUrl.searchParams.get("Region");
    console.log("WS:", WS);
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
          console.log("mapInfo:", data);
          dateMapGl = data;
          dispatch(mapCreate(dateMapGl));
          break;
        case "graphInfo":
          console.log("graphInfo:", data);
          dateRouteGl = data;
          flagRoute = 1; // успешное прочтение
          dispatch(massrouteCreate(dateRouteGl));
          break;
        default:
          console.log("data_default:", data);
      }
    };
  }, [WS, dispatch]);

  //для отладки

  // if (flagOpen) {
  //   dateMapGl = dataMap;
  //   flagRoute = 1;
  //   dispatch(mapCreate(dateMapGl));
  //   dateRouteGl = dataRoute.data;
  //   flagOpen = false;
  //   dispatch(massrouteCreate(dateRouteGl));
  // }

  //отслеживание изменения размера экрана - костыль, делает ререндер
  // const [size, setSize] = React.useState(0);
  // React.useLayoutEffect(() => {
  //   function updateSize() {
  //     setSize(window.innerWidth);
  //   }
  //   window.addEventListener("resize", updateSize);
  //   updateSize();
  //   return () => window.removeEventListener("resize", updateSize);
  // }, []);

  // if (flagRoute === 1) {
  //   console.log("dateRouteGl:", dateRouteGl);
  //   // проверка/удаление дубликатных связей
  //   let dateRouteRab: any = [];
  //   let flagDubl = false;
  //   for (let i = 0; i < dateRouteGl.ways.length; i++) {
  //     for (let j = 0; j < dateRouteRab.length; j++) {
  //       if (
  //         dateRouteRab[j].starts === dateRouteGl.ways[i].starts &&
  //         dateRouteRab[j].stops === dateRouteGl.ways[i].stops
  //       )
  //         flagDubl = true;
  //     }
  //     if (!flagDubl) dateRouteRab.push(dateRouteGl.ways[i]);
  //     flagDubl = false;
  //   }
  //   dateRouteGl.ways.splice(0, dateRouteGl.ways.length);
  //   dateRouteGl.ways = dateRouteRab;
  //   dispatch(massrouteCreate(dateRouteGl));
  //   flagRoute = 2;
  //   //setSize(window.innerWidth + Math.random());
  // }
  console.log("dateRouteGl:", dateRouteGl);
  return (
    <Grid container sx={{ height: "100vh", width: "100%", bgcolor: "#F1F5FB" }}>
      <Grid item xs>
      <MainMap flag={flagRoute} ws={WS} region={homeRegion} />
        {/* {setTimeout(() => {<MainMap ws={WS} region={homeRegion} />}, 10000)  } */}
        
      </Grid>
    </Grid>
  );
};

export default App;
