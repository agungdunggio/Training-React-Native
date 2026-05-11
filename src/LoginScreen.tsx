import React, { useState } from 'react'; // 1. Tambahkan useState
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { submitLoginToApi } from './network/onSubmitData';
import getClient from './network/getClient';
import { loginSuccess } from './store/authSlice';
import { useDispatch } from 'react-redux';
const loginSchema = yup.object().shape({
  email: yup.string().required('Email wajib diisi'),
  password: yup.string().min(6, 'Minimal 6 karakter').required('Password wajib diisi'),
});

const LoginScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmitData = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await getClient.post('/auth/login', {
        username: data.email,   
        password: data.password 
      });

      const userData = response.data; 

      dispatch(loginSuccess({
        user: userData,
        token: userData.token 
      }));

      Alert.alert("Sukses", `Selamat datang, ${userData.firstName}!`);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan";
      Alert.alert("Login Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Masukkan Email"
            style={styles.input}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Masukkan Password"
            style={styles.input}
            secureTextEntry
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleSubmit(onSubmitData)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    justifyContent: 'center', 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 5, 
    borderRadius: 5 
  },
  errorText: { 
    color: 'red', 
    marginBottom: 15, 
    fontSize: 12 
  },
  // Tambahan styling untuk kotak hasil
  resultContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91d5ff'
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16
  }
});

export default LoginScreen;