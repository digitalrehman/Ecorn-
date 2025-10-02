import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import BaseUrl from '../../../../utils/BaseUrl';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import AppHeader from '../../../../components/AppHeader';
import SimpleHeader from '../../../../components/SimpleHeader';
import AppText from '../../../../components/AppText';
import AppButton from '../../../../components/AppButton';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

const Ledger = ({navigation, route}) => {
  const {name, item} = route.params;

  const [aging, setAgingData] = useState([]);
  const [opening, setOpening] = useState(0);

  const [fromDate, setFromDate] = useState(new Date());
  const [openFrom, setOpenFrom] = useState(false);

  const [EndDate, setEndDate] = useState(new Date());
  const [openEnd, setOpenEnd] = useState(false);

  const [Laoder, setLoader] = useState(false);

  console.log('EndDate', name, item);

  useEffect(() => {
    const nav = navigation.addListener('focus', () => {
      if (name == 'Customer') {
        getLeger();
      } else if (name == 'Suppliers') {
        getSupplierLeger();
      } else if (name == 'Items') {
        getItemsLedger();
      } else if (name == 'Audit') {
        getAuditLedger();
      }
    });

    return nav;
  }, [navigation]);

  useEffect(() => {
    if (name == 'Customer') {
      getLeger();
    } else if (name == 'Suppliers') {
      getSupplierLeger();
    } else if (name == 'Items') {
      getSupplierLeger();
    } else if (name == 'Banks') {
      getBanksLeger();
    } else if (name == 'Audit') {
      getAuditLedger();
    }
  }, [fromDate, EndDate]);

  const getLeger = () => {
    setLoader(true);

    let data = new FormData();
    data.append('customer_id', item.customer_id);
    data.append(
      'from_date',
      moment(fromDate).subtract('months', 1).format('YYYY-MM-DD'),
    );
    data.append('to_date', moment(EndDate).format('YYYY-MM-DD'));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/dash_cust_ledger.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data.opening));
        setAgingData(response.data.data_cust_age);
        setOpening(response.data.opening);
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  const getSupplierLeger = () => {
    setLoader(true);

    let data = new FormData();
    data.append('supplier_id', item.supplier_id);
    data.append(
      'from_date',
      moment(fromDate).subtract('months', 1).format('YYYY-MM-DD'),
    );
    data.append('to_date', moment(EndDate).format('YYYY-MM-DD'));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/dash_supp_ledger.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log('supplier iss s s', JSON.stringify(response.data));
        setAgingData(response.data.data_cust_age);
        setOpening(response.data.opening);
        setLoader(false);
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };

  const getItemsLedger = () => {
    let data = new FormData();
    data.append('stock_id', item?.stock_id);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/dash_item_ledger.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        setAgingData(response.data.data_cust_age);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getBanksLeger = () => {
    let data = new FormData();
    data.append('id', item?.id);
    data.append(
      'from_date',
      moment(fromDate).subtract('months', 1).format('YYYY-MM-DD'),
    );
    data.append('to_date', moment(EndDate).format('YYYY-MM-DD'));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}/dash_bank_ledger.php`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        setAgingData(response.data.data_bank_ledger);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getAuditLedger = () => {
    let data = new FormData();
    data.append(
      'from_date',
      moment(fromDate).subtract('days', 10).format('YYYY-MM-DD'),
    );
    data.append('to_date', moment(EndDate).format('YYYY-MM-DD'));

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}dash_audit_ledger.php`,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: data,
    };

    axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
                setAgingData(response.data.data_audit_age);

      })
      .catch(error => {
        console.log(error);
      });
  };

 return (
  <LinearGradient
    colors={[APPCOLORS.Primary, APPCOLORS.Secondary, APPCOLORS.BLACK]}
    style={{flex: 1}}>
    {/* Header */}
    <SimpleHeader title="Ledger" />

    <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}>
      {/* Date Filters */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <View style={{gap: 10}}>
          <AppText title="From Date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
          <AppButton
            title={moment(fromDate).subtract('months', 1).format('YYYY-MM-DD')}
            btnWidth={30}
            onPress={() => setOpenFrom(true)}
          />
        </View>

        <View style={{gap: 10}}>
          <AppText title="End Date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
          <AppButton
            title={moment(EndDate).format('YYYY-MM-DD')}
            btnWidth={30}
            onPress={() => setOpenEnd(true)}
          />
        </View>
      </View>

      {Laoder && (
        <ActivityIndicator
          size="large"
          color={APPCOLORS.WHITE}
          style={{marginTop: 20}}
        />
      )}

      {/* Date Pickers */}
      <DatePicker
        modal
        open={openFrom}
        date={new Date()}
        mode="date"
        onConfirm={date => {
          const foramtDate = moment(date).format('YYYY-MM-DD');
          setOpenFrom(false);
          setFromDate(foramtDate);
        }}
        onCancel={() => setOpenFrom(false)}
      />

      <DatePicker
        modal
        open={openEnd}
        date={new Date()}
        mode="date"
        onConfirm={date => {
          const foramtDate = moment(date).format('YYYY-MM-DD');
          setOpenEnd(false);
          setEndDate(foramtDate);
        }}
        onCancel={() => setOpenEnd(false)}
      />

      {/* Opening Balance */}
      {opening && (
        <View
          style={{
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 16,
            marginVertical: 12,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}>
          <AppText title="Opening" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
          <AppText
            title={Number(opening).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            titleSize={2}
            titleWeight
            titleColor={APPCOLORS.WHITE}
          />
        </View>
      )}

      {/* Ledger List */}
      <FlatList
        data={aging}
        contentContainerStyle={{gap: 16, padding: 16}}
        renderItem={({item}) => {
          return (
            <>
              {name == 'Items' ? (
                <View style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="location name" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.location_name} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <AppText title="QOH" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.QOH} titleColor="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              ) : name == 'Banks' ? (
                <View style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Reference" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.reference} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Transaction date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.trans_date} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="debit" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.debit} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="credit" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.credit} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <AppText title="balance" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.balance} titleColor="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              ) : name == 'Audit' ? (
                <View style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.date} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Time" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.time} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Name" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.user_id} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Transaction Date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.trans_date} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Type" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.type} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Reference" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.reference} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Action" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.description} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <AppText title="Amount" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.amount} titleColor="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              ) : (
                <View style={{
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Reference" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.reference} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="Transaction date" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.tran_date} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="debit" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.debit} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <AppText title="credit" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.credit} titleColor="rgba(255,255,255,0.85)" />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <AppText title="balance" titleSize={2} titleWeight titleColor={APPCOLORS.WHITE} />
                    <AppText title={item.balance} titleColor="rgba(255,255,255,0.85)" />
                  </View>
                </View>
              )}
            </>
          );
        }}
      />
    </ScrollView>
  </LinearGradient>
);

};

export default Ledger;
