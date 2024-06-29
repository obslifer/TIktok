/* eslint-disable prettier/prettier */
// App.js

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileCreationScreen from './src/screens/ProfileCreationScreen';
import VideoList from './src/screens/VideoList';
import imagePickerStructure from './src/screens/imagePickerStructure';
import Account from './src/screens/account';
import Camera from './src/screens/Camera/index'; 
import AddInformation from './src/screens/addInformation';
import Comments from './src/screens/comments'; 
import { doesUserProfileExist } from './src/services/firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Videos" component={VideoList} />
      <Tab.Screen name="Camera" component={Camera} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const profileExists = await doesUserProfileExist(user.uid);
        setProfileExists(profileExists);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          profileExists ? (
            <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="ProfileCreation" component={ProfileCreationScreen} />
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
