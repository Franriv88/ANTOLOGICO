import { useEffect, useState } from 'react';
import { DEMO_MODE } from '../../lib/demo';
import { listPlanes } from '../../dataconnect-generated';

const FEATURES_FALLBACK = {
  Esencial:     ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
  Profesional:  ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes'],
  Estudio:      ['Talleres ilimitados', 'Múltiples espacios', 'Encabezado con imagen', 'Reportes', 'Auditoría'],
};

const PLANES_DEMO = [
  { id: 'esencial',    nombre: 'Esencial',    precioMensual: 5900,  features: FEATURES_FALLBACK.Esencial,    highlight: false },
  { id: 'profesional', nombre: 'Profesional', precioMensual: 12900, features: FEATURES_FALLBACK.Profesional, highlight: true  },
  { id: 'estudio',     nombre: 'Estudio',     precioMensual: 24900, features: FEATURES_FALLBACK.Estudio,     highlight: false },
];

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

export default function StepPlan({ onFinish, onBack }) {
  const [planes, setPlanes]       = useState(null);
  const [selected, setSelected]   = useState(null);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (DEMO_MODE) { setPlanes(PLANES_DEMO); return; }
    listPlanes()
      .then(({ data }) => setPlanes(data?.planes ?? []))
      .catch(() => setPlanes([]));
  }, []);

  const list = planes ?? [];

  async function handleFinish() {
    setLoading(true);
    try {
      await onFinish(selected);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl text-ink mb-1">Elegí tu plan</h2>
        <p className="text-sm text-ink-muted">
          Podés cambiar de plan cuando quieras. El pago se configura después.
        </p>
      </div>

      {/* Cards de planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((plan) => (
          <PlanCard
            key={plan.id}
            nombre={plan.nombre}
            precioMensual={plan.precioMensual}
            features={Array.isArray(plan.features) ? plan.features : FEATURES_FALLBACK[plan.nombre] ?? []}
            highlight={plan.highlight}
            selected={selected === plan.id}
            onSelect={() => setSelected(plan.id)}
          />
        ))}
      </div>

      <p className="text-xs text-center text-ink-muted">
        {selected
          ? 'Los 14 días de prueba son gratuitos. El pago se configura después.'
          : 'Seleccioná un plan para continuar. Podés cambiarlo cuando quieras.'}
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 border border-border text-sm font-medium text-ink rounded-md hover:bg-surface-200 transition-colors"
        >
          ← Atrás
        </button>
        <button
          onClick={handleFinish}
          disabled={loading || !selected}
          className="flex-1 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
        >
          {loading ? 'Iniciando…' : 'Comenzar 14 días gratis →'}
        </button>
      </div>
    </div>
  );
}

function PlanCard({ nombre, precioMensual, features = [], highlight, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
        selected
          ? 'border-primary bg-primary/5'
          : highlight
          ? 'border-primary/40 hover:border-primary bg-white'
          : 'border-border hover:border-primary/40 bg-white'
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-primary text-white rounded-full px-2.5 py-0.5 whitespace-nowrap">
          Recomendado
        </span>
      )}
      <div className="flex items-center justify-between mb-1 mt-1">
        <span className="font-semibold text-sm text-ink">{nombre}</span>
        {precioMensual && (
          <span className="text-xs font-mono text-ink-muted">
            {formatPrecio(precioMensual)}/mes
          </span>
        )}
      </div>
      <p className="text-xs text-primary font-medium mb-2">14 días gratis</p>
      <ul className="flex flex-col gap-0.5">
        {features.map((f, i) => (
          <li key={i} className="text-xs text-ink-muted flex items-center gap-1.5">
            <span className="text-success">✓</span> {f}
          </li>
        ))}
      </ul>
    </button>
  );
}
