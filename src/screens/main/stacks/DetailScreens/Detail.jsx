import {
  View,
  FlatList,
  ScrollView,
  ActivityIndicator,
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
  const revData = [
    {
      id: 1,
      title: 'Income',
      accessKey: 'income', // add this
      Amount: slider_data?.cur_m_income,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_income,
      topColor: '#88C365',
      bottomColor: '#719D44',
      isUp: slider_data?.cur_m_income > slider_data?.pre_m_income,
    },
    {
      id: 2,
      title: 'Expense',
      accessKey: 'expense',
      Amount: slider_data?.cur_m_expense,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_expense,
      topColor: '#F7587C',
      bottomColor: '#B12037',
      isUp: slider_data?.cur_m_expense > slider_data?.pre_m_expense,
    },
    {
      id: 3,
      title: 'Revenue',
      accessKey: 'revenu',
      Amount: slider_data?.cur_m_revenue,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_revenue,
      topColor: '#EBE383',
      bottomColor: '#D5C026',
      isUp: slider_data?.cur_m_revenue > slider_data?.pre_m_revenue,
    },
    {
      id: 6,
      title: 'Cash',
      accessKey: 'cash',
      Amount: slider_data?.cur_m_cash,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_cash,
      topColor: '#88C365',
      bottomColor: '#88C365',
      isUp: slider_data?.cur_m_cash > slider_data?.pre_m_cash,
    },
    {
      id: 7,
      title: 'Bank',
      accessKey: 'bank',
      Amount: slider_data?.cur_m_bank,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_bank,
      topColor: '#8ED5E6',
      bottomColor: '#6CB9A7',
      isUp: slider_data?.cur_m_bank > slider_data?.pre_m_bank,
    },
    {
      id: 8,
      title: 'Receivable',
      accessKey: 'receivable',
      Amount: slider_data?.cur_m_receivable,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_receivable,
      topColor: '#E68E8E',
      bottomColor: '#B96C6C',
      isUp: slider_data?.cur_m_receivable > slider_data?.pre_m_receivable,
    },
    {
      id: 9,
      title: 'Payable',
      accessKey: 'payable',
      Amount: slider_data?.cur_m_payable,
      Prev_title: 'Previous Month',
      Prev_Amount: slider_data?.pre_m_payable,
      topColor: '#EBE383',
      bottomColor: '#D5C026',
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
                  navigation.navigate('MoreDetail', {slider_data: AllData})
                }
                accessData={accessData}
              />
            );
          }}
        />

        <View style={{padding: 20, marginTop: 20}}>
          <View style={{gap: 10, marginTop: 10}}>
            {accessData[0]?.profit_loss_d == '1' && (
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
