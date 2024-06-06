import {
  MAP_CREATE,
  MASSDK_CREATE,
  MASSROUTE_CREATE,
  MASSROUTEPRO_CREATE,
  COORDINATES_CREATE,
  STATSAVE_CREATE,
  MASSPLAN_CREATE,
} from './types';

import { DateMAP } from './../interfaceMAP.d';
import { DateRoute } from './../interfaceRoute.d';
import { DatePlan } from './../interfacePlans.d';
import { Pointer } from './../App';
import { Stater } from './../App';

export function massdkCreate(massDka: Pointer[] = []) {
  return {
    type: MASSDK_CREATE,
    data: massDka,
  };
}

export function mapCreate(dateMap: DateMAP) {
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

export function massplanCreate(massPlan: DatePlan) {
  return {
    type: MASSPLAN_CREATE,
    data: massPlan,
  };
}

export function massrouteproCreate(massRouterPro: DateRoute) {
  return {
    type: MASSROUTEPRO_CREATE,
    data: massRouterPro,
  };
}

export function coordinatesCreate(Coordinates: Array<Array<number>>) {
  return {
    type: COORDINATES_CREATE,
    data: Coordinates,
  };
}

export function statsaveCreate(dateStat: Stater) {
  return {
    type: STATSAVE_CREATE,
    data: dateStat,
  };
}
