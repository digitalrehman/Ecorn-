import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {WebView} from 'react-native-webview';

export default function PDFViewerScreen({route}) {
  const {type, trans_no} = route.params;
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    fetchPdf();
  }, []);

  const fetchPdf = async () => {
    try {
      const res = await axios.post(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {type: 1, trans_no: 23784},
        {responseType: 'arraybuffer'},
      );

      // ArrayBuffer → Base64 convert
      const base64 = arrayBufferToBase64(res.data);
      setPdfBase64(`data:application/pdf;base64,${base64}`);
    } catch (error) {
      console.log('Error fetching PDF:', error);
    }
  };

  // helper function
  const arrayBufferToBase64 = buffer => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return global.btoa(binary);
  };

  if (!pdfBase64) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00aced" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{uri: pdfBase64}}
      style={{flex: 1}}
    />
  );
}
