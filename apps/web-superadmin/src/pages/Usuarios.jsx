import { useEffect, useState } from 'react';
import { usuarios as usuariosApi, userManagement } from '../services/adminApi';
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

const INPUT_CLS = 'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function TipoBadge({ tipo }) {
  if (tipo === 'tenant') {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
        Tenant
      </span>
    );
  }
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
      Alumno
    </span>
  );
}

function AuthBadge({ method }) {
  if (method === 'google') {
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
        Google
      </span>
    );
  }
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-surface-200 text-ink-muted border border-border">
      Email
    </span>
  );
}

function matchUser(u, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    (u.nombre ?? '').toLowerCase().includes(lower) ||
    (u.apellido ?? '').toLowerCase().includes(lower) ||
    (u.email ?? '').toLowerCase().includes(lower) ||
    (u.uid ?? '').toLowerCase().includes(lower) ||
    (u.telefono ?? '').toLowerCase().includes(lower) ||
    u.espacios?.some(e => (e.nombre ?? '').toLowerCase().includes(lower))
  );
}

// ── Modal de detalle ─────────────────────────────────────────────────────────

function DetailRow({ label, children, mono }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs font-medium text-ink-muted w-32 shrink-0 pt-0.5">{label}</span>
      <span className={`text-sm text-ink break-all ${mono ? 'font-mono text-xs' : ''}`}>{children || '—'}</span>
    </div>
  );
}

const GENERO_LABELS = {
  'masculino': 'Masculino',
  'femenino': 'Femenino',
  'no-binario': 'No binario',
  'prefiero-no-decirlo': 'Prefiero no decirlo',
};

