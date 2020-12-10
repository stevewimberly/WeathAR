import React, {FunctionComponent, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {ViroARSceneNavigator} from 'react-viro';
import {StackScreenProps} from '@react-navigation/stack';
import {AppScreens} from '../navigation/AppNavigation';
import {appStyles, FONTS} from '../styles/styles';

const UNSETS: string = 'UNSET';
const InitialARScene = require('../components/HelloWorldSceneAr');
const cameraTestARScene = require('../components/CameraView');

const snowARScene = require('../components/ArVr/SnowCameraView');
const rainARScene = require('../components/ArVr/RainCameraView');

const sharedProps = {
  apiKey: 'API_KEY_HERE',
};

interface VireScreenMethods extends ViroARSceneNavigator {
  _takeScreenshot(
    fileName: string,
    saveToCameraRoll: boolean,
  ): Promise<SavedImage>;
}

interface SavedImage {
  url: string;
  errorCode: -1;
  success: true;
}

interface CameraScreenProps extends StackScreenProps<AppScreens> {}

const CameraScreen: FunctionComponent<CameraScreenProps> = (props) => {
  const viroArRef = useRef<VireScreenMethods>(null);
  const {navigation} = props;

  const takePicture = async (): Promise<void> => {
    try {
      const savedImage = await viroArRef.current!._takeScreenshot(
        `${Date.now()}-weathAr`,
        false,
      );

      navigation.push('PhotoPreviewScreen', {path: `file://${savedImage.url}`});
    } catch (error) {
      console.log(error, 'error');
      // alert(JSON.stringify(error));
    }
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        apiKey={sharedProps.apiKey}
        initialScene={{scene: snowARScene}}
        ref={viroArRef}
      />
      <View style={styles.footerContainer}>
        <View style={styles.weatherDetailsContainer}>
          <View style={styles.cloudContainer}>
            <Image
              source={require('../assets/icons/cloud_icon.png')}
              style={styles.cloudImage}
            />
            <Text style={appStyles.titleStyle}> Partly Cloudy</Text>
          </View>
          <View style={styles.weatherTextContainer}>
            <Text style={styles.tempBig}>
              55&#xb0;<Text style={styles.tempSmall}>/48</Text>
            </Text>
            <Text style={styles.stateText}>
              WASHINGTON
              <Text style={styles.districText}>{'\n'}District of Columbia</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.takeImageButton}
          onPress={() => {
            // console.log(viroArRef.current);
            takePicture();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  footerContainer: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'rgba(104, 102, 173, 0.2)',
  },
  takeImageButton: {
    height: 65,
    width: 65,
    backgroundColor: 'red',
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#fff',
  },
  tempBig: {
    color: '#fff',
    fontSize: 50,
    fontFamily: FONTS.bold,
    marginTop: -10,
  },
  tempSmall: {
    fontSize: 25,
    fontWeight: 'normal',
  },
  weatherDetailsContainer: {
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  stateText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  districText: {
    fontWeight: 'normal',
  },
  weatherTextContainer: {},
  cloudContainer: {},
  cloudImage: {
    height: 70,
    width: 100,
  },
});
export default CameraScreen;
