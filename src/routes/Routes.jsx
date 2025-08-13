import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './Auth';
import Main from './Main';
import { useSelector } from 'react-redux';
import GetStartedScreen from '../screens/GetStartedScreen';

const Stack = createStackNavigator();

const Routes = () => {
  const token = useSelector(state => state.Data.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Stack.Screen name="Main" component={Main} />
      ) : (
        <>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Auth" component={Auth} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Routes;
