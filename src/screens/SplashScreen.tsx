import React, {FunctionComponent, useState, useRef, useCallback} from 'react';
import {StyleSheet, ImageBackground, Image, View} from 'react-native';
import {AppScreenProps} from '../navigation/AppNavigation';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {DEV} from '../constants/apis';
import _ from 'lodash';
import {sortTempFeelsLike} from '../utils/utils';
import database from '@react-native-firebase/database';
import {UserReducer} from '../reducers/userReducer';
import {StoreState} from '../reducers';
import {connect, useDispatch} from 'react-redux';
import {LocationChangeAction, Unit, UserActionTypes} from '../actions';
import {ActionTypes} from '../actions/types';
import {appAlertMessage, testCoords} from '../utils/constant';
import {getPlaceImage, getDailyForecast} from '../actions';
import {AppReducer} from '../reducers/appReducer';

interface AppProps extends AppScreenProps {
  name: string;
  userReducer: UserReducer;
  getPlaceImage(lat: number, lng: number): void;
  getDailyForecast(lat: number, lng: number, unit: Unit): void;
  appReducer: AppReducer;
}

const SplashScreen: FunctionComponent<AppProps> = (props) => {
  const {
    navigation,
    userReducer,
    getPlaceImage,
    getDailyForecast,
    appReducer,
  } = props;
  const {userDetails, loggedIn, userData} = userReducer;

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, []),
  );

  const getUserData = async () => {
    try {
      if (loggedIn && userDetails) {
        const snapshot = await database()
          .ref(`/users/${userDetails.uid}`)
          .once('value');

        const data = await snapshot.val();

        dispatch<UserActionTypes>({
          type: ActionTypes.ON_FETCH_USER_SUCC,
          payload: data,
        });

        getCurrentLocation();

        // console.log(snapshot.val(), 'userData');
      } else {
        getCurrentLocation();
      }
    } catch (error) {
      console.log(error, 'error_fetching_userdata');
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      (info) => {
        // setCurrLocation(info);
        getCurrWeatherCondition(info.coords.latitude, info.coords.longitude);
        dispatch<LocationChangeAction>({
          type: ActionTypes.ON_GET_LOCATION_SUCC,
          payload: {lat: info.coords.latitude, lng: info.coords.longitude},
        });
      },
      (error) => {
        console.log(error, 'error_location');
      },
      {enableHighAccuracy: false, timeout: 2000, maximumAge: 3600000},
    );
  };

  const getCurrWeatherCondition = useCallback(
    async (lat: number, lng: number): Promise<void> => {
      try {
        DEV
          ? getPlaceImage(testCoords.lat, testCoords.lng)
          : getPlaceImage(lat, lng);

        DEV
          ? getDailyForecast(testCoords.lat, testCoords.lng, 'e')
          : getDailyForecast(lat, lng, 'e');
      } catch (error) {}
    },
    [],
  );

  return (
    <ImageBackground
      source={require('../assets/images/splashscreen.png')}
      style={styles.container}>
      <Image
        source={require('../assets/icons/weathAR.png')}
        style={styles.logoStyle}
        resizeMode="contain"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: 50,
    width: 132,
    // marginLeft: 25,
  },
});

const mapStateToProps = ({
  userReducer,
  appReducer,
}: StoreState): {userReducer: UserReducer; appReducer: AppReducer} => {
  return {
    userReducer,
    appReducer,
  };
};

export default connect(mapStateToProps, {getPlaceImage, getDailyForecast})(
  SplashScreen,
);
