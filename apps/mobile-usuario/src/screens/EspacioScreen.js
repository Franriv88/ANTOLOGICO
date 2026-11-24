import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Image, Alert, Animated, Platform,
} from 'react-native';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import { LogoAntologico } from '../components/LogoAntologico';
import { AntologicoSpinner } from '../components/Icons';
import * as api from '../services/api';
import { getFollows, saveFollows } from './InicioScreen';

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? '#1A1611' : '#ffffff';
}

function parseBrand(espacio) {
  const bc = espacio?.brandColors;
  const palette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const roles = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  const primary = roles.primary || palette[0] || '#E85D4A';
  const button = roles.button || primary;
  const bg = roles.bg || '#FAF8F4';
  const card = roles.card || '#ffffff';
  const textCard = roles.textCard || (contrastText(card) === '#ffffff' ? '#f0f0f0' : '#2B241A');
  return { primary, button, bg, card, textCard };
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#?\w+;/g, '').trim();
}

function DescripcionButton({ descripcion, brand }) {
  const [expanded, setExpanded] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const plain = stripHtml(descripcion);
  if (!plain) return null;

  useEffect(() => {
    if (expanded) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [expanded]);

  const shadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.35],
  });
  const elevation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 6],
  });

  if (expanded) {
    return (
      <View style={styles.descExpandedBox}>
        <Text style={[styles.descExpandedTitle, { color: brand.primary }]}>¿Qué aprenderás?</Text>
        <Text style={[styles.descExpandedText, { color: brand.textCard }]}>{plain}</Text>
        <TouchableOpacity onPress={() => setExpanded(false)} activeOpacity={0.7}>
          <Text style={[styles.descCollapseLink, { color: brand.primary }]}>Ver menos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.descBtnShadow,
        Platform.select({
          ios: { shadowColor: brand.primary, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, shadowOpacity },
          android: { elevation },
        }),
      ]}
    >
      <TouchableOpacity
        style={[styles.descBtn, { borderColor: brand.primary + '40' }]}
        activeOpacity={0.7}
        onPress={() => setExpanded(true)}
      >
        <Text style={[styles.descBtnText, { color: brand.primary }]}>¿Qué aprenderás?</Text>
        <Text style={[styles.descBtnArrow, { color: brand.primary }]}>▾</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

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

function ExperienceBadge({ requiereExperiencia }) {
  const icon = requiereExperiencia ? '⚠' : '✓';
  const label = requiereExperiencia ? 'Se requiere experiencia previa' : 'No se requiere experiencia previa';
  const bg = requiereExperiencia ? '#FEF3C7' : '#ECFDF5';
  const color = requiereExperiencia ? '#92400E' : '#065F46';
  return (
    <View style={[styles.expBadge, { backgroundColor: bg }]}>
      <Text style={[styles.expBadgeIcon, { color }]}>{icon}</Text>
      <Text style={[styles.expBadgeText, { color }]}>{label}</Text>
    </View>
  );
}

