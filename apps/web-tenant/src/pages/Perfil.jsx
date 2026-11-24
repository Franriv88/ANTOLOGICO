import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, updateUserProfile, changePassword, changeEmail, authErrorMsg } from '../services/userAuth';
import Layout from '../components/Layout';
import FloatingSave from '../components/FloatingSave';
import BirthDatePicker from '../components/BirthDatePicker';

const INPUT_CLS =
  'w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

const GENEROS = [
  { value: '',                    label: 'Seleccioná…' },
  { value: 'masculino',           label: 'Masculino' },
  { value: 'femenino',            label: 'Femenino' },
  { value: 'no-binario',          label: 'No binario' },
  { value: 'prefiero-no-decirlo', label: 'Prefiero no decirlo' },
];

function validatePassword(pw) {
  return {
    length:  pw.length >= 8,
    letter:  /[a-zA-Z]/.test(pw),
    number:  /\d/.test(pw),
    symbol:  /[^a-zA-Z0-9]/.test(pw),
  };
}

function PasswordRules({ checks }) {
  const rules = [
    ['length', '8+ caracteres'],
    ['letter', 'Una letra'],
    ['number', 'Un número'],
    ['symbol', 'Un símbolo (. # * $ …)'],
  ];
  return (
    <div className="flex flex-col gap-1 mt-1.5">
      {rules.map(([key, label]) => (
        <span key={key} className={`text-xs flex items-center gap-1.5 ${checks[key] ? 'text-emerald-600' : 'text-ink-muted'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {checks[key]
              ? <polyline points="20 6 9 17 4 12" />
              : <line x1="5" y1="12" x2="19" y2="12" />}
          </svg>
          {label}
        </span>
      ))}
    </div>
  );
}

function SuccessBanner({ text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </div>
  );
}

export default function Perfil() {
  const { user } = useAuth();

  const [profile,  setProfile]  = useState(null);
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero,   setGenero]   = useState('');
  const [fechaNac, setFechaNac] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved,  setProfileSaved]  = useState(false);
  const [profileError,  setProfileError]  = useState('');

  const [curPass,    setCurPass]    = useState('');
  const [newPass,    setNewPass]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [savingPass, setSavingPass] = useState(false);
  const [passSaved,  setPassSaved]  = useState(false);
  const [passError,  setPassError]  = useState('');

  const [newEmail,      setNewEmail]      = useState('');
  const [emailPass,     setEmailPass]     = useState('');
  const [savingEmail,   setSavingEmail]   = useState(false);
  const [emailSent,     setEmailSent]     = useState(false);
  const [emailError,    setEmailError]    = useState('');

  useEffect(() => {
    if (!user?.uid) return;
    fetchProfile(user.uid).then(p => {
      setProfile(p);
      setNombre(p.nombre ?? user.displayName ?? '');
      setTelefono((p.telefono ?? '').replace(/^\+54 9\s*/, '').replace(/\D/g, ''));
      setGenero(p.genero ?? '');
      setFechaNac(p.fechaNac ?? '');
    });
  }, [user]);

  // Detectamos Google por los providers vinculados en Firebase Auth, no solo
  // por el campo guardado en el perfil (que puede quedar desactualizado si el
  // usuario vinculó una cuenta Google después de registrarse con email).
  const hasGoogleProvider = !!user?.providerData?.some(p => p?.providerId === 'google.com');
  const isGoogle = hasGoogleProvider || profile?.authMethod === 'google';
  // Preferimos la foto de Firebase Auth (siempre viene de Google si está
  // vinculado); como fallback usamos la que puede haber en el perfil.
  const avatarUrl = user?.photoURL || profile?.photoURL || null;

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    setProfileSaved(false);
    try {
      await updateUserProfile(user.uid, {
        nombre:   nombre.trim(),
        telefono: telefono.trim() ? `+54 9 ${telefono.trim()}` : '',
        genero:   genero || 'prefiero-no-decirlo',
        fechaNac: fechaNac || null,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Error al guardar.');
    } finally {
      setSavingProfile(false);
    }
  }

  const pwChecks  = validatePassword(newPass);
  const pwValid   = Object.values(pwChecks).every(Boolean);
  const pwMatch   = newPass === confirmPass;

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!pwValid || !pwMatch) return;
    setSavingPass(true);
    setPassError('');
    setPassSaved(false);
    try {
      await changePassword(curPass, newPass);
      setPassSaved(true);
      setCurPass('');
      setNewPass('');
      setConfirmPass('');
      setTimeout(() => setPassSaved(false), 3000);
    } catch (err) {
      setPassError(
        err.code === 'auth/wrong-password' ? 'La contraseña actual es incorrecta' :
        err.code === 'auth/too-many-requests' ? 'Demasiados intentos. Esperá unos minutos.' :
        authErrorMsg(err.code) || err.message
      );
    } finally {
      setSavingPass(false);
    }
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    if (!newEmail.trim() || !emailPass) return;
    setSavingEmail(true);
    setEmailError('');
    setEmailSent(false);
    try {
      await changeEmail(emailPass, newEmail.trim());
      setEmailSent(true);
      setEmailPass('');
      setNewEmail('');
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      setEmailError(
        err.code === 'auth/wrong-password' ? 'La contraseña es incorrecta' :
        err.code === 'auth/email-already-in-use' ? 'Ya existe una cuenta con ese email' :
        authErrorMsg(err.code) || err.message
      );
    } finally {
      setSavingEmail(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-lg">
        <h1 className="font-display text-2xl text-ink mb-1">Mi perfil</h1>
        <p className="text-sm text-ink-muted mb-6">
          Editá tu información personal. Los cambios se guardan en tu cuenta.
        </p>

        {/* ── Avatar + auth method ── */}
        <div className="flex items-center gap-4 mb-8">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {(nombre?.[0] || '?').toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-ink">{user?.email}</p>
            <span className={`inline-block mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
              isGoogle
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }`}>
              {isGoogle ? 'Google Sign-In' : 'Email y contraseña'}
            </span>
          </div>
        </div>

        {/* ── Datos personales ── */}
        <section className="bg-surface-100 border border-border rounded-xl p-6 mb-6">
          <h2 className="font-display text-lg text-ink mb-4">Datos personales</h2>

          <form id="form-perfil" onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div>
              <label className={LABEL_CLS}>Nombre completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required className={INPUT_CLS} placeholder="Tu nombre" />
            </div>

            <div>
              <label className={LABEL_CLS}>Teléfono <span className="font-normal">(opcional)</span></label>
              <div className="flex items-stretch border border-border rounded-md overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary bg-surface-100">
                <span className="flex items-center px-3 text-sm text-ink-muted bg-surface-200 border-r border-border select-none whitespace-nowrap">
                  +54 9
                </span>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))}
                  placeholder="11 1234 5678"
                  maxLength={12}
                  className="flex-1 px-3 py-2 bg-transparent text-sm text-ink focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Fecha de nacimiento <span className="font-normal">(opcional)</span></label>
              <BirthDatePicker value={fechaNac} onChange={setFechaNac} />
            </div>

            <div>
              <label className={LABEL_CLS}>Género <span className="font-normal">(opcional)</span></label>
              <select value={genero} onChange={e => setGenero(e.target.value)} className={INPUT_CLS}>
                {GENEROS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            {profileError && <p className="text-xs text-danger">{profileError}</p>}
            {profileSaved && <SuccessBanner text="¡Datos guardados!" />}
          </form>
          <FloatingSave saving={savingProfile} saved={profileSaved} type="submit" form="form-perfil" label="Guardar cambios" />
        </section>

        {/* ── Cambiar contraseña (solo email auth) ── */}
        {!isGoogle && (
          <section className="bg-surface-100 border border-border rounded-xl p-6 mb-6">
            <h2 className="font-display text-lg text-ink mb-4">Cambiar contraseña</h2>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <label className={LABEL_CLS}>Contraseña actual</label>
                <input type="password" value={curPass} onChange={e => setCurPass(e.target.value)} required className={INPUT_CLS} placeholder="••••••••" />
              </div>
              <div>
                <label className={LABEL_CLS}>Nueva contraseña</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required className={INPUT_CLS} placeholder="Mínimo 8 caracteres" />
                {newPass && <PasswordRules checks={pwChecks} />}
              </div>
              <div>
                <label className={LABEL_CLS}>Confirmar nueva contraseña</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required className={INPUT_CLS} placeholder="Repetí la nueva contraseña" />
                {confirmPass && !pwMatch && (
                  <p className="mt-1 text-xs text-danger">Las contraseñas no coinciden</p>
                )}
              </div>

              {passError && <p className="text-xs text-danger">{passError}</p>}
              {passSaved && <SuccessBanner text="¡Contraseña actualizada!" />}

              <button type="submit" disabled={savingPass || !pwValid || !pwMatch || !curPass}
                className="w-fit px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
                {savingPass ? 'Cambiando…' : 'Cambiar contraseña'}
              </button>
            </form>
          </section>
        )}

        {/* ── Cambiar email (solo email auth) ── */}
        {!isGoogle && (
          <section className="bg-surface-100 border border-border rounded-xl p-6">
            <h2 className="font-display text-lg text-ink mb-1">Cambiar email</h2>
            <p className="text-sm text-ink-muted mb-4">
              Se enviará un enlace de verificación al nuevo email. El cambio se aplica cuando lo confirmés.
            </p>

            <form onSubmit={handleChangeEmail} className="flex flex-col gap-4">
              <div>
                <label className={LABEL_CLS}>Nuevo email</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className={INPUT_CLS} placeholder="nuevo@email.com" />
              </div>
              <div>
                <label className={LABEL_CLS}>Contraseña actual</label>
                <input type="password" value={emailPass} onChange={e => setEmailPass(e.target.value)} required className={INPUT_CLS} placeholder="Para confirmar tu identidad" />
              </div>

              {emailError && <p className="text-xs text-danger">{emailError}</p>}
              {emailSent && <SuccessBanner text="Enlace de verificación enviado al nuevo email. Revisá tu bandeja." />}

              <button type="submit" disabled={savingEmail || !newEmail.trim() || !emailPass}
                className="w-fit px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50">
                {savingEmail ? 'Enviando…' : 'Cambiar email'}
              </button>
            </form>
          </section>
        )}
      </div>
    </Layout>
  );
}
