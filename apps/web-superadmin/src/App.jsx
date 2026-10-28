import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout    from './components/Layout';
import Login     from './pages/Login';
import Tenants   from './pages/Tenants';
import Plans     from './pages/Plans';
import Reportes  from './pages/Reportes';
import Metricas  from './pages/Metricas';
import Promocion from './pages/Promocion';
import MiEspacio from './pages/MiEspacio';
import Rubros    from './pages/Rubros';
import Cupones   from './pages/Cupones';
import Usuarios  from './pages/Usuarios';
import { FullScreenLoader } from './components/AntologicoLoader';

function RequireAdmin({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  return admin ? children : <Navigate to="/login" replace />;
}

function AdminPage({ children }) {
  return (
    <RequireAdmin>
      <Layout>{children}</Layout>
    </RequireAdmin>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"   element={<Login />} />
          <Route path="/tenants" element={<AdminPage><Tenants /></AdminPage>} />
          <Route path="/planes"    element={<AdminPage><Plans /></AdminPage>} />
          <Route path="/reportes"  element={<AdminPage><Reportes /></AdminPage>} />
          <Route path="/metricas" element={<AdminPage><Metricas /></AdminPage>} />
          <Route path="/promocion" element={<AdminPage><Promocion /></AdminPage>} />
          <Route path="/mi-espacio" element={<AdminPage><MiEspacio /></AdminPage>} />
          <Route path="/rubros"    element={<AdminPage><Rubros /></AdminPage>} />
          <Route path="/cupones"   element={<AdminPage><Cupones /></AdminPage>} />
          <Route path="/usuarios" element={<AdminPage><Usuarios /></AdminPage>} />
          <Route path="*"          element={<Navigate to="/tenants" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
