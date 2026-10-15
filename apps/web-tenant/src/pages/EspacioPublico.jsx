import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { espacios as espaciosApi, workshops as workshopsApi, reservas as reservasApi } from '../services/api';
import { getSlotStatus } from '../lib/slotStatus';
import { loginGoogle, loginEmail, register, logout, subscribeAuth, authErrorMsg, sendPasswordReset, checkRedirectResult } from '../services/userAuth';
import mpLogo from '../assets/Mercado_Pago.png';
import { SocialIconsRow } from '../components/SocialIcons';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

const MP_PLATFORM_KEY = 'APP_USR-1aadb258-7d8b-4126-8e7d-2dbad6270be7';

const MP_WORKER_URL = 'https://antologico-mp.franriv2388.workers.dev';
// SlotBadge no se usa aquí — reemplazado por PublicSlotBadge con fondo sólido

// Badge con fondo sólido para legibilidad sobre cualquier imagen o color
const SLOT_SOLID = {
  DISPONIBLE:    { label: 'Disponible',    bg: '#10B981', text: '#fff' },
  ULTIMOS_CUPOS: { label: 'Últimos cupos', bg: '#B98527', text: '#fff' },
  AGOTADO:       { label: 'Agotado',       bg: '#DC2626', text: '#fff' },
};
function PublicSlotBadge({ status }) {
  const cfg = SLOT_SOLID[status] ?? SLOT_SOLID.DISPONIBLE;
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold shadow-sm" style={{ backgroundColor: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function formatHora(iso) {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

function parseBrand(espacio) {
  const bc = espacio?.brandColors;
  const palette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const roles   = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  const primary  = roles.primary  || palette[0] || '#E85D4A';
  const button   = roles.button   || primary;
  const bg       = roles.bg       || '#FAF8F4';
  const card     = roles.card     || '#ffffff';
  const textCard = roles.textCard || (contrastText(card) === '#ffffff' ? '#f0f0f0' : '#2B241A');
  return { primary, button, bg, card, textCard };
}

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#1A1611' : '#ffffff';
}

// ── AuthModal ─────────────────────────────────────────────────────────────────

