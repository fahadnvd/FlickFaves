import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReviewItem from './ReviewItem';

const API_KEY = '56e8dc3bc4f7ba32b66d569a9117b81b';

const MovieDetailScreen = ({ route, navigation }) => {
  const { selectedMovie } = route.params;
  const [movieDetails, setMovieDetails] = useState({});
  const [credits, setCredits] = useState({});
  const [reviews, setReviews] = useState([]);
  const [existingReviews, setExistingReviews] = useState([
    { id: 1, text: 'Great movie!', rating: 5 },
    { id: 2, text: 'Good storyline.', rating: 4 },
  ]);

  useEffect(() => {
    //Fetches Movie details from API
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    const fetchMovieCredits = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie.id}/credits?api_key=${API_KEY}`);
        const data = await response.json();
        setCredits(data);
      } catch (error) {
        console.error('Error fetching movie credits:', error);
      }
    };

    const loadStoredReviews = async () => {
      const storageKey = `reviews_${selectedMovie.id}`;
      try {
        const storedReviews = await AsyncStorage.getItem(storageKey);
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    fetchMovieDetails();
    fetchMovieCredits();
    loadStoredReviews();

    setReviews(existingReviews);
  }, [selectedMovie.id, existingReviews]);

  const onWriteReview = () => {
    navigation.navigate('WriteReview', { selectedMovie, onReviewSubmit });
  };

  const onReviewSubmit = async (reviewData) => {
    const storageKey = `reviews_${selectedMovie.id}`;
    const newReviews = [...reviews, { id: reviews.length + 1, ...reviewData }];

    try {
      //Using AsyncStorage to store reviews
      await AsyncStorage.setItem(storageKey, JSON.stringify(newReviews));
      console.log('Reviews saved successfully');

      const activityStorageKey = 'user_activity';
      const storedActivity = await AsyncStorage.getItem(activityStorageKey);
      const userActivity = storedActivity ? JSON.parse(storedActivity) : [];

      const activityItem = { movieId: selectedMovie.id, reviewId: newReviews.length, ...reviewData };
      userActivity.push(activityItem);

      await AsyncStorage.setItem(activityStorageKey, JSON.stringify(userActivity));
      console.log('User activity updated successfully');
    } catch (error) {
      console.error('Error saving reviews or updating user activity:', error);
    }

    setReviews(newReviews);
  };

  const onDeleteReview = async (reviewId) => {
    const storageKey = `reviews_${selectedMovie.id}`;
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      console.log('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
    }

    setReviews(updatedReviews);
  };

  const addToWatchlist = () => {
    navigation.navigate('WatchList', { addedMovie: selectedMovie });
  };

  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const openReviewsModal = () => {
    setShowReviewsModal(true);
  };

  const closeReviewsModal = () => {
    setShowReviewsModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }} style={styles.image} />

      <View style={styles.contentContainer}>
        <Text style={styles.movieTitle}>{movieDetails.title}</Text>
        <Text style={styles.description}>{movieDetails.overview}</Text>

        <SectionTitle title="Cast" />
        <FlatList
          data={credits.cast}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          style={styles.castCrewList}
          renderItem={({ item }) => <CastCrewItem item={item} />}
        />

        <SectionTitle title="Crew" />
        <FlatList
          data={credits.crew}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          style={styles.castCrewList}
          renderItem={({ item }) => <CrewItem item={item} />}
        />

        <View style={styles.buttonsContainer}>
          <CustomButton title="Write a Review" onPress={onWriteReview} buttonStyle={styles.writeReviewButton} />
          <CustomButton title="Show Reviews" onPress={openReviewsModal} buttonStyle={styles.showReviewsButton} />
          <CustomButton title="Add to Watchlist" onPress={addToWatchlist} buttonStyle={styles.watchlistButton} />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showReviewsModal}
          onRequestClose={closeReviewsModal}
        >
          <TouchableWithoutFeedback onPress={closeReviewsModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reviews</Text>
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <ReviewItem item={item} onDelete={() => onDeleteReview(item.id)} />
              )}
            />
            <TouchableOpacity onPress={closeReviewsModal} style={styles.closeModalButton}>
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const SectionTitle = ({ title }) => (
  <Text style={styles.castCrewTitle}>{title}:</Text>
);

const CastCrewItem = ({ item }) => (
  <View style={styles.castCrewItem}>
    <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }} style={styles.castCrewImage} />
    <Text style={styles.castCrewName}>{item.name}</Text>
    <Text style={styles.castCrewCharacter}>{item.character}</Text>
  </View>
);

const CrewItem = ({ item }) => (
  <View style={styles.castCrewItem}>
    <Text style={styles.castCrewName}>{item.name}</Text>
    <Text style={styles.castCrewJob}>{item.job}</Text>
  </View>
);

const CustomButton = ({ title, onPress, buttonStyle }) => (
  <TouchableOpacity onPress={onPress} style={buttonStyle}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C',
  },
  image: {
    width: '70%',
    alignSelf: 'center',
    aspectRatio: 2 / 3,
    borderRadius: 10,
    marginBottom: 1,
  },
  contentContainer: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#d3d3d3',
    textAlign: 'justify',
  },
  castCrewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  castCrewList: {
    marginVertical: 10,
  },
  castCrewItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  castCrewImage: {
    width: 100,
    height: 150,
    marginBottom: 5,
    borderRadius: 5,
  },
  castCrewName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 2,
    color: '#fff',
    textAlign: 'center',
  },
  castCrewCharacter: {
    fontSize: 12,
    textAlign: 'center',
    color: '#d3d3d3',
    lineHeight: 16,
  },
  castCrewJob: {
    fontSize: 14,
    textAlign: 'center',
    color: '#d3d3d3',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  writeReviewButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    flex: 0.3,
  },
  showReviewsButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    flex: 0.3,
  },
  watchlistButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    flex: 0.3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#14171C',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
    textAlign: 'center',
  },
  closeModalButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MovieDetailScreen;
