/* eslint-disable prettier/prettier */
// pages/ProfileCreationScreen.js

import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {saveUserInfo} from '../services/firebase';

const ProfileCreationScreen = ({navigation}) => {
  const [displayName, setDisplayName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');

  const handleSaveProfile = async () => {
    const user = auth().currentUser;

    if (user) {
      const profileData = {
        displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
        dateOfBirth: firestore.Timestamp.fromDate(
          new Date(dateOfBirth),
        ),
        country,
        city,
        gender,
        status,
        followers: [],
        following: [],
      };

      try {
        await saveUserInfo(user.uid, profileData);
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Création de Profil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (AAAA-MM-JJ)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <TextInput
        style={styles.input}
        placeholder="Pays"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="Ville"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Statut"
        value={status}
        onChangeText={setStatus}
      />
      <Button title="Enregistrer le profil" onPress={handleSaveProfile} />
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
});

export default ProfileCreationScreen;
