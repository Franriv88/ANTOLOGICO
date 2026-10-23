import { useEffect, useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { tenants as tenantsApi, metricas as metricasApi, usuarios as usuariosApi } from '../services/adminApi';

const CORAL = '#E85D4A';
const OCRE  = '#B98527';
const GREEN = '#4A9E6B';
const BLUE  = '#5B6FA8';
const MUTED = '#9C8E7A';
const PURPLE = '#7A6FA8';

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

function monthKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  const d = new Date(+y, +m - 1);
  return d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
}

function dayKey(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1611] border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

function StatCard({ label, value, sub, color = 'text-ink', iconColor, icon, iconBg = 'bg-surface-200' }) {
  return (
    <div className="bg-surface-100 border border-border rounded-xl p-5 flex gap-4 items-start">
      {icon && (
        <div className={`shrink-0 w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`} style={{ color: iconColor }}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-ink-muted mb-0.5">{label}</p>
        <p className={`font-display text-2xl font-semibold leading-tight ${color}`}>{value}</p>
        {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
      </div>
    </div>
  );
}

const icons = {
  reserva: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  workshop: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  revenue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  pago: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  cupo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

export default function Metricas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tenantsApi.list(),
      metricasApi.workshops(),
      metricasApi.reservas(),
      usuariosApi.count(),
    ]).then(([tenantsList, workshopsList, reservasList, totalUsuarios]) => {

      // ── KPIs ──────────────────────────────────────────────────────
      const totalReservas  = reservasList.length;
      const totalWorkshops = workshopsList.length;
      const wsActivos      = workshopsList.filter(w => w.estado !== 'CANCELADO').length;

      const revenue = reservasList.reduce((sum, r) => {
        if (r.metodoPago === 'MERCADO_PAGO') {
          const ws = workshopsList.find(w => w.id === r.workshopId);
          return sum + (ws?.precio ?? 0);
        }
        return sum;
      }, 0);

      const totalCupos = workshopsList.reduce((s, w) => s + (w.cuposTotales ?? 0), 0);
      const cuposOcupados = workshopsList.reduce((s, w) => s + ((w.cuposTotales ?? 0) - (w.cuposDisponibles ?? 0)), 0);
      const tasaOcupacion = totalCupos > 0 ? Math.round(cuposOcupados / totalCupos * 100) : 0;

      // ── Reservas por mes (últimos 6 meses) ────────────────────────
      const monthsMap = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i); d.setDate(1);
        const k = monthKey(d.toISOString());
        monthsMap[k] = { key: k, mes: monthLabel(k), reservas: 0, workshops: 0 };
      }
      reservasList.forEach(r => {
        if (!r.createdAt) return;
        const k = monthKey(r.createdAt);
        if (monthsMap[k]) monthsMap[k].reservas++;
      });
      workshopsList.forEach(w => {
        if (!w.createdAt) return;
        const k = monthKey(w.createdAt);
        if (monthsMap[k]) monthsMap[k].workshops++;
      });
      const porMes = Object.values(monthsMap);

      // ── Reservas últimos 14 días ──────────────────────────────────
      const now = Date.now();
      const daysMap = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now - i * 86_400_000);
        const k = dayKey(d.toISOString());
        daysMap[k] = { dia: k, reservas: 0 };
      }
      reservasList.forEach(r => {
        if (!r.createdAt) return;
        const k = dayKey(r.createdAt);
        if (daysMap[k]) daysMap[k].reservas++;
      });
      const ultimos14 = Object.values(daysMap);

      // ── Métodos de pago ───────────────────────────────────────────
      const metodoMap = {};
      reservasList.forEach(r => {
        const m = r.metodoPago || 'Sin especificar';
        metodoMap[m] = (metodoMap[m] || 0) + 1;
      });
      const METODO_LABELS = {
        EFECTIVO: 'Efectivo',
        MERCADO_PAGO: 'Mercado Pago',
        TRANSFERENCIA: 'Transferencia',
        'Sin especificar': 'Sin especificar',
      };
      const metodos = Object.entries(metodoMap)
        .map(([k, v]) => ({ nombre: METODO_LABELS[k] || k, count: v }))
        .sort((a, b) => b.count - a.count);

      // ── Top workshops por reservas ────────────────────────────────
      const wsCounts = {};
      reservasList.forEach(r => { wsCounts[r.workshopId] = (wsCounts[r.workshopId] || 0) + 1; });
      const topWorkshops = Object.entries(wsCounts)
        .map(([id, count]) => {
          const ws = workshopsList.find(w => w.id === id);
          const esp = tenantsList.find(t => t.id === ws?.espacioId);
          return { nombre: ws?.nombre ?? id, espacio: esp?.nombre ?? '—', count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // ── Top espacios por actividad ────────────────────────────────
      const espAct = {};
      workshopsList.forEach(w => {
        if (!espAct[w.espacioId]) espAct[w.espacioId] = { workshops: 0, reservas: 0 };
        espAct[w.espacioId].workshops++;
      });
      reservasList.forEach(r => {
        const ws = workshopsList.find(w => w.id === r.workshopId);
        if (ws && espAct[ws.espacioId]) espAct[ws.espacioId].reservas++;
      });
      const topEspacios = Object.entries(espAct)
        .map(([id, data]) => {
          const esp = tenantsList.find(t => t.id === id);
          return { nombre: esp?.nombre ?? id, ...data, total: data.workshops + data.reservas };
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

      setData({
        totalReservas, totalWorkshops, wsActivos, revenue, totalUsuarios,
        tasaOcupacion, totalCupos, cuposOcupados,
        porMes, ultimos14, metodos, topWorkshops, topEspacios,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-muted">Calculando métricas…</p>;

  const {
    totalReservas, totalWorkshops, wsActivos, revenue, totalUsuarios,
    tasaOcupacion, totalCupos, cuposOcupados,
    porMes, ultimos14, metodos, topWorkshops, topEspacios,
  } = data;

  const PIE_COLORS = [CORAL, OCRE, GREEN, BLUE, MUTED, PURPLE];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Métricas</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Actividad de la plataforma · Datos demográficos y geográficos disponibles en{' '}
          <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
            className="text-primary hover:underline">Google Analytics →</a>
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Reservas totales" value={totalReservas} sub="Todas las reservas"
          color="text-primary" iconColor={CORAL} iconBg="bg-[#E85D4A]/10" icon={icons.reserva} />
        <StatCard label="Workshops" value={totalWorkshops} sub={`${wsActivos} activos`}
          iconColor={BLUE} iconBg="bg-[#5B6FA8]/10" icon={icons.workshop} />
        <StatCard label="Ingresos MP" value={formatARS(revenue)} sub="Pagos confirmados"
          color="text-success" iconColor={GREEN} iconBg="bg-[#4A9E6B]/10" icon={icons.revenue} />
        <StatCard label="Usuarios" value={totalUsuarios} sub="Alumnos registrados"
          iconColor={PURPLE} iconBg="bg-[#7A6FA8]/10" icon={icons.users} />
        <StatCard label="Ocupación" value={`${tasaOcupacion}%`} sub={`${cuposOcupados}/${totalCupos} cupos`}
          iconColor={OCRE} iconBg="bg-[#B98527]/10" icon={icons.cupo} />
        <StatCard label="Métodos de pago" value={metodos.length} sub={metodos[0] ? `Más usado: ${metodos[0].nombre}` : '—'}
          iconColor={MUTED} iconBg="bg-surface-200" icon={icons.pago} />
      </div>

      {/* Reservas últimos 14 días + Métodos de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-1">Reservas — últimos 14 días</h2>
          <p className="text-xs text-ink-muted mb-5">Reservas diarias en la plataforma</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ultimos14} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CORAL} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={CORAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5DDD0" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} interval={1} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: CORAL, strokeWidth: 1, strokeDasharray: '4 2' }} />
              <Area type="monotone" dataKey="reservas" name="Reservas" stroke={CORAL} strokeWidth={2.5}
                fill="url(#gradRes)" dot={false}
                activeDot={{ r: 5, fill: CORAL, stroke: '#FAF8F4', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Métodos de pago — donut */}
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-1">Métodos de pago</h2>
          <p className="text-xs text-ink-muted mb-5">Distribución de reservas</p>
          {metodos.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative" style={{ width: 160, height: 160 }}>
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={metodos} dataKey="count" nameKey="nombre" cx="50%" cy="50%"
                      innerRadius={50} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                      {metodos.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="bg-[#1A1611] border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
                          <p className="font-medium">{payload[0].name}</p>
                          <p style={{ color: payload[0].payload.fill }}>{payload[0].value} reservas</p>
                        </div>
                      ) : null
                    } />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-xl font-semibold text-ink leading-none">{totalReservas}</span>
                  <span className="text-[10px] text-ink-muted mt-0.5">total</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {metodos.map((m, i) => (
                  <div key={m.nombre} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-ink flex-1 truncate">{m.nombre}</span>
                    <span className="font-mono text-xs text-ink-muted">{m.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-ink-muted text-center py-8">Sin datos aún</p>
          )}
        </div>
      </div>

      {/* Actividad por mes: reservas + workshops */}
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <h2 className="font-semibold text-sm text-ink mb-1">Actividad mensual</h2>
        <p className="text-xs text-ink-muted mb-5">Workshops creados y reservas por mes (últimos 6 meses)</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={porMes} barGap={4} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#E5DDD0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="workshops" name="Workshops" fill={BLUE} radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="reservas" name="Reservas" fill={CORAL} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-3 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: BLUE }} /><span className="text-xs text-ink-muted">Workshops</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: CORAL }} /><span className="text-xs text-ink-muted">Reservas</span></div>
        </div>
      </div>

      {/* Top workshops + Top espacios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top workshops */}
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-4">Top workshops por reservas</h2>
          {topWorkshops.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topWorkshops.map((w, i) => {
                const maxCount = topWorkshops[0].count;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 text-right font-mono text-xs text-ink-muted shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{w.nombre}</p>
                      <p className="text-[11px] text-ink-muted truncate">{w.espacio}</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round(w.count / maxCount * 100)}%`, background: CORAL }} />
                      </div>
                    </div>
                    <span className="font-mono text-xs text-ink-muted w-8 text-right shrink-0">{w.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-ink-muted text-center py-8">Sin datos aún</p>
          )}
        </div>

        {/* Top espacios */}
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-4">Top espacios por actividad</h2>
          {topEspacios.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topEspacios.map((e, i) => {
                const maxTotal = topEspacios[0].total;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 text-right font-mono text-xs text-ink-muted shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{e.nombre}</p>
                      <p className="text-[11px] text-ink-muted">{e.workshops} workshops · {e.reservas} reservas</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden flex">
                        <div className="h-full" style={{ width: `${Math.round(e.workshops / maxTotal * 100)}%`, background: BLUE }} />
                        <div className="h-full" style={{ width: `${Math.round(e.reservas / maxTotal * 100)}%`, background: CORAL }} />
                      </div>
                    </div>
                    <span className="font-mono text-xs text-ink-muted w-8 text-right shrink-0">{e.total}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-ink-muted text-center py-8">Sin datos aún</p>
          )}
        </div>
      </div>

      {/* GA4 banner */}
      <div className="bg-surface-100 border border-border rounded-xl p-6 flex items-center gap-5">
        <div className="shrink-0 w-11 h-11 rounded-xl bg-[#E85D4A]/10 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CORAL} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">Demografía y geografía en Google Analytics</p>
          <p className="text-xs text-ink-muted mt-0.5">
            Edad, sexo, ubicación geográfica (mapa de calor), dispositivos, fuentes de tráfico y más.
            Los datos se actualizan en tiempo real en tu panel de GA4.
          </p>
        </div>
        <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          Abrir GA4 →
        </a>
      </div>
    </div>
  );
}
