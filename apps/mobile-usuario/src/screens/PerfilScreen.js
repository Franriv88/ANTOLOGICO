import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
  Clipboard as RNClipboard, TextInput, ActivityIndicator, Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  signOut, updateProfile, updateEmail, reauthenticateWithCredential,
  EmailAuthProvider, verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { CopyIcon } from '../components/Icons';
import { getAuth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius } from '../lib/theme';
import { LogoAntologico } from '../components/LogoAntologico';

export default function PerfilScreen({ navigation }) {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre]     = useState('');
  const [email, setEmail]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Password for re-auth (email change)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [currentPassword, setCurrentPassword]       = useState('');
  const [pendingEmail, setPendingEmail]              = useState('');

  if (!user) {
    return (
      <View style={styles.authPrompt}>
        <LogoAntologico theme="light" width={100} />
        <Text style={styles.authTitle}>Mi Perfil</Text>
        <Text style={styles.authText}>Iniciá sesión para ver tu perfil.</Text>
        <TouchableOpacity
          style={styles.authBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.authBtnText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const providerData = user.providerData?.[0];
  const isGoogle = providerData?.providerId === 'google.com';

  function startEdit() {
    setNombre(user.displayName || '');
    setEmail(user.email || '');
    setEditMode(true);
  }

  async function handleSave() {
    if (!nombre.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío.');
      return;
    }
    setSaving(true);
    try {
      const auth = getAuth();
      // Update name
      if (nombre.trim() !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: nombre.trim() });
      }
      // Update email (requires re-auth for email/password users)
      if (!isGoogle && email.trim() !== user.email && email.trim()) {
        setPendingEmail(email.trim());
        setSaving(false);
        setShowPasswordPrompt(true);
        return;
      }
      setEditMode(false);
      Alert.alert('Listo', 'Tu perfil fue actualizado.');
    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function confirmEmailChange() {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Ingresá tu contraseña actual.');
      return;
    }
    setSaving(true);
    try {
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await verifyBeforeUpdateEmail(auth.currentUser, pendingEmail);
      setShowPasswordPrompt(false);
      setCurrentPassword('');
      setPendingEmail('');
      setEditMode(false);
      Alert.alert(
        'Verificación enviada',
        `Se envió un email a ${pendingEmail}. Confirmá el cambio desde tu bandeja de entrada.`,
      );
    } catch (err) {
      const msg = err.code === 'auth/wrong-password'
        ? 'Contraseña incorrecta.'
        : err.code === 'auth/invalid-credential'
        ? 'Contraseña incorrecta.'
        : err.message;
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  }

  async function pickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tu galería para elegir una foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploadingPhoto(true);
    try {
      const manipulated = await manipulateAsync(
        asset.uri,
        [{ resize: { width: 256, height: 256 } }],
        { compress: 0.75, format: SaveFormat.WEBP },
      );

      const response = await fetch(manipulated.uri);
      const blob = await response.blob();
      const storage = getStorage();
      const photoRef = storageRef(storage, `profile-photos/${user.uid}.webp`);
      await uploadBytes(photoRef, blob);
      const downloadURL = await getDownloadURL(photoRef);

      // Update Firebase Auth profile
      await updateProfile(getAuth().currentUser, { photoURL: downloadURL });
      Alert.alert('Listo', 'Tu foto de perfil fue actualizada.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo subir la foto. Intentá de nuevo.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  async function handleLogout() {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try { await signOut(getAuth()); } catch {}
            setLoggingOut(false);
          },
        },
      ],
    );
  }

  // Password prompt modal overlay
  if (showPasswordPrompt) {
    return (
      <View style={styles.container}>
        <View style={styles.passwordOverlay}>
          <View style={styles.passwordCard}>
            <Text style={styles.passwordTitle}>Confirmar cambio de email</Text>
            <Text style={styles.passwordSubtext}>
              Para cambiar tu email a {pendingEmail}, ingresá tu contraseña actual.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña actual"
              placeholderTextColor={colors.inkLight}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <View style={styles.passwordActions}>
              <TouchableOpacity
                style={styles.passwordCancelBtn}
                onPress={() => {
                  setShowPasswordPrompt(false);
                  setCurrentPassword('');
                  setPendingEmail('');
                }}
              >
                <Text style={styles.passwordCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={confirmEmailChange}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <TouchableOpacity
          onPress={!isGoogle ? pickPhoto : undefined}
          activeOpacity={isGoogle ? 1 : 0.7}
          disabled={uploadingPhoto}
        >
          {uploadingPhoto ? (
            <View style={styles.avatarImg}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          ) : user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarPhoto} />
          ) : (
            <View style={styles.avatarImg}>
              <Text style={styles.avatarInitial}>{user.displayName?.[0] || '?'}</Text>
            </View>
          )}
          {!isGoogle && !uploadingPhoto && (
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>✎</Text>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.userName}>{user.displayName || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {isGoogle && (
          <View style={styles.googleBadge}>
            <Text style={styles.googleBadgeText}>Cuenta de Google</Text>
          </View>
        )}
      </View>

      {/* Edit / View toggle */}
      {!editMode ? (
        <>
          {/* Info cards */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {user.displayName && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user.displayName}</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>ID de usuario</Text>
                <Text style={[styles.infoValue, { fontSize: 11 }]} selectable>{user.uid}</Text>
              </View>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => {
                  RNClipboard.setString(user.uid);
                  Alert.alert('Copiado', 'ID copiado al portapapeles.');
                }}
                activeOpacity={0.7}
              >
                <CopyIcon size={18} color={colors.inkMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={startEdit}
            activeOpacity={0.8}
          >
            <Text style={styles.editBtnText}>Editar mis datos</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Edit form */}
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
              placeholder="Tu nombre"
              placeholderTextColor={colors.inkLight}
            />
          </View>

          {!isGoogle && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="tu@email.com"
                placeholderTextColor={colors.inkLight}
              />
            </View>
          )}

          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        <Text style={styles.logoutBtnText}>
          {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  content: { padding: spacing.base, paddingBottom: spacing['4xl'] },
  avatarSection: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarImg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarPhoto: {
    width: 80, height: 80, borderRadius: 40,
    marginBottom: spacing.md,
    backgroundColor: colors.surface200,
  },
  avatarBadge: {
    position: 'absolute', bottom: 10, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 2, borderColor: colors.surface0,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBadgeText: { fontSize: 14, color: colors.ink },
  avatarInitial: { fontSize: 30, fontWeight: '700', color: colors.white },
  userName: { fontSize: 20, fontWeight: '700', color: colors.ink },
  userEmail: { fontSize: 14, color: colors.inkMuted, marginTop: 2 },
  googleBadge: {
    backgroundColor: colors.blueBg, borderRadius: radius.full,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: spacing.sm,
  },
  googleBadgeText: { fontSize: 11, fontWeight: '600', color: colors.blue },
  infoCard: {
    backgroundColor: colors.white, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
  },
  copyBtn: {
    width: 36, height: 36, borderRadius: radius.md,
    backgroundColor: colors.surface100,
    alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 12, fontWeight: '500', color: colors.inkLight, marginBottom: 4 },
  infoValue: { fontSize: 15, color: colors.ink },
  input: {
    backgroundColor: colors.surface0, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 10,
    fontSize: 15, color: colors.ink,
  },
  editBtn: {
    borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  editBtnText: { color: colors.primary, fontSize: 15, fontWeight: '600' },
  editActions: {
    flexDirection: 'row', gap: spacing.md, marginTop: spacing.md,
  },
  cancelBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { color: colors.inkMuted, fontSize: 15, fontWeight: '600' },
  saveBtn: {
    flex: 1, backgroundColor: colors.primary, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  saveBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    borderWidth: 1, borderColor: colors.red, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.xl,
  },
  logoutBtnText: { color: colors.red, fontSize: 15, fontWeight: '600' },
  authPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.surface0 },
  authTitle: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  authText: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.xl },
  authBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing['2xl'], paddingVertical: 12 },
  authBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  passwordOverlay: {
    flex: 1, justifyContent: 'center', padding: spacing.xl,
    backgroundColor: colors.surface0,
  },
  passwordCard: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.xl,
  },
  passwordTitle: {
    fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm,
  },
  passwordSubtext: {
    fontSize: 13, color: colors.inkMuted, marginBottom: spacing.lg, lineHeight: 18,
  },
  passwordActions: {
    flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg,
  },
  passwordCancelBtn: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center',
  },
  passwordCancelText: { color: colors.inkMuted, fontSize: 15, fontWeight: '600' },
});
