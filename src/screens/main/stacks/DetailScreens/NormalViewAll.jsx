import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons'; // 👈 icon for search
import SimpleHeader from '../../../../components/SimpleHeader';
import NameBalanceContainer from '../../../../components/NameBalanceContainer';
import {responsiveHeight, responsiveWidth} from '../../../../utils/Responsive';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import AppButton from '../../../../components/AppButton';

const NormalViewAll = ({navigation, route}) => {
  const {AllData, dataname} = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(AllData);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(AllData);
    } else {
      const lowerSearch = searchQuery.toLowerCase();
      const newData = AllData.filter(item => {
        const name =
          dataname === 'Supplier'
            ? item.supp_name
            : dataname === 'Bank'
            ? item?.bank_name
            : dataname === 'item'
            ? item?.description
            : dataname === 'salesman'
            ? item?.salesman_name
            : dataname === 'Customer'
            ? item?.name
            : dataname === 'Payable'
            ? item.supp_name
            : dataname === 'Cash'
            ? item?.bank_name
            : dataname === 'Receivable'
            ? item?.name
            : null;

        return name?.toLowerCase().includes(lowerSearch);
      });
      setFilteredData(newData);
    }
  }, [searchQuery, AllData]);

  // Helper function
  const getNameAndBalance = (item, dataname) => {
    switch (dataname) {
      case 'Bank':
        return {Name: item?.bank_name, Balance: item?.bank_balance};
      case 'Supplier':
      case 'Payable':
        return {Name: item?.supp_name, Balance: item?.Balance};
      case 'Customer':
        return {Name: item?.name, Balance: item?.Balance};
      case 'item':
        return {Name: item?.description, Balance: item?.total};
      case 'salesman':
        return {Name: item?.salesman_name, Balance: item?.Balance};
      case 'Cash':
        return {Name: item?.bank_name, Balance: item?.bank_balance};
      case 'Receivable':
        return {Name: item?.name, Balance: item?.Balance};
      default:
        return {Name: item?.name, Balance: item?.Balance};
    }
  };

  return (
    <LinearGradient
      colors={['#f6f7fb', '#dfe9f3']}
      style={{flex: 1, paddingBottom: 10}}>
      <SimpleHeader title="View All" />

      {dataname === 'Customer' || dataname === 'Supplier' ? (
        <View
          style={{
            alignItems: 'center',
            gap: 5,
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <AppButton
            title="Aging"
            onPress={() => navigation.navigate('PdfScreen')}
            btnWidth={44}
          />
          <AppButton
            title="Ledger"
            onPress={() => navigation.navigate('PdfScreen')}
            btnWidth={44}
          />
        </View>
      ) : null}

      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          height: responsiveHeight(6.5),
          width: responsiveWidth(90),
          alignSelf: 'center',
          borderRadius: 12,
          marginTop: responsiveHeight(2),
          paddingHorizontal: 15,
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: {width: 0, height: 2},
        }}>
        <Icon name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search here..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            flex: 1,
            fontSize: 16,
            color: '#333',
            marginLeft: 10,
          }}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 30,
        }}
        renderItem={({item}) => {
          const {Name, Balance} = getNameAndBalance(item, dataname);
          return <NameBalanceContainer Name={Name} balance={Balance} />;
        }}
      />
    </LinearGradient>
  );
};

export default NormalViewAll;
