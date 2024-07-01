// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; 
import MovieListScreen from './components/MovieListScreen';
import MovieDetailScreen from './components/MovieDetailScreen';
import WriteReviewScreen from './components/WriteReviewScreen';
import ProfileScreen from './components/ProfileScreen';
import WatchListScreen from './components/WatchList';
import LoginScreen from './components/LoginScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MovieStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
      },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Movies" component={MoviesTab} options={{ title: 'FlickFaves' }} />
    <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'FlickFaves' }} />
    <Stack.Screen name="WriteReview" component={WriteReviewScreen} options={{ title: 'FlickFaves' }} />
  </Stack.Navigator>
);

const MoviesTab = ({ route }) => {
  const { username } = route.params;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#00bcd4',
        inactiveTintColor: '#fff',
        style: {
          backgroundColor: '#556678',
        },
        labelStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="MoviesList"
        component={MovieListScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-film" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen} 
        initialParams={{ username: username }} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchList"
        component={WatchListScreen}
        options={{
          tabBarLabel: 'WatchList',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-list" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MovieStack />
    </NavigationContainer>
  );
}

export default App;
