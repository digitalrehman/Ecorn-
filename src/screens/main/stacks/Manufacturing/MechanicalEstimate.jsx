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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import {BASEURL} from '../../../../utils/BaseUrl';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const MechanicalEstimate = ({navigation, route}) => {
  const {job_id, project_id, requisitionid} = route.params || {};

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [selectedItemCode, setSelectedItemCode] = useState(null);
  const [orderQty, setOrderQty] = useState('');
  const [estimatePrice, setEstimatePrice] = useState('');
  const [posting, setPosting] = useState(false);

  // ✂️ truncate helper
  const truncateWords = (text, limit = 6) =>
    !text
      ? ''
      : text.split(' ').slice(0, limit).join(' ') +
        (text.split(' ').length > limit ? '...' : '');

  // 🟩 Fetch estimation list
  const fetchEstimation = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('requisitionid', requisitionid);
      const res = await fetch(`${BASEURL}get_estimation.php`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.status === 'true' && Array.isArray(json.data)) {
        const formatted = json.data.map((item, index) => ({
          id: index + 1,
          item: truncateWords(item.description),
          qty: Number(item.order_quantity || 0),
          price: Number(item.estimate_price || 0),
        }));
        setTableData(formatted);
      }
    } catch (e) {
      console.log('Fetch Estimation Error:', e);
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Fetch & Cache Stock Options
  const fetchStockOptions = async () => {
    setStockLoading(true);
    try {
      // 👀 Try to load from AsyncStorage first
      const cachedData = await AsyncStorage.getItem('cachedStockOptions');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setStockOptions(parsed);
        setStockLoading(false);
        console.log('Loaded stock from cache ✅');
        return; // ✅ Skip API if cached exists
      }

      // Otherwise fetch from API
      const res = await fetch(`${BASEURL}stock_master.php`);
      const json = await res.json();
      if (json.status === 'true' && Array.isArray(json.data)) {
        const formatted = json.data.map(item => ({
          label: item.description,
          value: item.stock_id,
        }));

        setStockOptions(formatted);
        // Save to AsyncStorage for next time
        await AsyncStorage.setItem(
          'cachedStockOptions',
          JSON.stringify(formatted),
        );
        console.log('Stock cached ✅');
      }
    } catch (err) {
      console.log('Fetch Stock Error:', err);
    } finally {
      setStockLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimation();
    fetchStockOptions();
  }, []);

  // 🟩 Submit new estimation
  const handleSubmit = async () => {
    if (!selectedItemCode || !orderQty || !estimatePrice) {
      Toast.show({type: 'error', text1: 'Please fill all fields'});
      return;
    }

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('project_id', project_id);
      formData.append('job_id', job_id);
      formData.append('item_code', selectedItemCode);
      formData.append('order_quantity', orderQty);
      formData.append('estimate_price', estimatePrice);
      formData.append('repeat', 0);

      const res = await fetch(`${BASEURL}post_estimation.php`, {
        method: 'POST',
        body: formData,
      });

      const text = await res.text();
      const match = text.match(/\{.*\}/s);
      const json = match ? JSON.parse(match[0]) : {status: false};

      if (json.status === true || json.status === 'true') {
        Toast.show({type: 'success', text1: 'Estimation Added!'});

        const newItem = stockOptions.find(i => i.value === selectedItemCode);
        const newRow = {
          id: tableData.length + 1,
          item: truncateWords(newItem?.label || ''),
          qty: Number(orderQty),
          price: Number(estimatePrice),
        };
        setTableData(prev => [...prev, newRow]);

        setSelectedItemCode(null);
        setOrderQty('');
        setEstimatePrice('');
      } else {
        Toast.show({type: 'error', text1: 'Failed to add estimation'});
      }
    } catch (err) {
      console.log('Submit Error:', err);
      Toast.show({type: 'error', text1: 'Something went wrong'});
    } finally {
      setPosting(false);
    }
  };

  const renderRow = ({item}) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, {flex: 7}]} numberOfLines={1}>
        {item.item}
      </Text>
      <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
        {item.qty}
      </Text>
      <Text style={[styles.cell, {flex: 2, textAlign: 'center'}]}>
        {item.price}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.WHITE} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mechanical Estimate</Text>
        <View style={{width: 28}} />
      </View>

      {/* Table */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cell, {flex: 7}]}>Item</Text>
        <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>Qty</Text>
        <Text style={[styles.cell, {flex: 2, textAlign: 'center'}]}>
          Est. Price
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.WHITE}
          style={{marginTop: 50}}
        />
      ) : (
        <FlatList
          data={tableData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderRow}
          contentContainerStyle={{paddingBottom: 220}}
        />
      )}

      {/* Fixed Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Add New Estimation</Text>

        <Dropdown
          style={styles.dropdown}
          data={stockOptions}
          labelField="label"
          valueField="value"
          placeholder={stockLoading ? 'Loading items...' : 'Select Item'}
          value={selectedItemCode}
          onChange={item => setSelectedItemCode(item.value)}
          placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          search
          searchPlaceholder="Search item..."
        />

        <View style={styles.rowInputs}>
          <TextInput
            placeholder="Order Qty"
            placeholderTextColor="#ccc"
            value={orderQty}
            onChangeText={setOrderQty}
            keyboardType="numeric"
            style={[styles.input, {flex: 1, marginRight: 8}]}
          />
          <TextInput
            placeholder="Estimate Price"
            placeholderTextColor="#ccc"
            value={estimatePrice}
            onChangeText={setEstimatePrice}
            keyboardType="numeric"
            style={[styles.input, {flex: 1}]}
          />
        </View>

        <TouchableOpacity
          disabled={posting}
          onPress={handleSubmit}
          style={styles.submitBtn}>
          {posting ? (
            <ActivityIndicator color={COLORS.WHITE} />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      <Toast />
    </LinearGradient>
  );
};

export default MechanicalEstimate;

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  tableHeader: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cell: {fontSize: 14, color: COLORS.WHITE},
  formContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  formTitle: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
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
  rowInputs: {flexDirection: 'row', gap: 8},
  input: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: COLORS.WHITE,
  },
  submitBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  submitText: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});
