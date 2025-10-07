import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

const MechanicalEstimate = ({navigation, route}) => {
  const {requisitionid} = route.params || {};

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Utility: truncate description to 6 words
  const truncateWords = (text, wordLimit = 6) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // ✅ Fetch API Data
  useEffect(() => {
    const fetchEstimation = async () => {
      setLoading(true);
      try {
        let formData = new FormData();
        formData.append('requisitionid', requisitionid);

        const res = await fetch(
          'https://e.de2solutions.com/mobile_dash/get_estimation.php',
          {
            method: 'POST',
            body: formData,
          },
        );

        const json = await res.json();
        if (json.status === 'true' && Array.isArray(json.data)) {
          const mapped = json.data.map((item, idx) => ({
            id: idx + 1,
            item: truncateWords(item.description),
            qty: Number(item.order_quantity || 0),
            price: Number(item.estimate_price || 0),
          }));
          setTableData(mapped);
        }
      } catch (err) {
        console.log('API Fetch Error:', err);
      }
      setLoading(false);
    };

    fetchEstimation();
  }, []);

  const renderRow = ({item}) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, {flex: 7}]} numberOfLines={1}>
        {item.item}
      </Text>
      <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>
        {item.qty}
      </Text>
      <Text style={[styles.cell, {flex: 2, textAlign: 'center'}]}>
        {item.price}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" color={COLORS.WHITE} size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mechanical Estimate</Text>
        <View style={{width: 28}} /> {/* spacer */}
      </View>

      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={[styles.cell, {flex: 7}]}>Item</Text>
        <Text style={[styles.cell, {flex: 1, textAlign: 'center'}]}>Qty</Text>
        <Text style={[styles.cell, {flex: 2, textAlign: 'center'}]}>
          Est. Price
        </Text>
      </View>

      {/* Table Data */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.WHITE}
          style={{marginTop: 50}}
        />
      ) : (
        <FlatList
          data={tableData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderRow}
          contentContainerStyle={{paddingBottom: 100}}
        />
      )}
    </LinearGradient>
  );
};

export default MechanicalEstimate;

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  tableHeader: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cell: {
    fontSize: 14,
    color: COLORS.WHITE,
  },
});
