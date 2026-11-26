import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius } from '../lib/theme';
import { LogoAntologico, IconAntologico } from '../components/LogoAntologico';
import { HomeIcon, CalendarIcon, UserIcon, LogoutIcon, QRIcon, AntologicoSpinner } from '../components/Icons';

import InicioScreen from '../screens/InicioScreen';
import EspacioScreen from '../screens/EspacioScreen';
import BookingScreen from '../screens/BookingScreen';
import MisReservasScreen from '../screens/MisReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CoralHeader({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={['#E85D4A', '#C4412F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + 12 }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
            style={styles.hamburgerBtn}
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          <IconAntologico size={34} />
          <Text style={styles.headerTitle}>Antológico</Text>
        </View>
        <TouchableOpacity
          style={styles.headerQrBtn}
          onPress={() => navigation.navigate('QRScanner')}
          activeOpacity={0.7}
        >
          <QRIcon size={18} color="#FFFFFF" />
          <Text style={styles.headerQrText}>QR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function CustomDrawerContent(props) {
  const { navigation } = props;
  const activeRoute = props.state.routes[props.state.index]?.name;

  function handleLogout() {
    navigation.closeDrawer();
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que querés cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await GoogleSignin.signOut().catch(() => {});
              await signOut(getAuth());
            } catch {}
          },
        },
      ],
    );
  }

  const menuItems = [
    { key: 'Inicio', label: 'Inicio', Icon: HomeIcon },
    { key: 'MisReservas', label: 'Mis reservas', Icon: CalendarIcon },
    { key: 'Perfil', label: 'Mi perfil', Icon: UserIcon },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      <View style={styles.drawerHeader}>
        <View style={styles.drawerLogoRow}>
          <IconAntologico size={28} />
          <Text style={styles.drawerBrand}>Antológico</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.closeDrawer()} activeOpacity={0.7}>
          <Text style={styles.drawerClose}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.drawerMenu}>
        {menuItems.map(item => {
          const active = activeRoute === item.key;
          const iconColor = active ? colors.primary : colors.inkLight;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.drawerItem, active && styles.drawerItemActive]}
              onPress={() => navigation.navigate(item.key)}
              activeOpacity={0.7}
            >
              <View style={styles.drawerIconBox}>
                <item.Icon size={20} color={iconColor} />
              </View>
              <Text style={[styles.drawerItemLabel, active && styles.drawerItemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={styles.drawerIconBox}>
            <LogoutIcon size={20} color={colors.inkLight} />
          </View>
          <Text style={styles.drawerItemLabel}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

function DrawerScreens() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        header: ({ navigation }) => <CoralHeader navigation={navigation} />,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.45)',
        drawerStyle: {
          backgroundColor: colors.white,
          width: 260,
        },
      }}
    >
      <Drawer.Screen name="Inicio" component={InicioScreen} />
      <Drawer.Screen name="MisReservas" component={MisReservasScreen} options={{ title: 'Mis reservas' }} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Mi perfil' }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LinearGradient
        colors={['#E85D4A', '#C4412F', '#8C2E1F']}
        locations={[0, 0.48, 1]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.loading}
      >
        <AntologicoSpinner width={280} theme="coral" />
      </LinearGradient>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface0 },
        headerTintColor: colors.ink,
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        headerShadowVisible: false,
        headerBackTitle: '',
      }}
    >
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="DrawerScreens"
            component={DrawerScreens}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Espacio"
            component={EspacioScreen}
            options={({ route }) => ({
              title: route.params?.nombre || 'Espacio',
            })}
          />
          <Stack.Screen
            name="Booking"
            component={BookingScreen}
            options={{ title: 'Reservar' }}
          />
          <Stack.Screen
            name="QRScanner"
            component={QRScannerScreen}
            options={{
              title: 'Escanear QR',
              headerStyle: { backgroundColor: '#000' },
              headerTintColor: '#fff',
              headerShadowVisible: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: spacing.base,
    paddingBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hamburgerBtn: {
    width: 28,
    height: 22,
    justifyContent: 'space-between',
    marginRight: 4,
  },
  hamburgerLine: {
    height: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerQrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerQrText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  drawerScroll: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  drawerClose: {
    fontSize: 20,
    color: colors.inkMuted,
    paddingHorizontal: 4,
  },
  drawerMenu: {
    flex: 1,
    paddingTop: spacing.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginHorizontal: spacing.sm,
  },
  drawerItemActive: {
    backgroundColor: 'rgba(232, 93, 74, 0.08)',
  },
  drawerIconBox: {
    width: 24,
    alignItems: 'center',
  },
  drawerItemLabel: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: '500',
  },
  drawerItemTextActive: {
    color: colors.primary,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
});
