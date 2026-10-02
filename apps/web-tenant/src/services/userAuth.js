import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase.js';

const C_USUARIOS = 'demo_usuarios';
const googleProvider = new GoogleAuthProvider();

function isMobileOrPWA() {
  return (
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

async function saveProfile(uid, data) {
  await setDoc(doc(firestore, C_USUARIOS, uid), data, { merge: true });
}

async function fetchProfile(uid) {
  const snap = await getDoc(doc(firestore, C_USUARIOS, uid));
  return snap.exists() ? snap.data() : {};
}

export async function loginGoogle() {
  if (isMobileOrPWA()) {
    await signInWithRedirect(auth, googleProvider);
    return null; // la página se redirige; el resultado llega via checkRedirectResult
  }
  const { user } = await signInWithPopup(auth, googleProvider);
  return ensureProfile(user);
}

// Llamar en el mount de cualquier página que use Google login.
// Devuelve { user, profile } si había un redirect pendiente, null si no.
export async function checkRedirectResult() {
  const result = await getRedirectResult(auth);
  if (!result) return null;
  return ensureProfile(result.user);
}

async function ensureProfile(user) {
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
  // Send verification email (non-blocking — ignore errors in case of emulator)
  try { await sendEmailVerification(user); } catch (_) {}
  return { user, profile };
}

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
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

export async function updateUserProfile(uid, data) {
  await saveProfile(uid, data);
}

export async function getEspaciosSeguidos(uid) {
  const profile = await fetchProfile(uid);
  return profile.espaciosSeguidos ?? [];
}

export async function followEspacio(uid, espacioId) {
  const prev = await getEspaciosSeguidos(uid);
  if (!prev.includes(espacioId)) {
    await saveProfile(uid, { espaciosSeguidos: [...prev, espacioId] });
  }
}

export async function unfollowEspacio(uid, espacioId) {
  const prev = await getEspaciosSeguidos(uid);
  await saveProfile(uid, { espaciosSeguidos: prev.filter(id => id !== espacioId) });
}

// Mueve los espacios seguidos del localStorage al perfil Firestore del usuario
export async function syncFollowedToFirestore(uid) {
  const local = getLocalFollowed();
  if (local.length === 0) return;
  const prev = await getEspaciosSeguidos(uid);
  const merged = [...new Set([...prev, ...local])];
  await saveProfile(uid, { espaciosSeguidos: merged });
  clearLocalFollowed();
}

function getLocalFollowed() {
  try { return JSON.parse(localStorage.getItem('ant_espacios_seguidos') ?? '[]'); } catch { return []; }
}
function clearLocalFollowed() {
  localStorage.removeItem('ant_espacios_seguidos');
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
