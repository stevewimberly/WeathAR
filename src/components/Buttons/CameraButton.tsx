import React, {FunctionComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {primaryColor} from '../../styles/styles';
import Feather from 'react-native-vector-icons/Feather';

interface CameraButtonProps {
  onPress(): void;
  customStyle?: ViewStyle;
}

const CameraButton: FunctionComponent<CameraButtonProps> = (props) => {
  const {onPress = () => {}, customStyle = {}} = props;
  return (
    <TouchableOpacity style={[styles.container, customStyle]} onPress={onPress}>
      <Feather name="camera" color="#fff" size={30} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 65,
    width: 65,
    borderRadius: 100,
    backgroundColor: primaryColor,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraButton;
