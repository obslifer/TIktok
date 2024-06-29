/* eslint-disable prettier/prettier */
// src/navigation/AppNavigator.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import DisciplineScreen from '../screens/DisciplineScreen';
import LiveScreen from '../screens/LiveStreamingScreen';
import HomeScreen from '../screens/HomeScreen';


const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="live" component={LiveScreen} />
      <Stack.Screen name="discipline" component={DisciplineScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
