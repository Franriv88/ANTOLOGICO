import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, TextInput,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, radius } from '../lib/theme';
import { saveFollows, getFollows } from './InicioScreen';

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualSlug, setManualSlug] = useState('');

  function extractEspacioId(data) {
    // QR codes contain URLs like antologico.app/p/{espacioId} or slug-based
    const match = data.match(/\/p\/([a-zA-Z0-9-]+)/);
    if (match) return { type: 'id', value: match[1] };
    // subdomain pattern: xxx.antologico.app
    const subMatch = data.match(/([a-zA-Z0-9-]+)\.antologico\.app/);
    if (subMatch && subMatch[1] !== 'www' && subMatch[1] !== 'admin') {
      return { type: 'slug', value: subMatch[1] };
    }
    return null;
  }

  async function handleBarCodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);

    const parsed = extractEspacioId(data);
    if (!parsed) {
      Alert.alert('QR no reconocido', 'Este QR no es de un espacio Antológico.', [
        { text: 'Escanear de nuevo', onPress: () => setScanned(false) },
      ]);
      return;
    }

    let espacioId = parsed.value;
    // If slug, we'd need to resolve it. For now, navigate with slug
    // and let the screen handle it. But since EspacioScreen expects an id,
    // we navigate and follow automatically.
    try {
      const follows = await getFollows();
      if (!follows.includes(espacioId)) {
        await saveFollows([...follows, espacioId]);
      }
      navigation.replace('Espacio', { espacioId, nombre: 'Cargando…' });
    } catch (err) {
      Alert.alert('Error', 'No se pudo procesar el QR.', [
        { text: 'Reintentar', onPress: () => setScanned(false) },
      ]);
    }
  }

  async function handleManualSearch() {
    if (!manualSlug.trim()) return;
    navigation.navigate('Espacio', { espacioId: manualSlug.trim(), nombre: 'Cargando…' });
  }

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Acceso a la cámara</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para escanear códigos QR de espacios.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Permitir cámara</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>— o ingresá el código manualmente —</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.manualInput}
            placeholder="ID del espacio"
            placeholderTextColor={colors.inkLight}
            value={manualSlug}
            onChangeText={setManualSlug}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.manualBtn} onPress={handleManualSearch}>
            <Text style={styles.manualBtnText}>Ir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom}>
          <Text style={styles.scanHint}>Apuntá al QR del espacio</Text>
          {scanned && (
            <TouchableOpacity style={styles.rescanBtn} onPress={() => setScanned(false)}>
              <Text style={styles.rescanBtnText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const SCAN_SIZE = 240;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject },
  overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  overlayMiddle: { flexDirection: 'row', height: SCAN_SIZE },
  overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scanArea: { width: SCAN_SIZE, height: SCAN_SIZE },
  overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', paddingTop: spacing.xl },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: colors.primary, borderWidth: 3 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanHint: { color: '#fff', fontSize: 15, fontWeight: '500' },
  rescanBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing.xl, paddingVertical: 10, marginTop: spacing.md,
  },
  rescanBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  permissionBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: spacing.xl, backgroundColor: colors.surface0,
  },
  permissionIcon: { fontSize: 48, marginBottom: spacing.md },
  permissionTitle: { fontSize: 18, fontWeight: '600', color: colors.ink, marginBottom: spacing.sm },
  permissionText: { fontSize: 14, color: colors.inkMuted, textAlign: 'center', lineHeight: 20, marginBottom: spacing.xl },
  permissionBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: 12 },
  permissionBtnText: { color: colors.white, fontWeight: '600' },
  orText: { color: colors.inkLight, fontSize: 13, marginTop: spacing['2xl'], marginBottom: spacing.md },
  manualRow: { flexDirection: 'row', gap: spacing.sm },
  manualInput: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 8,
    fontSize: 14, color: colors.ink, width: 200,
  },
  manualBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  manualBtnText: { color: colors.white, fontWeight: '600' },
});
