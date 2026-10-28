import { useState, useEffect } from 'react';
import { espacios as espacioApi } from '../../services/api';
import { upsertProfesional, reassignProfesionalUid } from '../../dataconnect-generated';
import { auth } from '../../lib/firebase';
import { RUBROS, fetchRubros } from '../../lib/rubros';

const INPUT_CLS =
  'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

export default function StepEspacio({ onNext, onBack, accumulated }) {
  const [nombre, setNombre]             = useState('');
  const [selectedRubro, setRubro]       = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [rubros, setRubros]             = useState(RUBROS);

  useEffect(() => { fetchRubros().then(setRubros); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim())    { setError('El nombre del espacio es requerido'); return; }
    if (!selectedRubro)    { setError('Seleccioná un rubro'); return; }

    setLoading(true);
    setError('');
    try {
      // Garantizar que la fila del profesional existe antes del FK insert.
      const u = auth.currentUser;
      if (u) {
        try {
          await upsertProfesional({ nombre: u.displayName || u.email, email: u.email });
        } catch (upsertErr) {
          const s = (() => { try { return JSON.stringify(upsertErr); } catch { return String(upsertErr); } })();
          const isAlreadyExists = s.includes('ALREADY_EXISTS') || s.includes('profesionales_email_uidx');
          if (isAlreadyExists) {
            try {
              await reassignProfesionalUid({ nombre: u.displayName || u.email });
            } catch (reassignErr) {
              setError('Error al actualizar perfil. Contactá soporte.');
              setLoading(false);
              return;
            }
          } else {
            setError('Error al registrar perfil: ' + (upsertErr?.message || s));
            setLoading(false);
            return;
          }
        }
      } else {
        setError('No hay sesión activa. Recargá la página e intentá de nuevo.');
        setLoading(false);
        return;
      }

      const key = await espacioApi.create({
        nombre:             nombre.trim(),
        rubroId:            null,
        rubroPersonalizado: selectedRubro,
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
          {rubros.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

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
