import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import moment from 'moment';
import SimpleHeader from '../../../../components/SimpleHeader';
import {BASEURL} from '../../../../utils/BaseUrl';

export const APPCOLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#000000',
  Secondary: '#5a5c6a',
  BarColor: '#000000',
  DARKLIGHTBLUE: '#1a1c22',
  HALFWITE: '#a7a8ba',
  BTN_COLOR: '#000000',
  SKY_BLUE: '#5a5c6a',
  CLOSETOWHITE: '#F1FFFA',
  TEXTFIELDCOLOR: '#EBEBEB',
};

const ViewLedger = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [ledgerData, setLedgerData] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASEURL}gl_account_inquiry.php`);
      const json = await response.json();

      if (json.status === 'true' && Array.isArray(json.data)) {
        const grouped = groupByDate(json.data);
        setLedgerData(grouped);
      }
    } catch (error) {
      console.error('Error fetching ledger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByDate = data => {
    const groupedData = {};
    data.forEach(item => {
      const date = item.doc_date;
      if (!groupedData[date]) groupedData[date] = [];
      groupedData[date].push(item);
    });
    return Object.keys(groupedData).map(date => ({
      date,
      transactions: groupedData[date],
    }));
  };

  const renderTransaction = ({item}) => {
    const isCredit = parseFloat(item.amount) > 0;

    return (
      <Animated.View style={[styles.card, {opacity: fadeAnim}]}>
        <View style={{flex: 1}}>
          {/* Reference (Top, Bold) */}
          {item.reference && (
            <Text style={styles.refText}>{item.reference}</Text>
          )}

          {/* Name (Center, Separate Line) */}
          {item.person_name && (
            <Text style={styles.personText}>{item.person_name}</Text>
          )}

          {/* Memo (Bottom, Separate Line) */}
          {item.memo && <Text style={styles.memoText}>{item.memo}</Text>}
        </View>

        {/* Amount on Right */}
        <Text
          style={[
            styles.amountText,
            {color: isCredit ? '#009900' : '#FF0000'},
          ]}>
          {isCredit ? '+' : '-'}
          {Math.abs(item.amount)}
        </Text>
      </Animated.View>
    );
  };

  const renderSection = ({item}) => (
    <View>
      <Text style={styles.dateHeader}>
        {moment(item.date).format('dddd, DD MMM YYYY')}
      </Text>
      {item.transactions.map((tx, index) => (
        <View key={index}>{renderTransaction({item: tx})}</View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={APPCOLORS.BLACK} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={APPCOLORS.WHITE} />
      <SimpleHeader title="View Transactions" />
      <Animated.ScrollView
        style={[styles.container, {opacity: fadeAnim}]}
        showsVerticalScrollIndicator={false}>
        <FlatList
          data={ledgerData}
          renderItem={renderSection}
          keyExtractor={(item, index) => index.toString()}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default ViewLedger;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: APPCOLORS.WHITE,
  },
  container: {
    flex: 1,
    padding: 12,
  },
  dateHeader: {
    fontSize: 15,
    color: APPCOLORS.BLACK,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  card: {
    backgroundColor: APPCOLORS.WHITE,
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
  },
  refText: {
    color: APPCOLORS.BLACK,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  personText: {
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  memoText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    backgroundColor: APPCOLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
