import React, {FunctionComponent, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {appStyles, FONTS} from '../styles/styles';
import {Dropdown, DropDownData} from 'react-native-material-dropdown';
import {SortedValues, weatherIconFiles} from '../utils/utils';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Unit} from '../actions';

export interface HourlyReading {
  time: string;
  readingValue: string;
  pmValue: string;
}

export interface HourlyData {
  data: HourlyReading[];
  tempFeelsLikeData: SortedValues[];
  tempData: SortedValues[];
  precipData: SortedValues[];
  windData: SortedValues[];
  humidityData: SortedValues[];
  unit: Unit;
  windGustData: SortedValues[];
  dewPointData: SortedValues[];
}

export type HourlyReadingArray = Array<HourlyReading>;

type DropDownValue =
  | 'tempFeelsLike'
  | 'temp'
  | 'prepProb'
  | 'wind'
  | 'humidity'
  | 'windGustH'
  | 'dewPointH';

const dropDownData: DropDownData[] = [
  {
    value: 'tempFeelsLike',
    label: 'Feels Like',
  },
  {
    value: 'temp',
    label: 'Temp',
  },
  {
    value: 'prepProb',
    label: 'Precip Prob %',
  },

  {
    value: 'wind',
    label: 'Wind',
  },

  {
    value: 'humidity',
    label: 'Humidity',
  },
  // {
  //   value: 'windGustH',
  //   label: 'Wind Gust',
  // },
  {
    value: 'dewPointH',
    label: 'Dew Point',
  },
];

const HourlyReading: FunctionComponent<HourlyData> = (props) => {
  const {
    tempFeelsLikeData,
    tempData,
    precipData,
    windData,
    humidityData,
    unit,
    dewPointData,
    windGustData,
  } = props;
  const [dropDownValue, setDropDownValue] = useState<DropDownValue>(
    'tempFeelsLike',
  );
  const [dropDownIndex, setDropDownIndex] = useState(0);

  const renderWidth = (val: DropDownValue): number => {
    if (val === 'prepProb') {
      return 130;
    } else if (val === 'humidity') {
      return 100;
    } else if (val === 'dewPointH') {
      return 110;
    } else if (val === 'temp') {
      return 80;
    } else if (val === 'wind') {
      return 80;
    } else if (val === 'windGustH') {
      return 110;
    } else {
      return 100;
    }
  };

  const renderHourlyData = (): SortedValues[] => {
    let valueToReturn: SortedValues[] = [];
    if (dropDownValue === 'tempFeelsLike') {
      valueToReturn = tempFeelsLikeData;
    } else if (dropDownValue === 'temp') {
      valueToReturn = tempData;
    } else if (dropDownValue === 'prepProb') {
      valueToReturn = precipData;
    } else if (dropDownValue === 'wind') {
      valueToReturn = windData;
    } else if (dropDownValue === 'humidity') {
      valueToReturn = humidityData;
    } else if (dropDownValue === 'dewPointH') {
      valueToReturn = dewPointData;
    } else if (dropDownValue === 'windGustH') {
      valueToReturn = windGustData;
    }

    return valueToReturn;
  };

  const renderReadings = (readings: SortedValues[]): Array<JSX.Element> => {
    const mappedData = readings.map((item, index: number) => {
      return (
        <View style={styles.contentContainer} key={`${index}`}>
          <View style={styles.precipIconContainer}>
            <Image
              style={styles.precipIcon}
              source={weatherIconFiles[`${item.iconCode}`]}
              resizeMode="contain"
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {dropDownValue === 'windGustH'
                ? moment.unix(item.time).format('h')
                : moment(item.time).format('h')}
              <Text style={styles.amPmText}>
                {dropDownValue === 'windGustH'
                  ? moment.unix(item.time).format('a')
                  : moment(item.time).format('a')}
                {/* {moment(item.time).format('a')} */}
              </Text>
            </Text>
          </View>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, {width: item.width}]} />
            {dropDownValue === 'temp' ||
            dropDownValue === 'tempFeelsLike' ||
            dropDownValue === 'dewPointH' ? (
              <View style={styles.degreeContainer}>
                <Text style={styles.timeText}>{item.value}&#xb0;</Text>
              </View>
            ) : (
              <View
                style={[
                  styles.degreeContainer,
                  dropDownValue === 'wind' && {width: 75},
                ]}>
                <Text style={styles.timeText}>
                  {item.value}
                  {dropDownValue === 'prepProb' && '%'}
                  {dropDownValue === 'wind' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && 'MPH'}
                      {unit === 'm' && 'KM/H'}
                      {unit === 'h' && 'MPH'}
                    </Text>
                  )}
                  {dropDownValue === 'windGustH' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && 'MPH'}
                      {unit === 'm' && 'KM/H'}
                      {unit === 'h' && 'MPH'}
                    </Text>
                  )}
                  {dropDownValue === 'humidity' && '%'}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });

    return mappedData;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer]}>
        <Text style={[appStyles.headerOneStyle, styles.headerText]}>
          Hourly
        </Text>
        <View style={styles.dropdownContainer}>
          <Dropdown
            useNativeDriver
            data={dropDownData}
            label={
              dropDownValue ? (
                <Text>
                  {dropDownData[dropDownIndex].label}
                  {'   '}
                  <AntDesign name="caretdown" size={14} color="#000" />
                </Text>
              ) : (
                <Text>Feels Likes</Text>
              )
            }
            containerStyle={[
              styles.dropdownContainerStyle,
              {width: renderWidth(dropDownValue)},
            ]}
            inputContainerStyle={styles.dropDownInputContainerStyle}
            labelTextStyle={styles.labelTextStyle}
            baseColor="#000"
            onChangeText={(text: DropDownValue, index: number) => {
              setDropDownValue(text);
              setDropDownIndex(index);
            }}
            pickerStyle={{
              minHeight: 260,
              minWidth: 150,
            }}
            // value={dropDownValue}
            lineWidth={0}
            // renderAccessory={() => {
            //   return;
            // }}
          />
        </View>
      </View>
      <View style={{flex: 1, width: '80%'}}>
        {renderReadings(renderHourlyData())}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    marginRight: 15,
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  timeContainer: {
    marginRight: 15,
    width: 50,
  },
  timeText: {
    fontFamily: FONTS.bold,

    fontSize: 17,
    color: '#515151',
  },
  amPmText: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  indicatorContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    height: 11,
    backgroundColor: '#DEDEDE',
    width: '50%',
  },
  degreeContainer: {
    height: 25,
    minWidth: 55,
    paddingHorizontal: 10,

    borderRadius: 100,
    backgroundColor: '#EBEBEB',
    marginLeft: -5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    paddingHorizontal: 10,
    borderRadius: 100,
    height: 35,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
  },
  dropdownContainerStyle: {
    width: 100,
    marginTop: -10,
    margin: 0,
  },
  dropDownInputContainerStyle: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  labelTextStyle: {
    // fontFamily: FONTS.bold,
  },
  precipIconContainer: {
    marginRight: 20,
    justifyContent: 'flex-start',
  },
  precipIcon: {
    height: 15,
    width: 20,
  },
});

export default HourlyReading;
