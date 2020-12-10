import moment from 'moment';
import _ from 'lodash';

export const getGreetingTime = (m: Date): null | string => {
  let g = null; //return g

  const split_afternoon = 12; //24hr time to split the afternoon
  const split_evening = 17; //24hr time to split the evening
  const currentHour = parseFloat(moment(m).format('HH'));

  if (currentHour >= split_afternoon && currentHour <= split_evening) {
    g = 'afternoon';
  } else if (currentHour >= split_evening) {
    g = 'evening';
  } else {
    g = 'morning';
  }

  return g;
};

export interface SortedValues {
  width: string;
  value: number;
  time: string;
  iconCode?: number;
  formatedHour?: string;
  pmAm?: string;
  fullTime?: string;
}

export const sortTempFeelsLike = (
  data: number[],
  timeData: number[],
  iconCodes?: number[],
): SortedValues[] => {
  const hours12 = data.filter((val, index) => {
    if (index <= 11) {
      if (!val) {
        return `${val}`;
      } else {
        return val;
      }
    }
  });

  const sortedTime = timeData.filter((val, index) => {
    if (index <= 11) {
      if (!val) {
        return `${val}`;
      } else {
        return val;
      }
    }
  });

  let sortedIconCode: null | number[];

  if (iconCodes) {
    sortedIconCode = iconCodes.filter((val, index) => {
      if (index <= 11) {
        if (!val) {
          return `${val}`;
        } else {
          return val;
        }
      }
    });
  }

  const sortedCondition = hours12.map((val, index) => {
    const time = `${sortedTime[index]}`;
    const value = val;
    let iconCode;

    if (sortedIconCode) {
      iconCode = sortedIconCode[index];
    }

    return {value, time, iconCode};
  });

  const sortedValues = sortedCondition.sort((a, b) => b.value - a.value);
  const highestvalue = sortedValues[0].value;

  const valuesWithWidths = sortedCondition.map((val) => {
    let width;

    if (val.value < 0) {
      // width = 20;
      width = (100 * val.value) / highestvalue - 100;
    } else {
      width = (100 * val.value) / highestvalue;
    }

    if (!width) {
      width = 10;
    }
    return {...val, width: `${width}%`};
  });

  const timeToSort = _.sortBy(valuesWithWidths, ['time']);

  const newData = [];

  const formatedTime = timeToSort.map((d) => {
    return {
      ...d,
      formatedHour: moment(d.time).format('h'),
      pmAm: moment(d.time).format('a'),
      fullTime: moment(d.time).format('ha'),
    };
  });

  // console.log(formatedTime, 'formatedTime');

  newData.push(formatedTime.find((a) => a.fullTime === '12am'));
  newData.push(formatedTime.find((a) => a.fullTime === '1am'));
  newData.push(formatedTime.find((a) => a.fullTime === '2am'));
  newData.push(formatedTime.find((a) => a.fullTime === '3am'));
  newData.push(formatedTime.find((a) => a.fullTime === '4am'));
  newData.push(formatedTime.find((a) => a.fullTime === '5am'));
  newData.push(formatedTime.find((a) => a.fullTime === '6am'));
  newData.push(formatedTime.find((a) => a.fullTime === '7am'));
  newData.push(formatedTime.find((a) => a.fullTime === '8am'));
  newData.push(formatedTime.find((a) => a.fullTime === '9am'));
  newData.push(formatedTime.find((a) => a.fullTime === '10am'));
  newData.push(formatedTime.find((a) => a.fullTime === '11am'));

  // console.log(newData, 'newData');

  // @ts-ignore
  return formatedTime;
};

