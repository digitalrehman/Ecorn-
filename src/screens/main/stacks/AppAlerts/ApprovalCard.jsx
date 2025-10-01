import React from 'react';
import { TouchableOpacity, StyleSheet, ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../../../components/AppText';
import { APPCOLORS } from '../../../../utils/APPCOLORS';

const ApprovalCard = ({ reference, ord_date, name, total, onApprove }) => {
  return (
    <LinearGradient
      colors={[APPCOLORS.Primary, APPCOLORS.Secondary]} // Screen background
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.cardWrapper}>
          <LinearGradient
            colors={[APPCOLORS.Primary, APPCOLORS.Secondary]} // Card gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Top row: Ref + Approve button */}
            <View style={styles.topRow}>
              <AppText title={reference} titleSize={2} titleColor={APPCOLORS.WHITE} titleWeight />
              <TouchableOpacity onPress={onApprove} style={styles.buttonWrapper}>
                <LinearGradient
                  colors={[APPCOLORS.Secondary, APPCOLORS.Primary]} // Button gradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <AppText title="Approve" titleSize={2} titleColor={APPCOLORS.WHITE} titleWeight />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Other values just left aligned */}
            <AppText title={ord_date} titleSize={2} titleColor={APPCOLORS.WHITE} />
            <AppText title={name} titleSize={2} titleColor={APPCOLORS.WHITE} />
            <AppText title={total} titleSize={2} titleColor={APPCOLORS.WHITE} titleWeight />
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: APPCOLORS.BLACK,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});

export default ApprovalCard;
