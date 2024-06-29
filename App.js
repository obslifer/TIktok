/* eslint-disable prettier/prettier */
// App.js

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileCreationScreen from './src/screens/ProfileCreationScreen';
import VideoList from './src/screens/VideoList';
import imagePickerStructure from './src/screens/imagePickerStructure';
import { doesUserProfileExist } from './src/services/firebase';


const Stack = createStackNavigator();

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
            <>
              <Stack.Screen name="ProfilCreation" component={ProfileCreationScreen} />
              <Stack.Screen name="VideoList" component={VideoList} />
              <Stack.Screen name="imagePicker" component={imagePickerStructure} />
              <Stack.Screen name="Home" component={HomeScreen} />
            </>
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
