import { useState, useEffect, useMemo, useRef } from 'react';
import { useEspacio } from '../context/EspacioContext';
import * as api from '../services/api';
import Layout from '../components/Layout';
import useRealtimeQuery from '../hooks/useRealtimeQuery';
import { listReservasByEspacioRef, listMyWorkshopsRef } from '../dataconnect-generated';

function formatDate(iso) {
  if (!iso) return { date: '—', time: null };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function StatCard({ label, value, accent }) {
  const valueColor =
    accent === 'green' ? 'text-[#10B981]' :
    accent === 'red'   ? 'text-danger'    :
    accent === 'amber' ? 'text-[#B98527]' :
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

function PagoBadge({ metodoPago, estadoPago, canToggle, onMarkPaid, onMarkPending, loading }) {
  if (metodoPago === 'MERCADO_PAGO') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 whitespace-nowrap">
        Mercado Pago
      </span>
    );
  }
  if (estadoPago === 'PAGADO' && canToggle) {
    return (
      <div className="relative group/pago inline-flex">
        <button
          disabled={loading}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20 hover:border-[#10B981]/40 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? '…' : (
            <>
              Pagado
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </>
          )}
        </button>
        <div className="absolute left-0 top-full mt-1 bg-surface-100 border border-border rounded-lg shadow-lg py-1 z-20 opacity-0 pointer-events-none group-hover/pago:opacity-100 group-hover/pago:pointer-events-auto transition-opacity min-w-[170px]">
          <button
            onClick={onMarkPending}
            disabled={loading}
            className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-surface-200 transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Volver a pendiente
          </button>
        </div>
      </div>
    );
  }
  if (estadoPago === 'PAGADO') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/10 text-[#10B981] whitespace-nowrap">
        Pagado
      </span>
    );
  }
  if (canToggle) {
    return (
      <div className="relative group/pago inline-flex">
        <button
          disabled={loading}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#B98527]/10 text-[#B98527] border border-[#B98527]/20 hover:bg-[#B98527]/20 hover:border-[#B98527]/40 transition-all cursor-pointer disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? '…' : (
            <>
              Pendiente
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </>
          )}
        </button>
        <div className="absolute left-0 top-full mt-1 bg-surface-100 border border-border rounded-lg shadow-lg py-1 z-20 opacity-0 pointer-events-none group-hover/pago:opacity-100 group-hover/pago:pointer-events-auto transition-opacity min-w-[170px]">
          <button
            onClick={onMarkPaid}
            disabled={loading}
            className="w-full text-left px-3 py-2 text-xs text-ink hover:bg-surface-200 transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Marcar como pagado
          </button>
        </div>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#B98527]/10 text-[#B98527] whitespace-nowrap">
      Pendiente
    </span>
  );
}

