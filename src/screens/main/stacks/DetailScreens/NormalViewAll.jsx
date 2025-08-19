import {View, Text, FlatList, TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
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
            : item?.name;

        return name?.toLowerCase().includes(lowerSearch);
      });
      setFilteredData(newData);
    }
  }, [searchQuery, AllData]);
  // Helper function
  const getNameAndBalance = (item: any, dataname: string) => {
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
        return {Name: 'Cash', Balance: item?.Balance};

      case 'Receivable':
        return {Name: item?.name, Balance: item?.Balance};
      default:
        return {Name: item?.name, Balance: item?.Balance};
    }
  };

  return (
    <View>
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

      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{
          height: responsiveHeight(7),
          width: responsiveWidth(90),
          alignSelf: 'center',
          borderWidth: 1,
          borderColor: APPCOLORS.BLACK,
          borderRadius: 10,
          marginTop: responsiveHeight(2),
          paddingHorizontal: 20,
        }}
      />

      <View style={{gap: 10, marginTop: 20, padding: 20, paddingTop: 0}}>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{gap: 10, marginTop: 20, paddingBottom: 350}}
          renderItem={({item}) => {
            const {Name, Balance} = getNameAndBalance(item, dataname);
            return <NameBalanceContainer Name={Name} balance={Balance} />;
          }}
        />
      </View>
    </View>
  );
};

export default NormalViewAll;
