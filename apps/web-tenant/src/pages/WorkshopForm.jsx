import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TimeSelect from '../components/TimeSelect';
import { workshops as api } from '../services/api';

const EMPTY = {
  nombre: '',
  categoria: '',
  descripcion: '',
  cuposTotales: '',
  precio: '',
  fecha: '',
  hora: '09:00',
  estado: 'BORRADOR',
};

function localDateStr(d) {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function localTimeStr(d) {
  const date = new Date(d);
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  // snap to nearest 15-min mark
  const snapped = [0, 15, 30, 45].reduce((prev, curr) =>
    Math.abs(curr - Number(min)) < Math.abs(prev - Number(min)) ? curr : prev
  );
  return `${h}:${String(snapped).padStart(2, '0')}`;
}

const INPUT_CLS =
  'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

export default function WorkshopForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(id)
      .then((w) => {
        setForm({
          nombre: w.nombre,
          categoria: w.categoria ?? '',
          descripcion: w.descripcion ?? '',
          cuposTotales: String(w.cuposTotales),
          precio: String(w.precio),
          fecha: localDateStr(w.fecha),
          hora: localTimeStr(w.fecha),
          estado: w.estado,
        });
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoadingData(false));
  }, [id]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!form.cuposTotales || isNaN(form.cuposTotales) || Number(form.cuposTotales) < 1)
      errs.cuposTotales = 'Debe ser un número mayor a 0';
    if (!form.precio || isNaN(form.precio) || Number(form.precio) < 0)
      errs.precio = 'Precio inválido';
    if (!form.fecha) errs.fecha = 'La fecha es requerida';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre,
        categoria: form.categoria || undefined,
        descripcion: form.descripcion || undefined,
        cuposTotales: Number(form.cuposTotales),
        precio: Number(form.precio),
        fecha: new Date(`${form.fecha}T${form.hora}:00`).toISOString(),
        estado: form.estado,
      };

      if (isEdit) {
        await api.update(id, payload);
      } else {
        await api.create(payload);
      }
      navigate('/workshops');
    } catch (err) {
      // Server-side validation errors
      if (err.message) setErrors({ _server: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return <Layout><p className="text-sm text-ink-muted">Cargando taller…</p></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-lg">
        <Link to="/workshops" className="text-xs text-ink-muted hover:text-ink mb-4 inline-block">
          ← Volver a talleres
        </Link>
        <h1 className="font-display text-3xl text-ink mb-6">
          {isEdit ? 'Editar taller' : 'Nuevo taller'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Nombre */}
          <div>
            <label className={LABEL_CLS}>Nombre *</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ej: Taller de acuarela"
              className={INPUT_CLS}
            />
            {errors.nombre && <p className="mt-1 text-xs text-danger">{errors.nombre}</p>}
          </div>

          {/* Categoría */}
          <div>
            <label className={LABEL_CLS}>Categoría</label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => set('categoria', e.target.value)}
              placeholder="Ej: Arte, Cocina, Música…"
              className={INPUT_CLS}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={LABEL_CLS}>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              rows={3}
              placeholder="Describí el taller brevemente…"
              className={INPUT_CLS + ' resize-none'}
            />
          </div>

          {/* Cupos y precio */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Cupos totales *</label>
              <input
                type="number"
                min="1"
                value={form.cuposTotales}
                onChange={(e) => set('cuposTotales', e.target.value)}
                className={INPUT_CLS + ' font-mono'}
              />
              {errors.cuposTotales && <p className="mt-1 text-xs text-danger">{errors.cuposTotales}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>Precio (ARS) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => set('precio', e.target.value)}
                className={INPUT_CLS + ' font-mono'}
              />
              {errors.precio && <p className="mt-1 text-xs text-danger">{errors.precio}</p>}
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLS}>Fecha *</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set('fecha', e.target.value)}
                className={INPUT_CLS + ' font-mono'}
              />
              {errors.fecha && <p className="mt-1 text-xs text-danger">{errors.fecha}</p>}
            </div>
            <div>
              <label className={LABEL_CLS}>Hora *</label>
              <TimeSelect value={form.hora} onChange={(v) => set('hora', v)} />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={LABEL_CLS}>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => set('estado', e.target.value)}
              className={INPUT_CLS}
            >
              <option value="BORRADOR">Borrador</option>
              <option value="PUBLICADO">Publicado</option>
            </select>
          </div>

          {errors._server && (
            <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
              {errors._server}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/workshops"
              className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear taller'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
