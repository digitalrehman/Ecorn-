import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AppText from '../../../../components/AppText';
import { APPCOLORS } from '../../../../utils/APPCOLORS';

const ApprovalCard = ({ reference, ord_date, name, total, onApprove }) => {
  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
      <AppText title={`Ref: ${reference}`} titleSize={2} titleColor={APPCOLORS.BLACK} />
      <AppText title={`Date: ${ord_date}`} titleSize={2} titleColor={APPCOLORS.BLACK} />
      <AppText title={`Name: ${name}`} titleSize={2} titleColor={APPCOLORS.BLACK} />
      <AppText title={`Total: ${total}`} titleSize={2} titleColor={APPCOLORS.BLACK} />

      <TouchableOpacity style={styles.button} onPress={onApprove}>
        <AppText title="Approve" titleSize={2} titleColor={APPCOLORS.WHITE} titleWeight />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: APPCOLORS.WHITE,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: APPCOLORS.BLACK,
  },
  button: {
    marginTop: 15,
    backgroundColor: APPCOLORS.Primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default ApprovalCard;
