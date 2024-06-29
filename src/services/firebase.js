/* eslint-disable prettier/prettier */

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


// Authentification
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signInWithEmailPassword = async (email, password) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing in with email and password:', error);
      throw error;
    }
  };
  
  export const signUpWithEmailPassword = async (email, password) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing up with email and password:', error);
      throw error;
    }
  };
  
  export const sendVerificationCode = async (phone) => {
    const verifier = new auth.RecaptchaVerifier('recaptcha-container');
    try {
      const confirmationResult = await auth.signInWithPhoneNumber(phone, verifier);
      window.confirmationResult = confirmationResult;
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };
  
  export const signInWithPhone = async (phone, code) => {
    try {
      const result = await window.confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      console.error('Error signing in with phone:', error);
      throw error;
    }
  };
  
  export const signUpWithPhone = async (phone, code) => {
    try {
      const result = await window.confirmationResult.confirm(code);
      return result.user;
    } catch (error) {
      console.error('Error signing up with phone:', error);
      throw error;
    }
  };

export const signInWithICloud = async () => {
  // complique
};

// Déconnexion
export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Sauvegarder les infos utilisateur dans Firestore
export const saveUserInfo = async (userId, profileData) => {
  try {
    await firestore().collection('users').doc(userId).set(profileData);
  } catch (error) {
    console.error('Error saving user info:', error);
    throw error;
  }
};

// Obtenir les informations utilisateur
export const getUserInfo = async uid => {
  try {
    const userDoc = await firestore.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

// Upload de vidéos/photos
export const uploadMedia = async (file, userId) => {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${userId}/${file.name}`);
  try {
    await fileRef.put(file);
    const url = await fileRef.getDownloadURL();
    return url;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

// Publier une vidéo
export const publishVideo = async (userId, title, description, url) => {
  try {
    await firestore.collection('videos').add({
      userId,
      title,
      description,
      url,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      flags: [],
      likes: [],
    });
  } catch (error) {
    console.error('Error publishing video:', error);
    throw error;
  }
};

// Supprimer une vidéo
export const deleteVideo = async videoId => {
  try {
    await firestore.collection('videos').doc(videoId).delete();
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Ajouter un commentaire
export const addComment = async (videoId, userId, text) => {
  try {
    await firestore
      .collection('videos')
      .doc(videoId)
      .collection('comments')
      .add({
        userId,
        text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Ajouter un like à une vidéo
export const likeVideo = async (videoId, userId) => {
  try {
    const videoRef = firestore.collection('videos').doc(videoId);
    await videoRef.update({
      likes: firebase.firestore.FieldValue.arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

// Envoyer un message
export const sendMessage = async (senderId, receiverId, text) => {
  try {
    await firestore.collection('messages').add({
      senderId,
      receiverId,
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Démarrer une session live
export const startLiveSession = async (userId, url) => {
  try {
    await firestore.collection('live_sessions').add({
      userId,
      url,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error starting live session:', error);
    throw error;
  }
};

// Fonction de signalement de contenu
export const flagContent = async (videoId, userId) => {
  try {
    const videoRef = firestore.collection('videos').doc(videoId);
    await videoRef.update({
      flags: firebase.firestore.FieldValue.arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error flagging content:', error);
    throw error;
  }
};

// Obtenir les vidéos signalées
export const getFlaggedVideos = async () => {
  try {
    const snapshot = await firestore
      .collection('videos')
      .where('flags', 'array-contains', 'some_value')
      .get();
    let flaggedVideos = [];
    snapshot.forEach(doc => {
      flaggedVideos.push({id: doc.id, ...doc.data()});
    });
    return flaggedVideos;
  } catch (error) {
    console.error('Error getting flagged videos:', error);
    throw error;
  }
};

// Vérifier si le profil de l'utilisateur existe
export const doesUserProfileExist = async (userId) => {
  try {
    const doc = await firestore().collection('users').doc(userId).get();
    return doc.exists;
  } catch (error) {
    console.error('Error checking user profile existence:', error);
    throw error;
  }
};

export default {
  firebase,
  firestore,
  auth,
  storage,
  doesUserProfileExist,
  signInWithGoogle,
  signInWithICloud,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  sendVerificationCode,
  signInWithPhone,
  signUpWithPhone,
  signOut,
  saveUserInfo,
  getUserInfo,
  uploadMedia,
  publishVideo,
  deleteVideo,
  addComment,
  likeVideo,
  sendMessage,
  startLiveSession,
  flagContent,
  getFlaggedVideos,
};
