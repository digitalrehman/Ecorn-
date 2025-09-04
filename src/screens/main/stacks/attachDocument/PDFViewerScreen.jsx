import React, {useState, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  Platform,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';

const FileViewerScreen = ({route}) => {
  const {type, trans_no} = route.params;
  const [localPath, setLocalPath] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    fetchFile();
  }, []);

  const detectFileType = async path => {
    try {
      const base64Data = await RNFetchBlob.fs.readFile(path, 'base64');

      const binary = atob(base64Data.substring(0, 50));

      const hexSignature = Array.from(binary)
        .map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      // --- PDFs ---
      if (base64Data.startsWith('JVBERi0')) return 'pdf';

      // --- Images ---
      if (base64Data.startsWith('/9j/')) return 'jpg'; // JPEG
      if (base64Data.startsWith('iVBORw0KGgo')) return 'png'; // PNG
      if (base64Data.startsWith('R0lGOD')) return 'gif'; // GIF

      // --- MS Office (old binary) ---
      if (hexSignature.startsWith('D0CF11E0A1B11AE1')) return 'ms-office';

      // --- MS Office (new XML = DOCX, XLSX, PPTX) ---
      if (hexSignature.startsWith('504B0304')) return 'ms-office';

      return 'unknown';
    } catch (e) {
      console.log('File detection error:', e);
      return 'unknown';
    }
  };

  const fetchFile = async () => {
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('trans_no', trans_no);

      // Step 1: hit POST API to get file URL
      const response = await fetch(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {method: 'POST', body: formData},
      );
      const data = await response.json();

      if (data?.url) {
        // Step 2: download file
        const res = await RNFetchBlob.config({
          fileCache: true,
        }).fetch('GET', data.url);

        const path = res.path();

        // Step 3: detect file type
        const detectedType = await detectFileType(path);

        setFileType(detectedType);
        setLocalPath(Platform.OS === 'android' ? `file://${path}` : path);
      }
    } catch (e) {
      console.log('File fetch error:', e);
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

  // ✅ PDF rendering
  if (fileType === 'pdf') {
    return (
      <Pdf
        source={{uri: localPath, cache: true}}
        style={{flex: 1, backgroundColor: '#fff'}}
        onError={err => console.log('PDF render error:', err)}
      />
    );
  }

  // ✅ Images rendering
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

  // ✅ MS Office Handling
  if (fileType === 'ms-office') {
    FileViewer.open(localPath)
      .then(() => {
        console.log('File opened successfully');
      })
      .catch(error => {
        console.log('Error opening file:', error);
      });

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Opening MS Office file...</Text>
      </View>
    );
  }

  // ✅ Unknown type
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>⚠ Unsupported file format</Text>
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
