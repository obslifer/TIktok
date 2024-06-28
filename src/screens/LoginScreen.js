/* eslint-disable prettier/prettier */

import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {signInWithGoogle} from '../services/firebase';
import {
    GoogleSignin,
  } from '@react-native-google-signin/google-signin';

const LoginScreen = ({navigation}) => {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
            '995307560873-s8lkk955joihu7fvtmr467uan93blbuu.apps.googleusercontent.com',
        });
        }, []);

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigation.navigate('Profile', {user});
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TikTok Clone</Text>
      <Button title="Sign in with Google" onPress={handleGoogleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginScreen;
