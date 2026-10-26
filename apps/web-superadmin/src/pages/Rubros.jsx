import { useEffect, useState } from 'react';
import { rubros as rubrosApi } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';

export default function Rubros() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [nuevo, setNuevo]       = useState('');
  const [creating, setCreating] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [editVal, setEditVal]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try { setItems(await rubrosApi.list()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!nuevo.trim()) return;
    const dup = items.some(r => r.nombre.toLowerCase() === nuevo.trim().toLowerCase());
    if (dup) return;
    setCreating(true);
    try {
      await rubrosApi.create(nuevo.trim());
      setNuevo('');
      await load();
    } catch (e) { console.error(e); }
    finally { setCreating(false); }
  }

  async function handleSaveEdit() {
    if (!editVal.trim() || !editId) return;
    setSaving(true);
    try {
      await rubrosApi.update(editId, { nombre: editVal.trim() });
      setEditId(null); setEditVal('');
      await load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  async function handleToggle(item) {
    try {
      await rubrosApi.update(item.id, { activo: !item.activo });
      await load();
    } catch (e) { console.error(e); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await rubrosApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  }

  const activos   = items.filter(r => r.activo !== false);
  const inactivos = items.filter(r => r.activo === false);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Rubros</h1>
        <p className="text-sm text-ink-muted mt-1">
          Categorías que los tenants pueden asignar a sus espacios. {items.length} rubros en total.
        </p>
      </div>

      {/* Agregar nuevo */}
      <form onSubmit={handleCreate} className="flex items-center gap-3 mb-6 max-w-lg">
        <input
          type="text"
          value={nuevo}
          onChange={e => setNuevo(e.target.value)}
          placeholder="Nuevo rubro..."
          className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-[#B98527] focus:ring-1 focus:ring-[#B98527]"
        />
        <button
          type="submit"
          disabled={creating || !nuevo.trim()}
          className="px-4 py-2 bg-[#B98527] text-white rounded-md text-sm font-semibold hover:bg-[#A07422] transition-colors disabled:opacity-50 shrink-0"
        >
          {creating ? '...' : 'Agregar'}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#B98527] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Activos */}
          <div>
            <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
              Activos ({activos.length})
            </h2>
            <div className="bg-surface-0 border border-border rounded-xl divide-y divide-border">
              {activos.map(item => (
                <RubroRow
                  key={item.id}
                  item={item}
                  isEditing={editId === item.id}
                  editVal={editVal}
                  saving={saving}
                  onStartEdit={() => { setEditId(item.id); setEditVal(item.nombre); }}
                  onCancelEdit={() => { setEditId(null); setEditVal(''); }}
                  onChangeEdit={setEditVal}
                  onSaveEdit={handleSaveEdit}
                  onToggle={() => handleToggle(item)}
                  onDelete={() => setDeleteTarget(item)}
                />
              ))}
              {activos.length === 0 && (
                <p className="px-4 py-6 text-sm text-ink-muted text-center">No hay rubros activos.</p>
              )}
            </div>
          </div>

          {/* Inactivos */}
          {inactivos.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">
                Inactivos ({inactivos.length})
              </h2>
              <div className="bg-surface-0 border border-border rounded-xl divide-y divide-border opacity-70">
                {inactivos.map(item => (
                  <RubroRow
                    key={item.id}
                    item={item}
                    isEditing={editId === item.id}
                    editVal={editVal}
                    saving={saving}
                    onStartEdit={() => { setEditId(item.id); setEditVal(item.nombre); }}
                    onCancelEdit={() => { setEditId(null); setEditVal(''); }}
                    onChangeEdit={setEditVal}
                    onSaveEdit={handleSaveEdit}
                    onToggle={() => handleToggle(item)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {deleteTarget && (
        <ConfirmModal
          title={`¿Eliminar "${deleteTarget.nombre}"?`}
          text="Los espacios que tengan este rubro asignado no se verán afectados, pero ya no podrán seleccionarlo."
          confirmText={deleting ? 'Eliminando…' : 'Eliminar'}
          danger
          confirmDisabled={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function RubroRow({ item, isEditing, editVal, saving, onStartEdit, onCancelEdit, onChangeEdit, onSaveEdit, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Toggle activo */}
      <button
        type="button"
        onClick={onToggle}
        title={item.activo !== false ? 'Desactivar' : 'Activar'}
        className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
          item.activo !== false ? 'bg-green-500' : 'bg-surface-200'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
          item.activo !== false ? 'translate-x-4' : ''
        }`} />
      </button>

      {/* Nombre */}
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editVal}
            onChange={e => onChangeEdit(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onSaveEdit(); if (e.key === 'Escape') onCancelEdit(); }}
            autoFocus
            className="flex-1 px-2 py-1 bg-surface-100 border border-border rounded text-sm text-ink focus:outline-none focus:border-[#B98527]"
          />
          <button
            onClick={onSaveEdit}
            disabled={saving || !editVal.trim()}
            className="text-xs font-semibold text-[#B98527] hover:text-[#A07422] disabled:opacity-50"
          >
            Guardar
          </button>
          <button
            onClick={onCancelEdit}
            className="text-xs text-ink-muted hover:text-ink"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <span className="flex-1 text-sm text-ink">{item.nombre}</span>
      )}

      {/* Acciones */}
      {!isEditing && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onStartEdit}
            title="Editar"
            className="p-1.5 rounded hover:bg-surface-200 text-ink-muted hover:text-ink transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            title="Eliminar"
            className="p-1.5 rounded hover:bg-danger/10 text-ink-muted hover:text-danger transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
