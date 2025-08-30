import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import axios from 'axios';
import {WebView} from 'react-native-webview';

export default function PDFViewerScreen({route}) {
  const {type, trans_no} = route.params;

  const [pdfBase64, setPdfBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPdf();
  }, []);

  const fetchPdf = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {type, trans_no},
        {responseType: 'arraybuffer'},
      );

      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );
      
      setPdfBase64(base64);

    } catch (err) {
      console.log('Error fetching PDF:', err);
      setError('Failed to load PDF. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00aced" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>{error}</Text>
      </View>
    );
  }

  if (!pdfBase64) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>PDF could not be displayed.</Text>
      </View>
    );
  }
  
  // HTML content with an embedded PDF viewer
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; overflow: hidden;">
        <embed
          src="data:application/pdf;base64,${pdfBase64}"
          type="application/pdf"
          width="100%"
          height="100%"
          style="border: none;"
        >
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{html: htmlContent}}
      style={{flex: 1}}
    />
  );
}