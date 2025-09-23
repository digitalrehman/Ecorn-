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

// Temporary dropdown data
const dropdownOptions = [
  {label: 'Option 1', value: '1'},
  {label: 'Option 2', value: '2'},
  {label: 'Option 3', value: '3'},
];

export default function MechanicalProduce({navigation}) {
  const [saleOrder, setSaleOrder] = useState('');
  const [item, setItem] = useState('');
  const [allItem, setAllItem] = useState(null);
  const [reference, setReference] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [type, setType] = useState(null);
  const [qty, setQty] = useState('');
  const [memo, setMemo] = useState('');

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.WHITE} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mechanical Produce</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 100}}>
        {/* Sale Order No */}
        <TextInput
          style={styles.textInput}
          placeholder="Sale Order No"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={saleOrder}
          onChangeText={setSaleOrder}
        />

        {/* Item */}
        <TextInput
          style={styles.textInput}
          placeholder="Item"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={item}
          onChangeText={setItem}
        />

        {/* All Item (Dropdown) */}
        <Dropdown
          style={styles.dropdown}
          data={dropdownOptions}
          labelField="label"
          valueField="value"
          placeholder="All Item"
          placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          value={allItem}
          onChange={val => setAllItem(val.value)}
        />

        {/* Reference */}
        <TextInput
          style={styles.textInput}
          placeholder="Reference"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={reference}
          onChangeText={setReference}
        />

        {/* Date Picker */}
        <TouchableOpacity
          style={[styles.textInput, {justifyContent: 'center'}]}
          onPress={() => setShowDate(true)}>
          <Text style={{color: COLORS.WHITE}}>
            {date.toISOString().split('T')[0]}
          </Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowDate(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Type (Dropdown) */}
        <Dropdown
          style={styles.dropdown}
          data={dropdownOptions}
          labelField="label"
          valueField="value"
          placeholder="Type"
          placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
          selectedTextStyle={{color: COLORS.WHITE}}
          itemTextStyle={{color: COLORS.BLACK}}
          value={type}
          onChange={val => setType(val.value)}
        />

        {/* Quantity */}
        <TextInput
          style={styles.textInput}
          placeholder="Quantity"
          placeholderTextColor="rgba(255,255,255,0.6)"
          keyboardType="numeric"
          value={qty}
          onChangeText={setQty}
        />

        {/* Memo / Description */}
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
          <Text style={{color: COLORS.WHITE, fontSize: 18}}>Process</Text>
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
  textInput: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: COLORS.WHITE,
    fontSize: 16,
    marginBottom: 10,
  },
  dropdown: {
    height: 52,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
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
