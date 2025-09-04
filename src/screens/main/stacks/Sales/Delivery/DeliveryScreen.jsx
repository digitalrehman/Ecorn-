import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import SimpleHeader from '../../../../../components/SimpleHeader';
import * as Animatable from 'react-native-animatable';

const DeliveryScreen = ({navigation}) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchCustomers();
    fetchLocations();
    fetchTransactions(); // default load
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/debtors_master.php',
      );
      if (res.data?.status === 'true') {
        setCustomers(
          res.data.data.map(c => ({
            label: c.name,
            value: c.debtor_no,
          })),
        );
      }
    } catch (err) {
      console.log('Customer API Error:', err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/locations.php',
      );
      if (res.data?.status === 'true') {
        setLocations(
          res.data.data.map(l => ({
            label: l.location_name,
            value: l.loc_code,
          })),
        );
      }
    } catch (err) {
      console.log('Location API Error:', err);
    }
  };

  const fetchTransactions = async () => {
  try {
    setLoading(true);

    const params = {};
    if (selectedCustomer) params.customer = selectedCustomer;
    if (selectedLocation) params.location = selectedLocation;

    const res = await axios.get(
      'https://e.de2solutions.com/mobile_dash/dash_upload.php',
      { params },
    );

    if (res.data?.status_cust_age === 'true') {
      let allData = res.data.data_cust_age || [];

      // Get last month range
      const now = new Date();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Filter only last month data
      const filtered = allData.filter(item => {
        if (!item.tran_date) return false;
        const d = new Date(item.tran_date);
        return d >= firstDayLastMonth && d <= lastDayLastMonth;
      });

      setTransactions(filtered);
    } else {
      setTransactions([]);
    }
  } catch (err) {
    console.log('Transactions API Error:', err);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
};


  const formatDate = dateStr => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB');
  };

  const formatAmount = amt => {
    if (!amt) return '0';
    return parseFloat(amt).toLocaleString();
  };

  const renderItem = ({item, index}) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.row}>
      <Text style={styles.cell}>{item.ref || '-'}</Text>
      <Text style={styles.cell}>{formatDate(item.date)}</Text>
      <Text style={styles.cell}>{formatAmount(item.amount)}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('DeliveryDetail', {data: item})}>
        <Icon name="truck-delivery" size={24} color="#1a1c22" />
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={styles.container}>
      <SimpleHeader title="Delivery" />

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* From Date */}
        <TouchableOpacity
          style={styles.morphButton}
          onPress={() => setShowFromPicker(true)}>
          <Text style={styles.dateText}>
            From: {fromDate ? fromDate.toLocaleDateString() : 'Select Date'}
          </Text>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate || new Date()} // ✅ fallback
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }}
          />
        )}

        {/* To Date */}
        <TouchableOpacity
          style={styles.morphButton}
          onPress={() => setShowToPicker(true)}>
          <Text style={styles.dateText}>
            To: {toDate ? toDate.toLocaleDateString() : 'Select Date'}
          </Text>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate || new Date()} // ✅ fallback
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }}
          />
        )}

        {/* Customer Dropdown */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={customers}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Customer"
          searchPlaceholder="Search..."
          value={selectedCustomer}
          onChange={item => setSelectedCustomer(item.value)}
        />

        {/* Location Dropdown */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={locations}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Location"
          searchPlaceholder="Search..."
          value={selectedLocation}
          onChange={item => setSelectedLocation(item.value)}
        />

        <TouchableOpacity style={styles.applyBtn} onPress={fetchTransactions}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      {loading ? (
        <ActivityIndicator size="large" color="#1a1c22" />
      ) : transactions.length === 0 ? (
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Icon name="file-alert" size={40} color="#5a5c6a" />
          <Text style={{marginTop: 10, color: '#5a5c6a'}}>
            No Transactions Found
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default DeliveryScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#e0e0e0'},
  filterContainer: {
    padding: 15,
    margin: 12,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  morphButton: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  dateText: {color: '#000', fontWeight: '600'},
  dropdown: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#5a5c6a',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#1a1c22',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cell: {flex: 1, fontSize: 14, color: '#000'},
});
