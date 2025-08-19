import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import SimpleHeader from '../../../../components/SimpleHeader';
import AlertCards from '../../../../components/AlertCards';
import axios from 'axios';
import BaseUrl from '../../../../utils/BaseUrl';
import {APPCOLORS} from '../../../../utils/APPCOLORS';

const AlertScreen = ({navigation}) => {
  const [AllData, setAllData] = useState();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMoneyData();
    });
    return unsubscribe;
  }, [navigation]);

  const getMoneyData = async () => {
    setLoader(true);
    try {
      const {data} = await axios.get(`${BaseUrl}dash_approval.php`);
      setAllData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <SimpleHeader title="Alerts" />
      {loader && (
        <ActivityIndicator
          size={'large'}
          color={APPCOLORS.BLACK}
          style={{marginTop: 20}}
        />
      )}

      <ScrollView
        contentContainerStyle={{padding: 20, gap: 30}}
        showsVerticalScrollIndicator={false}>
        <AlertCards
          AlertHeading={'Sales Alert'}
          HeadingOne={'Sale auotation'}
          ValueOne={AllData?.approval_data?.quotation_approval}
          onValuePressOne={() =>
            navigation.navigate('ShowUnapprovedDetails', {
              dataDetail: AllData?.data_unapprove_quote,
              type: 'Quotation',
            })
          }
          HeadingTwo={'Sale approval'}
          ValueTwo={AllData?.approval_data?.so_approval}
          onValuePressTwo={() => {
            navigation.navigate('ShowUnapprovedDetails', {
              dataDetail: AllData?.data_unapprove_order,
              type: 'So',
            });
          }}
          HeadingThree={'Sale delivery'}
          ValueThree={AllData?.approval_data?.delivery_approval}
          onValuePressThree={() => {
            navigation.navigate('ShowUnapprovedDetails', {
              dataDetail: AllData?.data_unapprove_deliveries,
              type: 'Delivery',
            });
          }}
        />

        <AlertCards
          data={AllData}
          AlertHeading={'Purchase Alert'}
          HeadingOne={'Grn approval'}
          ValueOne={AllData?.approval_data?.grn_approval}
          HeadingTwo={'Invoice approval'}
          HeadingThree={'Purchase approval'}
          ValueThree={AllData?.approval_data?.po_approval}
          onValuePressThree={() =>
            navigation.navigate('ShowUnapprovedDetails', {
              dataDetail: AllData?.data_unapprove_po_order,
              type: 'Po',
            })
          }
        />

        <AlertCards
          data={AllData}
          AlertHeading={'Inventory Alert'}
          HeadingTwo={'Location transfer'}
          ValueTwo={AllData?.approval_data?.invoice_approval}
        />

        <AlertCards
          data={AllData}
          AlertHeading={'Account Approval'}
          ValueTwo={AllData?.approval_data?.po_invoice_approval}
          HeadingThree={'Voucher approval'}
          ValueThree={AllData?.approval_data?.voucher_approval}
          onValuePressThree={() =>
            navigation.navigate('ShowUnapprovedDetails', {
              dataDetail: AllData?.data_unapprove_voucher,
              type: 'Voucher',
            })
          }
        />
      </ScrollView>
    </View>
  );
};

export default AlertScreen;
