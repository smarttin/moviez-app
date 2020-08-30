import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import Post from '../components/Post';
import { gql, useQuery } from '@apollo/client';

// Queries
const POSTS_QUERY = gql`
  query {
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
`;

// Subscriptions
const POSTS_SUBSCRIPTION = gql`
  subscription {
    postAdded {
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
`;

const POST_UPDATED = gql`
  subscription {
    postEdited {
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
`;

const POST_DELETED = gql`
  subscription {
    postDeleted
  }
`;

const LinksScreen = ({ navigation }) => {
  const { subscribeToMore, loading, error, data } = useQuery(POSTS_QUERY, {
    variables: {},
  });

  useEffect(() => {
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;
        const newPostItem = subscriptionData.data.postAdded;
        return Object.assign({}, prev, {
          posts: [newPostItem, ...prev.posts],
        });
      },
    });

    subscribeToMore({
      document: POST_UPDATED,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const editedPost = subscriptionData.data.postEdited;
        const updatedPosts = [...prev.posts];
        const updatedIndex = updatedPosts.findIndex(
          (post) => post.id == editedPost.id
        );
        if (updatedIndex >= 0) {
          updatedPosts[updatedIndex] = editedPost;
        }
        return Object.assign({}, prev, {
          posts: updatedPosts,
        });
      },
    });

    subscribeToMore({
      document: POST_DELETED,
      variables: {},
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const deletedID = subscriptionData.data.postDeleted;
        const updatedPosts = [...prev.posts];
        const updatedIndex = updatedPosts.findIndex(
          (post) => post.id == deletedID
        );
        updatedPosts.splice(updatedIndex, 1);
        return Object.assign({}, prev, {
          posts: updatedPosts,
        });
      },
    });
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        color="#161616"
        style={{ ...StyleSheet.absoluteFillObject }}
      />
    );
  }

  const { posts } = data;

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${index}`}
        renderItem={(post, index) => {
          const { item } = post;
          return (
            <Post
              post={item}
              onPress={() => navigation.navigate('LinkDetail', { post: item })}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  saveIcon: {
    position: 'relative',
    right: 20,
    zIndex: 8,
  },
});

export default LinksScreen;
