import React, {FunctionComponent, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Linking} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {appStyles, FONTS, primaryColor} from '../styles/styles';
import Collapsible from 'react-native-collapsible';
import {UserReducer} from '../reducers/userReducer';
import {StoreState} from '../reducers';
import {connect, useDispatch} from 'react-redux';
import {
  Unit,
  UserLogoutAction,
  UpdateUnitAction,
  getDailyForecast,
  getHomeScreenData,
  AppAction,
  getUserData,
} from '../actions';
import {ActionTypes} from '../actions/types';
import {appAlertMessage, testCoords} from '../utils/constant';
import {AppReducer} from '../reducers/appReducer';
import {DEV} from '../constants/apis';
import database from '@react-native-firebase/database';

const units: {
  header: string;
  body: string;
  unit: Unit;
}[] = [
  {
    header: 'Imperial',
    body: 'Fahrenheit, MPH, inches',
    unit: 'e',
  },
  {
    header: 'Metric',
    body: 'Celsius, KM/H, Milimeter',
    unit: 'm',
  },
  {
    header: 'Hybrid',
    body: 'Celsius, MPH, Milimeters',
    unit: 'h',
  },
];

interface SettingScreenProps extends DrawerContentComponentProps {
  userReducer: UserReducer;
  closeDrawer: Function;
  logout: Function;
  onUpdateUnit(unit: Unit): void;
  getUserData(userId: string): void;
  getDailyForecast(lat: number, lng: number, unit: Unit): void;
  getHomeScreenData(lat: number, lng: number, unit: Unit): void;
  appReducer: AppReducer;
}

const CustomeDrawerContent: FunctionComponent<SettingScreenProps> = (props) => {
  const {
    userReducer,
    navigation,
    closeDrawer,
    logout,
    onUpdateUnit,
    appReducer,
  } = props;
  const [unit, setUnit] = useState<Unit>(appReducer.unit);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const {loggedIn} = userReducer;

  const renderUnitHeader = () => {
    const filteredData = units.filter((d) => {
      if (d.unit === unit) {
        return d;
      }
    });

    return (
      <View style={[styles.unitsContentHeaderContainer, {paddingBottom: 10}]}>
        <View style={{position: 'absolute', right: 10}}>
          <AntDesign
            name={isCollapsed ? 'caretdown' : 'caretup'}
            color="#999"
          />
        </View>
        <Text style={styles.unitsContentHeaderText}>
          {filteredData[0].header}
        </Text>
        <Text style={styles.unitsContentBodyText}>{filteredData[0].body}</Text>
      </View>
    );
  };

  const renderCollapsibles = () => {
    const filteredData = units.filter((d) => {
      if (d.unit !== unit) {
        return d;
      }
    });

    const collapsElements = filteredData.map((data, index) => {
      return (
        <TouchableOpacity
          key={data.unit}
          onPress={() => {
            setIsCollapsed(true);
            //@ts-ignore
            setUnit(data.unit);
            onUpdateUnit(data.unit);
          }}>
          <View
            style={[
              styles.unitsContentHeaderContainer,
              index === 0 && styles.divider,
              index === 0 && {paddingVertical: 10},
              {paddingTop: 10},
            ]}>
            <Text style={styles.unitsContentHeaderText}>{data.header}</Text>
            <Text style={styles.unitsContentBodyText}>{data.body}</Text>
          </View>
        </TouchableOpacity>
      );
    });

    return collapsElements;
  };

  return (
    <View style={styles.drawerContentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerContainerText}> Settings </Text>
      </View>
      <View style={styles.topContentContainer}>
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              Linking.openURL('https://www.camunications.com/privacy');
            }}>
            <View style={styles.menuIconContainer}>
              <FontAwesome name="lock" color={primaryColor} size={22} />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              Linking.openURL('mailto:feedback@camunications.com');
            }}>
            <View style={styles.menuIconContainer}>
              <MaterialIcons name="feedback" color={primaryColor} size={22} />
            </View>
            <Text style={styles.menuText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              Linking.openURL('https://www.camunications.com');
            }}>
            <View style={styles.menuIconContainer}>
              <MaterialIcons
                name="contact-phone"
                color={primaryColor}
                size={22}
              />
            </View>
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => {
              Linking.openURL('https://www.camunications.com/faq');
            }}>
            <View style={styles.menuIconContainer}>
              <FontAwesome
                name="question-circle"
                color={primaryColor}
                size={22}
              />
            </View>
            <Text style={styles.menuText}>FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuContainer}
            onPress={() => Linking.openSettings()}>
            <View style={styles.menuIconContainer}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                color={primaryColor}
                size={22}
              />
            </View>
            <Text style={styles.menuText}>Location Services</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.menuContainer}>
            <View style={styles.menuIconContainer}>
              <Ionicons
                name="notifications-outline"
                color={primaryColor}
                size={22}
              />
            </View>
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity> */}
          {!loggedIn && (
            <TouchableOpacity
              style={styles.menuContainer}
              onPress={() => {
                closeDrawer();
                navigation.navigate('LoginScreen');
              }}>
              <View style={styles.menuIconContainer}>
                <MaterialIcons name="login" color={primaryColor} size={22} />
              </View>
              <Text style={styles.menuText}>Login</Text>
            </TouchableOpacity>
          )}
          {loggedIn && (
            <TouchableOpacity
              style={styles.menuContainer}
              onPress={() => {
                logout();
                closeDrawer();
              }}>
              <View style={styles.menuIconContainer}>
                <MaterialIcons name="login" color={primaryColor} size={22} />
              </View>
              <Text style={styles.menuText}>Log out</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.unitsContainer}>
          <View style={styles.unitsHeader}>
            <Text style={styles.unitsHeaderText}>Units</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={styles.collapsibleContainer}>
            {renderUnitHeader()}
            <Collapsible collapsed={isCollapsed} onAnimationEnd={() => {}}>
              {renderCollapsibles()}
            </Collapsible>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.bottomContentContainer}>
        <TouchableOpacity style={styles.addInfoContainer}>
          <FontAwesome
            style={styles.addInfoIcon}
            color={primaryColor}
            size={35}
            name="cloud-upload"
          />
          <Text style={styles.addInfoText}>
            Go Pro to unlock exclusive content
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const Drawer = createDrawerNavigator();