export const sortHourlyData = (
  data: number[][],
  time: string[],
): SortedValues[] => {
  const sortedTime = time.map((val) => {
    return {time: val};
  });

  const sortedCondition = data.map((val, index) => {
    // const parsedTime = `${moment(time).add(index ? index + 1 : index, 'h')}`;
    const value = val[0];

    return {value, time: sortedTime[index].time};
  });

  const sortedValues = sortedCondition.sort((a, b) => b.value - a.value);
  const highestvalue = sortedValues[0].value;

  const valuesWithWidths = sortedCondition.map((val) => {
    let width;

    if (val.value < 0) {
      // width = 20;
      // width = (100 * val.value) / highestvalue - 100;
      width = (100 * val.value) / highestvalue - 100;
    } else {
      width = (100 * val.value) / highestvalue;
    }

    return {...val, width: `${width}%`, time: val.time};
  });

  // return valuesWithWidths;

  const timeToSort = _.sortBy(valuesWithWidths, ['time']);

  const newData = [];

  const formatedTime = timeToSort.map((d) => {
    return {
      ...d,
      formatedHour: moment.unix(d.time).format('h'),
      pmAm: moment.unix(d.time).format('a'),
      fullTime: moment.unix(d.time).format('ha'),
    };
  });

  newData.push(formatedTime.find((a) => a.fullTime === '12am'));
  newData.push(formatedTime.find((a) => a.fullTime === '1am'));
  newData.push(formatedTime.find((a) => a.fullTime === '2am'));
  newData.push(formatedTime.find((a) => a.fullTime === '3am'));
  newData.push(formatedTime.find((a) => a.fullTime === '4am'));
  newData.push(formatedTime.find((a) => a.fullTime === '5am'));
  newData.push(formatedTime.find((a) => a.fullTime === '6am'));
  newData.push(formatedTime.find((a) => a.fullTime === '7am'));
  newData.push(formatedTime.find((a) => a.fullTime === '8am'));
  newData.push(formatedTime.find((a) => a.fullTime === '9am'));
  newData.push(formatedTime.find((a) => a.fullTime === '10am'));
  newData.push(formatedTime.find((a) => a.fullTime === '11am'));
  newData.push(formatedTime.find((a) => a.fullTime === '12pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '1pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '2pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '3pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '4pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '5pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '6pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '7pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '8pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '9pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '10pm'));
  newData.push(formatedTime.find((a) => a.fullTime === '11pm'));

  // console.log(formatedTime, 'formatedTime');

  //
  // for (let index = 12; index < 24; index++) {}

  // // console.log(timeToSort, 'timeToSort');

  // // return timeToSort.reverse();
  // return timeToSort;
  // @ts-ignore
  return newData.reverse();
};

export const weatherIconFiles = {
  '00': require('../assets/weather_icons/00.png'),
  '01': require('../assets/weather_icons/01.png'),
  '02': require('../assets/weather_icons/02.png'),
  '03': require('../assets/weather_icons/03.png'),
  '04': require('../assets/weather_icons/04.png'),
  '05': require('../assets/weather_icons/05.png'),
  '06': require('../assets/weather_icons/06.png'),
  '07': require('../assets/weather_icons/07.png'),
  '08': require('../assets/weather_icons/08.png'),
  '09': require('../assets/weather_icons/09.png'),
  '10': require('../assets/weather_icons/10.png'),
  '11': require('../assets/weather_icons/11.png'),
  '12': require('../assets/weather_icons/12.png'),
  '13': require('../assets/weather_icons/13.png'),
  '14': require('../assets/weather_icons/14.png'),
  '15': require('../assets/weather_icons/15.png'),
  '16': require('../assets/weather_icons/16.png'),
  '17': require('../assets/weather_icons/17.png'),
  '18': require('../assets/weather_icons/18.png'),
  '19': require('../assets/weather_icons/19.png'),
  '20': require('../assets/weather_icons/20.png'),
  '21': require('../assets/weather_icons/21.png'),
  '22': require('../assets/weather_icons/22.png'),
  '23': require('../assets/weather_icons/23.png'),
  '24': require('../assets/weather_icons/24.png'),
  '25': require('../assets/weather_icons/25.png'),
  '26': require('../assets/weather_icons/26.png'),
  '27': require('../assets/weather_icons/27.png'),
  '28': require('../assets/weather_icons/28.png'),
  '29': require('../assets/weather_icons/29.png'),
  '30': require('../assets/weather_icons/30.png'),
  '31': require('../assets/weather_icons/31.png'),
  '32': require('../assets/weather_icons/32.png'),
  '33': require('../assets/weather_icons/33.png'),
  '34': require('../assets/weather_icons/34.png'),
  '35': require('../assets/weather_icons/35.png'),
  '36': require('../assets/weather_icons/36.png'),
  '37': require('../assets/weather_icons/37.png'),
  '38': require('../assets/weather_icons/38.png'),
  '39': require('../assets/weather_icons/39.png'),
  '40': require('../assets/weather_icons/40.png'),
  '41': require('../assets/weather_icons/41.png'),
  '42': require('../assets/weather_icons/42.png'),
  '43': require('../assets/weather_icons/43.png'),
  '44': require('../assets/weather_icons/44.png'),
  '45': require('../assets/weather_icons/45.png'),
  '46': require('../assets/weather_icons/46.png'),
  '47': require('../assets/weather_icons/47.png'),
  na: require('../assets/weather_icons/na.png'),
};
