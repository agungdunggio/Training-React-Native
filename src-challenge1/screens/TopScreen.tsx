import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { colors } from '../styles/colors';
import { loadInitialSession } from '../storage/authStorage';
import type { RootStackParamList } from '../navigation/types';

const screenPadding = 16;

type Navigation = StackNavigationProp<RootStackParamList>;

export default function TopScreen() {
  const navigation = useNavigation<Navigation>();
  const [checking, setChecking] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const { token } = await loadInitialSession();
        if (!active) return;
        setChecking(false);
        if (token) {
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        }
      })();
      return () => {
        active = false;
      };
    }, [navigation]),
  );

  const content = useMemo(() => {
    if (checking) {
      return (
        <View style={styles.center}>
          <Text style={styles.muted}>Memuat…</Text>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.title}>Training App</Text>
        {/* <Text style={styles.subtitle}>Silakan masuk atau buat akun baru.</Text> */}

        <View style={styles.spacer} />

        <CustomButton
          title="Login"
          variant="primary"
          onPress={() => navigation.navigate('Login')}
          style={styles.btn}
        />
        <CustomButton
          title="Register"
          variant="secondary"
          onPress={() => navigation.navigate('Register')}
          style={styles.btnOutline}
        />
      </>
    );
  }, [checking, navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>{content}</View>
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
    padding: screenPadding,
    justifyContent: 'flex-end',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muted: {
    color: colors.gray600,
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: 24,
  },
  spacer: {
    height: 40,
  },
  btn: {
    marginTop: 8,
  },
  btnOutline: {
    marginTop: 12,
  },
});
