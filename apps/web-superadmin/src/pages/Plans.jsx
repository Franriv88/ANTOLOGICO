import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { planes as planesApi, promoApi } from '../services/adminApi';

const EMPTY = { nombre: '', precioMensual: '', descuentoTrimestral: '10', descuentoAnual: '20', maxWorkshops: '', features: '', highlight: false };
const EMPTY_PROMO = { label: 'Oferta especial', descuento: '10', tipo: 'manual', inicio: '', fin: '' };

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

function promoStatus(promo) {
  if (!promo) return { label: 'Sin configurar', cls: 'bg-surface-200 text-ink-muted' };
  if (!promo.activo) return { label: 'Inactiva', cls: 'bg-surface-200 text-ink-muted' };
  if (promo.tipo === 'programado') {
    const now   = Date.now();
    const inicio = promo.inicio ? new Date(promo.inicio).getTime() : 0;
    const fin    = promo.fin    ? new Date(promo.fin).getTime()    : Infinity;
    if (now < inicio) return { label: 'Programada (no iniciada)', cls: 'bg-amber-100 text-amber-700' };
    if (now > fin)    return { label: 'Programada (vencida)',      cls: 'bg-danger/10 text-danger' };
    return { label: 'Activa (programada)', cls: 'bg-emerald-100 text-emerald-700' };
  }
  return { label: 'Activa', cls: 'bg-emerald-100 text-emerald-700' };
}

// ── PlanForm ──────────────────────────────────────────────────────────────────

function PlanForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial ?? EMPTY);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    onSave({
      nombre:              form.nombre.trim(),
      precioMensual:       Number(form.precioMensual) || 0,
      descuentoTrimestral: Number(form.descuentoTrimestral) || 0,
      descuentoAnual:      Number(form.descuentoAnual) || 0,
      maxWorkshops:        form.maxWorkshops ? Number(form.maxWorkshops) : null,
      features:            textToFeatures(form.features),
      highlight:           form.highlight,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-4">
      <h3 className="font-display text-lg text-ink">{initial ? 'Editar plan' : 'Nuevo plan'}</h3>
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
          <label className={LABEL_CLS}>Máx. talleres <span className="font-normal">(vacío = ilimitado)</span></label>
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
        <textarea value={form.features} onChange={e => set('features', e.target.value)}
          rows={4} placeholder={'Talleres ilimitados\nDominio personalizado\nEncabezado con imagen'}
          className={INPUT_CLS + ' resize-none'} />
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

// ── PlanCard (compact horizontal) ─────────────────────────────────────────────

function PlanCard({ plan, onEdit, onDelete }) {
  return (
    <div className={`min-w-[176px] w-44 shrink-0 bg-surface-100 border rounded-xl p-4 flex flex-col gap-2 ${
      plan.highlight ? 'border-primary/30' : 'border-border'
    }`}>
      <div className="flex items-start justify-between gap-1 min-h-[40px]">
        <span className="font-semibold text-sm text-ink leading-tight">{plan.nombre}</span>
        {plan.highlight && (
          <span className="text-[10px] font-bold bg-primary text-white rounded-full px-1.5 py-0.5 shrink-0 leading-tight">
            ★
          </span>
        )}
      </div>
      <span className="font-mono text-sm text-ink font-semibold">
        {plan.precioMensual ? formatPrecio(plan.precioMensual) + '/mes' : 'Gratis'}
      </span>
      <div className="flex flex-col gap-0.5">
        {(plan.descuentoTrimestral ?? 0) > 0 && (
          <span className="text-[11px] text-ink-muted">Trim. −{plan.descuentoTrimestral}%</span>
        )}
        {(plan.descuentoAnual ?? 0) > 0 && (
          <span className="text-[11px] text-ink-muted">Anual −{plan.descuentoAnual}%</span>
        )}
        <span className="text-[11px] text-ink-muted">
          {plan.maxWorkshops ? `Hasta ${plan.maxWorkshops} talleres` : 'Ilimitado'}
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 flex-1">
        {(plan.features ?? []).slice(0, 3).map((f, i) => (
          <li key={i} className="text-[11px] text-ink-muted flex items-start gap-1">
            <span className="text-success shrink-0 mt-0.5">✓</span>
            <span className="leading-tight">{f}</span>
          </li>
        ))}
        {(plan.features ?? []).length > 3 && (
          <li className="text-[10px] text-ink-muted">+{plan.features.length - 3} más…</li>
        )}
      </ul>
      <div className="flex gap-1 pt-2 border-t border-border/60">
        <button onClick={onEdit}
          className="flex-1 py-1.5 text-xs border border-border rounded-md text-ink hover:bg-surface-200 transition-colors">
          Editar
        </button>
        <button onClick={onDelete}
          className="px-2.5 py-1.5 text-xs border border-danger/20 rounded-md text-danger hover:bg-danger/5 transition-colors">
          ×
        </button>
      </div>
    </div>
  );
}

// ── Plans page ────────────────────────────────────────────────────────────────

export default function Plans() {
  const [list,    setList]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  const [promo,       setPromo]       = useState(null);
  const [promoForm,   setPromoForm]   = useState(EMPTY_PROMO);
  const [promoSaving, setPromoSaving] = useState(null);

  useEffect(() => {
    Promise.all([planesApi.list(), promoApi.get()]).then(([ps, p]) => {
      setList(ps);
      if (p) {
        setPromo(p);
        setPromoForm({
          label:    p.label    ?? 'Oferta especial',
          descuento: String(p.descuento ?? 10),
          tipo:     p.tipo     ?? 'manual',
          inicio:   p.inicio   ? p.inicio.slice(0, 16) : '',
          fin:      p.fin      ? p.fin.slice(0, 16)    : '',
        });
      }
    }).finally(() => setLoading(false));
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

  async function handlePromoSave(e) {
    e.preventDefault();
    setPromoSaving('save');
    try {
      const payload = {
        label:    promoForm.label,
        descuento: Number(promoForm.descuento),
        tipo:     promoForm.tipo,
        inicio:   promoForm.tipo === 'programado' ? promoForm.inicio : null,
        fin:      promoForm.tipo === 'programado' ? promoForm.fin    : null,
        activo:   promo?.activo ?? false,
      };
      const updated = await promoApi.save(payload);
      setPromo(updated);
    } finally {
      setPromoSaving(null);
    }
  }

  async function handlePromoToggle() {
    setPromoSaving('toggle');
    try {
      const updated = await promoApi.toggle(!(promo?.activo ?? false));
      setPromo(updated);
    } finally {
      setPromoSaving(null);
    }
  }

  const editingPlan = editing ? (list ?? []).find(p => p.id === editing) : null;
  const pStatus = promoStatus(promo);

  if (loading) return <p className="text-sm text-ink-muted">Cargando planes…</p>;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Planes</h1>
        <p className="text-sm text-ink-muted mt-0.5">{(list ?? []).length} planes configurados</p>
      </div>

      {/* ── Fila horizontal de cards ── */}
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-brand">
        {(list ?? []).map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => { setShowNew(false); setEditing(plan.id); }}
            onDelete={() => handleDelete(plan.id, plan.nombre)}
          />
        ))}
        {!showNew && (
          <button
            onClick={() => { setEditing(null); setShowNew(true); }}
            className="min-w-[120px] shrink-0 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-ink-muted hover:border-primary hover:text-primary transition-colors py-8 px-4"
          >
            <span className="text-3xl font-light leading-none">+</span>
            <span className="text-xs font-medium">Nuevo plan</span>
          </button>
        )}
      </div>

      {/* ── Formulario crear / editar ── */}
      {(showNew || editing) && (
        <div className="mt-4">
          <PlanForm
            initial={editingPlan ? {
              nombre:              editingPlan.nombre,
              precioMensual:       String(editingPlan.precioMensual ?? ''),
              descuentoTrimestral: String(editingPlan.descuentoTrimestral ?? '10'),
              descuentoAnual:      String(editingPlan.descuentoAnual ?? '20'),
              maxWorkshops:        editingPlan.maxWorkshops ? String(editingPlan.maxWorkshops) : '',
              features:            featuresToText(editingPlan.features),
              highlight:           editingPlan.highlight ?? false,
            } : undefined}
            onSave={editing ? p => handleUpdate(editing, p) : handleCreate}
            onCancel={() => { setShowNew(false); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* ── Promoción global ── */}
      <div className="mt-10 pt-8 border-t border-border">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-xl text-ink">Promoción global</h2>
            <p className="text-sm text-ink-muted mt-0.5">
              El descuento se aplica sobre el precio de todos los planes.
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 mt-1 ${pStatus.cls}`}>
            {pStatus.label}
          </span>
        </div>

        <form onSubmit={handlePromoSave} className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Etiqueta de la promo</label>
              <input type="text" value={promoForm.label}
                onChange={e => setPromoForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ej: Cyber Monday" className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Descuento (%)</label>
              <input type="number" value={promoForm.descuento}
                onChange={e => setPromoForm(f => ({ ...f, descuento: e.target.value }))}
                min="1" max="100" placeholder="15" className={INPUT_CLS} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Tipo de activación</label>
            <div className="flex gap-5">
              {['manual', 'programado'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipo" value={t} checked={promoForm.tipo === t}
                    onChange={() => setPromoForm(f => ({ ...f, tipo: t }))} className="accent-primary" />
                  <span className="text-sm text-ink">{t === 'manual' ? 'Manual' : 'Programado'}</span>
                </label>
              ))}
            </div>
          </div>

          {promoForm.tipo === 'programado' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Inicio</label>
                <input type="datetime-local" value={promoForm.inicio}
                  onChange={e => setPromoForm(f => ({ ...f, inicio: e.target.value }))}
                  className={INPUT_CLS} />
              </div>
              <div>
                <label className={LABEL_CLS}>Fin</label>
                <input type="datetime-local" value={promoForm.fin}
                  onChange={e => setPromoForm(f => ({ ...f, fin: e.target.value }))}
                  className={INPUT_CLS} />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <button type="submit" disabled={!!promoSaving}
              className="px-5 py-2 bg-surface-200 border border-border rounded-md text-sm font-medium text-ink hover:bg-surface-300 transition-colors disabled:opacity-50">
              {promoSaving === 'save' ? 'Guardando…' : 'Guardar configuración'}
            </button>
            <button type="button" onClick={handlePromoToggle} disabled={!!promoSaving}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 ${
                promo?.activo
                  ? 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20'
                  : 'bg-primary text-white hover:bg-primary-strong'
              }`}>
              {promoSaving === 'toggle' ? '…' : promo?.activo ? 'Desactivar promo' : 'Activar promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
