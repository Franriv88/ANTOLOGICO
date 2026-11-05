import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius } from '../lib/theme';

export default function PerfilScreen({ navigation }) {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) {
    return (
      <View style={styles.authPrompt}>
        <Text style={styles.authIcon}>👤</Text>
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
            try { await signOut(auth); } catch {}
            setLoggingOut(false);
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        {user.photoURL ? (
          <View style={styles.avatarImg}>
            <Text style={styles.avatarInitial}>{user.displayName?.[0] || '?'}</Text>
          </View>
        ) : (
          <View style={styles.avatarImg}>
            <Text style={styles.avatarInitial}>{user.displayName?.[0] || '?'}</Text>
          </View>
        )}
        <Text style={styles.userName}>{user.displayName || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {isGoogle && (
          <View style={styles.googleBadge}>
            <Text style={styles.googleBadgeText}>Cuenta de Google</Text>
          </View>
        )}
      </View>

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
        <Text style={styles.infoLabel}>ID de usuario</Text>
        <Text style={[styles.infoValue, { fontSize: 11 }]}>{user.uid}</Text>
      </View>

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
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitial: { fontSize: 28, fontWeight: '700', color: colors.white },
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
  infoLabel: { fontSize: 12, fontWeight: '500', color: colors.inkLight, marginBottom: 4 },
  infoValue: { fontSize: 15, color: colors.ink },
  logoutBtn: {
    borderWidth: 1, borderColor: colors.red, borderRadius: radius.md,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.xl,
  },
  logoutBtnText: { color: colors.red, fontSize: 15, fontWeight: '600' },
  authPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.surface0 },
  authIcon: { fontSize: 48, marginBottom: spacing.md },
  authTitle: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  authText: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.xl },
  authBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing['2xl'], paddingVertical: 12 },
  authBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
