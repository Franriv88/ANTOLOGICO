import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { connectorConfig } from '../dataconnect-generated';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY     || 'demo-api-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'antologico.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID  || 'antologico',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app       = initializeApp(firebaseConfig);
export const auth      = initializeAuth(app, {
  persistence: browserLocalPersistence,
});
export const dc        = getDataConnect(app, connectorConfig);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, 'us-central1');

if (import.meta.env.DEV && import.meta.env.MODE !== 'demo') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectDataConnectEmulator(dc, '127.0.0.1', 9399);
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
