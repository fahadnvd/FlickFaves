import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const WatchListScreen = ({ navigation, route }) => {
  const [watchlist, setWatchlist] = useState([]);

  // Add a movie to the watchlist
  const addMovieToWatchlist = (movie) => {
    setWatchlist((prevWatchlist) => [...prevWatchlist, movie]);
  };

  // Remove a movie from the watchlist
  const removeMovieFromWatchlist = (movieId) => {
    setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
  };

  // UseEffect to update watchlist when a movie is added or removed
  useEffect(() => {
    if (route.params && route.params.addedMovie) {
      addMovieToWatchlist(route.params.addedMovie);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Watchlist</Text>

      {watchlist.length > 0 ? (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.movieItem}
              onPress={() => navigation.navigate('MovieDetail', { selectedMovie: item })}
            >
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.movieImage} />
              <Text style={styles.movieTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMovieFromWatchlist(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.emptyWatchlistMessage}>Your watchlist is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C', 
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', 
  },
  movieItem: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    margin: 5,
    padding: 10,
    width: 180,
    alignItems: 'center',
  },
  movieImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', 
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    left: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
  emptyWatchlistMessage: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff', 
  },
});

export default WatchListScreen;
