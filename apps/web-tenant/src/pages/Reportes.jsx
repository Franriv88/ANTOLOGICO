import { useState, useEffect, useMemo } from 'react';
import { useEspacio } from '../context/EspacioContext';
import * as api from '../services/api';
import Layout from '../components/Layout';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPesos(n) {
  if (n === 0) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
  return `$${n}`;
}

function formatPesosFull(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);
}

function mondayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  d.setDate(d.getDate() - ((day + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

// Build chart data arrays ─────────────────────────────────────────────────────

function weekData(reservas, wsMap) {
  const mon = mondayOfWeek();
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return labels.map((label, i) => {
    const start = new Date(mon); start.setDate(mon.getDate() + i);
    const end   = new Date(start); end.setDate(start.getDate() + 1);
    const value = reservas
      .filter(r => r.estadoPago === 'PAGADO' && r.estado === 'CONFIRMADA')
      .filter(r => { const d = new Date(r.fecha_reserva); return d >= start && d < end; })
      .reduce((s, r) => s + (wsMap[r.workshopId]?.precio ?? 0), 0);
    return { label, value };
  });
}

function monthData(reservas, wsMap) {
  const year = new Date().getFullYear();
  const labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return labels.map((label, m) => ({
    label,
    value: reservas
      .filter(r => r.estadoPago === 'PAGADO' && r.estado === 'CONFIRMADA')
      .filter(r => { const d = new Date(r.fecha_reserva); return d.getFullYear() === year && d.getMonth() === m; })
      .reduce((s, r) => s + (wsMap[r.workshopId]?.precio ?? 0), 0),
  }));
}

function yearData(reservas, wsMap, startYear) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = startYear; y <= currentYear + 5; y++) years.push(y);
  return years.map(y => ({
    label: String(y),
    value: reservas
      .filter(r => r.estadoPago === 'PAGADO' && r.estado === 'CONFIRMADA')
      .filter(r => new Date(r.fecha_reserva).getFullYear() === y)
      .reduce((s, r) => s + (wsMap[r.workshopId]?.precio ?? 0), 0),
  }));
}

// KPI period filter ───────────────────────────────────────────────────────────

function filterByPeriod(reservas, period) {
  const now = new Date();
  if (period === 'week') {
    const mon = mondayOfWeek();
    const sun = new Date(mon); sun.setDate(mon.getDate() + 7);
    return reservas.filter(r => { const d = new Date(r.fecha_reserva); return d >= mon && d < sun; });
  }
  if (period === 'month') {
    const year = now.getFullYear();
    return reservas.filter(r => new Date(r.fecha_reserva).getFullYear() === year);
  }
  return reservas; // 'year' = all time
}

// ── BarChart ──────────────────────────────────────────────────────────────────

function BarChart({ data, accentColor = '#E85D4A' }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const BAR_H  = 130;

  return (
    <div className="w-full select-none">
      <div className="flex items-end gap-1.5" style={{ height: BAR_H + 24 }}>
        {data.map((d, i) => {
          const barPx = d.value > 0 ? Math.max((d.value / maxVal) * BAR_H, 3) : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end" style={{ height: '100%' }}>
              {d.value > 0 && (
                <span className="text-[9px] font-mono text-ink-muted leading-none mb-1 whitespace-nowrap">
                  {formatPesos(d.value)}
                </span>
              )}
              <div
                className="w-full rounded-t-sm transition-all duration-300"
                style={{ height: `${barPx}px`, backgroundColor: accentColor, opacity: 0.9 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-2 border-t border-border/30 pt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-ink-muted truncate block">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, note }) {
  return (
    <div className="bg-surface-100 border border-border rounded-xl px-5 py-5">
      <p className="text-xs text-ink-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-mono font-medium text-ink leading-none">{value}</p>
      {note && <p className="text-xs text-ink-muted mt-1.5">{note}</p>}
    </div>
  );
}

function OcupacionBar({ pct }) {
  const color = pct >= 60 ? '#10B981' : pct >= 20 ? '#B98527' : '#DC2626';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono w-9 text-right" style={{ color }}>{Math.round(pct)}%</span>
    </div>
  );
}

function TipoChip({ tipo }) {
  const map = { WORKSHOP: 'Workshop', TALLER: 'Taller', CLASE: 'Clase', CURSO: 'Curso' };
  return (
    <span className="px-1.5 py-0.5 bg-surface-200 rounded text-[10px] font-medium text-ink-muted uppercase tracking-wide">
      {map[tipo] ?? tipo}
    </span>
  );
}

const MEDALS = ['🥇', '🥈', '🥉'];

// ── Main ──────────────────────────────────────────────────────────────────────

const PERIODS = [
  { id: 'week',  label: 'Esta semana',  chartLabel: 'por día' },
  { id: 'month', label: 'Este año',     chartLabel: 'por mes' },
  { id: 'year',  label: 'Histórico',    chartLabel: 'por año' },
];

export default function Reportes() {
  const { activeEspacio } = useEspacio();
  const [workshops, setWorkshops] = useState([]);
  const [reservas,  setReservas]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [period,    setPeriod]    = useState('month');

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

  const startYear = useMemo(() => {
    const y = activeEspacio?.createdAt ? new Date(activeEspacio.createdAt).getFullYear() : new Date().getFullYear();
    return isNaN(y) ? new Date().getFullYear() : y;
  }, [activeEspacio]);

  // Chart data
  const chartData = useMemo(() => {
    if (period === 'week')  return weekData(reservas, wsMap);
    if (period === 'month') return monthData(reservas, wsMap);
    return yearData(reservas, wsMap, startYear);
  }, [reservas, wsMap, period, startYear]);

  // KPI data (filtered by period)
  const periodReservas = useMemo(() => filterByPeriod(reservas, period), [reservas, period]);

  const kpis = useMemo(() => {
    const pagadas     = periodReservas.filter(r => r.estadoPago === 'PAGADO' && r.estado === 'CONFIRMADA');
    const confirmadas = periodReservas.filter(r => r.estado === 'CONFIRMADA');
    const ingresos    = pagadas.reduce((s, r) => s + (wsMap[r.workshopId]?.precio ?? 0), 0);
    const nonBorrador = workshops.filter(w => w.estado !== 'BORRADOR');
    const ocupacion   = nonBorrador.length > 0
      ? nonBorrador.reduce((s, w) => s + ((w.cuposTotales - w.cuposDisponibles) / (w.cuposTotales || 1)) * 100, 0) / nonBorrador.length
      : 0;
    return {
      ingresos,
      confirmadas: confirmadas.length,
      ocupacion:   Math.round(ocupacion),
      publicados:  workshops.filter(w => w.estado === 'PUBLICADO').length,
    };
  }, [periodReservas, workshops, wsMap]);

  // Per-workshop table (all-time)
  const wsStats = useMemo(() => {
    return workshops
      .filter(w => w.estado !== 'BORRADOR')
      .map(w => {
        const inscritos = (w.cuposTotales ?? 0) - (w.cuposDisponibles ?? 0);
        const ocupacion = w.cuposTotales > 0 ? (inscritos / w.cuposTotales) * 100 : 0;
        const pagadas   = reservas.filter(r => r.workshopId === w.id && r.estadoPago === 'PAGADO' && r.estado === 'CONFIRMADA');
        const ingresos  = pagadas.reduce((s, r) => s + (w.precio ?? 0), 0);
        const totalRes  = reservas.filter(r => r.workshopId === w.id && r.estado === 'CONFIRMADA').length;
        return { ...w, inscritos, ocupacion, ingresos, totalRes };
      })
      .sort((a, b) => b.ingresos - a.ingresos || b.inscritos - a.inscritos);
  }, [workshops, reservas]);

  // Top 3 (historical)
  const top3 = useMemo(() => {
    return wsStats
      .filter(w => w.totalRes > 0)
      .sort((a, b) => b.totalRes - a.totalRes)
      .slice(0, 3);
  }, [wsStats]);

  const chartPeriodLabel = PERIODS.find(p => p.id === period)?.chartLabel ?? '';

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64 text-ink-muted text-sm">Cargando reportes…</div>
      </Layout>
    );
  }

  const hasData = workshops.length > 0;

  return (
    <Layout>
    <div className="max-w-5xl mx-auto">

      {/* Header + period tabs */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Reportes</h1>
        <div className="flex gap-1 bg-surface-200 p-1 rounded-lg">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.id ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-20 text-ink-muted text-sm">
          No hay talleres todavía. Crea tu primer taller para ver métricas.
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard label="Cobrado" value={formatPesosFull(kpis.ingresos)} note="Solo pagos confirmados" />
            <KpiCard label="Reservas" value={kpis.confirmadas} />
            <KpiCard label="Ocupación prom." value={`${kpis.ocupacion}%`} note="Talleres activos" />
            <KpiCard label="Publicados" value={kpis.publicados} />
          </div>

          {/* Bar chart */}
          <div className="bg-surface-100 border border-border rounded-xl p-6 mb-8">
            <p className="text-sm font-semibold text-ink mb-4">
              Ingresos cobrados {chartPeriodLabel}
            </p>
            <BarChart data={chartData} />
          </div>

          {/* Top 3 */}
          {top3.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-ink mb-3">Top 3 más demandados</h2>
              <div className="grid grid-cols-3 gap-4">
                {top3.map((w, i) => (
                  <div key={w.id} className="bg-surface-100 border border-border rounded-xl p-5">
                    <span className="text-2xl block mb-3">{MEDALS[i]}</span>
                    <p className="font-medium text-ink text-sm leading-snug mb-2 line-clamp-2">{w.nombre}</p>
                    <TipoChip tipo={w.tipo} />
                    <div className="mt-4 pt-3 border-t border-border/60">
                      <p className="text-2xl font-mono font-medium text-ink leading-none">{w.totalRes}</p>
                      <p className="text-xs text-ink-muted mt-1">
                        inscripci{w.totalRes !== 1 ? 'ones' : 'ón'} confirmada{w.totalRes !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-workshop table */}
          <div>
            <h2 className="text-sm font-semibold text-ink mb-3">Por taller — histórico</h2>
            <div className="bg-surface-100 rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-200/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Taller</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide whitespace-nowrap">Cupos</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide whitespace-nowrap">Reservas</th>
                    <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide w-36">Ocupación</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">Cobrado</th>
                  </tr>
                </thead>
                <tbody>
                  {wsStats.map((w, i) => {
                    const isLast = i === wsStats.length - 1;
                    return (
                      <tr key={w.id} className={`hover:bg-surface-200/30 transition-colors ${!isLast ? 'border-b border-border/60' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink truncate max-w-[180px]">{w.nombre}</p>
                            <TipoChip tipo={w.tipo} />
                          </div>
                          <span className={`text-[10px] ${w.estado === 'PUBLICADO' ? 'text-[#10B981]' : 'text-ink-muted'}`}>
                            {w.estado === 'PUBLICADO' ? 'Publicado' : w.estado === 'CANCELADO' ? 'Cancelado' : 'Finalizado'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono text-ink">
                            {w.inscritos}<span className="text-ink-muted">/{w.cuposTotales}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-ink">
                          {w.totalRes > 0 ? w.totalRes : <span className="text-ink-muted">—</span>}
                        </td>
                        <td className="px-4 py-3"><OcupacionBar pct={w.ocupacion} /></td>
                        <td className="px-4 py-3 text-right font-mono text-ink whitespace-nowrap">
                          {w.ingresos > 0 ? formatPesosFull(w.ingresos) : <span className="text-ink-muted">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {wsStats.length > 1 && (
                  <tfoot>
                    <tr className="border-t border-border bg-surface-200/30">
                      <td className="px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Total</td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-ink">
                        {wsStats.reduce((s, w) => s + w.inscritos, 0)}
                        <span className="text-ink-muted">/{wsStats.reduce((s, w) => s + (w.cuposTotales ?? 0), 0)}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-ink">
                        {wsStats.reduce((s, w) => s + w.totalRes, 0) || <span className="text-ink-muted">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <OcupacionBar pct={wsStats.length ? wsStats.reduce((s, w) => s + w.ocupacion, 0) / wsStats.length : 0} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-ink whitespace-nowrap">
                        {wsStats.reduce((s, w) => s + w.ingresos, 0) > 0
                          ? formatPesosFull(wsStats.reduce((s, w) => s + w.ingresos, 0))
                          : <span className="text-ink-muted font-normal">—</span>}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            <p className="text-[11px] text-ink-muted mt-2 pl-1">
              * Solo se contabilizan los pagos marcados como cobrados (Mercado Pago procesado o Efectivo confirmado).
            </p>
          </div>
        </>
      )}
    </div>
    </Layout>
  );
}
