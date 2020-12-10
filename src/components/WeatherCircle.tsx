import React, {FunctionComponent} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  ImageProps,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import {appStyles, textColor} from '../styles/styles';

interface WeatherCirlceProps extends ImageProps {
  name: string;
  weatherValue: string;
  customStyle?: ImageStyle;
  onPress(): void;
  showDegress?: boolean;
}

const WeatherCirlce: FunctionComponent<WeatherCirlceProps> = (props) => {
  const {
    name,
    source,
    weatherValue,
    customStyle = {},
    onPress = () => {},
    showDegress = false,
  } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress()}>
      <Image
        source={source}
        style={[styles.imageSource, customStyle]}
        resizeMode="contain"
      />
      <Text style={appStyles.subtitleTextStyle}>{name}</Text>
      <Text style={styles.weatherValue}>
        {weatherValue}
        {showDegress && <>&#xb0;</>}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 110,
    width: 110,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255, 0.7)',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  imageSource: {
    height: 25,
    marginBottom: 5,
  },
  weatherValue: {
    color: textColor,
    textAlign: 'center',
    fontSize: 13,
  },
});

export default WeatherCirlce;
