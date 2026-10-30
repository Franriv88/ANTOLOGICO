import { useEffect, useRef } from 'react';

/**
 * Barra flotante en la parte inferior de la pantalla.
 * Aparece con un slide-up cuando `dirty` es true; se cierra al guardar.
 *
 * Props:
 *   dirty    – boolean: hay cambios sin guardar
 *   saving   – boolean: guardado en curso
 *   onSave   – función de guardado principal
 *   extra    – array de { label, onClick, variant? } botones adicionales
 */
export default function FloatingSaveBar({ dirty, saving, onSave, extra = [], label = 'Guardar cambios' }) {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (dirty) {
      bar.style.transform = 'translateY(0)';
      bar.style.opacity   = '1';
    } else {
      bar.style.transform = 'translateY(100%)';
      bar.style.opacity   = '0';
    }
  }, [dirty]);

  return (
    <div
      ref={barRef}
      style={{
        position:   'fixed',
        bottom:     0,
        left:       0,
        right:      0,
        zIndex:     50,
        transform:  'translateY(100%)',
        opacity:    0,
        transition: 'transform .3s cubic-bezier(.4,0,.2,1), opacity .25s ease',
      }}
    >
      <div className="bg-surface-0/95 backdrop-blur border-t border-border shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-ink-muted hidden sm:block">Tenés cambios sin guardar</p>
          <div className="flex items-center gap-2 ml-auto">
            {extra.map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={btn.onClick}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  btn.variant === 'danger'
                    ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20'
                    : 'border border-border text-ink hover:bg-surface-200'
                }`}
              >
                {saving ? '…' : btn.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50 shadow-sm"
            >
              {saving ? 'Guardando…' : label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
