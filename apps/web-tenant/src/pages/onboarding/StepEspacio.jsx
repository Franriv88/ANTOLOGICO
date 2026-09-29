import { useState } from 'react';
import { espacios as espacioApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const INPUT_CLS =
  'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

const RUBROS = [
  'Arte y pintura',
  'Baile y danza',
  'Cocina y gastronomía',
  'Diseño y creatividad',
  'Fitness y deporte',
  'Fotografía',
  'Idiomas',
  'Manualidades y DIY',
  'Marketing y negocios',
  'Meditación y mindfulness',
  'Música',
  'Teatro y actuación',
  'Tecnología y programación',
  'Yoga y bienestar',
];

export default function StepEspacio({ onNext, onBack }) {
  const { user } = useAuth();
  const [nombre, setNombre]             = useState('');
  const [selectedRubro, setRubro]       = useState('');
  const [rubroPersonalizado, setCustom] = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const isOtro = selectedRubro === 'OTRO';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim())    { setError('El nombre del espacio es requerido'); return; }
    if (!selectedRubro)    { setError('Seleccioná un rubro'); return; }
    if (isOtro && !rubroPersonalizado.trim()) { setError('Especificá tu rubro'); return; }

    setLoading(true);
    setError('');
    try {
      const rubroFinal = isOtro ? rubroPersonalizado.trim() : selectedRubro;
      const key = await espacioApi.create({
        nombre:            nombre.trim(),
        rubroId:           null,
        rubroPersonalizado: rubroFinal,
        userId:            user?.uid ?? null,
      });
      onNext({ espacioId: key.id, espacioNombre: nombre.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl text-ink mb-1">Tu espacio</h2>
        <p className="text-sm text-ink-muted">
          Un "espacio" es tu negocio o proyecto. Podés crear más de uno después.
        </p>
      </div>

      {/* Nombre del espacio */}
      <div>
        <label className={LABEL_CLS}>Nombre del espacio *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); setError(''); }}
          placeholder="Ej: Estudio de Yoga Zen, Clases de Fotografía…"
          autoFocus
          className={INPUT_CLS}
        />
      </div>

      {/* Rubro */}
      <div>
        <label className={LABEL_CLS}>Rubro *</label>
        <select
          value={selectedRubro}
          onChange={(e) => { setRubro(e.target.value); setError(''); }}
          className={INPUT_CLS}
        >
          <option value="">Seleccioná un rubro…</option>
          {RUBROS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
          <option value="OTRO">Otro…</option>
        </select>
      </div>

      {/* Campo "Otro" condicional */}
      {isOtro && (
        <div>
          <label className={LABEL_CLS}>¿Cuál es tu rubro? *</label>
          <input
            type="text"
            value={rubroPersonalizado}
            onChange={(e) => { setCustom(e.target.value); setError(''); }}
            placeholder="Ej: Cerámica artística, Astrología, Meditación…"
            autoFocus
            className={INPUT_CLS}
          />
          <p className="mt-1 text-xs text-ink-muted">
            Lo revisaremos para agregarlo al catálogo oficial.
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 border border-border text-sm font-medium text-ink rounded-md hover:bg-surface-200 transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Continuar →'}
        </button>
      </div>
    </form>
  );
}
