import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import CustomButton from '../components/CustomButton';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function IntroScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.outerContainer}>
      <ImageBackground 
        source={require('../../../assets/introBackground.jpg')}
        style={styles.imageBackground} 
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.graphicContainer}>
          <Text style={styles.welcomeTitle}>
            Welcome.
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Millions of movies, TV shows and people to discover. Explore Now
          </Text>
        </View>

        <CustomButton
          title="Get Started"
          variant='secondary'
          onPress={() => navigation.navigate('Login')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.variantSecondary,
    opacity: 0.4,
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  graphicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    marginTop: 126,
    marginBottom: 12
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 14,
  },
  logoImage: {
    width: 123,
  }
});
