export default function ConfirmModal({
  title,
  text,
  confirmText  = 'Confirmar',
  cancelText   = 'Cancelar',
  onConfirm,
  onClose,
  danger       = false,
  confirmDisabled = false,
  children,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-100 border border-border rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6">
          {title && (
            <h3 className="font-display text-lg text-ink mb-2">{title}</h3>
          )}
          {text && (
            <p className="text-sm text-ink-muted mb-5">{text}</p>
          )}
          {children && (
            <div className="mb-5">{children}</div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm font-medium text-ink hover:bg-surface-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 ${
                danger
                  ? 'bg-danger text-white hover:bg-danger/90'
                  : 'bg-primary text-white hover:bg-primary-strong'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
