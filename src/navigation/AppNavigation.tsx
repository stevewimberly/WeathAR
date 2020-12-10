import React, {FunctionComponent} from 'react';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native';
import HomeTabs from './HomeTabs';
// import ArVrScreen from '../screens/ArVrScreen';
import CameraScreen from '../screens/CameraScreen';
import {HomeScreenTabs} from './HomeTabs';
import PhotoPreviewScreen from '../screens/PhotoPreviewScreen';
import SettingsScreen from './SettingsScreen';
import {DrawerScreenProps} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import {connect} from 'react-redux';
import {StoreState} from '../reducers';
import {UserReducer} from '../reducers/userReducer';
import PasswordScreen from '../screens/PasswordScreen';
import SplashScreen from '../screens/SplashScreen';

type RootStackType = {
  HomeTabs: undefined;
  CameraScreen: undefined;
  PhotoPreviewScreen: {path: string};
  SettingsScreen: undefined;
  LoginScreen: undefined;
  SignupScreen: undefined;
  PasswordScreen: undefined;
  SplashScreen: undefined;
};

export type AppScreens = RootStackType & HomeScreenTabs;

export interface AppScreenProps extends StackScreenProps<AppScreens> {}

export interface DrawerScreenProps extends DrawerScreenProps<AppScreens> {}

const Stack = createStackNavigator<RootStackType>();

interface AppNavigationProps {
  userReducer: UserReducer;
}
const AppNavigation: FunctionComponent<AppNavigationProps> = (props) => {
  const {userReducer} = props;
  const {loggedIn} = userReducer;

  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator keyboardHandlingEnabled={false}>
        {/* <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            header: () => null,
          }}
        /> */}
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="LoginScreen"
          options={{
            header: () => null,
          }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignupScreen"
          options={{
            header: () => null,
          }}
          component={SignupScreen}
        />
        <Stack.Screen
          name="PasswordScreen"
          options={{
            header: () => null,
          }}
          component={PasswordScreen}
        />

        <Stack.Screen
          name="CameraScreen"
          options={{
            header: () => null,
          }}
          component={CameraScreen}
        />
        <Stack.Screen
          name="PhotoPreviewScreen"
          options={{
            header: () => null,
          }}
          component={PhotoPreviewScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  userReducer,
}: StoreState): {userReducer: UserReducer} => {
  return {
    userReducer,
  };
};

export default connect(mapStateToProps)(AppNavigation);
