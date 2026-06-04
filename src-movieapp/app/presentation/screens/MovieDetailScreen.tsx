import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Platform,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Svg, { Path, Polygon, Polyline } from 'react-native-svg';
import { colors } from '../styles/colors';
import { useMovieController } from '../controllers/useMovieController';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
type RouteProps = RouteProp<RootStackParamList, 'MovieDetail'>;


const ChevronLeft = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

const HeartIcon = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const StarIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="#02B4E4" stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

// High-fidelity actors/cast datasets matching standard Unsplash portrait placeholders
const getCastForMovie = (movieTitle: string) => {
  if (movieTitle.toLowerCase().includes('sonic')) {
    return [
      {
        id: 'c1',
        name: 'Ben Schwartz',
        character: 'Sonic the Hedgehog (voice)',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'
      },
      {
        id: 'c2',
        name: 'James Marsden',
        character: 'Tom Wachowski',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
      },
      {
        id: 'c3',
        name: 'Jim Carrey',
        character: 'Dr. Robotnik',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
      }
    ];
  }
  return [
    {
      id: 'c11',
      name: 'Robert Downey Jr.',
      character: 'Tony Stark / Iron Man',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'
    },
    {
      id: 'c12',
      name: 'Scarlett Johansson',
      character: 'Natasha Romanoff / Black Widow',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
    },
    {
      id: 'c13',
      name: 'Chris Evans',
      character: 'Steve Rogers / Captain America',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    }
  ];
};

