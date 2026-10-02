import { useEffect, useState } from 'react';
import { tenants as tenantsApi, planes as planesApi, userManagement } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';

const ESTADO_COLORS = {
  ACTIVO:    'bg-emerald-100 text-emerald-700 border-emerald-200',
  INACTIVO:  'bg-surface-200 text-ink-muted border-border',
  SUSPENDIDO:'bg-danger/10 text-danger border-danger/20',
};

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

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

// ── Modal de reset de contraseña ──────────────────────────────────────────────

function ResetModal({ tenant, onClose }) {
  const [email,   setEmail]   = useState(tenant?.usuario?.email ?? tenant?.email ?? '');
  const [phase,   setPhase]   = useState('confirm'); // 'confirm' | 'loading' | 'success' | 'error'
  const [errMsg,  setErrMsg]  = useState('');

  async function handleSend() {
    if (!email.trim()) return;
    setPhase('loading');
    try {
      await userManagement.sendPasswordReset(email.trim());
      setPhase('success');
    } catch {
      setErrMsg('No se pudo enviar el email. Verificá que la dirección sea correcta.');
      setPhase('error');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={phase !== 'loading' ? onClose : undefined} />
      <div className="relative bg-surface-100 border border-border rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          {phase === 'success' ? (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-display text-lg text-ink text-center mb-1">¡Email enviado!</h3>
              <p className="text-sm text-ink-muted text-center mb-5">
                El enlace de recuperación fue enviado a<br />
                <span className="font-semibold text-ink">{email}</span>
              </p>
              <button onClick={onClose}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-strong transition-colors">
                Cerrar
              </button>
            </>
          ) : (
            <>
              <h3 className="font-display text-lg text-ink mb-1">Reset de contraseña</h3>
              <p className="text-sm text-ink-muted mb-4">
                Se enviará un enlace de recuperación al email del tenant.
              </p>
              <div className="mb-5">
                <label className={LABEL_CLS}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@tenant.com"
                  autoFocus
                  className={INPUT_CLS}
                />
                {phase === 'error' && (
                  <p className="mt-2 text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">{errMsg}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} disabled={phase === 'loading'}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-ink hover:bg-surface-200 transition-colors disabled:opacity-40">
                  Cancelar
                </button>
                <button onClick={handleSend} disabled={phase === 'loading' || !email.trim()}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-40">
                  {phase === 'loading' ? 'Enviando…' : 'Enviar enlace'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tenants page ──────────────────────────────────────────────────────────────

export default function Tenants() {
  const [list,         setList]         = useState(null);
  const [planes,       setPlanes]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(null);
  const [search,       setSearch]       = useState('');
  const [blockTarget,  setBlockTarget]  = useState(null);  // tenant a bloquear/desbloquear
  const [resetTarget,  setResetTarget]  = useState(null);  // tenant para reset

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

  async function confirmBloqueado() {
    if (!blockTarget) return;
    setSaving(blockTarget.id);
    await tenantsApi.update(blockTarget.id, { bloqueado: !blockTarget.bloqueado });
    setList(prev => prev.map(t => t.id === blockTarget.id ? { ...t, bloqueado: !blockTarget.bloqueado } : t));
    setSaving(null);
    setBlockTarget(null);
  }

  if (loading) {
    return <p className="text-sm text-ink-muted">Cargando tenants…</p>;
  }

  const sorted   = [...(list ?? [])].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const filtered = sorted.filter(t => matchSearch(t, search));

  // Mapa userId → todos sus espacios (para mostrar espacios adicionales)
  const userSpacesMap = {};
  sorted.forEach(t => {
    if (!t.userId) return;
    if (!userSpacesMap[t.userId]) userSpacesMap[t.userId] = [];
    userSpacesMap[t.userId].push(t);
  });

  return (
    <>
      {/* Modal bloquear / desbloquear */}
      {blockTarget && (
        <ConfirmModal
          title={blockTarget.bloqueado ? `¿Desbloquear "${blockTarget.nombre}"?` : `¿Bloquear "${blockTarget.nombre}"?`}
          text={blockTarget.bloqueado
            ? 'El tenant podrá volver a acceder a la plataforma.'
            : 'El tenant no podrá iniciar sesión ni usar la plataforma.'}
          confirmText={blockTarget.bloqueado ? 'Sí, desbloquear' : 'Sí, bloquear'}
          danger={!blockTarget.bloqueado}
          onConfirm={confirmBloqueado}
          onClose={() => setBlockTarget(null)}
        />
      )}

      {/* Modal reset de contraseña */}
      {resetTarget && (
        <ResetModal tenant={resetTarget} onClose={() => setResetTarget(null)} />
      )}

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
                {filtered.map(t => {
                  const otrosEspacios = t.userId
                    ? (userSpacesMap[t.userId] ?? []).filter(e => e.id !== t.id)
                    : [];
                  const logoShape = t.logoShape === 'square' ? 'rounded-lg' : 'rounded-full';

                  return (
                  <tr
                    key={t.id}
                    className={`border-b border-border/50 transition-colors hover:bg-surface-200/30 ${
                      saving === t.id ? 'opacity-50' : ''
                    } ${t.bloqueado ? 'bg-danger/3' : ''}`}
                  >
                    {/* Espacio */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {/* Logo */}
                        <div className={`shrink-0 w-9 h-9 ${logoShape} overflow-hidden bg-surface-200 border border-border flex items-center justify-center`}>
                          {t.logoUrl
                            ? <img src={t.logoUrl} alt="" className="w-full h-full object-cover" />
                            : <span className="text-sm font-bold text-ink-muted select-none">
                                {(t.nombre?.[0] ?? '?').toUpperCase()}
                              </span>
                          }
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-medium text-ink leading-tight">{t.nombre || '—'}</p>
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
                            <p className="text-xs text-ink-muted font-mono mt-0.5">{t.usuario.email}</p>
                          )}
                          {/* Espacios adicionales del mismo usuario */}
                          {otrosEspacios.length > 0 && (
                            <div className="flex flex-col gap-0.5 mt-1.5">
                              {otrosEspacios.map(e => {
                                const eShape = e.logoShape === 'square' ? 'rounded' : 'rounded-full';
                                return (
                                  <div key={e.id} className="flex items-center gap-1.5">
                                    <div className={`w-4 h-4 ${eShape} overflow-hidden bg-surface-200 border border-border shrink-0 flex items-center justify-center`}>
                                      {e.logoUrl
                                        ? <img src={e.logoUrl} alt="" className="w-full h-full object-cover" />
                                        : <span className="text-[8px] font-bold text-ink-muted">{(e.nombre?.[0] ?? '?').toUpperCase()}</span>
                                      }
                                    </div>
                                    <span className="text-[11px] text-ink-muted truncate max-w-[120px]">{e.nombre}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
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

                    {/* Acciones — ancho fijo para que no se mueva */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setResetTarget(t)}
                          disabled={saving === t.id}
                          title="Enviar reset de contraseña"
                          className="w-16 text-center text-xs py-1 border border-border rounded text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors disabled:opacity-30"
                        >
                          ↺ Reset
                        </button>
                        <button
                          onClick={() => setBlockTarget(t)}
                          disabled={saving === t.id}
                          className={`w-24 text-center text-xs py-1 rounded border transition-colors disabled:opacity-30 ${
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
