import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { APPCOLORS } from '../utils/APPCOLORS';

const GetStartedScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/images/getstartedbg.jpg')}
      style={styles.background}
      blurRadius={3}>

      {/* Dark Shade on Image */}
      <View style={styles.imageOverlay} />

      {/* Content */}
      <View style={styles.overlay}>
        <Text style={styles.title}>ERCON INDUSTRIES PVT Limited</Text>
        <Text style={styles.subtitle}>
          Get started with us for a great gare swicth
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlay: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: APPCOLORS.WHITE,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: APPCOLORS.WHITE,
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: APPCOLORS.Primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: APPCOLORS.Secondary,
  },
  buttonText: {
    fontSize: 16,
    color: APPCOLORS.WHITE,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
