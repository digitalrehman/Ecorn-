import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const dropdownOptions = [
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
  {label: 'Option 3', value: '3'},
];

export default function LocationTransfer({navigation}) {
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState('');
  const [memo, setMemo] = useState('');

  const [items, setItems] = useState([]); // table data

  const handleAdd = () => {
    if (!product || !qty) return;

    setItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        product,
        qty,
      },
    ]);

    // reset fields
    setProduct(null);
    setQty('');
  };

  const handleDelete = id => {
    setItems(prev => prev.filter(item => item.id !== id));
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
        <Text style={styles.headerTitle}>Inventory Ajustment</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 100}}>
        {/* Item Adjustments */}
        <Text style={styles.sectionTitle}>Item Adjustments</Text>

        {/* From Location */}
        <Dropdown
          style={styles.dropdown}
          data={dropdownOptions}
          search
          labelField="label"
          valueField="value"
          placeholder="From Location"
          placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          value={fromLocation}
          onChange={item => setFromLocation(item.value)}
        />

        {/* Date + To Location */}
        <View style={{flexDirection: 'row', gap: 12}}>
          {/* Date Picker */}
          <TouchableOpacity
            style={[styles.dropdown, {flex: 1, justifyContent: 'center'}]}
            onPress={() => setShowDate(true)}>
            <Text style={{color: COLORS.WHITE}}>
              {date.toISOString().split('T')[0]}
            </Text>
          </TouchableOpacity>

          {/* To Location */}
          <Dropdown
            style={[styles.dropdown, {flex: 1}]}
            data={dropdownOptions}
            labelField="label"
            valueField="value"
            placeholder="To Location"
            placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
            selectedTextStyle={{color: COLORS.WHITE}}
            itemTextStyle={{color: COLORS.BLACK}}
            value={toLocation}
            onChange={item => setToLocation(item.value)}
          />
        </View>

        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowDate(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Adjustment Detail */}
        <Text style={styles.sectionTitle}>Adjustment Detail</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, {flex: 7}]}>Product</Text>
          <Text style={[styles.tableHeaderText, {flex: 2}]}>Qty</Text>
          <Text style={[styles.tableHeaderText, {flex: 1}]}>Del</Text>
        </View>

        {/* Table Rows */}
        {items.map(row => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={[styles.tableText, {flex: 7}]}>{row.product}</Text>
            <Text style={[styles.tableText, {flex: 2}]}>{row.qty}</Text>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => handleDelete(row.id)}>
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Form to add row */}
        <View style={{flexDirection: 'row', gap: 12, marginTop: 12}}>
          <Dropdown
            style={[styles.dropdown, {flex: 7}]}
            data={dropdownOptions}
            search
            labelField="label"
            valueField="value"
            placeholder="Product"
            placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
            selectedTextStyle={{color: COLORS.WHITE}}
            itemTextStyle={{color: COLORS.BLACK}}
            value={product}
            onChange={item => setProduct(item.value)}
          />
          <TextInput
            style={[styles.textInput, {flex: 2}]}
            placeholder="Qty"
            placeholderTextColor="rgba(255,255,255,0.6)"
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
          />
          <TouchableOpacity
            onPress={handleAdd}
            style={[styles.addBtn, {flex: 1}]}>
            <Ionicons name="add-circle" size={28} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Memo */}
        <TextInput
          style={[
            styles.textInput,
            {height: 100, textAlignVertical: 'top', marginTop: 10},
          ]}
          placeholder="Memo / Description"
          placeholderTextColor="rgba(255,255,255,0.6)"
          multiline
          value={memo}
          onChangeText={setMemo}
        />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={{color: COLORS.WHITE, fontSize: 18}}>
            Process Adjustment
          </Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.WHITE,
    fontWeight: '700',
    marginBlock: 10,
  },
  dropdown: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 7,
  },
  textInput: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: COLORS.WHITE,
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 6,
  },
  tableHeaderText: {
    color: COLORS.WHITE,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  tableText: {
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.Secondary,
    borderRadius: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.Primary,
  },
  submitBtn: {
    height: 56,
    backgroundColor: COLORS.Secondary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
