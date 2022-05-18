import { combineReducers } from 'redux';
import { commReducer } from './commReducer';
import { massfazReducer } from './massfazReducer';
import { mapReducer } from './mapReducer';

export const rootReducer = combineReducers({
  commReducer,
  mapReducer,
  massfazReducer,
});
