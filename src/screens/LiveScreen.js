/* eslint-disable prettier/prettier */
// LiveStreamingScreen.js

import React, { useRef, useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const LiveStreamingScreen = () => {
  const cameraRef = useRef(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  const startLiveStream = async () => {
    try {
      const userId = auth().currentUser.uid;
      const liveStreamRef = await firestore().collection('liveStreams').add({
        userId: userId,
        title: 'Live Stream',
        startedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('Live stream started:', liveStreamRef.id);
      Alert.alert('Votre live stream démarre.');
      setIsLiveStreaming(true);
    } catch (error) {
      console.error('Error starting live stream:', error);
      Alert.alert('Error', 'Failed to start live stream.');
    }
  };

  const stopLiveStream = async () => {
    setIsLiveStreaming(false);
  
    try {
      // Récupérer l'ID du live stream en cours
      const userId = auth().currentUser.uid;
      const liveStreamQuery = await firestore()
        .collection('liveStreams')
        .where('userId', '==', userId)
        .where('endedAt', '==', null) // Live en cours (sans date de fin)
        .get();
  
      if (!liveStreamQuery.empty) {
        // Mettre à jour le premier document trouvé
        const liveStreamDoc = liveStreamQuery.docs[0];
        await liveStreamDoc.ref.update({
          endedAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log('Live stream ended:', liveStreamDoc.id);
        Alert.alert('Live Stream terminé');
      } else {
        console.warn('No active live stream found.');
      }
    } catch (error) {
      console.error('Error stopping live stream:', error);
      Alert.alert('Error', 'Failed to stop live stream.');
    }
  };

  return (
    <View style={styles.container}>
      {isLiveStreaming ? (
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.front} // Caméra frontale
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.off}
          captureAudio={true}
        />
      ) : (
        <View style={styles.centeredView}>
          <Button title="Start Live" onPress={startLiveStream} />
        </View>
      )}

      {isLiveStreaming && (
        <View style={styles.stopButtonContainer}>
          <Button title="Stop Live" onPress={stopLiveStream} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  stopButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default LiveStreamingScreen;
