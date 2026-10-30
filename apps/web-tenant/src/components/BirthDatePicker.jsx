import { useState, useEffect } from 'react';

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

function parseValue(value) {
  if (!value) return { day: '', month: '', year: '' };
  const [y, m, d] = value.split('-');
  return { day: parseInt(d, 10) || '', month: parseInt(m, 10) || '', year: parseInt(y, 10) || '' };
}

export default function BirthDatePicker({ value, onChange }) {
  const today  = new Date();
  const minYear = today.getFullYear() - 100;
  const maxYear = today.getFullYear() - 13;

  // Estado interno para selecciones parciales
  const [parts, setParts] = useState(() => parseValue(value));

  // Sincronizar cuando el prop value cambia desde afuera (ej: reset del formulario)
  useEffect(() => {
    setParts(parseValue(value));
  }, [value]);

  function update(newParts) {
    setParts(newParts);
    const { day, month, year } = newParts;
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
          const day = e.target.value ? parseInt(e.target.value, 10) : '';
          update({ ...parts, day });
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
          const month  = e.target.value ? parseInt(e.target.value, 10) : '';
          const newMax = daysInMonth(month, parts.year);
          const day    = parts.day > newMax ? newMax : parts.day;
          update({ ...parts, month, day });
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
          const year   = e.target.value ? parseInt(e.target.value, 10) : '';
          const newMax = daysInMonth(parts.month, year);
          const day    = parts.day > newMax ? newMax : parts.day;
          update({ ...parts, year, day });
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
