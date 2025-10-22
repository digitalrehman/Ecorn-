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
import {saveLargeData, loadLargeData} from '../../../../utils/storage';
import { BASEURL } from '../../../../utils/BaseUrl';
const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const ITEMS_PER_PAGE = 30;

const ViewItem = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');

  // pagination states
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${BASEURL}stock_category.php`,
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const cached = await loadLargeData('itemsCache');
        if (cached && cached.length > 0) {
          setItems(cached);
          setVisibleItems(cached.slice(0, ITEMS_PER_PAGE));
          console.log('Loaded from chunked cache');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${BASEURL}stock_master.php`,
        );

        if (res.data?.status === 'true') {
          setItems(res.data.data);
          setVisibleItems(res.data.data.slice(0, ITEMS_PER_PAGE));

          // Save in chunks
          await saveLargeData('itemsCache', res.data.data);
          console.log('Loaded from API & saved in chunked cache');
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

  // Filtered list (always up to date)
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

  // Reset visible items jab items ya filters change ho
  useEffect(() => {
    if (items.length > 0) {
      setPage(1);
      setVisibleItems(filteredItems.slice(0, ITEMS_PER_PAGE));
    }
  }, [category, searchCode, searchName, items]);

  // Load more items
  const loadMore = () => {
    if (loadingMore) return;

    const total = filteredItems.length;
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    if (start < total) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleItems(prev => [...prev, ...filteredItems.slice(start, end)]);
        setPage(nextPage);
        setLoadingMore(false);
      }, 300);
    }
  };

  const renderCard = ({item}) => {
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
        {/* Edit button removed */}
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
            setPage(1);
            setVisibleItems(items.slice(0, ITEMS_PER_PAGE));
          }}>
          <Ionicons name="close-circle" color={COLORS.WHITE} size={24} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
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
          onChange={item => {
            setCategory(item.value);
            setPage(1);
            setVisibleItems(filteredItems.slice(0, ITEMS_PER_PAGE));
          }}
        />

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Code"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchCode}
            onChangeText={txt => {
              setSearchCode(txt);
              setPage(1);
              setVisibleItems(filteredItems.slice(0, ITEMS_PER_PAGE));
            }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Name"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchName}
            onChangeText={txt => {
              setSearchName(txt);
              setPage(1);
              setVisibleItems(filteredItems.slice(0, ITEMS_PER_PAGE));
            }}
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
          data={visibleItems}
          keyExtractor={(item, index) => item.stock_id || index.toString()}
          renderItem={renderCard}
          contentContainerStyle={{padding: 16, flexGrow: 1}}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons name="alert-circle-outline" size={48} color="gray" />
                <Text style={styles.emptyText}>No items found</Text>
              </View>
            )
          }
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});
