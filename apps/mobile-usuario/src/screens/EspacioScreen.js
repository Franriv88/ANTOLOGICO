import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Image, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { getFollows, saveFollows, FOLLOWS_KEY } from './InicioScreen';

function SlotBadge({ disponibles, totales }) {
  const pct = totales > 0 ? disponibles / totales : 0;
  const color = pct > 0.3 ? colors.green : pct > 0 ? colors.amber : colors.red;
  const label = pct > 0.3 ? 'Disponible' : pct > 0 ? 'Últimos cupos' : 'Agotado';
  const bg    = pct > 0.3 ? colors.greenBg : pct > 0 ? colors.amberBg : colors.redBg;
  return (
    <View style={[styles.slotBadge, { backgroundColor: bg }]}>
      <View style={[styles.slotDot, { backgroundColor: color }]} />
      <Text style={[styles.slotText, { color }]}>{label}</Text>
    </View>
  );
}

function WorkshopCard({ item, brandColor, onPress }) {
  const headerColor = item.headerColor || brandColor || colors.primary;
  return (
    <TouchableOpacity style={styles.wsCard} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.wsHeader, { backgroundColor: headerColor }]}>
        {item.headerImageUrl ? (
          <Image source={{ uri: item.headerImageUrl }} style={styles.wsHeaderImg} />
        ) : null}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>
            ${Number(item.precio || 0).toLocaleString('es-AR')}
          </Text>
        </View>
      </View>
      <View style={styles.wsBody}>
        <Text style={styles.wsType}>{item.tipo || 'WORKSHOP'}</Text>
        <Text style={styles.wsName} numberOfLines={2}>{item.nombre}</Text>
        {item.fecha && (
          <Text style={styles.wsDate}>
            {new Date(item.fecha).toLocaleDateString('es-AR', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
            {item.horaInicio ? ` · ${item.horaInicio}` : ''}
          </Text>
        )}
        <View style={styles.wsFooter}>
          <Text style={styles.wsCupos}>
            {item.cuposDisponibles ?? 0}/{item.cuposTotales ?? 0} cupos
          </Text>
          <SlotBadge disponibles={item.cuposDisponibles ?? 0} totales={item.cuposTotales ?? 0} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function EspacioScreen({ route, navigation }) {
  const { espacioId } = route.params;
  const { user } = useAuth();
  const [espacio, setEspacio]       = useState(null);
  const [workshops, setWorkshops]   = useState([]);
  const [following, setFollowing]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);

  const load = useCallback(async () => {
    try {
      const [esp, ws] = await Promise.all([
        api.espacios.getPublic(espacioId),
        api.workshops.listByEspacio(espacioId),
      ]);
      setEspacio(esp);
      const published = ws.filter(w => w.estado === 'PUBLICADO' || w.estado === 'ACTIVO');
      published.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      setWorkshops(published);

      const follows = await getFollows();
      setFollowing(follows.includes(espacioId));
    } catch (err) {
      console.error('Error loading espacio:', err);
    } finally {
      setLoading(false);
    }
  }, [espacioId]);

  useEffect(() => { load(); }, [load]);

  async function toggleFollow() {
    const follows = await getFollows();
    let next;
    if (following) {
      next = follows.filter(id => id !== espacioId);
    } else {
      next = [...follows, espacioId];
    }
    await saveFollows(next);
    setFollowing(!following);
  }

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function handleBooking(workshop) {
    if (!user) {
      Alert.alert(
        'Iniciá sesión',
        'Necesitás una cuenta para reservar.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    navigation.navigate('Booking', { workshop, espacio });
  }

  const brandColor = espacio?.brandColors?.Principal || colors.primary;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando…</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={workshops}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brandColor} />
      }
      ListHeaderComponent={
        <View>
          {/* Hero */}
          <View style={[styles.hero, { backgroundColor: brandColor }]}>
            {espacio?.logoUrl ? (
              <Image source={{ uri: espacio.logoUrl }} style={styles.heroLogo} />
            ) : (
              <View style={styles.heroInitialBox}>
                <Text style={styles.heroInitial}>{espacio?.nombre?.[0]}</Text>
              </View>
            )}
            <Text style={styles.heroName}>{espacio?.nombre}</Text>
            <Text style={styles.heroRubro}>{espacio?.rubro}</Text>

            <TouchableOpacity
              style={[styles.followBtn, following && styles.followBtnActive]}
              onPress={toggleFollow}
            >
              <Text style={[styles.followBtnText, following && styles.followBtnTextActive]}>
                {following ? '✓ Siguiendo' : '+ Seguir'}
              </Text>
            </TouchableOpacity>
          </View>

          {espacio?.descripcion ? (
            <Text style={styles.desc}>{espacio.descripcion}</Text>
          ) : null}

          <Text style={styles.sectionTitle}>
            {workshops.length} {workshops.length === 1 ? 'taller disponible' : 'talleres disponibles'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <WorkshopCard
          item={item}
          brandColor={brandColor}
          onPress={() => handleBooking(item)}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyWs}>
          <Text style={styles.emptyWsText}>Este espacio no tiene talleres publicados por ahora.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface0 },
  loadingText: { color: colors.inkMuted, fontSize: 14 },
  list: { paddingBottom: spacing['3xl'] },
  hero: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  heroLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: spacing.md,
  },
  heroInitialBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroInitial: { fontSize: 28, fontWeight: '700', color: '#fff' },
  heroName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  heroRubro: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  followBtn: {
    marginTop: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  followBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: '#fff',
  },
  followBtnText: { color: 'rgba(255,255,255,0.9)', fontWeight: '600', fontSize: 14 },
  followBtnTextActive: { color: '#fff' },
  desc: {
    fontSize: 14, color: colors.inkMuted, lineHeight: 20,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '600', color: colors.ink,
    paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  wsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  wsHeader: { height: 8 },
  wsHeaderImg: { width: '100%', height: 100, resizeMode: 'cover' },
  wsBody: { padding: spacing.md },
  priceBadge: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  priceText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  wsType: {
    fontSize: 10, fontWeight: '700', color: colors.inkLight,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 4,
  },
  wsName: { fontSize: 16, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  wsDate: { fontSize: 13, color: colors.inkMuted, marginBottom: spacing.sm },
  wsFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wsCupos: { fontSize: 12, color: colors.inkLight },
  slotBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: radius.full,
  },
  slotDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  slotText: { fontSize: 11, fontWeight: '600' },
  emptyWs: { padding: spacing['2xl'], alignItems: 'center' },
  emptyWsText: { color: colors.inkMuted, fontSize: 14, textAlign: 'center' },
});
