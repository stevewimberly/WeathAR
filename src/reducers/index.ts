import {combineReducers} from 'redux';
import {AppReducer, appReducer} from './appReducer';
import {UserReducer, userReducer} from './userReducer';

export interface StoreState {
  userReducer: UserReducer;
  appReducer: AppReducer;
}

export const reducers = combineReducers<StoreState>({
  userReducer,
  appReducer,
});
