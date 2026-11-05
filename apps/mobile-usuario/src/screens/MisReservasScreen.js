import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

function StatusBadge({ estado }) {
  const map = {
    CONFIRMADA: { bg: colors.greenBg, color: colors.green,  label: 'Confirmada' },
    CANCELADA:  { bg: colors.redBg,   color: colors.red,    label: 'Cancelada'  },
    PENDIENTE:  { bg: colors.amberBg, color: colors.amber,  label: 'Pendiente'  },
  };
  const s = map[estado] || map.PENDIENTE;
  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

export default function MisReservasScreen({ navigation }) {
  const { user } = useAuth();
  const [reservas, setReservas]     = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    try {
      const data = await api.reservas.listMine();
      data.sort((a, b) => {
        const dateA = a.workshop?.fecha ? new Date(a.workshop.fecha) : new Date(0);
        const dateB = b.workshop?.fecha ? new Date(b.workshop.fecha) : new Date(0);
        return dateA - dateB;
      });
      setReservas(data);
    } catch (err) {
      console.error('Error loading reservas:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function handleCancel(reserva) {
    Alert.alert(
      'Cancelar reserva',
      `¿Seguro que querés cancelar tu reserva en "${reserva.workshop?.nombre}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.reservas.cancel(reserva.id);
              load();
            } catch (err) {
              Alert.alert('Error', err.message || 'No se pudo cancelar');
            }
          },
        },
      ],
    );
  }

  if (!user) {
    return (
      <View style={styles.authPrompt}>
        <Text style={styles.authIcon}>📋</Text>
        <Text style={styles.authTitle}>Mis Reservas</Text>
        <Text style={styles.authText}>Iniciá sesión para ver tus reservas.</Text>
        <TouchableOpacity
          style={styles.authBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.authBtnText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderReserva({ item }) {
    const ws = item.workshop;
    const esp = ws?.espacio || {};
    const isActive = item.estado === 'CONFIRMADA';

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.espacioName}>{esp.nombre || 'Espacio'}</Text>
            <Text style={styles.wsName} numberOfLines={1}>{ws?.nombre || '—'}</Text>
          </View>
          <StatusBadge estado={item.estado} />
        </View>

        {ws?.fecha && (
          <Text style={styles.wsDate}>
            {new Date(ws.fecha).toLocaleDateString('es-AR', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
            {ws.horaInicio ? ` · ${ws.horaInicio}` : ''}
          </Text>
        )}

        {item.metodoPago && (
          <View style={styles.metodoRow}>
            <Text style={styles.metodoLabel}>Pago:</Text>
            <Text style={styles.metodoValue}>
              {item.metodoPago === 'MERCADO_PAGO' ? 'Mercado Pago' : 'Efectivo'}
            </Text>
          </View>
        )}

        {isActive && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancel(item)}
          >
            <Text style={styles.cancelBtnText}>Cancelar reserva</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={reservas}
      keyExtractor={item => item.id}
      renderItem={renderReserva}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
      ListEmptyComponent={
        loading ? (
          <Text style={styles.emptyText}>Cargando…</Text>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎟️</Text>
            <Text style={styles.emptyTitle}>No tenés reservas todavía</Text>
            <Text style={styles.emptySubtitle}>
              Explorá espacios y reservá tu lugar en un taller.
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  espacioName: { fontSize: 11, fontWeight: '600', color: colors.inkLight, textTransform: 'uppercase', letterSpacing: 0.5 },
  wsName: { fontSize: 16, fontWeight: '600', color: colors.ink, marginTop: 2 },
  wsDate: { fontSize: 13, color: colors.inkMuted, marginBottom: 6 },
  metodoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  metodoLabel: { fontSize: 12, color: colors.inkLight, marginRight: 4 },
  metodoValue: { fontSize: 12, fontWeight: '500', color: colors.ink },
  statusBadge: { borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },
  cancelBtn: {
    borderWidth: 1, borderColor: colors.red, borderRadius: radius.md,
    paddingVertical: 8, alignItems: 'center', marginTop: spacing.sm,
  },
  cancelBtnText: { color: colors.red, fontSize: 13, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: spacing['4xl'] },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: colors.ink },
  emptySubtitle: { fontSize: 14, color: colors.inkMuted, textAlign: 'center', marginTop: 4, paddingHorizontal: spacing.xl },
  emptyText: { textAlign: 'center', color: colors.inkMuted, marginTop: spacing['3xl'] },
  authPrompt: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.surface0 },
  authIcon: { fontSize: 48, marginBottom: spacing.md },
  authTitle: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  authText: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.xl },
  authBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing['2xl'], paddingVertical: 12 },
  authBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },
});
