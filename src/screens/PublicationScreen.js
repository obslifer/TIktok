import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UploadVideo = () => {
  const [videoUri, setVideoUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const selectVideo = () => {
    launchImageLibrary({ mediaType: 'video' }, (response) => {
      if (response.assets) {
        setVideoUri(response.assets[0].uri);
      }
    });
  };

  const uploadVideo = async () => {
    if (!videoUri) return;

    const userId = auth().currentUser.uid;
    const videoId = firestore().collection('videos').doc().id;
    const reference = storage().ref(`/videos/${videoId}`);

    try {
      await reference.putFile(videoUri);
      const url = await reference.getDownloadURL();

      await firestore().collection('videos').doc(videoId).set({
        userId,
        title,
        url,
        description,
        timestamp: firestore.FieldValue.serverTimestamp(),
        flags: [],
        likes: [],
      });

      setVideoUri(null);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sélectionner la vidéo */}
      <TouchableOpacity style={styles.selectButton} onPress={selectVideo}>
        <Text style={styles.selectButtonText}>Sélectionner une vidéo</Text>
      </TouchableOpacity>

      {/* Prévisualisation de la vidéo sélectionnée */}
      {videoUri && (
        <ImageBackground source={{ uri: videoUri }} style={styles.videoPreview} resizeMode="cover">
          <Text style={styles.videoPreviewText}>Vidéo sélectionnée</Text>
        </ImageBackground>
      )}

      {/* Champ de titre */}
      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Champ de description */}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      {/* Bouton de téléchargement */}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadVideo}>
        <Text style={styles.uploadButtonText}>Télécharger la vidéo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoPreview: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPreviewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#1DA1F2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadVideo;
