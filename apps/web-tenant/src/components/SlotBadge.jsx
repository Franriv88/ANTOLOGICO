const CONFIG = {
  DISPONIBLE:    { label: 'Disponible',    cls: 'bg-success/10 text-success' },
  ULTIMOS_CUPOS: { label: 'Últimos cupos', cls: 'bg-accent/10 text-accent' },
  AGOTADO:       { label: 'Agotado',       cls: 'bg-danger/10 text-danger' },
};

export default function SlotBadge({ status }) {
  const { label, cls } = CONFIG[status] ?? CONFIG.DISPONIBLE;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
