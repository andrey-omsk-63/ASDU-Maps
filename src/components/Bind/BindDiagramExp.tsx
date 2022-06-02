import * as React from 'react';
//import { useSelector } from 'react-redux';

//import Grid from '@mui/material/Grid';
//import Box from '@mui/material/Box';

import {
  YMaps,
  Map,
  // Placemark,
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

// //let coordinates: Array<Array<number>> = [[]];
// //let nameCoordinates: Array<string> = [];

// let dateMap: Tflight[] = [{} as Tflight];
// let flagOpen = true;

const BindDiagram = () => {
  //== Piece of Redux ======================================
  // const map = useSelector((state: any) => {
  //   const { mapReducer } = state;
  //   return mapReducer.map;
  // });
  // dateMap = map.dateMap;
  //console.log('dateMap_Diagram:', dateMap);
  //========================================================

  //const mapp = React.useRef<any>(null);
  const map = React.useRef<any>(null);
  const [zoom, setZoom] = React.useState<number>(18)

  const mapState = {
    center: [55.739625, 37.5412],
    zoom: 12
  };

  const addRoute = (ymaps: any) => {
    const pointA = [55.749, 37.524];
    const pointB = "Москва, Красная площадь";

    const multiRoute = new ymaps.multiRouter.MultiRoute(
      {
        referencePoints: [pointA, pointB],
        params: {
          routingMode: "pedestrian"
        }
      },
      {
        boundsAutoApply: true
      }
    );

    map.current.geoObjects.add(multiRoute);
  };

  return (
    <div className="App">
      <YMaps query={{ apikey: '65162f5f-2d15-41d1-a881-6c1acf34cfa1', lang: 'ru_RU' }}>
        <Map
          modules={["multiRouter.MultiRoute"]}
          state={mapState}
          //instanceRef={map}
          instanceRef={(ref) => {
            if (ref) {
              map.current = ref
              map.current.events.add(["boundschange"], () => setZoom(map.current.getZoom()))
            }
          }}
          onLoad={addRoute}
        ></Map>
      </YMaps>
    </div>
  );

};

export default BindDiagram;