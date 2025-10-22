import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {BASEURL} from '../../../utils/BaseUrl';
import { APPCOLORS } from '../../../utils/APPCOLORS';


const SalesmanList = ({navigation}) => {
  const [salesmans, setsalesmans] = useState([]);
  const [loader, setLoader] = useState(true);
  const currentData = useSelector(state => state.Data.currentData);
  useEffect(() => {
    getAllSalesman();
  }, []);



  const getAllSalesman = () => {
    // setLoader(true);
    let data = new FormData();
    data.append('salesman', currentData?.salesman);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BASEURL}salesman.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));

        setsalesmans(response.data.data);
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };
  return (
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back'} size={25} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            color: APPCOLORS.BLACK,
            fontSize: 18,
            marginLeft: 10,
          }}>
          Salesman
        </Text>
      </View>

      {loader == true ? (
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : (
        <FlatList
          data={salesmans}
          renderItem={({item}) => {
            console.log('itemsss', item);

            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SalesmanCustomer', {
                    salesman_code: item.salesman_code,
                  })
                }
                style={{
                  marginTop: 20,
                  backgroundColor: APPCOLORS.WHITE,
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Text style={{fontSize: 20, color: APPCOLORS.BLACK}}>
                  {' '}
                  <Text
                    style={{
                      color: APPCOLORS.BLACK,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    Salesman name:
                  </Text>{' '}
                  {item.salesman_name}
                </Text>

                <Text
                  style={{fontSize: 17, color: APPCOLORS.BLACK, marginTop: 5}}>
                  {' '}
                  <Text
                    style={{
                      color: APPCOLORS.BLACK,
                      fontWeight: 'bold',
                      fontSize: 17,
                    }}>
                    Phone Number :
                  </Text>{' '}
                  {item.salesman_phone}
                </Text>
                {/* <Text style={{fontSize: 16, color: APPCOLORS.BLACK}}>
                {' '}
                <Text style={{color: APPCOLORS.BLACK, fontWeight: 'bold'}}>
                  Name :
                </Text>{' '}
                {item.br_name}
              </Text>
              <Text style={{fontSize: 16, color: APPCOLORS.BLACK}}>
                {' '}
                <Text style={{color: APPCOLORS.BLACK, fontWeight: 'bold'}}>
                  Ref No :
                </Text>{' '}
                {item.branch_ref}
              </Text>
              <Text style={{fontSize: 16, color: APPCOLORS.BLACK}}>
                {' '}
                <Text style={{color: APPCOLORS.BLACK, fontWeight: 'bold'}}>
                  Order Date :
                </Text>{' '}
                {item.ord_date}
              </Text>
              <Text style={{fontSize: 16, color: APPCOLORS.BLACK}}>
                {' '}
                <Text style={{color: APPCOLORS.BLACK, fontWeight: 'bold'}}>
                  Total Amount :
                </Text>{' '}
                {Number(JSON.parse(item.total)).toFixed(2)}
              </Text> */}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default SalesmanList;
