import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { upsertProfesional } from '../../dataconnect-generated';

const INPUT_CLS =
  'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

export default function StepPerfil({ onNext }) {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(user?.displayName ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es requerido'); return; }

    setLoading(true);
    setError('');
    try {
      await upsertProfesional({ nombre: nombre.trim(), email: user.email });
      onNext({ nombre: nombre.trim() });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl text-ink mb-1">¿Cómo te llamás?</h2>
        <p className="text-sm text-ink-muted">
          Este nombre aparecerá en tu panel y en tus comunicaciones con usuarios.
        </p>
      </div>

      <div>
        <label className={LABEL_CLS}>Nombre completo *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); setError(''); }}
          placeholder="Ej: María González"
          autoFocus
          className={INPUT_CLS}
        />
        {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      </div>

      <div>
        <label className={LABEL_CLS}>Email (de tu cuenta Google)</label>
        <input
          type="email"
          value={user?.email ?? ''}
          disabled
          className={INPUT_CLS + ' bg-surface-100 text-ink-muted cursor-not-allowed'}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
      >
        {loading ? 'Guardando…' : 'Continuar →'}
      </button>
    </form>
  );
}
