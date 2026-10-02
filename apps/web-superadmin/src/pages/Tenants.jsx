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
function buildGroups(list) {
  const groups = [];
  const seen   = new Set();
  list.forEach(esp => {
    const key = esp.userId ?? `__anon__${esp.id}`;
    if (seen.has(key)) return;
    seen.add(key);
    const espacios = list.filter(e => (e.userId ?? `__anon__${e.id}`) === key);
    // Fecha de registro = espacio más antiguo
    const createdAt = espacios.reduce(
      (min, e) => (!min || (e.createdAt && e.createdAt < min)) ? e.createdAt : min,
      null
    );
    groups.push({
      key,
      userId:         esp.userId,
      usuario:        esp.usuario,
      espacios,
      bloqueado:      espacios.some(e => e.bloqueado),
      trialStartedAt: espacios[0]?.trialStartedAt,
      createdAt,
    });
  });
  return groups;
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
  const email0 = group?.usuario?.email ?? group?.espacios?.[0]?.email ?? '';
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
  const [list,        setList]        = useState(null);
  const [planes,      setPlanes]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(null); // userId o id
  const [search,      setSearch]      = useState('');
  const [blockTarget, setBlockTarget] = useState(null); // group
  const [resetTarget, setResetTarget] = useState(null); // group

  useEffect(() => {
    Promise.all([tenantsApi.list(), planesApi.list()])
      .then(([ts, ps]) => { setList(ts); setPlanes(ps); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleEstado(espacioId, estado) {
    setSaving(espacioId);
    await tenantsApi.update(espacioId, { estado });
    setList(prev => prev.map(t => t.id === espacioId ? { ...t, estado } : t));
    setSaving(null);
  }

  async function handlePlan(espacioId, selectedPlan) {
    setSaving(espacioId);
    await tenantsApi.update(espacioId, { selectedPlan });
    setList(prev => prev.map(t => t.id === espacioId ? { ...t, selectedPlan } : t));
    setSaving(null);
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

  const sorted   = [...(list ?? [])].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const groups   = buildGroups(sorted);
  const filtered = groups.filter(g => matchGroup(g, search));

  return (
    <>
      {blockTarget && (
        <ConfirmModal
          title={blockTarget.bloqueado
            ? `¿Desbloquear a este tenant?`
            : `¿Bloquear a este tenant?`}
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

      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-ink">Tenants</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              {filtered.length}{search ? ` de ${groups.length}` : ''} tenants
              {' · '}{sorted.length} espacios
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
          <div className="flex flex-col gap-3">
            {filtered.map(group => {
              const isSaving    = saving === group.key;
              const userInitial = (group.usuario?.nombre ?? group.espacios[0]?.nombre ?? '?')[0].toUpperCase();

              return (
                <div
                  key={group.key}
                  className={`bg-surface-100 border rounded-xl overflow-hidden transition-opacity ${
                    group.bloqueado ? 'border-danger/30 bg-danger/5' : 'border-border'
                  } ${isSaving ? 'opacity-50' : ''}`}
                >
                  {/* ── Fila del tenant (usuario) ── */}
                  <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50">
                    {/* Avatar del usuario */}
                    <div className="shrink-0 w-9 h-9 rounded-full bg-surface-200 border border-border flex items-center justify-center text-sm font-bold text-ink-muted select-none">
                      {userInitial}
                    </div>

                    {/* Info del usuario */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-semibold text-ink">
                          {group.usuario?.nombre ?? group.usuario?.email ?? '—'}
                        </p>
                        {group.bloqueado && (
                          <span className="text-[10px] font-bold bg-danger text-white rounded px-1.5 py-0.5 leading-tight">
                            BLOQUEADO
                          </span>
                        )}
                      </div>
                      {group.usuario?.email && (
                        <p className="text-xs font-mono text-ink-muted">{group.usuario.email}</p>
                      )}
                    </div>

                    {/* Trial */}
                    <div className="shrink-0 hidden sm:block">
                      <TrialDays trialStartedAt={group.trialStartedAt} />
                    </div>

                    {/* Registro */}
                    <p className="shrink-0 text-xs text-ink-muted whitespace-nowrap hidden md:block">
                      {formatFecha(group.createdAt)}
                    </p>

                    {/* Acciones — ancho fijo */}
                    <div className="shrink-0 flex items-center gap-2">
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
                          group.bloqueado
                            ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                            : 'border-danger/20 text-danger hover:bg-danger/5'
                        }`}
                      >
                        {group.bloqueado ? 'Desbloquear' : 'Bloquear'}
                      </button>
                    </div>
                  </div>

                  {/* ── Filas de espacios ── */}
                  {group.espacios.map((esp, i) => {
                    const logoShape = esp.logoShape === 'square' ? 'rounded-lg' : 'rounded-full';
                    return (
                      <div
                        key={esp.id}
                        className={`flex items-center gap-3 px-4 py-2.5 ${
                          i < group.espacios.length - 1 ? 'border-b border-border/30' : ''
                        } bg-surface-100/50`}
                      >
                        {/* Logo del espacio */}
                        <div className={`shrink-0 w-8 h-8 ${logoShape} overflow-hidden bg-surface-200 border border-border flex items-center justify-center`}>
                          {esp.logoUrl
                            ? <img src={esp.logoUrl} alt="" className="w-full h-full object-cover" />
                            : <span className="text-xs font-bold text-ink-muted select-none">
                                {(esp.nombre?.[0] ?? '?').toUpperCase()}
                              </span>
                          }
                        </div>

                        {/* Nombre + rubro */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{esp.nombre || '—'}</p>
                          <p className="text-xs text-ink-muted truncate">
                            {esp.rubroPersonalizado || esp.rubro?.nombre || '—'}
                          </p>
                        </div>

                        {/* Plan */}
                        <select
                          value={esp.selectedPlan || esp.planId || ''}
                          onChange={e => handlePlan(esp.id, e.target.value || null)}
                          disabled={saving === esp.id}
                          className="text-xs border border-border rounded px-2 py-1 bg-white text-ink focus:outline-none focus:border-primary shrink-0"
                        >
                          <option value="">Sin plan</option>
                          {planes.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>

                        {/* Estado */}
                        <select
                          value={esp.estado || 'ACTIVO'}
                          onChange={e => handleEstado(esp.id, e.target.value)}
                          disabled={saving === esp.id}
                          className={`text-xs border rounded px-2 py-1 focus:outline-none focus:border-primary font-medium shrink-0 ${
                            ESTADO_COLORS[esp.estado] || ESTADO_COLORS.ACTIVO
                          } bg-transparent`}
                        >
                          <option value="ACTIVO">Activo</option>
                          <option value="INACTIVO">Inactivo</option>
                          <option value="SUSPENDIDO">Suspendido</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
