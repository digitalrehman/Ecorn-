import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
};

// Dummy Data
const LEADS = [
  {
    id: '1',
    date: '2025-09-10',
    referenceNo: 'REF001',
    projectName: 'Mall Construction',
    companyName: 'ABC Builders',
    enclosure: 'Yes',
    salesPerson: 'Ali',
    estimator: 'Sara',
    status: 'Active',
  },
  {
    id: '2',
    date: '2025-09-11',
    referenceNo: 'REF002',
    projectName: 'Apartment Tower',
    companyName: 'XYZ Developers',
    enclosure: 'No',
    salesPerson: 'Ahmed',
    estimator: 'Zara',
    status: 'POC Detail',
  },
  {
    id: '3',
    date: '2025-09-12',
    referenceNo: 'REF003',
    projectName: 'Housing Scheme',
    companyName: 'Star Constructions',
    enclosure: 'Yes',
    salesPerson: 'Bilal',
    estimator: 'Ayesha',
    status: 'On Hold',
  },
  {
    id: '4',
    date: '2025-09-13',
    referenceNo: 'REF004',
    projectName: 'Bridge Project',
    companyName: 'Road Masters',
    enclosure: 'Yes',
    salesPerson: 'Hassan',
    estimator: 'Imran',
    status: 'Cancelled',
  },
];

const FILTERS = [
  {key: 'Active', icon: 'checkmark-circle'},
  {key: 'POC Detail', icon: 'document-text'},
  {key: 'On Hold', icon: 'pause-circle'},
  {key: 'Cancelled', icon: 'close-circle'},
];

const ViewLeads = ({navigation}) => {
  const [selectedFilter, setSelectedFilter] = useState('Active');

  const filteredLeads = LEADS.filter(l => l.status === selectedFilter);

  const renderCard = ({item}) => (
    <View style={styles.card}>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Date:</Text>
        <Text style={styles.kvValue}>{item.date}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Reference No:</Text>
        <Text style={styles.kvValue}>{item.referenceNo}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Project:</Text>
        <Text style={styles.kvValue}>{item.projectName}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Company:</Text>
        <Text style={styles.kvValue}>{item.companyName}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Enclosure:</Text>
        <Text style={styles.kvValue}>{item.enclosure}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Sales Person:</Text>
        <Text style={styles.kvValue}>{item.salesPerson}</Text>
      </View>
      <View style={styles.kvRow}>
        <Text style={styles.kvKey}>Estimator:</Text>
        <Text style={styles.kvValue}>{item.estimator}</Text>
      </View>
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
        <Text style={styles.headerTitle}>View Leads</Text>
        <Ionicons name="filter" color={COLORS.WHITE} size={24} />
      </View>

      {/* Filter Buttons in Grid (2x2) */}
      <View style={styles.filterGrid}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              selectedFilter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setSelectedFilter(f.key)}>
            <Ionicons
              name={f.icon}
              size={18}
              color={selectedFilter === f.key ? COLORS.WHITE : '#ccc'}
              style={{marginRight: 6}}
            />
            <Text
              style={[
                styles.filterText,
                selectedFilter === f.key && {color: COLORS.WHITE},
              ]}>
              {f.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards */}
      <FlatList
        data={filteredLeads}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={{padding: 16}}
      />
    </LinearGradient>
  );
};

export default ViewLeads;

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filterBtn: {
    width: '48%', // 2 per row
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterBtnActive: {
    backgroundColor: COLORS.Secondary,
    borderColor: COLORS.WHITE,
  },
  filterText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  kvKey: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  kvValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
});
