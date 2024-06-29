import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddInformation from './src/screens/addInformation';
import Account from './src/screens/account';
import Comments from './src/screens/comments';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AddInformation">
        <Stack.Screen name="AddInformation" component={AddInformation} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Comments" component={Comments} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
