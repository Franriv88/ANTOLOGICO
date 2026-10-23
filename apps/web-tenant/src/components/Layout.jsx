import { useState, useEffect } from 'react';
import { NavLink, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEspacio } from '../context/EspacioContext';
import { IconAntologico, LogoAntologico } from './LogoAntologico';
import Instructivo from './Instructivo';
import { usePlanes, precioConPeriodo } from '../hooks/usePlanes';
import { useTrialDays } from '../hooks/useTrialDays';
import { useTheme } from '../hooks/useTheme';
import { espacios as espacioApi } from '../services/api';

const MP_WORKER_URL = 'https://antologico-mp.franriv2388.workers.dev';

function TrialBanner({ espacio, trialDays }) {
  if (!espacio?.trialStartedAt) return null;
  if (espacio?.planId) return null;

  const maxDays = trialDays || 14;
  const daysElapsed = Math.floor((Date.now() - new Date(espacio.trialStartedAt)) / 86_400_000);
  const daysLeft    = Math.max(0, maxDays - daysElapsed);

  if (daysLeft === 0) return null;
  const isUrgent  = daysLeft <= 3;

  const bgCls     = isUrgent ? 'bg-danger/8 border-danger/20'  : 'bg-amber-50 border-amber-200';
  const textCls   = isUrgent ? 'text-danger'                    : 'text-amber-700';
  const btnCls    = isUrgent
    ? 'bg-danger text-white hover:bg-danger/90'
    : 'bg-amber-600 text-white hover:bg-amber-700';

  const message = isUrgent
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

// ── Red neuronal SVG (misma que Landing hero) ──────────────────────────────
const NET_EDGES = [
  [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
  [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
  [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
  [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
  [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
  [692,390,740,345],
];
const NET_NODES = [
  [256,108,6,true],[446,392,6,true],
  [392,128,29,false],[184,190,29,false],[315,198,29,false],[522,190,29,false],
  [656,158,29,false],[213,413,29,false],[365,445,29,false],[561,428,29,false],
  [692,390,29,false],
];

function NetworkSvg() {
  return (
    <svg viewBox="0 0 816 497" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 7" fill="none">
        {NET_EDGES.map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
      </g>
      {NET_NODES.map(([cx,cy,r,isHub],i) => (
        <circle key={i} cx={cx} cy={cy} r={r}
          fill={isHub ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}
          stroke="rgba(255,255,255,0.22)" strokeWidth={isHub ? 1 : 1.5} />
      ))}
    </svg>
  );
}

function formatPrecioLayout(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

const PERIODOS_OVERLAY = [
  { id: 'mensual',    label: 'Mensual' },
  { id: 'trimestral', label: 'Trimestral' },
  { id: 'anual',      label: 'Anual' },
];

function TrialExpiredOverlay({ espacio, trialDays, onSelectPlan }) {
  const planes = usePlanes();
  const [periodo, setPeriodo] = useState('mensual');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');

  async function handlePay(plan) {
    setLoadingPlan(plan.id);
    setError('');
    try {
      const precio = precioConPeriodo(plan, periodo);
      const meses = periodo === 'trimestral' ? 3 : periodo === 'anual' ? 12 : 1;
      const total = precio * meses;

      sessionStorage.setItem('mp_pending_sub', JSON.stringify({
        espacioId: espacio.id,
        planId: plan.id,
        plan,
        periodo,
      }));

      const backUrl = window.location.origin + '/workshops?mp_sub=back';
      const res = await fetch(`${MP_WORKER_URL}/crear-suscripcion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: `Plan ${plan.nombre} — ${periodo}`,
          amount: total,
          frequency: meses,
          frequencyType: 'months',
          payerEmail: espacio.email || 'tenant@antologico.app',
          externalReference: `sub|${espacio.id}|${plan.id}|${periodo}`,
          backUrl,
        }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoadingPlan(null); return; }
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        setError('No se pudo obtener el enlace de suscripción.');
        setLoadingPlan(null);
      }
    } catch {
      setError('Error al crear la suscripción.');
      setLoadingPlan(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto">
      {/* Fondo coral + red neuronal */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(148deg, #E85D4A 0%, #C4412F 48%, #8C2E1F 100%)' }}>
        <NetworkSvg />
      </div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 my-8 bg-surface-0 rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="flex justify-center mb-3">
            <LogoAntologico theme="light" width={220} />
          </div>
          <h2 className="font-display text-xl text-ink mb-1">
            Tu período de prueba de {trialDays} días ha finalizado
          </h2>
          <p className="text-sm text-ink-muted">
            Para seguir usando Antológico, elegí un plan y completá el pago.
          </p>
        </div>

        {/* Selector de período */}
        <div className="px-6 pb-3">
          <div className="flex gap-1 p-1 bg-surface-200 rounded-lg w-fit mx-auto">
            {PERIODOS_OVERLAY.map(op => (
              <button key={op.id} onClick={() => setPeriodo(op.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${periodo === op.id ? 'bg-surface-100 shadow-sm text-ink' : 'text-ink-muted hover:text-ink'}`}>
                {op.label}
                {op.id !== 'mensual' && (planes ?? [])[0] && (
                  <span className="ml-1 text-success font-semibold">
                    −{op.id === 'trimestral' ? ((planes ?? [])[0].descuentoTrimestral ?? 0) : ((planes ?? [])[0].descuentoAnual ?? 0)}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards de planes */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          {(planes ?? []).map(plan => {
            const precio = precioConPeriodo(plan, periodo);
            const dto = periodo === 'trimestral' ? (plan.descuentoTrimestral ?? 0) : periodo === 'anual' ? (plan.descuentoAnual ?? 0) : 0;
            const meses = periodo === 'trimestral' ? 3 : periodo === 'anual' ? 12 : 1;
            const total = precio * meses;
            const ahorro = dto > 0 ? (plan.precioMensual - precio) * meses : 0;
            return (
              <div key={plan.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${plan.highlight ? 'border-primary/40 bg-primary/5' : 'border-border bg-surface-100'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink">{plan.nombre}</p>
                    {plan.highlight && <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">Recomendado</span>}
                    {dto > 0 && <span className="text-xs px-1.5 py-0.5 bg-success/10 text-success rounded font-medium">−{dto}%</span>}
                  </div>
                  <ul className="flex flex-col gap-0.5 mt-1">
                    {(plan.features ?? []).slice(0, 3).map((f, i) => (
                      <li key={i} className="text-xs text-ink-muted flex items-center gap-1">
                        <span className="text-primary">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-semibold text-ink">{formatPrecioLayout(precio)}/mes</p>
                  {meses > 1 && <p className="text-xs text-ink-muted">{formatPrecioLayout(total)} total</p>}
                  {ahorro > 0 && <p className="text-xs text-success font-medium">Ahorrás {formatPrecioLayout(ahorro)}</p>}
                </div>
                <button
                  onClick={() => handlePay(plan)}
                  disabled={!!loadingPlan}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loadingPlan === plan.id ? 'Redirigiendo…' : 'Pagar'}
                </button>
              </div>
            );
          })}

          {error && <p className="text-xs text-center text-danger">{error}</p>}

          <p className="text-xs text-center text-ink-muted mt-1">
            Serás redirigido a Mercado Pago para activar tu suscripción recurrente. Se renovará automáticamente según el período elegido.
          </p>
        </div>
      </div>
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

  const hexToRgbChannels = (hex) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `${r} ${g} ${b}`;
  };

  let css = `:root { --color-primary: ${hexToRgbChannels(primary)};`;
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

      /* Contenedores: usan tokens (respetan dark mode) */
      #dashboard-main .bg-surface-0   { background-color: rgb(var(--color-surface-0)) !important; }
      #dashboard-main .bg-surface-100 { background-color: rgb(var(--color-surface-100)) !important; }
      #dashboard-main .bg-surface-200 { background-color: rgb(var(--color-surface-200)) !important; }
      #dashboard-main .border-border  { border-color: rgb(var(--color-border)) !important; }

      /* Texto dentro de contenedores: usan tokens */
      #dashboard-main .bg-surface-0 .text-ink,
      #dashboard-main .bg-surface-100 .text-ink,
      #dashboard-main .bg-white .text-ink  { color: rgb(var(--color-ink)) !important; }
      #dashboard-main .bg-surface-0 .text-ink-muted,
      #dashboard-main .bg-surface-100 .text-ink-muted,
      #dashboard-main .bg-white .text-ink-muted { color: rgb(var(--color-ink-muted)) !important; }

      /* Form elements */
      #dashboard-main input,
      #dashboard-main textarea,
      #dashboard-main select {
        color: rgb(var(--color-ink)) !important;
        background-color: rgb(var(--color-surface-100)) !important;
        border-color: rgb(var(--color-border)) !important;
      }
      #dashboard-main input:focus,
      #dashboard-main textarea:focus,
      #dashboard-main select:focus { border-color: rgb(var(--color-primary)) !important; }
      #dashboard-main input::placeholder,
      #dashboard-main textarea::placeholder { color: rgb(var(--color-ink-muted) / 0.55) !important; }
      #dashboard-main input[type="date"]::-webkit-datetime-edit,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-text,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-day-field,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-month-field,
      #dashboard-main input[type="date"]::-webkit-datetime-edit-year-field { color: rgb(var(--color-ink)) !important; }

      /* Botones no-primary: texto token */
      #dashboard-main button:not([class*="bg-primary"]):not([class*="bg-danger"]):not([class*="bg-amber"]):not([class*="bg-ink"]):not([class*="bg-black"]):not([style*="background-color"]) {
        color: rgb(var(--color-ink)) !important;
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

function ThemeToggleButton({ isDark, onClick }) {
  return (
    <button
      onClick={onClick}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className="group relative w-9 h-9 rounded-full transition-all duration-300 flex items-center justify-center shrink-0"
      style={{
        background: isDark
          ? 'linear-gradient(145deg, #1a1611, #2b241a)'
          : 'linear-gradient(145deg, #e4dac5, #fbf8f2)',
        boxShadow: isDark
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
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#6B5F4C" fill="#6B5F4C" fillOpacity="0.08"/>
          </svg>
        )}
      </div>
    </button>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { espacios, activeEspacio, setActive, refresh } = useEspacio();
  const trialDays = useTrialDays();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const trialRef = activeEspacio?.trialStartedAt ?? activeEspacio?.createdAt;
  const daysElapsed = trialRef ? Math.floor((Date.now() - new Date(trialRef)) / 86_400_000) : 0;
  const trialExpired = trialRef && daysElapsed >= trialDays && !activeEspacio?.planId;


  useEffect(() => {
    const mpSub = searchParams.get('mp_sub');
    const preapprovalId = searchParams.get('preapproval_id');
    if (!mpSub && !preapprovalId) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('mp_sub');
    newParams.delete('preapproval_id');
    setSearchParams(newParams, { replace: true });

    const pending = (() => { try { return JSON.parse(sessionStorage.getItem('mp_pending_sub')); } catch { return null; } })();
    if (!pending) return;

    if (preapprovalId) {
      fetch(`${MP_WORKER_URL}/suscripcion-status?preapprovalId=${preapprovalId}`)
        .then(r => r.json())
        .then(data => {
          if (data.status === 'authorized' || data.status === 'pending') {
            sessionStorage.removeItem('mp_pending_sub');
            espacioApi.updatePlan(pending.espacioId, pending.planId, pending.plan, pending.periodo, preapprovalId)
              .then(() => refresh())
              .catch(console.error);
          }
        })
        .catch(console.error);
    } else if (mpSub === 'back') {
      sessionStorage.removeItem('mp_pending_sub');
      espacioApi.updatePlan(pending.espacioId, pending.planId, pending.plan, pending.periodo)
        .then(() => refresh())
        .catch(console.error);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Overlay bloqueante cuando la prueba venció */}
      {trialExpired && <TrialExpiredOverlay espacio={activeEspacio} trialDays={trialDays} />}

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
              className="w-full px-2 py-1.5 bg-surface-100 border border-border rounded-md text-xs text-ink focus:outline-none focus:border-primary"
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
        <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-brand py-4 flex flex-col gap-0.5 px-3">
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
          <ThemeToggleButton isDark={isDark} onClick={toggleTheme} />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-muted border border-border rounded-md hover:bg-danger/8 hover:text-danger hover:border-danger/30 transition-colors"
          >
            <IconLogout />
            Cerrar sesión
          </button>
        </header>

        <TrialBanner espacio={activeEspacio} trialDays={trialDays} />
        <main id="dashboard-main" className="flex-1 overflow-y-auto scrollbar-brand p-8">{children}</main>
      </div>
      <Instructivo />
    </div>
  );
}
