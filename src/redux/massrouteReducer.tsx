import { MASSROUTE_CREATE } from './types';
import { massRoute } from './../App';

const intialState = {
  massroute: massRoute,
};

export const massrouteReducer = (state = intialState, action: any) => {
  //console.log('massfazReducer:', action);
  switch (action.type) {
    case MASSROUTE_CREATE:
      return {
        ...state,
        massroute: action.data,
      };

    default:
      return state;
  }
};
