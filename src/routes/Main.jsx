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
import SalesScreen from '../screens/main/stacks/Sales/SalesScreen';
import PurchaseScreen from '../screens/main/stacks/purchase/PurchaseScreen';
import InventoryScreen from '../screens/main/stacks/Inventory/InventoryScreen';
import FinanceScreen from '../screens/main/stacks/Finance/FinanceScreen';
import ManufacturingScreen from '../screens/main/stacks/Manufacturing/ManufacturingScreen';
import PayrollScreen from '../screens/main/stacks/Payroll/PayrollScreen';
import CrmScreen from '../screens/main/stacks/Crm/CrmScreen';
import ReceivableScreen from '../screens/main/stacks/Sales/ReceivableScreen';
import UploadScreen from '../screens/main/stacks/Sales/UploadScreen';
import AttachDocumentScreen from '../screens/main/stacks/attachDocument/AttachDocumentScreen';
import VoucherScreen from '../screens/main/stacks/attachDocument/VoucherScreen';
import PurchaseOrder from '../screens/main/stacks/attachDocument/PurchaseOrder';
import PDFViewerScreen from '../screens/main/stacks/attachDocument/PDFViewerScreen';
import DeliveryScreen from '../screens/main/stacks/Sales/Delivery/DeliveryScreen';
import DeliveryNote from '../screens/main/stacks/Sales/Delivery/DeliveryNote';
import SaleOrder from '../screens/main/stacks/attachDocument/SaleOrder';
import TrackOrderStatus from '../screens/main/stacks/Sales/TrackOrderStatus';
import AddSuppliersScreen from '../screens/main/stacks/purchase/AddSuppliersScreen';
import AddLeadScreen from '../screens/main/stacks/Crm/AddLeadScreen';
import LeadsListScreen from '../screens/main/stacks/Crm/LeadsListScreen';
import ViewLeads from '../screens/main/stacks/Crm/ViewLeads';

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
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SalesScreen" component={SalesScreen} />
      <Stack.Screen name="PurchaseScreen" component={PurchaseScreen} />
      <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
      <Stack.Screen
        name="ManufacturingScreen"
        component={ManufacturingScreen}
      />
      <Stack.Screen name="FinanceScreen" component={FinanceScreen} />
      <Stack.Screen name="PayrollScreen" component={PayrollScreen} />
      <Stack.Screen name="CrmScreen" component={CrmScreen} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
      <Stack.Screen
        name="InsertNewCustomerDetail"
        component={InsertNewCustomerDetail}
      />
      <Stack.Screen name="Incentive" component={Incentive} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={Profile} />
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
      <Stack.Screen name="ReceivableScreen" component={ReceivableScreen} />
      <Stack.Screen name="UploadScreen" component={UploadScreen} />
      <Stack.Screen
        name="AttachDocumentScreen"
        component={AttachDocumentScreen}
      />
      <Stack.Screen name="VoucherScreen" component={VoucherScreen} />
      <Stack.Screen name="PurchaseOrder" component={PurchaseOrder} />
      <Stack.Screen name="PDFViewerScreen" component={PDFViewerScreen} />
      <Stack.Screen name="DeliveryScreen" component={DeliveryScreen} />
      <Stack.Screen name="DeliveryNote" component={DeliveryNote} />
      <Stack.Screen name="SaleOrder" component={SaleOrder} />
      <Stack.Screen name="TrackOrderStatus" component={TrackOrderStatus} />
      <Stack.Screen name="AddSuppliersScreen" component={AddSuppliersScreen} />
      <Stack.Screen name="AddLeadScreen" component={AddLeadScreen} />
      <Stack.Screen name="LeadsListScreen" component={LeadsListScreen} />
      <Stack.Screen name="ViewLeads" component={ViewLeads} />
    </Stack.Navigator>
  );
};

const OtherApp = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AddNewCustomer" component={AddNewCustomer} />
      <Stack.Screen
        name="InsertNewCustomerDetail"
        component={InsertNewCustomerDetail}
      />
      <Stack.Screen name="Incentive" component={Incentive} />
      <Stack.Screen name="AddItems" component={AddItems} />
      <Stack.Screen name="ItemList" component={ItemList} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Profile" component={Profile} />
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

export default Main;
