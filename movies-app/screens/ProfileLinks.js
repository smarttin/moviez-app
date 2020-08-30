import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Post from '../components/Post';
import Profile from '../components/Profile';
import { gql, useQuery } from '@apollo/client';

const PROFILE_QUERY = gql`
  query {
    currentUser {
      id
      username
      email
      posts {
        id
        title
        link
        imageUrl
        author {
          id
          username
        }
      }
    }
  }
`;

const ProfileLinks = ({ navigation }) => {
  const { data, loading, error, refetch } = useQuery(PROFILE_QUERY, {
    fetchPolicy: 'network-only',
  });

  if (error) {
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
  const { username, email, posts } = currentUser;

  return (
    <View style={styles.container}>
      <Profile currentUser={currentUser} />
      {posts && posts.length ? (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => {
            return `${index}`;
          }}
          decelerationRate="fast"
          renderItem={({ item }) => {
            return (
              <Post
                post={item}
                onPress={() =>
                  navigation.navigate('Links', {
                    screen: 'LinkDetail',
                    params: { post: item },
                  })
                }
              />
            );
          }}
        />
      ) : (
        <Text>No Posts found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});

export default ProfileLinks;
