//import { INCREMENT, DECREMENT, INPUT_TEXT, COMM_CREATE, MASSFAZ_CREATE } from './types';
import { MAP_CREATE, COMM_CREATE, MASSFAZ_CREATE } from './types';

import { DateRPU } from './../interfaceRPU.d';
import { Tflight } from './../interfaceMAP.d';

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

export function commCreate(dateRpu: DateRPU) {
  return {
    type: COMM_CREATE,
    data: { dateRpu },
  };
}

export function massfazCreate(massFaza: Array<Array<number>> = [[]]) {
  return {
    type: MASSFAZ_CREATE,
    data: massFaza,
  };
}

// export function mapCreate(dateMap: DateMAP) {
export function mapCreate(dateMap: Tflight[]) {
  return {
    type: MAP_CREATE,
    data: { dateMap },
  };
}
