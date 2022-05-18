import { combineReducers } from 'redux';
import { likesReducer } from './likesReducer';
import { inputReducer } from './inputReducer';
import { commReducer } from './commReducer';
import { massfazReducer } from './massfazReducer';

export const rootReducer = combineReducers({
  likesReducer,
  inputReducer,
  commReducer,
  massfazReducer,
});
