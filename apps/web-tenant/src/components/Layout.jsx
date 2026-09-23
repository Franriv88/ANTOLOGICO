import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/workshops', label: 'Talleres' },
  { to: '/reservas',  label: 'Reservas',    disabled: true },
  { to: '/reportes',  label: 'Reportes',    disabled: true },
  { to: '/identidad', label: 'Identidad',   disabled: true },
  { to: '/config',    label: 'Configuración', disabled: true },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 bg-surface-100 border-r border-border flex flex-col">
        <div className="px-5 py-6 border-b border-border">
          <span className="font-display text-xl text-ink">Antológico</span>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
          {NAV.map(({ to, label, disabled }) =>
            disabled ? (
              <span
                key={to}
                className="px-3 py-2 rounded-md text-sm text-ink-muted cursor-default select-none"
              >
                {label}
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-ink hover:bg-surface-200'
                  }`
                }
              >
                {label}
              </NavLink>
            )
          )}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs text-ink-muted truncate">{user?.nombre}</p>
          <button
            onClick={logout}
            className="mt-1 text-xs text-ink-muted hover:text-danger transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
