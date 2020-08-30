import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, gql } from '@apollo/client';

const { width } = Dimensions.get('window');

// Mutations
const EDIT_POST = gql`
  mutation EditPost(
    $id: ID!
    $title: String!
    $link: String!
    $imageUrl: String!
  ) {
    editPost(id: $id, title: $title, link: $link, imageUrl: $imageUrl) {
      id
      title
      link
      imageUrl
    }
  }
`;

const ADD_POST = gql`
  mutation AddPost($title: String!, $link: String!, $imageUrl: String!) {
    addPost(title: $title, link: $link, imageUrl: $imageUrl)
  }
`;

const LinkForm = ({ route, navigation }) => {
  const { params } = route;
  const { post } = params || {};
  const [addPost] = useMutation(ADD_POST);
  const [editPost] = useMutation(EDIT_POST);
  const [title, setTitle] = useState((post && post.title) || '');
  const [link, setLink] = useState((post && post.link) || '');
  const [imageUrl, setImageUrl] = useState((post && post.imageUrl) || '');

  const handlePost = () => {
    // TextInput validation
    let nullValues = [];
    if (!title) {
      nullValues.push('Title');
    }
    if (!link) {
      nullValues.push('Link');
    }
    if (!imageUrl) {
      nullValues.push('Image URL');
    }
    if (nullValues.length) {
      Alert.alert(`Please fill in ${nullValues.join(', ')}`);
    } else {
      if (post) {
        editPost({ variables: { id: post.id, title, link, imageUrl } })
          .then(() => {
            navigation.navigate('LinkDetail', {
              post: { id: post.id, title, link, imageUrl },
            });
          })
          .catch((err) => console.log(err));
      } else {
        addPost({ variables: { title, link, imageUrl } })
          .then(() => {
            navigation.goBack();
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(text) => setTitle(text)}
          value={title}
          placeholder="Title"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
          autoFocus
        />
      </View>
      <View>
        <Text>Link</Text>
        <TextInput
          onChangeText={(text) => setLink(text)}
          value={link}
          placeholder="Link"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View>
        <Text>Image URL</Text>
        <TextInput
          onChangeText={(text) => setImageUrl(text)}
          value={imageUrl}
          placeholder="Image URL"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <RoundedButton
        text={post ? 'Edit Post' : 'Add Post'}
        textColor="#fff"
        backgroundColor="rgba(75, 148, 214, 1)"
        onPress={handlePost}
        icon={
          <Ionicons
            name="md-checkmark-circle"
            size={20}
            color={'#fff'}
            style={styles.saveIcon}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  saveIcon: {
    position: 'relative',
    left: 20,
    zIndex: 8,
  },
  input: {
    width: width - 40,
    height: 40,
    borderBottomColor: '#FFF',
    borderBottomWidth: 1,
  },
  image: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
});

export default LinkForm;
