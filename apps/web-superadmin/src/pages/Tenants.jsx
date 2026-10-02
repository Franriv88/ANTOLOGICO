import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { tenants as tenantsApi, planes as planesApi, userManagement } from '../services/adminApi';

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

function matchSearch(t, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    (t.nombre ?? '').toLowerCase().includes(lower) ||
    (t.usuario?.email ?? '').toLowerCase().includes(lower) ||
    (t.usuario?.nombre ?? '').toLowerCase().includes(lower) ||
    (t.usuario?.apellido ?? '').toLowerCase().includes(lower) ||
    (t.rubroPersonalizado ?? '').toLowerCase().includes(lower) ||
    (t.rubro?.nombre ?? '').toLowerCase().includes(lower)
  );
}

export default function Tenants() {
  const [list,    setList]    = useState(null);
  const [planes,  setPlanes]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(null);
  const [search,  setSearch]  = useState('');

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

  async function handleBloqueado(t) {
    const accion = t.bloqueado ? 'desbloquear' : 'bloquear';
    const result = await Swal.fire({
      title: t.bloqueado ? `¿Desbloquear "${t.nombre}"?` : `¿Bloquear "${t.nombre}"?`,
      text: t.bloqueado
        ? 'El tenant podrá volver a acceder a la plataforma.'
        : 'El tenant no podrá iniciar sesión ni usar la plataforma.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t.bloqueado ? 'Sí, desbloquear' : 'Sí, bloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E85D4A',
    });
    if (!result.isConfirmed) return;
    setSaving(t.id);
    await tenantsApi.update(t.id, { bloqueado: !t.bloqueado });
    setList(prev => prev.map(x => x.id === t.id ? { ...x, bloqueado: !x.bloqueado } : x));
    setSaving(null);
  }

  async function handleResetPassword(t) {
    const email = t.usuario?.email;
    if (!email) {
      await Swal.fire({ title: 'Sin email', text: 'Este tenant no tiene email registrado.', icon: 'error' });
      return;
    }
    const result = await Swal.fire({
      title: 'Enviar reset de contraseña',
      text: `Se enviará un enlace de recuperación a ${email}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    setSaving(t.id);
    try {
      await userManagement.sendPasswordReset(email);
      await Swal.fire({ title: '¡Enviado!', text: `El enlace fue enviado a ${email}`, icon: 'success' });
    } catch (e) {
      await Swal.fire({ title: 'Error', text: 'No se pudo enviar el email. Intentá de nuevo.', icon: 'error' });
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Cargando tenants…</p>;
  }

  const sorted = [...(list ?? [])].sort((a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );
  const filtered = sorted.filter(t => matchSearch(t, search));

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl text-ink">Tenants</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {filtered.length}{search ? ` de ${sorted.length}` : ''} espacios
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre de espacio, email, rubro…"
          className="w-full max-w-lg px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-xl p-12 text-center">
          <p className="text-ink-muted text-sm">
            {sorted.length === 0 ? 'No hay tenants registrados aún.' : 'No hay resultados para esa búsqueda.'}
          </p>
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
                <th className="px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr
                  key={t.id}
                  className={`border-b border-border/50 transition-colors hover:bg-surface-200/30 ${
                    saving === t.id ? 'opacity-50' : ''
                  } ${t.bloqueado ? 'bg-danger/3' : ''}`}
                >
                  {/* Espacio */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink">{t.nombre || '—'}</p>
                      {t.bloqueado && (
                        <span className="text-[10px] font-bold bg-danger text-white rounded px-1.5 py-0.5 leading-tight shrink-0">
                          BLOQUEADO
                        </span>
                      )}
                      {t.estado === 'SUSPENDIDO' && !t.bloqueado && (
                        <span className="text-[10px] font-bold bg-danger/10 text-danger border border-danger/20 rounded px-1.5 py-0.5 leading-tight shrink-0">
                          SUSPENDIDO
                        </span>
                      )}
                    </div>
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
                      onChange={e => handlePlan(t.id, e.target.value || null)}
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
                      onChange={e => handleEstado(t.id, e.target.value)}
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
                  <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                    {formatFecha(t.createdAt)}
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetPassword(t)}
                        disabled={saving === t.id || !t.usuario?.email}
                        title="Enviar reset de contraseña"
                        className="text-xs px-2 py-1 border border-border rounded text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors disabled:opacity-30"
                      >
                        ↺ Reset
                      </button>
                      <button
                        onClick={() => handleBloqueado(t)}
                        disabled={saving === t.id}
                        className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-30 ${
                          t.bloqueado
                            ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            : 'border-danger/20 text-danger hover:bg-danger/5'
                        }`}
                      >
                        {t.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    </div>
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
