// ProfileScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [userActivity, setUserActivity] = useState([]);

  const loadUserActivity = async () => {
    try {
      const storedActivity = await AsyncStorage.getItem('user_activity');
      if (storedActivity) {
        setUserActivity(JSON.parse(storedActivity));
      }
    } catch (error) {
      console.error('Error loading user activity:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('user_activity');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserActivity();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={require('../assets/BTTF.png')}
          style={styles.profilePhoto}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.heading}>Your Activity</Text>

      {userActivity.length > 0 ? (
        <FlatList
          data={userActivity}
          keyExtractor={(item) => item.reviewId.toString()}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>{item.text}</Text>
              <Text style={styles.activityRating}>Rating: {item.rating}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noActivityMessage}>No activity to display.</Text>
      )}

      {/* Sign-out button with improved styling at the bottom */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  activityItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#19232F',
    borderRadius: 10,
  },
  activityText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  activityRating: {
    fontSize: 14,
    color: '#d3d3d3',
  },
  noActivityMessage: {
    fontSize: 16,
    color: '#d3d3d3',
    textAlign: 'center',
    marginTop: 20,
  },
  
  signOutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    marginTop: 'auto', 
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
