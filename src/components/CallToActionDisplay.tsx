import React, {FunctionComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {FONTS, primaryColor} from '../styles/styles';

interface CallToActionDisplayProps {
  imageLink: string;
}
const CallToActionDisplay: FunctionComponent<CallToActionDisplayProps> = (
  props,
) => {
  const {imageLink} = props;
  return (
    <View style={styles.container}>
      <Image source={{uri: imageLink}} style={styles.image} />
      {/* <Text style={styles.googleAdsText}>CALL TO ACTION</Text>
      <Text style={styles.infoText}>Don't want to see this message?</Text>
      <Text style={styles.infoText}>Go Ad-Free</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'rgba(219, 219, 219, 1)',
    borderRadius: 20,
    height: 300 / 2,
    overflow: 'hidden',
  },
  googleAdsText: {
    color: primaryColor,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  infoText: {
    color: primaryColor,
  },
  image: {
    height: null,
    width: null,
    flex: 1,
    // overflow: 'hidden',
  },
});

export default CallToActionDisplay;
