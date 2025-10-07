import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import PieChart from 'react-native-pie-chart';
import NameBalanceContainer from '../../../../components/NameBalanceContainer';
import ViewAll from '../../../../components/ViewAll';
import {GetPayable} from '../../../../global/ChartApisCall';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const PayableSummary = ({navigation}) => {
  const [dataState, setDataState] = useState(null);
  const [circleData, setCircleData] = useState(null);

  const colors = [
    '#00E0FF',
    '#FF6B6B',
    '#FFD93D',
    '#6BCB77',
    '#4D96FF',
    '#FFB347',
    '#9D4EDD',
    '#38BDF8',
    '#FF007F',
    '#FFAA00',
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    const apiResponse = await GetPayable();

    if (apiResponse?.data_supp_bal) {
      const circleBar = apiResponse.data_supp_bal.map((item, index) => ({
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
    return dataState?.data_supp_bal || [];
  };

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      <SimpleHeader title="Payable Balance" />

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 200}}>
        <View style={{padding: 10}}>
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
                  <Text style={styles.chartTitle}>Payable Balance</Text>
                </View>
              </>
            )}
          </View>

          {/* List Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.sectionTitle}>Top 10 Receivable Balance</Text>
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
                const perc =
                  total > 0 ? ((balance / total) * 100).toFixed(2) : 0;

                return (
                  <View style={styles.card}>
                    <NameBalanceContainer
                      Name={item?.supp_name}
                      balance={balance}
                      perc={perc}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default PayableSummary;

const styles = StyleSheet.create({
  chartTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