function AuthModal({ brand, onClose, onSuccess }) {
  const [tab,        setTab]        = useState('login');
  const [nombre,     setNombre]     = useState('');
  const [email,      setEmail]      = useState('');
  const [telefono,   setTelefono]   = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  // "Olvidé mi contraseña"
  const [resetMode,  setResetMode]  = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetDone,  setResetDone]  = useState(false);
  const [resetErr,   setResetErr]   = useState('');
  // verificación de email tras registro
  const [verifyEmail, setVerifyEmail] = useState(null); // null o email string
  const [pendingAuth, setPendingAuth] = useState(null);

  const INPUT = 'w-full px-3 py-2 bg-white border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] focus:outline-none focus:ring-2 focus:ring-offset-1';
  const LABEL = 'block text-xs font-medium text-[#6B5F4C] mb-1';

  async function handleGoogle() {
    setLoading('google'); setError('');
    try {
      const result = await loginGoogle();
      if (result) onSuccess(result); // null = mobile redirect, page will reload
    } catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading('form'); setError('');
    try {
      if (tab === 'login') {
        onSuccess(await loginEmail(email, password));
      } else {
        if (!nombre.trim()) { setError('El nombre es requerido'); setLoading(false); return; }
        const result = await register(email, password, nombre.trim(), telefono.trim());
        // Muestra pantalla de verificación antes de continuar
        setPendingAuth(result);
        setVerifyEmail(email.trim());
        setLoading(false);
      }
    } catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!resetEmail.trim()) { setResetErr('Ingresá tu email'); return; }
    setLoading('reset'); setResetErr('');
    try {
      await sendPasswordReset(resetEmail.trim());
      setResetDone(true);
    } catch (e) {
      setResetErr(e.code === 'auth/user-not-found' ? 'No existe una cuenta con ese email' : 'No pudimos enviar el email. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  // ── Pantalla: verificación de email enviada ──────────────────────────────────
  if (verifyEmail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/55" onClick={onClose} />
        <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: brand.button + '22' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={brand.button} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 className="font-display text-lg text-[#1A1611] mb-1">¡Cuenta creada!</h3>
          <p className="text-sm text-[#6B5F4C] mb-1">Te enviamos un email de verificación a:</p>
          <p className="text-sm font-semibold text-[#2B241A] mb-4">{verifyEmail}</p>
          <p className="text-xs text-[#9B9083] mb-5">Revisá tu bandeja (y el spam) para confirmar tu cuenta. Podés continuar ahora si querés.</p>
          <button
            onClick={() => { if (pendingAuth) onSuccess(pendingAuth); else onClose(); }}
            className="w-full py-2.5 rounded-xl text-sm font-bold mb-2"
            style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}>
            Continuar
          </button>
          <button onClick={onClose} className="w-full py-2 text-xs text-[#6B5F4C] hover:text-[#2B241A] transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla: recuperar contraseña ───────────────────────────────────────────
  if (resetMode) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/55" onClick={onClose} />
        <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h3 className="font-display text-lg text-[#1A1611] mb-1">Recuperar contraseña</h3>
            <p className="text-sm text-[#6B5F4C] mb-5">Te enviamos un enlace para crear una nueva contraseña.</p>
            {resetDone ? (
              <div className="flex flex-col gap-3 pb-2">
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <svg width="16" height="16" className="mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <p className="text-sm text-emerald-800">¡Listo! Revisá tu email — el enlace llega en unos segundos.</p>
                </div>
                <button onClick={() => { setResetMode(false); setResetDone(false); setResetEmail(''); }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold mt-1"
                  style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}>
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-3 pb-2">
                <div>
                  <label className={LABEL}>Email *</label>
                  <input type="email" autoFocus value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="tu@email.com" className={INPUT} />
                </div>
                {resetErr && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{resetErr}</p>}
                <button type="submit" disabled={!!loading}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50 mt-1"
                  style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}>
                  {loading === 'reset' ? 'Enviando…' : 'Enviar enlace de recuperación'}
                </button>
              </form>
            )}
          </div>
          <button type="button" onClick={() => setResetMode(false)}
            className="w-full py-3 text-xs text-[#6B5F4C] hover:text-[#2B241A] text-center transition-colors border-t border-[#D2C4A8]">
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla principal: login / registro ──────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-2">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#F0EAE0] rounded-xl mb-5">
            {['login', 'register'].map(t => (
              <button key={t} type="button" onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t ? 'bg-white shadow-sm text-[#1A1611]' : 'text-[#6B5F4C] hover:text-[#1A1611]'}`}>
                {t === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {/* Google */}
          <button type="button" onClick={handleGoogle} disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#D2C4A8] rounded-xl bg-white hover:bg-[#F8F5F0] transition-colors text-sm font-medium text-[#1A1611] mb-4 disabled:opacity-60">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading === 'google' ? 'Conectando…' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#D2C4A8]" /><span className="text-xs text-[#9B9083]">o</span><div className="flex-1 h-px bg-[#D2C4A8]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 pb-2">
            {tab === 'register' && (
              <>
                <div>
                  <label className={LABEL}>Nombre completo *</label>
                  <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" autoFocus className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Teléfono</label>
                  <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="+54 9 11 1234-5678" className={INPUT} />
                </div>
              </>
            )}
            <div>
              <label className={LABEL}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoFocus={tab === 'login'} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Contraseña *</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'} className={INPUT} />
              {tab === 'login' && (
                <button type="button" onClick={() => { setResetEmail(email); setResetMode(true); }}
                  className="text-xs text-[#9B9083] hover:text-[#6B5F4C] mt-1.5 float-right transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 clear-both">{error}</p>}
            <button type="submit" disabled={!!loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold transition-opacity disabled:opacity-50 mt-1 clear-both"
              style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}>
              {loading === 'form' ? (tab === 'login' ? 'Ingresando…' : 'Creando cuenta…') : (tab === 'login' ? 'Ingresar' : 'Crear cuenta')}
            </button>
          </form>
        </div>
        <button type="button" onClick={onClose} className="w-full py-3 text-xs text-[#6B5F4C] hover:text-[#2B241A] text-center transition-colors border-t border-[#D2C4A8]">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── BookingModal ──────────────────────────────────────────────────────────────

function BookingModal({ workshop, brand, prefill, tenantId, cobrosLinks, onConfirm, onClose }) {
  const [cantidad,  setCantidad]  = useState(1);
  const [nombres,   setNombres]   = useState([prefill?.nombre ?? '']);
  const [email,    setEmail]    = useState(prefill?.email    ?? '');
  const [telefono, setTelefono] = useState(prefill?.telefono ?? '');
  const [loading,  setLoading]  = useState(false);
  const [error,       setError]       = useState('');
  const [mpStep,      setMpStep]      = useState(null); // null | 'card'
  const [preferenceId, setPreferenceId] = useState(null);
  const [loadingPref,  setLoadingPref]  = useState(false);
  const [mpKey,           setMpKey]           = useState(null);
  const [tenantMpReady,   setTenantMpReady]   = useState(false); // false while fetching

  useEffect(() => {
    fetch(`${MP_WORKER_URL}/tenant-mp-config?tenantId=${tenantId}`)
      .then(r => r.json())
      .then(d => {
        if (d.connected && d.publicKey) {
          initMercadoPago(d.publicKey, { locale: 'es-AR' });
          setMpKey(d.publicKey);
        }
        setTenantMpReady(true);
      })
      .catch(() => setTenantMpReady(true));
  }, [tenantId]);

  const INPUT = 'w-full px-3 py-2 bg-white border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] focus:outline-none focus:ring-2 focus:ring-offset-1';
  const LABEL = 'block text-xs font-medium text-[#6B5F4C] mb-1';

  function adjustCantidad(delta) {
    const next = Math.max(1, Math.min(workshop.cuposDisponibles, cantidad + delta));
    setCantidad(next);
    setNombres(prev => {
      const arr = [...prev];
      while (arr.length < next) arr.push('');
      return arr.slice(0, next);
    });
  }

  function updateNombre(i, val) {
    setNombres(prev => { const a = [...prev]; a[i] = val; return a; });
    setError('');
  }

  function validateForm() {
    if (nombres.some(n => !n.trim())) { setError(cantidad > 1 ? 'Todos los nombres son requeridos' : 'El nombre es requerido'); return false; }
    if (!email.trim() || !email.includes('@')) { setError('Email inválido'); return false; }
    if (!telefono.trim()) { setError('El teléfono es requerido'); return false; }
    return true;
  }

  const headerBg  = workshop.headerType === 'COLOR' && workshop.headerValue ? workshop.headerValue : brand.primary;
  const headerImg = workshop.headerType === 'IMAGE' && workshop.headerValue ? workshop.headerValue : null;

  async function handleSubmitEfectivo() {
    if (!validateForm()) return;
    setLoading('EFECTIVO');
    setError('');
    try {
      const reservas = await Promise.all(
        nombres.map(n => reservasApi.create(workshop.id, {
          nombre:   n.trim(),
          email:    email.trim(),
          telefono: telefono.trim(),
          metodoPago: 'EFECTIVO',
        }))
      );
      onConfirm(reservas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoToMP() {
    if (!validateForm()) return;
    setError('');
    setPreferenceId(null);
    setMpStep('card');
  }

  useEffect(() => {
    if (mpStep !== 'card') return;
    setLoadingPref(true);
    fetch(`${MP_WORKER_URL}/crear-preferencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount:     workshop.precio * cantidad,
        description: cantidad > 1 ? `${workshop.nombre} (${cantidad} cupos)` : workshop.nombre,
        payerEmail: email.trim(),
        tenantId,
      }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.preferenceId) {
          setPreferenceId(d.preferenceId);
        } else {
          setError(d.error ?? 'No se pudo inicializar el pago. Intentá de nuevo.');
          setMpStep(null);
        }
      })
      .catch(() => { setError('No se pudo inicializar el pago. Intentá de nuevo.'); setMpStep(null); })
      .finally(() => setLoadingPref(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mpStep]);

  async function handleMPPayment({ formData: pd }) {
    setLoading('MERCADO_PAGO');
    setError('');
    try {
      const res = await fetch(`${MP_WORKER_URL}/procesar-pago`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token:             pd.token,
          paymentMethodId:   pd.payment_method_id,
          issuerId:          pd.issuer_id,
          installments:      pd.installments,
          transactionAmount: workshop.precio * cantidad,
          description:       cantidad > 1 ? `${workshop.nombre} (${cantidad} cupos)` : workshop.nombre,
          tenantId,
          payer: {
            email:          email.trim(),
            identification: pd.payer?.identification,
          },
        }),
      });
      const payment = await res.json();
      if (payment.status === 'approved') {
        const reservas = await Promise.all(
          nombres.map(n => reservasApi.create(workshop.id, {
            nombre:      n.trim(),
            email:       email.trim(),
            telefono:    telefono.trim(),
            metodoPago:  'MERCADO_PAGO',
            mpPaymentId: String(payment.id),
          }))
        );
        onConfirm(reservas);
      } else {
        setError(`Pago rechazado: ${payment.status_detail ?? payment.message ?? payment.status}`);
        setMpStep(null);
      }
    } catch (err) {
      setError('Error al procesar el pago. Intentá de nuevo.');
      setMpStep(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={mpStep ? undefined : onClose} />
      <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl w-full max-w-sm overflow-y-auto max-h-[92vh]">
        {/* Mini header del taller */}
        <div
          className="h-24 relative flex items-end p-4"
          style={{
            backgroundColor: headerBg,
            ...(headerImg && {
              backgroundImage: `url(${headerImg})`,
              backgroundSize: 'cover',
              backgroundPosition: `${workshop.headerImagePosition?.x ?? 50}% ${workshop.headerImagePosition?.y ?? 50}%`,
            }),
          }}
        >
          <div className="bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md text-white text-xs font-mono font-bold">
            {formatPrecio(workshop.precio)}
          </div>
        </div>

        <div className="p-5">
          <h2 className="font-display text-lg text-[#1A1611] leading-snug mb-0.5">{workshop.nombre}</h2>
          <p className="text-xs text-[#6B5F4C] font-mono mb-5 capitalize">
            {formatFecha(workshop.fecha)} · {formatHora(workshop.fecha)}
          </p>

          {mpStep === 'card' ? (
            <div>
              <div className="mb-4 p-3 bg-[#F2EDE3] border border-[#D2C4A8] rounded-xl flex items-start justify-between gap-3">
                <div className="text-xs text-[#6B5F4C] min-w-0">
                  <p className="font-medium text-[#2B241A] truncate">{nombres.join(', ')}</p>
                  <p className="truncate">{email}</p>
                  {cantidad > 1 && <p className="mt-0.5">{cantidad} cupos</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-lg text-[#1A1611] leading-tight">{formatPrecio(workshop.precio * cantidad)}</p>
                  {cantidad > 1 && (
                    <p className="text-[10px] text-[#9B9083] font-mono mt-0.5">{cantidad} × {formatPrecio(workshop.precio)}</p>
                  )}
                </div>
              </div>
              {loading === 'MERCADO_PAGO' ? (
                <div className="py-10 text-center text-sm text-[#6B5F4C]">Procesando pago…</div>
              ) : loadingPref || !preferenceId || !mpKey ? (
                <div className="py-10 text-center text-sm text-[#6B5F4C]">Cargando métodos de pago…</div>
              ) : (
                <Payment
                  initialization={{ amount: workshop.precio * cantidad, preferenceId }}
                  onSubmit={handleMPPayment}
                  onError={() => { setError('Error en el formulario de pago'); setMpStep(null); }}
                  customization={{
                    paymentMethods: {
                      creditCard: 'all',
                      debitCard:  'all',
                      minInstallments: 1,
                      maxInstallments: 1,
                    },
                  }}
                />
              )}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-3">{error}</p>
              )}
              <button
                type="button"
                onClick={() => { setMpStep(null); setError(''); }}
                className="w-full text-xs text-[#6B5F4C] hover:text-[#2B241A] text-center py-2 mt-2 transition-colors"
              >
                ← Volver
              </button>
            </div>
          ) : (
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
              {workshop.cuposDisponibles > 1 && (
                <div>
                  <label className={LABEL}>Cantidad de cupos</label>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => adjustCantidad(-1)} disabled={cantidad <= 1}
                      className="w-8 h-8 rounded-full border border-[#D2C4A8] flex items-center justify-center text-[#2B241A] hover:bg-[#F2EDE3] disabled:opacity-30 transition-colors text-lg font-bold select-none">−</button>
                    <span className="font-mono text-sm font-semibold text-[#2B241A] min-w-[2ch] text-center">{cantidad}</span>
                    <button type="button" onClick={() => adjustCantidad(1)} disabled={cantidad >= workshop.cuposDisponibles}
                      className="w-8 h-8 rounded-full border border-[#D2C4A8] flex items-center justify-center text-[#2B241A] hover:bg-[#F2EDE3] disabled:opacity-30 transition-colors text-lg font-bold select-none">+</button>
                    <span className="text-xs text-[#6B5F4C]">cupo{cantidad !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              )}
              {nombres.map((n, i) => (
                <div key={i}>
                  <label className={LABEL}>{cantidad > 1 ? `Participante ${i + 1} *` : 'Nombre completo *'}</label>
                  <input
                    type="text"
                    value={n}
                    onChange={e => updateNombre(i, e.target.value)}
                    placeholder={i === 0 ? 'Tu nombre' : 'Nombre del participante'}
                    autoFocus={i === 0}
                    className={INPUT}
                    style={{ '--tw-ring-color': brand.primary }}
                  />
                </div>
              ))}
              <div>
                <label className={LABEL}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="tu@email.com"
                  className={INPUT}
                  style={{ '--tw-ring-color': brand.primary }}
                />
              </div>
              <div>
                <label className={LABEL}>Teléfono *</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => { setTelefono(e.target.value); setError(''); }}
                  placeholder="+54 9 11 1234-5678"
                  className={INPUT}
                  style={{ '--tw-ring-color': brand.primary }}
                />
              </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
              {(() => {
                // Determine which methods to show based on workshop.metodosPago
                // If null/empty, show all available (backward compat)
                const mp = Array.isArray(workshop.metodosPago) && workshop.metodosPago.length > 0
                  ? workshop.metodosPago
                  : null; // null = show all

                const showEfectivo    = !mp || mp.includes('efectivo');
                const showMercadoPago = !mp || mp.includes('mercadopago');
                const linkIds         = mp ? mp.filter(id => id.startsWith('link-')) : [];

                // cobrosLinks comes from the espacio.cobros.links loaded by the page
                const links = cobrosLinks ?? [];

                return (
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex gap-2">
                      {showEfectivo && (
                        <button
                          type="button"
                          onClick={handleSubmitEfectivo}
                          disabled={!!loading}
                          className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F2EDE3] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {loading === 'EFECTIVO' ? 'Confirmando…' : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="2"/>
                                <circle cx="12" cy="12" r="2.5"/>
                                <path d="M6 12h.01M18 12h.01"/>
                              </svg>
                              Efectivo
                            </>
                          )}
                        </button>
                      )}
                      {showMercadoPago && tenantMpReady && mpKey && (
                        <button
                          type="button"
                          onClick={handleGoToMP}
                          disabled={!!loading}
                          className="flex-1 rounded-xl transition-opacity disabled:opacity-50 overflow-hidden"
                          style={{ backgroundColor: '#fee600', color: '#1B1464', height: '44px', padding: '4px 8px' }}
                        >
                          <img src={mpLogo} alt="Mercado Pago" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                        </button>
                      )}
                    </div>
                    {linkIds.map(linkId => {
                      const rawId = linkId.replace('link-', '');
                      const link = links.find(l => l.id === rawId);
                      if (!link) return null;
                      return (
                        <a
                          key={linkId}
                          href={/^https?:\/\//i.test(link.url) ? link.url : `https://${link.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F2EDE3] transition-colors flex items-center justify-center gap-2"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                          </svg>
                          {link.nombre}
                        </a>
                      );
                    })}
                  </div>
                );
              })()}
              <button type="button" onClick={onClose} className="text-xs text-[#6B5F4C] hover:text-[#2B241A] text-center py-1 transition-colors">
                Cancelar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ConfirmationView ──────────────────────────────────────────────────────────

function googleCalendarUrl(workshop) {
  const start = new Date(workshop.fecha);
  const durH  = workshop.duracionHoras   ?? 2;
  const durM  = workshop.duracionMinutos ?? 0;
  const end   = new Date(start.getTime() + durH * 3_600_000 + durM * 60_000);
  const fmt = d => {
    const y   = d.getFullYear();
    const mo  = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h   = String(d.getHours()).padStart(2, '0');
    const mi  = String(d.getMinutes()).padStart(2, '0');
    return `${y}${mo}${day}T${h}${mi}00`;
  };
  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    workshop.nombre,
    dates:   `${fmt(start)}/${fmt(end)}`,
    details: workshop.descripcion ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function ConfirmationView({ reservas, workshop, brand, onBack }) {
  const first  = reservas[0];
  const isMulti = reservas.length > 1;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={onBack} />
      <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl p-7 max-w-sm w-full text-center">
        {/* Check icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: brand.primary + '22' }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={brand.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 className="font-display text-xl text-[#1A1611] mb-1">{isMulti ? '¡Reservas confirmadas!' : '¡Reserva confirmada!'}</h2>
        <p className="text-sm text-[#6B5F4C] mb-5">Te esperamos en el taller</p>

        <div className="bg-[#F2EDE3] border border-[#D2C4A8] rounded-xl p-4 text-left mb-5">
          <p className="font-semibold text-sm text-[#1A1611] mb-1">{workshop.nombre}</p>
          <p className="text-xs font-mono text-[#6B5F4C] capitalize">{formatFecha(workshop.fecha)} · {formatHora(workshop.fecha)}</p>
          <div className="mt-3 pt-3 border-t border-[#D2C4A8]">
            {isMulti ? (
              <>
                <p className="text-xs font-semibold text-[#2B241A] mb-1.5">{reservas.length} cupos reservados</p>
                {reservas.map((r, i) => (
                  <p key={r.id} className="text-xs text-[#6B5F4C]">
                    Participante {i + 1}: <span className="font-semibold text-[#2B241A]">{r.nombre}</span>
                  </p>
                ))}
              </>
            ) : (
              <p className="text-xs text-[#6B5F4C]">A nombre de: <span className="font-semibold text-[#2B241A]">{first.nombre}</span></p>
            )}
            <p className="text-xs text-[#6B5F4C] mt-1">{first.email}</p>
            {first.telefono && <p className="text-xs text-[#6B5F4C]">{first.telefono}</p>}
            <p className="text-xs font-mono text-[#9B9083] mt-1.5">Código: #{first.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity mb-2"
          style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}
        >
          Ver más talleres
        </button>

        {workshop?.fecha && (
          <a
            href={googleCalendarUrl(workshop)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl text-sm font-medium border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F2EDE3] flex items-center justify-center gap-2 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Agregar a Google Calendar
          </a>
        )}
      </div>
    </div>
  );
}

// ── WorkshopCard ──────────────────────────────────────────────────────────────

function WorkshopCard({ w, brand, onReservar, bookedCount, direcciones }) {
  const isBooked   = bookedCount > 0;
  const slotStatus = getSlotStatus(w.cuposDisponibles, w.cuposTotales);
  const isAgotado  = w.cuposDisponibles === 0;
  const dir = direcciones?.find(d => d.id === w.direccionId);

  const headerBg  = w.headerType === 'COLOR' && w.headerValue ? w.headerValue : brand.primary;
  const headerImg = w.headerType === 'IMAGE' && w.headerValue ? w.headerValue : null;

  const cardOnLight = contrastText(brand.card) !== '#ffffff';
  const inkMain     = brand.textCard;
  const inkMuted    = cardOnLight ? 'rgba(43,36,26,0.55)' : 'rgba(255,255,255,0.60)';
  const borderColor = cardOnLight ? '#D2C4A8' : 'rgba(255,255,255,0.15)';
  const dividerColor = cardOnLight ? '#EDE8DE' : 'rgba(255,255,255,0.15)';

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
      style={{
        backgroundColor: brand.card,
        border: `1px solid ${borderColor}`,
        ...(isAgotado && !isBooked ? { opacity: 0.55, filter: 'grayscale(30%)' } : {}),
      }}
    >
      {/* Header */}
      <div
        className="relative h-36 shrink-0"
        style={{
          backgroundColor: headerBg,
          ...(headerImg && {
            backgroundImage: `url(${headerImg})`,
            backgroundSize: 'cover',
            backgroundPosition: `${w.headerImagePosition?.x ?? 50}% ${w.headerImagePosition?.y ?? 50}%`,
          }),
        }}
      >
        <div
          className="absolute top-3 left-3 px-3 py-1.5 rounded-lg font-mono font-bold text-sm text-white shadow-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(4px)' }}
        >
          {formatPrecio(w.precio)}
        </div>
        <div className="absolute top-3 right-3">
          <PublicSlotBadge status={slotStatus} />
        </div>
        {isBooked && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold text-white shadow-sm" style={{ backgroundColor: 'rgba(5,150,105,0.85)', backdropFilter: 'blur(4px)' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {bookedCount === 1 ? 'Ya reservaste' : `${bookedCount} cupos`}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-base leading-snug" style={{ color: inkMain }}>{w.nombre}</h3>
        <p className="text-xs font-mono capitalize" style={{ color: inkMuted }}>
          {formatFecha(w.fecha)} · {formatHora(w.fecha)}
        </p>
        {w.descripcion && (
          <p className="text-xs leading-relaxed mt-0.5" style={{ color: inkMuted }}>
            {w.descripcion.length > 90 ? w.descripcion.slice(0, 90).trimEnd() + '…' : w.descripcion}
          </p>
        )}
        {w.experienciaPrevia === true && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 rounded-full px-2.5 py-0.5 self-start">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Se requiere experiencia previa
          </span>
        )}
        {w.experienciaPrevia === false && (
          <span className="inline-flex items-center gap-1 text-xs text-[#059669] bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 self-start">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            No se requiere experiencia previa
          </span>
        )}

        <div className="mt-auto pt-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${dividerColor}` }}>
          {dir && (
            <p className="text-xs flex items-center gap-1" style={{ color: inkMuted }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {dir.calle} {dir.altura}{dir.piso ? `, Piso ${dir.piso}` : ''}{dir.apto ? `, Apto ${dir.apto}` : ''} — {dir.barrio}
            </p>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => !isAgotado && onReservar(w)}
              disabled={isAgotado}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 hover:brightness-110 hover:scale-[1.03] active:scale-95 shadow-sm"
              style={{
                backgroundColor: isAgotado ? '#D2C4A8' : brand.button,
                color: isAgotado ? '#6B5F4C' : contrastText(brand.button),
              }}
            >
              {isAgotado ? 'Agotado' : isBooked ? 'Reservar más' : 'Reservar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EspacioPublico ────────────────────────────────────────────────────────────

export default function EspacioPublico() {
  const { espacioId } = useParams();
  const [espacio,   setEspacio]   = useState(null);
  const [workshops, setWorkshops] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [notFound,  setNotFound]  = useState(false);
  const [booking,        setBooking]        = useState(null);
  const [confirmed,      setConfirmed]      = useState(null);
  const [bookedCounts,   setBookedCounts]   = useState({}); // workshopId → count
  const [currentUser,    setCurrentUser]    = useState(undefined); // undefined = loading, null = guest
  const [showAuth,       setShowAuth]       = useState(false);
  const [pendingWorkshop, setPendingWorkshop] = useState(null);
  const [userReservas,   setUserReservas]   = useState([]);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [showMisDatos,   setShowMisDatos]   = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [esp, ws] = await Promise.all([
          espaciosApi.get(espacioId),
          workshopsApi.list(espacioId, { estado: 'PUBLICADO' }),
        ]);
        if (!esp) { setNotFound(true); return; }
        setEspacio(esp);
        setWorkshops(ws);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [espacioId]);

  useEffect(() => {
    checkRedirectResult().then(result => {
      if (result) handleAuthSuccess(result);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    return subscribeAuth((user, profile) => {
      if (!user) { setCurrentUser(null); setUserReservas([]); setBookedCounts({}); return; }
      setCurrentUser({ user, profile: profile ?? {} });
      loadUserReservas(user.email ?? profile?.email ?? '');
    });
  }, []);

  async function loadUserReservas(email) {
    if (!email) return;
    try {
      const list = await reservasApi.listByEmail(email);
      const wsIds = [...new Set(list.map(r => r.workshopId))];
      const wsMap = {};
      await Promise.all(wsIds.map(async id => {
        const ws = await workshopsApi.get(id);
        if (ws) wsMap[id] = ws;
      }));
      setUserReservas(list.map(r => ({ ...r, workshop: wsMap[r.workshopId] ?? null })));
      const counts = {};
      list.filter(r => r.estado !== 'CANCELADA').forEach(r => {
        counts[r.workshopId] = (counts[r.workshopId] ?? 0) + 1;
      });
      setBookedCounts(counts);
    } catch { /* silencioso */ }
  }

  async function handleCancelReserva(reservaId) {
    await reservasApi.cancel(reservaId);
    setUserReservas(prev => prev.map(r => r.id === reservaId ? { ...r, estado: 'CANCELADA' } : r));
    setWorkshops(prev => {
      const res = userReservas.find(r => r.id === reservaId);
      if (!res) return prev;
      return prev.map(w => w.id === res.workshopId ? { ...w, cuposDisponibles: (w.cuposDisponibles ?? 0) + 1 } : w);
    });
    setBookedCounts(prev => {
      const res = userReservas.find(r => r.id === reservaId);
      if (!res) return prev;
      const curr = prev[res.workshopId] ?? 0;
      return { ...prev, [res.workshopId]: Math.max(0, curr - 1) };
    });
  }

  function handleReservar(w) {
    if (currentUser === null) {
      setPendingWorkshop(w);
      setShowAuth(true);
    } else if (currentUser) {
      setBooking(w);
    }
  }

  function handleAuthSuccess({ user, profile }) {
    setCurrentUser({ user, profile: profile ?? {} });
    setShowAuth(false);
    loadUserReservas(user.email ?? profile?.email ?? '');
    if (pendingWorkshop) {
      setBooking(pendingWorkshop);
      setPendingWorkshop(null);
    }
  }

  function handleLogout() {
    logout();
    setCurrentUser(null);
    setUserReservas([]);
    setBookedCounts({});
  }

  function handleConfirm(reservas) {
    const count = reservas.length;
    setWorkshops(prev =>
      prev.map(w => w.id === booking.id ? { ...w, cuposDisponibles: Math.max(0, w.cuposDisponibles - count) } : w)
    );
    setBookedCounts(prev => ({ ...prev, [booking.id]: (prev[booking.id] ?? 0) + count }));
    if (currentUser) loadUserReservas(currentUser.user.email ?? currentUser.profile?.email ?? '');
    setConfirmed({ reservas, workshop: booking });
    setBooking(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E85D4A] border-t-transparent animate-spin" />
          <p className="text-sm text-[#6B5F4C]">Cargando…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center text-center px-4">
        <div>
          <p className="font-display text-2xl text-[#1A1611] mb-2">Espacio no encontrado</p>
          <p className="text-sm text-[#6B5F4C] mb-6">El link puede estar desactualizado o el espacio no existe.</p>
          <Link to="/" className="text-sm text-[#E85D4A] hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const brand       = parseBrand(espacio);
  const headerText  = contrastText(brand.primary);
  const upcoming = [...workshops].sort((a, b) => {
    const da = a.fecha ? new Date(a.fecha).getTime() : Infinity;
    const db = b.fecha ? new Date(b.fecha).getTime() : Infinity;
    return da - db;
  });

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: brand.bg }}>
      {/* Modals */}
      {showAuth && <AuthModal brand={brand} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />}
      {booking && (
        <BookingModal
          workshop={booking}
          brand={brand}
          tenantId={espacioId}
          cobrosLinks={espacio?.cobros?.links ?? []}
          prefill={currentUser ? { nombre: currentUser.profile?.nombre ?? '', email: currentUser.user?.email ?? '', telefono: currentUser.profile?.telefono ?? '' } : undefined}
          onConfirm={handleConfirm}
          onClose={() => setBooking(null)}
        />
      )}
      {confirmed && (
        <ConfirmationView
          reservas={confirmed.reservas}
          workshop={confirmed.workshop}
          brand={brand}
          onBack={() => setConfirmed(null)}
        />
      )}

      {/* Hamburger menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE8DE]">
              <span className="font-semibold text-sm text-[#1A1611]">Menú</span>
              <button onClick={() => setMenuOpen(false)} className="p-1 rounded-md hover:bg-[#FAF7F2] text-[#6B5F4C] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-3">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById('mis-reservas-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#2B241A] hover:bg-[#FAF7F2] transition-colors w-full text-left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Mis reservas
              </button>
              <button
                onClick={() => { setMenuOpen(false); setShowMisDatos(true); }}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#2B241A] hover:bg-[#FAF7F2] transition-colors w-full text-left"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                Mis datos
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="w-full pt-4 pb-10 px-4" style={{ backgroundColor: brand.primary }}>
        {/* Nav usuario */}
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: headerText }}
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {currentUser === undefined ? <div /> : currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium drop-shadow" style={{ color: headerText, opacity: 0.9 }}>
                Hola, {currentUser.profile?.nombre?.split(' ')[0] ?? 'tú'}
              </span>
              <button onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                style={{ color: headerText }}>
                Salir
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
              style={{ color: headerText }}>
              Ingresar
            </button>
          )}
        </div>
        <div className="max-w-2xl mx-auto text-center">
          {espacio.logoUrl ? (
            <div className={`w-20 h-20 mx-auto mb-5 overflow-hidden shadow-lg shrink-0 ${
              espacio.logoShape === 'round'   ? 'rounded-full border-2 border-white/30' :
              espacio.logoShape === 'square'  ? 'rounded-none' :
                                                'rounded-2xl border-2 border-white/30'
            }`}>
              <img
                src={espacio.logoUrl}
                alt={espacio.nombre}
                className="w-full h-full object-contain"
                style={{ transform: `scale(${espacio.logoScale ?? 1})`, transformOrigin: 'center' }}
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-3xl font-bold border-2 border-white/25 shadow-lg"
              style={{ backgroundColor: 'rgba(0,0,0,0.22)', color: headerText }}
            >
              {espacio.nombre?.[0]?.toUpperCase()}
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1" style={{ color: headerText }}>
            {espacio.nombre}
          </h1>
          {(espacio.rubroPersonalizado || espacio.rubro?.nombre) && (
            <p className="text-sm mt-1" style={{ color: headerText, opacity: 0.75 }}>
              {espacio.rubro?.nombre ?? espacio.rubroPersonalizado}
            </p>
          )}
        </div>
      </div>

      {/* Workshops */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        {upcoming.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6B5F4C]">No hay talleres disponibles en este momento.</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-xl text-[#1A1611] mb-5">Talleres disponibles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcoming.map(w => (
                <WorkshopCard key={w.id} w={w} brand={brand} onReservar={handleReservar} bookedCount={bookedCounts[w.id] ?? 0} direcciones={espacio.direcciones ?? []} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mis reservas */}
      {currentUser && userReservas.length > 0 && (
        <div id="mis-reservas-section" className="max-w-2xl mx-auto px-4 pb-10">
          <h2 className="font-display text-xl text-[#1A1611] mb-4">Mis reservas</h2>
          <div className="flex flex-col gap-3">
            {userReservas.map(r => {
              const ws    = r.workshop;
              const hBg   = ws?.headerType === 'COLOR' && ws?.headerValue ? ws.headerValue : brand.primary;
              const isCancelada = r.estado === 'CANCELADA';
              return (
                <div key={r.id} className="rounded-xl overflow-hidden border border-[#D2C4A8] bg-[#FAF8F4] flex">
                  <div className="w-2 shrink-0" style={{ backgroundColor: hBg }} />
                  <div className="flex-1 px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1611] leading-snug">{ws?.nombre ?? '—'}</p>
                      {ws?.fecha && (
                        <p className="text-xs font-mono text-[#6B5F4C] mt-0.5 capitalize">
                          {formatFecha(ws.fecha)} · {formatHora(ws.fecha)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isCancelada ? 'bg-[#F2EDE3] text-[#9B9083]' : 'bg-emerald-100 text-emerald-700'}`}>
                        {isCancelada ? 'Cancelada' : 'Confirmada'}
                      </span>
                      {!isCancelada && (
                        <button
                          onClick={() => handleCancelReserva(r.id)}
                          className="text-xs text-[#9B9083] hover:text-red-500 transition-colors border border-[#D2C4A8] rounded-lg px-2.5 py-1 hover:border-red-300">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      {(() => {
        const footerText = contrastText(brand.primary) === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
        const footerStrong = contrastText(brand.primary);
        return (
          <div
            className="fixed bottom-0 left-0 right-0 z-40 py-4 text-sm flex flex-col items-center gap-2"
            style={{
              backgroundColor: brand.primary,
              color: footerText,
            }}
          >
            <SocialIconsRow redesSociales={espacio.redesSociales} size={22} />
            <span>
              Obtén tu propio espacio{' '}
              <a
                href="/"
                className="font-semibold underline underline-offset-2 hover:opacity-100 transition-opacity"
                style={{ color: footerStrong }}
              >
                Antológico
              </a>
            </span>
          </div>
        );
      })()}

      {/* Modal Mis datos */}
      {showMisDatos && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE8DF]">
              <h2 className="font-display text-lg text-[#1A1611]">Mis datos</h2>
              <button
                onClick={() => setShowMisDatos(false)}
                className="text-[#9B9083] hover:text-[#2B241A] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Contenido */}
            <div className="px-5 py-5 flex flex-col gap-4">
              {/* Avatar / inicial */}
              <div className="flex items-center gap-3">
                {currentUser.profile?.photoURL ? (
                  <img src={currentUser.profile.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                    style={{ backgroundColor: brand.primary }}
                  >
                    {(currentUser.profile?.nombre || currentUser.user?.email || '?')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-[#1A1611] text-sm truncate">
                    {currentUser.profile?.nombre || '—'}
                  </p>
                  <p className="text-xs text-[#9B9083] truncate">{currentUser.user?.email}</p>
                </div>
              </div>

              {/* Campos */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex flex-col gap-0.5 p-3 bg-[#FAF8F4] rounded-xl">
                  <span className="text-[10px] font-medium text-[#9B9083] uppercase tracking-wide">Nombre</span>
                  <span className="text-[#2B241A]">{currentUser.profile?.nombre || '—'}</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 bg-[#FAF8F4] rounded-xl">
                  <span className="text-[10px] font-medium text-[#9B9083] uppercase tracking-wide">Email</span>
                  <span className="text-[#2B241A] break-all">{currentUser.user?.email}</span>
                </div>
                {currentUser.profile?.telefono && (
                  <div className="flex flex-col gap-0.5 p-3 bg-[#FAF8F4] rounded-xl">
                    <span className="text-[10px] font-medium text-[#9B9083] uppercase tracking-wide">Teléfono</span>
                    <span className="text-[#2B241A]">{currentUser.profile.telefono}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => { logout(); setShowMisDatos(false); }}
                className="w-full py-2.5 border border-[#E0D8CC] text-sm font-medium text-[#6B5F4C] rounded-xl hover:bg-[#FAF8F4] transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
