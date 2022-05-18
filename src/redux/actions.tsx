import { INCREMENT, DECREMENT, INPUT_TEXT, COMM_CREATE, MASSFAZ_CREATE } from './types';

import { DateRPU } from './../interfaceRPU.d';

export function incrementLikes() {
  return {
    type: INCREMENT,
  };
}

export function decrementLikes() {
  return {
    type: DECREMENT,
  };
}

export function inputText(text: string) {
  return {
    type: INPUT_TEXT,
    text,
  };
}

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
