import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import getClient from './network/getClient';

type user = {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

const ProfileScreen = () => {
  const [userData, setUserData] = useState<user | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = async () => {
    try {

      const response = await getClient.get('/users/20');
      
      setUserData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Sedang memuat data...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Data tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil Pengguna</Text>
      
      <Text style={styles.text}>Nama Depan: {userData.firstName}</Text>
      <Text style={styles.text}>Nama Belakang: {userData.lastName}</Text>
      <Text style={styles.text}>Umur: {userData.age} tahun</Text>
      <Text style={styles.text}>Email: {userData.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default ProfileScreen;