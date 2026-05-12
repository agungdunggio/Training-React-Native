import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import type { StoredUser } from '../storage/authStorage';
import { clearSession, getStoredUser } from '../storage/authStorage';
import { colors } from '../styles/colors';
import type { RootStackParamList } from '../navigation/types';

const PAD = 16;

type Navigation = StackNavigationProp<RootStackParamList>;

export default function MainScreen() {
  const navigation = useNavigation<Navigation>();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getStoredUser();
      setUser(u);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });

      return () => sub.remove();
    }, []),
  );

  function onLogout() {
    Alert.alert('Keluar', 'Yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          navigation.reset({ index: 0, routes: [{ name: 'Top' }] });
        },
      },
    ]);
  }

  const name = user?.userName || 'Pengguna';
  const subtitle = 'Anda telah masuk.';
  const credentialLine = user?.email ? `${user.email}` : '';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.bigHello}>Halo, {name}</Text>

        <View style={styles.space8} />

        <Text style={styles.sub}>{subtitle}</Text>

        {!!credentialLine && <Text style={styles.meta}>{credentialLine}</Text>}

        <View style={styles.flex1} />

        <CustomButton title="Logout" variant="secondary" onPress={onLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    padding: PAD,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  bigHello: {
    marginTop: 8,
    fontSize: 26,
    fontWeight: '800',
    color: colors.black,
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    color: colors.gray600,
    lineHeight: 20,
  },
  meta: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  space8: { height: 8 },
  flex1: { flex: 1 },
});
