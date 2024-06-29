import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeEventEmitter,
  NativeModules,
  Image,
  TextInput,
} from 'react-native';
import Video from 'react-native-video';
import { isValidVideo, showEditor } from 'react-native-video-trim';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [mediaUri, setMediaUri] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [trimmedVideoUri, setTrimmedVideoUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canPublish, setCanPublish] = useState(false); // State to track publish button state

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event.name) {
        case 'onShow':
          console.log("Affichage de l'éditeur", event);
          break;
        case 'onHide':
          console.log('Éditeur masqué', event);
          break;
        case 'onStartTrimming':
          console.log('Début du découpage', event);
          break;
        case 'onFinishTrimming':
          console.log('Découpage terminé', event);
          setTrimmedVideoUri(event.outputPath);
          setMediaUri(event.outputPath); 
          setMediaType('video');
          break;
        case 'onCancelTrimming':
          console.log('Découpage annulé', event);
          break;
        case 'onError':
          console.log('Erreur', event);
          break;
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Enable publish button only when mediaUri, title, and description are set
    if (mediaUri && title && description) {
      setCanPublish(true);
    } else {
      setCanPublish(false);
    }
  }, [mediaUri, title, description]);

  const openLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      assetRepresentationMode: 'current',
    });

    if (result.assets) {
      const asset = result.assets[0];
      if (asset.type?.startsWith('video')) {
        isValidVideo(asset.uri || '').then(res => console.log(res));
        showEditor(asset.uri || '', {
          maxDuration: 20,
        });
      } else {
        setMediaUri(asset.uri);
        setMediaType('photo');
      }
    }
  };

  const SaveIntoFirebase = async () => {
    if (!mediaUri || !title || !description) {
      console.log('Please select media, title, and description');
      return;
    }

    let path = '';
    if (mediaType === 'photo') {
      path = 'photos/';
    } else if (mediaType === 'video') {
      path = 'videos/';
    }

    const fileName = mediaUri.substring(mediaUri.lastIndexOf('/') + 1);
    const reference = storage().ref(path + fileName);

    try {
      // Upload media file to Firebase Storage
      await reference.putFile(mediaUri);
      const url = await reference.getDownloadURL();
      console.log('File uploaded to Firebase:', url);

      // Construct video object to save in Firestore
      const videoData = {
        userId: 'userId_here', // Replace with actual user ID
        title: title,
        url: url,
        description: description,
        timestamp: firestore.FieldValue.serverTimestamp(),
        flags: [],
        likes: [],
        comments: [],
      };

      // Add the video data to Firestore collection 'videos'
      await firestore().collection('videos').add(videoData);
      console.log('Video data added to Firestore');

      // Optionally, you can update UI or perform other actions after upload
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {trimmedVideoUri && mediaType === 'video' ? (
        <Video source={{ uri: trimmedVideoUri }} style={styles.video} controls />
      ) : (
        mediaUri && mediaType === 'video' && (
          <Video source={{ uri: mediaUri }} style={styles.video} controls />
        )
      )}
      {mediaUri && mediaType === 'photo' && (
        <Image source={{ uri: mediaUri }} style={styles.image} />
      )}
      <TouchableOpacity onPress={openLibrary} style={styles.button}>
        <Text>Ouvrir la bibliothèque</Text>
      </TouchableOpacity>

      {/* Title and Description TextInputs */}
      <TextInput
        placeholder="Titre"
        style={styles.input}
        onChangeText={setTitle}
        value={title}
      />
      <TextInput
        placeholder="Description"
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        multiline={true}
        numberOfLines={4}
      />

      <TouchableOpacity
        onPress={SaveIntoFirebase}
        style={[styles.button, !canPublish && { opacity: 0.5 }]} // Disable button if canPublish is false
        disabled={!canPublish} // Disable button if canPublish is false
      >
        <Text>Publier</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});