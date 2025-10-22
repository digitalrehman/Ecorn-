import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import {BASEURL} from '../../../utils/BaseUrl'
import { APPCOLORS } from '../../../utils/APPCOLORS'


const RecoveryOrder = ({ navigation }) => {

    const [todaysOrder, setTodaysOrder] = useState()
    const [loader, setLoader] = useState(false)

    const CurrentUser = useSelector(state => state.Data.currentData)


    useEffect(() => {
        getRecovery()
    }, [])

    const getRecovery = () => {

        setLoader(true)
        let data = new FormData();
        data.append('user_id', CurrentUser?.id);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${BASEURL}today_recovery_data.php`,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {

                setTodaysOrder(response.data.data)
                setLoader(false)

            })
            .catch((error) => {
                console.log(error);
                setLoader(false)
            });

    }


    return (
        <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Ionicons
                        name={"arrow-back"}
                        size={25}
                        color={"black"}
                    />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', color: APPCOLORS.BLACK, fontSize: 18, marginLeft: 10 }}>Recovery</Text>
            </View>
            {
                loader == true ?

                    <View style={{ height: "100%", alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={'large'} color={APPCOLORS.BLACK} />
                    </View>
                    :

                    <FlatList
                        data={todaysOrder}
                        renderItem={({ item }) => {

                            return (
                                <View style={{ marginTop: 20, backgroundColor: APPCOLORS.WHITE, padding: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 16, color: APPCOLORS.BLACK }}> <Text style={{ color: APPCOLORS.BLACK, fontWeight: 'bold', }}>Trans no :</Text> {item.trans_no}</Text>
                                    <Text style={{ fontSize: 16, color: APPCOLORS.BLACK }}> <Text style={{ color: APPCOLORS.BLACK, fontWeight: 'bold', }}>Name :</Text> {item.br_name}</Text>
                                    <Text style={{ fontSize: 16, color: APPCOLORS.BLACK }}> <Text style={{ color: APPCOLORS.BLACK, fontWeight: 'bold', }}>Ref No :</Text> {item.branch_ref}</Text>
                                    <Text style={{ fontSize: 16, color: APPCOLORS.BLACK }}> <Text style={{ color: APPCOLORS.BLACK, fontWeight: 'bold', }}>Tran date :</Text> {item.tran_date}</Text>
                                    <Text style={{ fontSize: 16, color: APPCOLORS.BLACK }}> <Text style={{ color: APPCOLORS.BLACK, fontWeight: 'bold', }}>Total Amount :</Text> {item.ov_amount}</Text>
                                </View>
                            )
                        }}
                    />
            }
        </View>
    )
}

export default RecoveryOrder