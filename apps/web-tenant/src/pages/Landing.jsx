import { Link } from 'react-router-dom';
import { useRef, useState, useCallback } from 'react';
import { IconAntologico, LogoAntologico } from '../components/LogoAntologico';
import { usePlanes, precioConPeriodo } from '../hooks/usePlanes';
import { usePromo, isPromoActiva, precioConPromoYPeriodo } from '../hooks/usePromo';

// ── Red Q como fondo (solo nodos + punteado, sin íconos) ──────────────────
const EDGES = [
  [256,108,392,128],[256,108,184,190],[256,108,315,198],[184,190,315,198],
  [315,198,392,128],[392,128,522,190],[522,190,656,158],[184,190,140,238],
  [315,198,268,240],[392,128,400,235],[522,190,548,238],[656,158,712,244],
  [213,413,150,345],[213,413,365,445],[365,445,322,348],[365,445,446,392],
  [446,392,430,348],[446,392,561,428],[561,428,598,350],[561,428,692,390],
  [692,390,740,345],
];

// [cx, cy, r, isHub]
const NODES = [
  [256,108,6,true],[446,392,6,true],
  [392,128,29,false],[184,190,29,false],[315,198,29,false],[522,190,29,false],
  [656,158,29,false],[213,413,29,false],[365,445,29,false],[561,428,29,false],
  [692,390,29,false],
];

