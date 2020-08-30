import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Components
import ProfileScreen from '../screens/ProfileScreen';
import ProfileLinks from '../screens/ProfileLinks';

// get screen dimensions
const { width, height } = Dimensions.get('window');

const ProfileTab = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        scrollEnabled: true,
        tabStyle: {
          width: width / 2,
        },
        style: {
          fontSize: 24,
          fontWeight: '700',
          backgroundColor: '#fff',
        },
        labelStyle: {
          color: '#161616',
        },
        indicatorStyle: {
          backgroundColor: '#161616',
        },
      }}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Posts" component={ProfileLinks} />
    </Tab.Navigator>
  );
};

export default ProfileTab;
