import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Animated, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { AuthService } from '../../domain/services/auth_service';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SplashScreen() {
  const navigation = useNavigation<NavigationProp>();
  const authService = AuthService.getInstance();

  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => { 
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    let isMounted = true;

    const timer = setTimeout(async () => {
      try {
        const session = await authService.getSessionUseCase.execute();
        if (!isMounted) return;

        if (session) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Intro' }],
          });
        }
      } catch {
        if (!isMounted) return;
        navigation.reset({
          index: 0,
          routes: [{ name: 'Intro' }],
        });
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigation, authService, opacityAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.logoWrapper}>
        <Animated.View
          style={[
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 246,
  },
});
