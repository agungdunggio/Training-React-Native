// import messaging from '@react-native-firebase/messaging';
// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//     await getFcmToken();
//   }
// };

// const getFcmToken = async () => {
//   try {
//     const fcmToken = await messaging().getToken();
//     if (fcmToken) {
//       console.log('Your FCM Token:', fcmToken);
//       // Simpan ke AsyncStorage atau kirim ke API backend kamu
//       await AsyncStorage.setItem('fcmToken', fcmToken);
//     }
//   } catch (error) {
//     console.log('Error getting FCM Token:', error);
//   }
// };

// // Listener untuk berbagai kondisi aplikasi
// export const notificationListener = (navigation: any) => {
//   // 1. Saat aplikasi berjalan di latar belakang (Background) dan diklik
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log('Notification caused app to open from background:', remoteMessage);
//     handleNavigation(remoteMessage, navigation);
//   });

//   // 2. Saat aplikasi dalam keadaan mati total (Quit State) dan diklik
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log('Notification caused app to open from quit state:', remoteMessage);
//         handleNavigation(remoteMessage, navigation);
//       }
//     });

//   // 3. Saat aplikasi sedang terbuka (Foreground)
//   messaging().onMessage(async remoteMessage => {
//     console.log('A new FCM message arrived!', remoteMessage);
//     // Di sini biasanya kita tampilkan Alert atau Local Notification
//   });
// };

// const handleNavigation = (remoteMessage: any, navigation: any) => {
//   const { type, id } = remoteMessage.data;
  
//   if (type === 'order' || type === 'order-payment') {
//     navigation.navigate('Details', { orderId: id });
//   } else if (type === 'debt') {
//     navigation.navigate('Profile'); // Sesuaikan dengan screen kamu
//   }
// };