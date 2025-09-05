import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SimpleHeader from '../../../../../components/SimpleHeader';

const DeliveryNote = () => {
  const [driverName, setDriverName] = useState('');
  const [vehicleName, setVehicleName] = useState('');

  // Dummy random array (API replace later)
  const [items, setItems] = useState([
    {id: '1', description: '', quantity: 12, deliveredQty: '', error: ''},
    {id: '2', description: '', quantity: 8, deliveredQty: '', error: ''},
    {id: '3', description: '', quantity: 20, deliveredQty: '', error: ''},
  ]);

  const updateItem = (id, field, value) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? {...item, [field]: value} : item,
      ),
    );
  };

  const handleDeliveredChange = (id, text, maxQty) => {
    let errorMsg = '';
    if (text && parseInt(text) > maxQty) {
      errorMsg = `Cannot exceed ${maxQty}`;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {...item, deliveredQty: text, error: errorMsg}
          : item,
      ),
    );
  };

  const handleSubmit = () => {
    const invalid = items.some(item => item.error);
    if (invalid) {
      Alert.alert('Error', 'Fix validation errors before submitting!');
      return;
    }

    const data = {
      driverName,
      vehicleName,
      items,
    };
    console.log('Form Submitted:', data);
    Alert.alert('Success', 'Delivery Note Submitted!');
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
                {/* Description */}
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

                {/* Order Quantity (API value) */}
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

              {/* Error message */}
              {item.error ? (
                <Text style={styles.errorText}>{item.error}</Text>
              ) : null}
            </View>
          )}
        />

        {/* Process Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Process</Text>
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