function UserDetailModal({ user, onClose, onReset, onAnonymize }) {
  const u = user;
  const generoLabel = GENERO_LABELS[u.genero] || u.genero || 'Prefiero no decirlo';
  const isAnonymized = u.estado === 'ANONIMIZADO';

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
                {(u.nombre?.[0] || '?').toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg text-ink leading-tight">
              {isAnonymized
                ? <span className="text-ink-muted italic">Datos eliminados</span>
                : [u.nombre, u.apellido].filter(Boolean).join(' ') || '—'
              }
            </h3>
            {u.email && <p className="text-sm text-ink-muted font-mono mt-0.5">{u.email}</p>}
            <div className="flex items-center gap-2 mt-1.5">
              <TipoBadge tipo={u.tipo} />
              <AuthBadge method={u.authMethod} />
              {isAnonymized && (
                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Anonimizado
                </span>
              )}
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
          <DetailRow label="User ID" mono>{u.uid}</DetailRow>
          <DetailRow label="Nombre">{u.nombre}</DetailRow>
          <DetailRow label="Apellido">{u.apellido}</DetailRow>
          <DetailRow label="Email">{u.email}</DetailRow>
          <DetailRow label="Teléfono">{u.telefono}</DetailRow>
          <DetailRow label="Género">{generoLabel}</DetailRow>
          <DetailRow label="Fecha de nac.">
            {u.fechaNac ? new Date(u.fechaNac).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : null}
          </DetailRow>
          <DetailRow label="Auth">{u.authMethod === 'google' ? 'Google Sign-In' : u.authMethod === 'email' ? 'Email y contraseña' : null}</DetailRow>
          <DetailRow label="Registro">{formatDateTime(u.createdAt)}</DetailRow>
          <DetailRow label="Último ingreso">{formatDateTime(u.lastLoginAt)}</DetailRow>

          {u.espacios?.length > 0 && (
            <DetailRow label="Espacios">
              <div className="flex flex-col gap-1">
                {u.espacios.map(e => (
                  <span key={e.id} className="text-xs">{e.nombre || 'Sin nombre'}</span>
                ))}
              </div>
            </DetailRow>
          )}

          {u.redesSociales && Object.keys(u.redesSociales).length > 0 && (
            <DetailRow label="Redes">
              <div className="flex flex-col gap-1">
                {Object.entries(u.redesSociales).filter(([, v]) => v).map(([k, v]) => (
                  <span key={k} className="text-xs">{k}: {v}</span>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Actions */}
          {!isAnonymized && (
            <div className="mt-5 pt-5 border-t border-border flex flex-col gap-3">
              {u.authMethod !== 'google' && (
                <button
                  onClick={() => onReset(u)}
                  className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-ink hover:bg-surface-200 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                  </svg>
                  Enviar Reset de Contraseña
                </button>
              )}
              <button
                onClick={() => onAnonymize(u)}
                className="w-full py-2.5 border border-danger/30 rounded-xl text-sm font-medium text-danger hover:bg-danger/5 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Anonimizar datos del usuario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal de reset de contraseña ──────────────────────────────────────────────

function ResetModal({ user, onClose }) {
  const email0 = user?.email ?? '';
  const [email, setEmail] = useState(email0);
  const [phase, setPhase] = useState('confirm');
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
              <p className="text-sm text-ink-muted mb-4">Se enviará un enlace de recuperación al email del usuario.</p>
              <div className="mb-5">
                <label className={LABEL_CLS}>Email *</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@usuario.com" autoFocus className={INPUT_CLS} />
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

// ── CSV export ───────────────────────────────────────────────────────────────

function exportCSV(list) {
  const headers = ['UID', 'Tipo', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Género', 'Fecha Nacimiento', 'Auth', 'Registro', 'Último Ingreso', 'Espacios', 'Estado'];
  const rows = list.map(u => [
    u.uid,
    u.tipo === 'tenant' ? 'Tenant' : 'Alumno',
    u.nombre || '',
    u.apellido || '',
    u.email || '',
    u.telefono || '',
    u.genero || '',
    u.fechaNac || '',
    u.authMethod || '',
    u.createdAt || '',
    u.lastLoginAt || '',
    (u.espacios || []).map(e => e.nombre).join('; '),
    u.estado === 'ANONIMIZADO' ? 'Anonimizado' : 'Activo',
  ]);

  const escape = v => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `antologico-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Página principal ─────────────────────────────────────────────────────────

export default function Usuarios() {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterAuth, setFilterAuth] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [detailTarget, setDetailTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [anonTarget, setAnonTarget] = useState(null);
  const [anonLoading, setAnonLoading] = useState(false);

  useEffect(() => {
    usuariosApi.list()
      .then(setList)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function confirmAnonymize() {
    if (!anonTarget) return;
    setAnonLoading(true);
    try {
      await usuariosApi.anonymize(anonTarget.uid);
      setList(prev => prev.map(u =>
        u.uid === anonTarget.uid
          ? { ...u, nombre: '[Datos eliminados]', apellido: '', email: `anon_${anonTarget.uid.slice(0, 8)}@deleted.antologico`, telefono: '', photoURL: '', fechaNac: null, genero: null, redesSociales: null, estado: 'ANONIMIZADO' }
          : u
      ));
      setDetailTarget(null);
    } catch (err) {
      console.error(err);
    }
    setAnonLoading(false);
    setAnonTarget(null);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <AntologicoLoaderCream size={300} />
    </div>
  );

  const all = list ?? [];

  const emailCount = {};
  all.forEach(u => {
    if (u.email && u.estado !== 'ANONIMIZADO') {
      const key = u.email.toLowerCase();
      emailCount[key] = (emailCount[key] || 0) + 1;
    }
  });
  const duplicateEmails = new Set(Object.entries(emailCount).filter(([, c]) => c > 1).map(([e]) => e));

  const byType = filterTipo === 'todos' ? all
    : filterTipo === 'tenant' ? all.filter(u => u.tipo === 'tenant')
    : filterTipo === 'duplicados' ? all.filter(u => u.email && duplicateEmails.has(u.email.toLowerCase()) && u.estado !== 'ANONIMIZADO')
    : all.filter(u => u.tipo === 'alumno');
  const filtered = byType.filter(u => {
    if (!matchUser(u, search)) return false;
    if (filterAuth !== 'todos') {
      const method = u.authMethod ?? '';
      if (filterAuth === 'google' && method !== 'google') return false;
      if (filterAuth === 'email' && method !== 'email') return false;
    }
    if (filterEstado !== 'todos') {
      if (filterEstado === 'anonimizado' && u.estado !== 'ANONIMIZADO') return false;
      if (filterEstado === 'activo' && u.estado === 'ANONIMIZADO') return false;
    }
    return true;
  });

  const countTenants = all.filter(u => u.tipo === 'tenant').length;
  const countAlumnos = all.filter(u => u.tipo === 'alumno').length;
  const countDuplicados = all.filter(u => u.email && duplicateEmails.has(u.email.toLowerCase()) && u.estado !== 'ANONIMIZADO').length;

  return (
    <>
      {detailTarget && (
        <UserDetailModal
          user={detailTarget}
          onClose={() => setDetailTarget(null)}
          onReset={(u) => { setDetailTarget(null); setResetTarget(u); }}
          onAnonymize={(u) => { setDetailTarget(null); setAnonTarget(u); }}
        />
      )}

      {resetTarget && (
        <ResetModal user={resetTarget} onClose={() => setResetTarget(null)} />
      )}

      {anonTarget && (
        <ConfirmModal
          title="Anonimizar datos del usuario"
          text={`Se eliminarán irreversiblemente todos los datos personales de ${anonTarget.nombre || anonTarget.email}. El email quedará desvinculado y la cuenta de autenticación se desactivará. Las reservas se mantienen pero sin datos personales. Esta acción no se puede deshacer.`}
          confirmText={anonLoading ? 'Anonimizando…' : 'Sí, anonimizar'}
          danger
          confirmDisabled={anonLoading}
          onConfirm={confirmAnonymize}
          onClose={() => !anonLoading && setAnonTarget(null)}
        />
      )}

      <div className="w-full">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl text-ink">Usuarios</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              {all.length} usuarios · {countTenants} tenants · {countAlumnos} alumnos
            </p>
          </div>
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-100 border border-border rounded-xl text-sm font-medium text-ink hover:bg-surface-200 transition-colors disabled:opacity-40"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exportar CSV
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, UID, teléfono…"
            className="flex-1 min-w-[240px] max-w-lg px-4 py-2.5 bg-surface-100 border border-border rounded-xl text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary"
          />

          <FilterGroup label="TIPO" value={filterTipo} onChange={setFilterTipo} options={[
            { key: 'todos', label: 'Todos' },
            { key: 'tenant', label: 'Tenants' },
            { key: 'alumno', label: 'Alumnos' },
            ...(countDuplicados > 0 ? [{ key: 'duplicados', label: `Duplicados (${countDuplicados})` }] : []),
          ]} />

          <FilterGroup label="AUTH" value={filterAuth} onChange={setFilterAuth} options={[
            { key: 'todos',  label: 'Todos' },
            { key: 'google', label: 'Google' },
            { key: 'email',  label: 'Email' },
          ]} />

          <FilterGroup label="ESTADO" value={filterEstado} onChange={setFilterEstado} options={[
            { key: 'todos',       label: 'Todos' },
            { key: 'activo',      label: 'Activo' },
            { key: 'anonimizado', label: 'Anonimizado' },
          ]} />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-surface-100 border border-border rounded-xl p-12 text-center">
            <p className="text-ink-muted text-sm">
              {all.length === 0 ? 'No hay usuarios registrados aún.' : 'No hay resultados para esa búsqueda.'}
            </p>
          </div>
        ) : (
          <div className="bg-surface-100 border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-200/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Usuario</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Tipo</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Auth</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Registro</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Último ingreso</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const isAnonymized = u.estado === 'ANONIMIZADO';
                  const isDuplicate = u.email && duplicateEmails.has(u.email.toLowerCase()) && !isAnonymized;
                  return (
                    <tr
                      key={u.uid}
                      onClick={() => setDetailTarget(u)}
                      className={`border-b border-border/50 hover:bg-surface-200/20 transition-colors cursor-pointer ${isAnonymized ? 'opacity-50' : ''} ${isDuplicate ? 'bg-amber-50/40' : ''}`}
                    >
                      {/* Usuario */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.photoURL ? (
                            <img src={u.photoURL} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">{(u.nombre?.[0] || '?').toUpperCase()}</span>
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-ink leading-tight truncate max-w-[200px]">
                                {isAnonymized
                                  ? <span className="italic text-ink-muted">Datos eliminados</span>
                                  : [u.nombre, u.apellido].filter(Boolean).join(' ') || '—'
                                }
                              </p>
                              {isDuplicate && (
                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 leading-tight shrink-0">
                                  DUPLICADO
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-muted font-mono mt-0.5 truncate max-w-[200px]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-4 py-3">
                        <TipoBadge tipo={u.tipo} />
                      </td>

                      {/* Auth */}
                      <td className="px-4 py-3">
                        <AuthBadge method={u.authMethod} />
                      </td>

                      {/* Registro */}
                      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                        {formatFecha(u.createdAt)}
                      </td>

                      {/* Último ingreso */}
                      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                        {formatFecha(u.lastLoginAt)}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        {isAnonymized ? (
                          <span className="text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">Anonimizado</span>
                        ) : (
                          <span className="text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">Activo</span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {!isAnonymized && u.authMethod !== 'google' && (
                            <button
                              onClick={() => setResetTarget(u)}
                              title="Enviar reset de contraseña"
                              className="text-xs py-1 px-2.5 border border-border rounded text-ink-muted hover:text-ink hover:bg-surface-200 transition-colors whitespace-nowrap"
                            >
                              ↺ Reset
                            </button>
                          )}
                          {!isAnonymized && (
                            <button
                              onClick={() => setAnonTarget(u)}
                              title="Anonimizar datos del usuario"
                              className="w-8 h-6 flex items-center justify-center rounded border border-danger/20 text-danger hover:bg-danger/5 transition-colors"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          )}
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
