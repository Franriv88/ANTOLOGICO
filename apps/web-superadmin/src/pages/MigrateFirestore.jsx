import { useEffect, useState } from 'react';
import { migration, tenants as tenantsApi } from '../services/adminApi';
import ConfirmModal from '../components/ConfirmModal';

export default function MigrateFirestore() {
  const [fsEspacios,  setFsEspacios]  = useState(null);
  const [dcEspacios,  setDcEspacios]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [log,         setLog]         = useState([]);
  const [migrating,   setMigrating]   = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(false);

  function addLog(msg, type = 'info') {
    setLog(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [fs, dc] = await Promise.all([
        migration.readFirestoreEspacios(),
        tenantsApi.list(),
      ]);
      setFsEspacios(fs);
      setDcEspacios(dc);
    } catch (err) {
      addLog(`Error cargando datos: ${err.message}`, 'error');
    }
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function handleMigrate(fsEsp) {
    setMigrating(true);
    addLog(`Migrando espacio "${fsEsp.nombre}" (Firestore ID: ${fsEsp.firestoreId})…`);

    try {
      await migration.migrateEspacio(fsEsp);
      addLog(`✓ Espacio "${fsEsp.nombre}" migrado`, 'success');
    } catch (err) {
      addLog(`✗ Error migrando espacio "${fsEsp.nombre}": ${err.message}`, 'error');
      setMigrating(false);
      return;
    }

    // Migrate workshops (separate try/catch — workshop errors don't affect espacio)
    try {
      const workshops = await migration.readFirestoreWorkshops(fsEsp.firestoreId);
      addLog(`  Encontrados ${workshops.length} workshops en Firestore`);

      if (workshops.length > 0) {
        const dcList = await tenantsApi.list();
        const dcEsp = dcList.find(e => e.userId === fsEsp.userId && e.nombre === fsEsp.nombre);
        if (dcEsp) {
          for (const ws of workshops) {
            try {
              await migration.migrateWorkshop(dcEsp.id, ws);
              addLog(`  ✓ Workshop "${ws.nombre}" migrado`, 'success');
            } catch (wsErr) {
              addLog(`  ✗ Workshop "${ws.nombre}": ${wsErr.message}`, 'error');
            }
          }
        } else {
          addLog('  ⚠ No se encontró el espacio en Data Connect para migrar workshops', 'warn');
        }
      }
    } catch (err) {
      addLog(`  ⚠ No se pudieron leer workshops de Firestore (permisos): ${err.message}`, 'warn');
    }

    await loadData();
    setMigrating(false);
  }

  async function handleDeleteEspacio8() {
    setDeleting(true);
    try {
      const id = await migration.deleteEspacio8();
      addLog(`✓ Espacio "8" eliminado (ID: ${id})`, 'success');
      await loadData();
    } catch (err) {
      addLog(`✗ Error eliminando espacio "8": ${err.message}`, 'error');
    }
    setDeleting(false);
    setConfirmDel(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-ink-muted">Cargando datos…</div>;
  }

  const fs = fsEspacios ?? [];
  const dc = dcEspacios ?? [];
  const espacio8 = dc.find(e => e.nombre === '8');

  // Detect duplicates: same userId + nombre
  const seen = {};
  const duplicateIds = [];
  dc.forEach(e => {
    const key = `${e.userId}::${e.nombre}`;
    if (seen[key]) {
      duplicateIds.push(e.id); // keep the first, mark rest as duplicates
    } else {
      seen[key] = e.id;
    }
  });

  async function handleCleanDuplicates() {
    setMigrating(true);
    for (const id of duplicateIds) {
      const esp = dc.find(e => e.id === id);
      addLog(`Eliminando duplicado "${esp?.nombre}" (ID: ${id.slice(0, 8)}…)…`);
      try {
        await tenantsApi.remove([id]);
        addLog(`✓ Duplicado eliminado`, 'success');
      } catch (err) {
        addLog(`✗ Error: ${err.message}`, 'error');
      }
    }
    await loadData();
    setMigrating(false);
  }

  return (
    <>
      {confirmDel && (
        <ConfirmModal
          title='¿Eliminar espacio "8"?'
          text='Se eliminará permanentemente el espacio "8" y todos sus datos asociados de Data Connect.'
          confirmText={deleting ? 'Eliminando…' : 'Sí, eliminar'}
          danger
          confirmDisabled={deleting}
          onConfirm={handleDeleteEspacio8}
          onClose={() => !deleting && setConfirmDel(false)}
        />
      )}

      <div className="w-full max-w-3xl">
        <h1 className="font-display text-2xl text-ink mb-1">Migración Firestore → Data Connect</h1>
        <p className="text-sm text-ink-muted mb-6">
          Herramienta de una sola vez para migrar espacios existentes de Firestore a la base relacional (PostgreSQL).
        </p>

        {/* Current state */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-100 border border-border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
              Firestore ({fs.length} espacios)
            </h2>
            {fs.length === 0 ? (
              <p className="text-sm text-ink-muted">No hay espacios en Firestore</p>
            ) : (
              <div className="flex flex-col gap-2">
                {fs.map(e => {
                  const alreadyInDC = dc.some(d => d.userId === e.userId && d.nombre === e.nombre);
                  return (
                    <div key={e.firestoreId} className="flex items-center justify-between bg-surface-0 border border-border/60 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-ink">{e.nombre || '—'}</p>
                        <p className="text-xs text-ink-muted font-mono">{e.userId?.slice(0, 12)}…</p>
                      </div>
                      {alreadyInDC ? (
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">
                          Ya migrado
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMigrate(e)}
                          disabled={migrating}
                          className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-strong transition-colors disabled:opacity-40"
                        >
                          {migrating ? 'Migrando…' : 'Migrar'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-surface-100 border border-border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">
              Data Connect ({dc.length} espacios)
            </h2>
            {dc.length === 0 ? (
              <p className="text-sm text-ink-muted">No hay espacios en Data Connect</p>
            ) : (
              <div className="flex flex-col gap-2">
                {dc.map(e => (
                  <div key={e.id} className="flex items-center justify-between bg-surface-0 border border-border/60 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{e.nombre || '—'}</p>
                      <p className="text-xs text-ink-muted font-mono">{e.userId?.slice(0, 12)}…</p>
                    </div>
                    <span className="text-[10px] text-ink-muted">{e.id?.slice(0, 8)}…</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Delete espacio 8 */}
        {espacio8 && (
          <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-danger">Espacio "8" detectado</p>
                <p className="text-xs text-ink-muted">Creado accidentalmente. ID: {espacio8.id?.slice(0, 12)}…</p>
              </div>
              <button
                onClick={() => setConfirmDel(true)}
                className="text-xs px-3 py-1.5 bg-danger text-white rounded-lg font-medium hover:bg-danger/90 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

        {/* Duplicates cleanup */}
        {duplicateIds.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {duplicateIds.length} espacio(s) duplicado(s) detectado(s)
                </p>
                <p className="text-xs text-amber-600">
                  Creados por intentos de migración repetidos. Se conservará uno de cada.
                </p>
              </div>
              <button
                onClick={handleCleanDuplicates}
                disabled={migrating}
                className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-40"
              >
                {migrating ? 'Limpiando…' : 'Limpiar duplicados'}
              </button>
            </div>
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div className="bg-surface-100 border border-border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Log de migración</h2>
            <div className="max-h-64 overflow-y-auto flex flex-col gap-1 font-mono text-xs">
              {log.map((entry, i) => (
                <div key={i} className={`${
                  entry.type === 'error' ? 'text-danger' :
                  entry.type === 'success' ? 'text-emerald-700' :
                  entry.type === 'warn' ? 'text-amber-600' :
                  'text-ink-muted'
                }`}>
                  <span className="text-ink-muted/40 mr-2">{entry.ts}</span>
                  {entry.msg}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={loadData}
          disabled={loading}
          className="mt-4 text-xs text-ink-muted hover:text-ink underline"
        >
          Recargar datos
        </button>
      </div>
    </>
  );
}
