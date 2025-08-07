import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons'
import { APPCOLORS } from '../../../utils/APPCOLORS';
import { BASE_URL_1 } from '../../../utils/BaseUrl';
const TodayOrderDetails = ({route, navigation}) => {
  const {item} = route.params;

  const [TodayOrderDetails, setTodayOrderDetails] = useState();

  useEffect(() => {
    const nav = navigation.addListener('focus', () => {
      getTodayOrderDetails();
    });
    return nav;
  }, [navigation]);

  const getTodayOrderDetails = () => {
    let data = new FormData();
    data.append('order_no', item.order_no);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASE_URL_1}order_details_view.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        setTodayOrderDetails(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <View style={{flex: 1, padding:20}}>

<TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={{textAlign:'center', fontWeight:'bold', fontSize:20}}>Order Detail</Text>
      <FlatList
        data={TodayOrderDetails}
        renderItem={({item}) => {
          console.log('item', item);
          return (
            <View style={{padding: 20, backgroundColor:APPCOLORS.SKY_BLUE, marginTop:20, borderRadius:10}}>
              <Text style={{color: APPCOLORS.BLACK}}>SKU : {item.stk_code}</Text>
              <Text style={{color: APPCOLORS.BLACK}}>Name : {item.description}</Text>
              <Text style={{color: APPCOLORS.BLACK}}>Quantity : {item.quantity}</Text>
              <Text style={{color: APPCOLORS.BLACK}}>Unit Price : {item.unit_price}</Text>
              <Text style={{color: APPCOLORS.BLACK}}>Discount : {item.discount_percent}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default TodayOrderDetails;
