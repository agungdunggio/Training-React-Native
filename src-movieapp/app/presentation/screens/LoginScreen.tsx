import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import { Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useLoginController } from '../controllers/useLoginController';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: NavigationProp;
};

const LoginHeaderTitle = () => (
  <Image
    source={require('../../../assets/logo.png')}
    style={styles.headerLogo}
  />
);

export default function LoginScreen({ navigation }: Props) {
  const {
    control,
    errors,
    isValid,
    loading,
    onLoginSubmit,
    onGuestLogin,
  } = useLoginController();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: colors.primary,
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: colors.white,
      headerTitle: LoginHeaderTitle,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Title Section */}
            <View style={styles.screenHeader}>
              <Text style={styles.screenTitle}>Login to your account</Text>
              <Text style={styles.screenSubtitle}>
                In order to use the editing and rating capabilities of TMDB, as well as get personal recommendations you will need to login to your account
              </Text>
            </View>

            {/* Form Fields Section */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Username"
                    placeholder="Enter username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                    autoCapitalize="none"
                    theme="light"
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Password"
                    placeholder="Ex : jack1231__"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password?.message}
                    theme="light"
                  />
                )}
              />
            </View>

            {/* Buttons Section */}
            <View style={styles.actionContainer}>
              <CustomButton
                title="Login"
                loading={loading}
                disabled={!isValid}
                onPress={onLoginSubmit}
                theme="light"
              />

              <View style={styles.spacer} />

              <CustomButton
                title="Login as Guest"
                variant="secondary"
                disabled={loading}
                onPress={onGuestLogin}
                theme="light"
              />
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerLogo: {
    width: 100,
    height: 35,
    resizeMode: 'contain',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  screenHeader: {

    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  screenSubtitle: {
    fontSize: 13,
    color: '#7e8890',
    lineHeight: 18,
  },
  form: {
    marginBottom: 16,
  },
  actionContainer: {
    marginTop: 8,
  },
  spacer: {
    height: 16,
  },
  trainingHintBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 36,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 6,
  },
  hintText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 16,
  },
});
