import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import {APPCOLORS} from '../../../utils/APPCOLORS';

const InsertNewCustomerDetail = ({navigation}) => {
  const [CustomerName, setCustomerName] = useState('');
  const [TradeName, setTradeName] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Address, setAddress] = useState('');
  const [NTN, setNTN] = useState('');
  const [CNIC, setCNIC] = useState('');
  const [Taxable, setTaxable] = useState('');
  const [SalesPerson, setSalesPerson] = useState('');
  const [Province, setProvince] = useState('');

  const [POCName, setPOCName] = useState('');
  const [POCContact, setPOCContact] = useState('');
  const [POCEmail, setPOCEmail] = useState('');

  const [value, setValue] = useState('');
  const [areavalue, setAreaValue] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const dropdowndata = [
    {label: 'Normal', value: '1'},
    {label: 'Mart', value: '2'},
    {label: 'Whole Sale', value: '3'},
  ];

  const areaDropdowndata = [
    {label: 'Punjab', value: '1'},
    {label: 'Sindh', value: '2'},
    {label: 'KPK', value: '3'},
  ];

  const renderInput = (placeholder, value, setValue) => (
    <View style={styles.glassInput}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={'#aaa'}
        value={value}
        onChangeText={txt => setValue(txt)}
      />
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.BLACK}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'chevron-back'} color={APPCOLORS.WHITE} size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Customer</Text>
      </View>

      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <ScrollView contentContainerStyle={{padding: 20, gap: 25}}>
          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Customer Information</Text>
            {renderInput('Business Name', CustomerName, setCustomerName)}
            {renderInput('Trade Name', TradeName, setTradeName)}
            {renderInput('Contact No', ContactNo, setContactNo)}
            {renderInput('Address', Address, setAddress)}
            {renderInput('NTN', NTN, setNTN)}
            {renderInput('CNIC', CNIC, setCNIC)}
            {renderInput('Taxable / Non-Taxable', Taxable, setTaxable)}
            {renderInput('Sales Person', SalesPerson, setSalesPerson)}
            {renderInput('Province', Province, setProvince)}
          </View>

          {/* POC Detail */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>POC Detail</Text>
            {renderInput('Name', POCName, setPOCName)}
            {renderInput('Contact No', POCContact, setPOCContact)}
            {renderInput('Email', POCEmail, setPOCEmail)}
          </View>

          {/* Dropdowns */}
          <Dropdown
            style={styles.dropdown}
            data={dropdowndata}
            labelField="label"
            valueField="value"
            placeholder="Select Type"
            placeholderStyle={{color: '#aaa'}}
            value={value}
            onChange={item => setValue(item.value)}
          />

          <Dropdown
            style={styles.dropdown}
            data={areaDropdowndata}
            labelField="label"
            valueField="value"
            placeholder="Select Area"
            placeholderStyle={{color: '#aaa'}}
            value={areavalue}
            onChange={item => setAreaValue(item.value)}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn}>
            <Text style={{color: APPCOLORS.WHITE, fontSize: 18}}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default InsertNewCustomerDetail;

const styles = StyleSheet.create({
  header: {
    backgroundColor: APPCOLORS.Primary,
    height: 80,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: APPCOLORS.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  section: {
    gap: 15,
  },
  sectionHeading: {
    fontSize: 18,
    color: APPCOLORS.WHITE,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  glassInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textInput: {
    height: 50,
    color: APPCOLORS.WHITE,
    fontSize: 16,
  },
  dropdown: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  submitBtn: {
    height: 55,
    backgroundColor: APPCOLORS.Primary,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