function WorkshopCard({ item, brand, onPress, hasReservation }) {
  const headerColor = item.headerValue && item.headerType === 'COLOR'
    ? item.headerValue
    : brand.primary;
  const headerImage = item.headerType === 'IMAGE' ? item.headerValue : null;
  const isAgotado = (item.cuposDisponibles ?? 0) === 0;

  const cardOnLight = contrastText(brand.card) !== '#ffffff';
  const inkMain = brand.textCard;
  const inkMuted = cardOnLight ? 'rgba(43,36,26,0.55)' : 'rgba(255,255,255,0.60)';
  const borderColor = cardOnLight ? '#D2C4A8' : 'rgba(255,255,255,0.15)';

  const buttonLabel = hasReservation ? 'Reservar más' : 'Reservar';

  return (
    <View
      style={[
        styles.wsCard,
        { backgroundColor: brand.card, borderColor },
        isAgotado && !hasReservation && { opacity: 0.55 },
      ]}
    >
      {headerImage ? (
        <View style={[styles.wsHeader, { backgroundColor: headerColor }]}>
          <Image source={{ uri: headerImage }} style={styles.wsHeaderImg} />
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              $ {Number(item.precio || 0).toLocaleString('es-AR')}
            </Text>
          </View>
          <View style={styles.slotBadgeOverlay}>
            <SlotBadge disponibles={item.cuposDisponibles ?? 0} totales={item.cuposTotales ?? 0} />
          </View>
          {hasReservation && (
            <View style={styles.reservedBadge}>
              <Text style={styles.reservedBadgeIcon}>✓</Text>
              <Text style={styles.reservedBadgeText}>Ya reservaste</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.wsColorStripe, { backgroundColor: headerColor }]} />
      )}
      <View style={styles.wsBody}>
        {!headerImage && (
          <View style={styles.wsChips}>
            <View style={[styles.wsChipPrice, { backgroundColor: headerColor }]}>
              <Text style={styles.wsChipPriceText}>
                $ {Number(item.precio || 0).toLocaleString('es-AR')}
              </Text>
            </View>
            <SlotBadge disponibles={item.cuposDisponibles ?? 0} totales={item.cuposTotales ?? 0} />
          </View>
        )}
        <Text style={[styles.wsName, { color: brand.primary }]} numberOfLines={2}>{item.nombre}</Text>
        {item.fecha && (
          <Text style={[styles.wsDate, { color: inkMuted }]}>
            {new Date(item.fecha).toLocaleDateString('es-AR', {
              weekday: 'long', day: 'numeric', month: 'long',
            }).replace(/^\w/, c => c.toUpperCase())}
            {item.horaInicio ? ` · ${item.horaInicio}` : ''}
          </Text>
        )}

        <ExperienceBadge requiereExperiencia={item.requiereExperiencia ?? false} />

        {item.descripcion ? (
          <DescripcionButton descripcion={item.descripcion} brand={brand} />
        ) : null}

        <TouchableOpacity
          style={[styles.wsBookBtn, { backgroundColor: brand.button }]}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Text style={styles.wsBookBtnText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function EspacioScreen({ route, navigation }) {
  const { espacioId, autoFollow } = route.params;
  const { user } = useAuth();
  const [espacio, setEspacio]       = useState(null);
  const [workshops, setWorkshops]   = useState([]);
  const [following, setFollowing]   = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [myReservas, setMyReservas] = useState([]);

  const load = useCallback(async () => {
    try {
      setError(null);
      let esp = null;
      let resolvedId = espacioId;
      const isUUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(espacioId);

      if (isUUID) {
        const uuid = espacioId.includes('-') ? espacioId
          : `${espacioId.slice(0,8)}-${espacioId.slice(8,12)}-${espacioId.slice(12,16)}-${espacioId.slice(16,20)}-${espacioId.slice(20)}`;
        resolvedId = uuid;
        esp = await api.espacios.getPublic(uuid);
      } else {
        const slugResult = await api.espacios.getBySlug(espacioId);
        if (slugResult?.id) {
          resolvedId = slugResult.id;
          esp = await api.espacios.getPublic(resolvedId);
        }
      }
      if (!esp) {
        setError(`No se encontró este espacio.\n(ID: ${espacioId})`);
        return;
      }

      setEspacio(esp);
      navigation.setOptions({ title: esp.nombre || 'Espacio' });

      const realId = esp.id;
      const ws = await api.workshops.listByEspacio(realId);
      setWorkshops(ws);

      if (user) {
        try {
          const res = await api.reservas.listMine();
          setMyReservas(res);
        } catch (_) {}
      }

      const follows = await getFollows(user?.uid);
      if (autoFollow && !follows.includes(realId)) {
        await saveFollows([...follows, realId], user?.uid);
        setFollowing(true);
      } else {
        setFollowing(follows.includes(realId));
      }
    } catch (err) {
      console.error('Error loading espacio:', err);
      setError(`Error al cargar el espacio.\n${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  }, [espacioId, navigation, user]);

  useEffect(() => { load(); }, [load]);

  async function toggleFollow() {
    const id = espacio?.id;
    if (!id) return;
    const follows = await getFollows(user?.uid);
    let next;
    if (following) {
      next = follows.filter(fid => fid !== id);
    } else {
      next = [...follows, id];
    }
    await saveFollows(next, user?.uid);
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

  function hasReservationFor(workshopId) {
    return myReservas.some(r =>
      r.workshop?.id === workshopId && r.estado !== 'CANCELADA'
    );
  }

  const brand = parseBrand(espacio);
  const headerText = contrastText(brand.primary);
  const bgText = contrastText(brand.bg);

  const logoShape = espacio?.logoShape || 'rounded';
  const logoScale = espacio?.logoScale ?? 1;
  const logoRadius = logoShape === 'round' ? 40 : logoShape === 'square' ? 0 : 16;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <AntologicoSpinner width={260} theme="light" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={load}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.container, { backgroundColor: brand.bg }]}
      data={workshops}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={brand.primary} />
      }
      ListHeaderComponent={
        <View>
          <View style={[styles.hero, { backgroundColor: brand.primary }]}>
            {espacio?.logoUrl ? (
              <View style={[
                styles.heroLogoWrap,
                { borderRadius: logoRadius },
                logoShape !== 'square' && { borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
              ]}>
                <Image
                  source={{ uri: espacio.logoUrl }}
                  style={[
                    styles.heroLogoImg,
                    { borderRadius: logoRadius, transform: [{ scale: logoScale }] },
                  ]}
                />
              </View>
            ) : (
              <View style={styles.heroInitialBox}>
                <Text style={[styles.heroInitial, { color: headerText }]}>{espacio?.nombre?.[0]?.toUpperCase()}</Text>
              </View>
            )}
            <Text style={[styles.heroName, { color: headerText }]}>{espacio?.nombre}</Text>
            {(espacio?.rubro?.nombre || espacio?.rubroPersonalizado) && (
              <Text style={[styles.heroRubro, { color: headerText, opacity: 0.75 }]}>
                {espacio.rubro?.nombre || espacio.rubroPersonalizado}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.followBtn, following && styles.followBtnActive]}
              onPress={toggleFollow}
            >
              <Text style={[styles.followBtnText, { color: headerText }, following && { opacity: 1 }]}>
                {following ? '✓ Siguiendo' : '+ Seguir'}
              </Text>
            </TouchableOpacity>
          </View>

          {espacio?.descripcion ? (
            <Text style={[styles.desc, { color: bgText === '#ffffff' ? 'rgba(255,255,255,0.65)' : colors.inkMuted }]}>
              {espacio.descripcion}
            </Text>
          ) : null}

          <Text style={[styles.sectionTitle, { color: bgText }]}>
            {workshops.length} {workshops.length === 1 ? 'taller disponible' : 'talleres disponibles'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <WorkshopCard
          item={item}
          brand={brand}
          onPress={() => handleBooking(item)}
          hasReservation={hasReservationFor(item.id)}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyWs}>
          <Text style={[styles.emptyWsText, { color: bgText === '#ffffff' ? 'rgba(255,255,255,0.6)' : colors.inkMuted }]}>
            Este espacio no tiene talleres publicados por ahora.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface0 },
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface0, padding: spacing.xl,
  },
  errorText: { color: colors.inkMuted, fontSize: 15, textAlign: 'center', marginBottom: spacing.lg },
  retryBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing.xl, paddingVertical: 12,
  },
  retryBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },
  list: { paddingBottom: spacing['3xl'] },
  hero: {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  heroLogoWrap: {
    width: 80, height: 80,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroLogoImg: {
    width: '100%', height: '100%',
    resizeMode: 'contain',
  },
  heroInitialBox: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.22)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
  },
  heroInitial: { fontSize: 30, fontWeight: '700' },
  heroName: { fontSize: 22, fontWeight: '700' },
  heroRubro: { fontSize: 14, marginTop: 2 },
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
  followBtnText: { fontWeight: '600', fontSize: 14, opacity: 0.9 },
  desc: {
    fontSize: 14, lineHeight: 20,
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '600',
    paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  wsCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  wsHeader: { height: 160, position: 'relative' },
  wsHeaderImg: { width: '100%', height: 160, resizeMode: 'cover' },
  wsColorStripe: { height: 8 },
  wsBody: { padding: spacing.md },
  wsChips: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.sm,
  },
  wsChipPrice: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.md,
  },
  wsChipPriceText: { color: '#fff', fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  priceBadge: {
    position: 'absolute', top: spacing.sm, left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  priceText: { color: '#fff', fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  slotBadgeOverlay: {
    position: 'absolute', top: spacing.sm, right: spacing.sm,
  },
  reservedBadge: {
    position: 'absolute', bottom: spacing.sm, left: spacing.sm,
    backgroundColor: '#10B981',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reservedBadgeIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },
  reservedBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  wsName: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  wsDate: { fontSize: 13, marginBottom: spacing.sm },
  wsFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  wsCupos: { fontSize: 12 },
  wsBookBtn: {
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  wsBookBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  expBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 5,
  },
  expBadgeIcon: { fontSize: 12 },
  expBadgeText: { fontSize: 12, fontWeight: '500' },
  descBtnShadow: {
    marginTop: spacing.sm,
    borderRadius: radius.lg,
  },
  descBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
  },
  descBtnText: { fontSize: 14, fontWeight: '600' },
  descBtnArrow: { fontSize: 12 },
  descExpandedBox: {
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  descExpandedTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  descExpandedText: { fontSize: 13, lineHeight: 20 },
  descCollapseLink: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  slotBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: radius.full,
  },
  slotDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  slotText: { fontSize: 11, fontWeight: '600' },
  emptyWs: { padding: spacing['2xl'], alignItems: 'center' },
  emptyWsText: { fontSize: 14, textAlign: 'center' },
});
