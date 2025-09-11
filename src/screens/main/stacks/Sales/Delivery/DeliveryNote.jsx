import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import SimpleHeader from '../../../../../components/SimpleHeader';

const DeliveryNote = ({route}) => {
  const navigation = useNavigation();
  const {orderId, personId, locCode} = route.params || {};

  const [driverName, setDriverName] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // loader state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let formData = new FormData();
        formData.append('order_no', orderId);

        const res = await axios.post(
          'https://e.de2solutions.com/mobile_dash/pending_so_item.php',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'text',
          },
        );

        let raw = res.data.trim();
        let jsonStr = raw.substring(raw.indexOf('{'));

        let parsed;
        try {
          parsed = JSON.parse(jsonStr);
        } catch (e) {
          console.log('JSON parse error:', e, raw);
          ToastAndroid.show('Invalid API response!', ToastAndroid.LONG);
          return;
        }

        if (
          parsed?.status?.toString().toLowerCase() === 'true' &&
          Array.isArray(parsed.data)
        ) {
          const mapped = parsed.data.map((item, index) => ({
            id: String(item.id ?? index + 1),
            stk_code: item.stk_code,
            description: item.text7 ?? '',
            quantity: parseInt(item.quantity) || 0,
            deliveredQty: '',
            unit_price: item.unit_price,
            error: '',
          }));
          setItems(mapped);
        } else {
          ToastAndroid.show('No pending items found!', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.log('Error fetching items:', error);
        ToastAndroid.show('Failed to load delivery items!', ToastAndroid.LONG);
      }
    };

    fetchItems();
  }, [orderId]);

  const updateItem = (id, field, value) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? {...item, [field]: value} : item)),
    );
  };

  const handleDeliveredChange = (id, text, maxQty) => {
    let errorMsg = '';
    if (text && parseInt(text) > maxQty) {
      errorMsg = `Cannot exceed ${maxQty}`;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, deliveredQty: text, error: errorMsg} : item,
      ),
    );
  };

  const handleSubmit = async () => {
    const invalid = items.some(item => item.error);
    if (invalid) {
      ToastAndroid.show('Fix validation errors first!', ToastAndroid.LONG);
      return;
    }

    try {
      setLoading(true);

      const today = new Date();
      const orderDate = today.toISOString().slice(0, 10); // "2025-09-11"

      // Calculate grand total
      let grandTotal = 0;
      const purchOrderDetails = items.map(itm => {
        const qty = parseFloat(itm.deliveredQty) || 0;
        const price = parseFloat(itm.unit_price) || 0;
        const lineTotal = qty * price;
        grandTotal += lineTotal;

        return {
          item_code: String(itm.stk_code ?? ''),
          description: String(itm.description ?? ''),
          del_qty: String(qty),
          text7: String(itm.description ?? ''),
          unit_price: String(price),
        };
      });

      let formData = new FormData();
      formData.append('order_no', String(orderId));
      formData.append('person_id', String(personId));
      formData.append('trans_type', String(13));
      formData.append('ord_date', String(orderDate));
      formData.append('driver_name', String(driverName));
      formData.append('vehicle_no', String(vehicleName));
      formData.append('loc_code', String(locCode));
      formData.append('total', String(grandTotal.toFixed(2)));

      formData.append('purch_order_details', JSON.stringify(purchOrderDetails));

      const res = await axios.post(
        'https://e.de2solutions.com/mobile_dash/post_service_purch_sale.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      ToastAndroid.show('Delivery Note submitted!', ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {
      console.log('Submit Error:', error);
      ToastAndroid.show('Failed to submit delivery note!', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleHeader title="Delivery Note" />
      <View style={styles.container}>
        {/* Row: Driver + Vehicle */}
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Driver Name"
            placeholderTextColor="#aaa"
            value={driverName}
            onChangeText={setDriverName}
          />
          <TextInput
            style={styles.input}
            placeholder="Vehicle No"
            placeholderTextColor="#aaa"
            value={vehicleName}
            onChangeText={setVehicleName}
          />
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Delivery Items</Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, {flex: 3}]}>Description</Text>
          <Text style={[styles.headerText, {flex: 0.8}]}>Qty</Text>
          <Text style={[styles.headerText, {flex: 0.6}]}>Delv.</Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={{marginBottom: 8}}>
              <View style={styles.tableRow}>
                {/* Description (editable) */}
                <TextInput
                  style={[
                    styles.cell,
                    styles.inputCell,
                    {flex: 3, minHeight: 40},
                  ]}
                  placeholder="Enter desc"
                  placeholderTextColor="#aaa"
                  value={item.description}
                  onChangeText={text =>
                    updateItem(item.id, 'description', text)
                  }
                  multiline={true}
                  textAlignVertical="top"
                />

                {/* Order Quantity */}
                <Text style={[styles.cell, styles.labelCell, {flex: 0.8}]}>
                  {item.quantity}
                </Text>

                {/* Delivered Qty */}
                <TextInput
                  style={[
                    styles.cell,
                    styles.inputCell,
                    {
                      flex: 0.6,
                      borderColor: item.error ? 'red' : '#ddd',
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor="#aaa"
                  value={item.deliveredQty}
                  keyboardType="numeric"
                  maxLength={3}
                  onChangeText={text =>
                    handleDeliveredChange(item.id, text, item.quantity)
                  }
                />
              </View>
              {item.error ? (
                <Text style={styles.errorText}>{item.error}</Text>
              ) : null}
            </View>
          )}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && {opacity: 0.7}]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Process</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

export default DeliveryNote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    color: '#000000',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 5,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  heading: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cell: {
    textAlign: 'center',
    padding: 8,
    color: '#000',
    fontSize: 13,
  },
  inputCell: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 6,
    paddingVertical: 6,
    fontSize: 13,
    textAlign: 'center',
  },
  labelCell: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginLeft: 6,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
