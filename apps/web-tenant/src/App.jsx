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
import MisDatos       from './pages/MisDatos';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function RequireDesktop({ children }) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return children;
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-[#E85D4A]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <h1 className="font-display text-xl text-[#1A1611] mb-2">Abrí el panel desde tu computadora</h1>
        <p className="text-sm text-[#6B5F4C] mb-6 max-w-xs mx-auto">
          El panel de gestión está optimizado para pantallas grandes. Usá una computadora o tablet para gestionar tus talleres.
        </p>
        <a href="/mis-reservas" className="text-sm text-[#E85D4A] hover:underline">
          ¿Sos alumno? Ver mis reservas →
        </a>
      </div>
    </div>
  );
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
            <Route path="/login"    element={<DevLogin />} />
            <Route path="/registro" element={<DevLogin mode="register" />} />
            <Route path="/p/:espacioId" element={<EspacioPublico />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/mis-datos"    element={<MisDatos />} />

            {/* Onboarding — requiere auth pero aún no tiene espacio */}
            <Route
              path="/onboarding"
              element={<RequireDesktop><RequireAuth><Onboarding /></RequireAuth></RequireDesktop>}
            />

            {/* Panel del tenant — requiere auth + al menos un espacio */}
            <Route
              path="/workshops"
              element={<RequireDesktop><RequireAuth><RequireEspacio><Workshops /></RequireEspacio></RequireAuth></RequireDesktop>}
            />
            <Route
              path="/workshops/nuevo"
              element={<RequireDesktop><RequireAuth><RequireEspacio><WorkshopForm /></RequireEspacio></RequireAuth></RequireDesktop>}
            />
            <Route
              path="/workshops/:id/editar"
              element={<RequireDesktop><RequireAuth><RequireEspacio><WorkshopForm /></RequireEspacio></RequireAuth></RequireDesktop>}
            />

            <Route
              path="/reservas"
              element={<RequireDesktop><RequireAuth><RequireEspacio><Reservas /></RequireEspacio></RequireAuth></RequireDesktop>}
            />

            <Route
              path="/reportes"
              element={<RequireDesktop><RequireAuth><RequireEspacio><Reportes /></RequireEspacio></RequireAuth></RequireDesktop>}
            />

            <Route
              path="/config"
              element={<RequireDesktop><RequireAuth><RequireEspacio><Configuracion /></RequireEspacio></RequireAuth></RequireDesktop>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EspacioProvider>
    </AuthProvider>
  );
}
