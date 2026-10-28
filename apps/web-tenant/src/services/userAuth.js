import {
  GoogleAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  updatePassword as fbUpdatePassword,
  verifyBeforeUpdateEmail,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase.js';
import { trackRegistro, trackLogin } from '../lib/analytics.js';

const C_USUARIOS = 'demo_usuarios';
const googleProvider = new GoogleAuthProvider();

async function saveProfile(uid, data) {
  await setDoc(doc(firestore, C_USUARIOS, uid), data, { merge: true });
}

export async function fetchProfile(uid) {
  const snap = await getDoc(doc(firestore, C_USUARIOS, uid));
  return snap.exists() ? snap.data() : {};
}

// signInWithRedirect está roto en iOS Safari 14+ (ITP bloquea cookies de terceros).
// signInWithPopup funciona en todos los navegadores cuando viene de un gesto del usuario.
export async function loginGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  const isNewUser = getAdditionalUserInfo(credential)?.isNewUser ?? false;
  const result = await ensureProfile(credential.user);
  if (isNewUser) trackRegistro({ method: 'google' });
  else trackLogin({ method: 'google' });
  return { ...result, isNewUser };
}

// Mantenemos la función como no-op por compatibilidad con los useEffect existentes
export async function checkRedirectResult() {
  return null;
}

async function ensureProfile(user) {
  const existing = await fetchProfile(user.uid);
  const now = new Date().toISOString();
  if (!existing.nombre) {
    await saveProfile(user.uid, {
      nombre:      user.displayName || '',
      email:       user.email || '',
      telefono:    '',
      authMethod:  'google',
      photoURL:    user.photoURL || '',
      createdAt:   now,
      lastLoginAt: now,
    });
  } else {
    const patch = { lastLoginAt: now };
    if (!existing.createdAt) patch.createdAt = now;
    if (!existing.authMethod) patch.authMethod = 'google';
    await saveProfile(user.uid, patch);
  }
  return { user, profile: await fetchProfile(user.uid) };
}

export async function loginEmail(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const existing = await fetchProfile(user.uid);
  const now = new Date().toISOString();
  const patch = { lastLoginAt: now };
  if (!existing.createdAt) patch.createdAt = now;
  if (!existing.authMethod) patch.authMethod = 'email';
  await saveProfile(user.uid, patch);
  trackLogin({ method: 'email' });
  return { user, profile: await fetchProfile(user.uid) };
}

export async function register(email, password, nombre, telefono) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: nombre });
  const now = new Date().toISOString();
  const profile = {
    nombre,
    email,
    telefono,
    authMethod:  'email',
    photoURL:    '',
    createdAt:   now,
    lastLoginAt: now,
  };
  await saveProfile(user.uid, profile);
  await sendEmailVerification(user);
  trackRegistro({ method: 'email' });
  return { user, profile };
}

export async function sendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function logout() {
  await fbSignOut(auth);
}

export function getAuthCurrentUser() {
  return auth.currentUser;
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
  const remote = profile.espaciosSeguidos ?? [];
  const local  = getLocalFollowed();
  return [...new Set([...remote, ...local])];
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

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No hay sesión activa');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await fbUpdatePassword(user, newPassword);
}

export async function changeEmail(currentPassword, newEmail) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No hay sesión activa');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await verifyBeforeUpdateEmail(user, newEmail);
}

export function authErrorMsg(code) {
  return (
    code === 'auth/wrong-password'          ? 'Contraseña incorrecta' :
    code === 'auth/user-not-found'          ? 'No existe una cuenta con ese email. ¿Querés crear una?' :
    code === 'auth/invalid-credential'      ? 'Email o contraseña incorrectos' :
    code === 'auth/email-already-in-use'    ? 'Ya existe una cuenta con ese email' :
    code === 'auth/weak-password'           ? 'La contraseña debe tener al menos 8 caracteres, una letra, un número y un símbolo' :
    code === 'auth/invalid-email'           ? 'Email inválido' :
    code === 'auth/popup-closed-by-user'    ? 'Cerraste la ventana de Google' :
    code === 'auth/popup-blocked'           ? 'El navegador bloqueó la ventana. Permitir popups e intentar de nuevo.' :
    code === 'auth/cancelled-popup-request' ? 'Cerraste la ventana de Google' :
    'Error al autenticar. Intentá de nuevo.'
  );
}
