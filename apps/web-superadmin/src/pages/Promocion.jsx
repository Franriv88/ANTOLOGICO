import { useEffect, useState } from 'react';
import { promoApi, promoCodes as promoCodesApi, tenants as tenantsApi, planes as planesApi } from '../services/adminApi';

const FMT = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const fmt = n => FMT.format(n);

const INPUT = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LBL   = 'block text-xs font-medium text-ink-muted mb-1';

function toDatetimeLocal(iso) {
  if (!iso) return '';
  const d   = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function diasRestantes(hasta) {
  if (!hasta) return 0;
  return Math.ceil((new Date(hasta) - Date.now()) / 86_400_000);
}

function promoStatus(promo) {
  if (!promo?.activo) return { label: 'Inactiva', cls: 'bg-surface-200 text-ink-muted' };
  if (promo.tipo === 'programado') {
    const now = Date.now();
    const ini = promo.inicio ? new Date(promo.inicio).getTime() : 0;
    const fin = promo.fin    ? new Date(promo.fin).getTime()    : Infinity;
    if (now < ini) return { label: `Programada · arranca ${new Date(promo.inicio).toLocaleDateString('es-AR')}`, cls: 'bg-amber-100 text-amber-700' };
    if (now > fin) return { label: 'Vencida', cls: 'bg-red-100 text-red-600' };
  }
  const scope = (!promo.planesAplicados || promo.planesAplicados === 'all')
    ? 'todos los planes'
    : `${promo.planesAplicados.length} plan${promo.planesAplicados.length !== 1 ? 'es' : ''}`;
  return { label: `Activa · −${promo.descuento ?? 0}% en ${scope}`, cls: 'bg-green-100 text-green-700' };
}

export default function Promocion() {
  const [planes,       setPlanes]       = useState(null);
  const [tenantsList,  setTenantsList]  = useState([]);
  const [codes,        setCodes]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  // ── Promo global ──────────────────────────────────────────────────────────
  const [promo,   setPromo]   = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm] = useState({
    label: '', descuento: '10', tipo: 'manual',
    inicio: '', fin: '', activo: false,
    planesSeleccion: 'all', planesIds: [],
  });

  // ── Código form ───────────────────────────────────────────────────────────
  const [newCode,    setNewCode]    = useState({ code: '', descuento: '15', maxUsos: '' });
  const [addingCode, setAddingCode] = useState(false);

  // ── Descuento tenant form ─────────────────────────────────────────────────
  const [tenantForm,    setTenantForm]    = useState({ espacioId: '', descuento: '50', hasta: '' });
  const [savingTenant,  setSavingTenant]  = useState(false);

  useEffect(() => {
    Promise.all([promoApi.get(), planesApi.list(), tenantsApi.list(), promoCodesApi.list()])
      .then(([p, pl, t, c]) => {
        setPromo(p);
        if (p) setForm({
          label:          p.label    ?? '',
          descuento:      String(p.descuento ?? '10'),
          tipo:           p.tipo     ?? 'manual',
          inicio:         toDatetimeLocal(p.inicio),
          fin:            toDatetimeLocal(p.fin),
          activo:         p.activo   ?? false,
          planesSeleccion: (!p.planesAplicados || p.planesAplicados === 'all') ? 'all' : 'specific',
          planesIds:      Array.isArray(p.planesAplicados) ? p.planesAplicados : [],
        });
        setPlanes(pl);
        setTenantsList(t);
        setCodes(c);
      })
      .finally(() => setLoading(false));
  }, []);

  function setF(k, v)  { setForm(f      => ({ ...f,      [k]: v })); }
  function setTF(k, v) { setTenantForm(f => ({ ...f, [k]: v })); }
  function togglePlanId(id) {
    setForm(f => ({
      ...f,
      planesIds: f.planesIds.includes(id)
        ? f.planesIds.filter(p => p !== id)
        : [...f.planesIds, id],
    }));
  }

  // ── Handlers promo global ─────────────────────────────────────────────────
  async function handleSavePromo(forcedActivo) {
    setSaving(true);
    const payload = {
      label:     form.label.trim() || 'Promoción',
      descuento: Number(form.descuento) || 0,
      tipo:      form.tipo,
      inicio:    form.tipo === 'programado' && form.inicio ? new Date(form.inicio).toISOString() : null,
      fin:       form.tipo === 'programado' && form.fin    ? new Date(form.fin).toISOString()    : null,
      activo:    forcedActivo !== undefined ? forcedActivo : form.activo,
      planesAplicados: form.planesSeleccion === 'all' ? 'all' : form.planesIds,
    };
    const updated = await promoApi.save(payload);
    setPromo(updated);
    setForm(f => ({ ...f, activo: updated?.activo ?? f.activo }));
    setSaving(false);
  }

  // ── Handlers códigos ──────────────────────────────────────────────────────
  async function handleCreateCode(e) {
    e.preventDefault();
    if (!newCode.code || !newCode.descuento) return;
    setAddingCode(true);
    const created = await promoCodesApi.create(newCode);
    setCodes(prev => [created, ...prev]);
    setNewCode({ code: '', descuento: '15', maxUsos: '' });
    setAddingCode(false);
  }

  async function handleToggleCode(id, activo) {
    const updated = await promoCodesApi.toggle(id, !activo);
    setCodes(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  }

  async function handleDeleteCode(id) {
    await promoCodesApi.remove(id);
    setCodes(prev => prev.filter(c => c.id !== id));
  }

  // ── Handlers descuentos tenant ────────────────────────────────────────────
  async function handleOtorgar(e) {
    e.preventDefault();
    if (!tenantForm.espacioId || !tenantForm.descuento || !tenantForm.hasta) return;
    setSavingTenant(true);
    const descuentoEspecial = {
      descuento: Number(tenantForm.descuento),
      desde:     new Date().toISOString(),
      hasta:     new Date(tenantForm.hasta + 'T23:59:59').toISOString(),
    };
    await tenantsApi.update(tenantForm.espacioId, { descuentoEspecial });
    setTenantsList(prev => prev.map(t => t.id === tenantForm.espacioId ? { ...t, descuentoEspecial } : t));
    setTenantForm({ espacioId: '', descuento: '50', hasta: '' });
    setSavingTenant(false);
  }

  async function handleRevocar(espacioId) {
    await tenantsApi.update(espacioId, { descuentoEspecial: null });
    setTenantsList(prev => prev.map(t => t.id === espacioId ? { ...t, descuentoEspecial: null } : t));
  }

  if (loading) return <p className="text-sm text-ink-muted p-6">Cargando…</p>;

  const dto    = Number(form.descuento) || 0;
  const status = promoStatus(promo);
  const descuentosActivos = tenantsList.filter(
    t => t.descuentoEspecial?.hasta && new Date(t.descuentoEspecial.hasta) > new Date()
  );

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Descuentos y promociones</h1>
        <p className="text-sm text-ink-muted mt-0.5">Promos globales, códigos y beneficios por tenant</p>
      </div>

      {/* ── 1. Promo global ── */}
      <section className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-ink">Promoción global</h2>
            <p className="text-xs text-ink-muted mt-0.5">Descuento temporal sobre el precio de los planes</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LBL}>Nombre de la promo</label>
            <input type="text" value={form.label} onChange={e => setF('label', e.target.value)}
              placeholder="Ej: Black Friday" className={INPUT} />
          </div>
          <div>
            <label className={LBL}>Descuento (%)</label>
            <input type="number" value={form.descuento} onChange={e => setF('descuento', e.target.value)}
              min="1" max="99" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LBL}>Activación</label>
          <div className="flex gap-2">
            {[['manual','Manual'],['programado','Programada']].map(([v,l]) => (
              <button key={v} type="button" onClick={() => setF('tipo', v)}
                className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                  form.tipo === v ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted hover:border-primary/40'
                }`}>
                {l}
              </button>
            ))}
          </div>
          {form.tipo === 'programado' && (
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className={LBL}>Inicio</label>
                <input type="datetime-local" value={form.inicio} onChange={e => setF('inicio', e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className={LBL}>Fin</label>
                <input type="datetime-local" value={form.fin} onChange={e => setF('fin', e.target.value)} className={INPUT} />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className={LBL}>Aplica a</label>
          <div className="flex gap-2 mb-2">
            {[['all','Todos los planes'],['specific','Planes específicos']].map(([v,l]) => (
              <button key={v} type="button" onClick={() => setF('planesSeleccion', v)}
                className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
                  form.planesSeleccion === v ? 'border-primary bg-primary/5 text-primary' : 'border-border text-ink-muted hover:border-primary/40'
                }`}>
                {l}
              </button>
            ))}
          </div>
          {form.planesSeleccion === 'specific' && planes && (
            <div className="flex gap-2 flex-wrap">
              {planes.map(p => (
                <button key={p.id} type="button" onClick={() => togglePlanId(p.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    form.planesIds.includes(p.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-ink-muted hover:border-primary/40'
                  }`}>
                  {form.planesIds.includes(p.id) ? '✓ ' : ''}{p.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {planes && dto > 0 && (
          <div className="bg-surface-0 border border-border rounded-lg p-4">
            <p className="text-xs font-medium text-ink-muted mb-3">Vista previa con esta configuración</p>
            <div className="grid grid-cols-3 gap-3">
              {planes.map(p => {
                const aplica = form.planesSeleccion === 'all' || form.planesIds.includes(p.id);
                const precioFinal = aplica ? Math.round(p.precioMensual * (1 - dto / 100)) : p.precioMensual;
                return (
                  <div key={p.id} className={`rounded-lg border p-3 ${aplica ? 'border-primary/30 bg-primary/5' : 'border-border opacity-60'}`}>
                    <p className="text-xs font-medium text-ink mb-1">{p.nombre}</p>
                    {aplica ? (
                      <>
                        <p className="text-xs text-ink-muted line-through">{fmt(p.precioMensual)}/mes</p>
                        <p className="text-sm font-mono font-semibold text-primary">{fmt(precioFinal)}/mes</p>
                        <span className="text-xs text-success font-medium">−{dto}%</span>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-mono font-semibold text-ink-muted">{fmt(p.precioMensual)}/mes</p>
                        <span className="text-xs text-ink-muted">Sin descuento</span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => handleSavePromo(undefined)} disabled={saving}
            className="flex-1 py-2.5 border border-border text-sm font-medium text-ink rounded-md hover:bg-surface-200 transition-colors disabled:opacity-50">
            {saving ? '…' : 'Guardar'}
          </button>
          <button onClick={() => handleSavePromo(!form.activo)} disabled={saving}
            className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 ${
              form.activo
                ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20'
                : 'bg-primary text-white hover:bg-primary-strong'
            }`}>
            {saving ? '…' : form.activo ? 'Guardar y desactivar' : 'Guardar y activar'}
          </button>
        </div>
      </section>

      {/* ── 2. Códigos de descuento ── */}
      <section className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-5">
        <div>
          <h2 className="font-semibold text-ink">Códigos de descuento</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Al registrarse: descuento aplica en el 1er mes post-trial.
            Con plan activo: se aplica en la próxima facturación (solo 1 mes).
            En planes trimestrales/anuales: descuenta el mes siguiente y luego vuelve al precio normal.
          </p>
        </div>

        <form onSubmit={handleCreateCode} className="bg-surface-0 border border-border rounded-lg p-4 flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-36">
            <label className={LBL}>Código</label>
            <input type="text" value={newCode.code}
              onChange={e => setNewCode(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="BIENVENIDO20" className={INPUT} />
          </div>
          <div className="w-28">
            <label className={LBL}>Descuento %</label>
            <input type="number" value={newCode.descuento} min="1" max="100"
              onChange={e => setNewCode(f => ({ ...f, descuento: e.target.value }))} className={INPUT} />
          </div>
          <div className="w-32">
            <label className={LBL}>Máx. usos</label>
            <input type="number" value={newCode.maxUsos} min="1" placeholder="Ilimitado"
              onChange={e => setNewCode(f => ({ ...f, maxUsos: e.target.value }))} className={INPUT} />
          </div>
          <button type="submit" disabled={addingCode || !newCode.code}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50 shrink-0">
            {addingCode ? '…' : 'Crear código'}
          </button>
        </form>

        {codes.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-4">No hay códigos creados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted">
                <th className="text-left pb-2 font-medium">Código</th>
                <th className="text-left pb-2 font-medium">%</th>
                <th className="text-left pb-2 font-medium">Usos</th>
                <th className="text-left pb-2 font-medium">Estado</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {codes.map(c => (
                <tr key={c.id}>
                  <td className="py-2.5 font-mono font-medium text-ink">{c.code}</td>
                  <td className="py-2.5 text-ink">−{c.descuento}%</td>
                  <td className="py-2.5 text-ink-muted text-xs">{c.usos}{c.maxUsos ? `/${c.maxUsos}` : ''}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      c.activo ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-muted'
                    }`}>
                      {c.activo ? 'Activo' : 'Pausado'}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => handleToggleCode(c.id, c.activo)} className="text-xs text-primary hover:underline">
                        {c.activo ? 'Pausar' : 'Activar'}
                      </button>
                      <button onClick={() => handleDeleteCode(c.id)} className="text-xs text-danger hover:underline">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ── 3. Descuentos por tenant ── */}
      <section className="bg-surface-100 border border-border rounded-xl p-6 flex flex-col gap-5">
        <div>
          <h2 className="font-semibold text-ink">Descuentos por tenant</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Otorgá un beneficio a un tenant específico (50%, 100% o lo que necesites) por un período determinado.
          </p>
        </div>

        <form onSubmit={handleOtorgar} className="bg-surface-0 border border-border rounded-lg p-4 flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-44">
            <label className={LBL}>Tenant</label>
            <select value={tenantForm.espacioId} onChange={e => setTF('espacioId', e.target.value)} className={INPUT}>
              <option value="">Seleccioná un tenant…</option>
              {tenantsList.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre}{t.usuario?.nombre ? ` · ${t.usuario.nombre}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className={LBL}>Descuento %</label>
            <input type="number" value={tenantForm.descuento} min="1" max="100"
              onChange={e => setTF('descuento', e.target.value)} className={INPUT} />
          </div>
          <div className="w-36">
            <label className={LBL}>Válido hasta</label>
            <input type="date" value={tenantForm.hasta}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setTF('hasta', e.target.value)} className={INPUT} />
          </div>
          <button type="submit" disabled={savingTenant || !tenantForm.espacioId || !tenantForm.hasta}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50 shrink-0">
            {savingTenant ? '…' : 'Otorgar'}
          </button>
        </form>

        {descuentosActivos.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-4">No hay descuentos especiales activos.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted">
                <th className="text-left pb-2 font-medium">Tenant</th>
                <th className="text-left pb-2 font-medium">Descuento</th>
                <th className="text-left pb-2 font-medium">Vence</th>
                <th className="text-left pb-2 font-medium">Días restantes</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {descuentosActivos.map(t => {
                const dias = diasRestantes(t.descuentoEspecial.hasta);
                return (
                  <tr key={t.id}>
                    <td className="py-2.5 font-medium text-ink">{t.nombre}</td>
                    <td className="py-2.5 font-semibold text-primary">−{t.descuentoEspecial.descuento}%</td>
                    <td className="py-2.5 text-ink-muted text-xs">
                      {new Date(t.descuentoEspecial.hasta).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        dias <= 3 ? 'bg-red-100 text-red-600' :
                        dias <= 7 ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {dias} día{dias !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => handleRevocar(t.id)} className="text-xs text-danger hover:underline">
                        Revocar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
