import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapCreate, commCreate, massfazCreate } from "./redux/actions";

import Grid from "@mui/material/Grid";

import MainMap from "./components/MainMapGl";

import { DateRPU } from "./interfaceRPU.d";
import { dataRpu } from "./otladkaRpuData";

import { Tflight, DateMAP } from "./interfaceMAP.d";
//import { dataMap } from './otladkaMaps';
import { dataMap } from "./otladkaMaps";

//import AppIconAsdu from './AppIconAsdu';

export let dateRpuGl: DateRPU = {} as DateRPU;
//export let dateMapGl: Tflight[] = [];
export let dateMapGl: Tflight[] = [{} as Tflight];
export let massFaz: Array<Array<number>> = [[]];

let flagOpenRpu = true;
let flagKostil = true;

let coord0 = 0;
let coord1 = 0;

let flagOpenWS = true;
//let flagWS = true;
let WS: any = null;

const App = () => {
  //== Piece of Redux ======================================
  const comm = useSelector((state: any) => {
    const { commReducer } = state;
    return commReducer.comm;
  });
  //console.log('comm_App:', comm);

  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  console.log("map_App:", map);

  const massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  //console.log('massfaz_App:', massfaz);

  const dispatch = useDispatch();

  const [pointsRpu, setPointsRpu] = React.useState<DateRPU>({} as DateRPU);
  const [isOpenRpu, setIsOpenRpu] = React.useState(false);

  const host = "wss://192.168.115.25/mapW";
  // const host =
  // 'wss://' + window.location.host + window.location.pathname + 'W' + window.location.search;

  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
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
      // if (flagWS) {
      let allData = JSON.parse(event.data);
      let data: DateMAP = allData.data;
      console.log("data_onmessage:", data);
      // dateMapGl = data.tflight;
      // dispatch(mapCreate(dateMapGl));
      //   flagWS = false;
      // }
    };
  }, []);

  if (flagOpenRpu) {
    // костыль для отладки на планшете
    setPointsRpu(dataRpu);
    setIsOpenRpu(true);
  }

  if (flagKostil) {
    // костыль для отладки дома
    //console.log('dataMap_kostil:', dataMap.tflight, dataMap);
    //вычисление координат середины связи
    let aY = dataMap.boxPoint.point0.Y;
    let aX = dataMap.boxPoint.point0.X;
    let bY = dataMap.boxPoint.point1.Y;
    let bX = dataMap.boxPoint.point1.X;
    coord0 = (aY - bY) / 2 + bY;
    if (aY < bY) coord0 = (bY - aY) / 2 + aY;
    coord1 = (aX - bX) / 2 + bX;
    if (aX < bX) coord1 = (bX - aX) / 2 + aX;

    console.log("Y:", aY, aX);
    console.log("X:", bY, bX);
    console.log("U:", coord0, coord1);

    dateMapGl = dataMap.tflight;
    dispatch(mapCreate(dateMapGl));
    flagKostil = false;
  }

  if (isOpenRpu && flagOpenRpu) {
    dateRpuGl = pointsRpu;

    // входящий контроль pointsRpu
    for (let i = 0; i < dateRpuGl.tirtonap.length; i++) {
      let massRab = [0, 0, 0];
      for (let j = 0; j < dateRpuGl.tirtonap[i].reds.length; j++) {
        massRab[j] = dateRpuGl.tirtonap[i].reds[j];
      }
      dateRpuGl.tirtonap[i].reds = massRab;
    }
    dispatch(commCreate(dateRpuGl));

    // инициализация massFaza
    let kolFaz = dateRpuGl.timetophases.length;
    massFaz = Array.from({ length: kolFaz }, () =>
      Array.from({ length: dateRpuGl.tirtonap.length }, () => 0)
    );
    for (let i = 0; i < kolFaz; i++) {
      // i - столбец
      for (let j = 0; j < dateRpuGl.tirtonap.length; j++) {
        // j - строка
        if (dateRpuGl.naptoph[i].naps.includes(j + 1)) {
          massFaz[i][j] = j + 1;
        }
      }
    }
    dispatch(massfazCreate(massFaz));
    flagOpenRpu = false;
  }

  return (
    <Grid
      container
      sx={{ height: "100vh", width: "100%", backgroundColor: "#F1F5FB" }}
    >
      <Grid item xs>
        <MainMap Y={coord0} X={coord1} />
      </Grid>
    </Grid>
  );
};

export default App;
