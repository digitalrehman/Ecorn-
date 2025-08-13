import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
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
          {/* Company Name instead of Logo */}
          <Image
            source={require('../../assets/images/Rider.png')}
            style={{
              height: 160,
              width: 160,
              borderRadius: 80,
              marginBottom: 15,
              alignSelf: 'center',
            }}
          />
          {/* Company Name */}
          <View style={{alignItems: 'center', marginBottom: 35}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: APPCOLORS.WHITE,
                textAlign: 'center',
              }}>
              ERCON INDUSTRIES
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: APPCOLORS.WHITE,
                textAlign: 'center',
                opacity: 0.8,
              }}>
              PVT Limited
            </Text>
          </View>

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
            {/* Username Input */}
            <TextInput
              placeholder="Email or Username"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              onChangeText={txt => setUsername(txt)}
              value={username}
            />

            {/* Password Input */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.6)"
              secureTextEntry
              style={styles.input}
              onChangeText={txt => setPassword(txt)}
              value={password}
            />

            {/* Button with Loader */}
            <TouchableOpacity
              style={styles.button}
              onPress={loginUser}
              disabled={Loading}>
              {Loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.text}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    color: APPCOLORS.WHITE,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  button: {
    backgroundColor: APPCOLORS.BLACK,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    marginTop: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
