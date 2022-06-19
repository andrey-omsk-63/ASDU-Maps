import { combineReducers } from 'redux';
import { commReducer } from './commReducer';
import { massdkReducer } from './massdkReducer';
import { mapReducer } from './mapReducer';

export const rootReducer = combineReducers({
  commReducer,
  mapReducer,
  massdkReducer,
});
