export const TIPO_CONFIG = {
  WORKSHOP: {
    label: 'Workshop',
    duracion: '1 encuentro intensivo (2 a 5 hs)',
    descPublica: 'Encuentro intensivo de un día',
    color: 'bg-primary/10 text-primary',
  },
  CLASE: {
    label: 'Clase',
    duracion: '1 encuentro suelto (1 a 2 hs)',
    descPublica: 'Clase individual o parte de un ciclo',
    color: 'bg-accent/10 text-accent',
  },
  TALLER: {
    label: 'Taller',
    duracion: 'Varios encuentros (semanal o quincenal)',
    descPublica: 'Experiencia progresiva de varios encuentros',
    color: 'bg-success/10 text-success',
  },
  CURSO: {
    label: 'Curso',
    duracion: 'Varios encuentros estructurados',
    descPublica: 'Formación con programa y contenidos definidos',
    color: 'bg-ink/10 text-ink',
  },
};

export const TIPOS = Object.keys(TIPO_CONFIG);

export function formatDuracion(horas, minutos) {
  if (!horas && !minutos) return null;
  const h = horas   ? `${horas}hs`   : '';
  const m = minutos ? `${minutos}min` : '';
  return [h, m].filter(Boolean).join(' ');
}
