import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import AppText from '../../../../components/AppText';
import { responsiveHeight, responsiveWidth } from '../../../../utils/Responsive';
import BaseUrl from '../../../../utils/BaseUrl';
import moment from 'moment';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const ProfitAndLossScreen = ({ navigation }) => {
  const [alldata, setAllData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMoneyData();
    });
    return unsubscribe;
  }, [navigation]);

  const getMoneyData = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      const currentDate = new Date();
      const todayDate = moment(currentDate).format('YYYY-MM-DD');

      form.append('current_date', todayDate);
      form.append('pre_month_date', '2025-04-19');

      const options = {
        method: 'GET',
        url: `${BaseUrl}dashboard_view.php`,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: form,
      };

      const { data } = await axios.request(options);
      setAllData(data);
    } catch (error) {
      console.log('Error', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPLCard = (item, type = "income") => (
    <View style={styles.card}>
      <View style={styles.row}>
        <AppText title="Name" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
        <AppText title={item?.name} titleSize={2} titleColor={COLORS.WHITE} />
      </View>

      <View style={styles.row}>
        <AppText title="Today" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
        <AppText
          title={item?.today_data ? item?.today_data : 0}
          titleSize={2}
          titleColor={COLORS.WHITE}
        />
      </View>

      <View style={styles.row}>
        <AppText title="Yesterday" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
        <AppText
          title={item?.yesterday_data ? item?.yesterday_data : 0}
          titleSize={2}
          titleColor={COLORS.WHITE}
        />
      </View>

      <View style={styles.row}>
        <AppText title="This Month" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
        <AppText
          title={item?.this_month ? item?.this_month : 0}
          titleSize={2}
          titleColor={COLORS.WHITE}
        />
      </View>

      <View style={styles.row}>
        <AppText title="Last Month" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
        <AppText
          title={item?.last_month ? item?.last_month : 0}
          titleSize={2}
          titleColor={COLORS.WHITE}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <SimpleHeader title="Notification" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          paddingBottom: 100,
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.WHITE} style={{ marginTop: 30 }} />
        ) : (
          <>
            {/* Item Valuation */}
            <AppText title="Item Valuation Today" titleSize={3} titleWeight titleColor={COLORS.WHITE} />
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ gap: 10 }}>
                  <AppText title="Today" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
                  <AppText title="Yesterday" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
                  <AppText title="This Month" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
                  <AppText title="Last Month" titleSize={2} titleWeight titleColor={COLORS.WHITE} />
                </View>
                <View
                  style={{
                    height: responsiveHeight(15),
                    width: 1,
                    backgroundColor: COLORS.WHITE,
                  }}
                />
                <View style={{ gap: 10 }}>
                  <AppText
                    title={
                      alldata?.profit_loss_item_data?.today_value_item
                        ? JSON.parse(alldata?.profit_loss_item_data?.today_value_item)?.toFixed(2)
                        : 0
                    }
                    titleSize={2}
                    titleColor={COLORS.WHITE}
                  />
                  <AppText
                    title={
                      alldata?.profit_loss_item_data?.yesterday_value_item
                        ? JSON.parse(alldata?.profit_loss_item_data?.yesterday_value_item)?.toFixed(2)
                        : 0
                    }
                    titleSize={2}
                    titleColor={COLORS.WHITE}
                  />
                  <AppText
                    title={
                      alldata?.profit_loss_item_data?.this_month_value_item
                        ? JSON.parse(alldata?.profit_loss_item_data?.this_month_value_item)?.toFixed(2)
                        : 0
                    }
                    titleSize={2}
                    titleColor={COLORS.WHITE}
                  />
                  <AppText
                    title={
                      alldata?.profit_loss_item_data?.last_month_value_item
                        ? JSON.parse(alldata?.profit_loss_item_data?.last_month_value_item)?.toFixed(2)
                        : 0
                    }
                    titleSize={2}
                    titleColor={COLORS.WHITE}
                  />
                </View>
              </View>
            </View>

            {/* Income Section */}
            <AppText title="Profit and Loss Income" titleSize={3} titleWeight titleColor={COLORS.WHITE} />
            <FlatList
              data={alldata?.data_profit_and_loss_charts_income}
              renderItem={({ item }) => renderPLCard(item, "income")}
              keyExtractor={(item, index) => `income-${index}`}
              scrollEnabled={false}
              contentContainerStyle={{ marginTop: 10 }}
            />

            {/* Expense Section */}
            <AppText title="Profit and Loss Chart Expense" titleSize={3} titleWeight titleColor={COLORS.WHITE} style={{ marginTop: 20 }} />
            <FlatList
              data={alldata?.data_profit_and_loss_charts_expense}
              renderItem={({ item }) => renderPLCard(item, "expense")}
              keyExtractor={(item, index) => `expense-${index}`}
              scrollEnabled={false}
              contentContainerStyle={{ marginTop: 10 }}
            />
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfitAndLossScreen;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
