import { combineReducers } from 'redux';
import { massdkReducer } from './massdkReducer';
import { massrouteReducer } from './massrouteReducer';
import { massrouteproReducer } from './massrouteproReducer';
import { mapReducer } from './mapReducer';
import { coordinatesReducer } from './coordinatesReducer';
import { statsaveReducer } from './statsaveReducer';

export const rootReducer = combineReducers({
  //commReducer,
  mapReducer,
  massdkReducer,
  massrouteReducer,
  massrouteproReducer,
  coordinatesReducer,
  statsaveReducer,
});
