import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';

const IconExternal = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.5 ? '#1A1611' : '#ffffff';
}

function colorDistance(hex1, hex2) {
  if (!hex1?.startsWith('#') || !hex2?.startsWith('#')) return 999;
  const r1 = parseInt(hex1.slice(1,3),16), g1 = parseInt(hex1.slice(3,5),16), b1 = parseInt(hex1.slice(5,7),16);
  const r2 = parseInt(hex2.slice(1,3),16), g2 = parseInt(hex2.slice(3,5),16), b2 = parseInt(hex2.slice(5,7),16);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}

// Shared brand-theme injector used by Layout (on load) and TabIdentidad (real-time)
export function injectBrandTheme({ primary, button, bg, dFont, bFont }) {
  document.getElementById('brand-dashboard-theme')?.remove();

  if (!primary) return;

  const textOnPrimary = contrastText(primary);
  const effectiveButton = button || primary;
  const textOnButton = contrastText(effectiveButton);

  let css = `:root { --color-primary: ${primary};`;
  if (dFont) css += ` --font-display: '${dFont}', serif;`;
  if (bFont) css += ` --font-sans: '${bFont}', sans-serif;`;
  css += ' }';

  css += `
    #dashboard-header {
      background-color: ${primary} !important;
      border-bottom-color: transparent !important;
      -webkit-backdrop-filter: none !important;
      backdrop-filter: none !important;
    }
    #dashboard-header span { color: ${textOnPrimary} !important; opacity: 0.85; }
    #dashboard-header button {
      color: ${textOnPrimary} !important;
      border-color: ${textOnPrimary}40 !important;
    }
    #dashboard-header button:hover {
      background-color: rgba(0,0,0,0.12) !important;
    }
    #dashboard-main button.bg-primary,
    #dashboard-main a.bg-primary {
      background-color: ${effectiveButton} !important;
      color: ${textOnButton} !important;
      ${bg && colorDistance(effectiveButton, bg) < 60
        ? `border: 2px solid ${contrastText(effectiveButton)} !important;`
        : ''}
    }
    #dashboard-main button.bg-primary:hover,
    #dashboard-main a.bg-primary:hover {
      filter: brightness(0.9) !important;
    }
  `;

  if (bg) {
    const textOnBg  = contrastText(bg);
    const isDark    = textOnBg === '#ffffff';
    const ink       = isDark ? 'rgba(255,255,255,0.95)'  : '#2B241A';
    const inkMuted  = isDark ? 'rgba(255,255,255,0.72)'  : '#6B5F4C';
    const border    = isDark ? 'rgba(255,255,255,0.18)'  : '#D2C4A8';
    const surf0     = isDark ? 'rgba(255,255,255,0.04)'  : '#EFE7D8';
    const surf1     = isDark ? 'rgba(255,255,255,0.08)'  : '#FBF8F2';
    const surf2     = isDark ? 'rgba(255,255,255,0.14)'  : '#E4DAC5';
    css += `
      #dashboard-main { background-color: ${bg}; }

      #dashboard-main .text-ink         { color: ${ink} !important; }
      #dashboard-main .text-ink-muted   { color: ${inkMuted} !important; }
      #dashboard-main .border-border    { border-color: ${border} !important; }
      #dashboard-main .bg-surface-0     { background-color: ${surf0} !important; }
      #dashboard-main .bg-surface-100   { background-color: ${surf1} !important; }
      #dashboard-main .bg-surface-200   { background-color: ${surf2} !important; }

      #dashboard-main h1:not([class*="text-"]),
      #dashboard-main h2:not([class*="text-"]),
      #dashboard-main h3:not([class*="text-"]),
      #dashboard-main p:not([class*="text-"]),
      #dashboard-main span:not([class*="text-"]):not([style*="color"]),
      #dashboard-main label:not([class*="text-"]) { color: ${ink}; }

      /* ── Form element resets: always dark text on white bg ── */
      #dashboard-main input,
      #dashboard-main textarea,
      #dashboard-main select,
      #dashboard-main input.text-ink,
      #dashboard-main textarea.text-ink,
      #dashboard-main select.text-ink,
      #dashboard-main input[class*="text-"],
      #dashboard-main textarea[class*="text-"],
      #dashboard-main select[class*="text-"] {
        color: #2B241A !important;
        background-color: #ffffff !important;
        border-color: #D2C4A8 !important;
      }
      #dashboard-main input:focus,
      #dashboard-main textarea:focus,
      #dashboard-main select:focus { border-color: #E85D4A !important; }
      #dashboard-main input::placeholder,
      #dashboard-main textarea::placeholder { color: rgba(107,95,76,0.55) !important; }
      #dashboard-main input[type="date"]::-webkit-datetime-edit,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-text,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-day-field,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-month-field,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-year-field { color: #2B241A !important; }

      /* Non-primary/danger buttons: reset only text color, NOT background
         (bg stays as defined by its own class/style — color swatches use inline bg) */
      #dashboard-main button:not([class*="bg-primary"]):not([class*="bg-danger"]):not([class*="bg-amber"]):not([class*="bg-ink"]):not([class*="bg-black"]):not([style*="background-color"]) {
        color: #2B241A !important;
      }
      /* White-bg containers reset text classes */
      #dashboard-main .bg-white .text-ink  { color: #2B241A !important; }
      #dashboard-main .bg-white .text-ink-muted { color: #6B5F4C !important; }
    `;
  }

  const style = document.createElement('style');
  style.id = 'brand-dashboard-theme';
  style.textContent = css;
  document.head.appendChild(style);
}

