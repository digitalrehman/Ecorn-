import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator, Platform} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';

const PDFViewerScreen = ({route}) => {
  const {type, trans_no} = route.params;
  const [localPath, setLocalPath] = useState(null);

  useEffect(() => {
    fetchPdf();
  }, []);

  const fetchPdf = async () => {
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('trans_no', trans_no);

      const response = await fetch(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {method: 'POST', body: formData},
      );
      const data = await response.json();

      if (data?.url) {
        const res = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', data.url, {
          Accept: 'application/pdf',
        });

        const path = res.path();

        setLocalPath(Platform.OS === 'android' ? `file://${path}` : path);
      }
    } catch (e) {
      console.log('PDF fetch error:', e);
    }
  };

  if (!localPath) {
    return <ActivityIndicator size="large" color="#2196F3" />;
  }

  return (
    <Pdf
      source={{
        uri: localPath,
        cache: true,
        type: 'application/pdf',
      }}
      style={{flex: 1}}
      onError={err => console.log('PDF render error:', err)}
    />
  );
};

export default PDFViewerScreen;
