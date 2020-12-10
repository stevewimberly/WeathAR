import React, {FunctionComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {primaryColor} from '../../styles/styles';

interface EditButtonProps extends TouchableOpacityProps {
  edit?: boolean;
}

const EditButton: FunctionComponent<EditButtonProps> = (props) => {
  const {edit = false} = props;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {backgroundColor: edit ? primaryColor : '#fff'},
      ]}
      {...props}>
      <Text style={[styles.editText, {color: edit ? '#fff' : primaryColor}]}>
        {edit ? 'Save' : 'Edit'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    width: 40,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: primaryColor,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default EditButton;
