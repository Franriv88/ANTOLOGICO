import { useEffect, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useAuth } from '../context/AuthContext';
import { auth, functions } from '../lib/firebase';
import { adminEspacio } from '../services/adminApi';
import { AntologicoLoaderCream } from '../components/AntologicoLoaderCream';

const TENANT_ORIGIN = 'https://www.antologico.app';

export default function MiEspacio() {
  const { admin } = useAuth();
  const [espacio, setEspacio]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [creating, setCreating] = useState(false);
  const [nombre, setNombre]     = useState('Espacio Admin');
  const [error, setError]       = useState('');
  const [resetting, setResetting]       = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError]     = useState('');
  const [openingTenant, setOpeningTenant] = useState(false);
  const [openTenantError, setOpenTenantError] = useState('');

  async function handleOpenPanelTenant() {
    setOpeningTenant(true);
    setOpenTenantError('');
    // Abrimos la ventana ANTES del await para no perder el user-gesture (muchos
    // navegadores bloquean window.open invocado desde una promesa resuelta).
    const win = window.open('about:blank', '_blank');
    try {
      const callable = httpsCallable(functions, 'createTenantSessionToken');
      const { data } = await callable();
      const token = data?.token;
      if (!token) throw new Error('El servidor no devolvió un token.');
      const url = `${TENANT_ORIGIN}/auth/handoff?token=${encodeURIComponent(token)}`;
      if (win && !win.closed) {
        win.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err) {
      if (win && !win.closed) win.close();
      setOpenTenantError(err?.message || 'No se pudo abrir el Panel Tenant.');
    } finally {
      setOpeningTenant(false);
    }
  }

  async function handleSendPasswordReset() {
    if (!admin?.email) return;
    setResetting(true);
    setResetMessage('');
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, admin.email);
      setResetMessage(`Te mandamos un email a ${admin.email} con el link para configurar tu contraseña. Revisá también la carpeta de spam.`);
    } catch (err) {
      setResetError(err?.message || 'No pudimos enviar el email de reset.');
    } finally {
      setResetting(false);
    }
  }

  useEffect(() => {
    if (!admin) return;
    adminEspacio.get(admin.uid)
      .then(e => setEspacio(e))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [admin]);

  async function handleCreate() {
    if (!nombre.trim()) return;
    setCreating(true); setError('');
    try {
      const e = await adminEspacio.create(admin.uid, admin.email, nombre.trim());
      setEspacio(e);
    } catch (err) {
      setError(err.message || 'Error al crear el espacio.');
    } finally {
      setCreating(false);
    }
  }

  const publicUrl = espacio?.slug
    ? `https://${espacio.slug}.antologico.app`
    : espacio ? `${TENANT_ORIGIN}/p/${espacio.id}` : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <AntologicoLoaderCream size={300} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Mi Espacio</h1>
        <p className="text-sm text-ink-muted mt-1">
          Tu espacio personal de prueba con plan Estudio, sin costo.
        </p>
      </div>

      {espacio ? (
        <div className="max-w-2xl space-y-6">
          {/* Info del espacio */}
          <div className="bg-surface-0 border border-border rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">{espacio.nombre}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#B98527]/10 text-[#B98527]">
                    Plan Estudio
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Gratis
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    Super Admin
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#B98527]/10 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-border space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-muted w-20 shrink-0">Estado</span>
                <span className="text-sm text-ink font-medium">{espacio.estado}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-ink-muted w-20 shrink-0">Creado</span>
                <span className="text-sm text-ink">
                  {new Date(espacio.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              {espacio.rubroPersonalizado && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted w-20 shrink-0">Rubro</span>
                  <span className="text-sm text-ink">{espacio.rubroPersonalizado}</span>
                </div>
              )}
            </div>
          </div>

          {/* Accesos rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publicUrl && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-surface-0 border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#B98527]/10 flex items-center justify-center shrink-0 group-hover:bg-[#B98527]/15 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Página Pública</p>
                  <p className="text-xs text-ink-muted truncate max-w-[180px]">{publicUrl}</p>
                </div>
              </a>
            )}

            <button
              type="button"
              onClick={handleOpenPanelTenant}
              disabled={openingTenant}
              className="flex items-center gap-4 bg-surface-0 border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group text-left disabled:opacity-60 disabled:cursor-wait"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                {openingTenant ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E85D4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {openingTenant ? 'Abriendo…' : 'Abrir Panel de Tenant'}
                </p>
                <p className="text-xs text-ink-muted">Entra directamente con tu sesión actual</p>
              </div>
            </button>
          </div>

          {openTenantError && (
            <div className="bg-danger/5 border border-danger/20 rounded-xl px-5 py-3 text-xs text-danger">
              <strong>No se pudo abrir el Panel Tenant:</strong> {openTenantError}
            </div>
          )}

          {/* Info auxiliar: reset de contraseña y login manual */}
          <details className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 text-xs text-ink-muted">
            <summary className="cursor-pointer text-ink font-semibold">
              ¿Preferís entrar manualmente a antologico.app?
            </summary>
            <div className="mt-3 leading-relaxed">
              <p className="mb-2">
                Firebase Auth es compartido, usá el mismo email ({' '}
                <span className="font-mono text-ink">{admin?.email}</span>{' '}
                ) y tu contraseña. Si no la recordás, pedí un email de reset:
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleSendPasswordReset}
                  disabled={resetting}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-md text-xs text-ink hover:bg-surface-0 transition-colors disabled:opacity-50"
                >
                  {resetting ? 'Enviando…' : 'Enviarme email para configurar contraseña'}
                </button>
                <a
                  href={`${TENANT_ORIGIN}/login`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-ink-muted hover:text-primary underline"
                >
                  Ir a antologico.app →
                </a>
              </div>
              {resetMessage && (
                <p className="mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
                  {resetMessage}
                </p>
              )}
              {resetError && (
                <p className="mt-3 text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
                  {resetError}
                </p>
              )}
            </div>
          </details>

          {/* Info del plan */}
          <div className="flex items-start gap-3 bg-[#B98527]/5 border border-[#B98527]/20 rounded-xl px-5 py-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p className="text-xs text-ink-muted leading-relaxed">
              Este espacio tiene todas las funciones del plan <strong className="text-ink">Estudio</strong> sin límite de tiempo ni cobro.
              Usalo para probar la experiencia completa como tenant: crear talleres, personalizar identidad, recibir reservas de prueba.
            </p>
          </div>
        </div>
      ) : (
        /* Crear espacio */
        <div className="max-w-lg">
          <div className="bg-surface-0 border border-border rounded-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-[#B98527]/10 flex items-center justify-center mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B98527" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ink mb-2">Crear tu espacio de prueba</h2>
            <p className="text-sm text-ink-muted mb-6">
              Como Super Admin, podés crear un espacio con plan Estudio gratuito para testear toda la plataforma como si fueras un tenant.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Nombre del espacio</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Espacio de Prueba"
                  className="w-full px-3 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink focus:outline-none focus:border-[#B98527] focus:ring-1 focus:ring-[#B98527]"
                />
              </div>

              {error && <p className="text-xs text-red-600">{error}</p>}

              <button
                onClick={handleCreate}
                disabled={creating || !nombre.trim()}
                className="px-5 py-2.5 bg-[#B98527] text-white rounded-md text-sm font-semibold hover:bg-[#A07422] transition-colors disabled:opacity-50"
              >
                {creating ? 'Creando…' : 'Crear espacio con plan Estudio'}
              </button>
            </div>

            <p className="text-xs text-ink-muted mt-4">
              Se asignará automáticamente el plan Estudio sin costo ni vencimiento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
