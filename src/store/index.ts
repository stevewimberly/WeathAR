import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {compact} from 'lodash';
import {persistStore, persistReducer} from 'redux-persist';
import {createLogger} from 'redux-logger';
import {reducers} from '../reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  key: 'LIFTED_REDUX_STORE',
  storage: AsyncStorage,
  whitelist: ['userReducer', 'appReducer'],
};

const persistedReducer = persistReducer(config, reducers);
const middleware = compact([thunk, __DEV__ ? createLogger() : null]);

export const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware),
);

export const persistor = persistStore(store);
