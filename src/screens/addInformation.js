import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddInformation = ({navigation}) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');

  const handleChoosePhoto = () => {
    launchImageLibrary({noData: true}, response => {
      if (response && response.assets) {
        setPhotoURL(response.assets[0].uri);
      }
    });
  };

  const handleSave = async () => {
    try {
      const currentUserId = auth().currentUser?.uid;
      //   try {
      //     const userId = auth().currentUser?.uid;
      //     if (!userId) {
      //       alert('User not authenticated');
      //       return;
      //     }
      //     await
      firestore()
        .collection('users')
        .doc(currentUserId)
        .set({
          displayName,
          email,
          photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
          dateOfBirth: firestore.Timestamp.fromDate(new Date(dateOfBirth)),
          country,
          city,
          gender,
          followers: [],
          following: [],
        });
      alert('User information saved successfully!');
      navigation.navigate('Videos');
    } catch (error) {
      console.error('Error saving user information: ', error);
      alert('Failed to save user information');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Button
          title="Go to Account"
          onPress={() =>
            navigation.navigate('Account', {userId: '5aZG55aGxo58zgkUW7HB'})
          }
        /> */}
        {/* <Button
          title="Go to Comments"
          onPress={() =>
            navigation.navigate('Comments', {videoId: 'QcBlEQUF96FDgoKypGBi'})
          }
        /> */}

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />

        <Text style={styles.label}>Photo</Text>
        {photoURL ? (
          <Image source={{uri: photoURL}} style={styles.photo} />
        ) : (
          <Button title="Choose Photo" onPress={handleChoosePhoto} />
        )}

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <Text style={styles.label}>Country</Text>
        <TextInput
          value={country}
          onChangeText={setCountry}
          style={styles.input}
        />

        <Text style={styles.label}>City</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />

        <Button title="Save" onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
  },
  photo: {
    width: 100,
    height: 100,
    marginVertical: 16,
  },
});

export default AddInformation;
