import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {APPCOLORS} from '../../utils/APPCOLORS';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import DashboardTabs from '../../components/DashboardTabs';
import AppText from '../../components/AppText';

import AppHeader from '../../components/AppHeader';
import {AppImages} from '../../assets/images/AppImages';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BaseUrl from '../../utils/BaseUrl';
import axios from 'axios';
import moment from 'moment';
import GetUserAccessData from '../../global/GetUserAccessData';
import {useDispatch, useSelector} from 'react-redux';
import {setUserAccess} from '../../redux/AuthSlice';

const Dashboard = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const userData = useSelector(state => state.Data.currentData);

  const [slider_data, setslider_data] = useState();
  const [AllData, setAllData] = useState();
  const [Type, setType] = useState();

  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const companyData = [
    {
      id: 1,
      name: 'Dashboard',
      icon: 'grid',
      onPress: () => navigation.navigate('Detail'),
    },
    {
      id: 2,
      name: 'Approval',
      icon: 'check-circle',
      onPress: () => navigation.navigate('AlertScreen', {type: 'customer'}),
    },
    {
      id: 3,
      name: 'Sales',
      icon: 'shopping-cart',
      onPress: () => navigation.navigate('SalesScreen'),
    },
    {
      id: 4,
      name: 'Purchase',
      icon: 'shopping-bag',
      onPress: () => navigation.navigate('PurchaseScreen'),
    },
    {
      id: 5,
      name: 'HR & Payroll',
      icon: 'users',
      onPress: () => navigation.navigate('PayrollScreen'),
    },
    {
      id: 6,
      name: 'Inventory',
      icon: 'box',
      onPress: () => navigation.navigate('InventoryScreen'),
    },
    {
      id: 7,
      name: 'Accounts',
      icon: 'dollar-sign',
      onPress: () => navigation.navigate('FinanceScreen'),
    },
    {
      id: 8,
      name: 'Manufactur..',
      icon: 'settings',
      onPress: () => navigation.navigate('ManufacturingScreen'),
    },
    {
      id: 9,
      name: 'CRM',
      icon: 'briefcase',
      onPress: () => navigation.navigate('CrmScreen'),
    },
  ];

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMoneyData();
      getUserAccess();
    });
    return unsubscribe;
  }, [navigation]);

  const getMoneyData = async () => {
    setLoader(true);

    const form = new FormData();
    const currentDate = new Date();
    const todayDate = moment(currentDate).format('YYYY-MM-DD');

    form.append('current_date', todayDate);
    form.append('pre_month_date', '2025-04-19');

    const options = {
      method: 'GET',
      url: `${BaseUrl}dashboard_view.php`,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: form,
    };

    try {
      const {data} = await axios.request(options);

      setslider_data(data?.slider_data);
      setAllData(data);
      setLoader(false);
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const getUserAccess = async () => {
    const res = await GetUserAccessData(userData.id);

    dispatch(setUserAccess(res.data));
  };
  return (
    <View style={{flex: 1, backgroundColor: APPCOLORS.LIGHTGRAY}}>
      <AppHeader
        title={'Dashboard'}
        onPress={res => {
          setVisible(true), setType(res);
        }}
      />
      <ScrollView
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}>
        <Modal isVisible={visible}>
          <View
            style={{
              height: responsiveHeight(70),
              width: responsiveWidth(90),
              backgroundColor: APPCOLORS.WHITE,
              borderRadius: 20,
              padding: 20,
            }}>
            <LinearGradient
              colors={['#1D4452', '#4199B8']}
              style={{
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 25,
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <AntDesign
                  name={'close'}
                  color={APPCOLORS.WHITE}
                  size={responsiveFontSize(2)}
                />
              </TouchableOpacity>

              <AppText
                title={
                  Type == 'bell'
                    ? 'Outstanding Receipt'
                    : Type == 'mail'
                    ? 'Outstanding Payment'
                    : Type == 'chat'
                    ? 'Outstanding Cheque'
                    : null
                }
                titleColor={APPCOLORS.WHITE}
                titleSize={2}
                titleWeight
              />

              <View />
            </LinearGradient>

            <FlatList
              data={
                Type == 'bell'
                  ? AllData?.data_outstanding_receipt
                  : Type == 'mail'
                  ? AllData?.data_outstanding_payments
                  : Type == 'chat'
                  ? AllData?.data_outstanding_cheque
                  : null
              }
              contentContainerStyle={{
                gap: 10,
                marginTop: 10,
                paddingBottom: 100,
              }}
              renderItem={({item}) => {
                return (
                  <View
                    style={{
                      padding: 20,
                      width: responsiveWidth(80),
                      backgroundColor: APPCOLORS.DARKLIGHTBLUE,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <AppText
                        title={'Name'}
                        titleColor={APPCOLORS.WHITE}
                        titleWeight
                        titleSize={2}
                        titleSizeWeight={40}
                      />
                      <AppText
                        title={item?.name}
                        titleColor={APPCOLORS.WHITE}
                        titleWeight
                        titleSize={1.7}
                        titleSizeWeight={40}
                      />
                    </View>

                    <View>
                      <AppText
                        title={'Amount'}
                        titleColor={APPCOLORS.WHITE}
                        titleWeight
                        titleSize={2}
                      />
                      <AppText
                        title={Math.round(
                          JSON.parse(item?.total),
                        ).toLocaleString()}
                        titleColor={APPCOLORS.WHITE}
                        titleWeight
                        titleSize={1.8}
                      />
                    </View>
                  </View>
                );
              }}
            />

            <View></View>
          </View>
        </Modal>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
            marginTop: 20,
          }}>
          {companyData.map(item => (
            <DashboardTabs
              key={item.id}
              icon={item.icon}
              name={item.name}
              onPress={item.onPress}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: responsiveWidth(90),
            alignSelf: 'center',
            gap: 5,
            marginTop: 20,
          }}>
          <Image
            source={AppImages.speak}
            style={{
              height: responsiveHeight(2),
              width: responsiveHeight(2),
              resizeMode: 'contain',
            }}
          />
          <AppText
            title="Announcement"
            titleSize={2.5}
            titleColor={APPCOLORS.BLACK}
            titleWeight
          />
        </View>

        <FlatList
          data={companyData}
          horizontal
          contentContainerStyle={{gap: 20, paddingLeft: 10, marginTop: 10}}
          renderItem={({item}) => {
            return (
              <LinearGradient
                colors={[APPCOLORS.Primary, APPCOLORS.Secondary]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  height: responsiveHeight(20),
                  width: responsiveWidth(80),
                  backgroundColor: APPCOLORS.BarColor,
                  borderRadius: 10,
                  padding: 20,
                  gap: 20,
                }}>
                <AppText
                  title="🎉 New Feature Release"
                  titleColor={APPCOLORS.WHITE}
                  titleSize={2}
                  titleWeight
                />
                <View style={{width: responsiveWidth(60)}}>
                  <AppText
                    title='Inventory tracking has been enhanced! Check it out under the "Warehouse" module.'
                    titleColor={APPCOLORS.WHITE}
                    titleSize={1.7}
                  />
                </View>
              </LinearGradient>
            );
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Dashboard;
