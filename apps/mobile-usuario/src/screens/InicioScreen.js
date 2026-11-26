import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Image, TextInput, ScrollView, Animated, Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import { LogoAntologico } from '../components/LogoAntologico';
import { QRIcon } from '../components/Icons';
import * as api from '../services/api';

const FOLLOWS_KEY = '@antologico_follows';

function userFollowsKey(uid) {
  return uid ? `${FOLLOWS_KEY}_${uid}` : FOLLOWS_KEY;
}

async function getFollows(uid) {
  try {
    const raw = await AsyncStorage.getItem(userFollowsKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
async function saveFollows(ids, uid) {
  try { await AsyncStorage.setItem(userFollowsKey(uid), JSON.stringify(ids)); } catch {}
}

const CTA_URL = 'https://www.antologico.app/registro';
const CTA_COLLAPSE_DELAY = 5000;

function RetractableCTA() {
  const [expanded, setExpanded] = useState(true);
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    }, CTA_COLLAPSE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    Animated.timing(anim, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }

  const contentHeight = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140],
  });
  const contentOpacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.ctaWrapper}>
      {/* Collapsed mini-bar (always visible) */}
      <TouchableOpacity
        style={styles.ctaCollapsedBar}
        onPress={toggle}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaCollapsedText}>
          {expanded ? '▾  ¿Querés tu propio espacio?' : '▴  ¿Querés tu propio espacio Antológico?'}
        </Text>
      </TouchableOpacity>

      {/* Expandable content */}
      <Animated.View style={{ height: contentHeight, opacity: contentOpacity, overflow: 'hidden' }}>
        <View style={styles.ctaExpandedContent}>
          <Text style={styles.ctaTitle}>¿Querés tu propio espacio Antológico?</Text>
          <Text style={styles.ctaText}>Publicá tus talleres, gestioná reservas y cobrá online.</Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.8}
            onPress={() => Linking.openURL(CTA_URL)}
          >
            <Text style={styles.ctaBtnText}>Creá tu cuenta profesional  →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

export default function InicioScreen({ navigation }) {
  const { user } = useAuth();
  const [follows, setFollows]       = useState([]);
  const [espacios, setEspacios]     = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState('');

  const firstName = user?.displayName?.split(' ')[0] || 'Usuario';

  const loadFollows = useCallback(async () => {
    const ids = await getFollows(user?.uid);
    setFollows(ids);
    if (ids.length) {
      try {
        const data = await api.espacios.getPublicBatch(ids);
        setEspacios(data);
      } catch { setEspacios([]); }
    } else {
      setEspacios([]);
    }
  }, [user?.uid]);

  useFocusEffect(useCallback(() => { loadFollows(); }, [loadFollows]));

  async function onRefresh() {
    setRefreshing(true);
    await loadFollows();
    setRefreshing(false);
  }

  const filtered = search.trim()
    ? espacios.filter(e => e.nombre?.toLowerCase().includes(search.toLowerCase()))
    : espacios;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Greeting */}
      <Text style={styles.greeting}>
        Hola, <Text style={styles.greetingName}>{firstName}</Text>
      </Text>

      {follows.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconBox}>
            <LogoAntologico theme="light" width={240} />
          </View>
          <Text style={styles.emptyTitle}>No seguís ningún espacio</Text>
          <Text style={styles.emptyText}>
            Escaneá un código QR o visitá la página de un espacio para empezar a seguirlo.
          </Text>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => navigation.navigate('QRScanner')}
            activeOpacity={0.8}
          >
            <QRIcon size={18} color={colors.white} />
            <Text style={styles.scanBtnText}>Escanear QR de un espacio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Search */}
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar espacio…"
              placeholderTextColor={colors.inkLight}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Spaces section */}
          <Text style={styles.sectionTitle}>MIS ESPACIOS</Text>
          <View style={styles.spacesGrid}>
            {filtered.map(item => {
              const rubroText = item.rubro?.nombre || item.rubroPersonalizado || '';
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('Espacio', { espacioId: item.id, nombre: item.nombre })}
                >
                  {item.logoUrl ? (
                    <Image source={{ uri: item.logoUrl }} style={styles.cardLogo} />
                  ) : (
                    <View style={styles.cardInitialBox}>
                      <Text style={styles.cardInitial}>{item.nombre?.[0]?.toUpperCase()}</Text>
                    </View>
                  )}
                  <Text style={styles.cardName} numberOfLines={1}>{item.nombre}</Text>
                  {rubroText ? (
                    <Text style={styles.cardRubro} numberOfLines={1}>{rubroText}</Text>
                  ) : null}
                </TouchableOpacity>
              );
            })}
            {/* Add card */}
            <TouchableOpacity
              style={styles.addCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('QRScanner')}
            >
              <View style={styles.addIconBox}>
                <Text style={styles.addIcon}>+</Text>
              </View>
              <Text style={styles.addText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Retractable Bottom CTA */}
      <RetractableCTA />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface0,
  },
  content: {
    paddingBottom: spacing['3xl'],
  },
  greeting: {
    fontSize: 16,
    color: colors.ink,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  greetingName: {
    fontWeight: '700',
  },
  searchRow: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  spacesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  card: {
    flexBasis: '30%',
    flexGrow: 0,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  cardLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface100,
    marginBottom: spacing.sm,
  },
  cardInitialBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  cardRubro: {
    fontSize: 11,
    color: colors.inkMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  addCard: {
    flexBasis: '30%',
    flexGrow: 0,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.ocre,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  addIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  addIcon: {
    fontSize: 24,
    color: colors.inkLight,
    fontWeight: '300',
  },
  addText: {
    fontSize: 13,
    color: colors.inkMuted,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  emptyIconBox: {
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scanBtnIcon: {
    fontSize: 18,
    color: colors.white,
  },
  scanBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  ctaWrapper: {
    marginHorizontal: spacing.base,
    marginTop: spacing['3xl'],
    backgroundColor: colors.surface100,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  ctaCollapsedBar: {
    paddingVertical: 12,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
  },
  ctaCollapsedText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  ctaExpandedContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  ctaText: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: 12,
  },
  ctaBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export { getFollows, saveFollows, FOLLOWS_KEY };
