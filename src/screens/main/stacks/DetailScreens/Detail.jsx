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
import {responsiveHeight, responsiveWidth} from '../../../../utils/Responsive';
import BaseUrl from '../../../../utils/BaseUrl';
import axios from 'axios';
import TopTen from '../../../../components/TopTen';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const Detail = ({navigation}) => {
  const accessData = useSelector(state => state?.Data?.accessData);

  const [slider_data, setslider_data] = useState();
  const [AllData, setAllData] = useState();
  const [expenseData, setExpenseData] = useState([]);
  const [loader, setLoader] = useState(false);

  const incomeData = [
    {
      id: '1',
      title: 'Total Income',
      amount: Math.abs(slider_data?.cur_m_income || 0),
    },
  ];

  const revData = [
    {
      id: 6,
      title: 'Cash',
      accessKey: 'bank',
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
      setslider_data(data?.slider_data);
      setAllData(data);
      setExpenseData(data?.data_exp_det || []);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const renderRow = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>
        {(item.name || item.title)?.replace(/&amp;/g, '&')}
      </Text>
      <Text style={styles.rowAmount}>
        {parseFloat(item.total || item.amount).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      <SimpleHeader title="Dashboard" />

      {loader ? (
        <View
          style={{
            height: responsiveHeight(100),
            width: responsiveWidth(100),
            position: 'absolute',
            zIndex: 10,
            backgroundColor: COLORS.BLACK,
            opacity: 0.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={COLORS.WHITE} />
        </View>
      ) : null}

      <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}>
        {/* Income Section */}
        <View style={styles.box}>
          <Text style={styles.boxHeader}>Income</Text>
          <FlatList
            data={incomeData}
            keyExtractor={item => item.id}
            renderItem={renderRow}
          />
        </View>

        {/* Expense Section */}
        <View style={styles.box}>
          <Text style={styles.boxHeader}>Expense</Text>
          <FlatList
            data={expenseData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRow}
          />
        </View>

        {/* Revenue Section */}
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
                gradientTopColor={COLORS.Primary}
                gradientBottomColor={COLORS.Secondary}
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
    </LinearGradient>
  );
};

export default Detail;

let styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  boxHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: COLORS.WHITE,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowTitle: {fontSize: 16, color: 'rgba(255,255,255,0.85)'},
  rowAmount: {fontSize: 16, fontWeight: 'bold', color: COLORS.WHITE},
});