const NAV = [
  { to: '/workshops', label: 'Talleres' },
  { to: '/reservas',  label: 'Reservas',     disabled: true },
  { to: '/reportes',  label: 'Reportes',     disabled: true },
  { to: '/config',    label: 'Configuración' },
];

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { espacios, activeEspacio, setActive } = useEspacio();

  // Apply saved brand theme on load (real-time changes are handled by TabIdentidad)
  useEffect(() => {
    const bc       = activeEspacio?.brandColors;
    const roles    = bc?.roles;
    const apply    = bc?.applyToDashboard;
    const fontKey  = activeEspacio?.brandFont ?? '';
    const [dFont, bFont] = fontKey.split('|');

    // Only inject here if TabIdentidad isn't mounted (i.e. it hasn't set its own style)
    // Check is implicit: if Tab is open it manages the same ID
    document.getElementById('brand-dashboard-theme')?.remove();

    if (!apply || !roles?.primary) return;

    injectBrandTheme({ primary: roles.primary, button: roles.button, bg: roles.bg, dFont, bFont });
  }, [activeEspacio?.brandColors, activeEspacio?.brandFont]);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-surface-100 border-r border-border flex flex-col h-screen">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border shrink-0 flex items-center gap-3">
          {activeEspacio?.logoUrl ? (
            <>
              <img
                src={activeEspacio.logoUrl}
                alt={activeEspacio.nombre ?? 'Logo'}
                className={`w-9 h-9 object-contain shrink-0 ${
                  activeEspacio.logoShape === 'round'   ? 'rounded-full' :
                  activeEspacio.logoShape === 'square'  ? 'rounded-none' :
                  'rounded-xl'
                }`}
              />
              <span className="font-display text-base text-ink leading-tight truncate">
                {activeEspacio.nombre ?? 'Antológico'}
              </span>
            </>
          ) : (
            <span className="font-display text-xl text-ink">Antológico</span>
          )}
        </div>

        {/* Selector de espacio */}
        {espacios.length > 1 ? (
          <div className="px-3 py-3 border-b border-border shrink-0">
            <select
              value={activeEspacio?.id ?? ''}
              onChange={e => {
                const found = espacios.find(esp => esp.id === e.target.value);
                if (found) setActive(found);
              }}
              className="w-full px-2 py-1.5 bg-white border border-border rounded-md text-xs text-ink focus:outline-none focus:border-primary"
            >
              {espacios.map(esp => (
                <option key={esp.id} value={esp.id}>{esp.nombre}</option>
              ))}
            </select>
          </div>
        ) : activeEspacio ? (
          <div className="px-5 py-3 border-b border-border shrink-0">
            <p className="text-xs font-medium text-ink truncate">{activeEspacio.nombre}</p>
            {(activeEspacio.rubro?.nombre || activeEspacio.rubroPersonalizado) && (
              <p className="text-xs text-ink-muted truncate">
                {activeEspacio.rubro?.nombre ?? activeEspacio.rubroPersonalizado}
              </p>
            )}
          </div>
        ) : null}

        {/* Navegación */}
        <nav className="flex-1 min-h-0 overflow-y-auto py-4 flex flex-col gap-0.5 px-3">
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

        {/* Ver página pública */}
        {activeEspacio && (
          <div className="px-3 pb-2 shrink-0">
            <a
              href={`/p/${activeEspacio.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors"
            >
              <IconExternal />
              Ver página pública
            </a>
          </div>
        )}

        {/* Plan actual */}
        {activeEspacio?.plan && (
          <div className="px-3 pb-3 shrink-0">
            <div className="px-3 py-2 bg-primary/8 border border-primary/20 rounded-lg">
              <p className="text-xs text-ink-muted leading-none mb-0.5">Plan actual</p>
              <p className="text-sm font-semibold text-primary">{activeEspacio.plan.nombre}</p>
            </div>
          </div>
        )}
      </aside>

      {/* ── Contenido principal ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top bar — siempre visible */}
        <header id="dashboard-header" className="sticky top-0 z-40 h-12 bg-surface-0/95 backdrop-blur-sm border-b border-border flex items-center justify-end px-5 gap-3 shrink-0">
          <span className="text-xs text-ink-muted truncate max-w-[200px]">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted border border-border rounded-md hover:bg-danger/8 hover:text-danger hover:border-danger/30 transition-colors"
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </header>

        <main id="dashboard-main" className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
