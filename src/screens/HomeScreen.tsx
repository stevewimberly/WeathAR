import React, {
  FunctionComponent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {AppScreenProps} from '../navigation/AppNavigation';
import BottomSheet from 'reanimated-bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {appStyles, FONTS} from '../styles/styles';
import WeatherCirlce from '../components/WeatherCircle';
import DailyWeather from '../components/DailyWeather';
import HourlyReading from '../components/HourlyReading';
import {HourlyReadingArray} from '../components/HourlyReading';
import GoogleAdsDisplay from '../components/GoogleAdsDisplay';
import CallToActionDisplay from '../components/CallToActionDisplay';
import Modal from 'react-native-modal';
import WeatherDetailModal from '../components/WeatherDetailModal';
import CameraButton from '../components/Buttons/CameraButton';
import Geolocation from '@react-native-community/geolocation';
import {useFocusEffect} from '@react-navigation/native';
import {DEV} from '../constants/apis';
import _ from 'lodash';
import LocationSelector from '../components/LocationSelector';
import {weatherIconFiles, getGreetingTime} from '../utils/utils';
import database from '@react-native-firebase/database';
import {UserReducer} from '../reducers/userReducer';
import {StoreState} from '../reducers';
import {connect, useDispatch} from 'react-redux';
import {
  AppAction,
  getHomeScreenData,
  LocationChangeAction,
  Unit,
  UserActionTypes,
  GetCurrentLocationAction,
  getCallToActionLink,
} from '../actions';
import {ActionTypes} from '../actions/types';
import {appAlertMessage, testCoords} from '../utils/constant';
import Spinner from 'react-native-loading-spinner-overlay';
import ForecastAssurance from '../components/ForecastAssurance';
import {getPlaceImage, getDailyForecast} from '../actions';
import {AppReducer} from '../reducers/appReducer';
import moment from 'moment';

navigator.geolocation = require('@react-native-community/geolocation');

interface AppProps extends AppScreenProps {
  name: string;
  userReducer: UserReducer;
  getPlaceImage(lat: number, lng: number): void;
  getDailyForecast(lat: number, lng: number, unit: Unit): void;
  getHomeScreenData(lat: number, lng: number, unit: Unit): void;
  appReducer: AppReducer;
  getCallToActionLink(): void;
}

const hourlyReading: HourlyReadingArray = [
  {time: '5', pmValue: 'PM', readingValue: '100'},
  {time: '6', pmValue: 'PM', readingValue: '53'},
  {time: '7', pmValue: 'PM', readingValue: '51'},
  {time: '8', pmValue: 'PM', readingValue: '50'},
  {time: '9', pmValue: 'PM', readingValue: '50'},
  {time: '10', pmValue: 'PM', readingValue: '45'},
  {time: '11', pmValue: 'PM', readingValue: '40'},
  {time: '12', pmValue: 'AM', readingValue: '40'},
  {time: '1', pmValue: 'AM', readingValue: '40'},
  {time: '2', pmValue: 'AM', readingValue: '40'},
  {time: '3', pmValue: 'AM', readingValue: '36'},
  {time: '4', pmValue: 'AM', readingValue: '34'},
  {time: '5', pmValue: 'AM', readingValue: '32'},
];

export interface Address {
  formatedAddress?: string;
  location: {
    lat: number;
    lng: number;
  };
  description?: 'Home' | 'Work';
}

const HomeScreen: FunctionComponent<AppProps> = (props) => {
  const {
    navigation,
    userReducer,
    getPlaceImage,
    getDailyForecast,
    getHomeScreenData,
    getCallToActionLink,
    appReducer,
  } = props;
  const {userDetails, loggedIn, userData} = userReducer;
  const {
    placeImage,
    currentLocation,
    loadingData,
    forecastAssurance,
    tempFeelsLike,
    temp,
    precip,
    wind,
    humidity,
    modalData,
    cuWeatherCondition,
    unit,
    greeting,
    sunrise,
    sunset,
    temperatureMin,
    callActionLink,
    windGust,
    dewPoint,
  } = appReducer;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [locationPicker, setLocationPicker] = useState<
    'current' | 'work' | 'home'
  >('current');
  const [homeEdit, setHomeEdit] = useState(false);
  const [workEdit, setWorkEdit] = useState(false);
  const [homeAddress, setHomeAddress] = useState<Address | null>(null);
  const [workAddress, setWorkAddress] = useState<Address | null>(null);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [userUpdating, setUserUpdating] = useState(false);

  const locationSheet = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const screenHeight = Dimensions.get('screen').height / 1.16;

  const showModal = (): void => {
    setModalVisible(true);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch<AppAction>({
  //       type: ActionTypes.ON_GET_HOME_DATA_START,
  //     });
  //     getUserData();
  //     getCallToActionLink();
  //   }, [unit]),
  // );

  useEffect(() => {
    dispatch<AppAction>({
      type: ActionTypes.ON_GET_HOME_DATA_START,
    });
    // appAlertMessage('ndddhs');
    getUserData();
    getCallToActionLink();
  }, []);

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
        dispatch<LocationChangeAction>({
          type: ActionTypes.ON_GET_LOCATION_SUCC,
          payload: {lat: info.coords.latitude, lng: info.coords.longitude},
        });
        getCurrWeatherCondition(info.coords.latitude, info.coords.longitude);
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
          ? getDailyForecast(testCoords.lat, testCoords.lng, unit)
          : getDailyForecast(lat, lng, unit);
        DEV
          ? getHomeScreenData(testCoords.lat, testCoords.lng, unit)
          : getHomeScreenData(lat, lng, unit);
      } catch (error) {}
    },
    [unit],
  );

  const onCurrentLocationPress = () => {
    locationSheet.current?.snapTo(0);
    if (loggedIn && userData?.homeAddress) {
      dispatch<AppAction>({
        type: ActionTypes.ON_GET_HOME_DATA_START,
      });
      setLocationPicker('current');
      getCurrWeatherCondition(
        userData.homeAddress.location.lat,
        userData.homeAddress.location.lng,
      );
    } else {
      appAlertMessage('Please login and set home address');
    }
  };

  const onLocationSearch = (lat: number, lng: number, address: string) => {
    locationSheet.current?.snapTo(0);

    dispatch<LocationChangeAction>({
      type: ActionTypes.ON_GET_LOCATION_SUCC,
      payload: {lat, lng},
    });

    dispatch<GetCurrentLocationAction>({
      type: ActionTypes.ON_GET_GEOCODE_SUCC,
      payload: {
        formatedAddress: address,
        location: {
          lat,
          lng,
        },
      },
    });

    setLocationPicker('current');

    dispatch<AppAction>({
      type: ActionTypes.ON_GET_HOME_DATA_START,
    });

    setTimeout(() => {
      getCurrWeatherCondition(lat, lng);
    }, 200);

    //
  };

  const onHomeLocationPress = () => {
    locationSheet.current?.snapTo(0);
    if (loggedIn && userData?.homeAddress) {
      dispatch<AppAction>({
        type: ActionTypes.ON_GET_HOME_DATA_START,
      });
      setLocationPicker('home');
      getCurrWeatherCondition(
        userData.homeAddress.location.lat,
        userData.homeAddress.location.lng,
      );
    } else {
      appAlertMessage('Please login and set home address');
    }
  };

  const onWorkLocationPress = () => {
    locationSheet.current?.snapTo(0);

    if (loggedIn && userData?.workAddress) {
      dispatch<AppAction>({
        type: ActionTypes.ON_GET_HOME_DATA_START,
      });
      setLocationPicker('work');
      getCurrWeatherCondition(
        userData.workAddress.location.lat,
        userData.workAddress.location.lng,
      );
    } else {
      appAlertMessage('Please login and set home address');
    }
  };

  const onEditPress = (type: 'home' | 'work', callBack: Function) => {
    if (userReducer.loggedIn) {
      if (type === 'home') {
        if (homeEdit) {
          if (homeAddress) {
            updateUserData(homeAddress);
            // updateUserData(homeAddress);
          } else {
            appAlertMessage('Please input an address');
          }
        } else {
          setHomeEdit(true);
          callBack();
          // homeAddressRef.current?.focus();
        }
      } else {
        if (workEdit) {
          if (workAddress) {
            updateUserData(workAddress);
          } else {
            appAlertMessage('Please input an address');
          }
        } else {
          setWorkEdit(true);
          callBack();
          // homeAddressRef.current?.focus();
        }
      }
    } else {
      navigation.navigate('LoginScreen');
    }
    // locationSheet.current?.snapTo(0);
  };

  const onLocationSelect = (
    type: 'home' | 'work',
    address: Address,
    callBack?: Function,
  ) => {
    if (type === 'home') {
      setHomeAddress(address);
      setHomeEdit(true);
    } else if (type === 'work') {
      setWorkAddress(address);
      setWorkEdit(true);
    }
  };

  const updateUserData = async (data: Address) => {
    setUserUpdating(true);
    try {
      const body = {
        ...data,
      };

      if (data) {
        await database()
          .ref(
            `/users/${
              userDetails?.uid
            }/${data.description!.toLowerCase()}Address`,
          )
          .set(body);
        setUserUpdating(false);
        getUserData();
        setHomeEdit(false);
        setWorkEdit(false);
        locationSheet.current?.snapTo(0);
      }
    } catch (error) {
      setUserUpdating(false);
    }
  };

  if (loadingData) {
    return (
      <ImageBackground
        source={require('../assets/images/splashscreen.png')}
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Image
          source={require('../assets/icons/weathAR.png')}
          style={styles.logoStyle}
          resizeMode="contain"
        />
      </ImageBackground>
    );
  } else {
    return (
      <ImageBackground
        source={require('../assets/images/home_background_image.png')}
        blurRadius={1}
        style={styles.container}>
        <ScrollView style={styles.scrollContentContainerStyle}>
          <Spinner visible={userUpdating} textContent={'Saving...'} />
          <View style={[styles.topContainer]}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.headerLeft}
                onPress={() => locationSheet.current?.snapTo(screenHeight)}>
                <Entypo name="location-pin" color="#fff" size={22} />
                <Text style={styles.headerText}>
                  {/* {cuWeatherCondition?.obs_name} */}
                  {locationPicker === 'current' &&
                    currentLocation?.formatedAddress}
                  {locationPicker === 'home' &&
                    userData?.homeAddress?.formatedAddress}
                  {locationPicker === 'work' &&
                    userData?.workAddress?.formatedAddress}
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity>
                <Feather name="camera" color="#fff" size={25} />
              </TouchableOpacity> */}
            </View>
            <View style={styles.weatherHeaderStyle}>
              <View style={styles.cloudContainer}>
                <Image
                  source={weatherIconFiles[`${cuWeatherCondition!.wx_icon}`]}
                  style={styles.cloudImage}
                  resizeMode="contain"
                />
                <Text style={appStyles.titleStyle}>
                  {cuWeatherCondition?.wx_phrase}
                </Text>
              </View>
              <View style={{position: 'relative'}}>
                <View style={{marginRight: 10}}>
                  <View>
                    <Text style={styles.tempText}> FEELS LIKE</Text>
                    <Text style={styles.tempBig}>
                      {cuWeatherCondition?.feels_like}&#xb0;
                      <Text style={styles.tempSmall}>
                        {temperatureMin && '/'}
                        {temperatureMin}&#xb0;
                      </Text>
                    </Text>
                  </View>
                  <Text style={appStyles.titleStyle}>
                    Humidity: {cuWeatherCondition?.rh}%
                  </Text>
                </View>
                <ForecastAssurance
                  forcastScore={forecastAssurance}
                  customContainerStyle={{
                    position: 'absolute',
                    right: -15,
                    top: 0,
                    alignSelf: 'center',
                    borderRadius: 100,
                  }}
                />
              </View>
            </View>
            <View style={styles.weatherHeaderDetailsContainer}>
              <WeatherCirlce
                name="Precip:"
                weatherValue={`${
                  cuWeatherCondition?.precip_total
                    ? cuWeatherCondition?.precip_total
                    : 0
                }%`}
                source={require('../assets/icons/water_drop_icon.png')}
                onPress={showModal}
              />
              <WeatherCirlce
                name="Wind:"
                weatherValue={`${cuWeatherCondition?.wspd} ${
                  unit === 'e' || unit === 'h' ? 'MPH' : 'KM/H'
                } ${cuWeatherCondition?.wdir_cardinal}`}
                source={require('../assets/icons/windmill_icon.png')}
                customStyle={{height: 25}}
                onPress={showModal}
              />
              <WeatherCirlce
                name="UV:"
                weatherValue={`${
                  cuWeatherCondition?.uv_index
                    ? cuWeatherCondition?.uv_index
                    : 0
                }`}
                source={require('../assets/icons/glass_icon.png')}
                customStyle={{height: 15}}
                onPress={showModal}
              />
            </View>
          </View>

          <View style={[styles.bottomContainer]}>
            <View
              style={[styles.greetingContainer, appStyles.bottomMarginMedium]}>
              {placeImage && (
                <Image
                  source={{uri: placeImage}}
                  style={styles.greetingImageStyle}
                />
              )}
              <View style={styles.greetingTextContainer}>
                <Text
                  style={[
                    appStyles.headerTwoStyle,
                    appStyles.bottomMarginSmall,
                  ]}>
                  {`Good ${getGreetingTime(
                    // cuWeatherCondition?.valid_time_gmt,
                    moment.now(),
                  )}`}
                </Text>
                <Text style={styles.greetingStyle}>
                  {greeting}
                  {/* {cuWeatherCondition?.blunt_phrase} */}
                  {/* {`Today would be ${cuWeatherCondition?.wx_phrase}.`} */}
                  {/* Today will be partly cloudy with a light breeze from
                          the NW. Enjoy your day. */}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.hourlyWeatherContainer,
                appStyles.bottomMarginMedium,
              ]}>
              <HourlyReading
                data={hourlyReading}
                tempFeelsLikeData={tempFeelsLike}
                tempData={temp}
                precipData={precip}
                windData={wind}
                humidityData={humidity}
                unit={unit}
                windGustData={windGust}
                dewPointData={dewPoint}
              />
            </View>
            <View
              style={[styles.googleAdsContainer, appStyles.bottomMarginMedium]}>
              <GoogleAdsDisplay />
            </View>
            <View
              style={[
                styles.dailyWeatherContainer,
                appStyles.bottomMarginMedium,
              ]}>
              <DailyWeather />
            </View>
            {callActionLink && (
              <View
                style={[
                  styles.callToActionContainer,
                  appStyles.bottomMarginMedium,
                ]}>
                <CallToActionDisplay imageLink={callActionLink} />
              </View>
            )}

            {/* </ScrollView> */}
          </View>
        </ScrollView>
        <BottomSheet
          ref={locationSheet}
          snapPoints={[0, screenHeight, screenHeight]}
          borderRadius={30}
          renderContent={() => {
            return (
              <View style={{}}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: screenHeight,
                    paddingVertical: 5,
                  }}>
                  <View style={styles.scrollIndicator} />
                  <LocationSelector
                    height={screenHeight}
                    homeEdit={homeEdit}
                    workEdit={workEdit}
                    onHomePress={() => onHomeLocationPress()}
                    onWorkPress={() => onWorkLocationPress()}
                    // onLocationSearch={(lat, lng, address) =>
                    //   onLocationSearch(lat, lng, address)
                    // }
                    onLocationSearch={onLocationSearch}
                    onEditPress={onEditPress}
                    onLocationSelect={onLocationSelect}
                    userHomeAddress={userData?.homeAddress?.formatedAddress}
                    userWorkAddress={userData?.workAddress?.formatedAddress}
                    currentLocation={currentLocation}
                  />
                </View>
              </View>
            );
          }}
          onCloseEnd={() => {
            setWorkEdit(false);
            setHomeEdit(false);
            Keyboard.dismiss();
          }}
        />
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={() => {
            setModalVisible(false);
          }}
          onBackdropPress={() => {
            setModalVisible(false);
          }}>
          <WeatherDetailModal
            data={modalData}
            weatherData={cuWeatherCondition}
            forcastScore={forecastAssurance}
            onPress={() => {
              setModalVisible(false);
            }}
            unit={unit}
            sunData={{
              sunRise: sunrise,
              sunSet: sunset,
            }}
          />
        </Modal>

        {!loadingData && (
          <CameraButton
            onPress={() => {
              navigation.navigate('CameraScreen');
            }}
            customStyle={styles.cameraButtonStyle}
          />
        )}
      </ImageBackground>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  logoStyle: {
    height: 50,
    width: 132,
    // marginLeft: 25,
  },

  cameraButtonStyle: {
    position: 'absolute',
    bottom: 15,
    right: 30,
  },
  scrollContentContainerStyle: {
    flexGrow: 1,
    backgroundColor: 'rgba(255,255,255,.1)',
  },
  scrollIndicator: {
    height: 4,
    width: '30%',
    backgroundColor: '#C9C9C9',
    alignSelf: 'center',
    marginBottom: 10,
    borderRadius: 100,
  },
  topContainer: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    flex: 1,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  weatherHeaderStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  cloudContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloudImage: {
    height: 70,
    width: 100,
  },
  tempBig: {
    color: '#000',
    fontSize: 50,
    fontFamily: FONTS.bold,

    marginTop: -10,
  },
  tempSmall: {
    fontSize: 25,
    fontWeight: 'normal',
  },
  tempText: {
    color: '#000',
    fontFamily: FONTS.bold,
  },
  weatherHeaderDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  greetingContainer: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginTop: 10,
  },
  greetingImageStyle: {
    height: '100%',
    flex: 1,
    marginRight: 20,
    borderRadius: 20,
    minHeight: Dimensions.get('window').height / 8,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingStyle: {
    color: '#000',
    fontSize: 15,
  },
  dailyWeatherContainer: {},
  hourlyWeatherContainer: {},
  googleAdsContainer: {},
  callToActionContainer: {},
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

export default connect(mapStateToProps, {
  getPlaceImage,
  getDailyForecast,
  getHomeScreenData,
  getCallToActionLink,
})(HomeScreen);
