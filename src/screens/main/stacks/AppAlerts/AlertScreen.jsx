// AlertScreen.tsx
import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import SimpleHeader from '../../../../components/SimpleHeader'
import AlertCards from '../../../../components/AlertCards'
import axios from 'axios'
import { APPCOLORS } from '../../../../utils/Colors'

const AlertScreen = ({ navigation }: any) => {
  const [AllData, setAllData] = useState<any>()
  const [Loading, setLoading] = useState(false)

  useEffect(() => {
    getAllData()
  }, [])

  const getAllData = async () => {
    setLoading(true)
    try {
      const res = await axios.get('https://erp.speridian.pk/api/v1/dashboard/approval')
      setAllData(res.data)
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  if (Loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={APPCOLORS.Primary} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <SimpleHeader title="Alerts" />
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        
        {/* Sales Alert */}
        <AlertCards
          AlertHeading="Sales Alert"
          HeadingOne="Sale Quotation"
          ValueOne={AllData?.approval_data?.quotation_approval}
          IconOne="file-text"
          onValuePressOne={() => navigation.navigate('SaleQuotationScreen')}

          HeadingTwo="Sale Order"
          ValueTwo={AllData?.approval_data?.so_approval}
          IconTwo="shopping-cart"
          onValuePressTwo={() => navigation.navigate('SaleOrderScreen')}

          HeadingThree="Sale Delivery"
          ValueThree={AllData?.approval_data?.delivery_approval}
          IconThree="truck"
          onValuePressThree={() => navigation.navigate('SaleDeliveryScreen')}
        />

        {/* Purchase Alert */}
        <AlertCards
          AlertHeading="Purchase Alert"
          HeadingOne="Purchase Order"
          ValueOne={AllData?.approval_data?.po_approval}
          IconOne="clipboard-list"
          onValuePressOne={() => navigation.navigate('PurchaseOrderScreen')}

          HeadingTwo="GRN Approval"
          ValueTwo={AllData?.approval_data?.grn_approval}
          IconTwo="check-square"
          onValuePressTwo={() => navigation.navigate('GrnApprovalScreen')}
        />

        {/* Inventory Alert */}
        <AlertCards
          AlertHeading="Inventory Alert"
          HeadingOne="Location Transfer"
          ValueOne={AllData?.approval_data?.location_transfer}
          IconOne="exchange-alt"
          onValuePressOne={() => navigation.navigate('LocationTransferScreen')}
        />

        {/* Account Approval */}
        <AlertCards
          AlertHeading="Account Approval"
          HeadingOne="Voucher Approval"
          ValueOne={AllData?.approval_data?.voucher_approval}
          IconOne="file-invoice-dollar"
          onValuePressOne={() => navigation.navigate('VoucherApprovalScreen')}
        />

      </ScrollView>
    </View>
  )
}

export default AlertScreen
