import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Polygon, Polyline, Line } from 'react-native-svg';
import { useAuthController } from '../controllers/useAuthController';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Custom Premium Inline SVG Icons for pixel-perfect clarity & zero-dependency compile safety
const StarIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

const HeartIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

const ListIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="8" y1="6" x2="21" y2="6" />
    <Line x1="8" y1="12" x2="21" y2="12" />
    <Line x1="8" y1="18" x2="21" y2="18" />
    <Line x1="3" y1="6" x2="3.01" y2="6" />
    <Line x1="3" y1="12" x2="3.01" y2="12" />
    <Line x1="3" y1="18" x2="3.01" y2="18" />
  </Svg>
);

const LogoutIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const ChevronRight = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

export default function AccountScreen({ route, isTab: propIsTab = false }: { route?: any; isTab?: boolean }) {
  const isTab = propIsTab || route?.params?.isTab || false;
  const navigation = useNavigation<NavigationProp>();
  const { currentUser, handleLogout } = useAuthController();

  useEffect(() => {
    if (currentUser && currentUser.isGuest) {
      Alert.alert(
        'Akses Ditolak',
        'Menu akun dilindungi. Harap masuk dengan akun Anda untuk melihat bagian ini.',
        [
          {
            text: 'Masuk Sekarang',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            },
          },
        ]
      );
    }
  }, [currentUser, navigation]);

  if (!currentUser || currentUser.isGuest) {
    return (
      <View style={styles.blockScreen}>
        <Text style={styles.blockText}>Memeriksa Otorisasi...</Text>
      </View>
    );
  }

  const ContainerComponent = isTab ? View : SafeAreaView;

  // Capitalize name for beautiful aesthetic display
  const displayName = currentUser.username
    ? currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)
    : 'Juliarta';

  return (
    <ContainerComponent style={styles.container}>
      {/* Header - Only show if not loaded inside tab view */}
      {!isTab && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menu Akun</Text>
          <View style={styles.spacer} />
        </View>
      )}

      {/* Immersive Dark Blue Profile Banner matching screenshot */}
      <View style={[styles.profileBanner, isTab && styles.profileBannerTab]}>
        {/* Subtle cyan diagonal accent lines overlays matching layout bounds */}
        <View style={[styles.bannerAccentLine, styles.bannerAccentLine1]} />
        <View style={[styles.bannerAccentLine, styles.bannerAccentLine2]} />

        <View style={styles.profileHeaderContent}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
            style={styles.avatar}
          />
          <Text style={styles.usernameText}>
            {displayName}
          </Text>
        </View>
      </View>

      {/* Body Card List menus */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Manage your account</Text>

        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => Alert.alert('Info', 'Ratings pressed!')}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconWrapper}>
              <StarIcon color="#0a1526" />
            </View>
            <Text style={styles.menuLabel}>Ratings</Text>
          </View>
          <ChevronRight color="#01b4e4" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => Alert.alert('Info', 'Favorite pressed!')}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconWrapper}>
              <HeartIcon color="#0a1526" />
            </View>
            <Text style={styles.menuLabel}>Favorite</Text>
          </View>
          <ChevronRight color="#01b4e4" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={() => Alert.alert('Info', 'List pressed!')}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconWrapper}>
              <ListIcon color="#0a1526" />
            </View>
            <Text style={styles.menuLabel}>List</Text>
          </View>
          <ChevronRight color="#01b4e4" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <View style={styles.menuLeft}>
            <View style={styles.iconWrapper}>
              <LogoutIcon color="#0a1526" />
            </View>
            <Text style={styles.menuLabel}>Logout</Text>
          </View>
          <ChevronRight color="#01b4e4" />
        </TouchableOpacity>
      </ScrollView>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  blockScreen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  backIcon: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0a1526',
  },
  spacer: {
    width: 40,
  },
  profileBanner: {
    backgroundColor: '#0a1526', // Immersive TMDB dark blue
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  profileBannerTab: {
    // Offset standard platform safe statusbar height when rendered inside bottom tabs
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    height: Platform.OS === 'ios' ? 144 : 120,
  },
  bannerAccentLine: {
    position: 'absolute',
    width: 250,
    height: 3,
    backgroundColor: '#01b4e4',
    opacity: 0.15,
  },
  bannerAccentLine1: {
    transform: [{ rotate: '-45deg' }],
    top: -20,
    right: 30,
  },
  bannerAccentLine2: {
    transform: [{ rotate: '-45deg' }],
    top: 10,
    right: -10,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#e5e7eb',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 16,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    letterSpacing: 0.1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a1526',
  },
});
