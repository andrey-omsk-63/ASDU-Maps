import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { massdkCreate, massrouteCreate } from './../redux/actions';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

import { YMaps, Map, Placemark, FullscreenControl } from 'react-yandex-maps';
import { GeolocationControl } from 'react-yandex-maps';
import { RulerControl, SearchControl } from 'react-yandex-maps';
import { TrafficControl, TypeSelector, ZoomControl } from 'react-yandex-maps';

import MapRouteInfo from './MapComponents/MapRouteInfo';
import MapInputAdress from './MapComponents/MapInputAdress';
import MapPointDataError from './MapComponents/MapPointDataError';
import MapRouteBind from './MapComponents/MapRouteBind';
import MapCreatePointVertex from './MapComponents/MapCreatePointVertex';

import { RecordMassRoute } from './MapServiceFunctions';
import { DecodingCoord, CodingCoord } from './MapServiceFunctions';
import { getMultiRouteOptions, DoublRoute } from './MapServiceFunctions';
import { getReferencePoints, CenterCoord } from './MapServiceFunctions';
import { getMassPolyRouteOptions } from './MapServiceFunctions';
import { getMassMultiRouteOptions } from './MapServiceFunctions';
import { getMassMultiRouteInOptions } from './MapServiceFunctions';
import { getPointData, getPointOptions } from './MapServiceFunctions';
import { SendSocketCreateWay } from './MapServiceFunctions';
import { SendSocketCreatePoint } from './MapServiceFunctions';
import { SendSocketCreateVertex } from './MapServiceFunctions';
import { SendSocketDeletePoint } from './MapServiceFunctions';
import { SendSocketDeleteVertex } from './MapServiceFunctions';

import { styleSetPoint, styleTypography, searchControl } from './MainMapStyle';
import { styleApp01, styleModalEndMapGl, styleModalMenu } from './MainMapStyle';

import { Pointer } from './../App';

let coordStart: any = []; // рабочий массив коллекции входящих связей
let coordStop: any = []; // рабочий массив коллекции входящих связей
let coordStartIn: any = []; // рабочий массив коллекции исходящих связей
let coordStopIn: any = []; // рабочий массив коллекции исходящих связей
let massRoute: any = []; // рабочий массив сети связей

let debugging = false;
let flagOpen = false;
let flagPusk = false;
let flagRoute = false;
let flagBind = false;
let flagDemo = false;
let activeRoute: any;
let newPointCoord: any = 0;
let soobError = '';

let zoom = 10;
let homeRegion = 0;
let pointCenter: any = 0;
let indexPoint: number = -1;

let pointA: any = 0;
let pointAa: any = 0;
let pointAaIndex: number = -1;
let fromCross: any = {
  pointAaRegin: '',
  pointAaArea: '',
  pointAaID: 0,
  pointAcod: '',
};

let pointB: any = 0;
let pointBb: any = 0;
let pointBbIndex: number = -1;
let toCross: any = {
  pointBbRegin: '',
  pointBbArea: '',
  pointBbID: 0,
  pointBcod: '',
};

//let openSetCreate = false;
//let setOpenSetCreate: React.Dispatch<React.SetStateAction<boolean>>;
//let setOpenSetCreate: any;

