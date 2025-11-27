import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import RNBlobUtil from 'react-native-blob-util';
import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';

export const generateAndDownloadPDF = async (data, reference) => {
  try {
    const header = data.data_header?.[0];
    const details = data.data_detail || [];

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page with A4 size
    let page = pdfDoc.addPage([595, 842]);
    const {width, height} = page.getSize();

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;

    // Title - Use type from header data
    const documentType = header?.type || 'Document';
    page.drawText(`${documentType} - ${reference}`, {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0.2, 0.4, 0.6),
    });
    yPosition -= 40;

    // Header Information - Simple and clean
    page.drawText('Document Information', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0.2, 0.4, 0.6),
    });
    yPosition -= 25;

    const headerFields = [
      {label: 'Reference:', value: header?.reference},
      {label: 'Date:', value: header?.trans_date},
      {label: 'Due Date:', value: header?.due_date},
      {label: 'Type:', value: header?.type},
      {label: 'Customer:', value: header?.name},
      {label: 'Location:', value: header?.location_name},
      {label: 'Salesman:', value: header?.salesman},
      {label: 'Payment Terms:', value: header?.payment_terms},
      {label: 'Total Amount:', value: header?.total},
    ];

    headerFields.forEach(field => {
      if (field.value) {
        page.drawText(`${field.label}`, {
          x: 50,
          y: yPosition,
          size: 10,
          font: boldFont,
          color: rgb(0.3, 0.3, 0.3),
        });

        page.drawText(field.value.toString(), {
          x: 150,
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
        size: 11,
        font: boldFont,
        color: rgb(0.2, 0.4, 0.6),
      });
      yPosition -= 15;

      const comments = header.comments;
      const lines = wrapText(comments, 80);

      lines.forEach(line => {
        if (yPosition < 100) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = height - 50;
        }

        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 9,
          font: font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 10;
      });

      yPosition -= 10;
    }

    yPosition -= 20;

    // Items Details
    if (details.length > 0) {
      page.drawText('Items Details', {
        x: 50,
        y: yPosition,
        size: 14,
        font: boldFont,
        color: rgb(0.2, 0.4, 0.6),
      });
      yPosition -= 30;

      details.forEach((item, index) => {
        if (yPosition < 150) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = height - 50;
        }

        page.drawText(`Item ${index + 1}:`, {
          x: 50,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0.2, 0.4, 0.6),
        });
        yPosition -= 20;

        const leftColumn = [
          {label: 'Description:', value: item.description},
          {label: 'Stock ID:', value: item.stock_id},
          {label: 'Quantity:', value: item.quantity},
        ];

        const rightColumn = [
          {label: 'Unit Price:', value: item.unit_price},
          {
            label: 'Discount:',
            value: item.discount_percent ? `${item.discount_percent}%` : '0%',
          },
          {
            label: 'Total:',
            value: (
              parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0)
            ).toFixed(2),
          },
        ];

        // Draw left column
        leftColumn.forEach(field => {
          if (field.value) {
            page.drawText(`${field.label}`, {
              x: 60,
              y: yPosition,
              size: 9,
              font: boldFont,
              color: rgb(0.3, 0.3, 0.3),
            });

            page.drawText(field.value.toString(), {
              x: 120,
              y: yPosition,
              size: 9,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= 14;
          }
        });

        // Draw right column
        yPosition += leftColumn.filter(field => field.value).length * 14;
        rightColumn.forEach(field => {
          if (field.value) {
            page.drawText(`${field.label}`, {
              x: 300,
              y: yPosition,
              size: 9,
              font: boldFont,
              color: rgb(0.3, 0.3, 0.3),
            });

            page.drawText(field.value.toString(), {
              x: 360,
              y: yPosition,
              size: 9,
              font: font,
              color: rgb(0, 0, 0),
            });
            yPosition -= 14;
          }
        });

        yPosition -= 10;

        // Long Description
        if (item.long_description) {
          page.drawText('Detailed Description:', {
            x: 60,
            y: yPosition,
            size: 9,
            font: boldFont,
            color: rgb(0.3, 0.3, 0.3),
          });
          yPosition -= 12;

          const longDesc = item.long_description;
          const descLines = wrapText(longDesc, 100);

          descLines.forEach(line => {
            if (yPosition < 100) {
              page = pdfDoc.addPage([595, 842]);
              yPosition = height - 50;
            }

            page.drawText(line, {
              x: 70,
              y: yPosition,
              size: 8,
              font: font,
              color: rgb(0.2, 0.2, 0.2),
            });
            yPosition -= 9;
          });
        }

        yPosition -= 20;

        if (index < details.length - 1) {
          page.drawLine({
            start: {x: 50, y: yPosition},
            end: {x: width - 50, y: yPosition},
            thickness: 0.5,
            color: rgb(0.8, 0.8, 0.8),
          });
          yPosition -= 15;
        }
      });
    }

    // Footer with page numbers
    const totalPages = pdfDoc.getPageCount();
    pdfDoc.getPages().forEach((page, index) => {
      page.drawText(`Page ${index + 1} of ${totalPages}`, {
        x: width - 100,
        y: 30,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: 30,
        size: 8,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    });

    const pdfBytes = await pdfDoc.save();

    let downloadPath;
    if (Platform.OS === 'android') {
      downloadPath = `${
        RNBlobUtil.fs.dirs.DownloadDir
      }/${reference}_${Date.now()}.pdf`;
    } else {
      downloadPath = `${
        RNBlobUtil.fs.dirs.DocumentDir
      }/${reference}_${Date.now()}.pdf`;
    }

    // Convert to base64 and save
    const pdfBase64 = arrayBufferToBase64(pdfBytes);
    await RNBlobUtil.fs.writeFile(downloadPath, pdfBase64, 'base64');

    Toast.show({
      type: 'success',
      text1: 'PDF Downloaded Successfully',
      text2: `File saved to Downloads`,
      visibilityTime: 3000,
    });

    console.log('PDF saved to:', downloadPath);
    return downloadPath;
  } catch (error) {
    console.log('PDF Generation Error:', error);
    throw error;
  }
};

// Helper function to wrap text
const wrapText = (text, maxLineLength) => {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    if ((currentLine + word).length <= maxLineLength) {
      currentLine += (currentLine === '' ? '' : ' ') + word;
    } else {
      if (currentLine !== '') {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });

  if (currentLine !== '') {
    lines.push(currentLine);
  }

  return lines;
};

const arrayBufferToBase64 = buffer => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
