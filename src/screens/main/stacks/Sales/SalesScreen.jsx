import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleHeader from '../../../../components/SimpleHeader';
import {APPCOLORS} from '../../../../utils/APPCOLORS';

const buttons = [
  {name: 'Add Customer', icon: 'account-plus'},
  {name: 'Delivery', icon: 'truck-delivery'},
  {name: 'Sales Approval', icon: 'clipboard-check'},
  {name: 'View and Downloads', icon: 'file-download'},
  {name: 'Upload Technical Data', icon: 'upload'},
  {name: 'Track Order Status', icon: 'map-marker-path'},
  {name: 'Receivable List', icon: 'format-list-bulleted'},
];

export default function SalesScreen({navigation}) {
  const renderButton = ({item}) => (
    <TouchableOpacity
      style={styles.buttonWrapper}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Dashboard')}>
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
        style={styles.buttonContainer}>
        <View style={styles.iconContainer}>
          <Icon name={item.icon} size={22} color="#fff" />
        </View>
        <Text style={styles.buttonText}>{item.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[APPCOLORS.BLACK, '#1c1c1c', APPCOLORS.Secondary]}
      style={styles.container}>
      <SimpleHeader title="Sales" />
      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingVertical: 20}}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapper: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backdropFilter: 'blur(10px)',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 50,
    marginRight: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
