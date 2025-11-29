import React from 'react';
import {
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { BASEURL } from '../utils/BaseUrl';

// MIME type helper function
const getMimeType = (extension) => {
  const mimeTypes = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg', 
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'zip': 'application/zip',
    'txt': 'text/plain'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

// Storage permission function
const requestStoragePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version < 30) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download files',
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

// Show toast message
const showToast = (message, duration = ToastAndroid.SHORT) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, duration);
  } else {
    console.log('Toast:', message);
  }
};

// File type detection from content (Buffer ke bina)
const detectFileTypeFromContent = async (filePath) => {
  try {
    // Pehle 100 bytes read karen file type detect karne ke liye
    const base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64', 100);
    
    console.log('Base64 first 20 chars:', base64Data.substring(0, 20));

    // Base64 signatures check karen
    if (base64Data.startsWith('JVBERi0') || base64Data.includes('%PDF')) {
      return 'pdf';
    }
    if (base64Data.startsWith('/9j/') || base64Data.includes('/9j/')) {
      return 'jpg';
    }
    if (base64Data.startsWith('iVBORw0KGgo') || base64Data.includes('PNG')) {
      return 'png';
    }
    if (base64Data.startsWith('UEsDB') || base64Data.startsWith('PK')) {
      return 'docx'; // ZIP based files (DOCX, XLSX, PPTX)
    }
    if (base64Data.startsWith('0M8R4')) {
      return 'doc'; // Old MS Office
    }

    // Text content check karen
    try {
      const textContent = await RNFetchBlob.fs.readFile(filePath, 'utf8', 100);
      if (textContent.includes('%PDF')) return 'pdf';
      if (textContent.includes('PNG')) return 'png';
      if (textContent.includes('JFIF')) return 'jpg';
    } catch (textError) {
      // Binary file hai, text read nahi ho sakta
    }

    return 'bin';
  } catch (error) {
    console.log('File type detection error:', error);
    return 'bin';
  }
};

// Main download function with proper file type detection
export const downloadFile = async (trans_no, type) => {
  console.log('Starting download for:', {trans_no, type});
    
  try {
    showToast('Download starting...', ToastAndroid.SHORT);

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      showToast('Storage permission required', ToastAndroid.LONG);
      return false;
    }

    // Pehle file info ke liye dattachment_view.php call karen
    const formData = new FormData();
    formData.append('type', type);
    formData.append('trans_no', trans_no);

    let fileExtension = 'pdf'; // default
    let fileUrl = '';
    
    try {
      const infoResponse = await fetch(`${BASEURL}dattachment_view.php`, {
        method: 'POST',
        body: formData,
      });
      
      const fileInfo = await infoResponse.json();
      console.log('File info:', fileInfo);

      if (fileInfo?.url) {
        fileUrl = fileInfo.url;
        
        // Temporary file download karen type detect karne ke liye
        const tempPath = `${RNFetchBlob.fs.dirs.DownloadDir}/temp_${trans_no}_${Date.now()}.tmp`;
        
        const tempRes = await RNFetchBlob.config({
          fileCache: true,
        }).fetch('GET', fileUrl);

        // File type detect karen content se
        fileExtension = await detectFileTypeFromContent(tempRes.path());
        console.log('Detected file type:', fileExtension);
        
        // Temporary file delete karen
        await RNFetchBlob.fs.unlink(tempRes.path());
      }
    } catch (infoError) {
      console.log('File info fetch error:', infoError);
      // Fallback: type parameter ke basis pe
      if (type === '1') fileExtension = 'pdf';
      else if (type === '2') fileExtension = 'jpg';
      else if (type === '3') fileExtension = 'png';
    }

    // Agar file type detect nahi hua, toh type parameter use karen
    if (fileExtension === 'bin') {
      if (type === '1') fileExtension = 'pdf';
      else if (type === '2') fileExtension = 'jpg';
      else if (type === '3') fileExtension = 'png';
    }

    showToast(`Downloading ${fileExtension.toUpperCase()} file...`, ToastAndroid.SHORT);

    const downloadPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${trans_no}.${fileExtension}`;

    // Download the file with correct extension
    if (fileUrl) {
      console.log('Downloading from URL:', fileUrl);
      const res = await RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: `Downloading ${trans_no}`,
          description: 'File download in progress',
          mime: getMimeType(fileExtension),
          path: downloadPath,
        },
      }).fetch('GET', fileUrl);
    }

    console.log('File saved to:', downloadPath);
    
    // Verify file download
    try {
      const fileExists = await RNFetchBlob.fs.exists(downloadPath);
      if (fileExists) {
        const fileStats = await RNFetchBlob.fs.stat(downloadPath);
        console.log('File stats - Size:', fileStats.size, 'bytes');
        
        if (fileStats.size > 0) {
          showToast(`${trans_no}.${fileExtension} downloaded successfully`, ToastAndroid.LONG);
        } else {
          showToast('File downloaded but empty', ToastAndroid.LONG);
        }
      } else {
        showToast('File not saved properly', ToastAndroid.LONG);
      }
    } catch (verifyError) {
      console.log('File verification error:', verifyError);
      showToast('Download completed', ToastAndroid.LONG);
    }
    
    return true;
    
  } catch (err) {
    console.log('Download Error:', err);
    showToast('Download failed', ToastAndroid.LONG);
    return false;
  }
};

export default downloadFile;