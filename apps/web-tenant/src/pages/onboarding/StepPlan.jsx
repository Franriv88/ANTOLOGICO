import { useState } from 'react';
import { usePlanes, PLANES_FALLBACK, precioConPeriodo } from '../../hooks/usePlanes';
import { usePromo, isPromoActiva, precioConPromoYPeriodo } from '../../hooks/usePromo';

function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

const PERIODOS = [
  { id: 'mensual',    label: 'Mensual' },
  { id: 'trimestral', label: 'Trimestral' },
  { id: 'anual',      label: 'Anual' },
];

export default function StepPlan({ onFinish, onBack }) {
  const planesDB = usePlanes();
  const promo    = usePromo();
  const [selected, setSelected] = useState(null);   // planId
  const [periodo,  setPeriodo]  = useState('mensual');
  const [loading,  setLoading]  = useState(false);

  const list        = planesDB ?? [];
  const promoActiva = isPromoActiva(promo);

  async function handleFinish() {
    setLoading(true);
    try {
      await onFinish({ planId: selected, periodo });
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

      {/* Promo banner */}
      {promoActiva && (
        <div className="flex items-center gap-2 bg-primary/8 text-primary text-xs font-semibold px-3 py-2 rounded-lg">
          🎉 {promo.label} — {promo.descuento}% de descuento en todos los planes
        </div>
      )}

      {/* Toggle de período */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 p-1 bg-surface-200 rounded-lg w-fit">
          {PERIODOS.map(op => (
            <button key={op.id} type="button" onClick={() => setPeriodo(op.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${periodo === op.id ? 'bg-white shadow-sm text-ink' : 'text-ink-muted hover:text-ink'}`}>
              {op.label}
              {op.id !== 'mensual' && list[0] && (list[0].descuentoTrimestral ?? 0) + (list[0].descuentoAnual ?? 0) > 0 && (
                <span className="ml-1 text-success font-semibold">
                  −{op.id === 'trimestral' ? (list[0].descuentoTrimestral ?? 0) : (list[0].descuentoAnual ?? 0)}%
                </span>
              )}
            </button>
          ))}
        </div>
        {periodo !== 'mensual' && list.length > 0 && (() => {
          const maxAhorro = Math.max(...list.map(p => {
            const meses = periodo === 'trimestral' ? 3 : 12;
            return (p.precioMensual - precioConPromoYPeriodo(p, periodo, promo)) * meses;
          }));
          const label = periodo === 'trimestral' ? 'cada 3 meses' : 'por año';
          return (
            <p className="text-xs text-success font-medium">
              ✓ Ahorrás hasta {formatPrecio(maxAhorro)} {label} comparado con el plan mensual
            </p>
          );
        })()}
      </div>

      {/* Cards de planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((plan) => {
          const precio = precioConPromoYPeriodo(plan, periodo, promo);
          const dto    = periodo === 'trimestral' ? (plan.descuentoTrimestral ?? 0)
                       : periodo === 'anual'      ? (plan.descuentoAnual      ?? 0) : 0;
          const features = Array.isArray(plan.features)
            ? plan.features
            : (PLANES_FALLBACK.find(p => p.id === plan.id)?.features ?? []);
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              precio={precio}
              descuento={dto}
              periodo={periodo}
              features={features}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
            />
          );
        })}
      </div>

      <p className="text-xs text-center text-ink-muted">
        {selected
          ? 'Los 14 días de prueba son gratuitos. El pago se configura después.'
          : 'Seleccioná un plan para continuar. Podés cambiarlo cuando quieras.'}
      </p>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="flex-1 py-2.5 border border-border text-sm font-medium text-ink rounded-md hover:bg-surface-200 transition-colors">
          ← Atrás
        </button>
        <button onClick={handleFinish} disabled={loading || !selected}
          className="flex-1 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
          {loading ? 'Iniciando…' : 'Comenzar 14 días gratis →'}
        </button>
      </div>
    </div>
  );
}

function PlanCard({ plan, precio, descuento, periodo, features, selected, onSelect }) {
  return (
    <button type="button" onClick={onSelect}
      className={`relative w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
        selected
          ? 'border-primary bg-primary/5'
          : plan.highlight
          ? 'border-primary/40 hover:border-primary bg-white'
          : 'border-border hover:border-primary/40 bg-white'
      }`}>
      {plan.highlight && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-primary text-white rounded-full px-2.5 py-0.5 whitespace-nowrap">
          Recomendado
        </span>
      )}
      <div className="flex items-start justify-between mb-1 mt-1 gap-2">
        <span className="font-semibold text-sm text-ink">{plan.nombre}</span>
        <div className="text-right shrink-0">
          <p className="text-xs font-mono text-ink font-semibold">{formatPrecio(precio)}/mes</p>
          {precio < plan.precioMensual && (() => {
            const meses  = periodo === 'trimestral' ? 3 : 12;
            const ahorro = (plan.precioMensual - precio) * meses;
            return (
              <>
                <p className="text-xs text-success font-medium">Ahorrás {formatPrecio(ahorro)}</p>
                {descuento > 0 && <p className="text-xs text-ink-muted">{formatPrecio(precio * meses)} c/{periodo === 'trimestral' ? '3m' : 'año'}</p>}
              </>
            );
          })()}
        </div>
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
