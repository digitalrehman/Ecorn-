import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
// import {setLoader} from '../../redux/AuthSlice';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import { BASE_URL_1 } from '../../../utils/BaseUrl';
import { APPCOLORS } from '../../../utils/APPCOLORS';
const InsertNewCustomerDetail = ({navigation, route}) => {
  const userData = useSelector(state => state.Data.currentData);

  const isLoader = useSelector(state => state.Data.Loading);


  const {allCustomer} = route.params;

  console.log('loc_code', userData.loc_code);
  console.log('dim_id', userData.dim_id);
  console.log('salesman', userData.salesman);

  const [CustomerName, setCustomerName] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Address, setAddress] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState('1');

  const [areavalue, setAreaValue] = useState('');
  const [areaLabel, setAreaLable] = useState('');
  const [areaLoader, setAreaLoader] = useState(false);
  const [isAreaFocus, setIsAreaFocus] = useState(false);
  const [Areadropdowndata, setAreadropdowndata] = useState([]);
  const [dropdownData, setDropdownData] = useState([]);

  console.log('areavalue', areavalue);
  console.log('userData', userData.role_id);
  useEffect(() => {
    GetArea();
  }, []);

  const dropdowndata = [
    {label: 'Normal', value: '1'},
    {label: 'Mart', value: '2'},
    {label: 'Whole Sale', value: '3'},
  ];

  //   const Areadropdowndata = [
  //     {label: 'Normal', value: '1'},
  //     {label: 'Mart', value: '2'},
  //     {label: 'Whole Sale', value: '3'},
  //   ];

  const dispatch = useDispatch();

  const AddNewCustomer = async () => {
    const alreadyExist = allCustomer.some(
      debtor => debtor.debtor_ref === PhoneNumber,
    );

    console.log('alreaduExust', alreadyExist);

    if (alreadyExist) {
      Toast.show({
        type: 'error',
        text1: 'This phone number is already exist',
      });

      return;
    }

    const OfflineUser = {
      CustName: CustomerName,
      cust_ref: PhoneNumber,
      address: Address,
    };

    console.log('first', OfflineUser);

    await AsyncStorage.setItem('setOfflineUser', JSON.stringify(OfflineUser));

    // dispatch(setLoader(true));
    if (!CustomerName) {
      // dispatch(setLoader(false));
      Toast.show({
        type: 'error',
        text1: 'Customer Name is required',
      });
    } else if (!PhoneNumber) {
      // dispatch(setLoader(false));
      Toast.show({
        type: 'error',
        text1: 'Phone Number Name is required',
      });
    } else if (!Address) {
      // dispatch(setLoader(false));

      Toast.show({
        type: 'error',
        text1: 'Address is required',
      });
    } else {
      let data = new FormData();
      data.append('CustName', CustomerName);
      data.append('cust_ref', PhoneNumber);
      data.append('address', Address);
      data.append('user_id', userData?.id);
      data.append('loc_code', userData?.loc_code);
      data.append('dim_id', userData?.dim_id);
      data.append('salesman', userData?.salesman);
      data.append('area_code', areavalue);
      data.append('group_no', value);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL_1}debtors_master_post.php`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      };

      axios
        .request(config)
        .then(async response => {
          console.log(JSON.stringify(response.data));
          Toast.show({
            type: 'success',
            text1: 'Successfully created new customer',
          });
          setCustomerName('');
          setPhoneNumber('');
          setAddress('');
          // dispatch(setLoader(false));
          await AsyncStorage.removeItem('setOfflineUser');
        })
        .catch(error => {
          console.log(error);
          // dispatch(setLoader(false));
        });
    }
  };

  const SyncOffline = async () => {
    const getOfflineSyncUser = await AsyncStorage.getItem('setOfflineUser');

    if (getOfflineSyncUser) {
      const getOfflineData = JSON.parse(getOfflineSyncUser);

      setCustomerName(getOfflineData.CustName);
      setPhoneNumber(getOfflineData.cust_ref);
      setAddress(getOfflineData.address);

      console.log('first', getOfflineData);
    } else {
      Toast.show({
        type: 'error',
        text1: 'No User Found',
      });
    }
  };

  const GetArea = () => {
    setAreaLoader(true);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL_1}area.php`,
      headers: {},
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        setAreadropdowndata(response.data.data);
        setAreaLoader(false);
      })
      .catch(error => {
        setAreaLoader(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (Areadropdowndata.length > 0) {
      const formattedData = Areadropdowndata?.map(item => ({
        label: item.description, // description will be shown in the dropdown
        value: item.area_code, // area_code will be used as the value
      }));

      console.log('formatedData', formattedData);
      setDropdownData(formattedData);
    }
  }, [Areadropdowndata]);

  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.SKY_BLUE}}>
      <View
        style={{
          backgroundColor: APPCOLORS.BTN_COLOR,
          height: 90,
          borderBottomEndRadius: 20,
          borderBottomLeftRadius: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'chevron-back'} color={APPCOLORS.WHITE} size={30} />
        </TouchableOpacity>

        <Text style={{color: APPCOLORS.WHITE, fontSize: 20}}>Add Customer</Text>

        <TouchableOpacity onPress={() => SyncOffline()}>
          <Text style={{color: 'white'}}>Get Offline</Text>
        </TouchableOpacity>
      </View>

      <View style={{padding: 20}}>
        <TextInput
          style={{
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginTop: 10,
            color:'black',
          }}
          placeholder="Customer Name"
          onChangeText={txt => {
            setCustomerName(txt);
          }}
          value={CustomerName}
        />

        <TextInput
          style={{
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginTop: 10,
            color:'black',
          }}
          placeholder="Phone Number"
          onChangeText={txt => {
            setPhoneNumber(txt);
          }}
          value={PhoneNumber}
        />

        <TextInput
          style={{
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginTop: 10,
            color:'black',
          }}
          placeholder="Address"
          onChangeText={txt => {
            setAddress(txt);
          }}
          value={Address}
        />
        {userData.role_id == 16 ? null : (
          <Dropdown
            style={[
              styles.dropdown,
              isFocus && {
                borderColor: APPCOLORS.WHITE,
                backgroundColor: APPCOLORS.WHITE,
              },
            ]}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropdowndata}
            search={false}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
            }}
            placeholder="Select Type"
            placeholderStyle={{color: APPCOLORS.BLACK}}
            activeColor={APPCOLORS.SECONDARY_COLOR}
          />
        )}

        {userData.role_id == 16 ? null : (
          <>
            {areaLoader == true ? (
              <ActivityIndicator size={'large'} color={'white'} />
            ) : (
              <Dropdown
                style={[
                  styles.dropdown,
                  isAreaFocus && {
                    borderColor: APPCOLORS.WHITE,
                    backgroundColor: APPCOLORS.WHITE,
                  },
                ]}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={dropdownData}
                search={true}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={areavalue}
                onFocus={() => setIsAreaFocus(true)}
                onBlur={() => setIsAreaFocus(false)}
                onChange={item => {
                  setAreaValue(item.value);
                  setAreaLable(item.label);
                  setIsAreaFocus(false);
                }}
                placeholder="Select Type"
                placeholderStyle={{color: APPCOLORS.BLACK}}
                activeColor={APPCOLORS.SECONDARY_COLOR}
              />
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => AddNewCustomer()}
          style={{
            height: 60,
            backgroundColor: APPCOLORS.BTN_COLOR,
            marginTop: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isLoader == true ? (
            <ActivityIndicator size={'large'} color={'white'} />
          ) : (
            <Text
              style={{
                color: APPCOLORS.WHITE,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InsertNewCustomerDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: APPCOLORS.WHITE,
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: APPCOLORS.WHITE,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: APPCOLORS.WHITE,
    color: APPCOLORS.BLACK,
    marginTop: 20,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: APPCOLORS.BLACK,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: APPCOLORS.BLACK,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
