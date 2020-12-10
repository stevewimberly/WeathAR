import React, {FunctionComponent, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Button from '../components/Buttons/Button';
import {AppScreenProps} from '../navigation/AppNavigation';
import {FONTS, primaryColor} from '../styles/styles';
import auth from '@react-native-firebase/auth';
import {UserReducer} from '../reducers/userReducer';
import {StoreState} from '../reducers';
import {AppReducer} from '../reducers/appReducer';
import {connect, useDispatch} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {appAlertMessage} from '../utils/constant';
import CheckBox from '@react-native-community/checkbox';
import {ActionTypes} from '../actions/types';
import {UserLoginAction} from '../actions';

interface PasswordScreenProps extends AppScreenProps {
  userReducer: UserReducer;
  appReducer: AppReducer;
}

const PasswordScreen: FunctionComponent<PasswordScreenProps> = (props) => {
  const {navigation, appReducer} = props;
  const {email, screen} = appReducer;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const dispatch = useDispatch();

  const login = async () => {
    try {
      setLoading(true);
      const data = await auth().signInWithEmailAndPassword(email!, password);

      dispatch<UserLoginAction>({
        type: ActionTypes.ON_LOGIN_SUCC,
        // @ts-ignore
        payload: data.user._user,
      });

      setLoading(false);
      navigation.navigate('HomeTabs');
    } catch (error) {
      setLoading(false);

      if (error.code) {
        appAlertMessage(error.code);
      } else {
        appAlertMessage(JSON.stringify(error));
      }
    }
  };

  const signup = async () => {
    try {
      setLoading(true);
      const data = await auth().createUserWithEmailAndPassword(
        email!,
        password,
      );

      dispatch<UserLoginAction>({
        type: ActionTypes.ON_LOGIN_SUCC,
        // @ts-ignore
        payload: data.user._user,
      });

      setLoading(false);
      navigation.navigate('HomeTabs');

      // console.log(data, 'data');
    } catch (error) {
      setLoading(false);

      if (error.code) {
        appAlertMessage(error.code);
      } else {
        appAlertMessage(JSON.stringify(error));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={25} color={primaryColor} />
          <Text style={styles.skipButtonText}> Start Over</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {screen === 'login' && 'Login'}
          {screen === 'signup' && 'Sign up'}
          {screen === 'password' && 'Reset Password'}
        </Text>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}> YOU ENTERED: </Text>
          <Text style={styles.emailText}> {email}</Text>
        </View>
        <View style={styles.textInputContainer}>
          <Text style={styles.titleText}> Choose a Password </Text>
          <TextInput
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            style={styles.textInput}
            secureTextEntry
          />
        </View>
        {screen === 'signup' && (
          <View style={styles.privacyContainer}>
            <View>
              <CheckBox
                disabled={false}
                value={checked}
                onValueChange={(newValue) => setChecked(newValue)}
                tintColor={primaryColor}
                tintColors={{true: primaryColor}}
              />
            </View>
            <TouchableOpacity>
              <Text style={styles.privacyText}>
                I have read and agree to the terms of use and
                <Text style={{color: primaryColor, fontFamily: FONTS.bold}}>
                  {` privacy policy.`}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button
            text="Finish"
            onPress={() => {
              Keyboard.dismiss();
              if (!password) {
                appAlertMessage('Please enter password');
              } else if (!checked && screen === 'signup') {
                appAlertMessage('Please accept privacy policy');
              } else {
                if (screen === 'login') {
                  login();
                } else if (screen === 'signup') {
                  signup();
                }
              }
            }}
            buttonContainerStyle={styles.buttonContainerStyle}
            textStyle={{fontSize: 15, textTransform: 'capitalize'}}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    height: 50,
  },
  buttonContainerStyle: {
    paddingVertical: 18,
    marginVertical: 10,
  },

  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleText: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    color: '#3F3F3F',
    textTransform: 'uppercase',
    marginBottom: 13,
  },
  emailText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#3F3F3F',
  },

  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
  },
  textInput: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#3F3F3F',
    fontSize: 15,
    width: '100%',
  },
  skipButton: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 25,
  },
  privacyContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  privacyText: {
    color: '#3F3F3F',
    marginLeft: 10,
  },
  skipButtonText: {
    color: primaryColor,
    fontFamily: FONTS.bold,
    fontSize: 15,
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

export default connect(mapStateToProps)(PasswordScreen);
