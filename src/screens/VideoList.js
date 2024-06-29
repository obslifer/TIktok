import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import firestore, { firebase } from "@react-native-firebase/firestore";


const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideosFromFirestore = async () => {
      const videosCollection = firebase.firestore().collection('videos');
      const snapshot = await videosCollection.get();
      const videosList = snapshot.docs.map(doc => ({
        id: doc.id,
        url: doc.data().url,
        likes: doc.data().likes || 0,
        comments: doc.data().comments || []
      }));
      setVideos(videosList);
    };

    loadVideosFromFirestore();
  }, []);

  const handleLikePress = (videoId) => {
    // Logique pour gérer l'ajout de likes dans Firestore
    // Exemple simple : mise à jour locale pour démonstration
    setVideos(prevVideos => prevVideos.map(video =>
      video.id === videoId ? { ...video, likes: video.likes + 1 } : video
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Text style={styles.videoTitle}>Vidéo {item.id}</Text>
      <Video
        source={{ uri: item.url }}
        style={styles.videoPlayer}
        resizeMode="cover"
        controls={true}
        fullscreen={true}
      />
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => handleLikePress(item.id)}>
          <Text style={styles.actionText}>Likes: {item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.actionText}>Commentaires </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoList;
