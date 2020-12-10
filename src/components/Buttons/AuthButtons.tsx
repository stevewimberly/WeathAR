import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ViewStyle,
} from 'react-native';
import {FONTS} from '../../styles/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';

export interface AuthButtonProps {
  type: ButtonTypes;
  text: string;
  onPress(): void;
  loading?: boolean;
  color?: string;
  textColor?: string;
  buttonContainerStyle?: ViewStyle;
}

type ButtonTypes = 'google' | 'snapchat' | 'facebook' | 'apple';

const AuthButtons: FunctionComponent<AuthButtonProps> = (props) => {
  const {
    text,
    type,
    onPress,
    loading = false,
    color = '#fff',
    textColor = '#000',
    buttonContainerStyle,
  } = props;

  const renderIcon = (): JSX.Element | null => {
    if (type === 'apple') {
      return <FontAwesome color={textColor} name="apple" size={25} />;
    } else if (type === 'snapchat') {
      return <FontAwesome color={textColor} name="snapchat-ghost" size={25} />;
    } else if (type === 'facebook') {
      return <FontAwesome5Pro color="#fff" name="facebook" size={25} />;
    } else {
      return (
        <Image
          source={require('../../assets/icons/google_icon.png')}
          style={{height: 25, width: 22}}
          resizeMode="contain"
        />
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: color},
        buttonContainerStyle && buttonContainerStyle,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#1778F2" size="small" />
      ) : (
        <View style={styles.iconContainer}>
          {renderIcon()}
          <Text style={[styles.textStyle, {color: textColor}]}> {text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textStyle: {
    fontFamily: FONTS.bold,
    marginHorizontal: 10,
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AuthButtons;
