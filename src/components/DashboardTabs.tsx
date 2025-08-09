import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { responsiveHeight } from '../utils/Responsive';
import { APPCOLORS } from '../utils/APPCOLORS';
import AppText from './AppText';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  name?: string;
  isNew?: boolean;
  onPress?: () => void;
  icon: string;
};

const DashboardTabs = ({ name, onPress, icon }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: responsiveHeight(12),
        width: responsiveHeight(12),
        backgroundColor: APPCOLORS.WHITE,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 15,
      }}>
      <Feather name={icon} size={30} color="black" />
      <AppText
        title={name}
        titleAlignment={'center'}
        titleColor={APPCOLORS.BLACK}
        titleSize={1.5}
        titleWeight
      />
    </TouchableOpacity>
  );
};

export default DashboardTabs;
