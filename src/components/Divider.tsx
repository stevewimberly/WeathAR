import React, {FunctionComponent} from 'react';
import {View, StyleSheet} from 'react-native';

const Divider: FunctionComponent = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#707070',
  },
});

export default Divider;
