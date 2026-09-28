import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase.js';

const C_USUARIOS = 'demo_usuarios';
const googleProvider = new GoogleAuthProvider();

async function saveProfile(uid, data) {
  await setDoc(doc(firestore, C_USUARIOS, uid), data, { merge: true });
}

async function fetchProfile(uid) {
  const snap = await getDoc(doc(firestore, C_USUARIOS, uid));
  return snap.exists() ? snap.data() : {};
}

export async function loginGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);
  const existing = await fetchProfile(user.uid);
  if (!existing.nombre) {
    await saveProfile(user.uid, {
      nombre:    user.displayName || '',
      email:     user.email || '',
      telefono:  '',
      createdAt: new Date().toISOString(),
    });
  }
  return { user, profile: await fetchProfile(user.uid) };
}

export async function loginEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { user, profile: await fetchProfile(user.uid) };
}

export async function register(email, password, nombre, telefono) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: nombre });
  const profile = { nombre, email, telefono, createdAt: new Date().toISOString() };
  await saveProfile(user.uid, profile);
  return { user, profile };
}

export async function logout() {
  await fbSignOut(auth);
}

export function subscribeAuth(cb) {
  return fbOnAuthChanged(auth, async (user) => {
    if (!user) return cb(null, null);
    cb(user, await fetchProfile(user.uid));
  });
}

export function authErrorMsg(code) {
  return (
    code === 'auth/wrong-password'       ? 'Contraseña incorrecta' :
    code === 'auth/user-not-found'       ? 'No existe una cuenta con ese email' :
    code === 'auth/email-already-in-use' ? 'Ya existe una cuenta con ese email' :
    code === 'auth/weak-password'        ? 'La contraseña debe tener al menos 6 caracteres' :
    code === 'auth/invalid-email'        ? 'Email inválido' :
    code === 'auth/popup-closed-by-user' ? 'Cerraste la ventana de Google' :
    'Error al autenticar. Intentá de nuevo.'
  );
}
