import {Point} from 'react-native-google-places-autocomplete';
import {
  AppAction,
  AuthScreen,
  DailyWeatherData,
  ConditionType,
  Unit,
} from '../actions';
import {ActionTypes} from '../actions/types';
import {ModalData} from '../components/WeatherDetailModal';
import {Address} from '../screens/HomeScreen';
import {SortedValues} from '../utils/utils';

export interface AppReducer {
  email: string | null;
  screen: AuthScreen | null;
  placeImage: string | null;
  currentLocation: Address | null;
  loadingDailyData: boolean;
  dailyHourlyData: DailyWeatherData[] | [];
  currLocationCoords: Point | null;
  loadingData: boolean;
  forecastAssurance: number;
  tempFeelsLike: SortedValues[] | [];
  temp: SortedValues[] | [];
  precip: SortedValues[] | [];
  wind: SortedValues[] | [];
  humidity: SortedValues[] | [];
  modalData: ModalData | null | [];
  windGust: SortedValues[] | [];
  dewPoint: SortedValues[] | [];
  cuWeatherCondition: ConditionType | null;
  unit: Unit;
  greeting: string;
  sunset: string;
  sunrise: string;
  temperatureMin: string;
  callActionLink: string | null;
}

const INITIAL_STATE: AppReducer = {
  email: null,
  screen: null,
  placeImage: null,
  currentLocation: null,
  loadingDailyData: true,
  dailyHourlyData: [],
  currLocationCoords: null,
  loadingData: true,
  forecastAssurance: 0,
  tempFeelsLike: [],
  temp: [],
  precip: [],
  wind: [],
  humidity: [],
  modalData: [],
  cuWeatherCondition: null,
  unit: 'e',
  greeting: '',
  sunrise: '',
  sunset: '',
  temperatureMin: '',
  callActionLink: null,
};

export const appReducer = (
  state: AppReducer = INITIAL_STATE,
  action: AppAction,
) => {
  switch (action.type) {
    case ActionTypes.ON_EMAIL_CHANGE:
      return {
        ...state,
        email: action.payload.email,
        screen: action.payload.screen,
      };

    case ActionTypes.ON_GET_GEOCODE_SUCC:
      return {...state, currentLocation: action.payload};

    case ActionTypes.ON_GET_PLACE_IMAGE_SUCC:
      return {...state, placeImage: action.payload};

    case ActionTypes.ON_GET_DAILY_HOURLY_DATA:
      return {
        ...state,
        loadingDailyData: false,
        dailyHourlyData: action.payload,
        greeting: action.greeting,
        sunset: action.sunset,
        sunrise: action.sunrise,
        temperatureMin: action.temperatureMin,
        // windGust: action.windGust,
        // dewPoint: action.dewPoint,
      };

    case ActionTypes.ON_GET_LOCATION_SUCC:
      return {
        ...state,
        currLocationCoords: action.payload,
      };

    case ActionTypes.ON_UPDATE_UNIT_CHANGE:
      return {...state, unit: action.payload};

    case ActionTypes.ON_GET_HOME_DATA_SUCC:
      return {
        ...state,
        loadingData: false,
        forecastAssurance: action.payload.forecastAssurance,
        tempFeelsLike: action.payload.tempFeelsLike,
        temp: action.payload.temp,
        precip: action.payload.precip,
        wind: action.payload.wind,
        humidity: action.payload.humidity,
        modalData: action.payload.modalData,
        cuWeatherCondition: action.payload.cuWeatherCondition,
        dewPoint: action.payload.dewPoint,
      };

    case ActionTypes.ON_GET_HOME_DATA_START:
      return {...state, loadingData: true};

    case ActionTypes.ON_GET_CALL_TO_ACTION_LINK:
      return {...state, callActionLink: action.payload};

    default:
      return state;
  }
};
