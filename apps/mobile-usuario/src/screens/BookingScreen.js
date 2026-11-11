import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function BookingScreen({ route, navigation }) {
  const { workshop, espacio } = route.params;
  const { user } = useAuth();

  const [nombre, setNombre]         = useState(user?.displayName || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [telefono, setTelefono]     = useState('');
  const [cantidad, setCantidad]     = useState('1');
  const [metodoPago, setMetodoPago] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  const bc = espacio?.brandColors;
  const bcPalette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const bcRoles = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  const brandPrimary = bcRoles.primary || bcPalette[0] || colors.primary;
  const brandButton = bcRoles.button || brandPrimary;
  const headerColor = workshop.headerColor || brandPrimary;

  const cobros = espacio?.cobros || {};
  const mp = Array.isArray(workshop.metodosPago) && workshop.metodosPago.length > 0
    ? workshop.metodosPago
    : null;

  const availableMethods = [];
  if (cobros.efectivo && (!mp || mp.includes('efectivo')))
    availableMethods.push({ key: 'EFECTIVO', label: 'Efectivo' });
  if (cobros.mercadoPago && (!mp || mp.includes('mercadopago')))
    availableMethods.push({ key: 'MERCADO_PAGO', label: 'Mercado Pago' });

  const cobrosLinks = cobros.links ?? [];
  const linkIds = cobros.linksDePago
    ? (mp ? mp.filter(id => id.startsWith('link-')) : cobrosLinks.map(l => `link-${l.id}`))
    : [];
  const visibleLinks = linkIds
    .map(lid => cobrosLinks.find(l => l.id === lid.replace('link-', '')))
    .filter(Boolean);

  async function handleReservar() {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Completá los campos', 'Nombre y email son obligatorios.');
      return;
    }
    const qty = parseInt(cantidad) || 1;
    if (qty < 1) {
      Alert.alert('Cantidad inválida', 'Debe ser al menos 1.');
      return;
    }
    if (availableMethods.length > 0 && !metodoPago) {
      Alert.alert('Método de pago', 'Seleccioná un método de pago.');
      return;
    }

    setLoading(true);
    try {
      await api.reservas.create({
        workshopId: workshop.id,
        nombre: nombre.trim(),
        email: email.trim(),
        estado: 'PENDIENTE',
        metodoPago: metodoPago || null,
        telefono: telefono.trim() || null,
        cantidad: qty,
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
            style={[styles.successBtn, { backgroundColor: brandButton }]}
            onPress={() => navigation.navigate('DrawerScreens', { screen: 'MisReservas' })}
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
        <Text style={[styles.wsPrice, { color: brandPrimary }]}>
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

      {availableMethods.length > 0 && (
        <>
          <Text style={[styles.label, { marginTop: spacing.lg }]}>Método de pago *</Text>
          <View style={styles.paymentRow}>
            {availableMethods.map(m => (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.paymentOption,
                  metodoPago === m.key && [styles.paymentOptionActive, { borderColor: brandButton, backgroundColor: brandButton + '0D' }],
                ]}
                onPress={() => setMetodoPago(m.key)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.paymentRadio,
                  metodoPago === m.key && { borderColor: brandButton },
                ]}>
                  {metodoPago === m.key && <View style={[styles.paymentRadioDot, { backgroundColor: brandButton }]} />}
                </View>
                <Text style={[
                  styles.paymentLabel,
                  metodoPago === m.key && { color: brandButton, fontWeight: '600' },
                ]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {visibleLinks.length > 0 && (
        <>
          <Text style={[styles.label, { marginTop: spacing.lg }]}>Links de pago</Text>
          {visibleLinks.map(link => (
            <TouchableOpacity
              key={link.id}
              style={styles.linkBtn}
              onPress={() => {
                const url = /^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`;
                Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el link.'));
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.linkBtnText}>🔗 {link.nombre}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <TouchableOpacity
        style={[styles.bookBtn, { backgroundColor: brandButton }, loading && { opacity: 0.6 }]}
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
  wsPrice: { fontSize: 18, fontWeight: '700', marginTop: 8 },
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
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  paymentOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(232, 93, 74, 0.05)',
  },
  paymentRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioActive: {
    borderColor: colors.primary,
  },
  paymentRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  paymentLabel: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: '500',
  },
  paymentLabelActive: {
    color: colors.primary,
    fontWeight: '600',
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
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  linkBtnText: { fontSize: 14, fontWeight: '600', color: colors.ink },
});
