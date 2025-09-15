// LeadsListScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const LeadsListScreen = ({route}) => {
  const {filter} = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected Filter: {filter}</Text>
      <Text style={styles.text}>API data yahan show hoga...</Text>
    </View>
  );
};

export default LeadsListScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 18, fontWeight: '600'},
});
