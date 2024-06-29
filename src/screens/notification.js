/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/*
import React from 'react';
import { View, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

const sendLiveNotificationToFollowers = async () => {
  try {
    const userId = auth().currentUser.uid;

    // Récupérer les followers de l'utilisateur
    const followersSnapshot = await firestore()
      .collection('users')
      .where('following', 'array-contains', userId)
      .get();

    const tokens = [];
    followersSnapshot.forEach(doc => {
      const followerData = doc.data();
      if (followerData.fcmToken) {
        tokens.push(followerData.fcmToken);
      }
    });

    // Envoyer une notification aux followers via FCM
    if (tokens.length > 0) {
      await messaging().sendMulticast({
        tokens: tokens,
        notification: {
          title: 'Live Stream Started!',
          body: 'Your favorite streamer has started a live stream.',
        },
      });
      Alert.alert('Notifications sent', 'Notifications have been sent to followers.');
    } else {
      Alert.alert('No followers found', 'No followers with valid FCM tokens.');
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
    Alert.alert('Error', 'Failed to send notifications.');
  }
};

const LiveStreamingScreen = () => {
  const startLiveStream = async () => {
    await sendLiveNotificationToFollowers();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Start Live" onPress={startLiveStream} />
    </View>
  );
};

export default LiveStreamingScreen;
*/