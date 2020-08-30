import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const Profile = ({currentUser, isVotes}) => {
  const { username, email, votes, posts } = currentUser;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.text} numberOfLines={1}>
          {username}
        </Text>
        <View style={styles.right}>
          <Text style={styles.text} numberOfLines={1}>
            {isVotes ? `${votes.length} Vote(s)` : `${posts.length} Post(s)`}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.name]} numberOfLines={1}>
          {email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    height: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  right: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  text: {
    color: '#161616',
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    fontWeight: '300',
  },
});

export default Profile;
