import React, {FunctionComponent, useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {appStyles, FONTS} from '../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ButtonIndicator from '../components/Buttons/ButtonIndicator';
import EditButton from './Buttons/EditButton';
import {appAlertMessage, GOOGLE_PLACE_API} from '../utils/constant';
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import {Address} from '../screens/HomeScreen';
// import {ScrollView} from 'react-native-gesture-handler';

interface LocationSelectorProps {
  height: number;
  onHomePress: Function;
  onWorkPress: Function;
  onEditPress(type: 'home' | 'work', callback: Function): void;
  onLocationSelect(
    type: 'home' | 'work',
    address: Address,
    callback?: Function,
  ): void;
  homeAddress?: Address | null;
  workAddress?: Address | null;
  currentLocation: Address | null;
  homeEdit: boolean;
  workEdit: boolean;
  userHomeAddress?: string;
  userWorkAddress?: string;
  onLocationSearch(lat: number, lng: number, address: string): void;
}

const LocationSelector: FunctionComponent<LocationSelectorProps> = (props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    onHomePress,
    onWorkPress,
    onEditPress,
    homeAddress,
    workAddress,
    currentLocation,
    homeEdit,
    workEdit,
    userHomeAddress,
    userWorkAddress,
    onLocationSelect,
    onLocationSearch,
  } = props;
  const homeAddressRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const workAddressRef = useRef<GooglePlacesAutocompleteRef | null>(null);

  useEffect(() => {
    if (userHomeAddress) {
      homeAddressRef.current?.setAddressText(userHomeAddress);
    }

    if (userWorkAddress) {
      workAddressRef.current?.setAddressText(userWorkAddress);
    }

    // Alert.alert('Here');
    // console.log()
  }, [userHomeAddress, userWorkAddress]);

  return (
    <ScrollView style={[styles.container]} keyboardShouldPersistTaps="always">
      <View style={styles.headerContainer}>
        <View style={{position: 'relative'}}>
          <GooglePlacesAutocomplete
            placeholder="Search by name, city, or ZIP"
            onPress={(data, details = null) => {
              if (details) {
                const {lat, lng} = details.geometry.location;
                onLocationSearch(lat, lng, details.formatted_address);

                // setWorkAddress({
                //   formatedAddress: details.formatted_address,
                //   location: details.geometry.location,
                //   description: 'Work',
                // });
              }
            }}
            query={{
              key: GOOGLE_PLACE_API,
              language: 'en',
            }}
            styles={{
              textInput: [styles.textInputStyle],
            }}
            fetchDetails
            textInputProps={{
              multiline: true,
              numberOfLines: 2,
            }}
          />
          <FontAwesome
            name="search"
            color="#8F8F8F"
            size={18}
            style={{position: 'absolute', right: 20, top: '15%'}}
          />
        </View>

        <View style={styles.homeContainer}>
          <ButtonIndicator
            text="Current Location"
            iconName="map-marker"
            iconSize={16}
            onPress={() => onHomePress()}
          />
          <View style={styles.addressContainer}>
            <View style={styles.addressTextContainer}>
              {currentLocation && (
                <Text style={[appStyles.headerTwoStyle, styles.addressBold]}>
                  {currentLocation.formatedAddress}
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.homeContainer}>
          <ButtonIndicator
            text="Home"
            iconName="home"
            onPress={() => onHomePress()}
          />
          <View style={styles.addressContainer}>
            <View style={styles.addressTextContainer}>
              <GooglePlacesAutocomplete
                ref={homeAddressRef}
                placeholder="Home Address"
                onPress={(data, details = null) => {
                  console.log(details, 'details');
                  if (details) {
                    // homeAddressRef.current?.setAddressText(
                    //   details.formatted_address,
                    // );
                    onLocationSelect('home', {
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
                  onBlur: () => {
                    onEditPress('home', () => {
                      homeAddressRef.current?.focus();
                    });
                  },
                }}
              />
            </View>
            <EditButton
              edit={homeEdit}
              onPress={() => {
                onEditPress('home', () => {
                  homeAddressRef.current?.focus();
                });
              }}
            />
          </View>
        </View>
        <View style={styles.workContainer}>
          <ButtonIndicator
            text="Work"
            iconName="briefcase"
            iconSize={16}
            onPress={() => onWorkPress()}
          />
          <View style={styles.addressContainer}>
            <View style={styles.addressTextContainer}>
              <GooglePlacesAutocomplete
                ref={workAddressRef}
                placeholder="Work Address"
                onPress={(data, details = null) => {
                  console.log(details, 'details');
                  if (details) {
                    onLocationSelect('work', {
                      formatedAddress: details.formatted_address,
                      location: details.geometry.location,
                      description: 'Work',
                    });
                    // setWorkAddress({
                    //   formatedAddress: details.formatted_address,
                    //   location: details.geometry.location,
                    //   description: 'Work',
                    // });
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
                  // onBlur: () => {
                  //   appAlertMessage('Hello');
                  //   // onEditPress('work', () => {
                  //   //   workAddressRef.current?.focus();
                  //   // });
                  // },
                }}
              />
            </View>
            <EditButton
              edit={workEdit}
              onPress={() => {
                onEditPress('work', () => {
                  workAddressRef.current?.focus();
                });
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    // zIndex: 100,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    borderRadius: 100,
    backgroundColor: '#ECECEC',
    minHeight: 45,
    paddingHorizontal: 15,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 15,
    flex: 1,
    backgroundColor: '#ECECEC',
    height: 40,
    marginBottom: 30,
    borderRadius: 100,
    paddingHorizontal: 25,
  },
  buttonIndicatorsContainer: {
    flexDirection: 'row',
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
  },
  addressTextContainer: {
    flex: 1,
  },
  addressBold: {
    color: '#3D3D3D',
    fontFamily: FONTS.regular,
    marginRight: 15,
    height: null,
    fontSize: 16,
    paddingVertical: 0,
  },
  addressNormal: {
    fontWeight: 'normal',
  },
});

export default LocationSelector;
