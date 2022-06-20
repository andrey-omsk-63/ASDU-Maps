import * as React from "react";
import { useSelector } from "react-redux";

import { Pointer } from "./../../App";

const MapNewPoint = (coords: any, chNewCoord: number) => {
  //== Piece of Redux ======================================
  let massdk = useSelector((state: any) => {
    const { massdkReducer } = state;
    return massdkReducer.massdk;
  });
  //console.log('massdk:', massdk);
  //========================================================
  let nomer = chNewCoord;
  let masskPoint: Pointer = {
    ID: 0,
    coordinates: [],
    nameCoordinates: "",
    region: "",
    area: "",
    subarea: 0,
    newCoordinates: 0,
  };

  masskPoint.ID = 0;
  masskPoint.coordinates = coords;
  masskPoint.nameCoordinates = "Новая точка " + String(nomer);
  masskPoint.region = "";
  masskPoint.area = "";
  masskPoint.subarea = 0;
  masskPoint.newCoordinates = 1;
  massdk.push(masskPoint);
  // coordinates.push(coords);
  // chNewCoord++;
  // console.log("Massdk_new:", massdk);
  // setSize(window.innerWidth + Math.random());
};

export default MapNewPoint;
