import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { planes as planesApi, tenants as tenantsApi, usuarios as usuariosApi } from '../services/adminApi';

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

        // Tenants únicos (por userId) vs espacios totales
        const uniqueUserIds = new Set(tenantsList.map(t => t.userId).filter(Boolean));
        const totalTenants  = uniqueUserIds.size;
        const totalEspacios = tenantsList.length;
        const activosCount  = tenantsList.filter(t => t.estado === 'ACTIVO').length;

        setData({ mrr, trialing, activos: activosCount, total: totalTenants, totalEspacios, totalUsuarios, distPlanes, porMes });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-ink-muted">Calculando métricas…</p>;

  const { mrr, trialing, activos, total, totalEspacios, totalUsuarios, distPlanes, porMes } = data;

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Reportes</h1>
        <p className="text-sm text-ink-muted mt-0.5">Métricas basadas en planes activos. Los ingresos reales se agregarán al integrar Mercado Pago.</p>
      </div>

      {/* KPIs — fila ingresos */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="MRR estimado" value={formatARS(mrr)} sub="Ingresos mensuales recurrentes"
          color="text-primary" iconColor={CORAL} iconBg="bg-[#E85D4A]/10"
          icon={icons.mrr}
        />
        <StatCard
          label="MRR anualizado" value={formatARS(mrr * 12)} sub="ARR proyectado"
          color="text-success" iconColor={GREEN} iconBg="bg-[#4A9E6B]/10"
          icon={icons.trending}
        />
      </div>

      {/* KPIs — fila cuentas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Tenants" value={total} sub={`${activos} activo${activos !== 1 ? 's' : ''}`}
          iconColor="#5B6FA8" iconBg="bg-[#5B6FA8]/10"
          icon={icons.tenants}
        />
        <StatCard
          label="Espacios" value={totalEspacios} sub={`${(totalEspacios / Math.max(total,1)).toFixed(1)} por tenant`}
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

      {/* Nuevos tenants por mes */}
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <h2 className="font-semibold text-sm text-ink mb-4">Nuevos tenants por mes</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={porMes} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD0" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="nuevos" name="Nuevos" radius={[4, 4, 0, 0]}>
              {porMes.map((_, i) => (
                <Cell key={i} fill={i === porMes.length - 1 ? CORAL : OCRE + '99'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribución por plan */}
      <div className="bg-surface-100 border border-border rounded-xl p-5">
        <h2 className="font-semibold text-sm text-ink mb-4">Distribución por plan</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={distPlanes} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5DDD0" vertical={false} />
            <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} width={24} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Tenants" radius={[4, 4, 0, 0]}>
              {distPlanes.map((entry, i) => {
                const colors = [OCRE, CORAL, GREEN, MUTED];
                return <Cell key={i} fill={colors[i % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MRR por plan */}
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
