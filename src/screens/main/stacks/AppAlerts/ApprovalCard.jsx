import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../../../../components/AppText';
import {APPCOLORS} from '../../../../utils/APPCOLORS';
import axios from 'axios';
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import RNBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-toast-message';

const ApprovalCard = ({
  reference,
  ord_date,
  name,
  total,
  onApprove,
  trans_no,
  type,
  navigation,
}) => {
  const [viewLoading, setViewLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleView = async () => {
    setViewLoading(true);
    try {
      const formData = new FormData();
      formData.append('trans_no', trans_no);
      formData.append('type', type);

      const response = await axios.post(
        'http://ercon.de2solutions.com/mobile_dash/view_data.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('View API Response:', response.data);

      // Navigate to View Details Screen with the API data
      navigation.navigate('ViewDetailsScreen', {
        viewData: response.data,
      });
    } catch (error) {
      console.log('View API Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch details',
      });
    } finally {
      setViewLoading(false);
    }
  };

  const handleApprovePress = async () => {
    setApproveLoading(true);
    try {
      await onApprove();
    } finally {
      setApproveLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadLoading(true);
    try {
      // First get the data
      const formData = new FormData();
      formData.append('trans_no', trans_no);
      formData.append('type', type);

      const response = await axios.post(
        'http://ercon.de2solutions.com/mobile_dash/view_data.php',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const data = response.data;
      await generateAndDownloadPDF(data);
    } catch (error) {
      console.log('PDF Download Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Download Failed',
        text2: 'Failed to download PDF',
      });
    } finally {
      setDownloadLoading(false);
    }
  };

  const generateAndDownloadPDF = async data => {
    try {
      const header = data.data_header?.[0];
      const details = data.data_detail || [];

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Add a page
      let page = pdfDoc.addPage([600, 800]);
      const {width, height} = page.getSize();

      // Embed fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let yPosition = height - 50;

      // Title
      page.drawText(`${header?.type || 'Document'} - ${reference}`, {
        x: 50,
        y: yPosition,
        size: 18,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 30;

      // Header Information
      page.drawText('Header Information:', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      yPosition -= 20;

      const headerFields = [
        {label: 'Reference:', value: header?.reference},
        {label: 'Date:', value: header?.trans_date},
        {label: 'Due Date:', value: header?.due_date},
        {label: 'Customer:', value: header?.name},
        {label: 'Location:', value: header?.location_name},
        {label: 'Salesman:', value: header?.salesman},
        {label: 'Payment Terms:', value: header?.payment_terms},
        {label: 'Total:', value: header?.total},
      ];

      headerFields.forEach(field => {
        if (field.value) {
          page.drawText(`${field.label} ${field.value}`, {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
        }
      });

      // Comments
      if (header?.comments) {
        yPosition -= 10;
        page.drawText('Comments:', {
          x: 50,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 15;

        const comments = header.comments;
        const words = comments.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line + word + ' ';
          if (testLine.length > 80) {
            page.drawText(line, {
              x: 50,
              y: yPosition,
              size: 10,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= 12;
            line = word + ' ';
          } else {
            line = testLine;
          }
        }
        if (line) {
          page.drawText(line, {
            x: 50,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 12;
        }
      }

      yPosition -= 20;

      // Items Details
      if (details.length > 0) {
        page.drawText('Items Details:', {
          x: 50,
          y: yPosition,
          size: 14,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;

        details.forEach((item, index) => {
          // Check if we need a new page
          if (yPosition < 150) {
            page = pdfDoc.addPage([600, 800]);
            yPosition = height - 50;
          }

          page.drawText(`Item ${index + 1}:`, {
            x: 50,
            y: yPosition,
            size: 12,
            font: boldFont,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;

          const itemFields = [
            {label: 'Description:', value: item.description},
            {label: 'Stock ID:', value: item.stock_id},
            {label: 'Quantity:', value: item.quantity},
            {label: 'Unit Price:', value: item.unit_price},
            {
              label: 'Discount:',
              value: item.discount_percent ? `${item.discount_percent}%` : null,
            },
          ];

          itemFields.forEach(field => {
            if (field.value) {
              page.drawText(`${field.label} ${field.value}`, {
                x: 70,
                y: yPosition,
                size: 10,
                font: font,
                color: rgb(0, 0, 0),
              });
              yPosition -= 12;
            }
          });

          // Long Description
          if (item.long_description) {
            yPosition -= 5;
            page.drawText('Description:', {
              x: 70,
              y: yPosition,
              size: 10,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
            yPosition -= 12;

            const longDesc = item.long_description;
            const descWords = longDesc.split(' ');
            let descLine = '';
            for (const word of descWords) {
              const testDescLine = descLine + word + ' ';
              if (testDescLine.length > 70) {
                page.drawText(descLine, {
                  x: 70,
                  y: yPosition,
                  size: 9,
                  font: font,
                  color: rgb(0, 0, 0),
                });
                yPosition -= 10;
                descLine = word + ' ';
              } else {
                descLine = testDescLine;
              }
            }
            if (descLine) {
              page.drawText(descLine, {
                x: 70,
                y: yPosition,
                size: 9,
                font: font,
                color: rgb(0, 0, 0),
              });
              yPosition -= 10;
            }
          }

          yPosition -= 15;
        });
      }

      // Save PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Get PUBLIC download directory path (not app-specific)
      const downloadDir = RNBlobUtil.fs.dirs.DownloadDir;

      // For Android, use the public Downloads folder
      let downloadPath;
      if (Platform.OS === 'android') {
        // Use the public Downloads directory
        downloadPath = `/storage/emulated/0/Download/${reference}_${Date.now()}.pdf`;
      } else {
        // For iOS, use the Documents directory
        downloadPath = `${downloadDir}/${reference}_${Date.now()}.pdf`;
      }

      // Convert Uint8Array to base64
      const pdfBase64 = arrayBufferToBase64(pdfBytes);

      // Write file to public download directory
      await RNBlobUtil.fs.writeFile(downloadPath, pdfBase64, 'base64');

      Toast.show({
        type: 'success',
        text1: 'PDF Downloaded',
        text2: `File saved to Downloads folder`,
        visibilityTime: 3000,
      });

      console.log('PDF saved to public folder:', downloadPath);
    } catch (error) {
      console.log('PDF Generation Error:', error);
      throw error;
    }
  };

  // Helper function to convert Uint8Array to base64
  const arrayBufferToBase64 = buffer => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <LinearGradient
      colors={[APPCOLORS.Primary, APPCOLORS.Secondary]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.screen}>
      <ScrollView contentContainerStyle={{padding: 15}}>
        <Animated.View
          entering={FadeInUp.delay(200)}
          style={styles.cardWrapper}>
          <LinearGradient
            colors={[APPCOLORS.Primary, APPCOLORS.Secondary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            {/* Top row: Reference */}
            <View style={styles.topRow}>
              <AppText
                title={reference}
                titleSize={2}
                titleColor={APPCOLORS.WHITE}
                titleWeight
              />
            </View>

            {/* Details */}
            <View style={styles.detailsContainer}>
              <AppText
                title={`Date: ${ord_date}`}
                titleSize={2}
                titleColor={APPCOLORS.WHITE}
              />
              <AppText
                title={name}
                titleSize={2}
                titleColor={APPCOLORS.WHITE}
              />
              <AppText
                title={`Total: ${total}`}
                titleSize={2}
                titleColor={APPCOLORS.WHITE}
                titleWeight
              />
            </View>

            {/* Buttons Row - Approve, View, and Download */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                onPress={handleApprovePress}
                disabled={approveLoading}
                style={styles.buttonWrapper}>
                <LinearGradient
                  colors={[APPCOLORS.Secondary, APPCOLORS.Primary]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.button}>
                  {approveLoading ? (
                    <ActivityIndicator size="small" color={APPCOLORS.WHITE} />
                  ) : (
                    <AppText
                      title="Approve"
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                      titleWeight
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleView}
                disabled={viewLoading}
                style={styles.buttonWrapper}>
                <LinearGradient
                  colors={[APPCOLORS.Secondary, APPCOLORS.Primary]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.button}>
                  {viewLoading ? (
                    <ActivityIndicator size="small" color={APPCOLORS.WHITE} />
                  ) : (
                    <AppText
                      title="View"
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                      titleWeight
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownloadPDF}
                disabled={downloadLoading}
                style={styles.buttonWrapper}>
                <LinearGradient
                  colors={[APPCOLORS.Secondary, APPCOLORS.Primary]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.button}>
                  {downloadLoading ? (
                    <ActivityIndicator size="small" color={APPCOLORS.WHITE} />
                  ) : (
                    <AppText
                      title="PDF"
                      titleSize={2}
                      titleColor={APPCOLORS.WHITE}
                      titleWeight
                    />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
});

export default ApprovalCard;
