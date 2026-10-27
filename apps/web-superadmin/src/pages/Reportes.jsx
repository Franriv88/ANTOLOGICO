import { useEffect, useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { planes as planesApi, tenants as tenantsApi, usuarios as usuariosApi } from '../services/adminApi';
import { AntologicoLoaderCream } from '../components/AntologicoLoaderCream';

const CORAL  = '#E85D4A';
const OCRE   = '#B98527';
const MUTED  = '#9C8E7A';
const GREEN  = '#4A9E6B';

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
  }).format(n);
}

function monthLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
}

// ── Iconos ────────────────────────────────────────────────────────────────────
const icons = {
  mrr: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  trending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  tenants: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  spaces: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  trial: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

function StatCard({ label, value, sub, color = 'text-ink', iconColor, icon, iconBg = 'bg-surface-200' }) {
  return (
    <div className="bg-surface-100 border border-border rounded-xl p-5 flex gap-4 items-start">
      {icon && (
        <div className={`shrink-0 w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}
             style={{ color: iconColor }}>
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

export default function Reportes() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tenantsApi.list(), planesApi.list(), usuariosApi.count()])
      .then(([tenantsList, planesList, totalUsuarios]) => {
        const planesByKey = {};
        planesList.forEach(p => {
          planesByKey[p.id]     = p;
          planesByKey[p.nombre] = p;
        });

        // MRR por tenant (activos con plan)
        const mrr = tenantsList.reduce((sum, t) => {
          const plan = planesByKey[t.planId] ?? planesByKey[t.selectedPlan];
          return sum + (t.estado === 'ACTIVO' && plan ? (plan.precioMensual ?? 0) : 0);
        }, 0);

        // Tenants en trial (sin planId real pero con trialStartedAt)
        const trialing = tenantsList.filter(t => t.trialStartedAt && !t.planId).length;
        const activos  = tenantsList.filter(t => t.estado === 'ACTIVO').length;

        // Distribución por plan
        const distMap = {};
        planesList.forEach(p => { distMap[p.nombre] = { nombre: p.nombre, count: 0, mrr: 0 }; });
        distMap['Sin plan'] = { nombre: 'Sin plan', count: 0, mrr: 0 };
        tenantsList.forEach(t => {
          const plan = planesByKey[t.planId] ?? planesByKey[t.selectedPlan];
          const key  = plan?.nombre ?? 'Sin plan';
          if (!distMap[key]) distMap[key] = { nombre: key, count: 0, mrr: 0 };
          distMap[key].count++;
          if (t.estado === 'ACTIVO' && plan) distMap[key].mrr += (plan.precioMensual ?? 0);
        });
        const distPlanes = Object.values(distMap).filter(d => d.count > 0);

        // Registro por mes (últimos 6 meses)
        const monthsMap = {};
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          d.setDate(1);
          const key = monthLabel(d.toISOString());
          monthsMap[key] = { mes: key, nuevos: 0 };
        }
        tenantsList.forEach(t => {
          if (!t.createdAt) return;
          const key = monthLabel(t.createdAt);
          if (monthsMap[key]) monthsMap[key].nuevos++;
        });
        const porMes = Object.values(monthsMap);

        // Tenants únicos: contamos por userId cuando existe, o por espacio como fallback
        const seenIds = new Set();
        let totalTenants = 0;
        tenantsList.forEach(t => {
          const key = t.userId || `anon:${t.id}`;
          if (!seenIds.has(key)) { seenIds.add(key); totalTenants++; }
        });

        // Espacios activos (métrica de espacios, no de tenants)
        const totalEspacios  = tenantsList.length;
        const espaciosActivos = tenantsList.filter(t => t.estado === 'ACTIVO').length;

        setData({ mrr, trialing, total: totalTenants, totalEspacios, espaciosActivos, totalUsuarios, distPlanes, porMes });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <AntologicoLoaderCream size={300} />
    </div>
  );

  const { mrr, trialing, total, totalEspacios, espaciosActivos, totalUsuarios, distPlanes, porMes } = data;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Reportes</h1>
        <p className="text-sm text-ink-muted mt-0.5">Métricas basadas en planes activos. Los ingresos reales se agregarán al integrar Mercado Pago.</p>
      </div>

      {/* KPIs — 2 cols en móvil, 3 en tablet, 6 en pantalla grande */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="MRR estimado" value={formatARS(mrr)} sub="Ingresos mensuales"
          color="text-primary" iconColor={CORAL} iconBg="bg-[#E85D4A]/10"
          icon={icons.mrr}
        />
        <StatCard
          label="MRR anualizado" value={formatARS(mrr * 12)} sub="ARR proyectado"
          color="text-success" iconColor={GREEN} iconBg="bg-[#4A9E6B]/10"
          icon={icons.trending}
        />
        <StatCard
          label="Tenants" value={total} sub={`${totalEspacios} espacio${totalEspacios !== 1 ? 's' : ''} en total`}
          iconColor="#5B6FA8" iconBg="bg-[#5B6FA8]/10"
          icon={icons.tenants}
        />
        <StatCard
          label="Espacios activos" value={espaciosActivos} sub={`de ${totalEspacios} totales`}
          iconColor={MUTED} iconBg="bg-surface-200"
          icon={icons.spaces}
        />
        <StatCard
          label="En trial" value={trialing} sub="14 días gratis"
          iconColor={OCRE} iconBg="bg-[#B98527]/10"
          icon={icons.trial}
        />
        <StatCard
          label="Usuarios finales" value={totalUsuarios} sub="Alumnos registrados"
          iconColor="#7A6FA8" iconBg="bg-[#7A6FA8]/10"
          icon={icons.users}
        />
      </div>

      {/* Gráficos: área + donut lado a lado en pantallas grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nuevos tenants por mes */}
        <div className="bg-surface-100 border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-ink mb-1">Nuevos tenants por mes</h2>
          <p className="text-xs text-ink-muted mb-5">Registros en los últimos 6 meses</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={porMes} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTenants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={CORAL} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={CORAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#E5DDD0" strokeDasharray="0" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: CORAL, strokeWidth: 1, strokeDasharray: '4 2' }} />
              <Area
                type="monotone"
                dataKey="nuevos"
                name="Nuevos"
                stroke={CORAL}
                strokeWidth={2.5}
                fill="url(#gradTenants)"
                dot={false}
                activeDot={{ r: 5, fill: CORAL, stroke: '#FAF8F4', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución por plan — donut con leyenda */}
        {(() => {
          const PIE_COLORS = [CORAL, OCRE, GREEN, '#5B6FA8', MUTED];
          const totalPie   = distPlanes.reduce((s, d) => s + d.count, 0);
          return (
            <div className="bg-surface-100 border border-border rounded-xl p-5">
              <h2 className="font-semibold text-sm text-ink mb-1">Distribución por plan</h2>
              <p className="text-xs text-ink-muted mb-5">Tenants por plan activo</p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0" style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={distPlanes}
                        dataKey="count"
                        nameKey="nombre"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {distPlanes.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) =>
                          active && payload?.length ? (
                            <div className="bg-[#1A1611] border border-white/10 rounded-lg px-3 py-2 text-xs text-white shadow-lg">
                              <p className="font-medium">{payload[0].name}</p>
                              <p style={{ color: payload[0].payload.fill }}>
                                {payload[0].value} tenant{payload[0].value !== 1 ? 's' : ''} · {Math.round(payload[0].value / totalPie * 100)}%
                              </p>
                            </div>
                          ) : null
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-display text-2xl font-semibold text-ink leading-none">{totalPie}</span>
                    <span className="text-[10px] text-ink-muted mt-0.5">tenants</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  {distPlanes.map((d, i) => (
                    <div key={d.nombre} className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-ink truncate">{d.nombre}</span>
                          <span className="font-mono text-xs text-ink-muted shrink-0">{d.count} · {Math.round(d.count / totalPie * 100)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${Math.round(d.count / totalPie * 100)}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* MRR por plan — barra ancho completo */}
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <h2 className="font-semibold text-sm text-ink mb-4">MRR por plan</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={distPlanes.filter(d => d.mrr > 0)} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD0" vertical={false} />
            <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => formatARS(v)} tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} width={60} />
            <Tooltip content={<CustomTooltip formatter={formatARS} />} />
            <Bar dataKey="mrr" name="MRR" radius={[4, 4, 0, 0]}>
              {distPlanes.filter(d => d.mrr > 0).map((_, i) => {
                const colors = [OCRE, CORAL, GREEN];
                return <Cell key={i} fill={colors[i % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
