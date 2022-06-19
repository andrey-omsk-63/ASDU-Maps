import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapCreate, commCreate, massdkCreate } from './redux/actions';

import Grid from '@mui/material/Grid';

import MainMap from './components/MainMapGl';

import { DateRPU } from './interfaceRPU.d';
import { dataRpu } from './otladkaRpuData';

import { dataMap } from './otladkaMaps';
import { Tflight, DateMAP } from './interfaceMAP.d';
//import { dataMap } from './otladkaMaps';

export let dateRpuGl: DateRPU = {} as DateRPU;
//export let dateMapGl: Tflight[] = [];
export let dateMapGl: Tflight[] = [{} as Tflight];

export interface Pointer {
  ID: number;
  coordinates: Array<number>;
  nameCoordinates: string;
  region: string;
  area: string;
  subarea: number;
  newCoordinates: number;
}
export let massDk: Pointer[] = [];

let flagOpenRpu = true;
let flagKostil = true;

let coord0: Array<number> = [];
//let coord1 = 0;

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
  console.log('map_App:', map);

  const massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  const dispatch = useDispatch();
  //========================================================
  const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
    let coord0 = (aY - bY) / 2 + bY;
    if (aY < bY) coord0 = (bY - aY) / 2 + aY;
    let coord1 = (aX - bX) / 2 + bX;
    if (aX < bX) coord1 = (bX - aX) / 2 + aX;
    return [coord0, coord1];
  };

  const [pointsRpu, setPointsRpu] = React.useState<DateRPU>({} as DateRPU);
  const [isOpenRpu, setIsOpenRpu] = React.useState(false);

  const host = 'wss://192.168.115.25/mapW';
  // const host =
  // 'wss://' + window.location.host + window.location.pathname + 'W' + window.location.search;

  if (flagOpenWS) {
    WS = new WebSocket(host);
    flagOpenWS = false;
    console.log('WS:', WS);
  }

  React.useEffect(() => {
    WS.onopen = function (event: any) {
      console.log('WS.current.onopen:', event);
    };

    WS.onclose = function (event: any) {
      console.log('WS.current.onclose:', event);
    };

    WS.onerror = function (event: any) {
      console.log('WS.current.onerror:', event);
    };

    WS.onmessage = function (event: any) {
      // if (flagWS) {
      let allData = JSON.parse(event.data);
      let data: DateMAP = allData.data;
      console.log('data_onmessage:', data);
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

    coord0 = CenterCoord(
      dataMap.boxPoint.point0.Y,
      dataMap.boxPoint.point0.X,
      dataMap.boxPoint.point1.Y,
      dataMap.boxPoint.point1.X,
    );

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

    // инициализация massDk
    let masskPoint: Pointer = {
      ID: 0,
      coordinates: [],
      nameCoordinates: '',
      region: '',
      area: '',
      subarea: 0,
      newCoordinates: 0,
    };

    massDk[0] = masskPoint;
    dispatch(massdkCreate(massDk));
    flagOpenRpu = false;
  }

  return (
    <Grid container sx={{ height: '100vh', width: '100%', backgroundColor: '#F1F5FB' }}>
      <Grid item xs>
        <MainMap Y={coord0[0]} X={coord0[1]} />
      </Grid>
    </Grid>
  );
};

export default App;
