import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import {
  YMaps,
  Map,
  Placemark,
  // FullscreenControl,
  // GeolocationControl,
  // ListBox,
  // ListBoxItem,
  // RouteButton,
  // RulerControl,
  // SearchControl,
  // TrafficControl,
  // TypeSelector,
  // ZoomControl,
  //Clusterer,
} from 'react-yandex-maps';

import { Tflight, DateMAP } from './../../interfaceMAP.d';

// const mapData = {
//   center: [55.751574, 37.573856],
//   zoom: 11,
//   controls: []
// };

// let coordinates: Array<Array<number>> = [
//   [55.684758, 37.738521],
//   [55.749, 37.524],
// ];

// let nameCoordinates: Array<string> = [
//   'Точка А',
//   'Точка В',
// ];

let coordinates: Array<Array<number>> = [[]];
let nameCoordinates: Array<string> = [];

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = true;
let ch = 0;
let pointA: any = [55.749, 37.524];
//let pointA: any = 0;
let pointB: any = 'Москва, Красная площадь';
//let pointB: any = 0;

const BindDiagram = () => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  console.log('dateMap_Diagram:', dateMap);
  //========================================================

  //const mapp = React.useRef<any>(null);
  const styleApp01 = {
    fontSize: 14,
    marginRight: 1,
    width: '27%',
    maxHeight: '21px',
    minHeight: '21px',
    backgroundColor: '#F1F3F4',
    color: 'black',
    textTransform: 'unset !important',
  };

  if (flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      coordinates.push(mass);
      nameCoordinates.push(dateMap[i].description);
    }
    coordinates.splice(0, 1);
    flagOpen = false;
    // pointa = [coordinates[4][0], coordinates[4][1]];
    // pointb = [coordinates[3][0], coordinates[3][1]];
    // pointA = [coordinates[0][0], coordinates[0][1]];
    // pointB = [coordinates[2][0], coordinates[2][1]];
  }

  const NewPoint = (ch: number) => {
    console.log('!!!!!!!!!!!');
    let aa = 'Москва, метро Смоленская';
    let bb = 'Москва, метро Арбатская';
    pointA = aa;
    pointB = bb;
    console.log('Clic ', ch, 'A:', pointA, 'B:', pointB);
    setSize(window.innerWidth + Math.random());
  };

  const MapGl = (props: { pointa: any; pointb: any }) => {
    const mapp = React.useRef<any>(null);
    const [zoom, setZoom] = React.useState<number>(18);
    let pointAA = props.pointa;
    let pointBB = props.pointb;

    const mapState = {
      center: [55.751574, 37.573856],
      zoom: 9.5,
    };

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
    };

    const getPointData = (index: number) => {
      //console.log('!!!',index)
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

    const OnPlacemarkClick = (index: number) => {
      console.log('OnPlacemarkClick', index + 1);
      //NewPoint(2);
      // if (!onRoute) {
      //   pointA = pointa;
      //   pointB = pointb;
      //   console.log('A', pointA, 'B', pointB);
      //   onRoute = true;
      //   //mapp.current.geoObjects.add(multiRoute);
      // }
      // setSize(window.innerWidth + Math.random());
    };

    return (
      <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
        <Map
          modules={['multiRouter.MultiRoute']}
          state={mapState}
          //instanceRef={map}
          instanceRef={(ref) => {
            if (ref) {
              mapp.current = ref;
              mapp.current.events.add(['boundschange'], () => setZoom(mapp.current.getZoom()));
            }
          }}
          onLoad={addRoute}
          width={'99.5%'}
          height={'100%'}>
          {coordinates.map((coordinate, idx) => (
            <Placemark
              key={idx}
              geometry={coordinate}
              properties={getPointData(idx)}
              options={getPointOptions()}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              onClick={() => OnPlacemarkClick(idx)}
              // instanceRef={(ref: any) => {
              //   ref &&
              //     ref.events.add('balloonopen', () => {
              //       //ref.events.add( () => {
              //       PressBalloonBody(idx);
              //     });
              // }}
            />
          ))}
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

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <Button sx={styleApp01} variant="contained" onClick={() => NewPoint(1)}>
          <b>Перестроить маршрут</b>
        </Button>
        <MapGl pointa={pointA} pointb={pointB} />
      </Grid>
    </Box>
  );
};

export default BindDiagram;
