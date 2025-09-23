import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleHeader from '../../../../components/SimpleHeader';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import RNFetchBlob from 'react-native-blob-util';
import {useFocusEffect, useRoute} from '@react-navigation/native';

export default function VoucherScreen({navigation}) {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [showPicker, setShowPicker] = useState({visible: false, type: null});
  const route = useRoute();

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Sirf tabhi reload jab refresh param true aaye
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
        navigation.setParams({refresh: false}); // reset flag
      }
    }, [route.params?.refresh]),
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        'https://e.de2solutions.com/mobile_dash/dash_upload.php',
      );
      let result = res.data?.data_cust_age || [];
      setAllData(result);

      if (result.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      // 🔹 bas last ke 30 record chahiye
      const last30 = result.slice(-30);

      setData(last30);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
    setLoading(false);
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 30) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to download PDF',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const detectFileType = async filePath => {
    const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');
    const hex = Buffer.from(base64Data, 'base64')
      .toString('hex')
      .substring(0, 8)
      .toUpperCase();

    if (hex.startsWith('25504446')) return 'pdf'; // %PDF
    if (hex.startsWith('FFD8FF')) return 'jpg'; // JPEG
    if (hex.startsWith('89504E47')) return 'png'; // PNG
    if (hex.startsWith('504B0304')) return 'zip'; // Could be docx/xlsx/pptx

    return 'bin';
  };
const downloadFile = async (trans_no, type) => {
  try {
    const res = await RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'File downloaded',
        mime: 'application/octet-stream',
        path: RNFetchBlob.fs.dirs.DownloadDir + `/${trans_no}_${Date.now()}.tmp`,
      },
    }).fetch(
      'POST',
      'https://e.de2solutions.com/mobile_dash/dattachment_download.php',
      {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      `trans_no=${encodeURIComponent(trans_no)}&type=${encodeURIComponent(type)}`
    );

    const tempPath = res.path();

    // 🔎 Detect extension
    let ext = await detectFileType(tempPath);

    if (ext === 'zip') {
      if (type.toLowerCase().includes('doc')) ext = 'docx';
      else if (type.toLowerCase().includes('xls')) ext = 'xlsx';
      else if (type.toLowerCase().includes('ppt')) ext = 'pptx';
    }

    const finalPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${trans_no}.${ext}`;
    await RNFetchBlob.fs.mv(tempPath, finalPath);

    Alert.alert('✅ Download Successful', `Saved to: ${finalPath}`);
  } catch (err) {
    console.log('❌ Download Error:', err);
    Alert.alert('❌ Download Failed', 'Could not download file.');
  }
};


  const normalizeDate = date => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  };

  const applyFilter = () => {
    if (!fromDate && !toDate) {
      setData(allData.slice(-30));
      return;
    }

    let filtered = allData.filter(item => {
      const apiDate = item.tran_date?.split(' ')[0];

      let afterFrom = true;
      let beforeTo = true;

      if (fromDate) {
        afterFrom = apiDate >= normalizeDate(fromDate);
      }
      if (toDate) {
        beforeTo = apiDate <= normalizeDate(toDate);
      }
      return afterFrom && beforeTo;
    });

    // 🔹 filter ke baad bhi sirf last 30 hi dikhao
    setData(filtered.slice(-30));
  };

  const clearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setData(allData.slice(-30));
  };

  const formatAmount = value => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title="Voucher" />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, styles.primaryButton]}
          onPress={() => setShowPicker({visible: true, type: 'from'})}>
          <Icon name="calendar" size={18} color="#fff" />
          <Text style={styles.buttonText}>
            {fromDate ? fromDate.toDateString() : 'From Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, styles.primaryButton]}
          onPress={() => setShowPicker({visible: true, type: 'to'})}>
          <Icon name="calendar" size={18} color="#fff" />
          <Text style={styles.buttonText}>
            {toDate ? toDate.toDateString() : 'To Date'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={applyFilter}
          style={{flex: 1, marginRight: 6}}>
          <LinearGradient
            colors={['#28a745', '#218838']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientButton}>
            <Icon name="filter-check" size={18} color="#fff" />
            <Text style={styles.buttonText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={clearFilter}
          style={{flex: 1, marginLeft: 6}}>
          <LinearGradient
            colors={['#dc3545', '#a71d2a']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientButton}>
            <Icon name="close-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}>Clear</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showPicker.visible && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowPicker({visible: false, type: null});
            if (date) {
              if (showPicker.type === 'from') setFromDate(date);
              if (showPicker.type === 'to') setToDate(date);
            }
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color={APPCOLORS.Secondary}
          style={{marginTop: 20}}
        />
      ) : data.length === 0 ? (
        <Text style={{color: '#fff', textAlign: 'center', marginTop: 20}}>
          No Data Found
        </Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerText, {flex: 1}]}>
                Ref
              </Text>
              <Text style={[styles.cell, styles.headerText, {flex: 1.5}]}>
                Date
              </Text>
              <Text style={[styles.cell, styles.headerText, {flex: 1.5}]}>
                Amount
              </Text>
              <Text style={[styles.cell, styles.headerText, {flex: 1}]}>
                Action
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.row}>
              <Text style={[styles.cell, {flex: 1}]}>
                {item.reference.slice(0, 6) + '..' || 'N/A'}
              </Text>
              <Text style={[styles.cell, {flex: 1.5}]}>{item.tran_date}</Text>
              <Text style={[styles.cell, {flex: 1.5}]}>
                {formatAmount(item.amount)}
              </Text>
              <View
                style={[
                  styles.cell,
                  {
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  },
                ]}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UploadScreen', {
                      transactionType: item.type,
                      transactionNo: item.trans_no,
                      fromScreen: 'VoucherScreen',
                    })
                  }>
                  <Icon name="paperclip" size={20} color="#00ff99" />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={!item.upload_status}
                  onPress={() =>
                    navigation.navigate('PDFViewerScreen', {
                      type: item.type,
                      trans_no: item.trans_no,
                    })
                  }>
                  <Icon
                    name="eye"
                    size={20}
                    color={item.upload_status ? '#00aced' : 'gray'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={!item.upload_status}
                  onPress={() => downloadFile(item.trans_no, item.type)}>
                  <Icon
                    name="download"
                    size={20}
                    color={item.upload_status ? '#ffcc00' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{paddingBottom: 50}}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: APPCOLORS.Primary},
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: APPCOLORS.Secondary,
    padding: 8,
    marginRight: 8,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: APPCOLORS.Secondary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerRow: {
    backgroundColor: APPCOLORS.BLACK,
  },
  cell: {
    color: '#fff',
    fontSize: 14,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: APPCOLORS.Secondary,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    marginHorizontal: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 1, height: 2},
  },
});
