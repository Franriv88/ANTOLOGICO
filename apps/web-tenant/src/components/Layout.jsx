import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
import { IconAntologico } from './LogoAntologico';

function TrialBanner({ espacio }) {
  if (!espacio?.trialStartedAt) return null;
  if (espacio?.planId) return null; // plan real activo

  const daysElapsed = Math.floor((Date.now() - new Date(espacio.trialStartedAt)) / 86_400_000);
  const daysLeft    = Math.max(0, 14 - daysElapsed);

  const isExpired = daysLeft === 0;
  const isUrgent  = daysLeft <= 3;

  const bgCls     = isExpired || isUrgent ? 'bg-danger/8 border-danger/20'  : 'bg-amber-50 border-amber-200';
  const textCls   = isExpired || isUrgent ? 'text-danger'                    : 'text-amber-700';
  const btnCls    = isExpired || isUrgent
    ? 'bg-danger text-white hover:bg-danger/90'
    : 'bg-amber-600 text-white hover:bg-amber-700';

  const message = isExpired
    ? 'Tu período de prueba ha vencido. Activá tu plan para seguir usando Antológico.'
    : isUrgent
    ? `¡Quedan solo ${daysLeft} día${daysLeft !== 1 ? 's' : ''} de prueba gratuita! Activá tu plan.`
    : `Prueba gratuita · Te quedan ${daysLeft} días`;

  return (
    <div className={`border-b px-5 py-2 flex items-center justify-between gap-4 shrink-0 ${bgCls}`}>
      <p className={`text-xs font-medium ${textCls}`}>{message}</p>
      <Link
        to="/config"
        className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-md transition-colors ${btnCls}`}
      >
        Activar plan
      </Link>
    </div>
  );
}

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
    const textOnBg = contrastText(bg);
    const isDark   = textOnBg === '#ffffff';
    const ink      = isDark ? 'rgba(255,255,255,0.95)' : '#2B241A';
    const inkMuted = isDark ? 'rgba(255,255,255,0.72)' : '#6B5F4C';
    css += `
      #dashboard-main { background-color: ${bg}; }

      /* Texto sobre el fondo de marca */
      #dashboard-main .text-ink       { color: ${ink} !important; }
      #dashboard-main .text-ink-muted { color: ${inkMuted} !important; }

      #dashboard-main h1:not([class*="text-"]),
      #dashboard-main h2:not([class*="text-"]),
      #dashboard-main h3:not([class*="text-"]),
      #dashboard-main p:not([class*="text-"]),
      #dashboard-main span:not([class*="text-"]):not([style*="color"]),
      #dashboard-main label:not([class*="text-"]) { color: ${ink}; }

      /* Contenedores: siempre estética original (cream/blanco) */
      #dashboard-main .bg-surface-0   { background-color: #EFE7D8 !important; }
      #dashboard-main .bg-surface-100 { background-color: #FBF8F2 !important; }
      #dashboard-main .bg-surface-200 { background-color: #E4DAC5 !important; }
      #dashboard-main .border-border  { border-color: #D2C4A8 !important; }

      /* Texto dentro de contenedores: siempre oscuro */
      #dashboard-main .bg-surface-0 .text-ink,
      #dashboard-main .bg-surface-100 .text-ink,
      #dashboard-main .bg-white .text-ink  { color: #2B241A !important; }
      #dashboard-main .bg-surface-0 .text-ink-muted,
      #dashboard-main .bg-surface-100 .text-ink-muted,
      #dashboard-main .bg-white .text-ink-muted { color: #6B5F4C !important; }

      /* Form elements: siempre fondo blanco texto oscuro */
      #dashboard-main input,
      #dashboard-main textarea,
      #dashboard-main select {
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

      /* Botones no-primary: texto oscuro */
      #dashboard-main button:not([class*="bg-primary"]):not([class*="bg-danger"]):not([class*="bg-amber"]):not([class*="bg-ink"]):not([class*="bg-black"]):not([style*="background-color"]) {
        color: #2B241A !important;
      }
    `;
  }

  const style = document.createElement('style');
  style.id = 'brand-dashboard-theme';
  style.textContent = css;
  document.head.appendChild(style);
}

const NAV = [
  { to: '/workshops', label: 'Talleres' },
  { to: '/reservas',  label: 'Reservas' },
  { to: '/reportes',  label: 'Reportes' },
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

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-surface-100 border-r border-border flex flex-col h-screen">
        {/* Logo — link al Home */}
        <Link to="/workshops" className="px-4 py-4 border-b border-border shrink-0 flex items-center gap-3 hover:bg-surface-200/50 transition-colors">
          {activeEspacio?.logoUrl ? (
            <>
              <div className={`w-9 h-9 overflow-hidden shrink-0 ${
                activeEspacio.logoShape === 'round'   ? 'rounded-full' :
                activeEspacio.logoShape === 'square'  ? 'rounded-none' :
                'rounded-xl'
              }`}>
                <img
                  src={activeEspacio.logoUrl}
                  alt={activeEspacio.nombre ?? 'Logo'}
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${activeEspacio.logoScale ?? 1})`, transformOrigin: 'center' }}
                />
              </div>
              <span className="font-display text-base text-ink leading-tight truncate">
                {activeEspacio.nombre ?? 'Antológico'}
              </span>
            </>
          ) : (
            <>
              <IconAntologico size={36} />
              <span className="font-display text-base text-ink leading-tight">Antológico</span>
            </>
          )}
        </Link>

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

        <TrialBanner espacio={activeEspacio} />
        <main id="dashboard-main" className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
