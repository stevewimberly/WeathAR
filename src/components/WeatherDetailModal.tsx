import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageStyle,
  ImageSourcePropType,
} from 'react-native';
import {appStyles, FONTS} from '../styles/styles';
import {getGreetingTime} from '../utils/utils';
import Button from './Buttons/Button';
import ForecastAssurance from './ForecastAssurance';
import moment from 'moment';
import {appAlertMessage} from '../utils/constant';
import {Unit} from '../actions';

interface WeatherModalProps {
  onPress(): void;
  data: ModalData;
  forcastScore: number;
  sunData: {
    sunRise: string;
    sunSet: string;
  };
  unit: Unit;
}

export interface WeatherModalData {
  title: string;
  subTitle: string;
  customImageStyle?: ImageStyle;
  imageSource: ImageSourcePropType;
  extraData?: string;
  index?: number;
}

export type ModalData = Array<WeatherModalData>;

const WeatherDetailModal: FunctionComponent<WeatherModalProps> = (props) => {
  const {
    onPress,
    customImageStyle = {},
    data,
    forcastScore,
    sunData,
    unit,
  } = props;

  let forecastText;

  if (forcastScore === 5) {
    forecastText = 'High';
  } else if (forcastScore === 4) {
    forecastText = 'High Medium';
  } else if (forcastScore === 3) {
    forecastText = 'Medium';
  } else if (forcastScore === 2) {
    forecastText = 'Low Medium';
  } else if (forcastScore === 1) {
    forecastText = 'Low';
  }

  let isSunRise: boolean;

  if (parseInt(sunData.sunRise) > Date.now() / 1000) {
    // appAlertMessage('here');
    // console.log('here');
    isSunRise = true;
  } else {
    isSunRise = false;
    // appAlertMessage('here2');

    // console.log('here 2');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, appStyles.headerOneStyle]}>
          Current Conditions
        </Text>
      </View>
      <View style={styles.subHeaderContainer}>
        <ForecastAssurance
          forcastScore={forcastScore}
          customContainerStyle={styles.subHeaderIconContainer}
          customForecastTextStyle={styles.subHeaderIconContainerText}
        />
        <View style={styles.subHeaderContainerTextContainer}>
          <Text style={styles.subHeaderContainerTextContainerMajor}>
            Forecast Assurance
          </Text>
          <Text style={styles.subHeaderContainerTextContainerMinor}>
            {forecastText}
          </Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        numColumns={3}
        contentContainerStyle={styles.flatListContainerStyle}
        renderItem={({item}) => {
          return (
            <View style={styles.itemContainer}>
              <Image
                style={styles.imageStyle}
                source={item.imageSource}
                resizeMode="contain"
              />
              {/* <Text style={styles.subTitleStyle}>{item.subTitle}</Text> */}
              {item.extraData === 'sun' ? (
                <Text style={styles.subTitleStyle}>
                  {isSunRise ? 'Sunrise' : 'Sunset'}
                </Text>
              ) : (
                <Text style={styles.subTitleStyle}>{item.subTitle}</Text>
              )}
              {item.extraData === 'temp' ? (
                <Text style={styles.titleStyle}>
                  {item.title} &#xb0;
                  {unit === 'e' && 'F'}
                  {unit === 'm' && 'C'}
                  {unit === 'h' && 'C'}
                </Text>
              ) : item.extraData === 'quote' ? (
                <Text style={styles.titleStyle}>
                  {item.title}
                  {/* {unit === 'e' && ' IN'} */}
                  {unit === 'm' && ' mm'}
                  {unit === 'h' && ' mm'}
                  {unit === 'e' && <Text>&#x22;</Text>}
                </Text>
              ) : item.extraData === 'dew' ? (
                <Text style={styles.titleStyle}>
                  {item.title} &#xb0;
                  {unit === 'e' && 'F'}
                  {unit === 'm' && 'C'}
                  {unit === 'h' && 'C'}
                </Text>
              ) : item.extraData === 'humidity' ? (
                <Text style={styles.titleStyle}>{item.title}%</Text>
              ) : item.extraData === 'wind' ? (
                <Text style={styles.titleStyle}>
                  {item.title}
                  {unit === 'e' && ' MPH'}
                  {unit === 'm' && ' KM/H'}
                  {unit === 'h' && ' MPH'}
                </Text>
              ) : item.extraData === 'sun' ? (
                <Text style={styles.titleStyle}>
                  {isSunRise
                    ? moment.unix(sunData.sunRise).format('h:M a')
                    : moment.unix(sunData.sunSet).format('h:M a')}
                </Text>
              ) : (
                <Text style={styles.titleStyle}>{item.title}</Text>
              )}
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.buttonContainer}>
        <Button type="primary" text="DONE" onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBDBDB',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {},
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    minHeight: 130,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 15,
  },
  flatListContainerStyle: {
    marginBottom: 30,
  },
  imageStyle: {
    height: 40,
    marginBottom: 5,
  },
  titleStyle: {
    fontFamily: FONTS.bold,

    color: '#383838',
    fontSize: 14,
  },
  subTitleStyle: {
    color: '#767676',
    fontSize: 12,
    marginBottom: 5,
  },
  subHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  subHeaderIconContainer: {
    marginRight: 10,
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  subHeaderIconContainerText: {
    color: '#fff',
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  subHeaderContainerTextContainer: {},
  subHeaderContainerTextContainerMajor: {
    fontFamily: FONTS.bold,
    marginBottom: 3,
    fontSize: 17,
  },
  subHeaderContainerTextContainerMinor: {
    fontWeight: 'normal',
    fontSize: 16,
    color: '#8D8D8D',
  },
});

export default WeatherDetailModal;
