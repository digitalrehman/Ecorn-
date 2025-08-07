import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Dashboard from '../screens/main/Dashboard';
import Detail from '../screens/main/stacks/DetailScreens/Detail';
import NotificationScreen from '../screens/main/stacks/NotificationScreen';
import MoreDetail from '../screens/main/stacks/DetailScreens/MoreDetail';
import ViewAll from '../screens/main/stacks/DetailScreens/ViewAll';
import AlertScreen from '../screens/main/stacks/AppAlerts/AlertScreen';
import AlertsDetail from '../screens/main/stacks/AppAlerts/AlertsDetail';
import NormalViewAll from '../screens/main/stacks/DetailScreens/NormalViewAll';
import PdfScreen from '../screens/main/stacks/DetailScreens/PdfScreen';
import ProfitAndLossScreen from '../screens/main/stacks/ProfitAndLoss/ProfitAndLossScreen';
import ApprovalScreen from '../screens/main/stacks/ProfitAndLoss/ApprovalScreen';
import Aging from '../screens/main/stacks/AgingAndLedger/Aging';
import Ledger from '../screens/main/stacks/AgingAndLedger/Ledger';
import TopTenScreen from '../screens/main/stacks/DetailScreens/TopTen/TopTenScreen';
import AgingAndLedger from '../screens/main/stacks/AgingAndLedger/AgingAndLedger';
import ViewAllTopTen from '../screens/main/stacks/DetailScreens/TopTen/ViewAllTopTen';
import ShowUnapprovedDetails from '../screens/main/stacks/AppAlerts/ShowUnapprovedDetails';

//other app
import Home from '../screens/otherappflow/main/Home';
import AddNewCustomer from '../screens/otherappflow/main/AddNewCustomer';
import InsertNewCustomerDetail from '../screens/otherappflow/main/InsertNewCustomerDetail';
import Incentive from '../screens/otherappflow/main/Incentive';

import AddItems from '../screens/otherappflow/main/AddItems';
import ItemList from '../screens/otherappflow/main/ItemList';
import PaymentScreen from '../screens/otherappflow/main/PaymentScreen';
import Profile from '../screens/otherappflow/main/Profile';
import Maps from '../screens/otherappflow/main/Maps';
import NewOrders from '../screens/otherappflow/main/NewOrders';
import RecoveryOrder from '../screens/otherappflow/main/RecoveryOrder';
import Visit from '../screens/otherappflow/main/Visit';
import OfflineOrders from '../screens/otherappflow/main/OfflineOrders';
import SalesmanList from '../screens/otherappflow/main/SalesmanList';
import SalesmanCustomer from '../screens/otherappflow/main/SalesmanCustomer';
import AsmSalesman from '../screens/otherappflow/main/asm/AsmSalesman';
import AsmDimension from '../screens/otherappflow/main/asm/AsmDimension';
import TodayOrderDetails from '../screens/otherappflow/main/TodayOrderDetails';
import SupplierHome from '../screens/otherappflow/suppliers/SupplierHome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const StackScreens = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Profile" component={Dashboard} />
    </Tab.Navigator>
  );
};

const Main = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="MoreDetail" component={MoreDetail} />
      <Stack.Screen name="ViewAll" component={ViewAll} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="AlertScreen" component={AlertScreen} />
      <Stack.Screen name="AlertsDetail" component={AlertsDetail} />
      <Stack.Screen name="NormalViewAll" component={NormalViewAll} />
      <Stack.Screen name="PdfScreen" component={PdfScreen} />
      <Stack.Screen
        name="ProfitAndLossScreen"
        component={ProfitAndLossScreen}
      />
      <Stack.Screen name="ApprovalScreen" component={ApprovalScreen} />
      <Stack.Screen name="Aging" component={Aging} />
      <Stack.Screen name="Ledger" component={Ledger} />
      <Stack.Screen name="TopTenScreen" component={TopTenScreen} />
      <Stack.Screen name="ViewAllTopTen" component={ViewAllTopTen} />

      <Stack.Screen name="AgingAndLedger" component={AgingAndLedger} />
      <Stack.Screen
        name="ShowUnapprovedDetails"
        component={ShowUnapprovedDetails}
      />

    {/* old app */}
      {/* <Stack.Screen name="OtherApp" component={OtherApp} /> */}
       <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
      <Stack.Screen name="InsertNewCustomerDetail" component={InsertNewCustomerDetail} />
      <Stack.Screen name="Incentive" component={Incentive} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      {/* <Stack.Screen name="Maps" component={Maps} /> */}
      <Stack.Screen name="NewOrders" component={NewOrders} />
      <Stack.Screen name="RecoveryOrder" component={RecoveryOrder} />
      <Stack.Screen name="Visit" component={Visit} />
      <Stack.Screen name="OfflineOrders" component={OfflineOrders} />
      <Stack.Screen name="SalesmanList" component={SalesmanList} />
      <Stack.Screen name="SalesmanCustomer" component={SalesmanCustomer} />
      <Stack.Screen name="AsmSalesman" component={AsmSalesman} />
      <Stack.Screen name="AsmDimension" component={AsmDimension} />
      <Stack.Screen name="TodayOrderDetails" component={TodayOrderDetails} />
      <Stack.Screen name="SupplierHome" component={SupplierHome} />


      
      
    </Stack.Navigator>
  );
};

const OtherApp = () => {

   return (
    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
      <Stack.Screen name="InsertNewCustomerDetail" component={InsertNewCustomerDetail} />
      <Stack.Screen name="Incentive" component={Incentive} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      {/* <Stack.Screen name="Maps" component={Maps} /> */}
      <Stack.Screen name="NewOrders" component={NewOrders} />
      <Stack.Screen name="RecoveryOrder" component={RecoveryOrder} />
      <Stack.Screen name="Visit" component={Visit} />
      <Stack.Screen name="OfflineOrders" component={OfflineOrders} />
      <Stack.Screen name="SalesmanList" component={SalesmanList} />
      <Stack.Screen name="SalesmanCustomer" component={SalesmanCustomer} />
      <Stack.Screen name="AsmSalesman" component={AsmSalesman} />
      <Stack.Screen name="AsmDimension" component={AsmDimension} />
      <Stack.Screen name="TodayOrderDetails" component={TodayOrderDetails} />
      <Stack.Screen name="SupplierHome" component={SupplierHome} />


      
    </Stack.Navigator>

  )
};

export default Main;
