import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import AppText from './AppText';
import {APPCOLORS} from '../utils/APPCOLORS';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveWidth} from '../utils/Responsive';
import AppButton from './AppButton';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NameBalanceContainer = ({
  Name,
  type,
  balance,
  item,
}) => {
  const navigation = useNavigation();
  // Function to handle navigation with proper parameters
  const handleAgingPress = () => {
    navigation.navigate('Aging', {
      name: type,
      item: item,
    });
  };

  const handleLedgerPress = () => {
    navigation.navigate('Ledger', {
      name: type,
      item: item,
    });
  };

  return (
    <LinearGradient
      colors={[APPCOLORS.BLACK, APPCOLORS.Secondary]}
      style={{padding: 12, borderRadius: 12, marginBottom: 6}}> {/* Reduced padding */}
      
      {/* Main Content Row - Name, Balance, and Action Icons in one line */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        
        {/* Name Section */}
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <View style={{flex: 1}}>
            <AppText
              title={Name}
              titleSize={1.6}
              titleColor={APPCOLORS.WHITE}
              numberOfLines={1}
            />
          </View>
        </View>

        {/* Balance Section */}
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 8}}>
          <AppText
            title={Math.round(balance).toLocaleString()}
            titleSize={1.6}
            titleColor={APPCOLORS.WHITE}
          />
        </View>

        {/* Action Icons Section */}
        {(type === 'Customer' || type === 'Suppliers' || type === 'Items' || type === "Banks") && (
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            
            {type === 'Items' || type === 'Banks' ? (
              // Single Ledger icon for Items and Banks
              <TouchableOpacity onPress={handleLedgerPress}>
                <Icon name="receipt-long" size={20} color={APPCOLORS.WHITE} />
              </TouchableOpacity>
            ) : (
              // Both Aging and Ledger icons for Customer and Suppliers
              <>
                <TouchableOpacity onPress={handleAgingPress}>
                  <Icon name="calendar-today" size={20} color={APPCOLORS.WHITE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLedgerPress}>
                  <Icon name="receipt-long" size={20} color={APPCOLORS.WHITE} />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default NameBalanceContainer;