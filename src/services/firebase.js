import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Authentification
export const signInWithGoogle = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
};

export const signInWithApple = async () => {
  const provider = new firebase.auth.OAuthProvider('apple.com');
  await auth.signInWithPopup(provider);
};

export const signOut = async () => {
  await auth.signOut();
};

// Gestion des utilisateurs
export const createUserProfile = async (user, additionalData) => {
  if (!user) return;

  const userRef = db.collection('users').doc(user.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('Error creating user profile', error.message);
    }
  }
};

export const getUserProfile = async (userId) => {
  const userRef = db.collection('users').doc(userId);
  const snapshot = await userRef.get();
  return snapshot.exists ? snapshot.data() : null;
};

export const updateUserProfile = async (userId, profileData) => {
  const userRef = db.collection('users').doc(userId);
  await userRef.update(profileData);
};

// Abonnement et désabonnement
export const followUser = async (currentUserId, targetUserId) => {
  const userRef = db.collection('users').doc(currentUserId);
  await userRef.update({
    following: firebase.firestore.FieldValue.arrayUnion(targetUserId)
  });

  const targetUserRef = db.collection('users').doc(targetUserId);
  await targetUserRef.update({
    followers: firebase.firestore.FieldValue.arrayUnion(currentUserId)
  });
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  const userRef = db.collection('users').doc(currentUserId);
  await userRef.update({
    following: firebase.firestore.FieldValue.arrayRemove(targetUserId)
  });

  const targetUserRef = db.collection('users').doc(targetUserId);
  await targetUserRef.update({
    followers: firebase.firestore.FieldValue.arrayRemove(currentUserId)
  });
};

// Partage de vidéos et photos
export const uploadMedia = async (file, userId) => {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`media/${userId}/${file.name}`);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
};

export const postVideo = async (userId, videoData) => {
  const videoRef = db.collection('videos').doc();
  await videoRef.set({
    userId,
    ...videoData,
    createdAt: new Date()
  });
};

export const deleteVideo = async (videoId) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.delete();
};

export const flagVideo = async (videoId) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.update({
    flags: firebase.firestore.FieldValue.increment(1)
  });

  const videoDoc = await videoRef.get();
  if (videoDoc.data().flags >= 3) {
    await deleteVideo(videoId);
  }
};

// Messagerie instantanée
export const sendMessage = async (chatId, message) => {
  const chatRef = db.collection('chats').doc(chatId);
  await chatRef.collection('messages').add({
    ...message,
    createdAt: new Date()
  });
};

export const getMessages = async (chatId) => {
  const chatRef = db.collection('chats').doc(chatId);
  const messages = await chatRef.collection('messages').orderBy('createdAt', 'asc').get();
  return messages.docs.map(doc => doc.data());
};

// Interactions (likes, commentaires)
export const likeVideo = async (videoId, userId) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.update({
    likes: firebase.firestore.FieldValue.arrayUnion(userId)
  });
};

export const unlikeVideo = async (videoId, userId) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.update({
    likes: firebase.firestore.FieldValue.arrayRemove(userId)
  });
};

export const addComment = async (videoId, comment) => {
  const commentsRef = db.collection('videos').doc(videoId).collection('comments');
  await commentsRef.add({
    ...comment,
    createdAt: new Date()
  });
};

export const getComments = async (videoId) => {
  const commentsRef = db.collection('videos').doc(videoId).collection('comments');
  const comments = await commentsRef.orderBy('createdAt', 'asc').get();
  return comments.docs.map(doc => doc.data());
};

// Contrôle de contenu
export const deleteComment = async (videoId, commentId) => {
  const commentRef = db.collection('videos').doc(videoId).collection('comments').doc(commentId);
  await commentRef.delete();
};

export const flagComment = async (videoId, commentId) => {
  const commentRef = db.collection('videos').doc(videoId).collection('comments').doc(commentId);
  await commentRef.update({
    flags: firebase.firestore.FieldValue.increment(1)
  });

  const commentDoc = await commentRef.get();
  if (commentDoc.data().flags >= 3) {
    await deleteComment(videoId, commentId);
  }
};

export const setEphemeralMessage = async (chatId, messageId, duration) => {
  const messageRef = db.collection('chats').doc(chatId).collection('messages').doc(messageId);
  setTimeout(async () => {
    await messageRef.delete();
  }, duration);
};
