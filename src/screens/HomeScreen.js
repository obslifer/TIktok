/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const videosCollection = await firestore().collection('videos').orderBy('timestamp', 'desc').get();
      const videosList = videosCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videosList);
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.url }}
        style={styles.video}
        resizeMode="cover"
        repeat
        controls
      />
      <View style={styles.overlay}>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.user}>{item.userId}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="heart-outline" size={30} color="#fff" />
            <Text style={styles.actionText}>{item.likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={30} color="#fff" />
            <Text style={styles.actionText}>Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="musical-notes-outline" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={videos}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      snapToInterval={height}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      pagingEnabled
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    height: height,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
  },
  info: {
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#fff',
    fontSize: 16,
  },
  user: {
    color: '#fff',
    fontSize: 14,
  },
  actions: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    justifyContent: 'space-around',
    height: 150,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default HomeScreen;
