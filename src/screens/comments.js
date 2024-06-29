import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Comments = ({ route }) => {
  const { videoId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsSnapshot = await firestore().collection('videos').doc("QcBlEQUF96FDgoKypGBi").collection('comments').orderBy('createdAt', 'asc').get();
        const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsList);
      } catch (error) {
        console.error('Error fetching comments: ', error);
      }
    };

    fetchComments();
  }, ["QcBlEQUF96FDgoKypGBi"]);

  const handleAddComment = async () => {
    try {
      const userId = "5aZG55aGxo58zgkUW7HB";
    //   if (!userId) {
    //     alert('User not authenticated');
    //     return;
    //   }
    //   await 
      firestore().collection('videos').doc(videoId).collection('comments').add({
        userId,
        text: newComment,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setNewComment('');
      // Fetch comments again to update the list
      const commentsSnapshot = await firestore().collection('videos').doc(videoId).collection('comments').orderBy('createdAt', 'asc').get();
      const commentsList = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsList);
    } catch (error) {
      console.error('Error adding comment: ', error);
      alert('Failed to add comment');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>{item.userId}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            {/* <Text style={styles.commentDate}>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</Text> */}
          </View>
        )}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Write a comment..."
        style={styles.input}
      />
      <Button title="Add Comment" onPress={handleAddComment} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  commentContainer: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    marginTop: 4,
  },
  commentDate: {
    marginTop: 4,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default Comments;
