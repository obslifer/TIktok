/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {signUpWithEmailPassword, signUpWithPhone, sendVerificationCode} from '../services/firebase';
import {auth} from '../services/firebase';

const HomeScreen = ({navigation}) => {
    const userid = auth().currentUser.uid;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userid}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;
