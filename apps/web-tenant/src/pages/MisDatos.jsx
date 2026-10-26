import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeAuth, loginGoogle, loginEmail, authErrorMsg, checkRedirectResult, getAuthCurrentUser, updateUserProfile } from '../services/userAuth';

const INPUT = 'w-full px-3 py-2 bg-white border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] focus:outline-none focus:ring-2 focus:ring-[#E85D4A] focus:ring-offset-1';
const LABEL = 'block text-xs font-medium text-[#6B5F4C] mb-1';

function AuthPanel({ onSuccess }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleGoogle() {
    setLoading('google'); setError('');
    try   { onSuccess(await loginGoogle()); }
    catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading('form'); setError('');
    try   { onSuccess(await loginEmail(email, password)); }
    catch (e) { setError(authErrorMsg(e.code)); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-[#EDE8DE] p-8">
        <h1 className="font-display text-xl text-[#1A1611] mb-1">Mis datos</h1>
        <p className="text-sm text-[#6B5F4C] mb-6">Ingresá para ver y editar tu perfil.</p>

        <button
          onClick={handleGoogle}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#D2C4A8] rounded-lg text-sm text-[#2B241A] hover:bg-[#FAF7F2] transition-colors mb-4 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading === 'google' ? 'Ingresando…' : 'Continuar con Google'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#EDE8DE]" />
          <span className="text-xs text-[#9B9083]">o</span>
          <div className="flex-1 h-px bg-[#EDE8DE]" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className={LABEL}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={INPUT} placeholder="tu@email.com" />
          </div>
          <div>
            <label className={LABEL}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={INPUT} placeholder="••••••••" />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={!!loading} className="w-full py-2.5 bg-[#E85D4A] text-white rounded-lg text-sm font-semibold hover:bg-[#C4412F] transition-colors disabled:opacity-50 mt-1">
            {loading === 'form' ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MisDatos() {
  const [currentUser, setCurrentUser] = useState(() => {
    const u = getAuthCurrentUser();
    return u ? { user: u, profile: {} } : undefined;
  });
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    checkRedirectResult().then(res => { if (res) { setCurrentUser(res); loadProfile(res); } }).catch(() => {});
    return subscribeAuth((user, profile) => {
      if (!user) { setCurrentUser(null); return; }
      const u = { user, profile };
      setCurrentUser(u);
      loadProfile(u);
    });
  }, []);

  function loadProfile({ profile }) {
    setNombre(profile?.nombre ?? '');
    setTelefono(profile?.telefono ?? '');
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await updateUserProfile(currentUser.user.uid, { nombre: nombre.trim(), telefono: telefono.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  }

  if (currentUser === undefined) {
    return <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center"><span className="text-sm text-[#6B5F4C]">Cargando…</span></div>;
  }

  if (!currentUser) {
    return <AuthPanel onSuccess={(res) => { setCurrentUser(res); loadProfile(res); }} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDE8DE] p-8">
            <h1 className="font-display text-xl text-[#1A1611] mb-1">Mis datos</h1>
            <p className="text-sm text-[#6B5F4C] mb-6">{currentUser.user.email}</p>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className={LABEL}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  className={INPUT}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className={LABEL}>Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  className={INPUT}
                  placeholder="+54 9 11 ..."
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#E85D4A] text-white rounded-lg text-sm font-semibold hover:bg-[#C4412F] transition-colors disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
                {saved && <span className="text-xs text-green-600 font-medium">¡Guardado!</span>}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 bg-white border-t border-[#EDE8DE] px-4 py-2">
        <div className="max-w-lg mx-auto flex justify-around">
          <Link to="/inicio" className="flex flex-col items-center gap-0.5 py-1 text-[#9B9083] hover:text-[#6B5F4C]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="text-[10px] font-semibold">Inicio</span>
          </Link>
          <Link to="/mis-reservas" className="flex flex-col items-center gap-0.5 py-1 text-[#9B9083] hover:text-[#6B5F4C]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span className="text-[10px] font-semibold">Reservas</span>
          </Link>
          <Link to="/mis-datos" className="flex flex-col items-center gap-0.5 py-1 text-[#E85D4A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="text-[10px] font-semibold">Perfil</span>
          </Link>
        </div>
      </nav>

      <div className="text-center py-4 text-xs text-[#9B9083] border-t border-[#EDE8DE]">
        Powered by <span className="font-semibold">Antológico</span>
      </div>
    </div>
  );
}
