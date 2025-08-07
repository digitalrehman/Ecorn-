import { View, Text } from 'react-native'
import React from 'react'

const NameandValue = ({title, value,valColour}) => {
  return (
    <View style={{flexDirection:'row', justifyContent:'space-between' , alignItems:'center', }}>
        <Text style={{color:"black", fontWeight:'bold', fontSize: title == "Name" ? 20: 14}}>{title}</Text>

        <View style={{backgroundColor: valColour ? valColour : title == "Name" ? "lightgreen" :  null, paddingHorizontal:10, paddingVertical:5, borderRadius:20}}>

        <Text style={{color: "black", fontSize: title == "Name" ? 20: 14 }}>{value}</Text>
        </View>
        
    </View>
  )
}

export default NameandValue