import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconAntologico } from './LogoAntologico';
import { useTheme } from '../hooks/useTheme';

const NavIconTenants = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const NavIconPlanes = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const NavIconReportes = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const NavIconMetricas = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const NavIconRubros = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const NavIconCupones = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const NavIconUsuarios = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const NavIconMiEspacio = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const NAV = [
  { to: '/tenants',    label: 'Tenants',              icon: NavIconTenants },
  { to: '/planes',     label: 'Planes y Promociones', icon: NavIconPlanes },
  { to: '/reportes',   label: 'Reportes',             icon: NavIconReportes },
  { to: '/metricas',   label: 'Métricas',             icon: NavIconMetricas },
  { to: '/rubros',     label: 'Rubros',               icon: NavIconRubros },
  { to: '/cupones',    label: 'Cupones',              icon: NavIconCupones },
  { to: '/usuarios',   label: 'Usuarios',             icon: NavIconUsuarios },
  { to: '/mi-espacio', label: 'Mi Espacio',           icon: NavIconMiEspacio },
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
  const dark = isDarkSidebar || isDark;

  const raised = '0 6px 10px -3px rgba(0,0,0,.35), 0 -4px 6px -1px rgba(255,255,255,.06), inset 0 1px 2px rgba(255,255,255,.08), inset 0 -1px 2px rgba(0,0,0,.15), inset 0 6px 10px rgba(255,255,255,.04)';
  const sunken = 'inset 0 3px 8px rgba(0,0,0,.5), inset 0 -2px 6px rgba(255,255,255,.03), inset 0 0 4px rgba(0,0,0,.3)';

  return (
    <button
      onClick={onClick}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="relative w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer select-none"
      style={{
        background: dark ? '#1e1a14' : '#2a2520',
        boxShadow: isDark ? sunken : raised,
        transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      <div style={{
        transition: 'transform 400ms cubic-bezier(0.23, 1, 0.32, 1)',
        transform: `rotate(${isDark ? '0' : '90'}deg)`,
      }}>
        {isDark ? (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" stroke="#D49E3A" fill="#D49E3A" fillOpacity="0.15"/>
            {[[12,2,12,4],[12,20,12,22],[4.22,4.22,5.64,5.64],[18.36,18.36,19.78,19.78],[2,12,4,12],[20,12,22,12],[4.22,19.78,5.64,18.36],[18.36,5.64,19.78,4.22]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D49E3A" strokeWidth="1.5"/>
            ))}
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#8a7e6a" fill="#8a7e6a" fillOpacity="0.08"/>
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
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-2 ${
                  isActive
                    ? 'border-[#B98527] text-white bg-white/8'
                    : 'border-transparent hover:bg-white/6'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#EFE7D8' : 'rgba(239,231,216,0.55)',
              })}
            >
              <span className="shrink-0 opacity-75"><Icon /></span>
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
