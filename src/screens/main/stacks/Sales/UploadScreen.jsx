import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

export default function UploadScreen() {
  const [type, setType] = useState('invoice');
  const [transaction, setTransaction] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const pickFromGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo', quality: 1});
    if (!result.didCancel && result.assets?.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const pickFromCamera = async () => {
    const result = await launchCamera({mediaType: 'photo', quality: 1});
    if (!result.didCancel && result.assets?.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmit = () => {
    if (!transaction || !description || !file) {
      Alert.alert('Error', 'Please fill all fields and attach a file');
      return;
    }

    // ✅ FormData for API upload
    const formData = new FormData();
    formData.append('type', type);
    formData.append('transaction', transaction);
    formData.append('description', description);
    formData.append('file', {
      uri: file.uri,
      name: file.fileName || 'upload.jpg',
      type: file.type || 'image/jpeg',
    });

    // Example fetch
    fetch('http://your-api-url/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert('Success', 'File uploaded successfully!');
      })
      .catch(err => {
        Alert.alert('Error', 'Upload failed: ' + err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Document</Text>

      {/* Type */}
      <Text style={styles.label}>Type</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={type} onValueChange={val => setType(val)}>
          <Picker.Item label="Supplier Invoice" value="invoice" />
          <Picker.Item label="Purchase Order" value="po" />
          <Picker.Item label="Receipt" value="receipt" />
        </Picker>
      </View>

      {/* Transaction */}
      <Text style={styles.label}>Transaction #</Text>
      <TextInput
        style={styles.input}
        value={transaction}
        onChangeText={setTransaction}
        placeholder="Enter transaction number"
      />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      {/* Attach File */}
      <Text style={styles.label}>Attach File</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
          <Text style={styles.btnText}>📷 Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
          <Text style={styles.btnText}>📂 Gallery</Text>
        </TouchableOpacity>
      </View>
      {file && (
        <Text style={styles.fileText}>
          Selected: {file.fileName || file.uri.split('/').pop()}
        </Text>
      )}

      {/* Add New */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addBtnText}>➕ Add New</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f8f9fa'},
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {fontSize: 14, fontWeight: '500', marginBottom: 5, color: '#444'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: '600'},
  fileText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 15,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addBtnText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
