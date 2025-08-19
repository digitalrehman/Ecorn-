import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import PieChart from 'react-native-pie-chart';
import AppText from '../../../../components/AppText';
import NameBalanceContainer from '../../../../components/NameBalanceContainer';
import ViewAll from '../../../../components/ViewAll';
import {
  GetBankBalance,
  GetPayable,
  GetReceivable,
} from '../../../../global/ChartApisCall';

const MoreDetail = ({navigation, route}) => {
  const {type} = route.params;

  const [dataState, setDataState] = useState(null);
  const [circleData, setCircleData] = useState(null);

  const colors = [
    '#910000',
    '#00FF26',
    '#FF704D',
    '#DA0000',
    '#FF9168',
    '#FF5234',
    '#AD5959',
    '#ABCD12',
    '#910000',
    '#FFAA00',
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    let apiResponse = null;
    let circleBar = null;

    switch (type) {
      case 'bank':
        apiResponse = await GetBankBalance();
        if (apiResponse?.data_bank_bal) {
          circleBar = apiResponse.data_bank_bal.map((item, index) => ({
            value:
              parseFloat(Math.round(item.bank_balance)) < 0
                ? 5
                : parseFloat(Math.round(item.bank_balance)),
            color: colors[index % colors.length],
          }));
        }
        break;

      case 'payable':
        apiResponse = await GetPayable();
        if (apiResponse?.data_supp_bal) {
          circleBar = apiResponse.data_supp_bal.map((item, index) => ({
            value:
              parseFloat(Math.round(item.Balance)) < 0
                ? 5
                : parseFloat(Math.round(item.Balance)),
            color: colors[index % colors.length],
          }));
        }
        break;

      case 'receivable':
        apiResponse = await GetReceivable();
        if (apiResponse?.data_cust_bal) {
          circleBar = apiResponse.data_cust_bal.map((item, index) => ({
            value:
              parseFloat(Math.round(item.Balance)) < 0
                ? 5
                : parseFloat(Math.round(item.Balance)),
            color: colors[index % colors.length],
          }));
        }
        break;

      case 'cash': // Agar cash ka API alag hai to yahan call karein
        apiResponse = await GetBankBalance(); // Placeholder
        console.log('apirespnse', apiResponse);

        if (apiResponse?.data_bank_bal) {
          circleBar = apiResponse.data_bank_bal.map((item, index) => ({
            value:
              parseFloat(Math.round(item.bank_balance)) < 0
                ? 5
                : parseFloat(Math.round(item.bank_balance)),
            color: colors[index % colors.length],
          }));
        }
        break;

      default:
        break;
    }

    setDataState(apiResponse);
    setCircleData(circleBar);
  };

  const getTitle = () => {
    switch (type) {
      case 'bank':
        return 'Bank Balance';
      case 'payable':
        return 'Payable Balance';
      case 'receivable':
        return 'Receivable Balance';
      case 'cash':
        return 'Cash Balance';
      default:
        return 'Details';
    }
  };

  const getListData = () => {
    switch (type) {
      case 'bank':
        return dataState?.data_bank_bal || [];
      case 'payable':
        return dataState?.data_supp_bal || [];
      case 'receivable':
        return dataState?.data_cust_bal || [];
      case 'cash':
        return dataState?.data_bank_bal || [];
      default:
        return [];
    }
  };

  return (
    <View>
      <SimpleHeader title={getTitle()} />
      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}>
        <View style={{padding: 20}}>
          {/* Chart */}
          <View style={{alignItems: 'center', marginTop: 20}}>
            {circleData && (
              <>
                <PieChart
                  widthAndHeight={250}
                  series={circleData}
                  cover={0.7}
                  style={{alignSelf: 'center'}}
                />
                {/* Title in center */}
                <View
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{translateX: -50}, {translateY: -10}],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AppText title={getTitle()} titleSize={2} titleWeight />
                </View>
              </>
            )}
          </View>

          {/* List Header */}
          <View style={styles.headerContainer}>
            <AppText
              title={`Top 10 ${getTitle()}`}
              titleSize={2}
              titleWeight
              titleSizeWeight={40}
            />
            <ViewAll
              onPress={() =>
                navigation.navigate('NormalViewAll', {
                  AllData: getListData(),
                  dataname:
                    type === 'bank'
                      ? 'Bank'
                      : type === 'payable'
                      ? 'Payable'
                      : type === 'receivable'
                      ? 'Customer'
                      : 'Supplier',
                })
              }
            />
          </View>

          {/* List */}
          <View style={{gap: 10, marginTop: 20}}>
            <FlatList
              data={getListData()}
              contentContainerStyle={{gap: 10}}
              renderItem={({item}) => {
                const balance =
                  type === 'bank' || type === 'cash'
                    ? parseFloat(item?.bank_balance) || 0
                    : type === 'payable'
                    ? parseFloat(item?.Balance) || 0
                    : type === 'receivable'
                    ? parseFloat(item?.Balance) || 0
                    : 0;

                const total = getListData().reduce(
                  (sum, i) =>
                    sum +
                    (type === 'bank' || type === 'cash'
                      ? parseFloat(i?.bank_balance) || 0
                      : type === 'payable'
                      ? parseFloat(i?.Balance) || 0
                      : type === 'receivable'
                      ? parseFloat(i?.Balance) || 0
                      : 0),
                  0,
                );

                const perc =
                  total > 0 ? ((balance / total) * 100).toFixed(2) : 0;

                return (
                  <NameBalanceContainer
                    Name={
                      type === 'bank' || type === 'cash'
                        ? item?.bank_name
                        : type === 'payable'
                        ? item?.supp_name
                        : type === 'receivable'
                        ? item?.name
                        : ''
                    }
                    balance={balance}
                    perc={perc}
                  />
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MoreDetail;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
