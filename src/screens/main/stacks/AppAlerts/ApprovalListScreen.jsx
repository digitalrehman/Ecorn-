import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, ScrollView, Text} from 'react-native';
import axios from 'axios';
import SimpleHeader from '../../../../components/SimpleHeader';
import ApprovalCard from './ApprovalCard';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const ApprovalListScreen = ({route}) => {
  const {listKey, title} = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector(state => state.Data.currentData);

  const keyMap = {
    quotation_approval: 'data_unapprove_quote',
    so_approval: 'data_unapprove_order',
    po_approval: 'data_unapprove_po_order',
    grn_approval: 'data_unapprove_grn_order',
    voucher_approval: 'data_unapprove_voucher',
    delivery_approval: 'data_unapprove_deliveries',
    electrocal_job_cards: 'data_electrical_job_cards',
    mechanical_job_cards: 'data_Mechanical_job_cards',
  };

  const CACHE_KEY = `approval_list_${listKey}`;

  useEffect(() => {
    loadCachedData();
    fetchData();
  }, []);

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setData(JSON.parse(cached));
      }
    } catch (err) {
      console.log('Cache Error:', err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/dash_approval.php',
      );

      const mappedKey = keyMap[listKey];
      const newData = res.data?.[mappedKey] || [];

      setData(newData);

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.log('API Error:', err);
    }
    setLoading(false);
  };

  const handleApprove = async item => {
    try {
      const formData = new FormData();
      formData.append('id', currentUser?.user_id);
      formData.append('trans_no', item.trans_no);
      formData.append('type', item.type);
      formData.append('approval', 0);

      const res = await axios.post(
        'https://e.de2solutions.com/mobile_dash/dash_approval_post.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Approve Response:', res.data);

      if (res.data?.status === true) {
        Toast.show({
          type: 'success',
          text1: 'Approved Successfully',
        });

        setData(prev => prev.filter(d => d.trans_no !== item.trans_no));
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Approval Failed',
          text2: res.data?.message || 'Something went wrong',
        });
      }
    } catch (err) {
      console.log('Approve Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Network or Server error',
      });
    }
  };

  if (loading && data.length === 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={APPCOLORS.Primary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.Secondary}}>
      <SimpleHeader title={title || 'Approvals'} />
      <ScrollView contentContainerStyle={{padding: 15, flexGrow: 1}}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <ApprovalCard
              key={index}
              reference={item.reference}
              ord_date={item.ord_date}
              name={item.name}
              total={item.total}
              onApprove={() => handleApprove(item)}
            />
          ))
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
            <Icon name="database-off" size={80} color={APPCOLORS.WHITE} />
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                fontSize: 18,
                fontWeight: 'bold',
                color: APPCOLORS.WHITE,
              }}>
              No Data Available
            </Text>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 14,
                color: APPCOLORS.WHITE,
                paddingHorizontal: 20,
              }}>
              There are no records pending for approval in this module.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ApprovalListScreen;