const MainMap = (props: { ws: WebSocket; region: any }) => {
  if (props.ws.url === 'wss://localhost:3000/W') debugging = true;
  //== Piece of Redux =======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  let massroute = useSelector((state: any) => {
    const { massrouteReducer } = state;
    return massrouteReducer.massroute;
  });
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  const dispatch = useDispatch();
  //===========================================================
  const [openSetInf, setOpenSetInf] = React.useState(false);
  const [openSetEr, setOpenSetEr] = React.useState(false);
  const [openSetBind, setOpenSetBind] = React.useState(false);
  const [openSet, setOpenSet] = React.useState(false);
  const [openSetAdress, setOpenSetAdress] = React.useState(false);
  const [openSetCreate, setOpenSetCreate] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState<Array<Array<number>>>([[]]); // массив координат
  //=== инициализация ======================================
  if (!flagOpen && Object.keys(massroute).length) {
    if (props.region) homeRegion = props.region;
    if (!props.region && massroute.vertexes.length) homeRegion = massroute.vertexes[0].region;
    for (let i = 0; i < massroute.points.length; i++) {
      massroute.vertexes.push(massroute.points[i]);
    }
    for (let i = 0; i < massroute.vertexes.length; i++) {
      let masskPoint: Pointer = {
        ID: -1,
        coordinates: [],
        nameCoordinates: '',
        region: 0,
        area: 0,
        newCoordinates: 0,
      };
      masskPoint.ID = massroute.vertexes[i].id;
      masskPoint.coordinates = DecodingCoord(massroute.vertexes[i].dgis);
      masskPoint.nameCoordinates = massroute.vertexes[i].name;
      masskPoint.region = massroute.vertexes[i].region;
      masskPoint.area = massroute.vertexes[i].area;
      masskPoint.newCoordinates = 0;
      massdk.push(masskPoint);
      coordinates.push(DecodingCoord(massroute.vertexes[i].dgis));
    }
    coordinates.splice(0, 1);
    pointCenter = CenterCoord(
      map.dateMap.boxPoint.point0.Y,
      map.dateMap.boxPoint.point0.X,
      map.dateMap.boxPoint.point1.Y,
      map.dateMap.boxPoint.point1.X,
    );
    flagOpen = true;
    dispatch(massdkCreate(massdk));
    dispatch(massrouteCreate(massroute));
  }
  //========================================================

  const ZeroRoute = () => {
    pointA = 0;
    pointB = 0;
    pointAa = 0;
    pointBb = 0;
    pointAaIndex = -1;
    pointBbIndex = -1;
    coordStart = [];
    coordStop = [];
    coordStartIn = [];
    coordStopIn = [];
    flagRoute = false;
    flagBind = false;
    setSize(window.innerWidth + Math.random());
  };

  const MakeRecordMassRoute = () => {
    fromCross.pointAcod = CodingCoord(pointA);
    toCross.pointBcod = CodingCoord(pointB);
    if (DoublRoute(massroute.ways, pointA, pointB)) {
      soobError = 'Дубликатная связь';
      setOpenSetEr(true);
    } else {
      massroute.ways.push(RecordMassRoute(fromCross, toCross, activeRoute));
      SendSocketCreateWay(debugging, props.ws, fromCross, toCross, activeRoute);
    }
    console.log('MakeRecord_massroute:', massroute.ways);
    ZeroRoute();
  };

  const PressMenuButton = (mode: number) => {
    switch (mode) {
      case 3: // режим включения Demo сети связей
        massRoute = massroute.ways;
        flagDemo = true;
        setSize(window.innerWidth + Math.random());
        break;
      case 6: // режим отмены Demo сети связей
        massRoute = [];
        flagDemo = false;
        setSize(window.innerWidth + Math.random());
        break;
      case 12: // реверс маршрута
        let pa = pointA;
        pointA = pointB;
        pointB = pa;
        pa = pointAa;
        pointAa = pointBb;
        pointBb = pa;
        pa = pointAaIndex;
        pointAaIndex = pointBbIndex;
        pointBbIndex = pa;
        setSize(window.innerWidth + Math.random());
        break;
      case 21: // сохранение маршрута
        MakeRecordMassRoute();
        flagPusk = false;
        break;
      case 33: // привязка направлений
        flagBind = true;
        setOpenSetBind(true);
        break;
      case 69: // инфа о маршруте
        if (activeRoute) setOpenSetInf(true);
        break;
      case 77: // удаление маршрута
        ZeroRoute();
    }
  };

  //const [zoom, setZoom] = React.useState<number>(10);
  let mapState: any = {
    center: pointCenter,
    zoom,
    //zoom: 10, //yandexMapDisablePoiInteractivity: true,
    //searchControlProvider: "yandex#search",
    yandexMapDisablePoiInteractivity: true,
  };

  const MapGl = (props: { ws: WebSocket; pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const MakeRoute = () => {
      pointA = pointAa; // === Запуск создания связи ===
      pointB = pointBb;
      flagRoute = true;
      setSize(window.innerWidth + Math.random());
    };

    const addRoute = (ymaps: any) => {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        getReferencePoints(pointAA, pointBB),
        getMultiRouteOptions(),
      );
      let massPolyRoute: any = []; // cеть связей
      for (let i = 0; i < massRoute.length; i++) {
        massPolyRoute[i] = new ymaps.Polyline(
          [DecodingCoord(massRoute[i].starts), DecodingCoord(massRoute[i].stops)],
          { balloonContent: 'Ломаная линия' },
          getMassPolyRouteOptions(),
        );
        mapp.current.geoObjects.add(massPolyRoute[i]);
      }
      let massMultiRoute: any = []; // исходящие связи
      for (let i = 0; i < coordStart.length; i++) {
        massMultiRoute[i] = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(coordStart[i], coordStop[i]),
          getMassMultiRouteOptions(),
        );
        mapp.current.geoObjects.add(massMultiRoute[i]);
      }
      let massMultiRouteIn: any = []; // входящие связи
      for (let i = 0; i < coordStartIn.length; i++) {
        massMultiRouteIn[i] = new ymaps.multiRouter.MultiRoute(
          getReferencePoints(coordStartIn[i], coordStopIn[i]),
          getMassMultiRouteInOptions(),
        );
        mapp.current.geoObjects.add(massMultiRouteIn[i]);
      }
      mapp.current.geoObjects.add(multiRoute); // основная связь
      multiRoute.model.events.add('requestsuccess', function () {
        activeRoute = multiRoute.getActiveRoute();
      });
    };

    const MakeСollectionRoute = () => {
      for (let i = 0; i < massroute.ways.length; i++) {
        if (massroute.ways[i].starts === CodingCoord(pointAa)) {
          coordStop.push(DecodingCoord(massroute.ways[i].stops)); // исходящие связи
          coordStart.push(pointAa);
        }
        if (massroute.ways[i].stops === CodingCoord(pointAa)) {
          coordStartIn.push(DecodingCoord(massroute.ways[i].starts)); // входящие связи
          coordStopIn.push(pointAa);
        }
      }
    };

    const OnPlacemarkClickPoint = (index: number) => {
      if (pointAa === 0) {
        pointAaIndex = index; // начальная точка
        pointAa = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
        fromCross.pointAaRegin = massdk[index].region.toString();
        fromCross.pointAaArea = massdk[index].area.toString();
        fromCross.pointAaID = massdk[index].ID;
        MakeСollectionRoute();
        flagPusk = true;
        setSize(window.innerWidth + Math.random());
      } else {
        if (pointBb === 0) {
          if (pointAaIndex === index) {
            soobError = 'Начальная и конечная точки совпадают';
            setOpenSetEr(true);
          } else {
            pointBbIndex = index; // конечная точка
            pointBb = [massdk[index].coordinates[0], massdk[index].coordinates[1]];
            toCross.pointBbRegin = massdk[index].region.toString();
            toCross.pointBbArea = massdk[index].area.toString();
            toCross.pointBbID = massdk[index].ID;
            MakeRoute();
            if (DoublRoute(massroute.ways, pointAa, pointBb)) {
              soobError = 'Дубликатная связь';
              setOpenSetEr(true);
            }
          }
        } else {
          indexPoint = index;
          setOpenSet(true); // в меню работы с точками
        }
      }
    };

    const ModalPressBalloon = () => {
      const [openSetErBall, setOpenSetErBall] = React.useState(false);
      let pointRoute: any = 0;
      let soobDel = 'Удаление точки';
      if (indexPoint >= 0 && indexPoint < massdk.length) {
        if (massdk[indexPoint].area) soobDel = 'Удаление перекрёстка';
        pointRoute = [massdk[indexPoint].coordinates[0], massdk[indexPoint].coordinates[1]];
      }

      const handleClose = (param: number) => {
        switch (param) {
          case 1: // Начальная точка
            if (pointBbIndex === indexPoint) {
              soobError = 'Начальная и конечная точки совпадают';
              setOpenSetErBall(true);
            } else {
              pointAaIndex = indexPoint;
              pointAa = pointRoute;
              fromCross.pointAaRegin = massdk[pointAaIndex].region.toString();
              fromCross.pointAaArea = massdk[pointAaIndex].area.toString();
              fromCross.pointAaID = massdk[pointAaIndex].ID;
              MakeRoute();
              setOpenSet(false);
            }
            break;
          case 2: // Конечная точка
            if (pointAaIndex === indexPoint) {
              soobError = 'Начальная и конечная точки совпадают';
              setOpenSetErBall(true);
            } else {
              pointBbIndex = indexPoint;
              pointBb = pointRoute;
              toCross.pointBbRegin = massdk[pointBbIndex].region.toString();
              toCross.pointBbArea = massdk[pointBbIndex].area.toString();
              toCross.pointBbID = massdk[pointBbIndex].ID;
              MakeRoute();
              setOpenSet(false);
            }
            break;
          case 3: // Удаление точки
            if (pointAaIndex === indexPoint || pointBbIndex === indexPoint) {
              soobError = 'Начальную и конечную точки связи удалять нельзя';
              setOpenSetErBall(true);
            } else {
              let massRouteRab: any = []; // удаление из массива сети связей
              let coordPoint = massroute.vertexes[indexPoint].dgis;
              let idPoint = massroute.vertexes[indexPoint].id;
              let regionVer = massroute.vertexes[indexPoint].region.toString();
              let areaVer = massroute.vertexes[indexPoint].area.toString();
              for (let i = 0; i < massroute.ways.length; i++) {
                if (
                  coordPoint !== massroute.ways[i].starts &&
                  coordPoint !== massroute.ways[i].stops
                )
                  massRouteRab.push(massroute.ways[i]);
              }
              massroute.ways.splice(0, massroute.ways.length); // massroute = [];
              massroute.ways = massRouteRab;
              if (flagDemo) massRoute = massroute.ways;
              coordStart = []; // удаление колекции связей
              coordStop = [];
              coordStartIn = [];
              coordStopIn = [];
              massdk.splice(indexPoint, 1); // удаление самой точки
              massroute.vertexes.splice(indexPoint, 1);
              dispatch(massdkCreate(massdk));
              dispatch(massrouteCreate(massroute));
              let oldPointAa = coordinates[pointAaIndex];
              let oldPointBb = coordinates[pointBbIndex];
              let aa = coordinates;
              aa.splice(indexPoint, 1);
              setCoordinates(aa);
              for (let i = 0; i < coordinates.length; i++) {
                if (coordinates[i] === oldPointAa) pointAaIndex = i;
                if (coordinates[i] === oldPointBb) pointBbIndex = i;
              }
              if (areaVer === '0') {
                SendSocketDeletePoint(debugging, props.ws, idPoint);
              } else {
                SendSocketDeleteVertex(debugging, props.ws, regionVer, areaVer, idPoint);
              }
              setOpenSet(false);
            }
            break;
          case 4: // Редактирование адреса
            setOpenSetAdress(true);
        }
      };

      const StrokaPressBalloon = (soob: string, mode: number) => {
        return (
          <Button sx={styleModalMenu} onClick={() => handleClose(mode)}>
            <b>{soob}</b>
          </Button>
        );
      };

      return (
        <Modal open={openSet} onClose={() => setOpenSet(false)} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEndMapGl} onClick={() => setOpenSet(false)}>
              <b>&#10006;</b>
            </Button>
            <Box sx={{ marginTop: 2, textAlign: 'center' }}>
              {StrokaPressBalloon(soobDel, 3)}
              {StrokaPressBalloon('Редактирование адреса', 4)}
            </Box>
            <Typography variant="h6" sx={styleTypography}>
              Перестроение связи:
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              {StrokaPressBalloon('Начальная точка', 1)}
              {StrokaPressBalloon('Конечная точка', 2)}
            </Box>
            {openSetAdress && <MapInputAdress iPoint={indexPoint} setOpen={setOpenSetAdress} />}
            {openSetErBall && (
              <MapPointDataError
                sErr={soobError}
                setOpen={setOpenSetErBall}
                debugging={debugging}
                ws={props.ws}
                fromCross={fromCross}
                toCross={toCross}
              />
            )}
          </Box>
        </Modal>
      );
    };

    const MakeNewPoint = (coords: any) => {
      let coor: string = CodingCoord(coords);
      let areaV = massroute.vertexes[massroute.vertexes.length - 1].area;
      let idV = massroute.vertexes[massroute.vertexes.length - 1].id;
      let adress = massroute.vertexes[massroute.vertexes.length - 1].name;
      coordinates.push(coords);
      if (areaV) {
        SendSocketCreateVertex(debugging, props.ws, homeRegion, areaV, idV);
      } else {
        SendSocketCreatePoint(debugging, props.ws, coor, adress);
      }
      setOpenSetCreate(false);
    };

    const PlacemarkDo = () => {
      return (
        <>
          {flagOpen &&
            coordinates.map((coordinate, idx) => (
              <Placemark
                key={idx}
                geometry={coordinate}
                properties={getPointData(idx, pointAaIndex, pointBbIndex, massdk)}
                options={getPointOptions(idx, pointAaIndex, pointBbIndex, massdk, massroute)}
                modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                onClick={() => OnPlacemarkClickPoint(idx)}
              />
            ))}
        </>
      );
    };

    const InstanceRefDo = (ref: React.Ref<any>) => {
      if (ref) {
        mapp.current = ref;
        mapp.current.events.add('contextmenu', function (e: any) {
          // нажата правая кнопка мыши (создание новой точки)
          if (mapp.current.hint) {
            newPointCoord = e.get('coords');
            setOpenSetCreate(true);
          }
        });
        mapp.current.events.add('mousedown', function (e: any) {
          // нажата левая/правая кнопка мыши 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
          pointCenter = mapp.current.getCenter();
        });
        mapp.current.events.add(['boundschange'], function () {
          pointCenter = mapp.current.getCenter();
          // setZoom(mapp.current.getZoom()); // покрутили колёсико мыши
          zoom = mapp.current.getZoom(); // покрутили колёсико мыши
        });
      }
    };

    return (
      <YMaps
        query={{
          apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1',
          lang: 'ru_RU',
        }}>
        <Map
          modules={['multiRouter.MultiRoute', 'Polyline']}
          state={mapState}
          instanceRef={(ref) => InstanceRefDo(ref)}
          onLoad={addRoute}
          width={'99.8%'}
          height={'97%'}>
          {/* сервисы Яндекса */}
          <FullscreenControl />
          <GeolocationControl options={{ float: 'left' }} />
          <RulerControl options={{ float: 'right' }} />
          <SearchControl options={searchControl} />
          <TrafficControl options={{ float: 'right' }} />
          <TypeSelector options={{ float: 'right' }} />
          <ZoomControl options={{ float: 'right' }} />
          {/* служебные компоненты */}
          <PlacemarkDo />
          <ModalPressBalloon />
          {openSetEr && (
            <MapPointDataError
              sErr={soobError}
              setOpen={setOpenSetEr}
              debugging={debugging}
              ws={props.ws}
              fromCross={fromCross}
              toCross={toCross}
            />
          )}
          {openSetInf && (
            <MapRouteInfo
              activeRoute={activeRoute}
              name1={massdk[pointAaIndex].nameCoordinates}
              name2={massdk[pointBbIndex].nameCoordinates}
              setOpen={setOpenSetInf}
            />
          )}
          {openSetBind && <MapRouteBind setOpen={setOpenSetBind} />}
          {openSetCreate && (
            <MapCreatePointVertex
              setOpen={setOpenSetCreate}
              region={homeRegion}
              coord={newPointCoord}
              createPoint={MakeNewPoint}
            />
          )}
        </Map>
      </YMaps>
    );
  };

  //отслеживание изменения размера экрана - костыль, делает ререндер
  const [size, setSize] = React.useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const StrokaMenuGlob = (soob: string, mode: number) => {
    return (
      <Button sx={styleApp01} onClick={() => PressMenuButton(mode)}>
        <b>{soob}</b>
      </Button>
    );
  };

  console.log('Massroute:', massroute);
  console.log('Massdk:', massdk);

  return (
    <Grid container sx={{ height: '99.5vh' }}>
      {flagPusk && !flagBind && <>{StrokaMenuGlob('Отмена назначений', 77)}</>}
      {flagPusk && flagRoute && !flagBind && (
        <>
          {StrokaMenuGlob('Привязка направлен', 33)}
          {StrokaMenuGlob('Реверс связи', 12)}
          {StrokaMenuGlob('Информ о связи', 69)}
        </>
      )}
      {flagPusk && flagRoute && flagBind && (
        <>
          {StrokaMenuGlob('Сохранить связь', 21)}
          {StrokaMenuGlob('Отменить связь', 77)}
          {StrokaMenuGlob('Информ о связи', 69)}
        </>
      )}
      {!flagDemo && <>{StrokaMenuGlob('Demo сети', 3)}</>}
      {flagDemo && <>{StrokaMenuGlob('Конец Demo', 6)}</>}
      {Object.keys(massroute).length && <MapGl ws={props.ws} pointa={pointA} pointb={pointB} />}
    </Grid>
  );
};

export default MainMap;
