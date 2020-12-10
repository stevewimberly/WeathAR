import React, {FunctionComponent, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {appStyles, FONTS} from '../../styles/styles';
import {Dropdown, DropDownData} from 'react-native-material-dropdown';
import {SortedValues} from '../../utils/utils';
import moment from 'moment';
import {DailyWeatherData, Unit} from '../../actions';
import AntDesign from 'react-native-vector-icons/AntDesign';

type DropDownValue =
  | 'windGust'
  | 'qpf'
  | 'relativeHumidity'
  | 'qpfSnow'
  | 'temperature'
  | 'temperatureDewPoint'
  | 'windSpeed';

const dropDownData: DropDownData[] = [
  {
    value: 'temperature',
    label: 'Temperature',
  },
  {
    value: 'windGust',
    label: 'Wind Gusts',
  },
  {
    value: 'qpf',
    label: 'Rainfall',
  },
  {
    value: 'relativeHumidity',
    label: 'Humidity',
  },

  {
    value: 'qpfSnow',
    label: 'Snowfall',
  },
  {
    value: 'temperatureDewPoint',
    label: 'Dew Point',
  },
  {
    value: 'windSpeed',
    label: 'Wind Speed',
  },
];

interface DailyHourlyDataProps {
  data?: DailyWeatherData['data'];
  unit: Unit;
}

const DailyHourlyData: FunctionComponent<DailyHourlyDataProps> = (props) => {
  const {data, unit} = props;
  const [dropDownValue, setDropDownValue] = useState<DropDownValue>(
    'temperature',
  );
  const [dropDownIndex, setDropDownIndex] = useState(0);

  const renderWidth = (val: DropDownValue): number => {
    if (val === 'temperatureDewPoint') {
      return 110;
    } else if (val === 'relativeHumidity') {
      return 100;
    } else if (val === 'qpf') {
      return 80;
    } else if (val === 'qpfSnow') {
      return 100;
    } else if (val === 'temperature') {
      return 130;
    } else {
      return 120;
    }
  };

  const renderHourlyData = (): SortedValues[] => {
    let valueToReturn: SortedValues[] = [];
    if (dropDownValue === 'qpf') {
      valueToReturn = data!.qpf.data;
    } else if (dropDownValue === 'qpfSnow') {
      valueToReturn = data!.qpfSnow.data;
    } else if (dropDownValue === 'relativeHumidity') {
      valueToReturn = data!.relativeHumidity.data;
    } else if (dropDownValue === 'temperature') {
      valueToReturn = data!.temperature.data;
    } else if (dropDownValue === 'temperatureDewPoint') {
      valueToReturn = data!.temperatureDewPoint.data;
    } else if (dropDownValue === 'windGust') {
      valueToReturn = data!.windGust.data;
    } else if (dropDownValue === 'windSpeed') {
      valueToReturn = data!.windSpeed.data;
    }

    return valueToReturn;
  };

  const renderReadings = (readings: SortedValues[]): Element[] => {
    const mappedData = readings.map((item, index: number) => {
      return (
        <View style={styles.contentContainer} key={`${index}`}>
          {/* <View style={styles.precipIconContainer}>
            <Image
              style={styles.precipIcon}
              source={weatherIconFiles[`${item.iconCode}`]}
              resizeMode="contain"
            />
          </View> */}
          <View style={styles.timeContainer}>
            {!item ? (
              <Text style={styles.timeText}>
                {moment.unix(item.time).format('h')}
                <Text style={styles.amPmText}>
                  {moment.unix(item.time).format('a')}
                </Text>
              </Text>
            ) : (
              <Text style={styles.timeText}>
                {item.formatedHour
                  ? item.formatedHour
                  : moment.unix(item.time).format('h')}
                <Text style={styles.amPmText}>
                  {item.pmAm ? item.pmAm : moment.unix(item.time).format('a')}
                </Text>
              </Text>
            )}
          </View>
          <View style={styles.indicatorContainer}>
            <View style={[styles.indicator, {width: item.width}]} />
            {dropDownValue === 'temperature' ||
            dropDownValue === 'temperatureDewPoint' ? (
              <View style={styles.degreeContainer}>
                <Text style={[styles.timeText, {fontSize: 13}]}>
                  {item.value}&#xb0;
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.degreeContainer,
                  dropDownValue === 'windGust' && {width: 80},
                  dropDownValue === 'windSpeed' && {width: 80},
                ]}>
                <Text style={[styles.timeText, {fontSize: 13}]}>
                  {item.value}
                  {dropDownValue === 'relativeHumidity' && '%'}
                  {dropDownValue === 'windSpeed' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && 'MPH'}
                      {unit === 'm' && 'KM/H'}
                      {unit === 'h' && 'MPH'}
                    </Text>
                  )}
                  {dropDownValue === 'windGust' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && 'MPH'}
                      {unit === 'm' && 'KM/H'}
                      {unit === 'h' && 'MPH'}
                    </Text>
                  )}
                  {dropDownValue === 'qpf' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && ' IN'}
                      {unit === 'm' && ' MM'}
                      {unit === 'h' && ' MM'}
                    </Text>
                  )}
                  {dropDownValue === 'qpfSnow' && (
                    <Text style={{fontSize: 12}}>
                      {unit === 'e' && ' IN'}
                      {unit === 'm' && ' MM'}
                      {unit === 'h' && ' MM'}
                    </Text>
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    });

    return mappedData.reverse();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer]}>
        <Text style={[appStyles.headerTwoStyle, styles.headerText]}>
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
                'Temperature'
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
              minHeight: 298,
              minWidth: 150,
            }}
            // value={dropDownValue}
            lineWidth={0}
          />
        </View>
      </View>
      <View style={{flex: 1, width: '80%', marginHorizontal: 15}}>
        {data && renderReadings(renderHourlyData())}
        {/* {renderReadings(renderHourlyData())} */}
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
    marginBottom: 20,
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
    fontSize: 15,
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
    // fontSize: 14,
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

export default DailyHourlyData;
