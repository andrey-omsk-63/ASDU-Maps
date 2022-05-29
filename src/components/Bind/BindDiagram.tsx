import * as React from 'react';
import { useSelector } from 'react-redux';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  GeolocationControl,
  ListBox,
  ListBoxItem,
  RouteButton,
  RulerControl,
  SearchControl,
  TrafficControl,
  TypeSelector,
  ZoomControl,
  Clusterer,
} from 'react-yandex-maps';

import { Tflight, DateMAP } from './../../interfaceMAP.d';

const mapData = {
  center: [55.751574, 37.573856],
  zoom: 9,
};

// const coordinates = [
//   [55.684758, 37.738521],
//   [57.684758, 39.738521],
// ];
let coordinates: Array<Array<number>> = [[]];

let dateMap: Tflight[] = [{} as Tflight];
let flagOpen = true;

const BindDiagram = () => {
  //== Piece of Redux ======================================
  const map = useSelector((state: any) => {
    const { mapReducer } = state;
    return mapReducer.map;
  });
  dateMap = map.dateMap;
  //console.log('dateMap_Diagram:', dateMap);
  //========================================================

  if (flagOpen) {
    for (let i = 0; i < dateMap.length; i++) {
      let mass = [0, 0];
      mass[0] = dateMap[i].points.Y;
      mass[1] = dateMap[i].points.X;
      coordinates.push(mass);
    }
    coordinates.splice(0, 1);
    flagOpen = false;

    //console.log('coord:', coordinates);
  }

  const getPointData = (index: any) => {
    return {
      balloonContentBody: 'placemark <strong>balloon ' + index + '</strong>',
      clusterCaption: 'placemark <strong>' + index + '</strong>',
    };
  };

  const getPointOptions = () => {
    return {
      preset: 'islands#violetIcon',
    };
  };

  return (
    <Box sx={{ marginTop: -3, marginLeft: -3, marginRight: -3 }}>
      <Grid container sx={{ border: 0, height: '92vh' }}>
        <YMaps>
          <Map defaultState={mapData} width={'99.5%'} height={'100%'}>
            {/* <Clusterer> */}
            {/* options={{
                preset: 'islands#invertedVioletClusterIcons',
                groupByCoordinates: false,
                clusterDisableClickZoom: true,
                clusterHideIconOnBalloonOpen: false,
                geoObjectHideIconOnBalloonOpen: false,
              }}> */}
            {coordinates.map((coordinate, idx) => (
              <Placemark
                key={idx}
                geometry={coordinate}
                properties={getPointData(idx)}
                options={getPointOptions()}
              />
            ))}
            <FullscreenControl />
            <GeolocationControl options={{ float: 'left' }} />
            <ListBox data={{ content: 'Выберите город' }}>
              <ListBoxItem data={{ content: 'Москва' }} />
              <ListBoxItem data={{ content: 'Омск' }} />
            </ListBox>
            <RouteButton options={{ float: 'right' }} />
            <RulerControl options={{ float: 'right' }} />
            <SearchControl options={{ float: 'right' }} />
            <TrafficControl options={{ float: 'right' }} />
            <TypeSelector options={{ float: 'right' }} />
            <ZoomControl options={{ float: 'right' }} />
            {/* </Clusterer> */}
          </Map>
        </YMaps>
      </Grid>
    </Box>
  );
};

export default BindDiagram;
