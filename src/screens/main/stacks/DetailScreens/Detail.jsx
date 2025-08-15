import {
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import RevenueCards from '../../../../components/RevenueCards';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import {responsiveHeight, responsiveWidth} from '../../../../utils/Responsive';
import BaseUrl from '../../../../utils/BaseUrl';
import axios from 'axios';
import TopTen from '../../../../components/TopTen';
import {useSelector} from 'react-redux';

const Detail = ({navigation}) => {
  const accessData = useSelector(state => state?.Data?.accessData);

  const [slider_data, setslider_data] = useState();
  const [AllData, setAllData] = useState();

  const [loader, setLoader] = useState(false);
  const incomeData = [
    {id: '1', title: 'Total Income', amount: slider_data?.cur_m_income},
  ];
  const expenseData = [
    {id: '501', title: 'Cost of Goods Sold', amount: 200000},
    {id: '502', title: 'Payroll Expenses', amount: 120000},
    {id: '504', title: 'Administrative Expenses', amount: 30000},
    {id: '505', title: 'Selling & Marketing', amount: 15000},
    {id: '503', title: 'Finanace Coast', amount: 40000},
  ];
  const revData = [
    {
      id: 6,
      title: 'Cash',
      accessKey: 'cash',
      Amount: slider_data?.cur_m_cash,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_cash,
      isUp: slider_data?.cur_m_cash > slider_data?.pre_m_cash,
    },
    {
      id: 7,
      title: 'Bank',
      accessKey: 'bank',
      Amount: slider_data?.cur_m_bank,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_bank,
      isUp: slider_data?.cur_m_bank > slider_data?.pre_m_bank,
    },
    {
      id: 8,
      title: 'Receivable',
      accessKey: 'receivable',
      Amount: slider_data?.cur_m_receivable,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_receivable,
      isUp: slider_data?.cur_m_receivable > slider_data?.pre_m_receivable,
    },
    {
      id: 9,
      title: 'Payable',
      accessKey: 'payable',
      Amount: slider_data?.cur_m_payable,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_payable,
      isUp: slider_data?.cur_m_payable > slider_data?.pre_m_payable,
    },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMoneyData();
    });
    return unsubscribe;
  }, [navigation]);

  const getMoneyData = async () => {
    setLoader(true);
    const form = new FormData();

    form.append('current_date', '2025-05-19');
    form.append('pre_month_date', '2025-04-19');

    const options = {
      method: 'GET',
      url: `${BaseUrl}dashboard_view.php`,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: form,
    };

    try {
      const {data} = await axios.request(options);
      console.log(data);
      setslider_data(data?.slider_data);
      setAllData(data);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const renderRow = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{item.title}</Text>
      <Text style={styles.rowAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.WHITE}}>
      <SimpleHeader title="Detail" />

      {loader ? (
        <View
          style={{
            height: responsiveHeight(100),
            width: responsiveWidth(100),
            position: 'absolute',
            zIndex: 10,
            backgroundColor: APPCOLORS.BLACK,
            opacity: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={APPCOLORS.WHITE} />
        </View>
      ) : null}

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}>
        {/* Income Section */}
        <Text style={styles.sectionHeader}>Income</Text>
        <FlatList
          data={incomeData}
          keyExtractor={item => item.id}
          renderItem={renderRow}
        />

        {/* Expense Section */}
        <Text style={styles.sectionHeader}>Expense</Text>
        <FlatList
          data={expenseData}
          keyExtractor={item => item.id}
          renderItem={renderRow}
        />

        <FlatList
          data={revData.filter(
            item =>
              accessData?.[0]?.[item.accessKey] === '1' &&
              parseFloat(item.Amount) !== 0,
          )}
          numColumns={2}
          contentContainerStyle={{alignSelf: 'center', gap: 10, marginTop: 20}}
          renderItem={({item}) => {
            return (
              <RevenueCards
                title={item?.title}
                type={item?.type}
                amount={item?.Amount}
                prev_title={item?.Prev_title}
                prev_type={item?.Prev_type}
                prev_amount={item?.Prev_Amount}
                gradientTopColor={APPCOLORS.Primary}
                gradientBottomColor={APPCOLORS.Secondary}
                IsUp={item?.isUp}
                onPress={() =>
                  navigation.navigate('MoreDetail', {
                    slider_data: AllData,
                    type: item.accessKey,
                  })
                }
                accessData={accessData}
              />
            );
          }}
        />

        <View style={{padding: 20, marginTop: 20}}>
          <View style={{gap: 10, marginTop: 10}}>
            {accessData?.[0]?.profit_loss_d == '1' && (
              <TopTen
                onPress={() => navigation.navigate('ProfitAndLossScreen')}
                title="Profit and Loss"
              />
            )}

            {accessData[0]?.what_about == '1' && (
              <TopTen
                onPress={() =>
                  navigation.navigate('Ledger', {name: 'Audit', item: null})
                }
                title="What About Today"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Detail;

let styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowTitle: {fontSize: 16},
  rowAmount: {fontSize: 16, fontWeight: 'bold'},
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  card: {backgroundColor: '#000', padding: 15, borderRadius: 8, margin: 5},
  cardText: {color: '#fff', fontSize: 16},
  profitLossContainer: {marginTop: 20, padding: 10},
  profitLossText: {fontSize: 16},
});
