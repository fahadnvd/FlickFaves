import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, View, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const API_KEY = '56e8dc3bc4f7ba32b66d569a9117b81b';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
];

const MovieListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moviesByGenre, setMoviesByGenre] = useState({});

  useEffect(() => {
    //Fetches Movies from TMDB API
    const fetchMoviesByGenre = async () => {
      const moviesData = await Promise.all(
        genres.map(async (genre) => {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genre.id}`
          );
          const data = await response.json();
          return { genre, movies: data.results };
        })
      );

      const moviesByGenreObject = moviesData.reduce((acc, { genre, movies }) => {
        acc[genre.id] = { genre, movies };
        return acc;
      }, {});

      setMoviesByGenre(moviesByGenreObject);
    };

    fetchMoviesByGenre();
  }, []);

  const onSelectMovie = (item) => {
    navigation.navigate('MovieDetail', { selectedMovie: item });
  };

  const renderMovieList = (genreId) => {
    const genreData = moviesByGenre[genreId];
    if (!genreData) return null;

    const filteredMovies = genreData.movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View style={styles.genreContainer} key={genreId}>
        <Text style={styles.genreTitle}>{genreData.genre.name}</Text>
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.moviesContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieItem} onPress={() => onSelectMovie(item)}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} style={styles.movieImage} />
              <Text style={styles.movieTitle}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a movie..."
        placeholderTextColor="#bdc3c7"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />

      {genres.map((genre) => renderMovieList(genre.id))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14171C',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#2c3e50',
  },
  genreContainer: {
    marginBottom: 15,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  moviesContainer: {
    marginBottom: 10,
  },
  movieItem: {
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    margin: 5,
    padding: 5,
    width: 120,
    alignItems: 'center',
  },
  movieImage: {
    width: '100%',
    height: 150,
    marginBottom: 5,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginTop: 5,
  },
});

export default MovieListScreen;
