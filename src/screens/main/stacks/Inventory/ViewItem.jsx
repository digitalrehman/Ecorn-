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
import {BASEURL} from '../../../../utils/BaseUrl';

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

  // Pagination
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASEURL}stock_category.php`);
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
    fetchItems(); // initial fetch (empty filters)
  }, []);

  // 🔹 Fetch Items via POST API
  const fetchItems = async (filters = {}) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('stock_id', filters.stock_id || '');
      formData.append('description', filters.description || '');
      formData.append('category_id', filters.category_id || '');

      const res = await axios.post(
        'https://ercon.de2solutions.com/mobile_dash/search_items.php',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      if (res.data?.status === 'true' && Array.isArray(res.data.data)) {
        setItems(res.data.data);
        setVisibleItems(res.data.data.slice(0, ITEMS_PER_PAGE));
      } else {
        setItems([]);
        setVisibleItems([]);
      }
    } catch (err) {
      console.log('❌ Fetch Error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Apply Filter
  const handleApplyFilter = () => {
    const filters = {
      stock_id: searchCode.trim(),
      description: searchName.trim(),
      category_id: category || '',
    };
    fetchItems(filters);
  };

  // 🔹 Load more (pagination)
  const loadMore = () => {
    if (loadingMore) return;
    const total = items.length;
    const nextPage = page + 1;
    const start = (nextPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    if (start < total) {
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleItems(prev => [...prev, ...items.slice(start, end)]);
        setPage(nextPage);
        setLoadingMore(false);
      }, 300);
    }
  };

  // 🔹 Render each card
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
            fetchItems(); // reset filter
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
          onChange={item => setCategory(item.value)}
          search
          searchPlaceholder="Search category..."
        />

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Code"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchCode}
            onChangeText={txt => setSearchCode(txt)}
          />
        </View>

        <View style={[styles.searchRow, {alignItems: 'center', marginTop: 12}]}>
          <TextInput
            style={[styles.searchInput, {flex: 0.75}]}
            placeholder="Search by Name"
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchName}
            onChangeText={txt => setSearchName(txt)}
          />
          <TouchableOpacity
            onPress={handleApplyFilter}
            style={styles.applyButton}>
            <Text style={{color: COLORS.WHITE, fontWeight: '700'}}>Apply</Text>
          </TouchableOpacity>
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
  applyButton: {
    height: 48,
    flex: 0.25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
