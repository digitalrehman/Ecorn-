import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import SelectDropdown from 'react-native-select-dropdown'; // 👈 searchable dropdown

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const MechanicalEstimate = ({navigation}) => {
  const [items, setItems] = useState([]); // API dropdown data
  const [loading, setLoading] = useState(false);

  // table data (initial dummy)
  const [tableData, setTableData] = useState([
    {id: 1, item: 'Bolt M12', qty: 10, price: 500},
    {id: 2, item: 'Nut M10', qty: 25, price: 200},
  ]);

  // form fields
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  // Fetch dropdown data
  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://e.de2solutions.com/mobile_dash/stock_master.php',
        );
        const json = await res.json();
        if (json.status === 'true') {
          setItems(json.data);
        }
      } catch (err) {
        console.log('Dropdown Fetch Error:', err);
      }
      setLoading(false);
    };
    fetchStock();
  }, []);

  // Add new row
  const handleAdd = () => {
    if (!selectedItem || !qty || !price) return;

    const newRow = {
      id: Date.now(),
      item: selectedItem.long_description,
      stock_id: selectedItem.stock_id,
      qty: Number(qty),
      price: Number(price),
    };

    setTableData(prev => [...prev, newRow]);
    setSelectedItem(null);
    setQty('');
    setPrice('');
  };

  const renderRow = ({item}) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, {flex: 8}]} numberOfLines={1}>
        {item.item}
      </Text>
      <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
        {item.qty}
      </Text>
      <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
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
        <View style={{width: 28}} /> {/* spacer */}
      </View>

      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cell, {flex: 8}]}>Item</Text>
        <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
          Qty
        </Text>
        <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
          Est. Price
        </Text>
      </View>

      {/* Table Data */}
      <FlatList
        data={tableData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderRow}
        contentContainerStyle={{paddingBottom: 100}}
      />

      {/* Form */}
      <View style={styles.form}>
        {loading ? (
          <ActivityIndicator color={COLORS.WHITE} />
        ) : (
          <SelectDropdown
            data={items}
            defaultButtonText="Select Item"
            onSelect={(selected) => setSelectedItem(selected)}
            buttonTextAfterSelection={(selected) => selected.long_description}
            rowTextForSelection={(item) => item.long_description}
            buttonStyle={styles.dropdownBtn}
            buttonTextStyle={{color: COLORS.WHITE}}
            dropdownStyle={{backgroundColor: COLORS.Secondary}}
          />
        )}

        <TextInput
          placeholder="Qty"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
          style={styles.input}
        />
        <TextInput
          placeholder="Est. Price"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />

        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={{color: COLORS.WHITE, fontWeight: '600'}}>Add</Text>
        </TouchableOpacity>
      </View>
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
  cell: {
    fontSize: 14,
    color: COLORS.WHITE,
  },
  form: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 6,
    color: COLORS.WHITE,
  },
  dropdownBtn: {
    width: '100%',
    height: 45,
    backgroundColor: COLORS.Secondary,
    borderRadius: 8,
    marginBottom: 8,
  },
  addBtn: {
    marginTop: 8,
    backgroundColor: COLORS.Secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
