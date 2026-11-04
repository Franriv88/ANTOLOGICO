import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import Layout from '../components/Layout';
import SlotBadge from '../components/SlotBadge';
import { workshops as api } from '../services/api';
import { getSlotStatus } from '../lib/slotStatus';
import { useEspacio } from '../context/EspacioContext';
import { TIPO_CONFIG, formatDuracion } from '../lib/tipoWorkshop';
import { functions } from '../lib/firebase';
import useRealtimeQuery from '../hooks/useRealtimeQuery';
import { listMyWorkshopsRef, listMyWorkshopsByEstadoRef } from '../dataconnect-generated';

const ESTADOS = ['', 'BORRADOR', 'PUBLICADO', 'CANCELADO', 'FINALIZADO'];
const ESTADO_LABEL = {
  '': 'Todos',
  BORRADOR: 'Ocultos / Borradores',
  PUBLICADO: 'Publicado',
  CANCELADO: 'Cancelado',
  FINALIZADO: 'Finalizado',
};

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatHora(iso) {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
  });
}

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.toLocaleString('es-AR', { month: 'short' }).replace('.', '').toUpperCase();
  return `${d.getDate()} ${month}`;
}

function formatScheduleDates(dates) {
  if (!dates?.length) return null;
  const byMonth = {};
  dates.forEach(d => {
    const dt = new Date(d + 'T12:00:00');
    const month = dt.toLocaleString('es-AR', { month: 'short' })
      .replace('.', '')
      .replace(/^\w/, c => c.toUpperCase());
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(dt.getDate());
  });
  return Object.entries(byMonth)
    .map(([month, days]) => `${days.join(', ')} ${month}`)
    .join(' · ');
}

function ScheduleChip({ w }) {
  const sd = w.scheduleData;
  if (!sd?.mode) return null;

  if (sd.mode === 'WEEKLY') {
    const freq = sd.frequency === 'QUINCENAL' ? 'Quincenal' : 'Semanal';
    const start = w.fecha ? formatShortDate(new Date(w.fecha).toISOString().slice(0, 10)) : '';
    const end = sd.endDate ? formatShortDate(sd.endDate) : null;
    return (
      <p className="text-xs text-primary/80 font-mono">
        {freq} · Inicio: {start}{end ? ` → ${end}` : ''}
      </p>
    );
  }

  if (sd.mode === 'SPECIFIC_DATES' && sd.dates?.length > 0) {
    const text = formatScheduleDates(sd.dates);
    return (
      <p className="text-xs text-primary/80 font-mono leading-relaxed">
        Días: {text}
      </p>
    );
  }

  return null;
}

