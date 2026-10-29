import { useEffect, useState } from 'react';
import { cupones as cuponesApi } from '../services/adminApi';

function ConfirmModal({ title, body, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-0 border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
        <p className="text-sm text-ink-muted mb-6">{body}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg text-ink-muted hover:bg-surface-100 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-danger text-white rounded-lg hover:bg-danger/90 disabled:opacity-50 transition-colors">
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

function NuevoCuponForm({ onCreated, onClose }) {
  const [codigo,        setCodigo]        = useState('');
  const [descuento,     setDescuento]     = useState('');
  const [duracionMeses, setDuracionMeses] = useState('');
  const [maxUsos,       setMaxUsos]       = useState('');
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState('');

  const FIELD = 'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-[#B98527] focus:ring-1 focus:ring-[#B98527]';
  const LABEL = 'block text-xs font-medium text-ink-muted mb-1.5';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!codigo.trim() || !descuento || !duracionMeses) { setError('Código, descuento y duración son obligatorios.'); return; }
    if (Number(descuento) < 1 || Number(descuento) > 100) { setError('El descuento debe estar entre 1 y 100.'); return; }
    setLoading(true); setError('');
    try {
      const c = await cuponesApi.create({ codigo, descuento, duracionMeses, maxUsos: maxUsos || null });
      onCreated(c);
    } catch (err) {
      setError(err.message || 'Error al crear el cupón.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-0 border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg text-ink">Nuevo cupón</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors text-ink-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={LABEL}>Código *</label>
            <input value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
              placeholder="Ej: PROMO20" className={FIELD} autoFocus />
            <p className="text-[11px] text-ink-muted mt-1">Se guardará en mayúsculas y sin espacios.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Descuento % *</label>
              <input type="number" min="1" max="100" value={descuento} onChange={e => setDescuento(e.target.value)}
                placeholder="20" className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Duración (meses) *</label>
              <input type="number" min="1" value={duracionMeses} onChange={e => setDuracionMeses(e.target.value)}
                placeholder="3" className={FIELD} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Máximo de usos</label>
            <input type="number" min="1" value={maxUsos} onChange={e => setMaxUsos(e.target.value)}
              placeholder="Sin límite" className={FIELD} />
            <p className="text-[11px] text-ink-muted mt-1">Dejá vacío para usos ilimitados.</p>
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex gap-3 justify-end pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border border-border rounded-lg text-ink-muted hover:bg-surface-100 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 text-sm font-semibold bg-[#B98527] text-white rounded-lg hover:bg-[#A07422] disabled:opacity-50 transition-colors">
              {loading ? 'Creando…' : 'Crear cupón'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Cupones() {
  const [lista,       setLista]       = useState(null);
  const [showForm,    setShowForm]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    cuponesApi.list()
      .then(setLista)
      .catch(() => setLista([]));
  }, []);

  async function handleToggle(id, activo) {
    try {
      await cuponesApi.toggle(id, !activo);
      setLista(prev => prev.map(c => c.id === id ? { ...c, activo: !activo } : c));
    } catch { setError('No se pudo actualizar el cupón.'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await cuponesApi.remove(deleteTarget.id);
      setLista(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch { setError('No se pudo eliminar el cupón.'); }
    finally { setDeleting(false); }
  }

  const activos   = (lista ?? []).filter(c => c.activo);
  const inactivos = (lista ?? []).filter(c => !c.activo);

  return (
    <div>
      {showForm && (
        <NuevoCuponForm
          onCreated={c => { setLista(prev => [c, ...prev]); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          title="Eliminar cupón"
          body={`¿Eliminás el cupón "${deleteTarget.codigo}"? Esta acción no se puede deshacer.`}
          loading={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Cupones</h1>
          <p className="text-sm text-ink-muted mt-1">Códigos de descuento temporales para captar suscripciones.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#B98527] text-white text-sm font-semibold rounded-lg hover:bg-[#A07422] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo cupón
        </button>
      </div>

      {error && <p className="text-xs text-danger mb-4">{error}</p>}

      {lista === null && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#B98527] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {lista !== null && lista.length === 0 && (
        <div className="text-center py-16 text-ink-muted">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-40">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
          <p className="text-sm">No hay cupones. Creá el primero.</p>
        </div>
      )}

      {lista !== null && lista.length > 0 && (
        <div className="flex flex-col gap-6">
          {activos.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Activos</h2>
              <CuponTable items={activos} onToggle={handleToggle} onDelete={setDeleteTarget} />
            </section>
          )}
          {inactivos.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Inactivos</h2>
              <CuponTable items={inactivos} onToggle={handleToggle} onDelete={setDeleteTarget} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function cuponVencimiento(c) {
  if (!c.createdAt || !c.duracionMeses) return null;
  const d = new Date(c.createdAt);
  d.setMonth(d.getMonth() + Number(c.duracionMeses));
  return d;
}

function VencimientoBadge({ cupon }) {
  const exp = cuponVencimiento(cupon);
  if (!exp) return <span className="text-xs text-ink-muted">—</span>;
  const diff = Math.ceil((exp - Date.now()) / 86_400_000);
  if (diff <= 0) return <span className="text-xs font-medium text-danger">Vencido</span>;
  if (diff <= 7) return <span className="text-xs font-medium text-danger">{diff}d restantes</span>;
  if (diff <= 30) return <span className="text-xs font-medium text-amber-600">{diff}d restantes</span>;
  return <span className="text-xs text-ink-muted">{diff}d restantes</span>;
}

function CuponTable({ items, onToggle, onDelete }) {
  return (
    <div className="bg-surface-0 border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-100">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Código</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Descuento</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Duración</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Usos</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Estado</th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-muted">Vencimiento</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {items.map((c, i) => (
            <tr key={c.id} className={`${i < items.length - 1 ? 'border-b border-border' : ''} hover:bg-surface-100 transition-colors`}>
              <td className="px-4 py-3">
                <span className="font-mono font-semibold text-ink tracking-wide">{c.codigo}</span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-[#B98527]/10 text-[#B98527]">
                  −{c.descuento}%
                </span>
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {c.duracionMeses} {c.duracionMeses === 1 ? 'mes' : 'meses'}
              </td>
              <td className="px-4 py-3 text-ink-muted font-mono text-xs">
                {c.usosActuales ?? 0}{c.maxUsos ? ` / ${c.maxUsos}` : ''}
              </td>
              <td className="px-4 py-3">
                {c.activo ? (
                  <span className="text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">Activo</span>
                ) : (
                  <span className="text-xs font-medium bg-surface-200 text-ink-muted border border-border rounded-full px-2.5 py-0.5 whitespace-nowrap">Inactivo</span>
                )}
              </td>
              <td className="px-4 py-3">
                <VencimientoBadge cupon={c} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => onToggle(c.id, c.activo)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
                      c.activo
                        ? 'border-border text-ink-muted hover:bg-surface-100'
                        : 'border-[#B98527]/40 text-[#B98527] hover:bg-[#B98527]/5'
                    }`}>
                    {c.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => onDelete(c)}
                    className="p-1.5 rounded-md text-danger/60 hover:text-danger hover:bg-danger/5 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
