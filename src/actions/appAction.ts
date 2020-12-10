import {WeatherModalData} from './../components/WeatherDetailModal';
import axios from 'axios';
import {Dispatch} from 'redux';
import {
  GET_CURR_WEATHER_CONDITION,
  GET_DAILY_FORECAST,
  GET_DAILY_HOULY_FORECAST,
  GET_FEELS_LIKE_DATA,
  GET_FORE_CAST_ASSURANCE,
} from '../constants/apis';
import {Address} from '../screens/HomeScreen';
import {appAlertMessage, GOOGLE_GEOCODING_API} from '../utils/constant';
import {SortedValues, sortHourlyData, sortTempFeelsLike} from '../utils/utils';
import {ActionTypes} from './types';
import _ from 'lodash';
import {Point} from 'react-native-google-places-autocomplete';
import {ModalData} from '../components/WeatherDetailModal';
import moment from 'moment';
import database from '@react-native-firebase/database';

export type AuthScreen = 'login' | 'signup' | 'password';

export type Unit = 'e' | 'h' | 'm';

export interface ConditionType {
  key: string;
  class: string;
  expire_time_gmt: number;
  obs_id: string;
  obs_name: string;
  valid_time_gmt: number;
  day_ind: string;
  temp: number;
  wx_icon: number;
  icon_extd: number;
  wx_phrase: string;
  pressure_tend: string;
  pressure_desc: string;
  dewPt: number;
  heat_index: number;
  rh: number;
  pressure: number;
  vis: number;
  wc: number;
  wdir: string;
  wdir_cardinal: string;
  gust: string;
  wspd: number;
  max_temp: string;
  min_temp: string;
  precip_total: string;
  precip_hrly: number;
  snow_hrly: string;
  uv_desc: string;
  feels_like: number;
  uv_index: number;
  qualifier: string;
  qualifier_svrty: string;
  blunt_phrase: string;
  terse_phrase: string;
  clds: string;
  water_temp: string;
  primary_wave_period: string;
  primary_wave_height: string;
  primary_swell_period: string;
  primary_swell_height: string;
  primary_swell_direction: string;
  secondary_swell_period: string;
  secondary_swell_height: string;
  secondary_swell_direction: string;
}

export interface AuthAction {
  type: ActionTypes.ON_EMAIL_CHANGE;
  payload: {screen: AuthScreen; email: string};
}

export interface GetPlaceAction {
  type: ActionTypes.ON_GET_PLACE_IMAGE_SUCC;
  payload: string;
}

export interface GetCurrentLocationAction {
  type: ActionTypes.ON_GET_GEOCODE_SUCC;
  payload: Address;
}

type Days =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Sunday';

export interface HourlyDailyData {
  label: string;
  data: SortedValues[];
}

export interface DailyWeatherData {
  day: Days;
  minTemp: number;
  maxTemp: number;
  iconCode: number;
  precipChance: number | null;
  validTimeLocal: Date;
  visible: boolean;
  data?: {
    windGust: HourlyDailyData;
    qpf: HourlyDailyData;
    relativeHumidity: HourlyDailyData;
    qpfSnow: HourlyDailyData;
    temperature: HourlyDailyData;
    temperatureDewPoint: HourlyDailyData;
    windSpeed: HourlyDailyData;
  };
}

export interface GetDailyHourlyAction {
  type: ActionTypes.ON_GET_DAILY_HOURLY_DATA;
  payload: DailyWeatherData[];
  greeting: string;
  sunrise: string;
  sunset: string;
  temperatureMin: string;
  // windGust: SortedValues[] | [];
  // dewPoint: SortedValues[] | [];
}

export interface LocationChangeAction {
  type: ActionTypes.ON_GET_LOCATION_SUCC;
  payload: Point;
}

export interface GetHomeScreenDataStartAction {
  type: ActionTypes.ON_GET_HOME_DATA_START;
}

export interface GetHomeScreenDataAction {
  type: ActionTypes.ON_GET_HOME_DATA_SUCC;
  payload: {
    forecastAssurance: number;
    tempFeelsLike: SortedValues[] | [];
    temp: SortedValues[] | [];
    precip: SortedValues[] | [];
    wind: SortedValues[] | [];
    humidity: SortedValues[] | [];
    modalData: ModalData | null | [];
    cuWeatherCondition: ConditionType | null;
    dewPoint: SortedValues[] | [];
  };
}

export interface UpdateUnitAction {
  type: ActionTypes.ON_UPDATE_UNIT_CHANGE;
  payload: Unit;
}

export interface OnGetCallToActionLink {
  type: ActionTypes.ON_GET_CALL_TO_ACTION_LINK;
  payload: string;
}

