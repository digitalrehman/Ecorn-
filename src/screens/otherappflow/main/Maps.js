// import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from 'react-native'
// import React from 'react'

// import Ionicons from 'react-native-vector-icons/Ionicons'
// import LinearGradient from 'react-native-linear-gradient'
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import Octicons from 'react-native-vector-icons/Octicons'
// import EvilIcons from 'react-native-vector-icons/EvilIcons'
// import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
// import { APPCOLORS } from '../../../utils/APPCOLORS'

// const Maps = ({navigation}) => {
//   return (
//     <View style={{ flex: 1, backgroundColor: APPCOLORS.WHITE }}>

//       <View>


//         <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: APPCOLORS.BTN_COLOR, borderBottomRightRadius: 10, borderBottomLeftRadius: 10, height: 70, flexDirection: 'row', justifyContent: 'space-between' }}>
//           <TouchableOpacity onPress={()=> navigation.goBack()}>
//             <Ionicons
//               name={'chevron-back'}
//               color={APPCOLORS.WHITE}
//               size={30}
//             />
//           </TouchableOpacity>

//           <Text style={{ color: 'white', fontSize: 20 }}>Map</Text>

//           <View style={{ width: 30 }} />
//         </View>
//       </View>


//       <MapView
//         provider={PROVIDER_GOOGLE} // remove if not using Google Maps
//         style={{ flex: 1 }}
//         region={{
//           latitude: 37.78825,
//           longitude: -122.4324,
//           latitudeDelta: 0.015,
//           longitudeDelta: 0.0121,
//         }}
//       >
//       </MapView>


//       <TouchableOpacity style={{ height: 50, width: '90%', alignSelf: 'center', backgroundColor: APPCOLORS.BTN_COLOR, borderRadius: 10, marginBottom: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
//         <Text style={{ color: APPCOLORS.WHITE, fontSize: 20 }}>Unlock</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default Maps
import { View, Text } from 'react-native'
import React from 'react'

const Maps = () => {
  return (
    <View>
      <Text>Maps</Text>
    </View>
  )
}

export default Maps