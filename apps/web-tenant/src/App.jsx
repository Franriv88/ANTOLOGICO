import { useState, useEffect } from 'react';
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
import Perfil   from './pages/Perfil';
import EspacioPublico from './pages/EspacioPublico';
import MisReservas    from './pages/MisReservas';
import MisDatos       from './pages/MisDatos';
import Inicio         from './pages/Inicio';
import AuthHandoff    from './pages/AuthHandoff';
import { FullScreenLoader } from './components/AntologicoLoader';
import * as api from './services/api';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return user ? children : <Navigate to="/" replace />;
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
        <h1 className="font-display text-xl text-ink mb-2">Abrí el panel desde tu computadora</h1>
        <p className="text-sm text-ink-muted mb-6 max-w-xs mx-auto">
          El panel de gestión está optimizado para pantallas grandes. Usá una computadora o tablet para gestionar tus talleres.
        </p>
        <a href="/inicio" className="text-sm text-primary hover:underline">
          ¿Sos alumno? Ir a mi inicio →
        </a>
      </div>
    </div>
  );
}

// Redirige al onboarding si el profesional no tiene espacios todavía
function RequireEspacio({ children }) {
  const { activeEspacio, loading } = useEspacio();
  if (loading) return <FullScreenLoader />;
  return activeEspacio ? children : <Navigate to="/onboarding" replace />;
}

function getSubdomain() {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length >= 3 && parts.slice(-2).join('.') === 'antologico.app') {
    const sub = parts.slice(0, -2).join('.');
    if (sub && sub !== 'www') return sub;
  }
  return null;
}

function SubdomainResolver() {
  const [espacioId, setEspacioId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const slug = getSubdomain();

  useEffect(() => {
    if (!slug) return;
    api.espacios.getBySlug(slug).then(esp => {
      if (esp) setEspacioId(esp.id);
      else setNotFound(true);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-display text-2xl text-[#2C2416] mb-2">Espacio no encontrado</h1>
          <p className="text-sm text-[#6B5D4D] mb-4">No existe un espacio con el subdominio <span className="font-mono font-medium">{slug}</span></p>
          <a href="https://www.antologico.app" className="text-sm text-[#E85D4A] hover:underline">Ir a Antológico →</a>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EspacioPublico overrideEspacioId={espacioId} />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/mis-datos" element={<MisDatos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Detecta si la app fue lanzada desde el TWA/PWA instalado (no desde el navegador)
function RootPage() {
  const isInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    document.referrer.startsWith('android-app://');
  if (isInstalled) return <Navigate to="/inicio" replace />;
  return <Landing />;
}

export default function App() {
  const subdomain = getSubdomain();

  if (subdomain) {
    return (
      <AuthProvider>
        <EspacioProvider>
          <SubdomainResolver />
        </EspacioProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <EspacioProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<RootPage />} />
            <Route path="/login"    element={<DevLogin />} />
            <Route path="/registro" element={<DevLogin mode="register" />} />
            <Route path="/auth/handoff" element={<AuthHandoff />} />
            <Route path="/p/:espacioId" element={<EspacioPublico />} />
            <Route path="/inicio"       element={<Inicio />} />
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
            <Route
              path="/perfil"
              element={<RequireDesktop><RequireAuth><RequireEspacio><Perfil /></RequireEspacio></RequireAuth></RequireDesktop>}
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </EspacioProvider>
    </AuthProvider>
  );
}
