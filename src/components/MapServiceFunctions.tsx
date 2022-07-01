//import * as React from "react";

import { Pointer, Router } from "./../App";

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

export const RecordMassRoute = (
  pointAcod: string,
  pointBcod: string,
  activeRoute: any
) => {
  let masskRoute: Router = {
    region: 0,
    start: "",
    stop: "",
    length: 0,
    time: 0,
  };
  masskRoute.start = pointAcod;
  masskRoute.stop = pointBcod;
  if (activeRoute) {
    masskRoute.time = Math.round(activeRoute.properties.get("duration").value);
    masskRoute.length = Math.round(
      activeRoute.properties.get("distance").value
    );
  }
  return masskRoute;
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

//=== Placemark =====================================

export const getPointData = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any
) => {
  let textBalloon = "";
  if (index === pointAaIndex) textBalloon = "Начало";
  if (index === pointBbIndex) textBalloon = "Конец";
  return {
    hintContent: massdk[index].nameCoordinates, //balloonContent: PressBalloon(index), iconCaption: textBalloon,
    iconContent: textBalloon,
  };
};

export const getPointOptions = (
  index: number,
  pointAaIndex: number,
  pointBbIndex: number,
  massdk: any
) => {
  let colorBalloon = "islands#violetStretchyIcon";
  if (massdk[index].newCoordinates > 0)
    colorBalloon = "islands#darkOrangeStretchyIcon";
  if (index === pointAaIndex) colorBalloon = "islands#redStretchyIcon";
  if (index === pointBbIndex) colorBalloon = "islands#darkBlueStretchyIcon";
  return {
    preset: colorBalloon,
  };
};

//=== addRoute =====================================

export const getReferencePoints = (pointA: any, pointB: any) => {
  return {
    referencePoints: [pointA, pointB],
  };
};

export const getMultiRouteOptions = () => {
  return {
    routeActiveStrokeWidth: 5,
    //routeActiveStrokeColor: "#224E1F",
    routeStrokeWidth: 1.5,
  };
};

export const getMassPolyRouteOptions = () => {
  return {
    balloonCloseButton: false,
    strokeColor: "#1A9165",
    strokeWidth: 3,
  };
};

export const getMassMultiRouteOptions = () => {
  return {
    balloonCloseButton: false,
    routeStrokeStyle: "dot",
    strokeColor: "#1A9165",
    routeActiveStrokeWidth: 3,
    routeStrokeWidth: 0,
  };
};

export const getMassMultiRouteInOptions = () => {
  return {
    routeActiveStrokeWidth: 3,
    routeStrokeStyle: "dot",
    routeActiveStrokeColor: "#E91427",
    routeStrokeWidth: 0,
  };
};

//=== костыль ======================================
let a0 = {
  region: 0,
  start: "55.7276995,36.8193915",
  stop: "55.69928816060674,37.39474443074465",
  length: 56425,
  time: 2792,
};
let a1 = {
  region: 0,
  start: "55.7276995,36.8193915",
  stop: "55.60238311111584,36.483017680936115",
  length: 30452,
  time: 1790,
};
let a2 = {
  region: 0,
  start: "55.7276995,36.8193915",
  stop: "55.62968055298542,37.021400723452174",
  length: 22476,
  time: 1430,
};
let a3 = {
  region: 0,
  start: "55.62968055298542,37.021400723452174",
  stop: "55.69928816060674,37.39474443074465",
  length: 31326,
  time: 1808,
};
let a4 = {
  region: 0,
  start: "55.69928816060674,37.39474443074465",
  stop: "55.905786101735075,37.7174511711464",
  length: 46435,
  time: 2667,
};
let a5 = {
  region: 0,
  start: "55.69928816060674,37.39474443074465",
  stop: "55.913241655910504,37.8378230903432",
  length: 50578,
  time: 2600,
};
let a6 = {
  region: 0,
  start: "55.913241655910504,37.8378230903432",
  stop: "55.905786101735075,37.7174511711464",
  length: 11600,
  time: 1174,
};
let a7 = {
  region: 0,
  start: "55.69928816060674,37.39474443074465",
  stop: "55.65943211246696,37.92773938370481",
  length: 47717,
  time: 2627,
};
let a8 = {
  region: 0,
  start: "55.65619605179316,38.10076639140717",
  stop: "55.408054,36.7174221",
  length: 112201,
  time: 6766,
};
let a9 = {
  region: 0,
  start: "55.60238311111584,36.483017680936115",
  stop: "55.7276995,36.8193915",
  length: 32653,
  time: 1924,
};
export let massOtladka = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9];
