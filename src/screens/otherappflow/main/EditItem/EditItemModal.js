import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

const EditItemModal = ({ item, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState({ ...item }); // Copy the item for editing


  //   console.log("edit......",editedItem)

  useEffect(() => {
    setEditedItem({ ...editedItem, GrandTotal: editedItem.unit_price * editedItem.quantity_ordered - editedItem.ProductDiscount })

  }, [editedItem?.ProductDiscount, editedItem?.unit_price, editedItem?.quantity_ordered])
  const handleSave = () => {





    onSave(editedItem);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: 'gray', padding: 20, borderRadius: 10, width: '80%' }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Edit Item</Text>

        {/* Add your input fields for editing, for example: */}


        <Text style={{ marginTop: 10, color: 'white' }}>PRODUCT DISCOUNT</Text>
        <TextInput
          placeholder="Product Discount"
          value={editedItem.ProductDiscount}
          placeholderTextColor={'white'}
          style={{ borderWidth: 1, height: 40, borderRadius: 5, marginTop: 5, borderColor: 'white', color: 'white' }}
          onChangeText={(text) => setEditedItem({ ...editedItem, ProductDiscount: text })}
        />

        <Text style={{ marginTop: 10, color: 'white' }}>Product price</Text>
        <TextInput
          placeholder="Product Price"
          value={editedItem.unit_price}
          placeholderTextColor={'white'}
          style={{ borderWidth: 1, height: 40, borderRadius: 5, marginTop: 5, borderColor: 'white', color: 'white' }}

          onChangeText={(text) => setEditedItem({ ...editedItem, unit_price: text })}
        />

        <Text style={{ marginTop: 10, color: 'white' }}>Product  Quantity</Text>

        <TextInput
          placeholder="Quantity"
          value={editedItem.quantity_ordered}
          placeholderTextColor={'white'}
          style={{ borderWidth: 1, height: 40, borderRadius: 5, marginTop: 5, borderColor: 'white', color: 'white' }}

          onChangeText={(text) => setEditedItem({ ...editedItem, quantity_ordered: text })}
        />


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ color: 'white' }}>Total</Text>

          <Text style={{ color: 'white' }}>{editedItem.unit_price * editedItem.quantity_ordered - editedItem.ProductDiscount}</Text>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

          <TouchableOpacity onPress={handleSave} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ color: 'blue' }}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ padding: 10, backgroundColor: 'white', borderRadius: 10 }} >
            <Text style={{ color: 'red' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditItemModal;
