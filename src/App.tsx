import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mapCreate, commCreate, massfazCreate } from './redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';

//import axios from 'axios';

import Condition from './components/Condition';
import Technology from './components/Technology';
import Eguipment from './components/Eguipment';
import BindDirections from './components/Bind/BindDirections';
import BindOutputs from './components/Bind/BindOutputs';
import BindPlans from './components/Bind/BindPlans';
import BindDiagram from './components/Bind/BindDiagram';
import Journal from './components/Journal/Journal';

import { styleAppMenu, styleAppPodv, styleButt01 } from './AppStyle';
import { styleTitle, styleButt02 } from './AppStyle';

import { DateRPU } from './interfaceRPU.d';
import { dataRpu } from './otladkaRpuData';

import { DateMAP } from './interfaceMAP.d';
import { dataMap } from './otladkaMaps';

import AppIconAsdu from './AppIconAsdu';

export let dateRpuGl: DateRPU = {} as DateRPU;
//export let dateMapGl: DateMAP = {} as DateMAP;
export let dateMapGl: any;

export let massFaz: Array<Array<number>> = [[]];

let flagOpenRpu = true;
let flagKostil = true;

let flagWS = true;
let WS: any = null;

const App = () => {
  //== Piece of Redux ======================================
  const comm = useSelector((state: any) => {
    const { commReducer } = state;
    return commReducer.comm;
  });
  console.log('comm_App:', comm);

  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  console.log('map_App:', map);

  const massfaz = useSelector((state: any) => {
    const { massfazReducer } = state;
    return massfazReducer.massfaz;
  });
  console.log('massfaz_App:', massfaz);

  const dispatch = useDispatch();
  //========================================================
  const ButtonKnobLevel1 = (soob: string, val: string) => {
    return (
      <Grid container>
        <Grid item xs>
          <Button sx={styleButt01} variant="contained" onClick={() => setValue(val)}>
            <b>{soob}</b>
          </Button>
        </Grid>
      </Grid>
    );
  };

  const ButtonKnobLevel2 = (soob: string, val: string) => {
    return (
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs>
          <Button sx={styleButt02} variant="contained" onClick={() => setValue(val)}>
            <b>{soob}</b>
          </Button>
        </Grid>
      </Grid>
    );
  };

  const [pointsRpu, setPointsRpu] = React.useState<DateRPU>({} as DateRPU);
  const [pointsMap, setPointsMap] = React.useState<DateMAP>({} as DateMAP);
  const [isOpenRpu, setIsOpenRpu] = React.useState(false);
  //const ipAdress: string = 'http://localhost:3000/otladkaRpu.json';
  //const ipAdress: string = 'http://192.168.115.114:3000/otladkaRpu.json';

  // React.useEffect(() => {
  //   axios.get(ipAdress).then(({ data }) => {
  //     setPointsRpu(data);
  //     setIsOpenRpu(true);
  //   });
  // }, []);

  const host = 'wss://192.168.115.25/mapW';
  //  'wss://' + window.location.host + window.location.pathname + 'W' + window.location.search;
  // let WS: React.MutableRefObject<WebSocket> = {};
  //const WS: any = React.useRef(new WebSocket('wss://ws.kraken.com/'));
  //const WS = React.useRef(new WebSocket('wss://ws.kraken.com/'));
  if (flagWS) {
    WS = new WebSocket(host);
    flagWS = false;
    console.log('WS:', WS);
  }

  if (flagOpenRpu) {
    // костыль для отладки на планшете
    setPointsRpu(dataRpu);
    setIsOpenRpu(true);
  }

  if (flagKostil) {
    console.log('dataMap:', dataMap);
    //setPointsMap(dataMap);
    flagKostil = true;
  }

  if (isOpenRpu && flagOpenRpu && flagKostil) {
    dateRpuGl = pointsRpu;
    dateMapGl = dataMap;

    dispatch(mapCreate(dateMapGl));
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
      Array.from({ length: dateRpuGl.tirtonap.length }, () => 0),
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
    flagKostil = false;
  }

  const [value, setValue] = React.useState('1');

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid container sx={{ marginRight: 0.5 }}>
        <TabContext value={value}>
          <Grid item xs={2.6} sx={styleAppMenu}>
            <Stack direction="column">
              <Box sx={styleTitle}>
                <b>ДКАМ</b>
              </Box>
              {ButtonKnobLevel1('Состояние', '1')}
              {ButtonKnobLevel1('Технология', '2')}
              {ButtonKnobLevel1('Оборудование', '3')}
              <Grid container>
                <Grid item xs>
                  <Box sx={{ fontSize: 20.5, marginTop: 3, marginLeft: 2 }}>
                    <b>Привязка</b>
                  </Box>
                </Grid>
              </Grid>
              {ButtonKnobLevel2('Выходы', '41')}
              {ButtonKnobLevel2('Направления', '42')}
              {ButtonKnobLevel2('Планы', '43')}
              {ButtonKnobLevel2('Диаграмма', '44')}

              {ButtonKnobLevel1('Журнал', '5')}
            </Stack>
          </Grid>
          <Grid item xs sx={styleAppMenu}>
            <TabPanel value="0"></TabPanel>
            <TabPanel value="1">
              <Condition />
            </TabPanel>
            <TabPanel value="2">
              <Technology />
            </TabPanel>
            <TabPanel value="3">
              <Eguipment />
            </TabPanel>
            <TabPanel value="41">
              <BindOutputs />
            </TabPanel>
            <TabPanel value="42">
              <BindDirections />
            </TabPanel>
            <TabPanel value="43">
              <BindPlans />
            </TabPanel>
            <TabPanel value="44">
              <BindDiagram />
            </TabPanel>
            <TabPanel value="5">
              <Journal />
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
      <Grid item xs={12} sx={styleAppPodv}>
        <Grid container>
          <Grid item xs={1.7} sx={{ border: 0 }}>
            <AppIconAsdu />
          </Grid>
          <Grid item xs>
            <Box sx={{ p: 1, textAlign: 'center', fontSize: 14 }}>
              <b>Место для различнoй занимательнoй информации</b>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;

// отслеживание изменения размера экрана
// const [size, setSize] = React.useState([0, 0]);
// React.useLayoutEffect(() => {
//   function updateSize() {
//     setSize([window.innerWidth, window.innerHeight]);
//   }
//   window.addEventListener('resize', updateSize);
//   updateSize();
//   return () => window.removeEventListener('resize', updateSize);
// }, []);
