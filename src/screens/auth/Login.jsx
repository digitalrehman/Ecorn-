import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../components/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {CurrentLogin, setLoader} from '../../redux/AuthSlice';

import Toast from 'react-native-toast-message';
import BaseUrl from '../../utils/BaseUrl';
import {APPCOLORS} from '../../utils/APPCOLORS';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const Loading = useSelector(state => state.Data.Loading);

  const loginUser = () => {
    if (username == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter a username',
      });
      return;
    } else if (password == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter a password',
      });
      return;
    }

    dispatch(setLoader(true));
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BaseUrl}users.php`,
      headers: {},
    };

    dispatch(CurrentLogin({config, username, password}));
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[APPCOLORS.Primary, APPCOLORS.Secondary, APPCOLORS.HALFWITE]}
        style={{flex: 1, paddingBottom: 20}}>
        <ScrollView
          style={{marginTop: 60}}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 50}}>
          {/* Logo */}
          <Image
            source={require('../../assets/images/Rider.png')}
            style={{
              alignSelf: 'center',
              height: 160,
              width: 160,
              borderRadius: 80,
              marginBottom: 30,
              resizeMode: 'contain',
              backgroundColor: 'rgba(255,255,255,0.05)',
              padding: 10,
            }}
          />

          {/* Login Card */}
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 15,
              padding: 25,
              width: '90%',
              alignSelf: 'center',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 8,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
            <Text
              style={{
                color: APPCOLORS.WHITE,
                fontSize: 32,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 25,
              }}>
              Welcome Back
            </Text>

            {/* Username Input */}
            <TextInput
              placeholder="Email or Username"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={{
                color: APPCOLORS.WHITE,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginBottom: 15,
                fontSize: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
              onChangeText={txt => setUsername(txt)}
              value={username}
            />

            {/* Password Input */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
              style={{
                color: APPCOLORS.WHITE,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                paddingHorizontal: 15,
                paddingVertical: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.15)',
              }}
              onChangeText={txt => setPassword(txt)}
              value={password}
            />

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={loginUser}>
              <Text style={styles.text}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Login;


const styles = StyleSheet.create({
  button: {
    backgroundColor: APPCOLORS.BLACK, // theme ka color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    marginTop: 20
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 'bold',
  },
});
