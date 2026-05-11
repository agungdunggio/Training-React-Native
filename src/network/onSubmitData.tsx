import getClient from './getClient'; 
import { Alert } from 'react-native'; 

export const submitLoginToApi = async (data: any) => {
  try {
    console.log("Data siap dikirim ke API:", data);

    const response = await getClient.post('/auth/login', {
      username: data.email,   
      password: data.password 
    });

    console.log("Respon dari server:", response.data);
    Alert.alert("Sukses", "Berhasil masuk ke aplikasi!");

  } catch (error: any) {
    console.error("Gagal mengirim data:", error);
    const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server";
    Alert.alert("Gagal", errorMessage);
  }
};