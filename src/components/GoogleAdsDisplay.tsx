import React, {FunctionComponent, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FONTS, primaryColor} from '../styles/styles';
import admob, {MaxAdContentRating} from '@react-native-firebase/admob';
import {
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-3159967860499210~1796390726';

const GoogleAdsDisplay: FunctionComponent = () => {
  useEffect(() => {
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
  }, []);

  RewardedAd.createForAdRequest(TestIds.REWARDED);
  return (
    <View style={styles.container}>
      <BannerAd
        // unitId={adUnitId}
        unitId={TestIds.BANNER}
        size={BannerAdSize.MEDIUM_RECTANGLE}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Advert loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Advert failed to load: ', error);
        }}
      />
      {/* <Text style={styles.googleAdsText}> Google Display Ad</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(219, 219, 219, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // height: 204,
  },
  googleAdsText: {
    color: primaryColor,
    fontFamily: FONTS.bold,

    fontSize: 16,
  },
});

export default GoogleAdsDisplay;