function ConfirmModal({ title, message, confirmLabel = 'Confirmar', confirmClass = 'bg-danger text-white hover:bg-danger/90', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div className="relative bg-surface-100 border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full">
        {title && (
          <h2 className="font-display text-lg text-ink mb-2">{title}</h2>
        )}
        <p className="text-sm text-ink-muted">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors border border-border"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const IconPencil = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconPerson = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

const IconPersonGroup = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

function parseBrand(espacio) {
  const bc = espacio?.brandColors;
  const palette = Array.isArray(bc) ? bc : (bc?.palette ?? []);
  const roles   = (!bc || Array.isArray(bc)) ? {} : (bc.roles ?? {});
  const primary     = roles.primary     || palette[0] || '#E85D4A';
  const button      = roles.button      || primary;
  const textHeading = roles.textHeading || null;
  const textCard    = roles.textCard    || null;
  const fontKey     = espacio?.brandFont ?? '';
  const [displayFont, bodyFont] = fontKey.split('|');
  return { primary, button, textHeading, textCard, displayFont, bodyFont };
}

function contrastText(hex) {
  if (!hex?.startsWith('#') || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.5 ? '#1A1611' : '#ffffff';
}

export default function Workshops() {
  const { activeEspacio } = useEspacio();
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [estado, setEstado] = useState('');
  const [q, setQ] = useState('');
  const [confirm, setConfirm] = useState(null); // { action, id, nombre, reservas? }
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSummary, setCancelSummary] = useState(null); // { workshopName, sent, reservas }
  const navigate = useNavigate();
  const location = useLocation();
  const brand = parseBrand(activeEspacio);

  const espacioId = activeEspacio?.id;
  const useEstado = estado && !q;
  const useDefault = !estado && !q;

  const defaultQuery = useRealtimeQuery(
    listMyWorkshopsRef,
    { espacioId },
    !!espacioId && useDefault,
  );
  const estadoQuery = useRealtimeQuery(
    listMyWorkshopsByEstadoRef,
    { espacioId, estado },
    !!espacioId && useEstado,
  );

  const rtData = useDefault ? defaultQuery : useEstado ? estadoQuery : null;
  const loading = rtData ? rtData.loading : false;
  const error = rtData?.error?.message || '';

  useEffect(() => {
    if (rtData?.data?.workshops) setItems(rtData.data.workshops);
  }, [rtData?.data]);

  useEffect(() => {
    if (!q || !espacioId) { setSearchResults(null); return; }
    let cancelled = false;
    api.list(espacioId, { q }).then(data => { if (!cancelled) setSearchResults(data); });
    return () => { cancelled = true; };
  }, [q, espacioId]);

  // Inject brand fonts if needed
  useEffect(() => {
    if (!brand.displayFont && !brand.bodyFont) return;
    if (document.querySelector('#gf-workshops')) return;
    const families = [brand.displayFont, brand.bodyFont].filter(Boolean)
      .map(f => `family=${f.replace(/ /g,'+')}:wght@400;600;700`)
      .join('&');
    const link = document.createElement('link');
    link.id = 'gf-workshops';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    document.head.appendChild(link);
  }, [brand.displayFont, brand.bodyFont]);

  async function handleDeleteRequest(id, nombre) {
    try {
      const reservas = await api.listReservas(id);
      const activas = reservas.filter(r => r.estado !== 'CANCELADA');
      if (activas.length > 0) {
        setConfirm({ action: 'block-delete', id, nombre, reservas: activas });
        return;
      }
    } catch (_) {}
    setConfirm({ action: 'delete', id, nombre });
  }

  async function handleCancelRequest(id, nombre) {
    setCancelLoading(true);
    try {
      const reservas = await api.listReservas(id);
      const activas = reservas.filter(r => r.estado !== 'CANCELADA');
      setConfirm({ action: 'cancel', id, nombre, reservas: activas });
    } catch (e) {
      setConfirm({ action: 'cancel', id, nombre, reservas: [] });
    } finally {
      setCancelLoading(false);
    }
  }

  async function handleConfirm() {
    const { action, id, nombre, reservas: affectedReservas } = confirm;
    setConfirm(null);
    if (action === 'delete') {
      try {
        await api.remove(id, activeEspacio.id);
        setItems(prev => prev.filter(w => w.id !== id));
      } catch (e) {
        alert(e.message);
      }
    } else if (action === 'cancel') {
      setCancelLoading(true);
      try {
        await api.cancelWithReservas(id, activeEspacio.id);
        setItems(prev => prev.map(item =>
          item.id === id ? { ...item, estado: 'CANCELADO' } : item
        ));

        let sent = 0;
        if (affectedReservas?.length) {
          const w = items.find(x => x.id === id);
          const workshopDate = w?.fecha
            ? new Date(w.fecha).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : '';
          try {
            const { data } = await httpsCallable(functions, 'notifyWorkshopCancelled')({
              workshopName: nombre,
              espacioName: activeEspacio.nombre,
              workshopDate,
              reservas: affectedReservas.map(r => ({
                email: r.usuario?.email,
                nombre: r.usuario?.nombre,
                metodoPago: r.metodoPago,
                estadoPago: r.estadoPago,
              })),
            });
            sent = data.sent || 0;
          } catch (e) {
            console.error('Notification error:', e);
          }
        }

        setCancelSummary({
          workshopName: nombre,
          sent,
          reservas: affectedReservas || [],
        });
      } catch (e) {
        alert(e.message);
      } finally {
        setCancelLoading(false);
      }
    }
  }

  async function handleQuickStatus(w, action) {
    let newEstado = w.estado;
    let newCupos = w.cuposDisponibles;
    const isAgotado = w.cuposDisponibles === 0 && w.estado === 'PUBLICADO';

    if (action === 'agotar') {
      newEstado = 'PUBLICADO';
      newCupos = isAgotado ? w.cuposTotales : 0;
    } else if (action === 'ocultar') {
      newEstado = 'BORRADOR';
    } else if (action === 'mostrar') {
      newEstado = 'PUBLICADO';
      newCupos = w.cuposDisponibles === 0 ? w.cuposTotales : w.cuposDisponibles;
    } else if (action === 'cancelar') {
      newEstado = 'CANCELADO';
    }

    // Optimistic update
    setItems(prev => prev.map(item =>
      item.id === w.id ? { ...item, estado: newEstado, cuposDisponibles: newCupos } : item
    ));

    try {
      await api.quickStatus(w.id, activeEspacio.id, newEstado, newCupos);
    } catch (e) {
      // Revert on error
      setItems(prev => prev.map(item => item.id === w.id ? w : item));
      alert(e.message);
    }
  }

  const sourceItems = q && searchResults ? searchResults : items;
  const displayItems = [...sourceItems].sort((a, b) => {
    const aDraft = a.esBorrador ? 0 : 1;
    const bDraft = b.esBorrador ? 0 : 1;
    if (aDraft !== bDraft) return aDraft - bDraft;
    const da = a.fecha ? new Date(a.fecha).getTime() : Infinity;
    const db = b.fecha ? new Date(b.fecha).getTime() : Infinity;
    return da - db;
  });

  return (
    <Layout>
      {confirm && confirm.action === 'delete' && (
        <ConfirmModal
          title="Eliminar taller"
          message={`¿Eliminar "${confirm.nombre}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          confirmClass="bg-danger text-white hover:bg-danger/90"
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {confirm && confirm.action === 'block-delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
          <div className="relative bg-surface-100 border border-border rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="font-display text-lg text-ink mb-2">No se puede eliminar</h2>
            <p className="text-sm text-ink-muted mb-3">
              El taller &quot;{confirm.nombre}&quot; tiene {confirm.reservas.length} reserva{confirm.reservas.length > 1 ? 's' : ''} activa{confirm.reservas.length > 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-ink-muted mb-6">
              Primero deberás <strong>cancelar el taller</strong> y gestionar las devoluciones antes de poder eliminarlo.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors border border-border"
              >
                Entendido
              </button>
              <button
                onClick={() => {
                  const { id, nombre } = confirm;
                  setConfirm(null);
                  handleCancelRequest(id, nombre);
                }}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-ink text-white hover:bg-ink/80"
              >
                Cancelar taller
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && confirm.action === 'cancel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirm(null)} />
          <div className="relative bg-surface-100 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-display text-lg text-ink mb-2">Cancelar taller</h2>
            <p className="text-sm text-ink-muted mb-4">
              ¿Cancelar &quot;{confirm.nombre}&quot;? El taller quedará marcado como cancelado.
            </p>

            {confirm.reservas?.length > 0 && (
              <div className="border border-border rounded-lg p-3 mb-4 bg-surface-50">
                <p className="text-xs font-semibold text-ink mb-2">
                  {confirm.reservas.length} reserva{confirm.reservas.length > 1 ? 's' : ''} activa{confirm.reservas.length > 1 ? 's' : ''} serán canceladas:
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {confirm.reservas.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-ink truncate mr-2">{r.usuario?.nombre || r.usuario?.email}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          r.estadoPago === 'PAGADO' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.estadoPago === 'PAGADO' ? 'Pagado' : 'Pendiente'}
                        </span>
                        <span className="text-ink-muted text-[10px]">
                          {r.metodoPago === 'MERCADO_PAGO' ? 'MP' : 'Efvo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {confirm.reservas.some(r => r.estadoPago === 'PAGADO') && (
                  <p className="text-[11px] text-amber-700 mt-2 leading-snug">
                    Hay reservas pagas. Se notificará a los usuarios y podrás gestionar las devoluciones.
                  </p>
                )}
              </div>
            )}

            {confirm.reservas?.length === 0 && (
              <p className="text-xs text-ink-muted mb-4">No hay reservas activas para este taller.</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors border border-border"
              >
                Volver
              </button>
              <button
                onClick={handleConfirm}
                disabled={cancelLoading}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-ink text-white hover:bg-ink/80 disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelando...' : 'Cancelar taller'}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCancelSummary(null)} />
          <div className="relative bg-surface-100 border border-border rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="font-display text-lg text-ink mb-2">Taller cancelado</h2>
            <p className="text-sm text-ink-muted mb-4">
              &quot;{cancelSummary.workshopName}&quot; fue cancelado exitosamente.
            </p>

            {cancelSummary.reservas.length > 0 && (
              <div className="border border-border rounded-lg p-3 mb-4 bg-surface-50">
                <p className="text-xs font-semibold text-ink mb-1">
                  {cancelSummary.reservas.length} reserva{cancelSummary.reservas.length > 1 ? 's' : ''} cancelada{cancelSummary.reservas.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-ink-muted mb-3">
                  {cancelSummary.sent > 0
                    ? `Se envió notificación por email a ${cancelSummary.sent} usuario${cancelSummary.sent > 1 ? 's' : ''}.`
                    : 'No se pudieron enviar notificaciones por email.'}
                </p>

                {cancelSummary.reservas.some(r => r.estadoPago === 'PAGADO') && (
                  <>
                    <p className="text-xs font-semibold text-ink mb-1.5">Devoluciones pendientes:</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {cancelSummary.reservas.filter(r => r.estadoPago === 'PAGADO').map(r => (
                        <div key={r.id} className="flex items-center justify-between text-xs bg-white rounded p-2 border border-border">
                          <div className="truncate mr-2">
                            <span className="font-medium text-ink">{r.usuario?.nombre}</span>
                            <span className="text-ink-muted ml-1">({r.usuario?.email})</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                            r.metodoPago === 'MERCADO_PAGO' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {r.metodoPago === 'MERCADO_PAGO' ? 'Mercado Pago' : 'Efectivo'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-amber-700 mt-2 leading-snug">
                      Recordá gestionar las devoluciones desde la sección de Reservas o contactando a cada usuario.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setCancelSummary(null)}
                className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-ink text-white hover:bg-ink/80"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelLoading && !confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-surface-100 border border-border rounded-xl shadow-2xl px-8 py-6">
            <p className="text-sm text-ink font-medium">Cancelando taller y notificando usuarios...</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-ink">Talleres</h1>
          <Link
            to="/workshops/nuevo"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
          >
            + Nuevo taller
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
            className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <select
            value={estado}
            onChange={e => setEstado(e.target.value)}
            className="px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary"
          >
            {ESTADOS.map(s => (
              <option key={s} value={s}>{ESTADO_LABEL[s]}</option>
            ))}
          </select>
        </div>

        {loading && (
          <p className="text-sm text-ink-muted py-8 text-center">Cargando…</p>
        )}
        {error && (
          <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded px-4 py-3">
            {error}
          </p>
        )}
        {!loading && !error && displayItems.length === 0 && (
          <div className="text-center py-16 text-ink-muted">
            <p className="text-sm">No hay talleres todavía.</p>
            <Link to="/workshops/nuevo" className="mt-2 inline-block text-sm text-primary hover:underline">
              Crear el primero
            </Link>
          </div>
        )}

        {/* Grilla de cards */}
        {!loading && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayItems.map(w => {
            const isDraft = w.esBorrador === true;
            const headerBg = isDraft ? '#D1D0CE'
              : w.headerType === 'COLOR' && w.headerValue ? w.headerValue
              : brand.primary;
            const headerImg = !isDraft && w.headerType === 'IMAGE' && w.headerValue
              ? w.headerValue
              : null;
            const hasImage = !!headerImg;
            const isOculto = w.estado === 'BORRADOR' && !isDraft;
            const isAgotado = w.cuposDisponibles === 0 && w.estado === 'PUBLICADO';

            const cardTextMain   = isDraft ? '#9B9895' : (brand.textCard || '#2B241A');
            const cardTextMuted  = isDraft ? '#B0ADAA' : '#6B5F4C';
            const cardBorderColor = isDraft ? '#E0DEDA' : '#D2C4A8';

            return (
              <div
                key={w.id}
                className="rounded-xl overflow-hidden flex flex-col border"
                style={{ backgroundColor: '#ffffff', borderColor: cardBorderColor }}
              >
                {/* Encabezado: imagen grande con flotantes O franja fina + acciones en body */}
                {hasImage ? (
                  <div
                    className="relative h-40 shrink-0"
                    style={{
                      backgroundColor: headerBg,
                      backgroundImage: `url(${headerImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div
                      className="absolute top-3 left-3 px-3 py-1.5 rounded-lg font-mono font-bold text-sm text-white shadow-md"
                      style={{ backgroundColor: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(4px)' }}
                    >
                      {formatPrecio(w.precio)}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => navigate(`/workshops/${w.id}/editar`)}
                        title="Editar taller"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/35 hover:bg-black/55 text-white transition-colors shadow-md"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(w.id, w.nombre)}
                        title="Eliminar taller"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/35 hover:bg-black/55 text-white transition-colors shadow-md"
                      >
                        <IconTrash />
                      </button>
                    </div>
                    {isOculto && (
                      <span className="absolute bottom-2 left-3 text-xs bg-black/40 text-white/90 px-2 py-0.5 rounded font-medium">
                        Oculto
                      </span>
                    )}
                    {w.estado === 'CANCELADO' && (
                      <span className="absolute bottom-2 left-3 text-xs bg-danger/70 text-white px-2 py-0.5 rounded font-medium">
                        Cancelado
                      </span>
                    )}
                  </div>
                ) : (
                  /* Franja fina — toda la info/acciones viven en el body */
                  <div className="h-2 shrink-0" style={{ backgroundColor: headerBg }} />
                )}

                {/* Barra de precio + acciones cuando NO hay imagen */}
                {!hasImage && (
                  <div className="px-4 pt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-2">
                      {isDraft ? (
                        <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs text-white" style={{ backgroundColor: '#9B9895' }}>
                          Borrador
                        </span>
                      ) : (
                        <span
                          className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs text-white"
                          style={{ backgroundColor: headerBg }}
                        >
                          {formatPrecio(w.precio)}
                        </span>
                      )}
                      {isOculto && (
                        <span className="text-[11px] bg-ink/10 text-ink-muted px-2 py-0.5 rounded font-medium">
                          Oculto
                        </span>
                      )}
                      {w.estado === 'CANCELADO' && (
                        <span className="text-[11px] bg-danger/10 text-danger px-2 py-0.5 rounded font-medium">
                          Cancelado
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => navigate(`/workshops/${w.id}/editar`)}
                        title={isDraft ? 'Continuar configuración' : 'Editar taller'}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-surface-100 hover:text-ink transition-colors"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(w.id, w.nombre)}
                        title="Eliminar"
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-danger/8 hover:text-danger hover:border-danger/30 transition-colors"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                )}

                {/* Cuerpo */}
                <div className="flex flex-col flex-1 p-4 gap-2.5">
                  {/* Título + tipo */}
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className="font-bold text-sm leading-snug uppercase tracking-wide"
                      style={{
                        fontFamily: brand.displayFont ? `'${brand.displayFont}', serif` : undefined,
                        color: isDraft ? '#9B9895' : '#1A1611',
                      }}
                    >{isDraft && w.nombre === 'Borrador sin título' ? 'Sin título' : w.nombre}</h2>
                    {w.tipo && TIPO_CONFIG[w.tipo] && (
                      <span className={`px-1.5 py-0.5 text-xs rounded font-medium shrink-0 ${TIPO_CONFIG[w.tipo].color}`}>
                        {TIPO_CONFIG[w.tipo].label}
                      </span>
                    )}
                  </div>

                  {/* Cupos */}
                  <div className="flex items-center gap-1.5" style={{ color: cardTextMuted }}>
                    <IconPersonGroup />
                    <span className="text-xs font-semibold font-mono">
                      {Math.max(0, w.cuposTotales - w.cuposDisponibles)}/{w.cuposTotales} CUPOS
                    </span>
                  </div>

                  {/* Fecha y hora */}
                  <p className="text-xs font-mono" style={{ color: cardTextMuted }}>
                    {formatFecha(w.fecha)} — {formatHora(w.fecha)}
                    {formatDuracion(w.duracionHoras, w.duracionMinutos) && (
                      <span style={{ opacity: 0.7 }}>
                        {' · '}{formatDuracion(w.duracionHoras, w.duracionMinutos)}
                      </span>
                    )}
                  </p>

                  <ScheduleChip w={w} />

                  {/* Footer: SlotBadge + acciones rápidas */}
                  <div className="mt-auto pt-3 border-t flex flex-col gap-2" style={{ borderColor: cardBorderColor }}>
                    {isDraft ? (
                      <button
                        onClick={() => navigate(`/workshops/${w.id}/editar`)}
                        className="w-full py-2 text-xs font-semibold rounded-md border-2 border-dashed transition-colors"
                        style={{ borderColor: '#B0ADAA', color: '#6B5F4C', backgroundColor: '#F5F4F2' }}
                      >
                        Continuar configuración
                      </button>
                    ) : <>
                    <SlotBadge status={getSlotStatus(w.cuposDisponibles, w.cuposTotales)} />

                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleQuickStatus(w, 'agotar')}
                        className="flex-1 py-1.5 text-xs font-medium rounded-md border transition-all"
                        style={isAgotado
                          ? { backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fcd34d' }
                          : { backgroundColor: '#ffffff', color: '#6B5F4C', borderColor: cardBorderColor }}
                      >
                        Agotar
                      </button>

                      <div className="flex flex-1 rounded-md overflow-hidden border" style={{ borderColor: cardBorderColor }}>
                        <button
                          onClick={() => !isOculto && handleQuickStatus(w, 'ocultar')}
                          className="flex-1 py-1.5 text-xs font-medium transition-all"
                          style={isOculto
                            ? { backgroundColor: '#E4DAC5', color: '#2B241A' }
                            : { backgroundColor: '#ffffff', color: '#6B5F4C' }}
                        >
                          Ocultar
                        </button>
                        <div className="w-px shrink-0" style={{ backgroundColor: cardBorderColor }} />
                        <button
                          onClick={() => isOculto && handleQuickStatus(w, 'mostrar')}
                          className="flex-1 py-1.5 text-xs font-medium transition-all"
                          style={!isOculto
                            ? { backgroundColor: '#E4DAC5', color: '#2B241A' }
                            : { backgroundColor: '#ffffff', color: '#6B5F4C' }}
                        >
                          Mostrar
                        </button>
                      </div>

                      {w.estado !== 'CANCELADO' && (
                        <button
                          onClick={() => handleCancelRequest(w.id, w.nombre)}
                          className="w-full py-1.5 text-xs font-medium rounded-md border border-border bg-surface-100 text-ink-muted hover:bg-ink/5 hover:text-ink hover:border-ink/30 transition-all"
                        >
                          Cancelar taller
                        </button>
                      )}
                    </div>
                  </>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>}
      </div>
    </Layout>
  );
}
