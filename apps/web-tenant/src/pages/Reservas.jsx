import { useState, useEffect, useMemo } from 'react';
import { useEspacio } from '../context/EspacioContext';
import * as api from '../services/api';

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function StatCard({ label, value, accent }) {
  const valueColor =
    accent === 'green' ? 'text-[#10B981]' :
    accent === 'red'   ? 'text-danger'    :
    'text-ink';
  return (
    <div className="bg-surface-100 border border-border rounded-xl px-5 py-4">
      <p className="text-xs text-ink-muted uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-mono font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}

function StateBadge({ estado }) {
  if (estado === 'CONFIRMADA')
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/10 text-[#10B981]">
        Confirmada
      </span>
    );
  if (estado === 'CANCELADA')
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">
        Cancelada
      </span>
    );
  return <span className="text-xs text-ink-muted">{estado}</span>;
}

function EmptyState({ hasReservas }) {
  return (
    <div className="text-center py-16">
      <p className="text-sm text-ink-muted">
        {hasReservas
          ? 'No hay reservas que coincidan con la búsqueda.'
          : 'Todavía no hay reservas para este espacio.'}
      </p>
      {!hasReservas && (
        <p className="text-xs text-ink-muted mt-1">
          Las reservas aparecerán aquí cuando los participantes se inscriban a tus talleres.
        </p>
      )}
    </div>
  );
}

function CancelModal({ reserva, workshopNombre, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#FAF8F4] border border-[#D2C4A8] rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-display text-lg text-ink mb-1">¿Cancelar reserva?</h3>
        <p className="text-sm text-ink-muted mb-1">
          <span className="font-medium text-ink">{reserva.nombre}</span> — {workshopNombre}
        </p>
        <p className="text-sm text-ink-muted mb-6">
          Esta acción cancelará la inscripción y restaurará el cupo en el taller.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-ink hover:bg-surface-200 transition-colors"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-danger rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Cancelar reserva
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reservas() {
  const { activeEspacio } = useEspacio();
  const [workshops, setWorkshops]   = useState([]);
  const [reservas,  setReservas]    = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [filterWs,  setFilterWs]    = useState('');
  const [search,    setSearch]      = useState('');
  const [cancelTarget, setCancelTarget] = useState(null); // { id, nombre, workshopId }

  useEffect(() => {
    if (!activeEspacio?.id) return;
    (async () => {
      setLoading(true);
      try {
        const [ws, rv] = await Promise.all([
          api.workshops.list(activeEspacio.id),
          api.reservas.listByEspacio(activeEspacio.id),
        ]);
        setWorkshops(ws);
        setReservas(rv);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeEspacio?.id]);

  const wsMap = useMemo(
    () => Object.fromEntries(workshops.map(w => [w.id, w])),
    [workshops],
  );

  const filtered = useMemo(() => {
    let list = reservas;
    if (filterWs) list = list.filter(r => r.workshopId === filterWs);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.nombre?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => new Date(b.fecha_reserva) - new Date(a.fecha_reserva));
  }, [reservas, filterWs, search]);

  const stats = useMemo(() => ({
    total:       reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
    canceladas:  reservas.filter(r => r.estado === 'CANCELADA').length,
  }), [reservas]);

  async function handleCancel() {
    if (!cancelTarget) return;
    await api.reservas.cancel(cancelTarget.id);
    setReservas(prev =>
      prev.map(r => r.id === cancelTarget.id ? { ...r, estado: 'CANCELADA' } : r),
    );
    setCancelTarget(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
        Cargando reservas…
      </div>
    );
  }

  const cancelReserva = cancelTarget ? reservas.find(r => r.id === cancelTarget.id) : null;
  const cancelWsNombre = cancelTarget ? (wsMap[cancelTarget.workshopId]?.nombre ?? '—') : '';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Reservas</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total"       value={stats.total}       />
        <StatCard label="Confirmadas" value={stats.confirmadas} accent="green" />
        <StatCard label="Canceladas"  value={stats.canceladas}  accent="red"   />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select
          value={filterWs}
          onChange={e => setFilterWs(e.target.value)}
          className="px-3 py-2 bg-white border border-border rounded-lg text-sm text-ink focus:outline-none focus:border-primary"
        >
          <option value="">Todos los talleres</option>
          {workshops.map(w => (
            <option key={w.id} value={w.id}>{w.nombre}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-border rounded-lg text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
        />
      </div>

      {/* Results count */}
      {(filterWs || search) && (
        <p className="text-xs text-ink-muted mb-3">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState hasReservas={reservas.length > 0} />
      ) : (
        <div className="bg-surface-100 rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-200/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">
                  Participante
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">
                  Taller
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide whitespace-nowrap">
                  Fecha reserva
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const ws = wsMap[r.workshopId];
                const isLast = i === filtered.length - 1;
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-surface-200/30 transition-colors ${!isLast ? 'border-b border-border/60' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{r.nombre}</p>
                      <p className="text-xs text-ink-muted">{r.email}</p>
                      {r.telefono && (
                        <p className="text-xs text-ink-muted font-mono">{r.telefono}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-ink truncate max-w-[220px]">{ws?.nombre ?? '—'}</p>
                      {ws && (
                        <p className="text-xs text-ink-muted capitalize">{ws.tipo?.toLowerCase()}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">
                      {formatDate(r.fecha_reserva)}
                    </td>
                    <td className="px-4 py-3">
                      <StateBadge estado={r.estado} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.estado === 'CONFIRMADA' && (
                        <button
                          onClick={() => setCancelTarget({ id: r.id, nombre: r.nombre, workshopId: r.workshopId })}
                          className="text-xs text-ink-muted hover:text-danger transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel modal */}
      {cancelTarget && cancelReserva && (
        <CancelModal
          reserva={cancelReserva}
          workshopNombre={cancelWsNombre}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}
