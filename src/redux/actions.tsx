//import { INCREMENT, DECREMENT, INPUT_TEXT, COMM_CREATE, MASSFAZ_CREATE } from './types';
import {
  MAP_CREATE,
  //COMM_CREATE,
  MASSDK_CREATE,
  MASSROUTE_CREATE,
  COORDINATES_CREATE,
} from "./types";

//import { DateRPU } from './../interfaceRPU.d';
import { DateMAP } from "./../interfaceMAP.d";
import { DateRoute } from './../interfaceRoute.d';
//import { Tflight } from './../interfaceMAP.d';
import { Pointer } from "./../App";
//import { Coordinates } from './../App';
//import { Router } from "./../App";

// export function incrementLikes() {
//   return {
//     type: INCREMENT,
//   };
// }

// export function decrementLikes() {
//   return {
//     type: DECREMENT,
//   };
// }

// export function commCreate(dateRpu: DateRPU) {
//   return {
//     type: COMM_CREATE,
//     data: { dateRpu },
//   };
// }

export function massdkCreate(massDka: Pointer[] = []) {
  return {
    type: MASSDK_CREATE,
    data: massDka,
  };
}

export function mapCreate(dateMap: DateMAP) {
  //export function mapCreate(dateMap: Tflight[]) {
  return {
    type: MAP_CREATE,
    data: { dateMap },
  };
}

export function massrouteCreate(massRouter: DateRoute) {
  return {
    type: MASSROUTE_CREATE,
    data: massRouter,
  };
}

export function coordinatesCreate(Coordinates: Array<Array<number>>) {
  return {
    type: COORDINATES_CREATE,
    data: Coordinates,
  };
}