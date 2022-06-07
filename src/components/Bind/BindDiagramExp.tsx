import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
//import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  GeolocationControl,
  ListBox,
  ListBoxItem,
  //RouteButton,
  RulerControl,
  SearchControl,
  TrafficControl,
  TypeSelector,
  ZoomControl,
} from 'react-yandex-maps';

import { Tflight, DateMAP } from './../../interfaceMAP.d';

let coordinates: Array<Array<number>> = [[]];
let nameCoordinates: Array<string> = [];

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = false;
let flagRoute = false;
let ch = 0;

let activeRoute: any;
let activeRoutePaths: any;

let pointA: any = 0;
let pointAa: any = 0;
let pointaa: any = 0;
let pointB: any = 0;
let pointBb: any = 0;
let pointbb: any = 0;
let indexPoint = -1;
let pointAaIndex: number = -1;
let pointBbIndex: number = -1;
let soobError = '';

const BindDiagram = () => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  //console.log('dateMap_Diagram:', dateMap);
  //========================================================

  //const mapp = React.useRef<any>(null);
  const styleApp01 = {
    fontSize: 14,
    marginRight: 0.5,
    width: '24%',
    maxHeight: '21px',
    minHeight: '21px',
    backgroundColor: '#F1F3F4',
    color: 'black',
    textTransform: 'unset !important',
  };

  if (!flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      if (i === 0) pointaa = mass;
      if (i === 1) pointbb = mass;
      coordinates.push(mass);
      nameCoordinates.push(dateMap[i].description);
    }
    console.log('111:', pointaa, pointbb)
    coordinates.splice(0, 1);
    flagOpen = true;
  }

  const styleModalEnd = {
    position: 'absolute',
    top: '0%',
    left: 'auto',
    right: '-6%',
    height: '21px',
    width: '6%',
    color: 'black',
  };

  const [openSetEr, setOpenSetEr] = React.useState(false);
  const handleCloseSetEr = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSetEr(false);
  };

  const handleCloseSetEndEr = () => {
    setOpenSetEr(false);
  };

  const PointDataError = () => {
    return (
      <Modal open={openSetEr} onClose={handleCloseSetEr} hideBackdrop>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndEr}>
            <b>&#10006;</b>
          </Button>
          <Typography variant="h6" sx={{ textAlign: 'center', color: 'red' }}>
            {soobError}
          </Typography>
        </Box>
      </Modal>
    )
  }

  const styleSetInf = {
    position: 'absolute',
    marginTop: '15vh',
    marginLeft: '24vh',
    width: 340,
    bgcolor: 'background.paper',
    border: '3px solid #000',
    borderColor: 'primary.main',
    borderRadius: 2,
    boxShadow: 24,
    p: 1.5,
  };

  // const styleModalEndInf = {
  //   position: 'absolute',
  //   top: '0%',
  //   left: 'auto',
  //   right: '-6%',
  //   height: '21px',
  //   width: '6%',
  //   color: 'black',
  // };

  const [openSetInf, setOpenSetInf] = React.useState(false);
  const handleCloseSetInf = (event: any, reason: string) => {
    if (reason !== 'backdropClick') setOpenSetEr(false);
  };

  const handleCloseSetEndInf = () => {
    setOpenSetInf(false);
  };


  const RouteInfo = () => {
    let dlRoute1 = 0;
    let tmRoute1 = '';
    let dlRoute2 = 0;
    let tmRoute2 = '';
    if (activeRoute) {
      dlRoute1 = Math.round(activeRoute.properties.get("distance").value);
      tmRoute1 = activeRoute.properties.get("duration").text
      activeRoutePaths.each(function (path: any) {
        dlRoute2 = Math.round(path.properties.get("distance").value);
        tmRoute2 = path.properties.get("duration").text;
      })
    }
    return (
      <Modal open={openSetInf} onClose={handleCloseSetInf} hideBackdrop>
        <Box sx={styleSetInf}>
          <Button sx={styleModalEnd} onClick={handleCloseSetEndInf}>
            <b>&#10006;</b>
          </Button>
          <Box>
            <b>Начальная точка связи:</b><br />
            {nameCoordinates[pointAaIndex]}<br />
            <b>Конечная точка связи:</b><br />
            {nameCoordinates[pointBbIndex]}<br />
            <b>1. Длина связи: </b>{dlRoute1} м<br />&nbsp;&nbsp;&nbsp;&nbsp;
            <b>Время прохождения: </b>{tmRoute1}<br />
          </Box>
          {activeRoute && activeRoute.properties.get("blocked") &&
            <Box>
              Имеются участки с перекрытыми дорогами
            </Box>
          }
          <Box>
            <b>2. Длина связи: </b>{dlRoute2} м<br />&nbsp;&nbsp;&nbsp;&nbsp;
            <b>Время прохождения: </b>{tmRoute2}<br />
          </Box>
        </Box>
      </Modal>
    )
  }

  const PressMenuButtonInf = () => {
    setOpenSetInf(true);
    console.log('Длина: ', Math.round(activeRoute.properties.get("distance").value), 'м')
    console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
    if (activeRoute.properties.get("blocked")) {
      console.log("На маршруте имеются участки с перекрытыми дорогами.");
    }
    activeRoutePaths.each(function (path: any) {
      console.log('activeRoutePaths:', activeRoutePaths.each)
      console.log('Paths:', path)
      console.log("Длина пути: " + path.properties.get("distance").text);
      console.log("Время прохождения пути: " + path.properties.get("duration").text);
      if (path.properties.get("blocked")) {
        console.log("На маршруте имеются участки с перекрытыми дорогами.");
      }
    });
  }

  const PressMenuButton = (mode: number) => {
    console.log('mode:', mode);

    switch (mode) {
      case 1:
        if (pointAa === 0) {
          soobError = "Не задана начальная точка связи";
          setOpenSetEr(true);
          break;
        }
        if (pointBb === 0) {
          soobError = "Не задана конечная точка связи";
          setOpenSetEr(true);
          break;
        }
        pointA = pointAa;
        pointB = pointBb;
        flagRoute = true;
        setSize(window.innerWidth + Math.random());
        break;
      case 69:             //инфа о маршруте
        if (activeRoute) PressMenuButtonInf()
        break;
      case 77:             //удаление маршрута
        pointA = 0;
        pointB = 0;
        pointAa = 0;
        pointBb = 0;
        flagRoute = false;
        setSize(window.innerWidth + Math.random());
    }
  };


  const bounds = [pointaa, pointBb]
  // const [mapState, setMapState] = React.useState({
  //   bounds,
  //   //zoom: 12,
  //   autoFitToViewport: true,
  // })

  const mapState = {
    center: [55.751574, 37.573856],
    zoom: 9.5,
  };

  const [zoom, setZoom] = React.useState<number>(18);

  // React.useEffect(() => {
  //setMapState({ autoFitToViewport: true, bounds: bounds })
  // }, [bounds])

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    //const [zoom, setZoom] = React.useState<number>(18);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    // const mapState = {
    //   center: [55.751574, 37.573856],
    //   zoom: 9.5,
    // };

    const addRoute = (ymaps: any) => {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [pointAA, pointBB],
        },
        {
          wayPointDraggable: true,
          boundsAutoApply: true,
        },
      );
      mapp.current.geoObjects.add(multiRoute);
      multiRoute.model.events.add('requestsuccess', function () {
        activeRoute = multiRoute.getActiveRoute();
        //console.log('activeRoute:', activeRoute)
        if (activeRoute) {
          // console.log('Длина: ', activeRoute.properties.get("distance").text)
          // console.log("Время прохождения: " + activeRoute.properties.get("duration").text);
          // Для автомобильных маршрутов можно вывести 
          // информацию о перекрытых участках.
          // if (activeRoute.properties.get("blocked")) {
          //   console.log("На маршруте имеются участки с перекрытыми дорогами.");
          // }
          activeRoutePaths = activeRoute.getPaths();
          // Проход по коллекции путей.
          // console.log('activeRoutePaths:', activeRoutePaths)
          // activeRoutePaths.each(function (path: any) {
          //   console.log("Длина пути: " + path.properties.get("distance").text);
          //   console.log("Время прохождения пути: " + path.properties.get("duration").text);
          //   if (path.properties.get("blocked")) {
          //     console.log("На маршруте имеются участки с перекрытыми дорогами.");
          //   }
          // });
        }


      })

    };

    const PressBalloon = (index: number) => {
      return 'Это балун ' + (index + 1);
    };

    const getPointData = (index: number) => {
      return {
        hintContent: nameCoordinates[index],
        //balloonContent: PressBalloon(index),
      };
    };

    const getPointOptions = () => {
      return {
        preset: 'islands#violetIcon',
      };
    };

    const PressBalloonBody = (index: number) => {
      console.log('Кликнули по точке ', index + 1);
    };

    const OnPlacemarkClick = (index: number) => {
      console.log('OnPlacemarkClick', index, index + 1);
      if (index >= 0) {
        indexPoint = index;
        setOpenSet(true);
      }
    };

    const styleSetPoint = {
      position: 'absolute',
      marginTop: '15vh',
      marginLeft: '24vh',
      width: 220,
      bgcolor: 'background.paper',
      border: '3px solid #000',
      borderColor: 'primary.main',
      borderRadius: 2,
      boxShadow: 24,
      p: 1.5,
    };

    const styleModalEnd = {
      position: 'absolute',
      top: '0%',
      left: 'auto',
      right: '-9%',
      maxHeight: '21px',
      minHeight: '21px',
      width: '6%',
      color: 'black',
    };

    const styleModalMenu = {
      fontSize: 17,
      maxHeight: '21px',
      minHeight: '21px',
      backgroundColor: '#F1F3F4',
      color: 'black',
      marginRight: 1,
      marginBottom: 2,
      textTransform: 'unset !important',
      textAlign: 'center',
    };

    const [openSet, setOpenSet] = React.useState(false);
    const handleCloseSet = (event: any, reason: string) => {
      if (reason !== 'backdropClick') setOpenSet(false);
    };

    const handleCloseSetBut = () => {
      setOpenSet(false);
    };

    const ModalPressBalloon = () => {
      const handleClose = (param: number) => {
        console.log('indexPoint:', indexPoint)
        if (param === 1) {
          pointAaIndex = indexPoint;
          pointAa = [coordinates[indexPoint][0], coordinates[indexPoint][1]];
        } else {
          pointBbIndex = indexPoint;
          pointBb = [coordinates[indexPoint][0], coordinates[indexPoint][1]];
        }
        setOpenSet(false);
      };

      return (
        <Modal open={openSet} onClose={handleCloseSet} hideBackdrop>
          <Box sx={styleSetPoint}>
            <Button sx={styleModalEnd} onClick={handleCloseSetBut}>
              <b>&#10006;</b>
            </Button>
            <Typography variant="h6" sx={{ textAlign: 'center', color: '#5B1080' }}>
              Создание новой связи
            </Typography>
            <br />
            <Box sx={{ textAlign: 'center' }}>
              <Button sx={styleModalMenu} variant="contained" onClick={() => handleClose(1)}>
                <b>Начальная точка</b>
              </Button>
              <Button sx={styleModalMenu} variant="contained" onClick={() => handleClose(2)}>
                <b>Конечная точка</b>
              </Button>
            </Box>
          </Box>
        </Modal>
      )
    };

    return (
      <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
        <Map
          modules={['multiRouter.MultiRoute']}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              mapp.current.events.add(['boundschange'], () => setZoom(mapp.current.getZoom()));
            }
          }}
          onLoad={addRoute}
          onClick={() => OnPlacemarkClick(-1)}
          width={'99.8%'}
          height={'97%'}>
          {coordinates.map((coordinate, idx) => (
            <Placemark
              key={idx}
              geometry={coordinate}
              properties={getPointData(idx)}
              options={getPointOptions()}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              onClick={() => OnPlacemarkClick(idx)}
              instanceRef={(ref: any) => {
                ref &&
                  ref.events.add('balloonopen', () => {
                    PressBalloonBody(idx);
                  });
              }}
            />
          ))}
          <FullscreenControl />
          <GeolocationControl options={{ float: 'left' }} />
          <ListBox data={{ content: 'Выберите город' }}>
            <ListBoxItem data={{ content: 'Москва' }} />
            <ListBoxItem data={{ content: 'Омск' }} />
          </ListBox>
          {/* <RouteButton options={{ float: 'right' }} /> */}
          <RulerControl options={{ float: 'right' }} />
          <SearchControl
            options={{
              float: 'left',
              provider: 'yandex#search',
              size: 'large',
            }}
          />
          <TrafficControl options={{ float: 'right' }} />
          <TypeSelector options={{ float: 'right' }} />
          <ZoomControl options={{ float: 'right' }} />
          {/* служебные компоненты */}
          <ModalPressBalloon />
          <PointDataError />
          <RouteInfo />
        </Map>
      </YMaps>
    );
  };

  ch++;
  console.log('Загрузка ', ch, 'A:', pointA, 'B:', pointB);

  //отслеживание изменения размера экрана
  const [size, setSize] = React.useState(0);
  React.useLayoutEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  let soobButtonRoute = 'Создать связь';
  if (flagRoute) soobButtonRoute = 'Перестроить связь';

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(1)}>
          <b>{soobButtonRoute}</b>
        </Button>
        {flagRoute && (
          <>
            <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(77)}>
              <b>Удалить связь</b>
            </Button>
            <Button sx={styleApp01} variant="contained" onClick={() => PressMenuButton(69)}>
              <b>Информ о связе</b>
            </Button>
          </>

        )}

        <MapGl pointa={pointA} pointb={pointB} />

      </Grid>
    </Box>
  );
};

export default BindDiagram;