function HeroNetwork({ offset }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-10%',
        pointerEvents: 'none',
        willChange: 'transform',
        transition: 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
      }}
    >
      <svg
        viewBox="0 0 816 497"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* aristas punteadas */}
        <g
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="0.1 7"
          fill="none"
        >
          {EDGES.map(([x1,y1,x2,y2],i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        {/* nodos vacíos */}
        {NODES.map(([cx,cy,r,isHub],i) => (
          <circle
            key={i} cx={cx} cy={cy} r={r}
            fill={isHub ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={isHub ? 1 : 1.5}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Datos ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    title: 'Gestioná tus talleres',
    desc: 'Creá, publicá y editá talleres con cupos, fechas y precios. Todo desde un panel simple.',
  },
  {
    title: 'Cobros integrados',
    desc: 'Aceptá pagos con Mercado Pago. El dinero va directo a tu cuenta sin intermediarios.',
  },
  {
    title: 'Tu propio dominio',
    desc: 'Publicá tus talleres en tu URL personalizada. Cada espacio, su propia identidad.',
  },
  {
    title: 'Tus alumnos en mobile',
    desc: 'Los usuarios descubren, reservan y gestionan sus inscripciones desde la app.',
  },
];


// ── Componente principal ──────────────────────────────────────────────────
function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
}

const PERIODOS = [
  { id: 'mensual',    label: 'Mensual' },
  { id: 'trimestral', label: 'Trimestral' },
  { id: 'anual',      label: 'Anual' },
];

export default function Landing() {
  const heroRef  = useRef(null);
  const rafRef   = useRef(null);
  const [offset,  setOffset]  = useState({ x: 0, y: 0 });
  const [periodo, setPeriodo] = useState('mensual');
  const planes = usePlanes();
  const promo  = usePromo();
  const promoActiva = isPromoActiva(promo);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const dx = (e.clientX - rect.left) / rect.width  - 0.5;
      const dy = (e.clientY - rect.top)  / rect.height - 0.5;
      setOffset({ x: dx * -28, y: dy * -18 });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-surface-0 text-ink">

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(148deg, #E85D4A 0%, #C4412F 48%, #8C2E1F 100%)' }}
      >
        <HeroNetwork offset={offset} />

        {/* Nav */}
        <nav className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <IconAntologico size={30} />
            <span
              className="text-base font-semibold text-white"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Antológico
            </span>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 border border-white/35 text-white text-sm font-medium rounded-md hover:bg-white/12 transition-colors"
          >
            Ingresar
          </Link>
        </nav>

        {/* Contenido central */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">

          {/* Logo grande */}
          <div className="w-full" style={{ maxWidth: 680 }}>
            <LogoAntologico theme="coral" width={680} />
          </div>

          {/* Tagline */}
          <p
            className="mt-6 text-lg max-w-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.78)' }}
          >
            Publicá tus talleres, gestioná reservas y cobrá en línea —
            todo desde un panel pensado para profesionales independientes.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/registro"
              className="px-7 py-3.5 bg-white font-semibold text-sm rounded-lg hover:bg-white/92 transition-colors shadow-lg"
              style={{ color: '#C4412F' }}
            >
              Empezar gratis →
            </Link>
            <a
              href="#planes"
              className="px-7 py-3.5 border border-white/35 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              Ver planes
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="relative z-10 pb-7 flex justify-center shrink-0" style={{ opacity: 0.45 }}>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="12" height="18" rx="6" stroke="white" strokeWidth="1.5"/>
            <circle cx="7" cy="6" r="2" fill="white">
              <animate attributeName="cy" values="6;12;6" dur="1.8s" repeatCount="indefinite" calcMode="ease-in-out"/>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </svg>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-surface-0 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-ink text-center mb-2">
            Todo lo que necesitás para enseñar
          </h2>
          <p className="text-center text-ink-muted text-sm mb-12">
            Desde la creación del taller hasta el pago del alumno
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map(({ title, desc }) => (
              <div key={title} className="bg-surface-100 border border-border rounded-xl p-6 flex gap-4">
                <div className="w-1 shrink-0 self-stretch rounded-full bg-primary" />
                <div>
                  <h3 className="font-semibold text-sm text-ink mb-1">{title}</h3>
                  <p className="text-sm text-ink-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Planes ── */}
      <section id="planes" className="bg-surface-100 py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl text-center text-ink mb-2">Planes</h2>
          <p className="text-center text-ink-muted text-sm mb-8">
            Precios en ARS por mes, IVA incluido
          </p>

          {/* Promo banner */}
          {promoActiva && (
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
                🎉 {promo.label} — {promo.descuento}% de descuento en todos los planes
              </span>
            </div>
          )}

          {/* Toggle de período */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="flex gap-1 p-1 bg-surface-200 rounded-lg">
              {PERIODOS.map(op => {
                const plan0 = (planes ?? [])[0];
                const dto = op.id === 'trimestral' ? (plan0?.descuentoTrimestral ?? 0)
                          : op.id === 'anual'      ? (plan0?.descuentoAnual      ?? 0) : 0;
                return (
                  <button key={op.id} type="button" onClick={() => setPeriodo(op.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      periodo === op.id ? 'bg-white shadow-sm text-ink' : 'text-ink-muted hover:text-ink'
                    }`}>
                    {op.label}
                    {op.id !== 'mensual' && dto > 0 && (
                      <span className="ml-1.5 text-xs text-success font-semibold">−{dto}%</span>
                    )}
                  </button>
                );
              })}
            </div>
            {periodo !== 'mensual' && (planes ?? []).length > 0 && (() => {
              const maxAhorro = Math.max(...(planes ?? []).map(p => {
                const meses = periodo === 'trimestral' ? 3 : 12;
                const precioBase   = promoActiva ? Math.round(p.precioMensual * (1 - (promo.descuento ?? 0) / 100)) : p.precioMensual;
                const precioCon    = precioConPromoYPeriodo(p, periodo, promo);
                return (precioBase - precioCon) * meses;
              }));
              const label = periodo === 'trimestral' ? 'cada 3 meses' : 'por año';
              return (
                <p className="text-xs text-success font-medium">
                  ✓ Ahorrás hasta {formatPrecio(maxAhorro)} {label} comparado con el plan mensual
                </p>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(planes ?? []).map((plan) => {
              const precio       = precioConPromoYPeriodo(plan, periodo, promo);
              const precioBase   = promoActiva ? Math.round(plan.precioMensual * (1 - (promo.descuento ?? 0) / 100)) : plan.precioMensual;
              const dto          = periodo === 'trimestral' ? (plan.descuentoTrimestral ?? 0)
                                 : periodo === 'anual'      ? (plan.descuentoAnual      ?? 0) : 0;
              const meses        = periodo === 'trimestral' ? 3 : 12;
              const { id, nombre, features = [], highlight } = plan;
              return (
                <div
                  key={id}
                  className={`rounded-xl border p-6 flex flex-col ${
                    highlight
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-surface-0'
                  }`}
                >
                  {highlight && (
                    <span className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                      Más popular
                    </span>
                  )}
                  <h3 className="font-semibold text-ink mb-1">{nombre}</h3>
                  <div className="mb-1">
                    <span className="font-mono text-2xl text-ink font-semibold">{formatPrecio(precio)}</span>
                    <span className="text-sm font-normal text-ink-muted">/mes</span>
                    {(promoActiva || dto > 0) && precio < plan.precioMensual && (
                      <span className="ml-2 text-xs text-ink-muted line-through">{formatPrecio(plan.precioMensual)}</span>
                    )}
                  </div>
                  {dto > 0 && (
                    <p className="text-xs text-success font-medium mb-1">
                      Ahorrás {formatPrecio((precioBase - precio) * meses)} {periodo === 'trimestral' ? 'c/3m' : 'por año'}
                    </p>
                  )}
                  {promoActiva && periodo === 'mensual' && (
                    <p className="text-xs text-success font-medium mb-1">
                      Ahorrás {formatPrecio(plan.precioMensual - precio)}/mes con la promo
                    </p>
                  )}
                  <ul className="flex flex-col gap-1.5 flex-1 mt-3">
                    {features.map((f) => (
                      <li key={f} className="text-xs text-ink-muted flex items-center gap-1.5">
                        <span className="text-primary font-bold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/registro"
                    className={`mt-6 py-2.5 text-center rounded-md text-sm font-semibold transition-colors ${
                      highlight
                        ? 'bg-primary text-white hover:bg-primary-strong'
                        : 'border border-border text-ink hover:bg-surface-200'
                    }`}
                  >
                    Empezar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-surface-0 border-t border-border py-8">
        <p className="text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} Antológico · Hecho en Argentina
        </p>
      </footer>
    </div>
  );
}
