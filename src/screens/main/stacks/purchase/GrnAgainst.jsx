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
import SimpleHeader from '../../../../components/SimpleHeader';
import * as Animatable from 'react-native-animatable';

const GrnAgainst = ({navigation, route}) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const [supplierList, setSupplierList] = useState([]);

  // 🔹 Fetch supplier, location, and POs on mount
  useEffect(() => {
    fetchCustomers();
    fetchLocations();
    fetchTransactions();
  }, []);

  // 🔹 Refresh when coming back from GRN
  useEffect(() => {
    if (route?.params?.refresh) {
      fetchTransactions();
    }
  }, [route?.params?.refresh]);

  // 🔹 Fetch Suppliers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/suppliers.php',
      );
      if (res.data?.status === 'true') {
        setSupplierList(res.data.data);
        setCustomers(
          res.data.data.map(c => ({
            label: c.name,
            value: c.supplier_id,
          })),
        );
      }
    } catch (err) {
      console.log('Customer API Error:', err);
    }
  };

  // 🔹 Fetch Locations
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

  // 🔹 Fetch Pending POs
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/pending_po.php',
      );

      if (res.data?.status === 'true' && res.data.data?.length > 0) {
        let finalData = res.data.data;

        // Supplier Filter
        if (selectedCustomer) {
          const supplier = supplierList.find(
            s => s.supplier_id?.toString() === selectedCustomer?.toString(),
          );
          if (supplier) {
            finalData = finalData.filter(
              item =>
                item.supplier_id?.toString() ===
                supplier.supplier_id?.toString(),
            );
          }
        }

        // Location Filter
        if (selectedLocation) {
          finalData = finalData.filter(
            item => item.location?.toString() === selectedLocation?.toString(),
          );
        }

        // Date Filter
        if (fromDate && toDate) {
          finalData = finalData.filter(item => {
            if (!item.ord_date) return false;
            const d = new Date(item.ord_date);
            const fromOnly = new Date(
              fromDate.getFullYear(),
              fromDate.getMonth(),
              fromDate.getDate(),
            );
            const toOnly = new Date(
              toDate.getFullYear(),
              toDate.getMonth(),
              toDate.getDate(),
            );
            return d >= fromOnly && d <= toOnly;
          });
        }

        setTransactions(finalData);
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

  // 🔹 Formatters
  const formatDate = dateStr => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB');
  };

  const formatAmount = amt => {
    if (!amt) return '0';
    return parseFloat(amt).toLocaleString();
  };

  // 🔹 Each Row
  const renderItem = ({item, index}) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.row}>
      <Text style={[styles.cell, {flex: 1}]}>
        {item.reference?.slice(0, 6) + '..' || '-'}
      </Text>
      <Text style={[styles.cell, {flex: 1}]}>{formatDate(item.ord_date)}</Text>
      <Text style={[styles.cell, {flex: 1}]}>{formatAmount(item.total)}</Text>
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center'}}
        onPress={() =>
          navigation.navigate('GrnDeliveryNote', {
            orderId: item.order_no,
            personId: item.person_id,
            locCode: item.location,
          })
        }>
        <Icon name="truck-delivery" size={22} color="#1a1c22" />
      </TouchableOpacity>
    </Animatable.View>
  );

  // 🔹 Main UI
  return (
    <View style={styles.container}>
      <SimpleHeader title="GRN Against PO" />

      <View style={styles.filterContainer}>
        {/* Supplier */}
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={customers}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Supplier"
          searchPlaceholder="Search..."
          value={selectedCustomer}
          onChange={item => setSelectedCustomer(item.value)}
        />

        {/* Location */}
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

        {/* Dates + Apply */}
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.morphButton}
            onPress={() => setShowFromPicker(true)}>
            <Text style={styles.dateText}>
              From: {fromDate ? fromDate.toLocaleDateString() : 'Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.morphButton}
            onPress={() => setShowToPicker(true)}>
            <Text style={styles.dateText}>
              To: {toDate ? toDate.toLocaleDateString() : 'Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.morphButton, {backgroundColor: '#1a1c22'}]}
            onPress={fetchTransactions}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Pickers */}
        {showFromPicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowFromPicker(false);
              if (selectedDate) setFromDate(selectedDate);
            }}
          />
        )}
        {showToPicker && (
          <DateTimePicker
            value={toDate || new Date()}
            mode="date"
            display="calendar"
            onChange={(event, selectedDate) => {
              setShowToPicker(false);
              if (selectedDate) setToDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, {flex: 1}]}>Ref</Text>
        <Text style={[styles.headerCell, {flex: 1}]}>Date</Text>
        <Text style={[styles.headerCell, {flex: 1}]}>Amount</Text>
        <Text style={[styles.headerCell, {flex: 1}]}>Action</Text>
      </View>

      {/* Data */}
      {loading ? (
        <ActivityIndicator size="large" color="#1a1c22" />
      ) : transactions.length === 0 ? (
        <View style={{alignItems: 'center', marginTop: 30}}>
          <Icon name="check-circle-outline" size={40} color="#4CAF50" />
          <Text style={{marginTop: 10, color: '#4CAF50', fontWeight: '600'}}>
            All Purchase Orders are completed 🎉
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default GrnAgainst;

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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  morphButton: {
    flex: 1,
    marginHorizontal: 3,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
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
  placeholderStyle: {fontSize: 14, color: '#5a5c6a'},
  selectedTextStyle: {fontSize: 14, color: '#000', fontWeight: '600'},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a1c22',
    padding: 10,
    marginHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  cell: {fontSize: 14, color: '#000', textAlign: 'center'},
});
