//import * as React from "react";

import { Pointer } from "./../App";

export const MapNewPoint = (coords: any, chNewCoord: number) => {
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
  masskPoint.nameCoordinates = "Новая точка " + String(chNewCoord);
  masskPoint.region = "";
  masskPoint.area = "";
  masskPoint.subarea = 0;
  masskPoint.newCoordinates = 1;
  return masskPoint;
};

export const DecodingCoord = (coord: string) => {
  return coord.split(",").map(Number);
};

export const CodingCoord = (coord: Array<number>) => {
  return String(coord[0]) + "," + String(coord[1]);
};

export const CenterCoord = (aY: number, aX: number, bY: number, bX: number) => {
  let coord0 = (aY - bY) / 2 + bY;
  if (aY < bY) coord0 = (bY - aY) / 2 + aY;
  let coord1 = (aX - bX) / 2 + bX;
  if (aX < bX) coord1 = (bX - aX) / 2 + aX;
  return [coord0, coord1];
};