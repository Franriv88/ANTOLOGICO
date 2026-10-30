import { useEffect, useState } from 'react';
import { planes as planesApi, promoApi, configApi, PLAN_CAPABILITIES, EMPTY_CAPABILITIES } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';
import { AntologicoLoaderCream } from '../components/AntologicoLoaderCream';
import FloatingSaveBar from '../components/FloatingSaveBar';

const EMPTY = {
  nombre: '',
  precioMensual: '',
  descuentoTrimestral: '10',
  descuentoAnual: '20',
  maxWorkshops: '',
  highlight: false,
  capabilities: { ...EMPTY_CAPABILITIES },
};
const EMPTY_PROMO = { label: 'Oferta especial', descuento: '10', tipo: 'manual', inicio: '', fin: '' };

const INPUT_CLS = 'w-full px-3 py-2 bg-surface-0 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1.5';

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
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
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(initial ?? {}) }));
  const [dirty, setDirty] = useState(false);
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setDirty(true); }
  function toggleCap(key) {
    setForm(f => ({ ...f, capabilities: { ...f.capabilities, [key]: !f.capabilities?.[key] } }));
    setDirty(true);
  }

  function handleSubmit(e) {
    e?.preventDefault();
    if (!form.nombre.trim()) return;
    const capabilities = { ...EMPTY_CAPABILITIES, ...form.capabilities };
    // Las features visibles en la landing se derivan de las capabilities activas,
    // así todo queda consistente y no hay forma de "quedarse pegado" con texto manual.
    const features = PLAN_CAPABILITIES.filter(c => capabilities[c.key]).map(c => c.label);
    onSave({
      nombre:              form.nombre.trim(),
      precioMensual:       Number(form.precioMensual) || 0,
      descuentoTrimestral: Number(form.descuentoTrimestral) || 0,
      descuentoAnual:      Number(form.descuentoAnual) || 0,
      maxWorkshops:        form.maxWorkshops ? Number(form.maxWorkshops) : null,
      features,
      highlight:           form.highlight,
      capabilities,
    });
  }

  const capsHabilitadas = PLAN_CAPABILITIES.filter(c => form.capabilities?.[c.key]).length;

  return (
    <form onSubmit={handleSubmit} className="bg-surface-0 border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header del form */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-100/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h3 className="font-display text-base text-ink leading-tight">{initial ? 'Editar plan' : 'Nuevo plan'}</h3>
            <p className="text-[11px] text-ink-muted mt-0.5">
              {capsHabilitadas} de {PLAN_CAPABILITIES.length} features habilitadas
            </p>
          </div>
        </div>
        {form.highlight && (
          <span className="text-[10px] font-semibold bg-primary text-white rounded-full px-2.5 py-1">
            Recomendado
          </span>
        )}
      </div>

      {/* Grid 2 columnas: izq = datos, der = features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 py-5">

        {/* Columna izquierda: datos del plan */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLS}>Nombre del plan *</label>
            <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: Profesional" required className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Precio mensual (ARS)</label>
            <input type="number" value={form.precioMensual} onChange={e => set('precioMensual', e.target.value)}
              placeholder="12900" min="0" className={INPUT_CLS + ' font-mono'} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Dto. trimestral (%)</label>
              <input type="number" value={form.descuentoTrimestral} onChange={e => set('descuentoTrimestral', e.target.value)}
                placeholder="10" min="0" max="100" className={INPUT_CLS + ' font-mono'} />
            </div>
            <div>
              <label className={LABEL_CLS}>Dto. anual (%)</label>
              <input type="number" value={form.descuentoAnual} onChange={e => set('descuentoAnual', e.target.value)}
                placeholder="20" min="0" max="100" className={INPUT_CLS + ' font-mono'} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLS}>Máx. talleres</label>
            <input
              type="number"
              value={form.maxWorkshops}
              onChange={e => set('maxWorkshops', e.target.value)}
              placeholder={form.capabilities?.talleresIlimitados ? 'Ilimitado' : 'Ej: 5'}
              disabled={form.capabilities?.talleresIlimitados}
              min="1"
              className={INPUT_CLS + ' font-mono disabled:opacity-50 disabled:cursor-not-allowed'}
            />
            {form.capabilities?.talleresIlimitados && (
              <p className="text-[11px] text-ink-muted mt-1">
                Deshabilitado porque "Talleres ilimitados" está activo.
              </p>
            )}
          </div>

          <div className="pt-2 mt-auto border-t border-border/60">
            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-3">
              <input
                type="checkbox"
                checked={form.highlight}
                onChange={e => set('highlight', e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-ink">Marcar como <span className="font-semibold">plan recomendado</span></span>
            </label>
          </div>
        </div>

        {/* Columna derecha: features (capabilities) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-ink uppercase tracking-wide">Features del plan</label>
            <span className="text-[11px] text-ink-muted">{capsHabilitadas} / {PLAN_CAPABILITIES.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {PLAN_CAPABILITIES.map(cap => {
              const checked = !!form.capabilities?.[cap.key];
              return (
                <label
                  key={cap.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    checked
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-surface-100/60 hover:border-primary/20 hover:bg-surface-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCap(cap.key)}
                    className="w-4 h-4 accent-primary mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm leading-tight ${checked ? 'font-semibold text-ink' : 'text-ink'}`}>
                      {cap.label}
                    </p>
                    <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">{cap.desc}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

      </div>

      {/* Cancelar — siempre visible en el form */}
      <div className="px-6 py-4 border-t border-border bg-surface-100/50">
        <button type="button" onClick={onCancel}
          className="w-full py-2 border border-border rounded-md text-sm font-medium text-ink hover:bg-surface-0 transition-colors">
          Cancelar
        </button>
      </div>

      <FloatingSaveBar
        dirty={dirty || !!initial}
        saving={saving}
        onSave={handleSubmit}
        label={saving ? 'Guardando…' : 'Guardar plan'}
      />
    </form>
  );
}

