import { useEffect, useState } from 'react';
import { tenants as tenantsApi, planes as planesApi, userManagement } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

function EstadoBadge({ bloqueado, trialStartedAt, planId, selectedPlan }) {
  if (bloqueado) {
    return <span className="text-xs font-medium bg-danger/10 text-danger border border-danger/20 rounded-full px-2.5 py-0.5 whitespace-nowrap">Bloqueado</span>;
  }
  if (trialStartedAt && !planId && !selectedPlan) {
    const elapsed = Math.floor((Date.now() - new Date(trialStartedAt)) / 86_400_000);
    if (elapsed >= 14) {
      return <span className="text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">Falto de pago</span>;
    }
  }
  return <span className="text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">Activo</span>;
}
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function TrialDays({ trialStartedAt }) {
  if (!trialStartedAt) return <span className="text-ink-muted text-xs">—</span>;
  const elapsed = Math.floor((Date.now() - new Date(trialStartedAt)) / 86_400_000);
  const left    = Math.max(0, 14 - elapsed);
  if (left === 0) return <span className="text-xs font-medium text-danger">Vencida</span>;
  return (
    <span className={`text-xs font-medium ${left <= 3 ? 'text-danger' : 'text-amber-600'}`}>
      {left}d restantes
    </span>
  );
}

