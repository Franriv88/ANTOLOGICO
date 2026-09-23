// Agotado = 0 cupos; Últimos cupos = ≤ máx(3, 20% del total); Disponible = resto
function getSlotStatus(cuposDisponibles, cuposTotales) {
  if (cuposDisponibles === 0) return 'AGOTADO';
  const threshold = Math.max(3, Math.floor(cuposTotales * 0.2));
  if (cuposDisponibles <= threshold) return 'ULTIMOS_CUPOS';
  return 'DISPONIBLE';
}

module.exports = { getSlotStatus };
