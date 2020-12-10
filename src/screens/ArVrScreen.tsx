import React, {FunctionComponent} from 'react';
import {ViroVRSceneNavigator, ViroARSceneNavigator} from 'react-viro';

const UNSET = 'UNSET';
const InitialARScene = require('../components/HelloWorldSceneAr');
const InitialVRScene = require('../components/HelloWorldScene');

const sharedProps = {
  apiKey: 'API_KEY_HERE',
};

const ArVrScreen: FunctionComponent = () => {
  return (
    <ViroARSceneNavigator
      apiKey={sharedProps.apiKey}
      initialScene={{scene: InitialARScene}}
    />
  );
};

export default ArVrScreen;