function EmptyState({ hasReservas }) {
  return (
    <div className="text-center py-16">
      <p className="text-sm text-ink-muted">
        {hasReservas
          ? 'No hay reservas que coincidan con los filtros.'
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

const ChevronDown = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function ColumnFilter({ label, options, selected, onSelect, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const hasFilter = selected !== null && selected !== undefined && selected !== '';

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          hasFilter ? 'text-primary' : 'text-ink-muted hover:text-ink'
        }`}
      >
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-1.5 z-30 bg-surface-100 border border-border rounded-xl shadow-lg py-1.5 min-w-[160px] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <button
            onClick={() => { onSelect(''); setOpen(false); }}
            className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
              !hasFilter ? 'text-primary font-semibold bg-primary/5' : 'text-ink-muted hover:bg-surface-200'
            }`}
          >
            Todos
          </button>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2 ${
                selected === opt.value ? 'text-primary font-semibold bg-primary/5' : 'text-ink hover:bg-surface-200'
              }`}
            >
              {opt.badge && <span className="shrink-0">{opt.badge}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BlockModal({ email, isBloqueado, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-100 border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-display text-lg text-ink mb-1">
          {isBloqueado ? '¿Desbloquear usuario?' : '¿Bloquear usuario?'}
        </h3>
        <p className="text-sm text-ink-muted mb-1 font-mono">{email}</p>
        <p className="text-sm text-ink-muted mb-6">
          {isBloqueado
            ? 'El usuario podrá volver a realizar reservas en tu espacio.'
            : 'El usuario no podrá realizar nuevas reservas en tu espacio.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-xl text-sm text-ink hover:bg-surface-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              isBloqueado
                ? 'bg-[#10B981] text-white hover:opacity-90'
                : 'bg-danger text-white hover:opacity-90'
            }`}
          >
            {isBloqueado ? 'Desbloquear' : 'Bloquear'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelModal({ reserva, workshopNombre, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-100 border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
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
  const [filterEstado, setFilterEstado] = useState('');
  const [filterPago,   setFilterPago]   = useState('');
  const [filterFecha,  setFilterFecha]  = useState('');
  const [search,    setSearch]      = useState('');
  const [cancelTarget,   setCancelTarget]  = useState(null);
  const [markingPaid,    setMarkingPaid]   = useState(null);
  const [blockTarget,    setBlockTarget]   = useState(null);
  const [blockingEmail,  setBlockingEmail] = useState(null);
  const [bloqueados,     setBloqueados]    = useState([]);

  const espacioId = activeEspacio?.id;
  const wsQuery = useRealtimeQuery(listMyWorkshopsRef, { espacioId }, !!espacioId);
  const rvQuery = useRealtimeQuery(listReservasByEspacioRef, { espacioId }, !!espacioId);

  useEffect(() => {
    if (wsQuery.data?.workshops) setWorkshops(wsQuery.data.workshops);
  }, [wsQuery.data]);

  useEffect(() => {
    if (rvQuery.data?.reservas) setReservas(rvQuery.data.reservas);
  }, [rvQuery.data]);

  useEffect(() => {
    if (!espacioId) return;
    api.espacios.getUsuariosBloqueados(espacioId).then(setBloqueados).catch(() => {});
  }, [espacioId]);

  useEffect(() => {
    setLoading(wsQuery.loading || rvQuery.loading);
  }, [wsQuery.loading, rvQuery.loading]);

  const wsMap = useMemo(
    () => Object.fromEntries(workshops.map(w => [w.id, w])),
    [workshops],
  );

  const filtered = useMemo(() => {
    let list = reservas;
    if (filterWs) list = list.filter(r => r.workshopId === filterWs);
    if (filterEstado) list = list.filter(r => r.estado === filterEstado);
    if (filterPago) {
      list = list.filter(r => {
        if (filterPago === 'MERCADO_PAGO') return r.metodoPago === 'MERCADO_PAGO';
        if (filterPago === 'EFECTIVO_PAGADO') return r.metodoPago !== 'MERCADO_PAGO' && r.estadoPago === 'PAGADO';
        if (filterPago === 'EFECTIVO_PENDIENTE') return r.metodoPago !== 'MERCADO_PAGO' && r.estadoPago !== 'PAGADO';
        return true;
      });
    }
    if (filterFecha) {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      list = list.filter(r => {
        const d = new Date(r.fechaReserva);
        if (filterFecha === 'hoy') return d >= startOfDay;
        if (filterFecha === '7dias') return d >= new Date(startOfDay - 7 * 86400000);
        if (filterFecha === '30dias') return d >= new Date(startOfDay - 30 * 86400000);
        return true;
      });
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.nombre?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
  }, [reservas, filterWs, filterEstado, filterPago, filterFecha, search]);

  const activeFilterCount = [filterWs, filterEstado, filterPago, filterFecha].filter(Boolean).length;

  const stats = useMemo(() => ({
    total:       reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
    canceladas:  reservas.filter(r => r.estado === 'CANCELADA').length,
    efectivoPendiente: reservas.filter(
      r => r.estado !== 'CANCELADA' && r.metodoPago !== 'MERCADO_PAGO' && r.estadoPago !== 'PAGADO'
    ).length,
  }), [reservas]);

  async function handleMarkPaid(id) {
    setMarkingPaid(id);
    try {
      await api.reservas.markPaid(id);
      setReservas(prev =>
        prev.map(r => r.id === id ? { ...r, estadoPago: 'PAGADO', estado: 'CONFIRMADA' } : r),
      );
    } finally {
      setMarkingPaid(null);
    }
  }

  async function handleMarkUnpaid(id) {
    setMarkingPaid(id);
    try {
      await api.reservas.markUnpaid(id);
      setReservas(prev =>
        prev.map(r => r.id === id ? { ...r, estadoPago: 'PENDIENTE', estado: 'PENDIENTE' } : r),
      );
    } finally {
      setMarkingPaid(null);
    }
  }

  async function handleCancel() {
    if (!cancelTarget) return;
    await api.reservas.cancel(cancelTarget.id, cancelTarget.workshopId);
    setReservas(prev =>
      prev.map(r => r.id === cancelTarget.id ? { ...r, estado: 'CANCELADA' } : r),
    );
    setCancelTarget(null);
  }

  function handleBlockUser(email) {
    if (!activeEspacio?.id || !email) return;
    const isBloqueado = bloqueados.includes(email.toLowerCase());
    setBlockTarget({ email, isBloqueado });
  }

  async function confirmBlockUser() {
    if (!blockTarget) return;
    const { email, isBloqueado } = blockTarget;
    setBlockTarget(null);
    setBlockingEmail(email);
    try {
      if (isBloqueado) {
        await api.espacios.unblockUser(activeEspacio.id, email);
        setBloqueados(prev => prev.filter(e => e !== email.toLowerCase()));
      } else {
        await api.espacios.blockUser(activeEspacio.id, email);
        setBloqueados(prev => [...prev, email.toLowerCase()]);
      }
    } finally {
      setBlockingEmail(null);
    }
  }

  const cancelReserva = cancelTarget ? reservas.find(r => r.id === cancelTarget.id) : null;
  const cancelWsNombre = cancelTarget ? (wsMap[cancelTarget.workshopId]?.nombre ?? '—') : '';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
          Cargando reservas…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Reservas</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total"              value={stats.total}              />
        <StatCard label="Confirmadas"        value={stats.confirmadas}        accent="green"  />
        <StatCard label="Canceladas"         value={stats.canceladas}         accent="red"    />
        <StatCard label="Efectivo pendiente" value={stats.efectivoPendiente}  accent={stats.efectivoPendiente > 0 ? 'amber' : undefined} />
      </div>

      {/* Search + active filters */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 max-w-md px-3 py-2 bg-surface-100 border border-border rounded-lg text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
        />
        {(activeFilterCount > 0 || search) && (
          <p className="text-xs text-ink-muted whitespace-nowrap">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
        {activeFilterCount > 0 && (
          <button
            onClick={() => { setFilterWs(''); setFilterEstado(''); setFilterPago(''); setFilterFecha(''); }}
            className="text-xs text-primary hover:text-primary-strong transition-colors whitespace-nowrap"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState hasReservas={reservas.length > 0} />
      ) : (
        <div className="bg-surface-100 rounded-2xl border border-border overflow-x-auto shadow-sm">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pl-5 pr-3 py-3.5 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                  #Reserva
                </th>
                <th className="text-left px-3 py-3.5 text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
                  Participante
                </th>
                <th className="text-left px-3 py-3.5">
                  <ColumnFilter
                    label="Taller"
                    selected={filterWs}
                    onSelect={setFilterWs}
                    options={workshops.map(w => ({ value: w.id, label: w.nombre }))}
                  />
                </th>
                <th className="text-left px-3 py-3.5 whitespace-nowrap">
                  <ColumnFilter
                    label="Fecha"
                    selected={filterFecha}
                    onSelect={setFilterFecha}
                    options={[
                      { value: 'hoy', label: 'Hoy' },
                      { value: '7dias', label: 'Últimos 7 días' },
                      { value: '30dias', label: 'Últimos 30 días' },
                    ]}
                  />
                </th>
                <th className="text-left px-3 py-3.5">
                  <ColumnFilter
                    label="Estado"
                    selected={filterEstado}
                    onSelect={setFilterEstado}
                    options={[
                      { value: 'CONFIRMADA', label: 'Confirmada', badge: <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" /> },
                      { value: 'CANCELADA', label: 'Cancelada', badge: <span className="w-2 h-2 rounded-full bg-danger inline-block" /> },
                    ]}
                  />
                </th>
                <th className="text-left px-3 py-3.5">
                  <ColumnFilter
                    label="Pago"
                    selected={filterPago}
                    onSelect={setFilterPago}
                    options={[
                      { value: 'MERCADO_PAGO', label: 'Mercado Pago', badge: <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> },
                      { value: 'EFECTIVO_PAGADO', label: 'Efectivo · Pagado', badge: <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" /> },
                      { value: 'EFECTIVO_PENDIENTE', label: 'Efectivo · Pendiente', badge: <span className="w-2 h-2 rounded-full bg-[#B98527] inline-block" /> },
                    ]}
                  />
                </th>
                <th className="px-3 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((r) => {
                const ws = wsMap[r.workshopId];
                const code = (r.grupoId || r.id).slice(-8).toUpperCase();
                return (
                  <tr
                    key={r.id}
                    className="hover:bg-surface-200/40 transition-colors group"
                  >
                    <td className="pl-5 pr-3 py-3.5">
                      <span className="font-mono text-xs text-primary/80 bg-primary/5 border border-primary/10 rounded-md px-2 py-1">
                        {code}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-primary">{(r.nombre || '?')[0].toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink text-[13px] leading-tight truncate">{r.nombre}</p>
                          <p className="text-[11px] text-ink-muted truncate">{r.email}</p>
                          {r.telefono && (
                            <p className="text-[11px] text-ink-muted font-mono">{r.telefono}</p>
                          )}
                        </div>
                        {bloqueados.includes(r.email?.toLowerCase()) && (
                          <span className="text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 rounded px-1.5 py-0.5 mt-0.5 shrink-0 leading-tight">
                            bloqueado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 max-w-[160px]">
                      <p className="text-ink text-[13px] truncate font-medium">{ws?.nombre ?? '—'}</p>
                      {ws && (
                        <p className="text-[11px] text-ink-muted capitalize">{ws.tipo?.toLowerCase()}</p>
                      )}
                    </td>
                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {(() => { const { date, time } = formatDate(r.fechaReserva); return (
                        <>
                          <p className="text-[13px] text-ink">{date}</p>
                          {time && <p className="text-[11px] text-ink-muted">{time}</p>}
                        </>
                      ); })()}
                    </td>
                    <td className="px-3 py-3.5">
                      <StateBadge estado={r.estado} />
                    </td>
                    <td className="px-3 py-3.5">
                      <PagoBadge
                        metodoPago={r.metodoPago}
                        estadoPago={r.estadoPago}
                        canToggle={r.estado !== 'CANCELADA' && r.metodoPago !== 'MERCADO_PAGO'}
                        onMarkPaid={() => handleMarkPaid(r.id)}
                        onMarkPending={() => handleMarkUnpaid(r.id)}
                        loading={markingPaid === r.id}
                      />
                    </td>
                    <td className="pl-1 pr-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        {r.estado !== 'CANCELADA' && (
                          <button
                            onClick={() => setCancelTarget({ id: r.id, nombre: r.nombre, workshopId: r.workshopId })}
                            className="flex items-center gap-1 text-xs text-ink-muted hover:text-danger hover:bg-danger/5 transition-colors px-2.5 py-1.5 rounded-lg whitespace-nowrap"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                            Cancelar
                          </button>
                        )}
                        {r.email && (
                          <button
                            onClick={() => handleBlockUser(r.email)}
                            disabled={blockingEmail === r.email}
                            title={bloqueados.includes(r.email?.toLowerCase()) ? 'Desbloquear usuario' : 'Bloquear usuario'}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                              bloqueados.includes(r.email?.toLowerCase())
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-ink-muted hover:text-danger hover:bg-danger/5'
                            }`}
                          >
                            {blockingEmail === r.email ? (
                              <span className="text-xs">…</span>
                            ) : bloqueados.includes(r.email?.toLowerCase()) ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 14 0v4"/></svg>
                            )}
                          </button>
                        )}
                      </div>
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

      {/* Block/unblock modal */}
      {blockTarget && (
        <BlockModal
          email={blockTarget.email}
          isBloqueado={blockTarget.isBloqueado}
          onConfirm={confirmBlockUser}
          onClose={() => setBlockTarget(null)}
        />
      )}
    </div>
    </Layout>
  );
}
