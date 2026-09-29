import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EspacioProvider, useEspacio } from './context/EspacioContext';
import DevLogin   from './pages/DevLogin';
import Landing    from './pages/Landing';
import Onboarding from './pages/onboarding/Onboarding';
import Workshops    from './pages/Workshops';
import WorkshopForm from './pages/WorkshopForm';
import Configuracion from './pages/Configuracion';
import Reservas from './pages/Reservas';
import Reportes from './pages/Reportes';
import EspacioPublico from './pages/EspacioPublico';
import MisReservas    from './pages/MisReservas';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

// Redirige al onboarding si el profesional no tiene espacios todavía
function RequireEspacio({ children }) {
  const { activeEspacio, loading } = useEspacio();
  if (loading) return null;
  return activeEspacio ? children : <Navigate to="/onboarding" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <EspacioProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<DevLogin />} />
            <Route path="/p/:espacioId" element={<EspacioPublico />} />
            <Route path="/mis-reservas" element={<MisReservas />} />

            {/* Onboarding — requiere auth pero aún no tiene espacio */}
            <Route
              path="/onboarding"
              element={<RequireAuth><Onboarding /></RequireAuth>}
            />

            {/* Panel del tenant — requiere auth + al menos un espacio */}
            <Route
              path="/workshops"
              element={<RequireAuth><RequireEspacio><Workshops /></RequireEspacio></RequireAuth>}
            />
            <Route
              path="/workshops/nuevo"
              element={<RequireAuth><RequireEspacio><WorkshopForm /></RequireEspacio></RequireAuth>}
            />
            <Route
              path="/workshops/:id/editar"
              element={<RequireAuth><RequireEspacio><WorkshopForm /></RequireEspacio></RequireAuth>}
            />

            <Route
              path="/reservas"
              element={<RequireAuth><RequireEspacio><Reservas /></RequireEspacio></RequireAuth>}
            />

            <Route
              path="/reportes"
              element={<RequireAuth><RequireEspacio><Reportes /></RequireEspacio></RequireAuth>}
            />

            <Route
              path="/config"
              element={<RequireAuth><RequireEspacio><Configuracion /></RequireEspacio></RequireAuth>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EspacioProvider>
    </AuthProvider>
  );
}
