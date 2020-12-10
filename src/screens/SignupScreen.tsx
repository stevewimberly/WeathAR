import React, {FunctionComponent, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AuthButtons from '../components/Buttons/AuthButtons';
import Button from '../components/Buttons/Button';
import {AppScreenProps} from '../navigation/AppNavigation';
import {FONTS, primaryColor} from '../styles/styles';
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {appAlertMessage} from '../utils/constant';
import {AuthAction, UserActionTypes, UserLoginAction} from '../actions';
import {ActionTypes} from '../actions/types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import database from '@react-native-firebase/database';

const SignupScreen: FunctionComponent<AppScreenProps> = (props) => {
  const {navigation} = props;
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      GoogleSignin.configure({
        webClientId:
          '1015876228112-n2qfeh9ntckgikvtmecjsgvmtpk5jv6o.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        hostedDomain: '', // specifies a hosted domain restriction
        loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      });
    }, []),
  );

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const data = await auth().signInWithCredential(googleCredential);

      // console.log(data, 'userData');

      const snapshot = await database()
        .ref(`/users/${data.user.uid}`)
        .once('value');

      const userData = await snapshot.val();

      dispatch<UserActionTypes>({
        type: ActionTypes.ON_FETCH_USER_SUCC,
        payload: userData,
      });

      dispatch<UserLoginAction>({
        type: ActionTypes.ON_LOGIN_SUCC,
        // @ts-ignore
        payload: data.user._user,
      });

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      setLoading(false);
      console.log(error, 'err');
    }
  };

  const onFacebookButtonPress = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'android') {
        LoginManager.setLoginBehavior('web_only');
      }
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      console.log(result, 'result');

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken,
      );

      // Sign-in the user with the credential
      const userAuth = await auth().signInWithCredential(facebookCredential);
      // console.log(userAuth, 'userAuth');

      const snapshot = await database()
        .ref(`/users/${userAuth.user.uid}`)
        .once('value');

      const userData = await snapshot.val();

      dispatch<UserActionTypes>({
        type: ActionTypes.ON_FETCH_USER_SUCC,
        payload: userData,
      });

      dispatch<UserLoginAction>({
        type: ActionTypes.ON_LOGIN_SUCC,
        // @ts-ignore
        payload: userAuth.user._user,
      });

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error, 'error');
      appAlertMessage(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.topContainer}>
          <View style={styles.closeContainer}>
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.navigate('HomeTabs');
                }
              }}>
              <AntDesign color={primaryColor} name="close" size={25} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}> Sign up </Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email Address"
            style={styles.textInput}
          />
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Button
              text="Continue"
              onPress={() => {
                if (!email) {
                  appAlertMessage('Enter Email');
                } else {
                  dispatch<AuthAction>({
                    type: ActionTypes.ON_EMAIL_CHANGE,
                    payload: {email, screen: 'signup'},
                  });
                  navigation.push('PasswordScreen');
                }
              }}
              buttonContainerStyle={styles.buttonContainerStyle}
              textStyle={{fontSize: 15, textTransform: 'capitalize'}}
            />
          </View>
        </View>
        <ImageBackground
          style={styles.bottomContainer}
          source={require('../assets/images/auth_background_slant.png')}>
          <Text style={styles.headerText}> - OR - </Text>
          <AuthButtons
            text="Continue with Google"
            onPress={() => {
              onGoogleButtonPress();
            }}
            type="google"
            buttonContainerStyle={styles.buttonContainerStyle}
          />
          {Platform.OS === 'ios' && (
            <AuthButtons
              text="Continue with Apple"
              onPress={() => {}}
              type="apple"
              buttonContainerStyle={styles.buttonContainerStyle}
            />
          )}

          <AuthButtons
            text="Continue with Facebook"
            onPress={() => {
              onFacebookButtonPress();
            }}
            type="facebook"
            color="#1778F2"
            textColor="#fff"
            buttonContainerStyle={styles.buttonContainerStyle}
          />
          <View style={styles.otherAuthButtonsContainer}>
            <TouchableOpacity onPress={() => navigation.push('LoginScreen')}>
              <Text style={styles.otherAuthButtonText}>Sign In</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.otherAuthButtonText}>|</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.otherAuthButtonText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('HomeTabs')}>
            <Text style={styles.skipButtonText}> Skip</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  closeContainer: {
    alignItems: 'flex-end',
    paddingVertical: 25,
  },
  bottomContainer: {
    flex: 2,
    paddingHorizontal: 30,
    paddingVertical: 20,
    paddingTop: 50,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
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
  otherAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  otherAuthButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    textAlign: 'center',
  },
  textInput: {
    paddingVertical: 13,
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
    marginVertical: 13,
    paddingHorizontal: 10,
    color: '#B8B8B8',
    fontSize: 15,
  },
  skipButton: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: primaryColor,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
});

export default SignupScreen;
