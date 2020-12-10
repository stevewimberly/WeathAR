/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import {persistor, store} from './src/store';
import {PersistGate} from 'redux-persist/integration/react';
import {ActivityIndicator} from 'react-native';

declare const global: {HermesInternal: null | {}};

const App: React.FunctionComponent = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<ActivityIndicator />}>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
