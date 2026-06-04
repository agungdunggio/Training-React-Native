import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeIcon from '../../../assets/icons/home.svg';
import MoviesIcon from '../../../assets/icons/movies.svg';
import AccountIcon from '../../../assets/icons/account.svg';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#01B4E4',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: 62,
          paddingBottom: Platform.OS === 'ios' ? 14 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon width={20} height={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color }) => <MoviesIcon width={20} height={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ isTab: true }}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <AccountIcon width={20} height={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
