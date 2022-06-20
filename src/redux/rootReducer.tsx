import { combineReducers } from 'redux';
import { commReducer } from './commReducer';
import { massdkReducer } from './massdkReducer';
import { massrouteReducer } from './massrouteReducer';
import { mapReducer } from './mapReducer';

export const rootReducer = combineReducers({
  commReducer,
  mapReducer,
  massdkReducer,
  massrouteReducer,
});
