import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconAntologico } from './LogoAntologico';
import { useTheme } from '../hooks/useTheme';

const NAV = [
  { to: '/tenants',    label: 'Tenants' },
  { to: '/planes',     label: 'Planes y Promociones' },
  { to: '/reportes',   label: 'Reportes' },
  { to: '/metricas',   label: 'Métricas' },
  { to: '/rubros',     label: 'Rubros' },
  { to: '/cupones',    label: 'Cupones' },
  { to: '/usuarios',   label: 'Usuarios' },
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
  const [pressed, setPressed] = useState(false);
  const dark = isDarkSidebar || isDark;
  const bg = dark ? '#221d16' : '#e4ddd0';

  function handleClick() {
    setPressed(true);
    onClick();
    setTimeout(() => setPressed(false), 400);
  }

  const socketShadow = dark
    ? 'inset 0 0 10px 2px rgba(0,0,0,.5), inset 0 1px 1px 0 rgba(255,255,255,.06), inset 0 -1px 1px 0 rgba(0,0,0,.4)'
    : 'inset 0 0 10px 2px rgba(0,0,0,.12), inset 0 1px 1px 0 rgba(255,255,255,.9), inset 0 -1px 1px 0 rgba(0,0,0,.12)';

  const btnUp = dark
    ? '0 5px 8px -2px rgba(0,0,0,.6), inset 0 -1px 2px 0 rgba(0,0,0,.3), 0 -3px 5px -1px rgba(255,255,255,.04), inset 0 1px 2px 0 rgba(255,255,255,.1), inset 0 0 2px 0 rgba(255,255,255,.06), inset 0 6px 10px 0 rgba(255,255,255,.03)'
    : '0 5px 8px -2px rgba(0,0,0,.25), inset 0 -1px 2px 0 rgba(0,0,0,.1), 0 -3px 5px -1px rgba(255,255,255,.7), inset 0 1px 2px 0 rgba(255,255,255,.5), inset 0 0 2px 0 rgba(255,255,255,.8), inset 0 6px 10px 0 rgba(255,255,255,.2)';

  const btnDown = dark
    ? '0 2px 4px -1px rgba(0,0,0,.4), inset 0 -3px 8px 0 rgba(255,255,255,.04), 0 -2px 3px -1px rgba(255,255,255,.03), inset 0 3px 7px 0 rgba(0,0,0,.5), inset 0 0 3px 0 rgba(255,255,255,.03)'
    : '0 2px 4px -1px rgba(0,0,0,.15), inset 0 -3px 8px 0 rgba(255,255,255,.7), 0 -2px 3px -1px rgba(255,255,255,.5), inset 0 3px 7px 0 rgba(0,0,0,.15), inset 0 0 3px 0 rgba(255,255,255,.4)';

  return (
    <button
      onClick={handleClick}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="relative w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer select-none"
      style={{ background: bg, boxShadow: socketShadow }}
    >
      <div className="absolute rounded-full pointer-events-none" style={{
        width: 28, height: 28,
        background: dark ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.3)',
        boxShadow: dark ? '0 0 6px 3px rgba(255,255,255,.02)' : '0 0 6px 3px rgba(255,255,255,.2)',
      }} />
      <div
        className="relative w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: bg,
          boxShadow: pressed ? btnDown : btnUp,
          filter: 'blur(0.4px)',
          transition: 'all 300ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <div style={{
          transition: 'transform 300ms ease-out',
          transform: `rotate(${isDark ? '0' : '90'}deg) scale(${pressed ? 0.9 : 1})`,
          opacity: pressed ? 0.85 : 0.9,
        }}>
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
