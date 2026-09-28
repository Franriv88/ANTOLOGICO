import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { espacios as espaciosApi, workshops as workshopsApi, reservas as reservasApi } from '../services/api';
import { getSlotStatus } from '../lib/slotStatus';
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
  const card     = roles.card     || '#ffffff';
  const textCard = roles.textCard || (contrastText(card) === '#ffffff' ? '#f0f0f0' : '#2B241A');
  return { primary, button, card, textCard };
}

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#1A1611' : '#ffffff';
}

// ── BookingModal ──────────────────────────────────────────────────────────────

function BookingModal({ workshop, brand, onConfirm, onClose }) {
  const [nombre,   setNombre]   = useState('');
  const [email,    setEmail]    = useState('');
  const [telefono, setTelefono] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const INPUT = 'w-full px-3 py-2 bg-white border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] focus:outline-none focus:ring-2 focus:ring-offset-1';
  const LABEL = 'block text-xs font-medium text-[#6B5F4C] mb-1';

  const headerBg  = workshop.headerType === 'COLOR' && workshop.headerValue ? workshop.headerValue : brand.primary;
  const headerImg = workshop.headerType === 'IMAGE' && workshop.headerValue ? workshop.headerValue : null;

  async function handleSubmit(metodoPago) {
    if (!nombre.trim())                        { setError('El nombre es requerido'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Email inválido'); return; }
    if (!telefono.trim())                      { setError('El teléfono es requerido'); return; }
    setLoading(metodoPago);
    setError('');
    try {
      const reserva = await reservasApi.create(workshop.id, {
        nombre:   nombre.trim(),
        email:    email.trim(),
        telefono: telefono.trim(),
        metodoPago,
      });
      onConfirm(reserva);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Mini header del taller */}
        <div
          className="h-24 relative flex items-end p-4"
          style={{
            backgroundColor: headerBg,
            ...(headerImg && { backgroundImage: `url(${headerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }),
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

          <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-3">
            <div>
              <label className={LABEL}>Nombre completo *</label>
              <input
                type="text"
                value={nombre}
                onChange={e => { setNombre(e.target.value); setError(''); }}
                placeholder="Tu nombre"
                autoFocus
                className={INPUT}
                style={{ '--tw-ring-color': brand.primary }}
              />
            </div>
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
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => handleSubmit('EFECTIVO')}
                disabled={!!loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-[#D2C4A8] text-[#2B241A] hover:bg-[#F2EDE3] transition-colors disabled:opacity-50"
              >
                {loading === 'EFECTIVO' ? 'Confirmando…' : 'Efectivo'}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('MERCADO_PAGO')}
                disabled={!!loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}
              >
                {loading === 'MERCADO_PAGO' ? 'Confirmando…' : 'Mercado Pago'}
              </button>
            </div>
            <button type="button" onClick={onClose} className="text-xs text-[#6B5F4C] hover:text-[#2B241A] text-center py-1 transition-colors">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── ConfirmationView ──────────────────────────────────────────────────────────

function ConfirmationView({ reserva, workshop, brand, onBack }) {
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

        <h2 className="font-display text-xl text-[#1A1611] mb-1">¡Reserva confirmada!</h2>
        <p className="text-sm text-[#6B5F4C] mb-5">Te esperamos en el taller</p>

        <div className="bg-[#F2EDE3] border border-[#D2C4A8] rounded-xl p-4 text-left mb-5">
          <p className="font-semibold text-sm text-[#1A1611] mb-1">{workshop.nombre}</p>
          <p className="text-xs font-mono text-[#6B5F4C] capitalize">{formatFecha(workshop.fecha)} · {formatHora(workshop.fecha)}</p>
          <div className="mt-3 pt-3 border-t border-[#D2C4A8]">
            <p className="text-xs text-[#6B5F4C]">A nombre de: <span className="font-semibold text-[#2B241A]">{reserva.nombre}</span></p>
            <p className="text-xs text-[#6B5F4C]">{reserva.email}</p>
            {reserva.telefono && <p className="text-xs text-[#6B5F4C]">{reserva.telefono}</p>}
            <p className="text-xs font-mono text-[#9B9083] mt-1.5">Código: #{reserva.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
          style={{ backgroundColor: brand.button, color: contrastText(brand.button) }}
        >
          Ver más talleres
        </button>
      </div>
    </div>
  );
}

// ── WorkshopCard ──────────────────────────────────────────────────────────────

function WorkshopCard({ w, brand, onReservar, isBooked }) {
  const slotStatus = getSlotStatus(w.cuposDisponibles, w.cuposTotales);
  const isAgotado  = w.cuposDisponibles === 0;

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
      style={{ backgroundColor: brand.card, border: `1px solid ${borderColor}` }}
    >
      {/* Header */}
      <div
        className="relative h-36 shrink-0"
        style={{
          backgroundColor: headerBg,
          ...(headerImg && { backgroundImage: `url(${headerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }),
        }}
      >
        {!isBooked && (
          <div
            className="absolute top-3 left-3 px-3 py-1.5 rounded-lg font-mono font-bold text-sm text-white shadow-md"
            style={{ backgroundColor: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(4px)' }}
          >
            {formatPrecio(w.precio)}
          </div>
        )}
        {!isBooked && (
          <div className="absolute top-3 right-3">
            <PublicSlotBadge status={slotStatus} />
          </div>
        )}
        {isBooked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ backgroundColor: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(2px)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-white text-sm font-bold tracking-wide drop-shadow">¡Ya tenés tu lugar!</p>
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

        <div className="mt-auto pt-3 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${dividerColor}` }}>
          <span className="text-xs font-mono shrink-0" style={{ color: inkMuted }}>
            {isBooked ? 'Reservado' : isAgotado ? 'Sin cupos' : `${w.cuposDisponibles} cupo${w.cuposDisponibles !== 1 ? 's' : ''}`}
          </span>
          {isBooked ? (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shrink-0 bg-emerald-100 text-emerald-700 border border-emerald-200">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Reservaste
            </span>
          ) : (
            <button
              onClick={() => !isAgotado && onReservar(w)}
              disabled={isAgotado}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 hover:brightness-110 hover:scale-[1.03] active:scale-95 shadow-sm"
              style={{
                backgroundColor: isAgotado ? '#D2C4A8' : brand.button,
                color: isAgotado ? '#6B5F4C' : contrastText(brand.button),
              }}
            >
              {isAgotado ? 'Agotado' : 'Reservar'}
            </button>
          )}
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
  const [booking,   setBooking]   = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [bookedIds, setBookedIds] = useState([]);

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

  function handleConfirm(reserva) {
    setWorkshops(prev =>
      prev.map(w => w.id === booking.id ? { ...w, cuposDisponibles: Math.max(0, w.cuposDisponibles - 1) } : w)
    );
    setBookedIds(prev => [...prev, booking.id]);
    setConfirmed({ reserva, workshop: booking });
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
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Modals */}
      {booking && (
        <BookingModal
          workshop={booking}
          brand={brand}
          onConfirm={handleConfirm}
          onClose={() => setBooking(null)}
        />
      )}
      {confirmed && (
        <ConfirmationView
          reserva={confirmed.reserva}
          workshop={confirmed.workshop}
          brand={brand}
          onBack={() => setConfirmed(null)}
        />
      )}

      {/* Hero */}
      <div className="w-full pt-12 pb-10 px-4" style={{ backgroundColor: brand.primary }}>
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
                <WorkshopCard key={w.id} w={w} brand={brand} onReservar={setBooking} isBooked={bookedIds.includes(w.id)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-xs text-[#9B9083] border-t border-[#EDE8DE]">
        Powered by <span className="font-semibold">Antológico</span>
      </div>
    </div>
  );
}
