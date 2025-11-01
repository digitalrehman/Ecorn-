import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import {BASEURL} from '../../../../utils/BaseUrl';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const ElectricalJobCardsScreen = ({navigation}) => {
  const [allData, setAllData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationMap, setLocationMap] = useState({});
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  // 📌 Format date dd/mm/yy
  const formatDate = d => {
    const date = new Date(d);
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1,
    ).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  // 📌 Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASEURL}electrical_job_cards.php`);
      if (res.data?.status === 'true') {
        const rows = res.data.data;
        setAllData(rows);

        // 🔹 bas last 30 records lo
        const last30 = rows.slice(-30);
        setFiltered(last30);
      }
    } catch (err) {
      console.log('Fetch Error:', err);
      Alert.alert('Error', 'Failed to load job cards');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASEURL}locations.php`);
      if (res.data?.status === 'true') {
        const formatted = res.data.data.map(loc => ({
          label: loc.location_name,
          value: loc.loc_code,
        }));
        setLocations(formatted);

        // map bana lo (quick lookup ke liye)
        const map = {};
        res.data.data.forEach(loc => {
          map[loc.loc_code] = loc.location_name;
        });
        setLocationMap(map);
      }
    } catch (err) {
      console.log('Location fetch error:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLocations();
  }, []);

  // 📌 Apply filter button
  const applyFilter = () => {
    let rows = [...allData];

    // location filter
    if (selectedLocation) {
      rows = rows.filter(r => r.location === selectedLocation);
    }

    // date filter
    if (fromDate && toDate) {
      rows = rows.filter(r => {
        const d = new Date(r.bulk_entry_date);
        return d >= fromDate && d <= toDate;
      });
    }

    setFiltered(rows.slice(-30));
  };

  // 📌 Render table row
  const renderRow = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.reference}</Text>
      <Text style={styles.cell}>{formatDate(item.bulk_entry_date)}</Text>

      {/* 🔹 Order No column = Location name */}
      <Text style={styles.cell}>{locationMap[item.location] || item.ref}</Text>

      <Text style={styles.cell}>{item.entry_by}</Text>
      <View
        style={[
          styles.cell,
          {flexDirection: 'row', justifyContent: 'space-around'},
        ]}>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() =>
            navigation.navigate('MechanicalEstimate', {
              job_id: item.job_id,
              project_id: item.sale_order,
              requisitionid: item.requisitionid,
            })
          }>
          <Ionicons name="document-text-outline" size={22} color="#4cafef" />
          <Text style={{color: COLORS.WHITE, fontSize: 8}}>Estimate</Text>
        </TouchableOpacity>

        {/* 🔹 Produce Icon */}
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() =>
            navigation.navigate('MechanicalProduce', {
              sales_order: item.sale_order,
            })
          }>
          <Ionicons name="hammer-outline" size={22} color="#ff9800" />
          <Text style={{color: COLORS.WHITE, fontSize: 8}}>Produce</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Electrical Job Cards</Text>
        <TouchableOpacity onPress={fetchData}>
          <Ionicons name="refresh" size={22} color={COLORS.WHITE} />
        </TouchableOpacity>
      </View>

      {/* 📍 Location Dropdown */}
      <View style={{paddingHorizontal: 16, marginBottom: 12}}>
        <Dropdown
          style={styles.dropdown}
          data={locations}
          search
          searchPlaceholder="Search location..."
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Location"
          placeholderStyle={{color: '#aaa'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          value={selectedLocation}
          onChange={item => setSelectedLocation(item.value)}
        />
      </View>

      {/* 📅 From Date - To Date - Apply button */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowFromPicker(true)}>
          <Text style={styles.dateText}>
            {fromDate ? formatDate(fromDate) : 'From Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowToPicker(true)}>
          <Text style={styles.dateText}>
            {toDate ? formatDate(toDate) : 'To Date'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={applyFilter}>
          <Text style={{color: COLORS.WHITE, fontWeight: '600'}}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* 📅 Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowFromPicker(false);
            if (date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowToPicker(false);
            if (date) setToDate(date);
          }}
        />
      )}

      {/* Table Header */}
      <View style={[styles.row, {backgroundColor: 'rgba(255,255,255,0.1)'}]}>
        <Text style={styles.headerCell}>Ref</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Order No</Text>
        <Text style={styles.headerCell}>User</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>

      {/* Table Data */}
      {loading ? (
        <ActivityIndicator color={COLORS.WHITE} style={{marginTop: 20}} />
      ) : filtered.length === 0 ? (
        <View style={styles.noDataBox}>
          <Ionicons name="alert-circle" size={40} color="#ccc" />
          <Text style={styles.noDataText}>No Data Found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderRow}
          keyExtractor={(item, idx) => item.id + idx}
        />
      )}
    </LinearGradient>
  );
};

export default ElectricalJobCardsScreen;

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {color: COLORS.WHITE, fontSize: 18, fontWeight: '700'},
  dropdown: {
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  dateBtn: {
    flex: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dateText: {color: COLORS.WHITE, textAlign: 'center'},
  applyBtn: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: COLORS.Primary, // theme color
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.3,
    borderColor: '#555',
  },
  cell: {flex: 1, color: COLORS.WHITE, fontSize: 13},
  headerCell: {flex: 1, color: '#ddd', fontWeight: '700', fontSize: 13},
  noDataBox: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
});
