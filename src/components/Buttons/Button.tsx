import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {FONTS, primaryColor} from '../../styles/styles';

export interface ButtonProps {
  type?: ButtonTypes;
  text: string;
  onPress(): void;
  loading?: boolean;
  buttonContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

type ButtonTypes = 'primary' | 'secondary';

const Button: FunctionComponent<ButtonProps> = (props) => {
  const {
    text,
    onPress,
    loading = false,
    buttonContainerStyle,
    textStyle = {},
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: primaryColor},
        buttonContainerStyle && buttonContainerStyle,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.textStyle, textStyle]}> {text}</Text>
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
  },
  textStyle: {
    color: '#fff',
    textTransform: 'uppercase',
    fontFamily: FONTS.bold,
  },
});

export default Button;
