// import {View, Text, TextInput} from 'react-native';
// import React, {useState} from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import AppText from '../../components/AppText';
// import {APPCOLORS} from '../../utils/APPCOLORS';
// import AppInput from '../../components/AppInput';
// import {responsiveFontSize, responsiveHeight} from '../../utils/Responsive';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import AppButton from '../../components/AppButton';
// import {useDispatch} from 'react-redux';
// import {CurrentLogin, setLoader} from '../../redux/AuthSlice';
// import Toast from 'react-native-toast-message';
// import BaseUrl from '../../utils/BaseUrl';

// const Login = ({navigation}) => {
//   const dispatch = useDispatch();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');



//   const loginUser = () => {
//     if (username == '') {
//       Toast.show({
//         type: 'error',
//         text1: 'Please enter a username',
//       });
//       return;
//     } else if (password == '') {
//       Toast.show({
//         type: 'error',
//         text1: 'Please enter a password',
//       });
//       return;
//     }

//     dispatch(setLoader(true))
//     let config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: `${BaseUrl}users.php`,
//       headers: {},
//     };

//     dispatch(CurrentLogin({config, username, password}));

//   };
//   return (
//     <LinearGradient
//       colors={['#0784B5', '#9BD4E4']}
//       start={{x: 0, y: 0}}
//       end={{x: 1, y: 0}}
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: responsiveHeight(15),
//       }}>
//       <AppText
//         title="DeSolutions"
//         titleSize={4}
//         titleWeight
//         titleColor={APPCOLORS.WHITE}
//       />

//       <View style={{gap: 20}}>
//         <AppInput
//           logo={
//             <Ionicons
//               name={'person'}
//               size={responsiveFontSize(2)}
//               color={APPCOLORS.WHITE}
//             />
//           }
//           placeHolder="Username"
//           onChangeText={res => setUsername(res)}
//           value={username}
//           txtColor={APPCOLORS.WHITE}
//         />
//         <AppInput
//           logo={
//             <FontAwesome5
//               name={'key'}
//               size={responsiveFontSize(2)}
//               color={APPCOLORS.WHITE}
//             />
//           }
//           placeHolder="Password"
//           onChangeText={res => setPassword(res)}
//           value={password}
//           txtColor={APPCOLORS.WHITE}
//           secureTextEntry={true}
//         />
       
//       </View>

//       <AppButton title="Login" onPress={() =>loginUser()} />
//     </LinearGradient>
//   );
// };

// export default Login;




import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import AppButton from '../../components/AppButton';
import { useDispatch, useSelector } from 'react-redux';
import {CurrentLogin, setLoader} from '../../redux/AuthSlice';

import Toast from 'react-native-toast-message';
import BaseUrl from '../../utils/BaseUrl';
import { APPCOLORS } from '../../utils/APPCOLORS';

const Login = ({ navigation }) => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()

    const Loading = useSelector(state => state.Data.Loading)


  
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

    dispatch(setLoader(true))
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BaseUrl}users.php`,
      headers: {},
    };

    dispatch(CurrentLogin({config, username, password}));

  };

    

    return (
        <LinearGradient colors={[APPCOLORS.Primary, APPCOLORS.Primary, APPCOLORS.Secondary]} style={{ flex: 1, paddingBottom: 20, justifyContent: 'space-around' }}>
          <ScrollView contentContainerStyle={{flexGrow:1, }}>
            <Image source={require('../../assets/images/Rider.png')} style={{ alignSelf: 'center', height: 300, width: 300, resizeMode: 'contain', marginTop: 30 }} />

            <View style={{ backgroundColor: APPCOLORS.CLOSETOWHITE, elevation: 10, width: '90%', alignSelf: 'center', borderRadius: 10, padding: 20 }}>
                <Text style={{ color: APPCOLORS.BLACK, fontSize: 30, fontWeight: 'bold' }}>Login</Text>

                <TextInput
                    placeholder='Email or username'
                    style={{ color: APPCOLORS.BLACK, backgroundColor: APPCOLORS.TEXTFIELDCOLOR, borderRadius: 10, marginTop: 20, paddingHorizontal: 10 }}
                    onChangeText={(txt) => {
                        setUsername(txt)
                    }}
                    value={username}
                />

                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={{ color: APPCOLORS.BLACK, backgroundColor: APPCOLORS.TEXTFIELDCOLOR, borderRadius: 10, paddingHorizontal: 10, marginTop: 10 }}
                    onChangeText={(txt) => {
                        setPassword(txt)
                    }}
                    value={password}
                />

                <View style={{ marginTop: 40 , alignItems:'center', justifyContent:'center', }}>
                           <AppButton title="Login" onPress={() =>loginUser()}  btnWidth={80}/>
                </View>
            </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default Login