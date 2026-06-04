/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src-movieapp/App';
import { name as appName } from './app.json';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
