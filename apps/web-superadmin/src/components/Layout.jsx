import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconAntologico } from './LogoAntologico';

const NAV = [
  { to: '/tenants',   label: 'Tenants' },
  { to: '/planes',    label: 'Planes' },
  { to: '/promocion', label: 'Promoción' },
  { to: '/reportes',  label: 'Reportes' },
];

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Layout({ children }) {
  const { admin, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar oscuro */}
      <aside className="w-52 shrink-0 flex flex-col h-screen" style={{ backgroundColor: '#1A1611' }}>
        {/* Logo */}
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <IconAntologico size={36} variant="bare" />
            <div>
              <div className="font-display text-base leading-tight" style={{ color: '#EFE7D8' }}>Antológico</div>
              <div
                className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold leading-none"
                style={{ backgroundColor: '#B98527', color: '#1A1611' }}
              >
                Super Admin
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-2 ${
                  isActive
                    ? 'border-[#B98527] text-white bg-white/8'
                    : 'border-transparent hover:bg-white/6'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#EFE7D8' : 'rgba(239,231,216,0.55)',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Usuario + logout */}
        <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs truncate mb-2" style={{ color: 'rgba(239,231,216,0.45)' }}>
            {admin?.email}
          </p>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs font-medium transition-colors"
            style={{ color: 'rgba(239,231,216,0.55)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EFE7D8'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,231,216,0.55)'}
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-12 bg-surface-0 border-b border-border flex items-center px-6 shrink-0">
          <span className="text-xs text-ink-muted">Panel de administración</span>
        </header>
        <main className="flex-1 overflow-y-auto bg-surface-0 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
