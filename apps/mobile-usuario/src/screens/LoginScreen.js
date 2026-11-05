import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { colors, spacing, radius } from '../lib/theme';

export default function LoginScreen() {
  const [mode, setMode]         = useState('login'); // login | register
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre]     = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleEmailAuth() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Completá los campos', 'Email y contraseña son requeridos.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!nombre.trim()) {
          Alert.alert('Completá tu nombre');
          setLoading(false);
          return;
        }
        const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
        // TODO: upsert profesional if needed
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'     ? 'No existe una cuenta con ese email.'
                : err.code === 'auth/wrong-password'      ? 'Contraseña incorrecta.'
                : err.code === 'auth/email-already-in-use'? 'Ese email ya tiene una cuenta. Iniciá sesión.'
                : err.code === 'auth/weak-password'       ? 'La contraseña debe tener al menos 6 caracteres.'
                : err.message;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>Antológico</Text>
          <Text style={styles.subtitle}>Descubrí talleres cerca tuyo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'register' && (
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor={colors.inkLight}
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.inkLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colors.inkLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.btnText}>
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle */}
          <TouchableOpacity
            onPress={() => setMode(mode === 'login' ? 'register' : 'login')}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {mode === 'login'
                ? '¿No tenés cuenta? Creá una'
                : '¿Ya tenés cuenta? Iniciá sesión'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface0,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.inkMuted,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.ink,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  toggleText: {
    color: colors.primary,
    fontSize: 14,
  },
});
