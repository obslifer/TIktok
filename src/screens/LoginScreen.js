/* eslint-disable prettier/prettier */

// pages/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { signInWithGoogle, signInWithEmailPassword, signInWithPhone, sendVerificationCode } from '../services/firebase';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailPasswordSignIn = async () => {
    try {
      await signInWithEmailPassword(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneSignIn = async () => {
    try {
      if (verificationCode) {
        await signInWithPhone(phone, verificationCode);
        navigation.navigate('Home');
      } else {
        // Envoyer le code de vérification
        await sendVerificationCode(phone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <Button title="Se connecter avec Google" onPress={handleGoogleSignIn} />

      <Text style={styles.or}>OU</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Se connecter avec Email" onPress={handleEmailPasswordSignIn} />

      <Text style={styles.or}>OU</Text>

      <TextInput
        style={styles.input}
        placeholder="Numéro de téléphone"
        value={phone}
        onChangeText={setPhone}
      />
      {verificationCode ? (
        <TextInput
          style={styles.input}
          placeholder="Code de vérification"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
      ) : null}
      <Button title="Se connecter avec Téléphone" onPress={handlePhoneSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10
  },
  or: {
    textAlign: 'center',
    marginVertical: 10
  }
});

export default LoginScreen;
