import React, {FunctionComponent, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {appStyles, FONTS, primaryColor} from '../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ButtonIndicator from '../components/Buttons/ButtonIndicator';
import EditButton from '../components/Buttons/EditButton';
import Button from '../components/Buttons/Button';
import {DrawerScreenProps} from '../navigation/AppNavigation';
import {connect} from 'react-redux';
import {StoreState} from '../reducers';
import {UserReducer} from '../reducers/userReducer';
import database from '@react-native-firebase/database';
import Spinner from 'react-native-loading-spinner-overlay';
import {appAlertMessage, GOOGLE_PLACE_API} from '../utils/constant';
import {getUserData} from '../actions';
import {useFocusEffect} from '@react-navigation/native';

interface Prices {
  month: string;
  price: number;
  discount?: number;
  total?: number;
  selected: boolean;
  bestValue?: boolean;
  id: string;
}

type PriceList = Prices[];

const pricesData: PriceList = [
  {
    month: '1 month',
    price: 2.99,
    selected: true,
    id: 'one',
  },
  {
    month: '6 months',
    price: 2.49,
    selected: false,
    total: 14.99,
    id: 'six',
  },
  {
    month: '12 months',
    price: 1.99,
    selected: false,
    total: 23.88,
    bestValue: true,
    id: 'twelve',
  },
];

interface ProfileScreenProps extends DrawerScreenProps {
  userReducer: UserReducer;
  getUserData: Function;
}

export interface Address {
  formatedAddress?: string;
  location: {
    lat: number;
    lng: number;
  };
  description?: 'Home' | 'Work';
}

const ProfileScreen: FunctionComponent<ProfileScreenProps> = (props) => {
  const {navigation, userReducer, getUserData} = props;
  const {userDetails, userData} = userReducer;
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [prizes, setPrizes] = useState<PriceList>(pricesData);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<Prices | null>(null);
  const [homeAddress, setHomeAddress] = useState<Address | null>(null);
  const [workAddress, setWorkAddress] = useState<Address | null>(null);
  const [userUpdating, setUserUpdating] = useState(false);
  const [homeEdit, setHomeEdit] = useState(false);
  const [workEdit, setWorkEdit] = useState(false);
  const homeAddressRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const workAddressRef = useRef<GooglePlacesAutocompleteRef | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (userData?.homeAddress?.formatedAddress) {
        homeAddressRef.current?.setAddressText(
          userData.homeAddress.formatedAddress,
        );
      } else {
        homeAddressRef.current?.setAddressText('');
      }

      if (userData?.workAddress?.formatedAddress) {
        workAddressRef.current?.setAddressText(
          userData.workAddress.formatedAddress,
        );
      } else {
        workAddressRef.current?.setAddressText('');
      }
    }, [userData]),
  );

  const selectPrice = (index: number): void => {
    const p = [...prizes];
    const mappedPrices = p.map(
      (info: Prices): Prices => {
        return {...info, selected: false};
      },
    );
    mappedPrices[index].selected = true;
    setPrizes(mappedPrices);
    setCurrentPlan(mappedPrices[index]);
  };

  const onSubscribe = (): void => {
    setLoading(true);
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 2000);
  };

  const cancelSubscription = (): void => {
    setLoading(true);
    setTimeout(() => {
      setSubscribed(false);
      setLoading(false);
    }, 2000);
  };

  const renderPrices = (): JSX.Element[] => {
    const renderedPrices: JSX.Element[] = prizes.map(
      (data: Prices, index: number) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            key={data.id}
            style={[
              styles.priceButtonContainer,
              data.selected
                ? styles.selectedPriceStyle
                : styles.deSelectedPriceStyle,
            ]}
            disabled={loading}
            onPress={() => selectPrice(index)}>
            <View style={styles.monthContainer}>
              <Text style={styles.monthText}>{data.month}</Text>
            </View>
            {data.bestValue && (
              <View style={styles.bestValueContainer}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            )}
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{`$${data.price}/mo`}</Text>
            </View>
          </TouchableOpacity>
        );
      },
    );

    return renderedPrices;
  };

  const renderSubscribed = (): JSX.Element => {
    return (
      <View style={styles.subscribedContainer}>
        <Text style={styles.cancelHeaderText}> Current Plan</Text>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.priceButtonContainer, styles.selectedPriceStyle]}
          disabled={loading}>
          <View style={styles.monthContainer}>
            <Text style={styles.monthText}>{currentPlan?.month}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{`$${currentPlan?.price}/mo`}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.cancelInfoText}>Renews on March 15th, 2020</Text>
      </View>
    );
  };

  const updateUserData = async (data: Address) => {
    setUserUpdating(true);
    try {
      const body = {
        ...data,
      };

      if (data) {
        await database()
          .ref(
            `/users/${
              userDetails?.uid
            }/${data.description!.toLowerCase()}Address`,
          )
          .set(body);
        setUserUpdating(false);
        getUserData(userDetails!.uid);
        setHomeEdit(false);
        setWorkEdit(false);
      }
    } catch (error) {
      setUserUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
      <Spinner visible={userUpdating} textContent={'Saving...'} />
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContainer}>
            <Text style={[appStyles.headerOneStyle]}>Profile</Text>
          </View>
          <View style={styles.headerRightContainer}>
            <TouchableOpacity
              style={styles.feedbackContainer}
              onPress={() => {
                navigation.openDrawer();
              }}>
              <FontAwesome color={primaryColor} size={24} name="gear" />
              <Text style={styles.feedBackText}> Settings </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.homeContainer}>
          <ButtonIndicator text="Home" iconName="home" />
          <View style={styles.addressContainer}>
            <View style={styles.addressTextContainer}>
              <GooglePlacesAutocomplete
                ref={homeAddressRef}
                placeholder="Home Address"
                onPress={(data, details = null) => {
                  if (details) {
                    setHomeEdit(true);
                    setHomeAddress({
                      formatedAddress: details.formatted_address,
                      location: details.geometry.location,
                      description: 'Home',
                    });
                  }
                }}
                query={{
                  key: GOOGLE_PLACE_API,
                  language: 'en',
                }}
                styles={{
                  textInput: [styles.addressBold],
                }}
                fetchDetails
                textInputProps={{
                  multiline: true,
                  numberOfLines: 2,
                }}
              />
            </View>
            <EditButton
              edit={homeEdit}
              onPress={() => {
                if (userReducer.loggedIn) {
                  if (homeEdit) {
                    if (homeAddress) {
                      updateUserData(homeAddress);
                    } else {
                      appAlertMessage('Please input an address');
                    }
                  } else {
                    setHomeEdit(true);
                    homeAddressRef.current?.focus();
                  }
                } else {
                  navigation.navigate('LoginScreen');
                }
              }}
            />
          </View>
        </View>
        <View style={styles.workContainer}>
          <ButtonIndicator text="Work" iconName="briefcase" iconSize={16} />
          <View style={styles.addressContainer}>
            <View style={styles.addressTextContainer}>
              <GooglePlacesAutocomplete
                ref={workAddressRef}
                placeholder="Work Address"
                onPress={(data, details = null) => {
                  console.log(details, 'details');
                  if (details) {
                    setWorkEdit(true);
                    setWorkAddress({
                      formatedAddress: details.formatted_address,
                      location: details.geometry.location,
                      description: 'Work',
                    });
                  }
                }}
                query={{
                  key: GOOGLE_PLACE_API,
                  language: 'en',
                }}
                styles={{
                  textInput: [styles.addressBold],
                }}
                fetchDetails
                textInputProps={{
                  multiline: true,
                  numberOfLines: 2,
                }}
              />
            </View>
            <EditButton
              edit={workEdit}
              onPress={() => {
                if (userReducer.loggedIn) {
                  if (workEdit) {
                    if (workAddress) {
                      updateUserData(workAddress);
                    } else {
                      appAlertMessage('Please input an address');
                    }
                  } else {
                    setWorkEdit(true);
                    workAddressRef.current?.focus();
                  }
                } else {
                  navigation.navigate('LoginScreen');
                }
              }}
            />
          </View>
        </View>
      </View>
      <ImageBackground
        style={[
          styles.bottomContainer,
          subscribed ? styles.subscribedBackground : {},
        ]}
        source={require('../assets/images/slant_background_big.png')}>
        <View style={styles.bottomRowHeaderContainer}>
          <Text style={[appStyles.headerOneStyle, styles.bottomRowHeaderText]}>
            Manage Subscription
          </Text>
          <View style={styles.bottomRowSubHeader}>
            <Text style={[appStyles.headerTwoStyle, styles.addFreeText]}>
              Ad Free
            </Text>
            <Text style={[appStyles.headerTwoStyle, styles.addFreeNormalText]}>
              Go ad free and support independent weather broadcasting
            </Text>
          </View>
        </View>
        <View style={styles.pricesContainer}>
          {subscribed ? renderSubscribed() : renderPrices()}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            type="primary"
            text={subscribed ? 'Cancel' : 'Subscribe'}
            loading={loading}
            onPress={() => {
              if (subscribed) {
                cancelSubscription();
              } else {
                onSubscribe();
              }
            }}
          />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bottomContainer: {
    flex: 1.5,
    // backgroundColor: '#EBEBEB',
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  headerLeftContainer: {},
  headerRightContainer: {},
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedBackText: {
    color: primaryColor,
    fontFamily: FONTS.bold,

    fontSize: 16,
  },
  homeContainer: {
    marginBottom: 25,
  },
  workContainer: {
    // marginHorizontal: 13,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 13,
    alignItems: 'center',
  },

  addressTextContainer: {
    flex: 1,
    marginTop: -10,
  },
  addressBold: {
    color: '#3D3D3D',
    fontFamily: FONTS.regular,
    marginRight: 15,
    height: null,
    fontSize: 16,
    paddingVertical: 0,
  },

  bottomRowHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  bottomRowHeaderText: {
    marginBottom: 8,
  },
  bottomRowSubHeader: {
    marginHorizontal: 13,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  addFreeText: {
    textAlign: 'left',
    color: '#3D3D3D',
  },
  addFreeNormalText: {
    textAlign: 'left',
    fontFamily: FONTS.regular,
    color: '#3D3D3D',
  },
  priceButtonContainer: {
    backgroundColor: '#fff',
    marginBottom: 5,
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  monthContainer: {},
  monthText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: '#3D3D3D',
  },
  priceContainer: {},
  priceText: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: '#3D3D3D',
  },
  pricesContainer: {
    paddingHorizontal: 20,
  },
  selectedPriceStyle: {
    borderWidth: 3,
    borderColor: primaryColor,
  },
  deSelectedPriceStyle: {
    borderWidth: 3,
    borderColor: 'transparent',
  },
  bestValueContainer: {
    backgroundColor: primaryColor,
    // position: 'absolute',
    top: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignSelf: 'flex-start',
    marginTop: -20,
  },
  bestValueText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  subscribedContainer: {
    flex: 1,
  },
  subscribedBackground: {
    minHeight: Dimensions.get('window').height / 1.5,
  },

  cancelHeaderText: {
    marginBottom: 10,
    textAlign: 'center',
    ...appStyles.headerTwoStyle,
  },
  cancelInfoText: {
    textAlign: 'center',
    color: '#7F7F7F',
    fontSize: 15,
  },
});

const mapStateToProps = ({
  userReducer,
}: StoreState): {userReducer: UserReducer} => {
  return {
    userReducer,
  };
};

export default connect(mapStateToProps, {getUserData})(ProfileScreen);