export default function MovieDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { movie } = route.params;
  const { guardRestrictedAction } = useMovieController();

  // Screen UI States
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);

  // Smooth clamp interpolations for gradual opacity and translation transitions
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTitleTranslateY = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });

  const backButtonBgOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Dynamic values
  const cast = getCastForMovie(movie.title);
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600';

  const formattedDate = movie.year ? `02/14/${movie.year} (US)` : '02/14/2020 (US)';
  const ratingOutOfTen = movie.rating ? (movie.rating * 2).toFixed(1) : '7.8';
  
  // Interactive guards
  const handleRateMovie = () => {
    guardRestrictedAction('Berikan Rating', () => {
      Alert.alert('Sukses', `Terima kasih! Anda berhasil memberikan rating bintang 10 untuk film "${movie.title}".`);
    });
  };

  const handleToggleFavorite = () => {
    guardRestrictedAction('Menambahkan Film ke Favorit', () => {
      setIsFavorite(!isFavorite);
      Alert.alert('Sukses', isFavorite ? `Film "${movie.title}" dihapus dari favorit.` : `Film "${movie.title}" telah ditambahkan ke daftar film Terfavorit Anda.`);
    });
  };

  const renderCastCard = (actor: any) => (
    <View key={actor.id} style={styles.castCard}>
      <Image source={{ uri: actor.image }} style={styles.castImage} />
      <View style={styles.castInfo}>
        <Text style={styles.castName} numberOfLines={1}>{actor.name}</Text>
        <Text style={styles.castCharacter} numberOfLines={1}>{actor.character}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
      
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#0a1526',
              opacity: headerBgOpacity,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.08)',
            }
          ]}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            
            <Animated.View
              style={[
                styles.backButtonBg,
                { opacity: backButtonBgOpacity }
              ]}
            />
            <View style={styles.backButtonIconWrapper}>
              <ChevronLeft color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Animated.Text
            style={[
              styles.headerTitle,
              {
                opacity: headerTitleOpacity,
                transform: [{ translateY: headerTitleTranslateY }]
              }
            ]}
            numberOfLines={1}
          >
            {movie.title}
          </Animated.Text>

          <View style={styles.headerRightSpacer} />
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.backdropContainer}>
          <Image source={{ uri: backdropUrl }} style={styles.backdropImage} />

          <View style={styles.backdropOverlay} />

          <TouchableOpacity style={styles.playButtonWrapper} activeOpacity={0.85}>
            <View style={styles.playCircle}>
              <Text style={styles.playTriangle}>▶</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.carouselDotsContainer}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            activeOpacity={0.7}
            onPress={handleToggleFavorite}
          >
            <HeartIcon color="#4b5563" filled={isFavorite} />
          </TouchableOpacity>
        </View>


        <Text style={styles.metadataText}>
          {formattedDate} - 1h 39m  •  {movie.genre || 'Action, Science Fiction, Comedy, Family'}
        </Text>

        <View style={styles.bodySection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.descriptionText}>
            {showFullOverview ? movie.description : `${movie.description.slice(0, 160)}... `}
            <Text 
              style={styles.seeMoreText} 
              onPress={() => setShowFullOverview(!showFullOverview)}
            >
              {showFullOverview ? 'See Less' : 'See More'}
            </Text>
          </Text>
        </View>

        <View style={styles.staffGrid}>
          <View style={styles.staffColumn}>
            <Text style={styles.staffLabel}>Director</Text>
            <Text style={styles.staffValue}>Jeff Fowler</Text>
          </View>

          <View style={styles.staffColumn}>
            <Text style={styles.staffLabel}>Characters</Text>
            <Text style={styles.staffValue}>Horikzu Yasuhara, Yuji Naka, Naoto Oshima</Text>
          </View>

          <View style={styles.staffColumn}>
            <Text style={styles.staffLabel}>Screenplay</Text>
            <Text style={styles.staffValue}>Patrict Casey, Josh Miller</Text>
          </View>
        </View>


        <View style={styles.ratingCard}>
          <View style={styles.ratingLeft}>
            <View style={styles.ratingStarCircle}>
              <StarIcon color="#01B4E4" />
            </View>
            <View style={styles.ratingTextContainer}>
              <Text style={styles.ratingVal}>{ratingOutOfTen} Star</Text>
              <Text style={styles.ratingVotes}>Total Vote : 4898</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.rateButton} 
            activeOpacity={0.8}
            onPress={handleRateMovie}
          >
            <Text style={styles.rateButtonText}>Rated 10.0</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.castSection}>
          <Text style={styles.sectionTitle}>Top Billed Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castScroll}
          >
            {cast.map(renderCastCard)}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 8 : 12,
  },
  backButtonContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButtonBg: {
    ...StyleSheet.absoluteFill,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButtonIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 38,
  },
  backdropContainer: {
    width: width,
    height: width * 0.65,
    position: 'relative',
    backgroundColor: '#0a1526',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  playButtonWrapper: {
    position: 'absolute',
    top: '40%',
    left: '42%',
  },
  playCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  playTriangle: {
    fontSize: 16,
    color: '#0a1526',
    marginLeft: 3,
  },
  carouselDotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#01B4E4', // TMDB cyan dot
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
    flex: 1,
    marginRight: 16,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginTop: 6,
    fontWeight: '500',
  },
  bodySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  seeMoreText: {
    color: '#01B4E4',
    fontWeight: '700',
  },
  staffGrid: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  staffColumn: {
    marginBottom: 16,
  },
  staffLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 2,
  },
  staffValue: {
    fontSize: 13,
    color: '#212529',
    fontWeight: '500',
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ratingTextContainer: {
    justifyContent: 'center',
  },
  ratingVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
  },
  ratingVotes: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  rateButton: {
    borderWidth: 1.2,
    borderColor: '#01B4E4',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rateButtonText: {
    color: '#01B4E4',
    fontSize: 12,
    fontWeight: '700',
  },
  castSection: {
    marginTop: 28,
    paddingLeft: 20,
  },
  castScroll: {
    paddingRight: 20,
    marginTop: 12,
  },
  castCard: {
    width: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  castImage: {
    width: '100%',
    height: 110,
    backgroundColor: '#f3f4f6',
  },
  castInfo: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  castName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#212529',
  },
  castCharacter: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
});
