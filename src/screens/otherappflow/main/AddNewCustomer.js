import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Linking,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addEventListener} from '@react-native-community/netinfo';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {BASE_URL_1} from '../../../utils/BaseUrl';
import Toast from 'react-native-toast-message';
import {APPCOLORS} from '../../../utils/APPCOLORS';
import {responsiveWidth} from '../../../utils/Responsive';
const AddNewCustomer = ({navigation}) => {
  const CurrentUser = useSelector(state => state.Data.currentData);
  const day = moment().format('dddd');
  const [page, setPage] = useState(0);
  const [loadermore, setLoadMore] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  const [offlineSyncLoader, setOfflineSyncLoader] = useState(false);

  const [AllOrders, setAllOrders] = useState([]);

  const [Loader, setLoader] = useState(true);
  const [Search, setSearch] = useState('');
  const [selectedType, setselectedType] = useState(0);

  // Subscribe
  useEffect(() => {
    const unsubscribe = addEventListener(async state => {
      console.log('Connection type', state.type);

      console.log('Is connected?', state.isConnected);

      if (state.isConnected === false) {
        const getAllProducts = await AsyncStorage.getItem('GetAllCustomers');
        console.log('getAllProducts', getAllProducts);

        setAllOrders(JSON.parse(getAllProducts));
      } else {
        console.log('Connection type', state.isConnected);
      }
    });
    // Unsubscribe
    unsubscribe();
  }, []);
  useEffect(() => {
    if (shouldReload || AllOrders.length === 0) {
      getAllOrders();
      setShouldReload(false); // reset flag
    }
  }, [shouldReload, AllOrders.length]);

  const filteredOrders = AllOrders?.filter(val => {
    const itemNameLowerCase = val.debtor_ref.toLowerCase();
    if (Search === '') {
      return val;
    } else if (itemNameLowerCase?.includes(Search.toLowerCase())) {
      return val;
    }
  }).slice(0, 50);

  const getAllOrders = async (num = 0) => {
    setLoader(true);
    setAllOrders([]);
    setPage(0);
    let datas = new FormData();
    datas.append('dim_id', CurrentUser?.dim_id);
    datas.append('area_code', CurrentUser?.area_code);
    datas.append('role_id', CurrentUser?.role_id);
    datas.append('week_day', day);
    datas.append('customer_status', num);
    datas.append('page', page);

    let configs = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL_1}debtors_master.php`,
      // url: `${BASE_URL_1}suppliers.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: datas,
    };

    axios
      .request(configs)
      .then(async response => {
        setAllOrders(prevData => {
          // API se aya hua data reverse karo
          const newData = [...response.data.data].reverse();

          const allOrders = [...newData, ...prevData]; // latest top per
          const uniqueOrders = allOrders.filter(
            (order, index, self) =>
              index === self.findIndex(o => o.debtor_ref === order.debtor_ref),
          );

          return uniqueOrders.slice(0, 50); // sirf 50 latest
        });

        setLoadMore(false);
        setPage(prevPage => prevPage + 1);

        await AsyncStorage.setItem(
          'GetAllCustomers',
          JSON.stringify(response?.data?.data),
        );
        setLoader(false);
      })

      .catch(async error => {
        console.log(error);

        setLoadMore(false);
        const getAllProducts = await AsyncStorage.getItem('GetAllCustomers');
        setAllOrders(JSON.parse(getAllProducts));
      });
  };

  const loaderMoreData = async (num = 0) => {
    setLoadMore(true);
    let datas = new FormData();
    datas.append('dim_id', CurrentUser?.dim_id);
    datas.append('area_code', CurrentUser?.area_code);
    datas.append('role_id', CurrentUser?.role_id);
    datas.append('week_day', day);
    datas.append('customer_status', num);
    datas.append('page', page);

    let configs = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL_1}debtors_master.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: datas,
    };

    axios
      .request(configs)
      .then(async response => {
        setAllOrders(prevData => {
          const newData = [...response.data.data].reverse();

          const allOrders = [...prevData, ...newData]; // naya data neeche add
          const uniqueOrders = allOrders.filter(
            (order, index, self) =>
              index === self.findIndex(o => o.debtor_ref === order.debtor_ref),
          );

          return uniqueOrders.slice(0, 50);
        });

        setLoadMore(false);
        setPage(prevPage => prevPage + 1);

        await AsyncStorage.setItem(
          'GetAllCustomers',
          JSON.stringify(response?.data?.data),
        );
      })

      .catch(async error => {
        console.log(error);
        setLoader(false);
        setLoadMore(false);

        const getAllProducts = await AsyncStorage.getItem('GetAllCustomers');
        setAllOrders(JSON.parse(getAllProducts));
      });
  };

  const processStoredVisits = async () => {
    setOfflineSyncLoader(true);
    try {
      const storedData = await AsyncStorage.getItem('offlineVisits');
      if (storedData == null) {
        Toast.show({
          type: 'success',
          text1: 'No offline submit found!',
        });
        setOfflineSyncLoader(false);
        return;
      }

      let offlineVisits = storedData ? JSON.parse(storedData) : [];

      for (let visit of offlineVisits) {
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${BASE_URL_1}debtors_feedback_post.php`,
          headers: {
            'content-type': 'multipart/form-data',
          },
          data: visit,
        };

        try {
          const response = await axios.request(config);
          console.log('Offline visit submitted:', response.data);
        } catch (error) {
          console.log('Error submitting offline visit:', error);
          return; // Stop further execution if there's an error
        }
      }

      // If all visits are submitted successfully, clear the stored data
      await AsyncStorage.removeItem('offlineVisits');
      Toast.show({
        type: 'success',
        text1: 'All offline visits submitted successfully!',
      });
      setOfflineSyncLoader(false);
    } catch (error) {
      setOfflineSyncLoader(false);
      console.error('Error processing stored visits:', error);
    }
  };

  const openGoogleMaps = addr => {
    const url = `https://www.google.com/maps/search/?api=1&query=${addr}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.BLACK}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
          backgroundColor: APPCOLORS.BLACK,
        }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: 45,
            width: 45,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            backgroundColor: '#E0E5EC',
            shadowColor: '#000',
            shadowOffset: {width: 5, height: 5},
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
            borderWidth: 1,
            borderColor: '#f9f9f9',
          }}>
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Search Bar */}
        <LinearGradient
          colors={['#000000', '#434343']} // black gradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '75%',
            height: 45,
            borderRadius: 15,
            paddingHorizontal: 12,
            shadowColor: '#000',
            shadowOffset: {width: 3, height: 3},
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}>
          <Ionicons
            name="search"
            size={20}
            color="#fff"
            style={{marginRight: 8}}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#aaa"
            style={{
              flex: 1,
              fontSize: 16,
              color: '#fff',
            }}
            onChangeText={txt => setSearch(txt)}
            value={Search}
          />
        </LinearGradient>
      </View>

      {/* {console.log('filteredOrders.............', filteredOrders.length)} */}
      {Loader == true ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <LottieView
            source={require('../../../assets/images/Loader.json')}
            style={{height: 250, width: 250, alignSelf: 'center'}}
            autoPlay
            loop
          />
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          {loadermore == true ? (
            <View
              style={{
                position: 'absolute',
                zIndex: 100,
                alignSelf: 'center',
                borderRadius: 2000,
              }}>
              <ActivityIndicator
                size={'large'}
                color={'white'}
                style={{alignSelf: 'center'}}
              />
            </View>
          ) : null}

          <>
            {filteredOrders?.length > 0 ? (
              <FlatList
                data={filteredOrders}
                onEndReached={() => {
                  loaderMoreData(selectedType);
                }}
                onEndReachedThreshold={1}
                renderItem={({item, index}) => {
                  return (
                    <LinearGradient
                      colors={[
                        APPCOLORS.Primary,
                        APPCOLORS.Secondary,
                        APPCOLORS.BLACK,
                      ]}
                      style={{
                        borderRadius: 15,
                        marginVertical: 8,
                        padding: 15,
                        width: responsiveWidth(90),
                        alignSelf: 'center',
                      }}>
                      {/* Business Name */}
                      <View style={styles.row}>
                        <Text style={styles.label}>1. Business Name</Text>
                        <Text style={styles.value}>{item?.name}</Text>
                      </View>

                      {/* Address */}
                      <View style={styles.row}>
                        <Text style={styles.label}>2. Address</Text>
                        <Text style={styles.value} numberOfLines={1}>
                          {item?.address || 'N/A'}
                        </Text>
                      </View>

                      {/* NTN */}
                      <View style={styles.row}>
                        <Text style={styles.label}>3. NTN</Text>
                        <Text style={styles.value}>
                          {item?.ntn_id || 'N/A'}
                        </Text>
                      </View>

                      {/* POC Name */}
                      <View style={styles.row}>
                        <Text style={styles.label}>4. POC Name</Text>
                        <Text style={styles.value}>
                          {item?.poc_name || 'N/A'}
                        </Text>
                      </View>

                      {/* Contact No */}
                      <View style={styles.row}>
                        <Text style={styles.label}>5. Contact No</Text>
                        <Text style={styles.value}>
                          {item?.contact_no || 'N/A'}
                        </Text>
                      </View>
                    </LinearGradient>
                  );
                }}
              />
            ) : (
              <Text style={{color: APPCOLORS.BLACK, fontSize: 20}}>
                No Record Found
              </Text>
            )}
          </>
        </View>
      )}

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('InsertNewCustomerDetail', {
            allCustomer: AllOrders,
            onSuccess: () => setShouldReload(true),
          })
        }
        style={{
          backgroundColor: 'red',
          height: 50,
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LinearGradient
          colors={[APPCOLORS.BLACK, APPCOLORS.Secondary, APPCOLORS.BLACK]}
          style={{
            height: 50,
            width: '100%',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
          }}>
          <Text
            style={{color: APPCOLORS.WHITE, fontSize: 20, fontWeight: 'bold'}}>
            Add new customer
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewCustomer;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: APPCOLORS.WHITE,
    fontWeight: 'bold',
  },
  value: {
    color: APPCOLORS.WHITE,
    maxWidth: '60%',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    height: 45,
    borderRadius: 15,
    paddingHorizontal: 12,
    backgroundColor: '#E0E5EC', // soft gray background

    // Shadows for Neumorphism
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,

    // Light shadow (for top-left effect)
    borderWidth: 1,
    borderColor: '#f9f9f9',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
