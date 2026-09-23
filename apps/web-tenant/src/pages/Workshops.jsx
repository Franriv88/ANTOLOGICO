import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SlotBadge from '../components/SlotBadge';
import { workshops as api } from '../services/api';

const ESTADOS = ['', 'BORRADOR', 'PUBLICADO', 'CANCELADO', 'FINALIZADO'];
const ESTADO_LABEL = {
  '': 'Todos',
  BORRADOR: 'Borrador',
  PUBLICADO: 'Publicado',
  CANCELADO: 'Cancelado',
  FINALIZADO: 'Finalizado',
};

function formatFecha(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function formatHora(iso) {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
  });
}

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

export default function Workshops() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estado, setEstado] = useState('');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      setError('');
      const data = await api.list({ ...(estado && { estado }), ...(q && { q }) });
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [estado]);

  async function handleDelete(id, nombre) {
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.remove(id);
      setItems((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-ink">Talleres</h1>
          <Link
            to="/workshops/nuevo"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
          >
            + Nuevo taller
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            placeholder="Buscar por nombre…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="flex-1 px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary"
          >
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{ESTADO_LABEL[s]}</option>
            ))}
          </select>
        </div>

        {/* Lista */}
        {loading && (
          <p className="text-sm text-ink-muted py-8 text-center">Cargando…</p>
        )}
        {error && (
          <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded px-4 py-3">
            {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-16 text-ink-muted">
            <p className="text-sm">No hay talleres todavía.</p>
            <Link to="/workshops/nuevo" className="mt-2 inline-block text-sm text-primary hover:underline">
              Crear el primero
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((w) => (
            <div
              key={w.id}
              className="bg-surface-100 border border-border rounded-lg px-5 py-4 flex items-center gap-4"
            >
              {/* Encabezado de color del taller */}
              {w.headerType === 'COLOR' && w.headerValue && (
                <div
                  className="w-1 self-stretch rounded-full shrink-0"
                  style={{ backgroundColor: w.headerValue }}
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-semibold text-sm text-ink truncate">{w.nombre}</h2>
                  {w.categoria && (
                    <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded font-medium shrink-0">
                      {w.categoria}
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted font-mono">
                  {formatFecha(w.fecha)} · {formatHora(w.fecha)}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-sm font-mono text-ink">{formatPrecio(w.precio)}</p>
                  <p className="text-xs text-ink-muted font-mono">
                    {w.cuposDisponibles}/{w.cuposTotales} cupos
                  </p>
                </div>

                <SlotBadge status={w.slotStatus} />

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/workshops/${w.id}/editar`)}
                    className="px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-200 rounded-md transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.nombre)}
                    className="px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 rounded-md transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
