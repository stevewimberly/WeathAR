import {Address} from './../screens/ProfileScreen';
import {ActionTypes} from './types';
import database from '@react-native-firebase/database';
import {Dispatch} from 'redux';

export interface UserMetadata {
  creationTime?: string;
  lastSignInTime?: string;
}

export interface UserInfo {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId: string;
  uid: string;
}

export interface UserDetails {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: UserInfo[];
  providerId: string;
  uid: string;
}

export interface UserData {
  workAddress?: null | Address;
  homeAddress?: null | Address;
}

export interface UserFetchAction {
  type: ActionTypes.ON_FETCH_USER_SUCC;
  payload: UserData | null;
}

export interface UserLoginAction {
  type: ActionTypes.ON_LOGIN_SUCC;
  payload: UserDetails;
}

export interface UserLogoutAction {
  type: ActionTypes.ON_LOGOUT;
}

export type UserActionTypes =
  | UserLoginAction
  | UserFetchAction
  | UserLogoutAction;

export const getUserData = (uid: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const snapshot = await database().ref(`/users/${uid}`).once('value');

      dispatch<UserActionTypes>({
        type: ActionTypes.ON_FETCH_USER_SUCC,
        payload: snapshot.val(),
      });
    } catch (error) {}
  };
};
