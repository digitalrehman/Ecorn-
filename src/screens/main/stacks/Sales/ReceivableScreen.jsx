import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import PieChart from 'react-native-pie-chart';
import AppText from '../../../../components/AppText';
import NameBalanceContainer from '../../../../components/NameBalanceContainer';
import ViewAll from '../../../../components/ViewAll';
import {GetReceivable} from '../../../../global/ChartApisCall';

const ReceivableScreen = ({navigation}) => {
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
    const apiResponse = await GetReceivable();

    if (apiResponse?.data_cust_bal) {
      const circleBar = apiResponse.data_cust_bal.map((item, index) => ({
        value:
          parseFloat(Math.round(item.Balance)) < 0
            ? 5
            : parseFloat(Math.round(item.Balance)),
        color: colors[index % colors.length],
      }));
      setCircleData(circleBar);
    }

    setDataState(apiResponse);
  };

  const getListData = () => {
    return dataState?.data_cust_bal || [];
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SimpleHeader title="Receivable Balance" />
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
                  <AppText title="Receivable Balance" titleSize={2} titleWeight />
                </View>
              </>
            )}
          </View>

          {/* List Header */}
          <View style={styles.headerContainer}>
            <AppText
              title="Top 10 Receivable Balance"
              titleSize={2}
              titleWeight
            />
            <ViewAll
              onPress={() =>
                navigation.navigate('NormalViewAll', {
                  AllData: getListData(),
                  dataname: 'Customer',
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
                const balance = parseFloat(item?.Balance) || 0;
                const total = getListData().reduce(
                  (sum, i) => sum + (parseFloat(i?.Balance) || 0),
                  0,
                );
                const perc = total > 0 ? ((balance / total) * 100).toFixed(2) : 0;

                return (
                  <NameBalanceContainer
                    Name={item?.name}
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

export default ReceivableScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
