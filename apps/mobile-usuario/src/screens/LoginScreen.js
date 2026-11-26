import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert,
  Dimensions,
} from 'react-native';
import { AntologicoButtonSpinner } from '../components/Icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { getAuth } from '../lib/firebase';
import { colors, spacing, radius } from '../lib/theme';
import { LogoAntologico } from '../components/LogoAntologico';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

export default function LoginScreen() {
  const [mode, setMode]         = useState('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  async function handleGoogleAuth() {
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        'Google Auth no configurado',
        'Falta agregar EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID en el archivo .env',
      );
      return;
    }
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(getAuth(), credential);
        }
      }
    } catch (err) {
      if (err.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Error', err.message || 'No se pudo iniciar con Google');
      }
    } finally {
      setGoogleLoading(false);
    }
  }

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
        const { user } = await createUserWithEmailAndPassword(getAuth(), email.trim(), password);
        await updateProfile(user, { displayName: nombre.trim() });
      } else {
        await signInWithEmailAndPassword(getAuth(), email.trim(), password);
      }
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'      ? 'No existe una cuenta con ese email.'
                : err.code === 'auth/wrong-password'       ? 'Contraseña incorrecta.'
                : err.code === 'auth/invalid-credential'   ? 'Email o contraseña incorrectos.'
                : err.code === 'auth/email-already-in-use' ? 'Ese email ya tiene una cuenta. Iniciá sesión.'
                : err.code === 'auth/weak-password'        ? 'La contraseña debe tener al menos 6 caracteres.'
                : err.message;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <LinearGradient
      colors={['#E85D4A', '#C4412F', '#8C2E1F']}
      locations={[0, 0.48, 1]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inner}>
          {/* Logo */}
          <View style={styles.logoBox}>
            <LogoAntologico theme="coral" width={280} />
            <Text style={styles.subtitle}>Descubrí talleres cerca tuyo</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Google button */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleAuth}
              disabled={googleLoading}
              activeOpacity={0.8}
            >
              {googleLoading ? (
                <AntologicoButtonSpinner size={24} />
              ) : (
                <>
                  <GoogleIcon />
                  <Text style={styles.googleBtnText}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Form */}
            {!isLogin && (
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
              activeOpacity={0.8}
            >
              {loading ? (
                <AntologicoButtonSpinner size={24} />
              ) : (
                <Text style={styles.btnText}>
                  {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Toggle */}
            <TouchableOpacity
              onPress={() => setMode(isLogin ? 'register' : 'login')}
              style={styles.toggleBtn}
            >
              <Text style={styles.toggleText}>
                {isLogin
                  ? '¿No tenés cuenta? '
                  : '¿Ya tenés cuenta? '}
                <Text style={styles.toggleTextBold}>
                  {isLogin ? 'Creá una' : 'Iniciá sesión'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function GoogleIcon() {
  return (
    <View style={styles.googleIconBox}>
      <Text style={{ fontSize: 18 }}>G</Text>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginTop: spacing.xs,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 13,
  },
  googleIconBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: colors.inkLight,
  },

  input: {
    backgroundColor: colors.surface0,
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
    marginTop: spacing.xs,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  toggleBtn: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleText: {
    color: colors.inkMuted,
    fontSize: 13,
  },
  toggleTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});
