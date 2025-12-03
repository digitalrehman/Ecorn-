import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppText from './AppText';
import {APPCOLORS} from '../utils/APPCOLORS';

const TopTen = ({title, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: APPCOLORS.Primary,
        borderRadius: 20,
      }}>
      <AppText title={title} titleSize={2} titleColor={'white'} titleWeight />
    </TouchableOpacity>
  );
};

export default TopTen;
