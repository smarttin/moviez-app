import React from 'react';
import { StyleSheet, Text, Image, ScrollView, View, Dimensions } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'expo';
import { gql, useMutation } from '@apollo/client';

const { width } = Dimensions.get('window');

// Mutations
const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const LinkDetailScreen = ({ route, navigation }) => {
  const [deletePost] = useMutation(DELETE_POST);
  const { params } = route;
  const { post } = params;
  const { title, link, imageUrl } = post;

  return (
    <ScrollView>
      <View style={styles.container}>
        {!!imageUrl && <Image style={styles.image} source={{ uri: imageUrl }} />}
        <Text style={styles.text}>{title}</Text>
        <RoundedButton
          text={`${link}`}
          textColor="#fff"
          backgroundColor="rgba(75, 148, 214, 1)"
          onPress={() => {
            Linking.openURL(link).catch(err => console.log(err));
          }}
          icon={
            <Ionicons
              name="md-link"
              size={20}
              color={'#fff'}
              style={styles.saveIcon}
            />
          }
        />
        <RoundedButton
          text="Edit"
          textColor="#fff"
          backgroundColor="#a9a9a9"
          onPress={() => {
            navigation.navigate('LinkForm', { post });
          }}
          icon={
            <Ionicons
              name="md-options"
              size={20}
              color={'#fff'}
              style={styles.saveIcon}
            />
          }
        />
        <RoundedButton
          text="Delete"
          textColor="#fff"
          backgroundColor="#FA8072"
          onPress={() => {
            deletePost({ variables: { id: post.id } })
              .then(() => navigation.goBack())
              .catch(err => console.log(err));
          }}
          icon={
            <Ionicons
              name="md-trash"
              size={20}
              color={'#fff'}
              style={styles.saveIcon}
            />
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  text: {
    fontSize: 32,
    color: '#161616',
    padding: 15,
    textAlign: 'center'
  },
  image: {
    width: width,
    height: width,
    resizeMode: 'cover'
  },
  saveIcon: {
    position: 'relative',
    left: 20,
    zIndex: 8
  }
});

export default LinkDetailScreen;