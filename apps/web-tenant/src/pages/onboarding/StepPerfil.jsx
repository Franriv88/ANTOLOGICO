import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profesionales as profesionalesApi } from '../../services/api';
import { updateUserProfile } from '../../services/userAuth';

const INPUT_CLS =
  'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

export default function StepPerfil({ onNext }) {
  const { user } = useAuth();
  const [nombre,   setNombre]   = useState(user?.displayName ?? '');
  const [email,    setEmail]    = useState(user?.email ?? '');
  const [telefono, setTelefono] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) { setError('El nombre es requerido'); return; }

    setLoading(true);
    setError('');
    try {
      await profesionalesApi.upsert({ nombre: nombre.trim(), email: email.trim() });
    } catch {
      // Firebase no disponible (demo mode u otro entorno sin backend)
    }
    if (user?.uid) {
      try {
        await updateUserProfile(user.uid, {
          nombre:   nombre.trim(),
          email:    email.trim(),
          telefono: telefono.trim(),
        });
      } catch {
        // non-blocking — perfil en super admin es informativo
      }
    }
    onNext({ nombre: nombre.trim(), telefono: telefono.trim() });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-xl text-ink mb-1">Tu perfil</h2>
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
        <label className={LABEL_CLS}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder="tu@email.com"
          className={INPUT_CLS}
        />
      </div>

      <div>
        <label className={LABEL_CLS}>Teléfono de contacto <span className="font-normal">(opcional)</span></label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: +54 9 11 1234-5678"
          className={INPUT_CLS}
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
