import {Alert} from 'react-native';

export const appAlertMessage = (message: string, onPress?: () => {}): void => {
  Alert.alert('Weath AR', message, [{text: 'Ok', onPress}]);
};

export const GOOGLE_PLACE_API = 'AIzaSyDicPEX3zFSwVPddGIRg8QBnyKV4OWK82o';
export const GOOGLE_GEOCODING_API = 'AIzaSyDicPEX3zFSwVPddGIRg8QBnyKV4OWK82o';

export const testCoords = {lat: 38.89511, lng: -77.03637};
