import { useEffect, useState } from 'react';
import { promoApi } from '../services/adminApi';

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function toDatetimeLocal(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function promoStatus(promo) {
  if (!promo || !promo.activo) return { label: 'Inactiva', cls: 'bg-surface-200 text-ink-muted' };
  if (promo.tipo === 'programado') {
    const now  = Date.now();
    const ini  = promo.inicio ? new Date(promo.inicio).getTime() : 0;
    const fin  = promo.fin    ? new Date(promo.fin).getTime()    : Infinity;
    if (now < ini)  return { label: `Programada · empieza ${formatFecha(promo.inicio)}`, cls: 'bg-amber-100 text-amber-700' };
    if (now > fin)  return { label: `Vencida el ${formatFecha(promo.fin)}`,              cls: 'bg-red-100 text-red-600' };
  }
  return { label: `Activa · −${promo.descuento ?? 0}% en todos los planes`, cls: 'bg-green-100 text-green-700' };
}

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

export default function Promocion() {
  const [promo,   setPromo]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({
    label: '',
    descuento: '10',
    tipo: 'manual',
    inicio: '',
    fin: '',
    activo: false,
  });

  useEffect(() => {
    promoApi.get().then(data => {
      if (data) {
        setPromo(data);
        setForm({
          label:    data.label    ?? '',
          descuento: String(data.descuento ?? '10'),
          tipo:     data.tipo     ?? 'manual',
          inicio:   toDatetimeLocal(data.inicio),
          fin:      toDatetimeLocal(data.fin),
          activo:   data.activo   ?? false,
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      label:    form.label.trim() || 'Promoción',
      descuento: Number(form.descuento) || 0,
      tipo:     form.tipo,
      inicio:   form.tipo === 'programado' && form.inicio ? new Date(form.inicio).toISOString() : null,
      fin:      form.tipo === 'programado' && form.fin    ? new Date(form.fin).toISOString()    : null,
      activo:   form.activo,
    };
    const updated = await promoApi.save(payload);
    setPromo(updated);
    setSaving(false);
  }

  async function handleToggle() {
    setSaving(true);
    const updated = await promoApi.toggle(!form.activo);
    setPromo(updated);
    setForm(f => ({ ...f, activo: updated?.activo ?? !f.activo }));
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-ink-muted">Cargando…</p>;

  const status = promoStatus(promo ?? { activo: form.activo, tipo: form.tipo, descuento: Number(form.descuento), inicio: form.tipo === 'programado' && form.inicio ? new Date(form.inicio).toISOString() : null, fin: form.tipo === 'programado' && form.fin ? new Date(form.fin).toISOString() : null });

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Promoción global</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          Un descuento adicional que se aplica sobre todos los planes mientras esté activo.
        </p>
      </div>

      {/* Estado actual */}
      <div className="flex items-center justify-between bg-surface-100 border border-border rounded-xl px-5 py-4 mb-6">
        <div>
          <p className="text-xs text-ink-muted mb-1">Estado actual</p>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 ${
            form.activo
              ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20'
              : 'bg-primary text-white hover:bg-primary-strong'
          }`}
        >
          {saving ? '…' : form.activo ? 'Desactivar' : 'Activar'}
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSave} className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-ink text-sm">Configurar promoción</h2>

        <div>
          <label className={LABEL_CLS}>Nombre de la promoción</label>
          <input type="text" value={form.label} onChange={e => set('label', e.target.value)}
            placeholder="Ej: Promo de lanzamiento" className={INPUT_CLS} />
        </div>

        <div>
          <label className={LABEL_CLS}>Descuento (%)</label>
          <input type="number" value={form.descuento} onChange={e => set('descuento', e.target.value)}
            min="1" max="99" placeholder="15" className={INPUT_CLS} />
          <p className="text-xs text-ink-muted mt-1">
            Se aplica sobre el precio mensual de todos los planes, antes del descuento por período.
          </p>
        </div>

        {/* Tipo */}
        <div>
          <label className={LABEL_CLS}>Tipo de activación</label>
          <div className="flex gap-2">
            {[['manual', 'Manual'], ['programado', 'Programada']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => set('tipo', val)}
                className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                  form.tipo === val
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-ink-muted hover:border-primary/40'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Fechas (solo si programado) */}
        {form.tipo === 'programado' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Inicio</label>
              <input type="datetime-local" value={form.inicio} onChange={e => set('inicio', e.target.value)}
                className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Fin</label>
              <input type="datetime-local" value={form.fin} onChange={e => set('fin', e.target.value)}
                className={INPUT_CLS} />
            </div>
          </div>
        )}

        {form.tipo === 'manual' && (
          <p className="text-xs text-ink-muted bg-surface-200 rounded-md px-3 py-2">
            Con activación manual, la promoción se activa y desactiva con el botón de arriba.
          </p>
        )}

        <button type="submit" disabled={saving}
          className="py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
          {saving ? 'Guardando…' : 'Guardar configuración'}
        </button>
      </form>
    </div>
  );
}