export type AppAction =
  | AuthAction
  | GetPlaceAction
  | GetCurrentLocationAction
  | GetDailyHourlyAction
  | LocationChangeAction
  | GetHomeScreenDataAction
  | GetHomeScreenDataStartAction
  | UpdateUnitAction
  | OnGetCallToActionLink;

export const getPlaceImage = (lat: number, lng: number) => {
  return async (dispatch: Dispatch) => {
    try {
      // Get PlaceID
      const {data: geocodeData} = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_GEOCODING_API}&result_type=locality`,
      );
      const placeId = geocodeData.results[0].place_id;
      const address = geocodeData.results[0].formatted_address;

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

      // Get Photo Reference
      const {data: placeData} = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photo&key=${GOOGLE_GEOCODING_API}`,
      );
      const photoReference = placeData.result.photos[0].photo_reference;

      dispatch<GetPlaceAction>({
        type: ActionTypes.ON_GET_PLACE_IMAGE_SUCC,
        payload: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_GEOCODING_API}`,
      });
    } catch (error) {}
  };
};

export const getHomeScreenData = (lat: number, lng: number, unit: Unit) => {
  return async (dispatch: Dispatch) => {
    try {
      const {data: forecastData} = await axios.get(
        `${GET_FORE_CAST_ASSURANCE}?geocode=${lng},${lat}&unit=${unit}`,
      );
      const length = forecastData.length;

      // Forecast Assurance Score
      const forecastScore = forecastData[length - 1][0];

      const weatherConditionData = await axios.post(
        GET_CURR_WEATHER_CONDITION,
        {lat, lng, unit: unit},
      );

      const {data: feelsLikeData} = await axios.post(GET_FEELS_LIKE_DATA, {
        lat,
        lng,
        unit: unit,
      });

      const sortedTempFeelsLike = sortTempFeelsLike(
        feelsLikeData.temperatureFeelsLike,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const sortedTemp = sortTempFeelsLike(
        feelsLikeData.temperature,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const sortedPrecipProb = sortTempFeelsLike(
        feelsLikeData.precipChance,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const sortedWind = sortTempFeelsLike(
        feelsLikeData.windSpeed,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const sortedHumidity = sortTempFeelsLike(
        feelsLikeData.relativeHumidity,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const sortedDewpoint = sortTempFeelsLike(
        feelsLikeData.temperatureDewPoint,
        feelsLikeData.validTimeLocal,
        feelsLikeData.iconCode,
      );

      const weatherCondModalData = _.map(
        weatherConditionData.data.observation,
        (dataVal: string, dataKey: string) => {
          switch (dataKey) {
            case 'temp':
              return {
                title: dataVal,
                subTitle: 'Temperature',
                imageSource: require('../assets/icons/temp_icon.png'),
                extraData: 'temp',
                index: 1,
              };

            case 'clds':
              return {
                // title: 'Cloud Cover',
                // subTitle: dataVal,
                title: dataVal,
                subTitle: 'Cloud Cover',
                imageSource: require('../assets/icons/cloud_cover_icon.png'),
                index: 2,
              };

            case 'uv_desc':
              return {
                title: dataVal,
                subTitle: 'UV Index',
                imageSource: require('../assets/icons/sun_icon.png'),
                index: 3,
              };

            case 'wspd':
              return {
                title: dataVal,
                subTitle: 'Wind',
                imageSource: require('../assets/icons/black_wind_mill.png'),
                index: 4,
                extraData: 'wind',
              };

            case 'dewPt':
              return {
                title: dataVal,
                subTitle: 'Dew Point',
                imageSource: require('../assets/icons/dew_icon.png'),
                extraData: 'dew',
                index: 5,
              };

            case 'rh':
              return {
                title: dataVal,
                subTitle: 'Humidity',
                imageSource: require('../assets/icons/humidity_icon.png'),
                extraData: 'humidity',
                index: 6,
              };

            case 'pressure':
              return {
                title: dataVal,
                subTitle: 'Pressure',
                imageSource: require('../assets/icons/pressure_icon.png'),
                extraData: 'quote',
                index: 7,
              };

            case 'valid_time_gmt':
              return {
                title: '8.14PM',
                subTitle: 'Sunset',
                imageSource: require('../assets/icons/sunset_icon.png'),
                index: 8,
                extraData: 'sun',
              };

            case 'precip_hrly':
              return {
                title: dataVal,
                subTitle: 'Precipitation',
                imageSource: require('../assets/icons/precip_icon.png'),
                extraData: 'quote',
                index: 9,
              };

            default:
              break;
          }
        },
      );

      const filteredData = _.filter(
        weatherCondModalData,
        (dataToFil: ModalData) => {
          return dataToFil && dataToFil;
        },
      );

      const sortedData = _.sortBy(
        filteredData,
        (dataToSort: WeatherModalData) => {
          return dataToSort.index;
        },
      );

      if (sortedData) {
        dispatch<GetHomeScreenDataAction>({
          type: ActionTypes.ON_GET_HOME_DATA_SUCC,
          payload: {
            forecastAssurance: forecastScore,
            tempFeelsLike: sortedTempFeelsLike,
            temp: sortedTemp,
            precip: sortedPrecipProb,
            wind: sortedWind,
            humidity: sortedHumidity,
            modalData: sortedData,
            cuWeatherCondition: weatherConditionData.data.observation,
            dewPoint: sortedDewpoint,
          },
        });
        // setCuWeatherCondition(weatherConditionData.data.observation);
        // setModalData(sortedData);
        // // console.log(weatherConditionData, 'sortedData');
        // setLoadingWeathCond(false);
        // setLoading(false);
      }
    } catch (error) {}
  };
};

export const getDailyForecast = (lat: number, lng: number, unit: Unit) => {
  return async (dispatch: Dispatch) => {
    const {data: dailyHourlyData} = await axios.get(
      `${GET_DAILY_HOULY_FORECAST}?geocode=${lat},${lng}&unit=${unit}`,
    );

    const {forecasts1Hour} = dailyHourlyData;

    // console.log(_.chunk(forecasts1Hour.percentiles[0].percentileValues, 24));

    const weeklyData = forecasts1Hour.percentiles.map((data: any) => {
      return {
        parameter: data.parameter,
        percentileValues: _.chunk(data.percentileValues, 24),
        time: _.chunk(forecasts1Hour.fcstValid, 24),
      };
    });

    const {data: dailyData} = await axios.get(
      `${GET_DAILY_FORECAST}?geocode=${lat},${lng}&unit=${unit}`,
    );

    console.log(dailyData);
    // appAlertMessage(`${dailyData.dayOfWeek.length}`);

    // Add day
    const dailyInfo: DailyWeatherData[] = dailyData.dayOfWeek
      .map((val: Days, index: number) => {
        // if (index <= 10) {
        return {
          day: val,
          visible: false,
          validTimeLocal: dailyData.validTimeLocal[index],
          minTemp: dailyData.temperatureMin[index],
          maxTemp: dailyData.temperatureMax[index],
          iconCode: dailyData.daypart[0].iconCode[index * 2],
          precipChance: dailyData.daypart[0].precipChance[index * 2],
        };
        // }
      })
      .filter((filteredData: number) => filteredData);

    const sortedWeeklyData = dailyInfo.map((info, index: number) => {
      const dayData = weeklyData.map((data: any) => {
        return {
          label: data.parameter,
          data: sortHourlyData(data.percentileValues[index], data.time[index]),
        };
      });

      return {
        ...info,
        data: {
          windGust: _.find(dayData, (d) => d.label === 'windGust'),
          qpf: _.find(dayData, (d) => d.label === 'qpf'),
          relativeHumidity: _.find(
            dayData,
            (d) => d.label === 'relativeHumidity',
          ),
          qpfSnow: _.find(dayData, (d) => d.label === 'qpfSnow'),
          temperature: _.find(dayData, (d) => d.label === 'temperature'),
          temperatureDewPoint: _.find(
            dayData,
            (d) => d.label === 'temperatureDewPoint',
          ),
          windSpeed: _.find(dayData, (d) => d.label === 'windSpeed'),
        },
      };
    });

    const windGustData = _.chunk(sortedWeeklyData[0].data.windGust.data, 12);
    const dewPointData = _.chunk(
      sortedWeeklyData[0].data.temperatureDewPoint.data,
      12,
    );

    dispatch<GetDailyHourlyAction>({
      type: ActionTypes.ON_GET_DAILY_HOURLY_DATA,
      payload: sortedWeeklyData,
      greeting: dailyData.narrative[0],
      sunrise: dailyData.sunriseTimeUtc[0],
      sunset: dailyData.sunsetTimeUtc[0],
      temperatureMin: dailyData.temperatureMin[0],
      // windGust: windGustData[1].reverse(),
      // dewPoint: dewPointData[1].reverse(),
    });

    try {
    } catch (error) {}
  };
};

export const getCallToActionLink = () => {
  return async (dispatch: Dispatch) => {
    try {
      const snapshot = await database().ref('/images/downImage').once('value');

      dispatch<OnGetCallToActionLink>({
        type: ActionTypes.ON_GET_CALL_TO_ACTION_LINK,
        payload: snapshot.val(),
      });
      // console.log(snapshot.val(), 'link');
      // .then((snapshot) => {
      //   console.log('User data: ', snapshot.val());
      // });
    } catch (error) {}
  };
};
