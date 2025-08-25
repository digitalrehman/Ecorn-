// TransactionTableScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleHeader from '../../../../components/SimpleHeader';
import { APPCOLORS } from '../../../../utils/APPCOLORS';

export default function VoucherScreen ({ navigation }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (dateFilter?: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/dash_upload.php'
      );
      let result = res.data?.data_cust_age || [];

      if (dateFilter) {
        result = result.filter((item: any) => item.tran_date === dateFilter);
      }
      setData(result);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
    setLoading(false);
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formatted = date.toISOString().split('T')[0]; // yyyy-mm-dd
      setSelectedDate(date);
      fetchData(formatted);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <SimpleHeader title="Transactions" />

      {/* Date Filter */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Icon name="calendar" size={18} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6 }}>
          {selectedDate ? selectedDate.toDateString() : 'Filter by Date'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="calendar"
          onChange={onDateChange}
        />
      )}

      {/* Table */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={APPCOLORS.Secondary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={[0]} // fix header
          ListHeaderComponent={
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerText, { flex: 1.5 }]}>
                Date
              </Text>
              <Text
                style={[
                  styles.cell,
                  styles.headerText,
                  { flex: 1, textAlign: 'right' },
                ]}
              >
                Amount
              </Text>
              <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>
                Trans No
              </Text>
              <Text style={[styles.cell, styles.headerText, { flex: 0.8 }]}>
                Type
              </Text>
              <Text style={[styles.cell, styles.headerText, { flex: 1 }]}>
                Action
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 1.5 }]}>{item.tran_date}</Text>
              <Text style={[styles.cell, { flex: 1, textAlign: 'right' }]}>
                {item.amount}
              </Text>
              <Text style={[styles.cell, { flex: 1 }]}>{item.trans_no}</Text>
              <Text style={[styles.cell, { flex: 0.8 }]}>{item.type}</Text>
             <TouchableOpacity
  onPress={() =>
    navigation.navigate('UploadScreen', {
      transactionType: item.type, 
      transactionNo: item.trans_no, 
    })
  }>
  <Icon name="paperclip" size={20} color="#00ff99" />
</TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APPCOLORS.Primary },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APPCOLORS.Secondary,
    padding: 10,
    margin: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: APPCOLORS.Secondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerRow: {
    backgroundColor: APPCOLORS.BLACK,
  },
  cell: {
    color: '#fff',
    fontSize: 14,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
