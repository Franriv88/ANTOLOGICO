import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Image, TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../lib/theme';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const FOLLOWS_KEY = '@antologico_follows';

async function getFollows() {
  try {
    const raw = await AsyncStorage.getItem(FOLLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
async function saveFollows(ids) {
  try { await AsyncStorage.setItem(FOLLOWS_KEY, JSON.stringify(ids)); } catch {}
}

export default function InicioScreen({ navigation }) {
  const { user } = useAuth();
  const [follows, setFollows]       = useState([]);
  const [espacios, setEspacios]     = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState('');

  const loadFollows = useCallback(async () => {
    const ids = await getFollows();
    setFollows(ids);
    if (ids.length) {
      try {
        const data = await api.espacios.getPublicBatch(ids);
        setEspacios(data);
      } catch { setEspacios([]); }
    } else {
      setEspacios([]);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadFollows(); }, [loadFollows]));

  async function onRefresh() {
    setRefreshing(true);
    await loadFollows();
    setRefreshing(false);
  }

  function renderEspacio({ item }) {
    const brandPrimary = item.brandColors?.Principal || colors.primary;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Espacio', { espacioId: item.id, nombre: item.nombre })}
      >
        <View style={[styles.cardHeader, { backgroundColor: brandPrimary }]}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={styles.cardLogo} />
          ) : (
            <Text style={styles.cardInitial}>{item.nombre?.[0]?.toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>{item.nombre}</Text>
          <Text style={styles.cardRubro} numberOfLines={1}>{item.rubro || 'Espacio'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  const filtered = search.trim()
    ? espacios.filter(e => e.nombre?.toLowerCase().includes(search.toLowerCase()))
    : espacios;

  return (
    <View style={styles.container}>
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

      {follows.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Todavía no seguís ningún espacio</Text>
          <Text style={styles.emptyText}>
            Escaneá el QR de un espacio o buscalo por su nombre para empezar a ver talleres.
          </Text>
          <TouchableOpacity
            style={styles.scanBtn}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Text style={styles.scanBtnText}>Escanear QR de un espacio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderEspacio}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <Text style={styles.noResults}>No se encontraron espacios</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface0,
  },
  searchRow: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
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
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing['3xl'],
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  cardHeader: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cardInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
  },
  cardBody: {
    padding: spacing.md,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  cardRubro: {
    fontSize: 12,
    color: colors.inkMuted,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.base,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scanBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  noResults: {
    textAlign: 'center',
    color: colors.inkMuted,
    marginTop: spacing['3xl'],
    fontSize: 14,
  },
});

export { getFollows, saveFollows, FOLLOWS_KEY };
