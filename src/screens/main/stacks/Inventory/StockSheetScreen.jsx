import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { BASEURL } from '../../../../utils/BaseUrl';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

export default function StockSheetScreen({navigation}) {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Locations
  useEffect(() => {
    fetchData(
      `${BASEURL}locations.php`,
      setLocations,
      'loc_code',
      'location_name',
    );
  }, []);

  // Fetch Categories
  useEffect(() => {
    fetchData(
      `${BASEURL}stock_category.php`,
      setCategories,
      'category_id',
      'description',
    );
  }, []);

  const fetchData = async (url, setState, valueField, labelField) => {
    try {
      setLoading(true);
      const {data} = await axios.get(url);
      if (data?.status === 'true' && Array.isArray(data.data)) {
        const mapped = data.data.map(item => ({
          label: item[labelField],
          value: item[valueField],
        }));
        setState(mapped);
      }
    } catch (error) {
      console.error('Error fetching:', url, error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setLocation(null);
    setCategory(null);
  };

  // Temporary random table data
  const tableData = [
    {id: 1, description: 'Copper Wire', unit: 'Roll', qty: 50},
    {id: 2, description: 'PVC Pipe', unit: 'Meter', qty: 200},
    {id: 3, description: 'Switch Board', unit: 'PCS', qty: 75},
  ];

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.WHITE} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Sheet</Text>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={{color: COLORS.WHITE, fontSize: 14}}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{padding: 16}}>
        {/* Search Bar */}
        <View style={styles.glassInput}>
          <TextInput
            style={styles.textInput}
            placeholder="Search Item Name"
            placeholderTextColor={'rgba(255,255,255,0.6)'}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Dropdowns Row */}
        <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
          {/* Location */}
          <Dropdown
            style={[styles.dropdown, {flex: 1}]}
            data={locations}
            search
            labelField="label"
            valueField="value"
            placeholder="Select Location"
            placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
            selectedTextStyle={{color: COLORS.WHITE}}
            itemTextStyle={{color: COLORS.BLACK}}
            value={location}
            onChange={item => setLocation(item.value)}
          />

          {/* Category */}
          <Dropdown
            style={[styles.dropdown, {flex: 1}]}
            data={categories}
            search
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
            selectedTextStyle={{color: COLORS.WHITE}}
            itemTextStyle={{color: COLORS.BLACK}}
            value={category}
            onChange={item => setCategory(item.value)}
          />
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, {flex: 6, textAlign: 'left'}]}>Description</Text>
          <Text style={[styles.tableHeaderText, {flex: 2, textAlign: 'left'}]}>Unit</Text>
          <Text style={[styles.tableHeaderText, {flex: 2, textAlign: 'right'}]}>Qty</Text>
        </View>

        {/* Table Rows */}
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.WHITE} style={{marginTop: 20}} />
        ) : (
          tableData.map(row => (
            <View key={row.id} style={styles.tableRow}>
              <Text style={[styles.tableText, {flex: 6, textAlign: 'left'}]}>{row.description}</Text>
              <Text style={[styles.tableText, {flex: 2, textAlign: 'left'}]}>{row.unit}</Text>
              <Text style={[styles.tableText, {flex: 2, textAlign: 'right'}]}>{row.qty}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {color: '#fff', fontSize: 20, fontWeight: '700'},
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textInput: {
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  tableHeaderText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  tableText: {
    color: COLORS.WHITE,
    textAlign: 'center',
  },
});
