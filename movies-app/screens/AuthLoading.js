import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const AuthLoading = (props) => {
  useEffect(() => {
    _bootstrapAsync();
  });

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    props.navigation.replace(userToken ? 'Profile' : 'Login');
  }

  return (
    <View>
      <ActivityIndicator style={{ ...StyleSheet.absoluteFillObject }} />
      <StatusBar barStyle="default" />
    </View>
  );
}

export default AuthLoading;
