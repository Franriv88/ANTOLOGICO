import { useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { planes as planesApi } from '../services/adminApi';

const EMPTY = { nombre: '', precioMensual: '', descuentoTrimestral: '10', descuentoAnual: '20', maxWorkshops: '', features: '', highlight: false };

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

function featuresToText(arr) {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

function textToFeatures(text) {
  return text.split('\n').map(f => f.trim()).filter(Boolean);
}

function PlanForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    const payload = {
      nombre:              form.nombre.trim(),
      precioMensual:       Number(form.precioMensual) || 0,
      descuentoTrimestral: Number(form.descuentoTrimestral) || 0,
      descuentoAnual:      Number(form.descuentoAnual)      || 0,
      maxWorkshops:        form.maxWorkshops ? Number(form.maxWorkshops) : null,
      features:            textToFeatures(form.features),
      highlight:           form.highlight,
    };
    onSave(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-4">
      <h3 className="font-display text-lg text-ink">
        {initial ? 'Editar plan' : 'Nuevo plan'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Nombre *</label>
          <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
            placeholder="Ej: Profesional" required className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Precio mensual (ARS)</label>
          <input type="number" value={form.precioMensual} onChange={e => set('precioMensual', e.target.value)}
            placeholder="12900" min="0" className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Descuento trimestral (%)</label>
          <input type="number" value={form.descuentoTrimestral} onChange={e => set('descuentoTrimestral', e.target.value)}
            placeholder="10" min="0" max="100" className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Descuento anual (%)</label>
          <input type="number" value={form.descuentoAnual} onChange={e => set('descuentoAnual', e.target.value)}
            placeholder="20" min="0" max="100" className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Máx. talleres simultáneos <span className="font-normal">(vacío = ilimitado)</span></label>
          <input type="number" value={form.maxWorkshops} onChange={e => set('maxWorkshops', e.target.value)}
            placeholder="5" min="1" className={INPUT_CLS} />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <input type="checkbox" id="highlight" checked={form.highlight} onChange={e => set('highlight', e.target.checked)}
            className="w-4 h-4 accent-primary" />
          <label htmlFor="highlight" className="text-sm text-ink cursor-pointer">Marcar como recomendado</label>
        </div>
      </div>

      <div>
        <label className={LABEL_CLS}>Features (una por línea)</label>
        <textarea
          value={form.features}
          onChange={e => set('features', e.target.value)}
          rows={4}
          placeholder={'Talleres ilimitados\nDominio personalizado\nEncabezado con imagen'}
          className={INPUT_CLS + ' resize-none'}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 border border-border rounded-md text-sm font-medium text-ink hover:bg-surface-200 transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar plan'}
        </button>
      </div>
    </form>
  );
}

export default function Plans() {
  const [list,    setList]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null); // id del plan editándose
  const [saving,  setSaving]  = useState(false);

  useEffect(() => {
    planesApi.list().then(setList).finally(() => setLoading(false));
  }, []);

  async function handleCreate(payload) {
    setSaving(true);
    const plan = await planesApi.create(payload);
    setList(prev => [...(prev ?? []), plan]);
    setShowNew(false);
    setSaving(false);
  }

  async function handleUpdate(id, payload) {
    setSaving(true);
    const updated = await planesApi.update(id, payload);
    setList(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    setEditing(null);
    setSaving(false);
  }

  async function handleDelete(id, nombre) {
    const result = await Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: 'Los tenants que tengan este plan asignado quedarán sin plan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E85D4A',
    });
    if (!result.isConfirmed) return;
    await planesApi.remove(id);
    setList(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <p className="text-sm text-ink-muted">Cargando planes…</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink">Planes</h1>
          <p className="text-sm text-ink-muted mt-0.5">{(list ?? []).length} planes configurados</p>
        </div>
        {!showNew && !editing && (
          <button
            onClick={() => setShowNew(true)}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
          >
            + Nuevo plan
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Formulario nuevo plan */}
        {showNew && (
          <PlanForm
            onSave={handleCreate}
            onCancel={() => setShowNew(false)}
            saving={saving}
          />
        )}

        {/* Lista de planes */}
        {(list ?? []).map(plan => (
          editing === plan.id ? (
            <PlanForm
              key={plan.id}
              initial={{
                nombre:              plan.nombre,
                precioMensual:       String(plan.precioMensual ?? ''),
                descuentoTrimestral: String(plan.descuentoTrimestral ?? '10'),
                descuentoAnual:      String(plan.descuentoAnual ?? '20'),
                maxWorkshops:        plan.maxWorkshops ? String(plan.maxWorkshops) : '',
                features:            featuresToText(plan.features),
                highlight:           plan.highlight ?? false,
              }}
              onSave={(payload) => handleUpdate(plan.id, payload)}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          ) : (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => setEditing(plan.id)}
              onDelete={() => handleDelete(plan.id, plan.nombre)}
            />
          )
        ))}

        {(list ?? []).length === 0 && !showNew && (
          <div className="bg-surface-100 border border-border rounded-xl p-12 text-center">
            <p className="text-ink-muted text-sm">No hay planes configurados.</p>
            <button onClick={() => setShowNew(true)}
              className="mt-3 text-sm text-primary hover:underline">
              Crear el primero →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plan, onEdit, onDelete }) {
  return (
    <div className={`bg-surface-100 border rounded-xl p-5 flex items-start justify-between gap-4 ${
      plan.highlight ? 'border-primary/30' : 'border-border'
    }`}>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-ink">{plan.nombre}</span>
          {plan.highlight && (
            <span className="text-xs font-semibold bg-primary text-white rounded-full px-2 py-0.5">
              Recomendado
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="font-mono text-sm text-ink-muted">
            {plan.precioMensual ? formatPrecio(plan.precioMensual) + '/mes' : 'Gratis'}
          </span>
          {plan.descuentoTrimestral > 0 && (
            <span className="text-xs bg-surface-200 text-ink-muted px-2 py-0.5 rounded-full">
              Trim. −{plan.descuentoTrimestral}%
            </span>
          )}
          {plan.descuentoAnual > 0 && (
            <span className="text-xs bg-surface-200 text-ink-muted px-2 py-0.5 rounded-full">
              Anual −{plan.descuentoAnual}%
            </span>
          )}
          <span className="text-xs text-ink-muted">
            {plan.maxWorkshops ? `Hasta ${plan.maxWorkshops} talleres` : 'Talleres ilimitados'}
          </span>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-0.5">
          {(plan.features ?? []).map((f, i) => (
            <li key={i} className="text-xs text-ink-muted flex items-center gap-1">
              <span className="text-success">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-xs border border-border rounded-md text-ink hover:bg-surface-200 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-xs border border-danger/20 rounded-md text-danger hover:bg-danger/5 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
