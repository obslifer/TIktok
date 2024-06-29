/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {signUpWithEmailPassword, signUpWithPhone, sendVerificationCode} from '../services/firebase';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEmailPasswordSignUp = async () => {
    try {
      await signUpWithEmailPassword(email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneSignUp = async () => {
    try {
      if (verificationCode) {
        await signUpWithPhone(phone, verificationCode);
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
      <Text style={styles.title}>Inscription</Text>

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
      <Button
        title="S'inscrire avec Email"
        onPress={handleEmailPasswordSignUp}
      />

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
      <Button title="S'inscrire avec Téléphone" onPress={handlePhoneSignUp} />
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

export default SignupScreen;
