import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const DEMO_EMAIL    = 'superadmin@antologico.app';
const DEMO_PASSWORD = 'Admin2024!';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate  = useNavigate();
  const { denied } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError('Completá todos los campos'); return; }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/tenants', { replace: true });
    } catch (err) {
      const msg =
        err.code === 'auth/wrong-password'  ||
        err.code === 'auth/user-not-found'  ||
        err.code === 'auth/invalid-credential'
          ? 'Credenciales incorrectas'
          : err.code === 'auth/invalid-email'
          ? 'Email inválido'
          : 'Error al ingresar. Intentá de nuevo.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#1A1611' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-display text-2xl" style={{ color: '#EFE7D8' }}>Antológico</span>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: '#B98527', color: '#1A1611' }}>
            Super Admin
          </div>
        </div>

        <div className="bg-surface-100 border border-border rounded-xl p-8">
          {/* Credenciales demo */}
          <div className="bg-surface-200 border border-border rounded-lg px-3 py-2.5 mb-6 text-xs text-ink-muted space-y-0.5">
            <p className="font-medium text-ink">Credenciales de acceso:</p>
            <p>Email: <span className="font-mono text-ink">{DEMO_EMAIL}</span></p>
            <p>Contraseña: <span className="font-mono text-ink">{DEMO_PASSWORD}</span></p>
          </div>

          {denied && (
            <div className="mb-4 text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
              Tu cuenta no tiene permisos de administrador.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder={DEMO_EMAIL}
                autoFocus
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#B98527', color: '#1A1611' }}
            >
              {loading ? 'Ingresando…' : 'Ingresar al panel →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