// Agrupa la lista plana de espacios por userId
// El espacio "principal" es el más antiguo (primer registro)
function buildGroups(list) {
  const groups = [];
  const seen   = new Set();
  // Iterar en orden cronológico ascendente para que el primero de cada userId sea el más antiguo
  const asc = [...list].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  asc.forEach(esp => {
    const key = esp.userId ?? `__anon__${esp.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    // Todos los espacios de este userId, el primero (index 0) es el principal
    const espacios = asc.filter(e => (e.userId ?? `__anon__${e.id}`) === key);
    groups.push({
      key,
      userId:         esp.userId,
      usuario:        esp.usuario,
      primary:        espacios[0],       // espacio más antiguo = principal
      extras:         espacios.slice(1), // el resto
      espacios,
      bloqueado:      espacios.some(e => e.bloqueado),
      // Si no hay trialStartedAt (espacios viejos), usar createdAt como inicio de prueba
      trialStartedAt: espacios[0]?.trialStartedAt ?? espacios[0]?.createdAt,
      // fecha de ingreso = registro más antiguo
      createdAt:      espacios[0]?.createdAt,
    });
  });
  // Devolver grupos ordenados por registro más reciente (desc) para el display
  return groups.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function matchGroup(group, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  const u     = group.usuario ?? {};
  return (
    (u.email     ?? '').toLowerCase().includes(lower) ||
    (u.nombre    ?? '').toLowerCase().includes(lower) ||
    (u.apellido  ?? '').toLowerCase().includes(lower) ||
    group.espacios.some(e =>
      (e.nombre            ?? '').toLowerCase().includes(lower) ||
      (e.rubroPersonalizado ?? '').toLowerCase().includes(lower) ||
      (e.rubro?.nombre      ?? '').toLowerCase().includes(lower)
    )
  );
}

// ── Modal de reset de contraseña ──────────────────────────────────────────────

function ResetModal({ group, onClose }) {
  const email0 = group?.usuario?.email ?? '';
  const [email,  setEmail]  = useState(email0);
  const [phase,  setPhase]  = useState('confirm');
  const [errMsg, setErrMsg] = useState('');

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
              <button onClick={onClose} className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-strong transition-colors">
                Cerrar
              </button>
            </>
          ) : (
            <>
              <h3 className="font-display text-lg text-ink mb-1">Reset de contraseña</h3>
              <p className="text-sm text-ink-muted mb-4">Se enviará un enlace de recuperación al email del tenant.</p>
              <div className="mb-5">
                <label className={LABEL_CLS}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@tenant.com" autoFocus className={INPUT_CLS} />
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
  const [blockTarget,  setBlockTarget]  = useState(null);
  const [resetTarget,  setResetTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    Promise.all([tenantsApi.list(), planesApi.list()])
      .then(([ts, ps]) => { setList(ts); setPlanes(ps); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    const { key, espacios, userId } = deleteTarget;
    setSaving(key);
    await tenantsApi.remove(espacios.map(e => e.id), userId);
    setList(prev => prev.filter(t => (t.userId ?? `__anon__${t.id}`) !== key));
    setSaving(null);
    setDeleteTarget(null);
  }

  async function confirmBloqueado() {
    if (!blockTarget) return;
    const { key, espacios, bloqueado } = blockTarget;
    setSaving(key);
    await Promise.all(espacios.map(e => tenantsApi.update(e.id, { bloqueado: !bloqueado })));
    setList(prev => prev.map(t =>
      (t.userId ?? `__anon__${t.id}`) === key ? { ...t, bloqueado: !bloqueado } : t
    ));
    setSaving(null);
    setBlockTarget(null);
  }

  if (loading) return <p className="text-sm text-ink-muted">Cargando tenants…</p>;

  const flat     = list ?? [];
  const groups   = buildGroups(flat);
  const filtered = groups.filter(g => matchGroup(g, search));

  return (
    <>
      {blockTarget && (
        <ConfirmModal
          title={blockTarget.bloqueado ? '¿Desbloquear este tenant?' : '¿Bloquear este tenant?'}
          text={blockTarget.bloqueado
            ? 'El tenant podrá volver a acceder a la plataforma y todos sus espacios.'
            : `Se bloquearán todos sus espacios (${blockTarget.espacios.length}). No podrá iniciar sesión.`}
          confirmText={blockTarget.bloqueado ? 'Sí, desbloquear' : 'Sí, bloquear'}
          danger={!blockTarget.bloqueado}
          onConfirm={confirmBloqueado}
          onClose={() => setBlockTarget(null)}
        />
      )}

      {resetTarget && (
        <ResetModal group={resetTarget} onClose={() => setResetTarget(null)} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="¿Eliminar este tenant?"
          text={`Se eliminarán permanentemente todos sus espacios (${deleteTarget.espacios.length}), workshops, reservas y perfil de usuario. Esta acción no se puede deshacer.`}
          confirmText="Sí, eliminar"
          danger
          onConfirm={confirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-ink">Tenants</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              {filtered.length}{search ? ` de ${groups.length}` : ''} tenants · {flat.length} espacios
            </p>
          </div>
        </div>

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
              {groups.length === 0 ? 'No hay tenants registrados aún.' : 'No hay resultados para esa búsqueda.'}
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
                {filtered.map(group => {
                  const { primary, extras, bloqueado } = group;
                  const isSaving  = saving === group.key || saving === primary.id;
                  const logoShape = primary.logoShape === 'square' ? 'rounded-lg' : 'rounded-full';

                  return (
                    <tr
                      key={group.key}
                      className={`border-b border-border/50 hover:bg-surface-200/20 transition-colors ${
                        isSaving ? 'opacity-50' : ''
                      } ${bloqueado ? 'bg-danger/[0.03]' : ''}`}
                    >
                      {/* ── Espacio ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          {/* Logo principal */}
                          <div className={`shrink-0 w-10 h-10 ${logoShape} overflow-hidden bg-surface-200 border border-border flex items-center justify-center`}>
                            {primary.logoUrl
                              ? <img src={primary.logoUrl} alt="" className="w-full h-full object-cover" />
                              : <span className="text-sm font-bold text-ink-muted select-none">
                                  {(primary.nombre?.[0] ?? '?').toUpperCase()}
                                </span>
                            }
                          </div>

                          <div className="min-w-0">
                            {/* Nombre del espacio principal + badges */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-medium text-ink leading-tight">{primary.nombre || '—'}</p>
                              {bloqueado && (
                                <span className="text-[10px] font-bold bg-danger text-white rounded px-1.5 py-0.5 leading-tight shrink-0">
                                  BLOQUEADO
                                </span>
                              )}
                            </div>

                            {/* Nombre, apellido y email */}
                            {group.usuario ? (
                              <>
                                {(group.usuario.nombre || group.usuario.apellido) && (
                                  <p className="text-xs text-ink-muted mt-0.5">
                                    {[group.usuario.nombre, group.usuario.apellido].filter(Boolean).join(' ')}
                                  </p>
                                )}
                                {group.usuario.email && (
                                  <p className="text-xs text-ink-muted font-mono mt-0.5">{group.usuario.email}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-[11px] text-ink-muted/60 mt-0.5 italic">Sin perfil de usuario</p>
                            )}

                            {/* Espacios adicionales */}
                            {extras.length > 0 && (
                              <div className="flex flex-col gap-1 mt-2">
                                {extras.map(e => {
                                  const eShape = e.logoShape === 'square' ? 'rounded' : 'rounded-full';
                                  return (
                                    <div key={e.id} className="flex items-center gap-1.5">
                                      <div className={`shrink-0 w-4 h-4 ${eShape} overflow-hidden bg-surface-200 border border-border flex items-center justify-center`}>
                                        {e.logoUrl
                                          ? <img src={e.logoUrl} alt="" className="w-full h-full object-cover" />
                                          : <span className="text-[8px] font-bold text-ink-muted leading-none">{(e.nombre?.[0] ?? '?').toUpperCase()}</span>
                                        }
                                      </div>
                                      <span className="text-[11px] text-ink-muted truncate max-w-[140px]">{e.nombre}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ── Rubro (del espacio principal) ── */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-muted">
                          {primary.rubroPersonalizado || primary.rubro?.nombre || '—'}
                        </span>
                      </td>

                      {/* ── Plan (del espacio principal) ── */}
                      <td className="px-4 py-3">
                        {(() => {
                          const raw = primary.selectedPlan || primary.planId;
                          const pid = (raw === 'null' || raw === 'undefined' || !raw) ? null : raw;
                          const nombre = pid ? (planes.find(p => p.id === pid)?.nombre ?? null) : null;
                          return nombre
                            ? <span className="text-xs font-medium text-ink">{nombre}</span>
                            : <span className="text-xs text-ink-muted">Sin plan</span>;
                        })()}
                      </td>

                      {/* ── Prueba ── */}
                      <td className="px-4 py-3">
                        <TrialDays trialStartedAt={group.trialStartedAt} />
                      </td>

                      {/* ── Estado ── */}
                      <td className="px-4 py-3">
                        <EstadoBadge
                          bloqueado={bloqueado}
                          trialStartedAt={group.trialStartedAt}
                          planId={primary.planId}
                          selectedPlan={primary.selectedPlan}
                        />
                      </td>

                      {/* ── Registro (fecha más antigua del tenant) ── */}
                      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                        {formatFecha(group.createdAt)}
                      </td>

                      {/* ── Acciones — ancho fijo ── */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setResetTarget(group)}
                            disabled={isSaving}
                            title="Enviar reset de contraseña"
                            className="w-16 text-center text-xs py-1 border border-border rounded text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors disabled:opacity-30"
                          >
                            ↺ Reset
                          </button>
                          <button
                            onClick={() => setBlockTarget(group)}
                            disabled={isSaving}
                            className={`w-24 text-center text-xs py-1 rounded border transition-colors disabled:opacity-30 ${
                              bloqueado
                                ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                : 'border-danger/20 text-danger hover:bg-danger/5'
                            }`}
                          >
                            {bloqueado ? 'Desbloquear' : 'Bloquear'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(group)}
                            disabled={isSaving}
                            title="Eliminar tenant"
                            className="w-8 h-6 flex items-center justify-center rounded border border-danger/20 text-danger hover:bg-danger/5 transition-colors disabled:opacity-30"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
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
