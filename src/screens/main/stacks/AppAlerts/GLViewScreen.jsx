import React from 'react';
import {View, ScrollView, Animated} from 'react-native';
import SimpleHeader from '../../../../components/SimpleHeader';
import AppText from '../../../../components/AppText';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import LinearGradient from 'react-native-linear-gradient';

const GLViewScreen = ({route}) => {
  const {glData, reference, transNo} = route.params;
  const header = glData.data_header?.[0];
  const details = glData.data_detail || [];

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Format amount display
  const formatAmount = amount => {
    if (!amount) return '0.00';
    const num = parseFloat(amount);
    return num.toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      <SimpleHeader title={`GL View - ${reference}`} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Information Card */}
        {header && (
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <LinearGradient
              colors={[APPCOLORS.Primary, APPCOLORS.Secondary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <AppText
                title="Transaction Header"
                titleSize={3}
                titleColor={APPCOLORS.WHITE}
                titleWeight
                style={styles.cardTitle}
              />

              <View style={styles.detailsGrid}>
                <View style={styles.detailRow}>
                  <AppText
                    title="Transaction No:"
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                  <AppText
                    title={header.trans_no || 'N/A'}
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Type:"
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                  <AppText
                    title={header.type || 'N/A'}
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Reference:"
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                  <AppText
                    title={header.reference || 'N/A'}
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Company:"
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                  <AppText
                    title={header.name || 'N/A'}
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                </View>

                <View style={styles.detailRow}>
                  <AppText
                    title="Prepared By:"
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                  <AppText
                    title={header.real_name || 'N/A'}
                    titleSize={2}
                    titleColor={APPCOLORS.WHITE}
                  />
                </View>

                {/* Conditional Cheque No Display */}
                {header.cheque_no && (
                  <View style={styles.detailRow}>
                    <AppText
                      title="Cheque No:"
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                    />
                    <AppText
                      title={header.cheque_no}
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                    />
                  </View>
                )}

                {/* Conditional Cheque Date Display */}
                {header.cheque_date && (
                  <View style={styles.detailRow}>
                    <AppText
                      title="Cheque Date:"
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                    />
                    <AppText
                      title={header.cheque_date}
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                    />
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* GL Details Card */}
        {details.length > 0 && (
          <Animated.View
            style={[
              styles.cardWrapper,
              {
                opacity: fadeAnim,
                transform: [{translateY: slideAnim}],
              },
            ]}>
            <LinearGradient
              colors={[APPCOLORS.Primary, APPCOLORS.Secondary]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.card}>
              <AppText
                title={`GL Entries (${details.length})`}
                titleSize={3}
                titleColor={APPCOLORS.WHITE}
                titleWeight
                style={styles.cardTitle}
              />

              {details.map((entry, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.entryCard,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: Animated.multiply(slideAnim, 0.5),
                        },
                      ],
                    },
                  ]}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                    style={styles.entryGradient}>
                    <AppText
                      title={`Entry ${index + 1}`}
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                      titleWeight
                      style={styles.entryNumber}
                    />

                    <View style={styles.entryDetails}>
                      <View style={styles.detailRow}>
                        <AppText
                          title="Account:"
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                        />
                        <AppText
                          title={entry.account || 'N/A'}
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                        />
                      </View>

                      <View style={styles.detailRow}>
                        <AppText
                          title="Account Name:"
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                        />
                        <AppText
                          title={entry.account_name || 'N/A'}
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                          style={styles.accountName}
                        />
                      </View>

                      <View style={styles.detailRow}>
                        <AppText
                          title="Transaction Date:"
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                        />
                        <AppText
                          title={entry.tran_date || 'N/A'}
                          titleSize={2}
                          titleColor={APPCOLORS.WHITE}
                        />
                      </View>

                      {/* Amounts Row */}
                      <View style={styles.amountsRow}>
                        {entry.debit && parseFloat(entry.debit) > 0 && (
                          <View style={styles.amountItem}>
                            <AppText
                              title="Debit:"
                              titleSize={2}
                              titleColor={APPCOLORS.WHITE}
                            />
                            <AppText
                              title={formatAmount(entry.debit)}
                              titleSize={2}
                              titleColor={APPCOLORS.WHITE}
                              titleWeight
                            />
                          </View>
                        )}

                        {entry.credit && parseFloat(entry.credit) !== 0 && (
                          <View style={styles.amountItem}>
                            <AppText
                              title="Credit:"
                              titleSize={2}
                              titleColor={APPCOLORS.WHITE}
                            />
                            <AppText
                              title={formatAmount(entry.credit)}
                              titleSize={2}
                              titleColor={APPCOLORS.WHITE}
                              titleWeight
                            />
                          </View>
                        )}
                      </View>

                      {/* Memo */}
                      {entry.memo_ && (
                        <View style={styles.memoSection}>
                          <AppText
                            title="Memo:"
                            titleSize={2}
                            titleColor={APPCOLORS.WHITE}
                            titleWeight
                          />
                          <AppText
                            title={entry.memo_}
                            titleSize={2}
                            titleColor={APPCOLORS.WHITE}
                            style={styles.memoText}
                          />
                        </View>
                      )}

                      {/* Cheque No in detail if available */}
                      {entry.cheque && (
                        <View style={styles.detailRow}>
                          <AppText
                            title="Cheque No:"
                            titleSize={2}
                            titleColor={APPCOLORS.WHITE}
                          />
                          <AppText
                            title={entry.cheque}
                            titleSize={2}
                            titleColor={APPCOLORS.WHITE}
                          />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))}
            </LinearGradient>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: APPCOLORS.Secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: APPCOLORS.BLACK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  card: {
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 15,
  },
  detailsGrid: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  entryGradient: {
    padding: 15,
    borderRadius: 12,
  },
  entryNumber: {
    textAlign: 'center',
    marginBottom: 10,
  },
  entryDetails: {
    gap: 6,
  },
  accountName: {
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  amountItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  memoSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  memoText: {
    marginTop: 4,
    fontStyle: 'italic',
    lineHeight: 16,
  },
};

export default GLViewScreen;
