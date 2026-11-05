import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../lib/theme';

import InicioScreen from '../screens/InicioScreen';
import EspacioScreen from '../screens/EspacioScreen';
import BookingScreen from '../screens/BookingScreen';
import MisReservasScreen from '../screens/MisReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const color = focused ? colors.primary : colors.inkLight;
  const icons = {
    Inicio:    '⬡',
    Reservas:  '🎟',
    QR:        '⬜',
    Perfil:    '●',
  };
  return (
    <View style={styles.tabIconBox}>
      <Text style={[styles.tabIcon, { color }]}>{icons[name] || '•'}</Text>
    </View>
  );
}

function QRTabButton({ children, ...props }) {
  return (
    <View style={styles.qrBtnOuter}>
      <View style={styles.qrBtn}>
        <Text style={styles.qrBtnIcon}>⬜</Text>
      </View>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inkLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Inicio" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MisReservas"
        component={MisReservasScreen}
        options={{
          title: 'Reservas',
          tabBarIcon: ({ focused }) => <TabIcon name="Reservas" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="QRTab"
        component={QRScannerScreen}
        options={{
          title: 'QR',
          tabBarIcon: ({ focused }) => <TabIcon name="QR" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="Perfil" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>Antológico</Text>
      </View>
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
            name="HomeTabs"
            component={HomeTabs}
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
            options={{ title: 'Escanear QR', headerTransparent: true, headerTintColor: '#fff' }}
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
    backgroundColor: colors.surface0,
  },
  loadingLogo: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  tabIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  tabIcon: {
    fontSize: 18,
  },
  qrBtnOuter: {
    top: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtnIcon: {
    fontSize: 22,
    color: colors.white,
  },
});
