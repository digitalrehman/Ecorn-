import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import LinearGradient from 'react-native-linear-gradient';

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

export default function AddItem({navigation}) {
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [taxType, setTaxType] = useState(null);
  const [itemType, setItemType] = useState('');
  const [unit, setUnit] = useState(null);
  const [saleType, setSaleType] = useState(null);
  const [price, setPrice] = useState('');

  // Animation setup
  const animValues = useRef([]).current;
  const fieldCount = 7;
  if (animValues.length === 0) {
    for (let i = 0; i < fieldCount; i++) {
      animValues.push({
        translateY: new Animated.Value(20),
        opacity: new Animated.Value(0),
      });
    }
  }

  useEffect(() => {
    const anims = animValues.map((av, idx) =>
      Animated.parallel([
        Animated.timing(av.translateY, {
          toValue: 0,
          duration: 400,
          delay: idx * 80,
          useNativeDriver: true,
        }),
        Animated.timing(av.opacity, {
          toValue: 1,
          duration: 400,
          delay: idx * 80,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.stagger(80, anims).start();
  }, []);

  const renderDropdown = (index, placeholder, value, setValue) => (
    <Animated.View
      style={[
        styles.glassInput,
        {
          transform: [{translateY: animValues[index].translateY}],
          opacity: animValues[index].opacity,
        },
      ]}>
      <Dropdown
        style={styles.dropdown}
        data={dropdownOptions}
        search
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        placeholderStyle={{color: 'rgba(255,255,255,0.6)'}}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => setValue(item.value)}
      />
    </Animated.View>
  );

  const renderInput = (
    index,
    placeholder,
    value,
    setValue,
    keyboardType = 'default',
  ) => (
    <Animated.View
      style={[
        styles.glassInput,
        {
          transform: [{translateY: animValues[index].translateY}],
          opacity: animValues[index].opacity,
        },
      ]}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={'rgba(255,255,255,0.6)'}
        value={value}
        onChangeText={setValue}
        keyboardType={keyboardType}
      />
    </Animated.View>
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
        <Text style={styles.headerTitle}>Add Item</Text>
        <View style={{width: 28}} /> {/* right side spacer */}
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={{padding: 20, gap: 16}}>
        {renderDropdown(0, 'Select Category', category, setCategory)}
        {renderInput(1, 'Name', name, setName)}
        {renderDropdown(2, 'Select Item Tax Type', taxType, setTaxType)}
        {renderInput(3, 'Item Type', itemType, setItemType)}
        {renderDropdown(4, 'Units of Measure', unit, setUnit)}
        {renderDropdown(5, 'Sale Type', saleType, setSaleType)}
        {renderInput(6, 'Price', price, setPrice, 'numeric')}

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={{color: COLORS.WHITE, fontSize: 18}}>Submit</Text>
        </TouchableOpacity>
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
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 56,
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
  },
  submitBtn: {
    height: 56,
    backgroundColor: COLORS.Primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
