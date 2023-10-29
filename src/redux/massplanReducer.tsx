import { MASSPLAN_CREATE } from './types';
import { massPlan } from './../App';

const intialState = {
  massplan: massPlan,
};

export const massplanReducer = (state = intialState, action: any) => {
  switch (action.type) {
    case MASSPLAN_CREATE:
      return {
        ...state,
        massplan: action.data,
      };

    default:
      return state;
  }
};