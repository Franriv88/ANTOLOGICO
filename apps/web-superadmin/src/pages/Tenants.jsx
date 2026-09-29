import { useEffect, useState } from 'react';
import { tenants as tenantsApi, planes as planesApi } from '../services/adminApi';

const ESTADO_COLORS = {
  ACTIVO:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  INACTIVO:  'bg-surface-200 text-ink-muted border-border',
  SUSPENDIDO:'bg-danger/10 text-danger border-danger/20',
};

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function TrialDays({ trialStartedAt }) {
  if (!trialStartedAt) return <span className="text-ink-muted">—</span>;
  const elapsed = Math.floor((Date.now() - new Date(trialStartedAt)) / 86_400_000);
  const left    = Math.max(0, 14 - elapsed);
  if (left === 0) return <span className="text-xs font-medium text-danger">Vencida</span>;
  return (
    <span className={`text-xs font-medium ${left <= 3 ? 'text-danger' : 'text-amber-600'}`}>
      {left}d restantes
    </span>
  );
}

export default function Tenants() {
  const [list,    setList]    = useState(null);
  const [planes,  setPlanes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(null); // id del tenant guardando

  useEffect(() => {
    Promise.all([tenantsApi.list(), planesApi.list()])
      .then(([ts, ps]) => { setList(ts); setPlanes(ps); })
      .finally(() => setLoading(false));
  }, []);

  async function handleEstado(id, estado) {
    setSaving(id);
    await tenantsApi.update(id, { estado });
    setList(prev => prev.map(t => t.id === id ? { ...t, estado } : t));
    setSaving(null);
  }

  async function handlePlan(id, selectedPlan) {
    setSaving(id);
    await tenantsApi.update(id, { selectedPlan });
    setList(prev => prev.map(t => t.id === id ? { ...t, selectedPlan } : t));
    setSaving(null);
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Cargando tenants…</p>;
  }

  const sorted = [...(list ?? [])].sort((a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Tenants</h1>
          <p className="text-sm text-ink-muted mt-0.5">{sorted.length} espacios registrados</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-xl p-12 text-center">
          <p className="text-ink-muted text-sm">No hay tenants registrados aún.</p>
        </div>
      ) : (
        <div className="bg-surface-100 border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-200/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Espacio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Rubro</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Prueba</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Registro</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-b border-border/50 transition-colors hover:bg-surface-200/30 ${
                    saving === t.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Espacio */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{t.nombre || '—'}</p>
                    {t.usuario?.email && (
                      <p className="text-xs text-ink-muted font-mono">{t.usuario.email}</p>
                    )}
                  </td>

                  {/* Rubro */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-ink-muted">
                      {t.rubroPersonalizado || t.rubro?.nombre || '—'}
                    </span>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-3">
                    <select
                      value={t.selectedPlan || t.planId || ''}
                      onChange={(e) => handlePlan(t.id, e.target.value || null)}
                      disabled={saving === t.id}
                      className="text-xs border border-border rounded px-2 py-1 bg-white text-ink focus:outline-none focus:border-primary"
                    >
                      <option value="">Sin plan</option>
                      {planes.map(p => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </td>

                  {/* Prueba */}
                  <td className="px-4 py-3">
                    <TrialDays trialStartedAt={t.trialStartedAt} />
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3">
                    <select
                      value={t.estado || 'ACTIVO'}
                      onChange={(e) => handleEstado(t.id, e.target.value)}
                      disabled={saving === t.id}
                      className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-primary font-medium ${
                        ESTADO_COLORS[t.estado] || ESTADO_COLORS.ACTIVO
                      } bg-transparent`}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                      <option value="SUSPENDIDO">Suspendido</option>
                    </select>
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-3 text-xs text-ink-muted">
                    {formatFecha(t.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
