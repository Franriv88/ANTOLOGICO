import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DevLogin from './pages/DevLogin';
import Workshops from './pages/Workshops';
import WorkshopForm from './pages/WorkshopForm';

function RequireAuth({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/dev-login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/dev-login" element={<DevLogin />} />
          <Route path="/" element={<RequireAuth><Navigate to="/workshops" replace /></RequireAuth>} />
          <Route path="/workshops" element={<RequireAuth><Workshops /></RequireAuth>} />
          <Route path="/workshops/nuevo" element={<RequireAuth><WorkshopForm /></RequireAuth>} />
          <Route path="/workshops/:id/editar" element={<RequireAuth><WorkshopForm /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
