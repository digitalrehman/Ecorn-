import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLargeData = async (key, data, chunkSize = 500) => {
  try {
    // Purana data clear kar do
    const keys = await AsyncStorage.getAllKeys();
    const relatedKeys = keys.filter(k => k.startsWith(key));
    if (relatedKeys.length) {
      await AsyncStorage.multiRemove(relatedKeys);
    }

    // Chunking
    const totalChunks = Math.ceil(data.length / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
      await AsyncStorage.setItem(`${key}_${i}`, JSON.stringify(chunk));
    }

    // Meta info (kitne chunks hain)
    await AsyncStorage.setItem(`${key}_meta`, JSON.stringify({ totalChunks }));
  } catch (err) {
    console.error('saveLargeData error:', err);
  }
};

export const loadLargeData = async (key) => {
  try {
    const meta = await AsyncStorage.getItem(`${key}_meta`);
    if (!meta) return null;

    const { totalChunks } = JSON.parse(meta);
    let result = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunkStr = await AsyncStorage.getItem(`${key}_${i}`);
      if (chunkStr) {
        result = result.concat(JSON.parse(chunkStr));
      }
    }
    return result;
  } catch (err) {
    console.error('loadLargeData error:', err);
    return null;
  }
};
