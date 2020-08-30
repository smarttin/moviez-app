import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createStackNavigator();

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import AuthLoading from '../screens/AuthLoading';
import ProfileTab from './TopTabNavigator';
import LinkDetailScreen from '../screens/LinkDetail';
import LinkForm from '../screens/LinkForm';
import LinksScreen from '../screens/LinksScreen';
import MovieDetail from '../screens/MovieDetail';

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'Now Playing', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="AuthLoading" component={AuthLoading} options={{headerTitle: null}} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Profile"
        component={ProfileTab}
        options={({ navigation }) => ({
          headerRight: (props) => (
            <Ionicons
              name="md-exit"
              size={25}
              color={'#161616'}
              style={{
                position: 'relative',
                right: 20,
                zIndex: 8,
              }}
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                navigation.replace('Login');
              }}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const LinksStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="LinksScreen" component={LinksScreen} options={{ headerTitle: 'Links'}}/>
      <Stack.Screen name="LinkDetail" component={LinkDetailScreen} options={{ headerTitle: 'Link Detail'}}/>
      <Stack.Screen name="LinkForm" component={LinkForm} options={{ headerTitle: 'Link Form'}}/>
    </Stack.Navigator>
  )
}

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation, route }) => {
  navigation.setOptions({ headerShown: false });

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-film" color={color} />
          ),
          tabBarLabel: 'Now Playing',
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksStack}
        options={{
          tabBarLabel: 'Links',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-link" color={color} />
          )
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-person" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
