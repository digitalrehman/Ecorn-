import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import SimpleHeader from '../../../../components/SimpleHeader';

const UploadScreen = () => {
  const [transaction, setTransaction] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // ✅ Gallery Permission
  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  // ✅ Camera Permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // ✅ Open Camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: 'Permission Required',
        text2: 'Camera permission is needed.',
      });
      return;
    }
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // ✅ Open Gallery
  const openGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Toast.show({
        type: 'error',
        text1: 'Permission Required',
        text2: 'Gallery permission is needed.',
      });
      return;
    }
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // ✅ Submit form
  const handleSubmit = () => {
    if (!transaction || !description) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'New Transaction Added!',
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: '#1a1a1a'}]}>
      <SimpleHeader title="Add New Transaction" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Transaction Picker */}
        <Text style={styles.label}>Transaction Type</Text>
        <View style={styles.glassBox}>
          <Picker
            selectedValue={transaction}
            onValueChange={setTransaction}
            style={styles.picker}>
            <Picker.Item label="Select Transaction" value="" />
            <Picker.Item label="Supplier Invoice" value="invoice" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
        </View>

        {/* Transaction # */}
        <Text style={styles.label}>Transaction #</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Transaction Number..."
          placeholderTextColor="#aaa"
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description..."
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Attach File */}
        <Text style={styles.label}>Attachment</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <Icon name="camera" size={20} color="#fff" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={openGallery}>
            <Icon name="image-multiple" size={20} color="#fff" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {imageUri && (
          <Image source={{uri: imageUri}} style={styles.imagePreview} />
        )}

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="plus-circle-outline" size={20} color="#00ff99" />
          <Text style={styles.submitText}>Add New</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Toast must be inside root */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  scroll: {padding: 20, flexGrow: 1},
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
    color: '#eee',
  },
  glassBox: {
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 15,
  },
  picker: {height: 50, width: '100%', color: '#fff'},
  input: {
    borderRadius: 15,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#fff',
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buttonText: {color: '#fff', fontWeight: '600', marginLeft: 6},
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginTop: 15,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,255,150,0.2)',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,255,150,0.4)',
  },
  submitText: {
    color: '#00ff99',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default UploadScreen;
