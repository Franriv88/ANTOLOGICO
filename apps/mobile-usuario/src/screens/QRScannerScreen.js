import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Alert, TextInput,
  Dimensions, Platform,
} from 'react-native';
import { AntologicoSpinner, AntologicoButtonSpinner } from '../components/Icons';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import { colors, spacing, radius } from '../lib/theme';
import { LogoAntologico } from '../components/LogoAntologico';
import { QRIcon } from '../components/Icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const SCAN_SIZE = Math.min(SCREEN_W * 0.6, 240);

function extractEspacioId(data) {
  const match = data.match(/\/p\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  const subMatch = data.match(/([a-zA-Z0-9-]+)\.antologico\.app/);
  if (subMatch && subMatch[1] !== 'www' && subMatch[1] !== 'admin') {
    return subMatch[1];
  }
  return null;
}

export default function QRScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualInput, setManualInput] = useState('');

  async function handleBarCodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);

    const espacioId = extractEspacioId(data);
    if (!espacioId) {
      Alert.alert('QR no reconocido', 'Este QR no es de un espacio Antológico.', [
        { text: 'Escanear de nuevo', onPress: () => setScanned(false) },
      ]);
      return;
    }

    navigation.replace('Espacio', { espacioId, nombre: '', autoFollow: true });
  }

  function handleManualSearch() {
    const input = manualInput.trim();
    if (!input) return;
    let espacioId = input;
    const extracted = extractEspacioId(input);
    if (extracted) espacioId = extracted;
    navigation.replace('Espacio', { espacioId, nombre: '', autoFollow: true });
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <AntologicoSpinner width={220} theme="light" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <LogoAntologico theme="light" width={100} />
        <Text style={styles.permissionTitle}>Escanear QR</Text>
        <Text style={styles.permissionText}>
          Necesitamos acceso a tu cámara para escanear códigos QR de espacios.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Permitir cámara</Text>
        </TouchableOpacity>

        <View style={styles.manualSection}>
          <Text style={styles.orText}>— o pegá la URL del espacio —</Text>
          <View style={styles.manualRow}>
            <TextInput
              style={styles.manualInput}
              placeholder="Ej: antologico.app/p/mi-espacio"
              placeholderTextColor={colors.inkLight}
              value={manualInput}
              onChangeText={setManualInput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
          {manualInput.trim().length > 0 && (
            <TouchableOpacity style={styles.manualGoBtn} onPress={handleManualSearch}>
              <Text style={styles.manualGoBtnText}>Ir al espacio</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />

      {/* Overlay with transparent center */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top dark band */}
        <View style={styles.overlayBand} />

        {/* Middle row: dark | clear | dark */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlayBand} />
          <View style={{ width: SCAN_SIZE, height: SCAN_SIZE }}>
            <View style={[styles.corner, { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 }]} />
            <View style={[styles.corner, { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 }]} />
            <View style={[styles.corner, { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 }]} />
            <View style={[styles.corner, { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 }]} />
          </View>
          <View style={styles.overlayBand} />
        </View>

        {/* Bottom dark band */}
        <View style={[styles.overlayBand, { alignItems: 'center', paddingTop: spacing.xl }]}>
          <Text style={styles.scanHint}>Apuntá al QR del espacio</Text>
          {scanned && (
            <TouchableOpacity style={styles.rescanBtn} onPress={() => setScanned(false)}>
              <Text style={styles.rescanBtnText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}

          <View style={styles.manualSectionCamera}>
            <Text style={styles.orTextCamera}>— o pegá la URL —</Text>
            <View style={styles.manualRowCamera}>
              <TextInput
                style={styles.manualInputCamera}
                placeholder="antologico.app/p/..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={manualInput}
                onChangeText={setManualInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
            {manualInput.trim().length > 0 && (
              <TouchableOpacity style={styles.manualGoBtnCamera} onPress={handleManualSearch}>
                <Text style={styles.manualGoBtnText}>Ir al espacio</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.surface0,
    alignItems: 'center', justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1, backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },

  overlayBand: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: SCAN_SIZE,
  },
  corner: {
    position: 'absolute', width: 28, height: 28,
    borderColor: colors.primary, borderWidth: 3,
  },
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
  permissionTitle: {
    fontSize: 20, fontWeight: '700', color: colors.ink,
    marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: 14, color: colors.inkMuted, textAlign: 'center',
    lineHeight: 20, marginBottom: spacing.xl, maxWidth: 300,
  },
  permissionBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing.xl, paddingVertical: 12,
  },
  permissionBtnText: { color: colors.white, fontWeight: '600', fontSize: 15 },

  manualSection: {
    width: '100%', marginTop: spacing['2xl'],
    alignItems: 'center',
  },
  orText: {
    color: colors.inkLight, fontSize: 13, marginBottom: spacing.md,
  },
  manualRow: {
    width: '100%', paddingHorizontal: spacing.base,
  },
  manualInput: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12,
    fontSize: 14, color: colors.ink,
  },
  manualGoBtn: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing['2xl'], paddingVertical: 12,
    marginTop: spacing.md,
  },
  manualGoBtnText: { color: colors.white, fontWeight: '600', fontSize: 14 },

  manualSectionCamera: {
    width: '100%', alignItems: 'center',
    marginTop: spacing.lg,
  },
  orTextCamera: {
    color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: spacing.md,
  },
  manualRowCamera: {
    width: '100%', paddingHorizontal: spacing.xl,
  },
  manualInputCamera: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12,
    fontSize: 14, color: '#fff',
  },
  manualGoBtnCamera: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: spacing['2xl'], paddingVertical: 10,
    marginTop: spacing.md,
  },
});
