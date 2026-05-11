import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LotsOfStyleScreen from './LotsOfStyleScreen';
import DetailsScreen from './DetailScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import LoginScreen from './LoginScreen';
import { store } from './store';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProductScreen from './ProductScreen';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Details: undefined;
  LotsOfStyle: undefined;
  Login: undefined;
  Product: { item: { id: string; title: string; price: number } } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  // const navigationRef = useNavigationContainerRef(); // Reference untuk navigasi

  // useEffect(() => {
  //   // Jalankan permission dan listener saat app start
  //   // requestUserPermission();
  //   // notificationListener(navigationRef);
  // }, []);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen name="LotsOfStyle" component={LotsOfStyleScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}