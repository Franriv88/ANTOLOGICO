import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function BookingScreen({ route, navigation }) {
  const { workshop, espacio } = route.params;
  const { user } = useAuth();

  const [nombre, setNombre]     = useState(user?.displayName || '');
  const [email, setEmail]       = useState(user?.email || '');
  const [telefono, setTelefono] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const available = workshop.cuposDisponibles ?? 0;
  const headerColor = workshop.headerColor || espacio?.brandColors?.Principal || colors.primary;

  async function handleReservar() {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Completá los campos', 'Nombre y email son obligatorios.');
      return;
    }
    const qty = parseInt(cantidad) || 1;
    if (qty < 1 || qty > available) {
      Alert.alert('Cantidad inválida', `Podés reservar entre 1 y ${available} lugares.`);
      return;
    }

    setLoading(true);
    try {
      await api.reservas.create({
        workshopId: workshop.id,
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim() || null,
        cantidad: qty,
        metodoPago: 'EFECTIVO',
      });
      setSuccess(true);
    } catch (err) {
      Alert.alert('Error al reservar', err.message || 'Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
          <Text style={styles.successText}>
            Tu lugar en <Text style={{ fontWeight: '600' }}>{workshop.nombre}</Text> está asegurado.
          </Text>
          {workshop.fecha && (
            <Text style={styles.successDate}>
              {new Date(workshop.fecha).toLocaleDateString('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
              {workshop.horaInicio ? ` a las ${workshop.horaInicio}` : ''}
            </Text>
          )}
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => navigation.navigate('MisReservas')}
          >
            <Text style={styles.successBtnText}>Ver mis reservas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.successBtnOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.successBtnOutlineText}>Volver al espacio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Workshop summary */}
      <View style={[styles.wsPreview, { borderLeftColor: headerColor }]}>
        <Text style={styles.wsType}>{workshop.tipo || 'WORKSHOP'}</Text>
        <Text style={styles.wsName}>{workshop.nombre}</Text>
        {workshop.fecha && (
          <Text style={styles.wsDate}>
            {new Date(workshop.fecha).toLocaleDateString('es-AR', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
            {workshop.horaInicio ? ` · ${workshop.horaInicio}` : ''}
          </Text>
        )}
        <Text style={styles.wsPrice}>
          ${Number(workshop.precio || 0).toLocaleString('es-AR')}
        </Text>
      </View>

      {/* Form */}
      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Tu nombre completo"
        placeholderTextColor={colors.inkLight}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="tu@email.com"
        placeholderTextColor={colors.inkLight}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Opcional"
        placeholderTextColor={colors.inkLight}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Cantidad de lugares</Text>
      <TextInput
        style={[styles.input, { width: 80 }]}
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="number-pad"
      />
      <Text style={styles.availText}>{available} cupos disponibles</Text>

      <TouchableOpacity
        style={[styles.bookBtn, loading && { opacity: 0.6 }]}
        onPress={handleReservar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.bookBtnText}>Reservar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  content: { padding: spacing.base, paddingBottom: spacing['4xl'] },
  wsPreview: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  wsType: {
    fontSize: 10, fontWeight: '700', color: colors.inkLight,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4,
  },
  wsName: { fontSize: 17, fontWeight: '600', color: colors.ink },
  wsDate: { fontSize: 13, color: colors.inkMuted, marginTop: 4 },
  wsPrice: { fontSize: 18, fontWeight: '700', color: colors.primary, marginTop: 8 },
  label: {
    fontSize: 13, fontWeight: '500', color: colors.inkMuted,
    marginBottom: 4, marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.ink,
  },
  availText: {
    fontSize: 12, color: colors.inkLight, marginTop: 4,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  bookBtnText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  successContainer: {
    flex: 1, backgroundColor: colors.surface0,
    alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl,
  },
  successBox: { alignItems: 'center' },
  successIcon: {
    fontSize: 48, color: colors.green, marginBottom: spacing.md,
    width: 72, height: 72, lineHeight: 72, textAlign: 'center',
    backgroundColor: colors.greenBg, borderRadius: 36, overflow: 'hidden',
  },
  successTitle: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  successText: { fontSize: 14, color: colors.inkMuted, textAlign: 'center', lineHeight: 20 },
  successDate: {
    fontSize: 14, fontWeight: '600', color: colors.ink,
    marginTop: spacing.md, textAlign: 'center',
  },
  successBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing['2xl'], paddingVertical: 12,
    marginTop: spacing.xl,
  },
  successBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
  successBtnOutline: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing['2xl'], paddingVertical: 12,
    marginTop: spacing.md,
  },
  successBtnOutlineText: { color: colors.inkMuted, fontWeight: '500', fontSize: 14 },
});
