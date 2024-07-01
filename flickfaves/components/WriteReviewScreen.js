import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';

const WriteReviewScreen = ({ route, navigation }) => {
  const { selectedMovie, onReviewSubmit } = route.params;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmitReview = () => {
    if (reviewText.trim() === '') {
      alert('Please enter your review before submitting.');
      return;
    }

    const reviewData = {
    text: reviewText,
    rating: rating,
  };
  onReviewSubmit(reviewData);
  setReviewSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Write a Review</Text>

        {/* Star Rating */}
        <AirbnbRating
          showRating
          count={5}
          reviews={['Terrible', 'Bad', 'Average', 'Good', 'Excellent']}
          defaultRating={rating}
          onFinishRating={setRating}
          size={30}
          selectedColor="#f39c12" 
          unSelectedColor="#ecf0f1" 
          reviewColor="#ecf0f1" 
          style={styles.rating}
        />

        <TextInput
          style={styles.input}
          placeholder="Write your review here"
          placeholderTextColor="#bdc3c7" 
          multiline
          onChangeText={(text) => setReviewText(text)}
          value={reviewText}
        />

    
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>

        
        {reviewSubmitted && (
          <Text style={styles.successMessage}>Review submitted successfully!</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C',
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  rating: {
    marginVertical: 20,
  },
  input: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#3498db',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8, 
    color: '#fff',
    backgroundColor: '#2c3e50', 
  },
  submitButton: {
    backgroundColor: '#27ae60', 
    padding: 15,
    borderRadius: 8, 
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successMessage: {
    marginTop: 10,
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WriteReviewScreen;
