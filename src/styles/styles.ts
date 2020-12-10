import {StyleSheet} from 'react-native';

export const primaryColor = '#6866AD';

export enum FONTS {
  bold = 'DMSans-Bold',
  regular = 'DMSans-Regular',
}

export const appStyles = StyleSheet.create({
  titleStyle: {
    color: '#fff',
    fontSize: 17,
    textShadowColor: '#000',
    textShadowOffset: {width: -0.5, height: 0},
    textShadowRadius: 2,
    fontFamily: FONTS.bold,
  },
  headerOneStyle: {
    color: '#000',
    fontSize: 25,
    marginBottom: 0,
    fontFamily: FONTS.bold,
  },
  headerTwoStyle: {
    color: '#000',
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  subtitleTextStyle: {
    color: '#383838',
    fontFamily: FONTS.bold,
    fontSize: 15,
    textAlign: 'center',
  },
  bottomMarginSmall: {
    marginBottom: 5,
  },
  bottomMarginMedium: {
    marginBottom: 25,
  },
});

export const textColor = '#383838';
