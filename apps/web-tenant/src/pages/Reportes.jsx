import { useState, useEffect, useMemo } from 'react';
import { useEspacio } from '../context/EspacioContext';
import * as api from '../services/api';

const PERIODS = [
  { id: 'month',  label: 'Este mes' },
  { id: 'last3',  label: 'Últimos 3 meses' },
  { id: 'all',    label: 'Todo el tiempo' },
];

function periodStart(id) {
  const now = new Date();
  if (id === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (id === 'last3') return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return new Date(0);
}

function formatPesos(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);
}

function ocupacionColor(pct) {
  if (pct >= 60) return '#10B981';
  if (pct >= 20) return '#B98527';
  return '#DC2626';
}

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
  const color = ocupacionColor(pct);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono w-9 text-right" style={{ color }}>{Math.round(pct)}%</span>
    </div>
  );
}

function TipoChip({ tipo }) {
  const map = {
    WORKSHOP: 'Workshop',
    TALLER:   'Taller',
    CLASE:    'Clase',
    CURSO:    'Curso',
  };
  return (
    <span className="px-1.5 py-0.5 bg-surface-200 rounded text-[10px] font-medium text-ink-muted uppercase tracking-wide">
      {map[tipo] ?? tipo}
    </span>
  );
}

export default function Reportes() {
  const { activeEspacio } = useEspacio();
  const [workshops, setWorkshops] = useState([]);
  const [reservas,  setReservas]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [period,    setPeriod]    = useState('all');

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

  // Reservas confirmadas dentro del período seleccionado
  const reservasEnPeriodo = useMemo(() => {
    const start = periodStart(period);
    return reservas.filter(
      r => r.estado === 'CONFIRMADA' && new Date(r.fecha_reserva) >= start,
    );
  }, [reservas, period]);

  // Agrupa reservas del período por workshopId
  const countByWs = useMemo(() => {
    const map = {};
    reservasEnPeriodo.forEach(r => { map[r.workshopId] = (map[r.workshopId] ?? 0) + 1; });
    return map;
  }, [reservasEnPeriodo]);

  // Stats por taller (solo los que no son borrador)
  const wsStats = useMemo(() => {
    return workshops
      .filter(w => w.estado !== 'BORRADOR')
      .map(w => {
        const inscritos  = (w.cuposTotales ?? 0) - (w.cuposDisponibles ?? 0);
        const ocupacion  = w.cuposTotales > 0 ? (inscritos / w.cuposTotales) * 100 : 0;
        const enPeriodo  = countByWs[w.id] ?? 0;
        const ingresos   = enPeriodo * (w.precio ?? 0);
        return { ...w, inscritos, ocupacion, enPeriodo, ingresos };
      })
      .sort((a, b) => b.ingresos - a.ingresos || b.inscritos - a.inscritos);
  }, [workshops, countByWs]);

  const totals = useMemo(() => ({
    ingresos:   wsStats.reduce((s, w) => s + w.ingresos, 0),
    reservas:   reservasEnPeriodo.length,
    ocupacion:  wsStats.length
      ? wsStats.reduce((s, w) => s + w.ocupacion, 0) / wsStats.length
      : 0,
    publicados: workshops.filter(w => w.estado === 'PUBLICADO').length,
  }), [wsStats, reservasEnPeriodo, workshops]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-ink-muted text-sm">
        Cargando reportes…
      </div>
    );
  }

  const hasData = workshops.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header + period */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Reportes</h1>
        <div className="flex gap-1 bg-surface-200 p-1 rounded-lg">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.id
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink-muted hover:text-ink'
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
            <KpiCard
              label="Ingresos estimados"
              value={formatPesos(totals.ingresos)}
              note="Reservas confirmadas × precio"
            />
            <KpiCard
              label="Reservas confirmadas"
              value={totals.reservas}
            />
            <KpiCard
              label="Ocupación promedio"
              value={`${Math.round(totals.ocupacion)}%`}
              note="Sobre talleres no en borrador"
            />
            <KpiCard
              label="Talleres publicados"
              value={totals.publicados}
            />
          </div>

          {/* Por taller */}
          <div>
            <h2 className="text-sm font-semibold text-ink mb-3">Por taller</h2>
            <div className="bg-surface-100 rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-200/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">
                      Taller
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide whitespace-nowrap">
                      Cupos
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide whitespace-nowrap">
                      Reservas
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide w-36">
                      Ocupación
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-ink-muted uppercase tracking-wide">
                      Ingresos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wsStats.map((w, i) => {
                    const isLast = i === wsStats.length - 1;
                    return (
                      <tr
                        key={w.id}
                        className={`hover:bg-surface-200/30 transition-colors ${!isLast ? 'border-b border-border/60' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink truncate max-w-[180px]">{w.nombre}</p>
                            <TipoChip tipo={w.tipo} />
                          </div>
                          <EstadoBadge estado={w.estado} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-mono text-ink">
                            {w.inscritos}<span className="text-ink-muted">/{w.cuposTotales}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-ink">
                          {w.enPeriodo > 0
                            ? w.enPeriodo
                            : <span className="text-ink-muted">—</span>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <OcupacionBar pct={w.ocupacion} />
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-ink whitespace-nowrap">
                          {w.ingresos > 0
                            ? formatPesos(w.ingresos)
                            : <span className="text-ink-muted">—</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* Footer totales */}
                {wsStats.length > 1 && (
                  <tfoot>
                    <tr className="border-t border-border bg-surface-200/30">
                      <td className="px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">
                        Total
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-ink">
                        {wsStats.reduce((s, w) => s + w.inscritos, 0)}
                        <span className="text-ink-muted">/{wsStats.reduce((s, w) => s + (w.cuposTotales ?? 0), 0)}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-ink">
                        {totals.reservas > 0 ? totals.reservas : <span className="text-ink-muted">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <OcupacionBar pct={totals.ocupacion} />
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-ink whitespace-nowrap">
                        {totals.ingresos > 0 ? formatPesos(totals.ingresos) : <span className="text-ink-muted font-normal">—</span>}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
            <p className="text-[11px] text-ink-muted mt-2 pl-1">
              * Ingresos estimados: reservas confirmadas × precio del taller. No refleja pagos procesados.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    PUBLICADO:  { label: 'Publicado',  className: 'text-[#10B981]' },
    CANCELADO:  { label: 'Cancelado',  className: 'text-danger' },
    FINALIZADO: { label: 'Finalizado', className: 'text-ink-muted' },
  };
  const cfg = map[estado];
  if (!cfg) return null;
  return <span className={`text-[10px] ${cfg.className}`}>{cfg.label}</span>;
}
