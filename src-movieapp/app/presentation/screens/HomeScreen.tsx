import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import { useMovieController } from '../controllers/useMovieController';
import type { RootStackParamList } from '../navigation/types';
import { tmdbClient } from '../../data/data_sources/tmdb_client';
import { TMDB_ACCESS_TOKEN } from '@env';
import SearchIcon from '../../../assets/icons/search.svg';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MOCK_POPULAR = [
  {
    id: 'p1',
    title: 'Sonic the Hedgehog',
    release_date: 'Mar 10, 2022',
    poster_path: '/a7GDnv776Z244J79bU456o97vIS.jpg'
  },
  {
    id: 'p2',
    title: 'Game of Trone',
    release_date: 'Mar 10, 2022',
    poster_path: '/1XS1nmg9J1hx1q1jWalY8Rphm7R.jpg'
  },
  {
    id: 'p3',
    title: 'All of Us Are Dead',
    release_date: 'Mar 10, 2022',
    poster_path: '/85GV8XmUI79jO1v6vPRXvIy9X7l.jpg'
  }
];

const MOCK_NOW_PLAYING = [
  {
    id: 'n1',
    title: 'The Cabinet of Dr. Caligari',
    release_date: 'Mar 10, 2022',
    poster_path: '/4397B1jNn7tZ216JcR1e3P5VfGv.jpg'
  },
  {
    id: 'n2',
    title: 'The Divine Fury',
    release_date: 'Mar 10, 2022',
    poster_path: '/hG4TjZ4C6oF34K5W7F8LpU4K6jH.jpg'
  },
  {
    id: 'n3',
    title: 'Ashfall',
    release_date: 'Mar 10, 2022',
    poster_path: '/1R5V8S6Z5ExG473Q0Vj5vvoRKoVH.jpg'
  }
];

const MOCK_LATEST = [
  {
    id: 'l1',
    title: 'Moon Knight',
    subtitle: 'Perfect',
    backdrop_path: '/jHkvUxd0N3P41B1S87vXpYwFKo.jpg'
  },
  {
    id: 'l2',
    title: 'Marmaduke',
    subtitle: 'Marmaduke | Official Trailer',
    backdrop_path: '/qi6tWFG3JoiLQwFKoY3JoiL8.jpg'
  }
];