const SettingsScreen: FunctionComponent<SettingScreenProps> = (props) => {
  const dispatch = useDispatch();
  const {
    appReducer,
    getDailyForecast,
    getHomeScreenData,
    userReducer,
    getUserData,
  } = props;
  const {userDetails} = userReducer;
  const {currLocationCoords} = appReducer;
  return (
    <Drawer.Navigator
      screenOptions={{swipeEnabled: false}}
      drawerPosition="right"
      drawerStyle={styles.drawerStyle}
      overlayColor="transparent"
      drawerContent={(drawerProps) => (
        <CustomeDrawerContent
          {...drawerProps}
          {...props}
          closeDrawer={() => {}}
          logout={() => {
            appAlertMessage('Logged Out');
            // database().ref(`/users/${userDetails?.uid}`).set(null);
            // getUserData(userDetails!.uid);
            dispatch<UserLogoutAction>({
              type: ActionTypes.ON_LOGOUT,
            });
          }}
          onUpdateUnit={(unit: Unit) => {
            dispatch<UpdateUnitAction>({
              type: ActionTypes.ON_UPDATE_UNIT_CHANGE,
              payload: unit,
            });

            dispatch<AppAction>({
              type: ActionTypes.ON_GET_HOME_DATA_START,
            });

            DEV
              ? getDailyForecast(testCoords.lat, testCoords.lng, unit)
              : getDailyForecast(
                  currLocationCoords?.lat!,
                  currLocationCoords?.lng!,
                  unit,
                );
            DEV
              ? getHomeScreenData(testCoords.lat, testCoords.lng, unit)
              : getHomeScreenData(
                  currLocationCoords?.lat!,
                  currLocationCoords?.lng!,
                  unit,
                );
          }}
        />
      )}>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  drawerContentContainer: {
    flex: 1,
    marginVertical: 15,
    paddingHorizontal: 25,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  headerContainerText: {
    ...appStyles.headerOneStyle,
  },
  topContentContainer: {
    flex: 2,
    marginVertical: 10,
  },
  menuItems: {
    marginBottom: 15,
  },
  menuText: {
    flex: 6,
    fontSize: 18,
  },
  menuContainer: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignContent: 'center',
  },
  menuIconContainer: {
    paddingHorizontal: 10,
    flex: 1,
  },

  bottomContentContainer: {
    overflow: 'hidden',
    paddingVertical: 5,
  },
  addInfoContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 25,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  addInfoIcon: {
    marginBottom: 5,
  },
  addInfoText: {
    textAlign: 'center',
    color: primaryColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  collapsibleContainer: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  unitsContainer: {},
  unitsHeader: {
    marginBottom: 12,
  },
  unitsHeaderText: {
    color: '#000',
    textTransform: 'uppercase',
    fontWeight: '300',
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  unitsContentHeaderContainer: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    position: 'relative',
    justifyContent: 'center',
  },
  unitsContentHeaderText: {
    marginBottom: 2,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  unitsContentBodyText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
  },
  divider: {
    borderColor: '#ddd',
    borderBottomWidth: 1,
    borderTopWidth: 1,
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

export default connect(mapStateToProps, {
  getDailyForecast,
  getHomeScreenData,
  getUserData,
})(SettingsScreen);
