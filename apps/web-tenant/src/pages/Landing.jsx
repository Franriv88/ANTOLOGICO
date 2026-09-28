import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🗓',
    title: 'Gestioná tus talleres',
    desc: 'Creá, publicá y editá talleres con cupos, fechas y precios. Todo desde un panel simple.',
  },
  {
    icon: '💳',
    title: 'Cobros integrados',
    desc: 'Aceptá pagos con Mercado Pago. El dinero va directo a tu cuenta.',
  },
  {
    icon: '🌐',
    title: 'Tu propio dominio',
    desc: 'Publicá tus talleres en tu URL personalizada. Cada espacio, su propia identidad.',
  },
  {
    icon: '📱',
    title: 'Tus alumnos en mobile',
    desc: 'Los usuarios descubren, reservan y gestionan sus inscripciones desde la app.',
  },
];

const PLANS = [
  {
    nombre: 'Esencial',
    precio: '$4.999',
    features: ['Hasta 5 talleres activos', 'Dominio personalizado', 'Encabezado de color'],
    highlight: false,
  },
  {
    nombre: 'Profesional',
    precio: '$9.999',
    features: ['Talleres ilimitados', 'Dominio personalizado', 'Encabezado con imagen', 'Reportes exportables'],
    highlight: true,
  },
  {
    nombre: 'Estudio',
    precio: '$19.999',
    features: ['Talleres ilimitados', 'Múltiples espacios', 'Encabezado con imagen', 'Reportes', 'Auditoría'],
    highlight: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface-0 text-ink">
      {/* Nav */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <span className="font-display text-xl text-ink">Antológico</span>
        <Link
          to="/login"
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors"
        >
          Ingresar
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4">
          Tu espacio para enseñar,<br />sin complicaciones
        </h1>
        <p className="text-lg text-ink-muted mb-8 max-w-xl mx-auto">
          Publicá tus talleres, gestioná reservas y cobrá en línea —
          todo desde un panel pensado para profesionales independientes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-strong transition-colors"
          >
            Empezar gratis →
          </Link>
          <a
            href="#planes"
            className="px-6 py-3 border border-border text-sm font-medium text-ink rounded-lg hover:bg-surface-100 transition-colors"
          >
            Ver planes →
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="bg-surface-100 border border-border rounded-xl p-6">
              <span className="text-2xl mb-3 block">{icon}</span>
              <h3 className="font-semibold text-sm text-ink mb-1">{title}</h3>
              <p className="text-sm text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section id="planes" className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl text-center text-ink mb-2">Planes</h2>
        <p className="text-center text-ink-muted text-sm mb-10">Precios en ARS por mes, IVA incluido</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map(({ nombre, precio, features, highlight }) => (
            <div
              key={nombre}
              className={`rounded-xl border p-6 flex flex-col ${
                highlight
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-surface-100'
              }`}
            >
              {highlight && (
                <span className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                  Más popular
                </span>
              )}
              <h3 className="font-semibold text-ink mb-1">{nombre}</h3>
              <p className="font-mono text-2xl text-ink font-semibold mb-4">{precio}</p>
              <ul className="flex flex-col gap-1.5 flex-1">
                {features.map((f) => (
                  <li key={f} className="text-xs text-ink-muted flex items-center gap-1.5">
                    <span className="text-success font-medium">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={`mt-6 py-2 text-center rounded-md text-sm font-semibold transition-colors ${
                  highlight
                    ? 'bg-primary text-white hover:bg-primary-strong'
                    : 'border border-border text-ink hover:bg-surface-200'
                }`}
              >
                Empezar
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <p className="text-center text-xs text-ink-muted">
          © {new Date().getFullYear()} Antológico · Hecho en Argentina
        </p>
      </footer>
    </div>
  );
}
