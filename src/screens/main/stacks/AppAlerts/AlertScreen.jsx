import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import SimpleHeader from '../../../../components/SimpleHeader';
import AlertCards from '../../../../components/AlertCards';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlertScreen = ({navigation}) => {
  const [AllData, setAllData] = useState({});
  const [Loading, setLoading] = useState(false);
  const [Refreshing, setRefreshing] = useState(false);

  const CACHE_KEY = 'alert_data_cache';

  useEffect(() => {
    loadCachedData();
    getAllData();
  }, []);

  const loadCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setAllData(JSON.parse(cached));
      }
    } catch (err) {
      console.log('Cache Error:', err);
    }
  };

  const getAllData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/dash_approval.php',
      );

      const newData = res.data?.approval_data || {};
      setAllData(newData);

      // Cache update
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.log('API Error: ', err);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getAllData();
    setRefreshing(false);
  };

  // 🔑 Modules Config
  const moduleGroups = [
    {
      title: 'Sales Alert',
      items: [
        {
          heading: 'Sale Quotation',
          key: 'quotation_approval',
          icon: 'file-alt',
          screen: 'SaleQuotationScreen',
        },
        {
          heading: 'Sale Order',
          key: 'so_approval',
          icon: 'shopping-cart',
          screen: 'SaleOrderScreen',
        },
        {
          heading: 'Delivery Note',
          key: 'delivery_approval',
          icon: 'truck',
          screen: 'SaleDeliveryScreen',
        },
      ],
    },
    {
      title: 'Purchase Alert',
      items: [
        {
          heading: 'Purchase Order',
          key: 'po_approval',
          icon: 'clipboard-list',
          screen: 'PurchaseOrderScreen',
        },
        {
          heading: 'GRN Approval',
          key: 'grn_approval',
          icon: 'check-square',
          screen: 'GrnApprovalScreen',
        },
      ],
    },
    {
      title: 'Inventory Alert',
      items: [
        {
          heading: 'Location Transfer',
          key: 'location_transfer_app',
          icon: 'exchange-alt',
          screen: 'LocationTransferScreen',
        },
      ],
    },
    {
      title: 'Account Approval',
      items: [
        {
          heading: 'Voucher Approval',
          key: 'voucher_approval',
          icon: 'file-invoice-dollar',
          screen: 'VoucherApprovalScreen',
        },
      ],
    },
    {
      title: 'Job Card Approval',
      items: [
        {
          heading: 'Electrical Approval',
          key: 'electrocal_job_cards',
          icon: 'bolt',
          screen: 'ElectricalApprovalScreen',
        },
        {
          heading: 'Mechanical Approval',
          key: 'mechnical_job_cards',
          icon: 'cogs',
          screen: 'MechanicalApprovalScreen',
        },
      ],
    },
  ];

  if (Loading && Object.keys(AllData).length === 0) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={APPCOLORS.Primary} />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SimpleHeader title="Approvals" />
      <ScrollView
        contentContainerStyle={{padding: 15}}
        refreshControl={
          <RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
        }>
        {moduleGroups.map((group, idx) => {
          const props = {
            AlertHeading: group.title,
          };

          group.items.forEach((item, i) => {
            const value = AllData[item.key] ?? 0;

            const commonProps = {
              heading: item.heading,
              value,
              icon: item.icon,
              onPress: () =>
                navigation.navigate('ApprovalListScreen', {
                  listKey: item.key,
                  title: item.heading,
                }),
            };

            if (i === 0) {
              props.HeadingOne = commonProps.heading;
              props.ValueOne = commonProps.value;
              props.IconOne = commonProps.icon;
              props.onValuePressOne = commonProps.onPress;
            }
            if (i === 1) {
              props.HeadingTwo = commonProps.heading;
              props.ValueTwo = commonProps.value;
              props.IconTwo = commonProps.icon;
              props.onValuePressTwo = commonProps.onPress;
            }
            if (i === 2) {
              props.HeadingThree = commonProps.heading;
              props.ValueThree = commonProps.value;
              props.IconThree = commonProps.icon;
              props.onValuePressThree = commonProps.onPress;
            }
          });

          return <AlertCards key={idx} {...props} />;
        })}
      </ScrollView>
    </View>
  );
};

export default AlertScreen;
