/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {setCustomText} from 'react-native-global-props';
import {Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'DMSans-Regular' : 'DMSans-Regular',
  },
};

setCustomText(customTextProps);

AppRegistry.registerComponent(appName, () => App);
