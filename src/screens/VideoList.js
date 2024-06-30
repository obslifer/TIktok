/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {likeVideo, unlikeVideo} from '../services/firebase';
import {useNavigation} from '@react-navigation/native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  useEffect(() => {
    const loadVideosFromFirestore = async () => {
      const videosCollection = firestore().collection('videos');
      const snapshot = await videosCollection.get();
      const videosList = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        url: doc.data().url,
        likes: doc.data().likes || [],
        comments: doc.data().comments || [],
      }));
      setVideos(videosList);
    };

    loadVideosFromFirestore();
  }, []);

  const handleLikePress = async videoId => {
    try {
      const video = videos.find(video => video.id === videoId);
      const isLiked = Array.isArray(video.likes) && video.likes.includes(currentUser.uid);

      if (isLiked) {
        await unlikeVideo(videoId, currentUser.uid);
      } else {
        await likeVideo(videoId, currentUser.uid);
      }

      setVideos(prevVideos =>
        prevVideos.map(video =>
          video.id === videoId
            ? {
                ...video,
                likes: isLiked
                  ? video.likes.filter(id => id !== currentUser.uid)
                  : [...video.likes, currentUser.uid],
              }
            : video,
        ),
      );
    } catch (error) {
      console.error('Error handling like press:', error);
    }
  };

  const handleCommentPress = videoId => {
    navigation.navigate('comments', {videoId});
  };

  const renderItem = ({item}) => (
    <VideoItem
      item={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
    />
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const VideoItem = ({item, onLikePress, onCommentPress}) => {
  const [lastTap, setLastTap] = useState(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      onLikePress(item.id);
    } else {
      setLastTap(now);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleDoubleTap}>
      <View style={styles.videoContainer}>
        <Text style={styles.videoTitle}>Vidéo {item.title}</Text>
        <Video
          source={{uri: item.url}}
          style={styles.videoPlayer}
          resizeMode="cover"
          controls={true}
          fullscreen={true}
        />
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => onLikePress(item.id)}>
            <Text style={[styles.actionText, {fontSize:25, color:'#f55'}]}>{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onCommentPress(item.id)}>
            <Text style={[styles.actionText, {fontSize:20, color:'#55f'}]}>Commentaires</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    width: screenWidth,
    height: screenHeight,
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
