import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal'

import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_1 } from '../../../utils/BaseUrl';
import { APPCOLORS } from '../../../utils/APPCOLORS';

const Visit = ({navigation, route}) => {
  const {data} = route.params;

  console.log('data', data);
  const CurrentUser = useSelector(state => state.Data.currentData);
  const [Txt, setTxt] = useState('');
  const [loader, setLoader] = useState(false);
  const [selectedItem, setItem] = useState("data_loc")
  const [allData, setAllData] = useState([])
  const [isModal, setModal] = useState(false)
  const dataarr = [
    {name: "data_loc"},
    {name: "data_supp"},
    {name: "data_bank"},
    {name: "data_cash_bank"},
    {name: "data_accts"},
    {name: "data_visit"},
    {name: "data_cust_cat"},

  ]
  const date = Date.now();
  const formattedDate = moment(date).format('YYYY-MM-DD');
  console.log(formattedDate);

  const today = moment().format('dddd');

  useEffect(()=>{
    const nav  = navigation.addListener('focus',()=>{

      getAllData()
    })

    return nav
  },[ navigation])

  const getAllData =async (i ) => {

    const localdata = await AsyncStorage.getItem("VisitData")
    setAllData(JSON.parse(localdata))
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL_1}all_data.php`,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => { 
      console.log("data_supp",selectedItem)

      console.log("allData[selectedItem]",response.data[i ])
      setAllData(response.data.data_visit)
      
      AsyncStorage.setItem("VisitData", JSON.stringify(response.data.data_visit))

      setModal(true)
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  const visitDone = (item) => {
    setLoader(true);
    NetInfo.fetch().then(async state => {
      if (!state.isConnected) {
        let datas = new FormData();
        datas.append('customer_id', data?.debtor_no);
        datas.append('date', formattedDate);
        datas.append('memo', item.id);
        datas.append('user_id', CurrentUser?.id);
        datas.append('loc_code', `'${CurrentUser.loc_code}'`);
        datas.append('salesman', CurrentUser?.salesman);
        datas.append('dim_id', CurrentUser?.dim_id);
        
        await saveToAsyncStorage(datas);
        Toast.show({
          type: 'info',
          text1: 'No internet, visit saved offline!',
        });

        setLoader(false);

      }else{
        
        let datas = new FormData();
        datas.append('customer_id', data?.debtor_no);
        datas.append('date', formattedDate);
        datas.append('memo', item.id);
        datas.append('user_id', CurrentUser?.id);
        datas.append('loc_code', `'${CurrentUser.loc_code}'`);
        datas.append('salesman', CurrentUser?.salesman);
        datas.append('dim_id', CurrentUser?.dim_id);
    
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${BASE_URL_1}debtors_feedback_post.php`,
          headers: {
            'content-type': 'multipart/form-data',
          },
          data: datas,
        };

        axios
          .request(config)
          .then(response => {
            console.log(JSON.stringify(response.data));
            Toast.show({
              type: 'success',
              text1: 'Submitted Successfully!',
            });
            setLoader(false);
          })
          .catch(error => {
            console.log(error);
            setLoader(false);
          });
      }
    })




  
  };


  const saveToAsyncStorage = async (data) => {
    try {
      // Retrieve existing offline visits
      const storedData = await AsyncStorage.getItem('offlineVisits');
      let offlineVisits = storedData ? JSON.parse(storedData) : [];
  
      // Function to compare two FormData objects by their key-value pairs
      const isSameData = (storedData, newData) => {
        for (let key of Array.from(newData.keys())) {
          if (newData.get(key) !== storedData.get(key)) {
            return false; // If any value is different, return false
          }
        }
        return true; // All values are the same
      };
  
      // Check if any object in offlineVisits has identical data
      const isAlreadyExist = offlineVisits.some(visit => isSameData(visit, data));
  
      if (!isAlreadyExist) {
        // If not exist, push the new data
        offlineVisits.push(data);
        await AsyncStorage.setItem('offlineVisits', JSON.stringify(offlineVisits));
        console.log("Visit saved offline");
      } else {
        console.log("Visit with identical data already exists in offline storage");
      }
  
    } catch (error) {
      console.error("Error saving to AsyncStorage", error);
    }
  };

  
  // const saveToAsyncStorage = async (data) => {
  //   try {
  //     const storedData = await AsyncStorage.getItem('offlineVisits');
  //     let offlineVisits = storedData ? JSON.parse(storedData) : [];
  //     offlineVisits.push(data);
  //     await AsyncStorage.setItem('offlineVisits', JSON.stringify(offlineVisits));
  //   } catch (error) {
  //     console.error("Error saving to AsyncStorage", error);
  //   }
  // };
  


  return (
    <View>
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

        <View
          style={{
            height: 40,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{color: APPCOLORS.WHITE, fontSize: 22, fontWeight: 'bold'}}>
            Visit
          </Text>
        </View>

        <View style={{width: 20}} />
      </View>

      <View style={{padding: 20}}>

          <FlatList
          data={allData}
          renderItem={({item, index})=>{
            console.log("item", item)
            return(
              <TouchableOpacity onPress={()=> {visitDone(item)}} key={index} style={{height:50, backgroundColor:'white', marginTop:10, justifyContent:'center', paddingHorizontal:20}}>
                    <Text style={{fontSize:18, fontWeight:'bold', color:APPCOLORS.BLACK}}>{item.template}</Text>
              </TouchableOpacity>
            )
          }}
          />
        {/* {loader == true ? (
          <View
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              backgroundColor: APPCOLORS.BTN_COLOR,
              borderRadius: 20,
            }}>
            <ActivityIndicator size={'large'} color={'white'} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => visitDone()}
            style={{
              padding: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              backgroundColor: APPCOLORS.BTN_COLOR,
              borderRadius: 20,
            }}>
            <Text style={{color: APPCOLORS.WHITE, fontSize: 18}}>
              Visit Done
            </Text>
          </TouchableOpacity>
        )} */}
      </View>

      <Modal isVisible={loader} style={{alignItems:'center', justifyContent:'center'}}>
        <ActivityIndicator size={'large'} color={'white'}/>
        {/* <View style={{backgroundColor:APPCOLORS.WHITE, height:'100%', width:'100%', borderRadius:10}}>
          <TouchableOpacity style={{  padding:20 }} onPress={()=> setModal(false)}>
          <Text style={{color:APPCOLORS.BLACK, fontSize:20, fontWeight:'bold'}}>Close</Text>
          </TouchableOpacity>
          {
            allData?.length > 0 ?
            
            <FlatList
            data={allData}
            renderItem={({item})=>{
              console.log("item....,.,.,.,.,.,.,.,.,.,.", item)
              return(
                <TouchableOpacity style={{height:50,  width:'90%', marginTop:10, justifyContent:'center', paddingHorizontal:20, borderWidth:1, alignSelf:'center', borderRadius:10}}>
                      <Text style={{color:APPCOLORS.BLACK}}>{item.loc_code}</Text>

                </TouchableOpacity>
              )
            }}
            />
            :
            null
          }
        </View> */}
      </Modal>
    </View>
  );
};

export default Visit;
