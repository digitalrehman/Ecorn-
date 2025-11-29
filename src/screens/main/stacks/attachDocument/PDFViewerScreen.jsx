import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  Platform,
  Image,
  Text,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import {BASEURL} from '../../../../utils/BaseUrl';

const FileViewerScreen = ({route}) => {
  const {type, trans_no} = route.params;
  const [localPath, setLocalPath] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    fetchFile();
  }, []);

  // Show toast message
  const showToast = (message, duration = ToastAndroid.SHORT) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration);
    }
  };

  const detectFileType = async filePath => {
    try {
      const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');

      if (base64Data.startsWith('/9j/') || base64Data.includes('/9j/')) {
        return 'jpg';
      }
      if (base64Data.startsWith('iVBORw0KGgo') || base64Data.includes('PNG')) {
        return 'png';
      }
      if (base64Data.startsWith('JVBERi') || base64Data.includes('%PDF')) {
        return 'pdf';
      }
      if (base64Data.startsWith('R0lGOD')) {
        return 'gif';
      }

      return 'jpg';
      
    } catch (error) {
      return 'jpg';
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download files',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const downloadFile = async (trans_no, type) => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        showToast('Storage permission required', ToastAndroid.LONG);
        return;
      }

      let fileExtension = 'jpg';
      
      if (type === '1' || type === 'pdf') fileExtension = 'pdf';
      else if (type === '2' || type === 'image') fileExtension = 'jpg';
      else if (type === '3') fileExtension = 'png';
      else if (type === '4') fileExtension = 'docx';

      const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${trans_no}.${fileExtension}`;

      const res = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `Downloading ${trans_no}`,
          description: 'File download in progress',
          mime: getMimeType(fileExtension),
          path: downloadPath,
        },
      }).fetch(
        'POST',
        `${BASEURL}dattachment_download.php`,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        `trans_no=${encodeURIComponent(trans_no)}&type=${encodeURIComponent(type)}`
      );

      showToast(`File downloaded: ${trans_no}.${fileExtension}`, ToastAndroid.LONG);
      
    } catch (err) {
      showToast('Download failed', ToastAndroid.LONG);
    }
  };

  const getMimeType = (extension) => {
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'zip': 'application/zip',
      'txt': 'text/plain'
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const fetchFile = async () => {
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('trans_no', trans_no);

      const response = await fetch(`${BASEURL}dattachment_view.php`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data?.url) {
        const res = await RNFetchBlob.config({
          fileCache: true,
        }).fetch('GET', data.url);

        const path = res.path();
        const detectedType = await detectFileType(path);

        setFileType(detectedType);
        setLocalPath(Platform.OS === 'android' ? `file://${path}` : path);
      }
    } catch (e) {
      showToast('Error loading file', ToastAndroid.LONG);
    }
  };

  if (!localPath) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading file...</Text>
      </View>
    );
  }

  if (fileType === 'pdf') {
    return (
      <Pdf
        source={{uri: localPath, cache: true}}
        style={{flex: 1, backgroundColor: '#fff'}}
        onError={err => console.log('PDF render error:', err)}
      />
    );
  }

  if (['jpg', 'png', 'gif'].includes(fileType)) {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <Image
          source={{uri: localPath}}
          style={{flex: 1, resizeMode: 'contain'}}
        />
      </View>
    );
  }

  if (fileType === 'ms-office') {
    useEffect(() => {
      if (localPath) {
        FileViewer.open(localPath, {
          showOpenWithDialog: true,
          showAppsSuggestions: true,
        })
          .then(() => {
            // File opened successfully
          })
          .catch(error => {
            showToast('Cannot open file. Install supporting app.', ToastAndroid.LONG);
          });
      }
    }, [localPath]);

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Opening document...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Unsupported file format</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default FileViewerScreen;