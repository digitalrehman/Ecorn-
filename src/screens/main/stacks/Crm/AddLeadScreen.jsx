import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';

const COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  Primary: '#1a1c22',
  Secondary: '#5a5c6a',
  Glass: 'rgba(255,255,255,0.08)',
};

const FIELDS = [
  {key: 'projectType', type: 'dropdown', label: 'Project Type'},
  {key: 'estimator', type: 'text', label: 'Estimator'},
  {key: 'sendingDate', type: 'date', label: 'Project Sending Date'},
  {key: 'revisionDate', type: 'date', label: 'Revision Date'},
  {
    key: 'revisionPrice',
    type: 'text',
    label: 'Latest Revision Price',
    keyboard: 'numeric',
  },
  {key: 'poStatus', type: 'dropdown', label: 'PO Status'},
  {key: 'companyName', type: 'text', label: 'Company Name'},
  {key: 'projectName', type: 'text', label: 'Project Name'},
  {key: 'salesPerson', type: 'text', label: 'Sales Person'},
  {key: 'referenceNo', type: 'text', label: 'Reference No'},
  {key: 'enclosure', type: 'text', label: 'Enclosure'},
  {key: 'remarks', type: 'text', label: 'Remarks'},
];

const AddLeadScreen = ({navigation}) => {
  const [form, setForm] = useState({});
  const [showPicker, setShowPicker] = useState({show: false, type: null});

  // Animation refs
  const animations = useRef(FIELDS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      150,
      animations.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  const updateField = (key, value) => {
    setForm({...form, [key]: value});
  };

  const handleSubmit = () => {
    console.log('Form Data:', form);
    alert('Lead submitted successfully!');
  };

  const renderField = (field, index) => {
    const animStyle = {
      opacity: animations[index],
      transform: [
        {
          translateY: animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    switch (field.type) {
      case 'dropdown':
        const data =
          field.key === 'projectType'
            ? [
                {label: 'Tender', value: 'Tender'},
                {label: 'In-hand', value: 'In-hand'},
              ]
            : [
                {label: 'Active', value: 'Active'},
                {label: 'PO Received', value: 'PO Received'},
                {label: 'On-Hold', value: 'On-Hold'},
                {label: 'Cancelled', value: 'Cancelled'},
              ];
        return (
          <Animated.View
            key={field.key}
            style={[styles.animatedWrap, animStyle]}>
            <Dropdown
              style={styles.dropdown}
              data={data}
              labelField="label"
              valueField="value"
              placeholder={field.label}
              value={form[field.key]}
              onChange={item => updateField(field.key, item.value)}
            />
          </Animated.View>
        );

      case 'date':
        return (
          <Animated.View
            key={field.key}
            style={[styles.animatedWrap, animStyle]}>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowPicker({show: true, type: field.key})}>
              <Text style={styles.dateText}>
                {form[field.key]
                  ? form[field.key].toLocaleDateString()
                  : field.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );

      default:
        return (
          <Animated.View
            key={field.key}
            style={[styles.animatedWrap, animStyle]}>
            <TextInput
              style={styles.input}
              placeholder={field.label}
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType={field.keyboard || 'default'}
              value={form[field.key]}
              onChangeText={t => updateField(field.key, t)}
            />
          </Animated.View>
        );
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.Primary, COLORS.Secondary, COLORS.BLACK]}
      style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={COLORS.WHITE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Lead</Text>
        <View style={{width: 26}} />
      </View>

      <ScrollView contentContainerStyle={{padding: 16}}>
        {FIELDS.map((f, i) => renderField(f, i))}

        {/* Submit Button */}
        <Animated.View
          style={[
            styles.animatedWrap,
            {
              opacity: animations[FIELDS.length - 1],
              transform: [
                {
                  translateY: animations[FIELDS.length - 1].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.submitBtn}
            onPress={handleSubmit}>
            <LinearGradient
              colors={[COLORS.Secondary, '#7a7c8a', COLORS.Primary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.submitGradient}>
              <Text style={styles.submitText}>Submit Lead</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Date Picker */}
      {showPicker.show && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setShowPicker({show: false, type: null});
            if (selected) {
              updateField(showPicker.type, selected);
            }
          }}
        />
      )}
    </LinearGradient>
  );
};

export default AddLeadScreen;

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.WHITE,
  },
  animatedWrap: {
    marginBottom: 14,
  },
  input: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: COLORS.WHITE,
    backgroundColor: COLORS.Glass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
  },
  dropdown: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: COLORS.Glass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dateText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
  },
  submitBtn: {
    marginTop: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitGradient: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});
