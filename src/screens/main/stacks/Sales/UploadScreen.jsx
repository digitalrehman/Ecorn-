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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import SimpleHeader from '../../../../components/SimpleHeader';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';

const UploadScreen = () => {
  const route = useRoute();
  const {transactionType, transactionNo} = route.params || {}; // 👈 row click से मिल रहा है

  // hidden states (UI पर show नहीं होंगे लेकिन API में जाएंगे)
  const [transaction, setTransaction] = useState(transactionType || '');
  const [transNo, setTransNo] = useState(transactionNo || '');

  // visible fields
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

  // ✅ Submit Form
  const handleSubmit = async () => {
    if (!transaction || !transNo || !description) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Missing required fields',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('transactionType', transaction); // 👈 hidden value
      formData.append('transactionNo', transNo);       // 👈 hidden value
      formData.append('description', description);

      if (imageUri) {
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'attachment.jpg',
        });
      }

      const response = await axios.post(
        'https://e.de2solutions.com/company/0/attachments',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      Toast.show({
        type: 'success',
        text1: 'Uploaded',
        text2: 'Attachment sent successfully!',
      });

      console.log('API Response:', response.data);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Something went wrong!',
      });
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: '#1a1a1a'}]}>
      <SimpleHeader title="Attach Document" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.bigInput}
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
          <Text style={styles.submitText}>Upload Attachment</Text>
        </TouchableOpacity>
      </ScrollView>
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
  bigInput: {
    borderRadius: 15,
    padding: 16,
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
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
    marginTop: 25,
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
