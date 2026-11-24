import { useEffect, useState } from 'react';

export default function FloatingSave({
  saving,
  saved,
  disabled,
  label = 'Guardar cambios',
  savingLabel = 'Guardando…',
  savedLabel = '¡Guardado!',
  onClick,
  type = 'button',
  form,
}) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {showSaved && (
        <span className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-lg shadow-sm animate-fade-in">
          {savedLabel}
        </span>
      )}
      <button
        type={type}
        form={form}
        onClick={onClick}
        disabled={saving || disabled}
        className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-primary-strong hover:shadow-xl transition-all disabled:opacity-50"
      >
        {saving ? savingLabel : label}
      </button>
    </div>
  );
}
