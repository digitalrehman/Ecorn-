import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const ViewItem = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          'https://e.de2solutions.com/mobile_dash/stock_category.php',
        );
        if (res.data?.status === 'true') {
          const mapped = res.data.data.map(c => ({
            label: c.description,
            value: c.category_id,
          }));
          setCategories(mapped);
        }
      } catch (err) {
        console.log('Category Fetch Error:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          'https://e.de2solutions.com/mobile_dash/stock_master.php',
        );
        if (res.data?.status === 'true') {
          setItems(res.data.data);
        } else {
          console.log('API Error:', res.data);
        }
      } catch (err) {
        console.log('Item Fetch Error:', err);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  // Filtered list
  const filteredItems = items.filter(it => {
    const matchCategory = category ? it.category_id === category : true;
    const matchCode = searchCode
      ? it.stock_id?.toLowerCase().includes(searchCode.toLowerCase())
      : true;
    const matchName = searchName
      ? it.description?.toLowerCase().includes(searchName.toLowerCase())
      : true;
    return matchCategory && matchCode && matchName;
  });

  const renderCard = ({item}) => {
    // category name lookup
    const catName =
      categories.find(c => c.value === item.category_id)?.label || '-';

    return (
      <View style={styles.card}>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Description:</Text>
          <Text style={styles.kvValue}>{item.description}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Stock ID:</Text>
          <Text style={styles.kvValue}>{item.stock_id}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Category:</Text>
          <Text style={styles.kvValue}>{catName}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Tax Type:</Text>
          <Text style={styles.kvValue}>{item.tax_type_name || '-'}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Item Type:</Text>
          <Text style={styles.kvValue}>{item.cat_name || '-'}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Unit:</Text>
          <Text style={styles.kvValue}>{item.units || '-'}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>Price:</Text>
          <Text style={styles.kvValue}>{item.price || '-'}</Text>
        </View>
        <View style={styles.kvRow}>
          <Text style={styles.kvKey}>QOH:</Text>
          <Text style={styles.kvValue}>{item.qoh || '-'}</Text>
        </View>

        {/* Edit button */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AddItem', {item})}>
          <Ionicons name="create-outline" color={COLORS.WHITE} size={18} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.WHITE} size={28} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>View Items</Text>

        <TouchableOpacity
          onPress={() => {
            setCategory(null);
            setSearchCode('');
            setSearchName('');
          }}>
          <Ionicons name="close-circle" color={COLORS.WHITE} size={24} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {/* Category Dropdown */}
        <Dropdown
          style={styles.dropdown}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          value={category}
          onChange={item => setCategory(item.value)}
        />

        {/* Search Inputs */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Code"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchCode}
            onChangeText={setSearchCode}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchName}
            onChangeText={setSearchName}
          />
        </View>
      </View>

      {/* Loader or Cards */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.WHITE}
          style={{marginTop: 30}}
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item, index) => item.stock_id || index.toString()}
          renderItem={renderCard}
          contentContainerStyle={{padding: 16}}
        />
      )}
    </LinearGradient>
  );
};

export default ViewItem;

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  filterContainer: {
    padding: 16,
  },
  dropdown: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: COLORS.WHITE,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kvKey: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  kvValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  editBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.Secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    marginLeft: 6,
    color: COLORS.WHITE,
    fontSize: 13,
    fontWeight: '600',
  },
});
