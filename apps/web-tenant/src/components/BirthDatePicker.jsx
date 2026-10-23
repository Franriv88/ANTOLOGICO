import { useMemo } from 'react';

const SEL_CLS =
  'px-2 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function daysInMonth(month, year) {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

export default function BirthDatePicker({ value, onChange }) {
  const today = new Date();
  const minYear = today.getFullYear() - 100;
  const maxYear = today.getFullYear() - 13;

  const parts = useMemo(() => {
    if (!value) return { day: '', month: '', year: '' };
    const [y, m, d] = value.split('-');
    return { day: parseInt(d, 10) || '', month: parseInt(m, 10) || '', year: parseInt(y, 10) || '' };
  }, [value]);

  function emit(day, month, year) {
    if (day && month && year) {
      const d = String(day).padStart(2, '0');
      const m = String(month).padStart(2, '0');
      onChange(`${year}-${m}-${d}`);
    } else {
      onChange('');
    }
  }

  const maxDays = daysInMonth(parts.month, parts.year);

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Día */}
      <select
        value={parts.day}
        onChange={(e) => {
          const d = e.target.value ? parseInt(e.target.value, 10) : '';
          emit(d, parts.month, parts.year);
        }}
        className={SEL_CLS}
      >
        <option value="">Día</option>
        {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Mes */}
      <select
        value={parts.month}
        onChange={(e) => {
          const m = e.target.value ? parseInt(e.target.value, 10) : '';
          const newMax = daysInMonth(m, parts.year);
          const d = parts.day > newMax ? newMax : parts.day;
          emit(d, m, parts.year);
        }}
        className={SEL_CLS}
      >
        <option value="">Mes</option>
        {MONTHS.map((name, i) => (
          <option key={i + 1} value={i + 1}>{name}</option>
        ))}
      </select>

      {/* Año */}
      <select
        value={parts.year}
        onChange={(e) => {
          const y = e.target.value ? parseInt(e.target.value, 10) : '';
          const newMax = daysInMonth(parts.month, y);
          const d = parts.day > newMax ? newMax : parts.day;
          emit(d, parts.month, y);
        }}
        className={SEL_CLS}
      >
        <option value="">Año</option>
        {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
