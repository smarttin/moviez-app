import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import MoviePoster from '../components/MoviePoster';
import { Ionicons } from '@expo/vector-icons';
import { gql, useQuery } from '@apollo/client';
import Profile from '../components/Profile';

const PROFILE_QUERY = gql`
  query {
    currentUser {
      id
      username
      email
      votes {
        movie {
          id
          title
          description
          imageUrl
          category {
            title
          }
        }
      }
    }
  }
`;

const ProfileScreen = ({ navigation, route }) => {
  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    fetchPolicy: 'network-only',
  });

  if (error) {
    console.log(error);
    return <Text>{error.message}</Text>;
  }

  if (!data || !data.currentUser) {
    return (
      <ActivityIndicator
        color="#161616"
        style={{ ...StyleSheet.absoluteFillObject }}
      />
    );
  }

  const { currentUser } = data;
  const { username, email, votes } = currentUser;

  return (
    <View style={styles.container}>
      <Profile currentUser={currentUser} isVotes />
      {votes && votes.length ? (
        <FlatList
          data={votes}
          keyExtractor={(item, index) => `${index}`}
          numColumns={2}
          decelerationRate="fast"
          renderItem={({ item, index }) => {
            const { movie } = item;
            return (
              <MoviePoster
                movie={movie}
                onPress={() => navigation.navigate('Detail', { movie })}
              />
            );
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  saveIcon: {
    position: 'relative',
    right: 20,
    zIndex: 8,
  },
});

export default ProfileScreen;
