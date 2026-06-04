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
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../styles/colors';
import type { RootStackParamList } from '../navigation/types';
import { tmdbClient } from '../../data/data_sources/tmdb_client';
import { TMDB_ACCESS_TOKEN } from '@env';
import SearchIcon from '../../../assets/icons/search.svg';

const { width } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MOCK_POPULAR = [
  { id: 'p1', title: 'Sonic the Hedgehog', release_date: '2022-03-10', poster_path: '/a7GDnv776Z244J79bU456o97vIS.jpg', vote_average: 8.0 },
  { id: 'p2', title: 'Game of Trone', release_date: '2022-03-10', poster_path: '/a7GDnv776Z244J79bU456o97vIS.jpg', vote_average: 8.5 },
  { id: 'p3', title: 'The Divine Fury', release_date: '2022-03-10', poster_path: '/hG4TjZ4C6oF34K5W7F8LpU4K6jH.jpg', vote_average: 7.2 }
];

export default function MoviesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [movies, setMovies] = useState<any[]>(MOCK_POPULAR);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper mapper to format TMDB API items to the domain format expected by MovieDetailScreen
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
        const [popRes, nowRes, upRes, topRes] = await Promise.all([
          tmdbClient.get('/movie/popular'),
          tmdbClient.get('/movie/now_playing'),
          tmdbClient.get('/movie/upcoming'),
          tmdbClient.get('/movie/top_rated'),
        ]);

        if (isMounted) {
          const allItems = [
            ...(popRes.data?.results || []),
            ...(nowRes.data?.results || []),
            ...(upRes.data?.results || []),
            ...(topRes.data?.results || [])
          ];
          
          // Remove duplicates by ID
          const uniqueItemsMap = new Map();
          allItems.forEach(item => {
            if (item && item.id) uniqueItemsMap.set(String(item.id), item);
          });
          setMovies(Array.from(uniqueItemsMap.values()));
        }
      } catch (error) {
        console.warn('Gagal memuat data di MoviesScreen:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTMDbData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMoviePress = (item: any) => {
    const domainMovie = mapTMDbMovieToDomain(item);
    navigation.navigate('MovieDetail', { movie: domainMovie });
  };

  const filteredMovies = movies.filter(m =>
    m.title && m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGridCard = (item: any) => {
    const posterUrl = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.gridCard}
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item)}
      >
        <Image
          source={{ uri: posterUrl }}
          style={styles.gridPosterImage}
          resizeMode="cover"
        />
        <Text style={styles.gridPosterTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.gridRatingContainer}>
          <Text style={styles.gridRatingText}>⭐ {item.vote_average ? (item.vote_average / 2).toFixed(1) : '4.5'}</Text>
          <Text style={styles.gridDateText}>{item.release_date ? item.release_date.split('-')[0] : '2022'}</Text>
        </View>
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
          <View style={styles.searchBar}>
            <SearchIcon width={16} height={16} style={styles.searchIcon} />
            <TextInput
              placeholder="Search movie.."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              editable={true}
            />
          </View>
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
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Movies'}
            </Text>
            {filteredMovies.length === 0 ? (
              <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchText}>No movies found matching your search.</Text>
              </View>
            ) : (
              <View style={styles.gridContainer}>
                {filteredMovies.map(renderGridCard)}
              </View>
            )}
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
    backgroundColor: '#0a1526',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.1,
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
});
