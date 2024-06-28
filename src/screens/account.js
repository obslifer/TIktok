import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Image, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Account = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.displayName}>{userData.displayName}</Text>
      </View>
      <Image source={{ uri: userData.photoURL }} style={styles.photo} />
      <Text style={styles.username}>@{userData.email.split('@')[0]}</Text>
      <View style={styles.followContainer}>
        <View style={styles.followBox}>
          <Text style={styles.followCount}>{userData.following.length}</Text>
          <Text style={styles.followLabel}>Following</Text>
        </View>
        <View style={styles.followBox}>
          <Text style={styles.followCount}>{userData.followers.length}</Text>
          <Text style={styles.followLabel}>Followers</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 16,
  },
  username: {
    fontSize: 18,
    color: '#888',
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 32,
  },
  followBox: {
    alignItems: 'center',
  },
  followCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  followLabel: {
    fontSize: 16,
    color: '#888',
  },
});

export default Account;
