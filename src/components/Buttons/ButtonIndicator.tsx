import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FONTS} from '../../styles/styles';

type IconNames = 'briefcase' | 'home' | 'map-marker';

export interface ButtonIndicatorProps extends TouchableOpacityProps {
  text: string;
  iconName: IconNames;
  iconSize?: number;
  customStyle?: ViewStyle;
}

const ButtonIndicator: FunctionComponent<ButtonIndicatorProps> = (props) => {
  const {text, iconName, iconSize = 20, customStyle = {}} = props;
  return (
    <TouchableOpacity style={[styles.container, customStyle]} {...props}>
      <FontAwesome color="#3D3D3D" name={iconName} size={iconSize} />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 5,
    minWidth: 100,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  text: {
    color: '#3D3D3D',
    fontFamily: FONTS.bold,

    marginLeft: 5,
    fontSize: 15,
  },
});

export default ButtonIndicator;
