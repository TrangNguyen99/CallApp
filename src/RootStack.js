import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import CallingScreen from './CallingScreen';
import HomeScreen from './HomeScreen';
import IncomingCallScreen from './IncomingCallScreen';
import LoginScreen from './LoginScreen';

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
      <Stack.Screen component={HomeScreen} name="HomeScreen" />
      <Stack.Screen component={CallingScreen} name="CallingScreen" />
      <Stack.Screen component={IncomingCallScreen} name="IncomingCallScreen" />
    </Stack.Navigator>
  );
};

export default RootStack;
