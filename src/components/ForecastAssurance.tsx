import {indexOf} from 'lodash';
import React, {FunctionComponent} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {FONTS} from '../styles/styles';

interface ForecaseAssuranceProps {
  customContainerStyle?: ViewStyle;
  customForecastTextStyle?: TextStyle;
  forcastScore: number;
}
const ForecastAssurance: FunctionComponent<ForecaseAssuranceProps> = (
  props,
) => {
  const {
    customContainerStyle = {},
    forcastScore,
    customForecastTextStyle = {},
  } = props;

  let color;
  let forecastText;
  if (forcastScore === 5) {
    color = '#3B8D35';
    forecastText = 'H';
  } else if (forcastScore === 4) {
    color = '#2ECC71';
    forecastText = 'HM';
  } else if (forcastScore === 3) {
    color = '#F1C40F';
    forecastText = 'M';
  } else if (forcastScore === 2) {
    color = '#D35400';
    forecastText = 'LM';
  } else if (forcastScore === 1) {
    color = '#E67E22';
    forecastText = 'L';
  }

  return (
    <View
      style={[
        styles.container,
        customContainerStyle,
        {backgroundColor: color},
      ]}>
      <Text style={[styles.forecastText, customForecastTextStyle]}>
        {forecastText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 30,
    width: 30,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 12,
  },
});

export default ForecastAssurance;