const MOCK_TOP_RATED = [
  {
    id: 't1',
    title: 'The Cabinet of Dr. Caligari',
    release_date: 'Mar 10, 2022',
    poster_path: '/4397B1jNn7tZ216JcR1e3P5VfGv.jpg'
  },
  {
    id: 't2',
    title: 'The Divine Fury',
    release_date: 'Mar 10, 2022',
    poster_path: '/hG4TjZ4C6oF34K5W7F8LpU4K6jH.jpg'
  },
  {
    id: 't3',
    title: 'Ashfall',
    release_date: 'Mar 10, 2022',
    poster_path: '/1R5V8S6Z5ExG473Q0Vj5vvoRKoVH.jpg'
  }
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { getPopularMovies } = useMovieController();

  const [popular, setPopular] = useState<any[]>(MOCK_POPULAR);
  const [nowPlaying, setNowPlaying] = useState<any[]>(MOCK_NOW_PLAYING);
  const [latest, setLatest] = useState<any[]>(MOCK_LATEST);
  const [topRated, setTopRated] = useState<any[]>(MOCK_TOP_RATED);
  const [loading, setLoading] = useState<boolean>(false);

  const mapTMDbMovieToDomain = (item: any) => {
    const releaseYear = item.release_date ? item.release_date.split('-')[0] : 'N/A';
    return {
      id: String(item.id),
      title: item.title,
      genre: 'Drama / Action / Sci-Fi',
      rating: item.vote_average ? Number((item.vote_average / 2).toFixed(1)) : 4.5,
      year: releaseYear,
      icon: '🎬',
      description: item.overview || 'Sinopsis tidak tersedia untuk film ini.',
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path
    };
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchTMDbData = async () => {
      if (!TMDB_ACCESS_TOKEN || TMDB_ACCESS_TOKEN === 'YOUR_TMDB_READ_ACCESS_TOKEN') {
        return;
      }

      setLoading(true);
      try {
        const [popMovies, nowRes, upRes, topRes] = await Promise.all([
          getPopularMovies('id-ID'),
          tmdbClient.get('/movie/now_playing'),
          tmdbClient.get('/movie/upcoming'),
          tmdbClient.get('/movie/top_rated'),
        ]);

        if (isMounted) {
          if (popMovies) setPopular(popMovies.slice(0, 8));
          if (nowRes.data?.results) setNowPlaying(nowRes.data.results.slice(0, 8));
          if (upRes.data?.results) setLatest(upRes.data.results.slice(0, 5));
          if (topRes.data?.results) setTopRated(topRes.data.results.slice(0, 8));
        }
      } catch (error) {
        console.warn('Gagal memuat data dari TMDB API, menggunakan data mock:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTMDbData();

    return () => {
      isMounted = false;
    };
  }, [getPopularMovies]);

  const handleMoviePress = (item: any) => {
    const domainMovie = item.year !== undefined ? item : mapTMDbMovieToDomain(item);
    navigation.navigate('MovieDetail', { movie: domainMovie });
  };

  const renderPosterCard = (item: any) => {
    const posterUrl = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
    const dateFormatted = item.release_date
      ? new Date(item.release_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Mar 10, 2022';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.posterCard}
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.posterImage}
          resizeMode="cover"
        />
        <Text style={styles.posterTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {item.release_date ? (
          <Text style={styles.posterDate}>{dateFormatted}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderWideCard = (item: any) => {
    const imgUrl = `https://image.tmdb.org/t/p/w780${item.backdrop_path || item.poster_path}`;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.wideCard}
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item)}
      >
        <View style={styles.wideImageContainer}>
          <Image
            source={{ uri: imgUrl }}
            style={styles.wideImage}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playCircle}>
              <Text style={styles.playTriangle}>▶</Text>
            </View>
          </View>
        </View>
        <Text style={styles.wideTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.wideSubtitle} numberOfLines={1}>
          {item.subtitle || 'Official Trailer'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Movies' as any)}
          >
            <SearchIcon width={16} height={16} style={styles.searchIcon} />
            <TextInput
              placeholder="Search movie.."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

     
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#01B4E4" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>What’s Popular</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {popular.map(renderPosterCard)}
            </ScrollView>
          </View>

          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Now Playing</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {nowPlaying.map(renderPosterCard)}
            </ScrollView>
          </View>

          
          <View style={styles.darkBannerContainer}>
            <Text style={styles.darkBannerTitle}>Latest Movies to Watch</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {latest.map(renderWideCard)}
            </ScrollView>
          </View>

          
          <View style={styles.lastSectionContainer}>
            <Text style={styles.sectionTitle}>Top Rated Movies</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {topRated.map(renderPosterCard)}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSafeArea: {
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  logoImage: {
    width: 100,
    height: 30,
    alignSelf: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    color: colors.black
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    padding: 0,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sectionContainer: {
    marginTop: 24,
  },
  lastSectionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
  },
  posterCard: {
    width: 120,
    marginHorizontal: 4,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  posterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212529',
    marginTop: 10,
    paddingHorizontal: 2,
    lineHeight: 16,
  },
  posterDate: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  darkBannerContainer: {
    backgroundColor: '#0a1526',
    paddingVertical: 24,
    marginTop: 28,
  },
  darkBannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  wideCard: {
    width: 220,
    marginHorizontal: 4,
  },
  wideImageContainer: {
    position: 'relative',
    width: 220,
    height: 124,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E222A',
  },
  wideImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playTriangle: {
    color: '#0a1526',
    fontSize: 14,
    marginLeft: 2, // minor adjustment for play alignment
  },
  wideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  wideSubtitle: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
  },
  gridPosterImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  gridPosterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212529',
    marginTop: 8,
  },
  gridRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  gridRatingText: {
    fontSize: 11,
    color: '#01B4E4',
    fontWeight: '700',
  },
  gridDateText: {
    fontSize: 11,
    color: '#6b7280',
  },
  emptySearchContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearchText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 62,
    paddingBottom: Platform.OS === 'ios' ? 14 : 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  tabIcon: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 4,
  },
  activeTabIcon: {
    color: '#01B4E4',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabLabel: {
    color: '#01B4E4',
    fontWeight: '700',
  },
});
