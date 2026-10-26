import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconAntologico } from './LogoAntologico';
import { useTheme } from '../hooks/useTheme';

const NAV = [
  { to: '/tenants',    label: 'Tenants' },
  { to: '/planes',     label: 'Planes' },
  { to: '/reportes',   label: 'Reportes' },
  { to: '/metricas',   label: 'Métricas' },
  { to: '/rubros',     label: 'Rubros' },
  { to: '/mi-espacio', label: 'Mi Espacio' },
];

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

function ThemeToggleButton({ isDark, onClick, variant = 'default' }) {
  const isDarkSidebar = variant === 'sidebar';
  return (
    <button
      onClick={onClick}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="group relative w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center shrink-0"
      style={{
        background: isDarkSidebar
          ? 'linear-gradient(145deg, #111, #2b241a)'
          : isDark
            ? 'linear-gradient(145deg, #1a1611, #2b241a)'
            : 'linear-gradient(145deg, #e4dac5, #fbf8f2)',
        boxShadow: isDarkSidebar
          ? 'inset 3px 3px 6px #0a0907, inset -2px -2px 5px #3d342580, 0 1px 2px #0003'
          : isDark
            ? 'inset 3px 3px 6px #111, inset -2px -2px 5px #3d342580, 0 1px 2px #0003'
            : 'inset 3px 3px 6px #c4b89a, inset -2px -2px 5px #fff8, 0 1px 2px #0001',
      }}
    >
      <div className="transition-transform duration-300" style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(90deg)' }}>
        {isDark ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" stroke="#D49E3A" fill="#D49E3A" fillOpacity="0.15"/>
            {[[12,2,12,4],[12,20,12,22],[4.22,4.22,5.64,5.64],[18.36,18.36,19.78,19.78],[2,12,4,12],[20,12,22,12],[4.22,19.78,5.64,18.36],[18.36,5.64,19.78,4.22]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D49E3A" strokeWidth="1.5"/>
            ))}
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={isDarkSidebar ? '#8a7e6a' : '#6B5F4C'} fill={isDarkSidebar ? '#8a7e6a' : '#6B5F4C'} fillOpacity="0.08"/>
          </svg>
        )}
      </div>
    </button>
  );
}

export default function Layout({ children }) {
  const { admin, logout } = useAuth();
  const { isDark, toggle } = useTheme();

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

        {/* Theme toggle — above divider */}
        <div className="px-4 pb-3 shrink-0 flex items-center gap-2">
          <ThemeToggleButton isDark={isDark} onClick={toggle} variant="sidebar" />
          <span className="text-[11px]" style={{ color: 'rgba(239,231,216,0.45)' }}>
            {isDark ? 'Claro' : 'Oscuro'}
          </span>
        </div>

        {/* Usuario + logout */}
        <div className="px-4 py-4 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-xs truncate" style={{ color: 'rgba(239,231,216,0.45)' }}>
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
        <main className="flex-1 overflow-y-auto bg-surface-0">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
