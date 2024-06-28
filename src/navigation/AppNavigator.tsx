import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddInformation from '../screens/addInformation';
import Account from '../screens/account';

const Stack = createStackNavigator();

const AppNavigator= () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddInformation">
        <Stack.Screen name="AddInformation" component={AddInformation} />
        <Stack.Screen name="Account" component={Account} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