// ── PlanCard (horizontal row) ─────────────────────────────────────────────────

function PlanCard({ plan, onEdit, onDelete }) {
  return (
    <div className={`min-w-[220px] w-[220px] shrink-0 bg-surface-100 border rounded-xl p-5 flex flex-col gap-3 ${
      plan.highlight ? 'border-primary/30' : 'border-border'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-sm text-ink leading-snug">{plan.nombre}</span>
        {plan.highlight && (
          <span className="text-[10px] font-semibold bg-primary text-white rounded-full px-2 py-0.5 shrink-0 whitespace-nowrap">
            Recomendado
          </span>
        )}
      </div>

      <div>
        <p className="font-mono text-base font-semibold text-ink">
          {plan.precioMensual ? formatPrecio(plan.precioMensual) + '/mes' : 'Gratis'}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {(plan.descuentoTrimestral ?? 0) > 0 && (
            <span className="text-[11px] bg-surface-200 text-ink-muted px-2 py-0.5 rounded-full">
              Trim. −{plan.descuentoTrimestral}%
            </span>
          )}
          {(plan.descuentoAnual ?? 0) > 0 && (
            <span className="text-[11px] bg-surface-200 text-ink-muted px-2 py-0.5 rounded-full">
              Anual −{plan.descuentoAnual}%
            </span>
          )}
          <span className="text-[11px] text-ink-muted">
            {plan.maxWorkshops ? `Hasta ${plan.maxWorkshops} talleres` : 'Talleres ilimitados'}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-1 flex-1">
        {(plan.features ?? []).map((f, i) => (
          <li key={i} className="text-xs text-ink-muted flex items-start gap-1.5">
            <span className="text-success shrink-0">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-2 border-t border-border/60">
        <button onClick={onEdit}
          className="flex-1 py-1.5 text-xs border border-border rounded-md text-ink hover:bg-surface-200 transition-colors">
          Editar
        </button>
        <button onClick={onDelete}
          className="px-3 py-1.5 text-xs border border-danger/20 rounded-md text-danger hover:bg-danger/5 transition-colors">
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ── Plans page ────────────────────────────────────────────────────────────────

export default function Plans() {
  const [list,         setList]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [showNew,      setShowNew]      = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, nombre }

  const [promo,       setPromo]       = useState(null);
  const [promoForm,   setPromoForm]   = useState(EMPTY_PROMO);
  const [promoSaving, setPromoSaving] = useState(null);

  const [trialDays,       setTrialDays]       = useState(14);
  const [trialDaysInput,  setTrialDaysInput]  = useState('14');
  const [trialSaving,     setTrialSaving]     = useState(false);

  useEffect(() => {
    planesApi.list()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));

    promoApi.get()
      .then(p => {
        if (!p) return;
        setPromo(p);
        setPromoForm({
          label:    p.label    ?? 'Oferta especial',
          descuento: String(p.descuento ?? 10),
          tipo:     p.tipo     ?? 'manual',
          inicio:   p.inicio   ? p.inicio.slice(0, 16) : '',
          fin:      p.fin      ? p.fin.slice(0, 16)    : '',
        });
      })
      .catch(() => {});

    configApi.getTrial()
      .then(c => {
        const d = c.diasPrueba ?? 14;
        setTrialDays(d);
        setTrialDaysInput(String(d));
      })
      .catch(() => {});
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

  function handleDelete(id, nombre) {
    setDeleteTarget({ id, nombre });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await planesApi.remove(deleteTarget.id);
    setList(prev => prev.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
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

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <AntologicoLoaderCream size={300} />
    </div>
  );

  return (
    <>
    {deleteTarget && (
      <ConfirmModal
        title={`¿Eliminar "${deleteTarget.nombre}"?`}
        text="Los tenants que tengan este plan asignado quedarán sin plan."
        confirmText="Sí, eliminar"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    )}
    <div className="w-full">
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

      {/* ── Fila horizontal de cards ── */}
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-brand">
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
            className="min-w-[220px] w-[220px] shrink-0 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-ink-muted hover:border-primary hover:text-primary transition-colors"
          >
            <span className="text-4xl font-thin leading-none">+</span>
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
              highlight:           editingPlan.highlight ?? false,
              capabilities:        { ...EMPTY_CAPABILITIES, ...(editingPlan.capabilities ?? {}) },
            } : undefined}
            onSave={editing ? p => handleUpdate(editing, p) : handleCreate}
            onCancel={() => { setShowNew(false); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* ── Período de prueba ── */}
      <div className="mt-10 pt-8 border-t border-border">
        <div className="mb-5">
          <h2 className="font-display text-xl text-ink">Período de prueba</h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Días de prueba gratuita que recibe cada nuevo tenant al registrarse.
          </p>
        </div>
        <div className="bg-surface-100 border border-border rounded-xl p-6 flex items-end gap-4">
          <div className="flex-1 max-w-[200px]">
            <label className={LABEL_CLS}>Días de prueba</label>
            <input
              type="number"
              value={trialDaysInput}
              onChange={e => setTrialDaysInput(e.target.value)}
              min="1"
              max="90"
              className={INPUT_CLS}
            />
          </div>
          <button
            onClick={async () => {
              const val = Number(trialDaysInput);
              if (!val || val < 1) return;
              setTrialSaving(true);
              try {
                const result = await configApi.saveTrial(val);
                setTrialDays(result.diasPrueba ?? val);
              } catch (err) {
                console.error('Error guardando días de prueba:', err);
              } finally {
                setTrialSaving(false);
              }
            }}
            disabled={trialSaving || Number(trialDaysInput) === trialDays}
            className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
          >
            {trialSaving ? 'Guardando…' : 'Guardar'}
          </button>
          <p className="text-xs text-ink-muted pb-1">
            Actual: <strong className="text-ink">{trialDays} días</strong>
          </p>
        </div>
      </div>

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
    </>
  );
}
