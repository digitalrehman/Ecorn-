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
import { BASEURL } from '../../../../utils/BaseUrl';

export default function SaleOrder({navigation}) {
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

  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        fetchData();
        navigation.setParams({refresh: false});
      }
    }, [route.params?.refresh]),
  );

  const fetchData = async () => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${BASEURL}dash_upload_sale.php`,
    );
    let result = res.data?.data_cust_age || [];
    setAllData(result);

    if (result.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    const parsed = result.map(item => {
      const dateStr = item.tran_date.split(' ')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      return {...item, jsDate: new Date(year, month - 1, day)};
    });

    const sorted = parsed.sort((a, b) => b.jsDate - a.jsDate);

    setData(sorted.slice(0, 30));
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

  const downloadFile = async (trans_no, type) => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required.');
      return;
    }

    try {
      // 🔹 File download with RNFetchBlob
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'tmp', // temporary extension
      }).fetch(
        'POST',
        `${BASEURL}dattachment_download.php`,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        `type=${encodeURIComponent(type)}&trans_no=${encodeURIComponent(
          trans_no,
        )}`,
      );

      // 🔹 Get binary headers to detect mime
      const info = await res.info();
      let mime =
        info.respInfo.headers['Content-Type'] || 'application/octet-stream';

      // 🔹 Decide extension by mime type
      let ext = 'bin';
      if (mime.includes('pdf')) ext = 'pdf';
      else if (mime.includes('jpeg')) ext = 'jpg';
      else if (mime.includes('png')) ext = 'png';
      else if (mime.includes('gif')) ext = 'gif';
      else if (
        mime.includes('msword') ||
        mime.includes('officedocument.wordprocessingml')
      )
        ext = 'docx';
      else if (mime.includes('spreadsheetml') || mime.includes('ms-excel'))
        ext = 'xlsx';
      else if (
        mime.includes('presentationml') ||
        mime.includes('ms-powerpoint')
      )
        ext = 'pptx';
      else if (mime.includes('zip')) ext = 'zip';

      // 🔹 Final save path
      const path =
        Platform.OS === 'android'
          ? `${RNFetchBlob.fs.dirs.DownloadDir}/${trans_no}.${ext}`
          : `${RNFetchBlob.fs.dirs.DocumentDir}/${trans_no}.${ext}`;

      // 🔹 Move temp file → final path
      await RNFetchBlob.fs.mv(res.path(), path);

      // 🔹 Android notification
      if (Platform.OS === 'android') {
        await RNFetchBlob.android.addCompleteDownload({
          title: `${trans_no}.${ext}`,
          description: 'File downloaded successfully',
          mime,
          path,
          showNotification: true,
        });
      }

      Alert.alert('Download Successful', `File saved to: ${path}`);
    } catch (err) {
      Alert.alert('Download Failed', 'Could not download the file.');
    }
  };

  const normalizeDate = date => {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  };

  const applyFilter = () => {
    if (!fromDate && !toDate) {
      setData(allData);
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

    setData(filtered);
  };

  const clearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setData(allData);
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
      <SimpleHeader title="Sale Order" />

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
                      fromScreen: 'SaleOrder',
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
