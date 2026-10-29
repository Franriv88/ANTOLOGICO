import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { tenants as tenantsApi, planes as planesApi, userManagement } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';
import { AntologicoLoaderCream } from '../components/AntologicoLoaderCream';

function FilterGroup({ label, value, onChange, options }) {
  const [animKey, setAnimKey] = useState(null);
  return (
    <div className="flex items-center gap-1 bg-surface-100 border border-border rounded-xl p-1">
      <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider px-2 select-none">{label}</span>
      {options.map(f => {
        const active = value === f.key;
        return (
          <button
            key={f.key}
            onClick={() => { if (f.key !== value) { setAnimKey(f.key); onChange(f.key); } }}
            onAnimationEnd={() => setAnimKey(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              active
                ? 'bg-primary text-white shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-surface-200'
            }`}
            style={active && animKey === f.key ? {
              animation: 'filterStretch .35s cubic-bezier(.34,1.56,.64,1)',
            } : undefined}
          >
            {f.label}
          </button>
        );
      })}
      <style>{`@keyframes filterStretch{0%{transform:scaleX(1)}30%{transform:scaleX(1.18) scaleY(.92)}60%{transform:scaleX(.96) scaleY(1.04)}100%{transform:scaleX(1) scaleY(1)}}`}</style>
    </div>
  );
}

const TENANT_ORIGIN = 'https://www.antologico.app';

/** Construye la URL pública de un espacio (subdominio si tiene slug, sino /p/:id). */
function espacioPublicUrl(espacio) {
  if (!espacio) return null;
  if (espacio.slug) return `https://${espacio.slug}.antologico.app`;
  return `${TENANT_ORIGIN}/p/${espacio.id}`;
}

const INPUT_CLS = 'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

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

// ── Modal de detalle de tenant ────────────────────────────────────────────────

function calcAge(fechaNac) {
  if (!fechaNac) return null;
  const birth = new Date(fechaNac);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const GENERO_LABELS = {
  'masculino': 'Masculino',
  'femenino': 'Femenino',
  'no-binario': 'No binario',
  'prefiero-no-decirlo': 'Prefiero no decirlo',
};

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-ink-muted w-32 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-ink break-all">{children || '—'}</span>
    </div>
  );
}

function TenantDetailModal({ group, planes, onClose }) {
  const u = group.usuario ?? {};
  const p = group.primary;
  const age = calcAge(u.fechaNac);
  const authLabel = u.authMethod === 'google' ? 'Google Sign-In' : u.authMethod === 'email' ? 'Email y contraseña' : '—';
  const rubro = p.rubroPersonalizado || p.rubro?.nombre || '—';
  const generoLabel = GENERO_LABELS[u.genero] || u.genero || 'Prefiero no decirlo';
  const planNombre = p.plan?.nombre || ((() => {
    const raw = p.selectedPlan || p.planId;
    const pid = (raw === 'null' || raw === 'undefined' || !raw) ? null : raw;
    return pid ? (planes.find(pl => pl.id === pid)?.nombre ?? null) : null;
  })()) || 'Sin plan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-100 border border-border rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border flex items-start gap-4">
          {u.photoURL ? (
            <img
              src={u.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-border shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-primary">
                {(u.nombre?.[0] || p.nombre?.[0] || '?').toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg text-ink leading-tight">
              {[u.nombre, u.apellido].filter(Boolean).join(' ') || p.nombre || '—'}
            </h3>
            {u.email && <p className="text-sm text-ink-muted font-mono mt-0.5">{u.email}</p>}
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                u.authMethod === 'google'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {authLabel}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-200 transition-colors text-ink-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <DetailRow label="Teléfono">{u.telefono}</DetailRow>
          <DetailRow label="Género">{generoLabel}</DetailRow>
          <DetailRow label="Fecha de nac.">
            {u.fechaNac ? (
              <span>
                {new Date(u.fechaNac).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                {age != null && <span className="text-ink-muted ml-1.5">({age} años)</span>}
              </span>
            ) : '—'}
          </DetailRow>
          <DetailRow label="Rubro">{rubro}</DetailRow>
          <DetailRow label="Plan">{planNombre}</DetailRow>
          <DetailRow label="Espacio principal">{p.nombre || '—'}</DetailRow>
          {group.extras.length > 0 && (
            <DetailRow label="Otros espacios">
              <div className="flex flex-col gap-1">
                {group.extras.map(e => (
                  <span key={e.id} className="text-xs text-ink-muted">{e.nombre}</span>
                ))}
              </div>
            </DetailRow>
          )}
          <DetailRow label="Cliente desde">{formatFecha(u.createdAt || group.createdAt)}</DetailRow>
          <DetailRow label="Último ingreso">{formatDateTime(u.lastLoginAt)}</DetailRow>

          {/* QRs de todos los espacios del tenant */}
          <EspaciosQRs espacios={[p, ...group.extras]} />
        </div>
      </div>
    </div>
  );
}

// ── Sección de QRs por espacio dentro del detalle del tenant ─────────────────

function EspaciosQRs({ espacios }) {
  const items = (espacios || []).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <div className="mt-5 pt-5 border-t border-border">
      <h4 className="text-xs font-semibold text-ink uppercase tracking-wide mb-3">
        {items.length === 1 ? 'QR del espacio' : `QRs de los espacios (${items.length})`}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(e => {
          const url = espacioPublicUrl(e);
          return (
            <div key={e.id} className="bg-surface-0 border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-md shrink-0 border border-border/60">
                {url ? (
                  <QRCodeSVG value={url} size={76} bgColor="#FFFFFF" fgColor="#1A1611" level="M" marginSize={0} />
                ) : (
                  <div className="w-[76px] h-[76px] flex items-center justify-center text-[10px] text-ink-muted text-center">
                    Sin URL
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink leading-tight truncate">{e.nombre || 'Espacio sin nombre'}</p>
                {url && (
                  <>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-primary hover:underline break-all mt-1 inline-block"
                      title={url}
                    >
                      {url.replace(/^https?:\/\//, '')}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        try { navigator.clipboard.writeText(url); } catch { /* ignore */ }
                      }}
                      className="block mt-1.5 text-[10px] text-ink-muted hover:text-primary"
                    >
                      Copiar enlace
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
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
  const [filterAuth,   setFilterAuth]   = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [blockTarget,  setBlockTarget]  = useState(null);
  const [resetTarget,  setResetTarget]  = useState(null);
  const [trialTarget,  setTrialTarget]  = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

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

  async function confirmResetTrial() {
    if (!trialTarget) return;
    const { key, espacios } = trialTarget;
    setSaving(key);
    const now = await tenantsApi.resetTrial(espacios.map(e => e.id));
    setList(prev => prev.map(t =>
      espacios.some(e => e.id === t.id) ? { ...t, trialStartedAt: now } : t
    ));
    setSaving(null);
    setTrialTarget(null);
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

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <AntologicoLoaderCream size={300} />
    </div>
  );

  const flat     = list ?? [];
  const groups   = buildGroups(flat);

  function groupEstado(g) {
    if (g.bloqueado) return 'bloqueado';
    if (g.trialStartedAt && !g.primary.planId && !g.primary.selectedPlan) {
      const elapsed = Math.floor((Date.now() - new Date(g.trialStartedAt)) / 86_400_000);
      if (elapsed >= 14) return 'falto';
    }
    return 'activo';
  }

  const filtered = groups.filter(g => {
    if (!matchGroup(g, search)) return false;
    if (filterAuth !== 'todos') {
      const method = g.usuario?.authMethod ?? '';
      if (filterAuth === 'google' && method !== 'google') return false;
      if (filterAuth === 'email'  && method !== 'email')  return false;
    }
    if (filterEstado !== 'todos') {
      if (groupEstado(g) !== filterEstado) return false;
    }
    return true;
  });

  return (
    <>
      {detailTarget && (
        <TenantDetailModal group={detailTarget} planes={planes} onClose={() => setDetailTarget(null)} />
      )}

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

      {trialTarget && (
        <ConfirmModal
          title="¿Resetear período de prueba?"
          text={`Se reiniciará la prueba gratuita de "${trialTarget.primary.nombre}" (${trialTarget.espacios.length} espacio${trialTarget.espacios.length > 1 ? 's' : ''}). El contador empezará desde hoy.`}
          confirmText="Sí, resetear"
          onConfirm={confirmResetTrial}
          onClose={() => setTrialTarget(null)}
        />
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

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre de espacio, email, rubro…"
            className="flex-1 min-w-[240px] max-w-lg px-4 py-2.5 bg-surface-100 border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
          />

          <FilterGroup label="AUTH" value={filterAuth} onChange={setFilterAuth} options={[
            { key: 'todos',  label: 'Todos' },
            { key: 'google', label: 'Google' },
            { key: 'email',  label: 'Email' },
          ]} />

          <FilterGroup label="ESTADO" value={filterEstado} onChange={setFilterEstado} options={[
            { key: 'todos',     label: 'Todos' },
            { key: 'activo',    label: 'Activo' },
            { key: 'bloqueado', label: 'Bloqueado' },
            { key: 'falto',     label: 'Falto de pago' },
          ]} />
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
                      onClick={() => setDetailTarget(group)}
                      className={`border-b border-border/50 hover:bg-surface-200/20 transition-colors cursor-pointer ${
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
                          const nombre = primary.plan?.nombre || (() => {
                            const raw = primary.selectedPlan || primary.planId;
                            const pid = (raw === 'null' || raw === 'undefined' || !raw) ? null : raw;
                            return pid ? (planes.find(p => p.id === pid)?.nombre ?? null) : null;
                          })();
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
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setTrialTarget(group)}
                            disabled={isSaving || !!primary.planId}
                            title={primary.planId ? 'Tiene plan activo' : 'Resetear período de prueba'}
                            className="w-16 text-center text-xs py-1 border border-border rounded text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors disabled:opacity-30"
                          >
                            ↺ Trial
                          </button>
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
