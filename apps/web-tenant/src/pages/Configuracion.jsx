import { useState } from 'react';
import Layout from '../components/Layout';
import { useEspacio } from '../context/EspacioContext';
import { espacios as espacioApi } from '../services/api';

function lastDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function firstDayOfNextMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Configuracion() {
  const { activeEspacio, refresh } = useEspacio();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState('');

  if (!activeEspacio) return null;

  const pendiente = activeEspacio.cancelacionPendiente;

  async function handleCancelar() {
    setLoading(true);
    setError('');
    try {
      await espacioApi.solicitarCancelacion(activeEspacio.id);
      await refresh();
      setConfirmOpen(false);
    } catch (e) {
      setError(e.message || 'Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleReactivar() {
    setLoading(true);
    setError('');
    try {
      await espacioApi.reactivarSuscripcion(activeEspacio.id);
      await refresh();
    } catch (e) {
      setError(e.message || 'Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="w-full max-w-2xl">
        <h1 className="font-display text-3xl text-ink mb-1">Configuración</h1>
        <p className="text-sm text-ink-muted mb-8">{activeEspacio.nombre}</p>

        {/* Suscripción */}
        <section className="bg-surface-100 border border-border rounded-xl p-6">
          <h2 className="font-semibold text-base text-ink mb-1">Suscripción</h2>
          <p className="text-xs text-ink-muted mb-4">
            Plan actual:{' '}
            <span className="font-medium text-ink">
              {activeEspacio.plan?.nombre ?? 'Sin plan (modo prueba)'}
            </span>
          </p>

          {pendiente ? (
            /* Cancelación pendiente */
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 bg-danger/5 border border-danger/20 rounded-lg px-4 py-3">
                <span className="text-danger mt-0.5">⚠</span>
                <div>
                  <p className="text-sm font-medium text-danger">Cancelación solicitada</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Tu espacio seguirá activo hasta el <strong>{lastDayOfCurrentMonth()}</strong>.
                    A partir del <strong>{firstDayOfNextMonth()}</strong> no se realizarán más cobros
                    y el espacio pasará a modo solo lectura.
                  </p>
                </div>
              </div>
              <button
                onClick={handleReactivar}
                disabled={loading}
                className="self-start px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-surface-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Procesando…' : 'Revertir cancelación'}
              </button>
            </div>
          ) : (
            /* Sin cancelación pendiente */
            <div className="flex flex-col gap-4">
              <p className="text-sm text-ink-muted">
                Podés cancelar tu suscripción en cualquier momento. Si el mes ya comenzó, seguirás
                teniendo acceso hasta el último día del período actual sin cargo adicional.
              </p>
              <button
                onClick={() => setConfirmOpen(true)}
                className="self-start px-4 py-2 text-sm font-medium text-danger border border-danger/30 rounded-md hover:bg-danger/5 transition-colors"
              >
                Cancelar suscripción
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs text-danger">{error}</p>
          )}
        </section>

        {/* Nota sobre T&C */}
        <p className="mt-6 text-xs text-ink-muted">
          Al continuar confirmás haber leído nuestros{' '}
          <span className="text-ink-muted underline cursor-not-allowed" title="Próximamente">
            Términos y Condiciones
          </span>{' '}
          (disponibles próximamente).
        </p>
      </div>

      {/* Modal de confirmación */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 backdrop-blur-sm"
          onClick={() => !loading && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-lg text-ink mb-2">
              ¿Cancelar suscripción de <em>{activeEspacio.nombre}</em>?
            </h3>
            <p className="text-sm text-ink-muted mb-2">
              Tu espacio seguirá activo hasta el{' '}
              <strong className="text-ink">{lastDayOfCurrentMonth()}</strong>.
            </p>
            <p className="text-sm text-ink-muted mb-5">
              A partir del{' '}
              <strong className="text-ink">{firstDayOfNextMonth()}</strong>{' '}
              no se realizarán más cobros. Podés revertir esta acción antes de esa fecha.
            </p>
            {error && <p className="mb-4 text-xs text-danger">{error}</p>}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={handleCancelar}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger/90 rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'Procesando…' : 'Confirmar cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
