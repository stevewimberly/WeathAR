import {StackScreenProps} from '@react-navigation/stack';
import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {AppScreens} from '../navigation/AppNavigation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';
import {appAlertMessage} from '../utils/constant';

interface PhotoPreviewScreenProps
  extends StackScreenProps<AppScreens, 'PhotoPreviewScreen'> {}

const PhotoPreviewScreen: FunctionComponent<PhotoPreviewScreenProps> = (
  props,
) => {
  const {navigation, route} = props;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="left" color="#fff" size={30} />
        </TouchableOpacity>
        <View style={styles.rightButtonContainer}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => {
              CameraRoll.save(route.params?.path, {type: 'photo'});
              appAlertMessage('Image Saved', () => {
                navigation.goBack();
              });
            }}>
            <Feather name="download" color="#fff" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Share.open({
                url: route.params?.path,
                title: 'Weath AR',
                message: 'Please checkout my current weather condition',
              });
              // appAlertMessage('Image Saved', () => {
              //   navigation.goBack();
              // });
            }}>
            <Feather name="share-2" color="#fff" size={30} />
          </TouchableOpacity>
        </View>
      </View>

      <Image style={styles.imageStyle} source={{uri: route.params?.path}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  imageStyle: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    zIndex: 1000,
    width: '100%',
    top: 0,
    marginTop: 10,
  },

  rightButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    marginBottom: 25,
  },
  cloudContainer: {},
  cloudImage: {
    height: 70,
    width: 100,
  },
});
export default PhotoPreviewScreen;
