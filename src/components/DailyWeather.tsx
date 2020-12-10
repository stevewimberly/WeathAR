import React, {FunctionComponent, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {appStyles, FONTS} from '../styles/styles';
import {connect} from 'react-redux';
import {StoreState} from '../reducers';
import {UserReducer} from '../reducers/userReducer';
import {AppReducer} from '../reducers/appReducer';
import {DailyWeatherData} from '../actions';
import {weatherIconFiles} from '../utils/utils';
import {Dropdown, DropDownData} from 'react-native-material-dropdown';
import DailyHourlyData from './DropDownData/DailyHourlyData';
// import {TouchableOpacity} from 'react-native-gesture-handler';

export interface DailyWeatherProps {
  userReducer: UserReducer;
  appReducer: AppReducer;
}

const DailyWeather: FunctionComponent<DailyWeatherProps> = (props) => {
  const {appReducer, userReducer} = props;
  const {loadingDailyData, dailyHourlyData, unit} = appReducer;

  const [dataVisible, setDataVisible] = useState(false);

  const [selectedHourData, setSelectedHourData] = useState<
    undefined | DailyWeatherData
  >(undefined);
  const [dataDaily, setDataDaily] = useState<
    null | AppReducer['dailyHourlyData']
  >(dailyHourlyData);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setDataDaily(dailyHourlyData);
  }, [dailyHourlyData]);

  const renderDailyReading = (
    readings: [] | DailyWeatherData[],
  ): JSX.Element[] => {
    const dailyReadings = readings.map(
      (val: DailyWeatherData, index: number) => {
        if (index !== 0 && index !== readings.length - 1) {
          return (
            <View key={`${index}`}>
              <TouchableOpacity
                style={styles.weatherDaysContainer}
                onPress={() => {
                  setSelectedHourData(val);

                  const oldData = [...dataDaily!].map((mappedVal) => {
                    return {...mappedVal, visible: false};
                  });
                  oldData[index].visible = !dataVisible;
                  setDataDaily(oldData);
                  setSelectedIndex(index);
                  setDataVisible(!dataVisible);
                }}>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.dayText}>{val.day}</Text>
                </View>
                <View style={styles.tempReadingContainer}>
                  <Text style={styles.tempReadingText}>
                    <Text style={{fontFamily: FONTS.bold}}>{val.maxTemp}</Text>
                    <Text style={{fontFamily: FONTS.regular}}>
                      /{val.minTemp}
                    </Text>
                  </Text>
                </View>
                <View style={styles.weatherTypeContainer}>
                  <Image
                    source={weatherIconFiles[`${val.iconCode}`]}
                    style={styles.cloudImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.weatherConditionContainer}>
                  <Image
                    source={require('../assets/icons/water_drop_icon.png')}
                    style={[styles.weatherConditionImageStyle]}
                    resizeMode="contain"
                  />
                  <Text style={styles.precipitationText}>{`${
                    val.precipChance ? val.precipChance : 0
                  }%`}</Text>
                </View>
              </TouchableOpacity>
              {dataVisible && val.visible && (
                <View style={styles.hourlyContainer}>
                  <DailyHourlyData data={selectedHourData.data} unit={unit} />
                </View>
              )}
            </View>
          );
        }
      },
    );

    return dailyReadings;
  };

  return (
    <View style={styles.container}>
      <Text style={[appStyles.headerOneStyle]}>Daily</Text>
      <View style={{}}>{renderDailyReading(dataDaily!)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dayTextContainer: {
    flex: 1.8,
  },
  dayText: {
    color: '#464646',
    fontSize: 17,
  },
  tempReadingContainer: {
    flex: 1,
  },
  weatherTypeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherDaysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#707070',
    paddingVertical: 10,
  },
  cloudImage: {
    height: 45,
  },
  weatherConditionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  weatherConditionImageStyle: {
    height: 20,
    marginBottom: 2,
  },
  tempReadingText: {
    fontSize: 17,
    color: '#000',
    fontFamily: FONTS.regular,
  },
  precipitationText: {
    textAlign: 'center',
  },
  hourlyContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

const mapStateToProps = ({
  userReducer,
  appReducer,
}: StoreState): {userReducer: UserReducer; appReducer: AppReducer} => {
  return {
    userReducer,
    appReducer,
  };
};
export default connect(mapStateToProps)(DailyWeather);
