import * as React from 'react';
//import ReactDOM from "react-dom";

import Grid from '@mui/material/Grid';

import {
  YMaps, Map, Placemark, FullscreenControl, GeolocationControl, ListBox, ListBoxItem,
  RouteButton, RulerControl, SearchControl, TrafficControl,TypeSelector, ZoomControl
} from "react-yandex-maps";;

// const mapState = {
//   center: [48.704272, 65.60203],
//   zoom: 4
// };

// const COLORS = ["#F0F075", "#FB6C3F", "#3D4C76", "#49C0B5"];

// const mapData = {
//   center: [55.751574, 37.573856],
//   zoom: 5,
// };

// const coordinates = [
//   [55.684758, 37.738521],
//   [57.684758, 39.738521]
// ];



const BindDiagram = () => {

  //const mapRef = React.createRef(null);

  // () => {
  const [zoom, setZoom] = React.useState(9)
  const mapState = React.useMemo(() => ({ center: [55.75, 37.57], zoom }), [
    zoom,
  ])

  return (

    // <YMaps>
    //   <div>
    //     My awesome application with maps!
    //     <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }} />
    //   </div>
    // </YMaps>

    // <YMaps>
    //   <Map defaultState={mapData}>
    //     {coordinates.map(coordinate => <Placemark geometry={coordinate} />)}
    //   </Map>
    // </YMaps>

    // <YMaps>
    //   <Map
    //     defaultState={{
    //       center: [55.75, 37.57],
    //       zoom: 9,
    //       controls: ['zoomControl', 'fullscreenControl'],
    //     }}
    //     modules={['control.ZoomControl', 'control.FullscreenControl']}
    //   >
    //     <Placemark
    //       modules={['geoObject.addon.balloon']}
    //       defaultGeometry={[55.75, 37.57]}
    //       properties={{
    //         balloonContentBody:
    //           'This is balloon loaded by the Yandex.Maps API module system',
    //       }}
    //     />
    //   </Map>
    // </YMaps>
    <Grid container sx={{ border: 1, height: "85vh" }}>
      <YMaps
      // query={{
      //   ns: 'use-load-option',
      //   load:
      //     'Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon',
      // }}
      >
        <Map
          defaultState={{
            center: [55.75, 37.57],
            zoom: 9,
            //controls: ['zoomControl', 'fullscreenControl'],
            controls: [],
          }}
          width={"72vw"}
          height={"100%"}
        >
          <Placemark
            defaultGeometry={[55.75, 37.57]}
            properties={{
              balloonContentBody:
                'This is balloon loaded by the Yandex.Maps API module system',
            }}
          />
          <FullscreenControl />
          <GeolocationControl options={{ float: 'left' }} />
          <ListBox data={{ content: 'Выберите город' }}>
            <ListBoxItem data={{ content: 'Москва' }} />
            <ListBoxItem data={{ content: 'Омск' }} />
            <ListBoxItem data={{ content: 'Иркутск' }} />
          </ListBox>
          <RouteButton options={{ float: 'right' }} />
          <RulerControl options={{ float: 'right' }} />
          <SearchControl options={{ float: 'right' }} />
          <TrafficControl options={{ float: 'right' }} />
          <TypeSelector options={{ float: 'right' }} />
          <ZoomControl options={{ float: 'right' }} />
        </Map>
      </YMaps>
    </Grid>

  );
};

export default BindDiagram;



// import Backdrop from '@mui/material/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
// import Button from '@mui/material/Button';

    //   console.log('BindDiagram - props:', props);

    //   const [open, setOpen] = React.useState(false);
    //   const handleClose = () => {
    //     setOpen(false);
    //   };
    //   const handleToggle = () => {
    //     setOpen(!open);
    //   };

    //   return (
    //     <div>
    //       <Button onClick={handleToggle}>Show backdrop</Button>
    //       <Backdrop
    //         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    //         open={open}
    //         onClick={handleClose}
    //       >
    //         <CircularProgress color="inherit" />
    //       </Backdrop>
    //     </div>
    //   );