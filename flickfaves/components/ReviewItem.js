import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ReviewItem = ({ item, onDelete }) => (
  <View style={styles.reviewItem}>
    <Text style={styles.reviewText}>{item.text}</Text>
    {item.rating > 0 && <Text style={styles.reviewRating}>Rating: {item.rating} stars</Text>}
    <TouchableOpacity onPress={onDelete} style={styles.deleteButtonContainer}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  reviewItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#14171C', 
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  reviewRating: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  deleteButtonContainer: {
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReviewItem;
