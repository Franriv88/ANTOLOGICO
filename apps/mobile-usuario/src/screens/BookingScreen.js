import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Linking, Image,
} from 'react-native';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { EfectivoIcon, MercadoPagoIcon, LinkIcon } from '../components/Icons';

export default function BookingScreen({ route, navigation }) {
  const { workshop, espacio } = route.params;
  const { user } = useAuth();

  const [nombre, setNombre]         = useState(user?.displayName || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [telefono, setTelefono]     = useState('');
  const [cantidad, setCantidad]     = useState(1);
  const [participantes, setParticipantes] = useState(['']);
  const [metodoPago, setMetodoPago] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);

  const bc = espacio?.brandColors;
  const bcPalette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const bcRoles = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  const brandPrimary = bcRoles.primary || bcPalette[0] || colors.primary;
  const brandButton = bcRoles.button || brandPrimary;

  const headerImage = workshop.headerType === 'IMAGE' ? workshop.headerValue : null;
  const headerColor = workshop.headerColor || workshop.headerValue || brandPrimary;

  const cobros = espacio?.cobros || {};
  const mp = Array.isArray(workshop.metodosPago) && workshop.metodosPago.length > 0
    ? workshop.metodosPago
    : null;

  const availableMethods = [];
  if (cobros.efectivo && (!mp || mp.includes('efectivo')))
    availableMethods.push({ key: 'EFECTIVO', label: 'Efectivo', Icon: EfectivoIcon });
  if (cobros.mercadoPago && (!mp || mp.includes('mercadopago')))
    availableMethods.push({ key: 'MERCADO_PAGO', label: 'Mercado Pago', Icon: MercadoPagoIcon });

  const cobrosLinks = cobros.links ?? [];
  const linkIds = cobros.linksDePago
    ? (mp ? mp.filter(id => id.startsWith('link-')) : cobrosLinks.map(l => `link-${l.id}`))
    : [];
  const visibleLinks = linkIds
    .map(lid => cobrosLinks.find(l => l.id === lid.replace('link-', '')))
    .filter(Boolean);

  function incrementCantidad() {
    const max = workshop.cuposDisponibles ?? 10;
    if (cantidad < max) {
      const next = cantidad + 1;
      setCantidad(next);
      setParticipantes(prev => {
        const arr = [...prev];
        while (arr.length < next) arr.push('');
        return arr;
      });
    }
  }

  function decrementCantidad() {
    if (cantidad > 1) {
      const next = cantidad - 1;
      setCantidad(next);
      setParticipantes(prev => prev.slice(0, next));
    }
  }

  function updateParticipante(index, value) {
    setParticipantes(prev => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });
  }

  async function handleReservar() {
    if (!nombre.trim() || !email.trim()) {
      Alert.alert('Completá los campos', 'Nombre y email son obligatorios.');
      return;
    }
    if (cantidad > 1) {
      const empty = participantes.slice(1).some(p => !p.trim());
      if (empty) {
        Alert.alert('Participantes', 'Completá el nombre de todos los participantes.');
        return;
      }
    }
    if ((availableMethods.length > 0 || visibleLinks.length > 0) && !metodoPago) {
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
        cantidad,
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
          <View style={styles.successIconWrap}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
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

  const formattedDate = workshop.fecha
    ? new Date(workshop.fecha).toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long',
      }).replace(/^\w/, c => c.toUpperCase())
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Workshop header */}
      {headerImage ? (
        <View style={styles.wsImageWrap}>
          <Image source={{ uri: headerImage }} style={styles.wsImage} />
          <View style={styles.wsImagePriceBadge}>
            <Text style={styles.wsImagePriceText}>
              $ {Number(workshop.precio || 0).toLocaleString('es-AR')}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Workshop info */}
      <View style={styles.wsInfo}>
        <Text style={styles.wsName}>{workshop.nombre}</Text>
        {formattedDate && (
          <Text style={styles.wsDate}>
            {formattedDate}
            {workshop.horaInicio ? ` · ${workshop.horaInicio}` : ''}
          </Text>
        )}
      </View>

      {/* Cantidad de cupos */}
      <Text style={styles.label}>Cantidad de cupos</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={[styles.qtyBtn, cantidad <= 1 && styles.qtyBtnDisabled]}
          onPress={decrementCantidad}
          disabled={cantidad <= 1}
        >
          <Text style={[styles.qtyBtnText, cantidad <= 1 && styles.qtyBtnTextDisabled]}>—</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{cantidad}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={incrementCantidad}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.qtyLabel}>{cantidad === 1 ? 'cupo' : 'cupos'}</Text>
      </View>

      {/* Participantes */}
      {cantidad === 1 ? (
        <>
          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del participante"
            placeholderTextColor={colors.inkLight}
            autoCapitalize="words"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Participante 1 *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del participante"
            placeholderTextColor={colors.inkLight}
            autoCapitalize="words"
          />
          {Array.from({ length: cantidad - 1 }, (_, i) => (
            <View key={i + 1}>
              <Text style={styles.label}>Participante {i + 2} *</Text>
              <TextInput
                style={styles.input}
                value={participantes[i + 1] || ''}
                onChangeText={(val) => updateParticipante(i + 1, val)}
                placeholder="Nombre del participante"
                placeholderTextColor={colors.inkLight}
                autoCapitalize="words"
              />
            </View>
          ))}
        </>
      )}

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

      <Text style={styles.label}>Teléfono *</Text>
      <TextInput
        style={styles.input}
        value={telefono}
        onChangeText={setTelefono}
        placeholder="+54 9 11 1234-5678"
        placeholderTextColor={colors.inkLight}
        keyboardType="phone-pad"
      />

      {/* Payment methods */}
      {(availableMethods.length > 0 || visibleLinks.length > 0) && (
        <View style={styles.paymentSection}>
          {availableMethods.map(m => (
            <TouchableOpacity
              key={m.key}
              style={[
                styles.paymentBtn,
                metodoPago === m.key && styles.paymentBtnActive,
              ]}
              onPress={() => setMetodoPago(m.key)}
              activeOpacity={0.7}
            >
              <m.Icon size={18} color={colors.ink} />
              <Text style={[
                styles.paymentLabel,
                metodoPago === m.key && styles.paymentLabelActive,
              ]}>{m.label}</Text>
            </TouchableOpacity>
          ))}

          {visibleLinks.map(link => (
            <TouchableOpacity
              key={link.id}
              style={styles.paymentBtn}
              onPress={() => {
                const url = /^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`;
                Linking.openURL(url).catch(() => Alert.alert('Error', 'No se pudo abrir el link.'));
              }}
              activeOpacity={0.7}
            >
              <LinkIcon size={16} color={colors.ink} />
              <Text style={styles.paymentLabel}>{link.nombre || 'Link de Pago'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Cancelar */}
      <TouchableOpacity
        style={styles.cancelLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelLinkText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  content: { paddingBottom: spacing['4xl'] },

  wsImageWrap: {
    height: 200, position: 'relative', backgroundColor: colors.surface200,
  },
  wsImage: { width: '100%', height: 200, resizeMode: 'cover' },
  wsImagePriceBadge: {
    position: 'absolute', top: spacing.md, left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.md,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  wsImagePriceText: { color: '#fff', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },

  wsInfo: { paddingHorizontal: spacing.base, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  wsName: { fontSize: 20, fontWeight: '700', color: colors.ink },
  wsDate: { fontSize: 13, color: colors.inkMuted, marginTop: 4 },

  label: {
    fontSize: 13, fontWeight: '500', color: colors.inkMuted,
    marginBottom: 6, marginTop: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.ink,
    marginHorizontal: spacing.base,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
  },
  qtyBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  qtyBtnDisabled: { opacity: 0.35 },
  qtyBtnText: { fontSize: 18, fontWeight: '500', color: colors.ink, lineHeight: 20 },
  qtyBtnTextDisabled: { color: colors.inkLight },
  qtyValue: { fontSize: 18, fontWeight: '600', color: colors.ink, minWidth: 24, textAlign: 'center' },
  qtyLabel: { fontSize: 14, color: colors.inkMuted },

  paymentSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  paymentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  paymentBtnActive: {
    borderColor: colors.ink,
    backgroundColor: colors.surface100,
  },
  paymentIconWrap: { marginRight: 2 },
  paymentLabel: {
    fontSize: 15, fontWeight: '500', color: colors.ink,
  },
  paymentLabelActive: { fontWeight: '600' },

  cancelLink: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.sm,
  },
  cancelLinkText: { fontSize: 14, color: colors.inkMuted, fontWeight: '500' },

  successContainer: {
    flex: 1, backgroundColor: colors.surface0,
    alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl,
  },
  successBox: { alignItems: 'center' },
  successIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.greenBg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successIcon: { fontSize: 32, color: colors.green, fontWeight: '700' },
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
