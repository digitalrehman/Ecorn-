import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  Dimensions,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';

const {width, height} = Dimensions.get('window');

const PDFViewerScreen = ({route, navigation}) => {
  const {type, trans_no} = route.params;
  const [pdfSource, setPdfSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    fetchAndProcessPDF();
  }, []);

  const fetchAndProcessPDF = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);

      // Step 1: POST API se URL fetch karo
      console.log('Step 1: Fetching PDF URL...');
      console.log('Request body:', JSON.stringify({type, trans_no}));
      
      const response = await fetch(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({
            type: type,
            trans_no: trans_no,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.status || !data.url) {
        throw new Error(data.message || 'Failed to get PDF URL');
      }

      const pdfUrl = data.url;
      console.log('PDF URL received:', pdfUrl);
      setLoadingProgress(25);

      // Step 2: GET API se actual PDF data fetch karo
      console.log('Step 2: Fetching PDF data from URL...');
      const pdfResponse = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf, */*',
          'Content-Type': 'application/pdf',
          'User-Agent': 'Mozilla/5.0 (compatible; React-Native-PDF)',
        },
      });

      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.status}`);
      }

      setLoadingProgress(50);

      // Step 3: PDF data ko blob me convert karo
      const pdfBlob = await pdfResponse.blob();
      console.log('PDF blob size:', pdfBlob.size);
      setLoadingProgress(75);

      // Step 4: Blob ko base64 me convert karo
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        console.log('PDF converted to base64, length:', base64Data.length);
        
        setPdfSource({
          uri: `data:application/pdf;base64,${base64Data}`,
          cache: false,
        });
        
        setLoadingProgress(100);
        setLoading(false);
      };

      reader.onerror = () => {
        throw new Error('Failed to convert PDF to base64');
      };

      reader.readAsDataURL(pdfBlob);

    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(`Failed to load PDF: ${err.message}`);
      setLoading(false);
    }
  };

  // Alternative method using RNFS for better compatibility
  const fetchAndProcessPDFWithFS = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoadingProgress(0);

      // Step 1: POST API se URL fetch karo
      console.log('Step 1: Fetching PDF URL...');
      const response = await fetch(
        'https://e.de2solutions.com/mobile_dash/dattachment_view.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            type: type,
            trans_no: trans_no,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.status || !data.url) {
        throw new Error(data.message || 'Failed to get PDF URL');
      }

      const pdfUrl = data.url;
      console.log('PDF URL received:', pdfUrl);
      setLoadingProgress(25);

      // Step 2: RNFS se PDF download karo
      const downloadDest = `${RNFS.CachesDirectoryPath}/temp_${Date.now()}.pdf`;
      
      const downloadOptions = {
        fromUrl: pdfUrl,
        toFile: downloadDest,
        headers: {
          'Accept': 'application/pdf',
          'User-Agent': 'Mozilla/5.0 (compatible; React-Native-PDF)',
        },
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 50 + 25; // 25-75%
          setLoadingProgress(Math.round(progress));
        },
      };

      const result = await RNFS.downloadFile(downloadOptions).promise;
      
      if (result.statusCode === 200) {
        console.log('PDF downloaded successfully to:', downloadDest);
        
        // Step 3: File ko base64 me read karo
        const base64Data = await RNFS.readFile(downloadDest, 'base64');
        console.log('PDF converted to base64, length:', base64Data.length);
        
        setPdfSource({
          uri: `data:application/pdf;base64,${base64Data}`,
          cache: false,
        });
        
        setLoadingProgress(100);
        setLoading(false);
        
        // Cleanup: temp file delete karo
        RNFS.unlink(downloadDest).catch(console.error);
      } else {
        throw new Error(`Download failed with status: ${result.statusCode}`);
      }

    } catch (err) {
      console.error('Error processing PDF with FS:', err);
      setError(`Failed to load PDF: ${err.message}`);
      setLoading(false);
    }
  };

  const onLoadComplete = (numberOfPages, filePath) => {
    setTotalPages(numberOfPages);
    console.log(`PDF loaded successfully with ${numberOfPages} pages`);
  };

  const onPageChanged = (page, numberOfPages) => {
    setCurrentPage(page);
  };

  const onError = (error) => {
    console.error('PDF Error:', error);
    setError('Error loading PDF file. Trying alternative method...');
    
    // Retry with alternative method
    setTimeout(() => {
      fetchAndProcessPDFWithFS();
    }, 1000);
  };

  const retry = () => {
    fetchAndProcessPDF();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading PDF...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>
            Processing PDF... {loadingProgress}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${loadingProgress}%` }
              ]} 
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PDF Viewer</Text>
        </View>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={60} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PDF Viewer</Text>
        {totalPages > 0 && (
          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>
        )}
      </View>

      <View style={styles.pdfContainer}>
        {pdfSource && (
          <Pdf
            source={pdfSource}
            onLoadComplete={onLoadComplete}
            onPageChanged={onPageChanged}
            onError={onError}
            onLoadProgress={(percent) => {
              console.log(`PDF render progress: ${(percent * 100).toFixed(0)}%`);
            }}
            style={styles.pdf}
            trustAllCerts={true}
            enablePaging={true}
            spacing={0}
            minScale={0.5}
            maxScale={3.0}
            scale={1.0}
            horizontal={false}
            fitPolicy={0}
            enableAntialiasing={true}
            password=""
            renderActivityIndicator={() => (
              <View style={styles.pdfLoading}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.pdfLoadingText}>Rendering PDF...</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  pageInfo: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  pdfLoading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -50}, {translateY: -50}],
    alignItems: 'center',
  },
  pdfLoadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});
export default PDFViewerScreen;