import {UserActionTypes, UserData, UserDetails} from '../actions';
import {ActionTypes} from '../actions/types';

export interface UserReducer {
  userDetails: UserDetails | null;
  loggedIn: boolean;
  userData: null | UserData;
}

const INITIAL_STATE: UserReducer = {
  loggedIn: false,
  userDetails: null,
  userData: null,
};

export const userReducer = (
  state: UserReducer = INITIAL_STATE,
  action: UserActionTypes,
) => {
  switch (action.type) {
    case ActionTypes.ON_LOGIN_SUCC:
      return {...state, userDetails: action.payload, loggedIn: true};

    case ActionTypes.ON_FETCH_USER_SUCC:
      return {...state, userData: action.payload};

    case ActionTypes.ON_LOGOUT:
      return {...state, ...INITIAL_STATE};

    default:
      return state;
  }
};
