import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectorConfig } from '../dataconnect-generated';

const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY            || 'demo-api-key',
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'antologico.firebaseapp.com',
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID         || 'antologico',
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'antologico.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app       = initializeApp(firebaseConfig);
export const auth      = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const dc        = getDataConnect(app, connectorConfig);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, 'us-central1');
