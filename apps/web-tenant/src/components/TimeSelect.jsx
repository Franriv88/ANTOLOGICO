const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

const SELECT_CLS =
  'px-2 py-2 bg-surface-100 border border-border rounded-md text-sm text-ink font-mono ' +
  'focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

// value: "HH:MM" string; onChange: (newValue: "HH:MM") => void
export default function TimeSelect({ value, onChange, error }) {
  const [h, m] = value ? value.split(':').map(Number) : [9, 0];
  const errorCls = error ? ' border-danger ring-1 ring-danger/30' : '';

  function emit(newH, newM) {
    onChange(`${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`);
  }

  return (
    <div className="flex items-center gap-2">
      <select className={SELECT_CLS + errorCls} value={h} onChange={(e) => emit(Number(e.target.value), m)}>
        {HOURS.map((hour) => (
          <option key={hour} value={hour}>
            {String(hour).padStart(2, '0')}hs
          </option>
        ))}
      </select>
      <select className={SELECT_CLS + errorCls} value={m} onChange={(e) => emit(h, Number(e.target.value))}>
        {MINUTES.map((min) => (
          <option key={min} value={min}>
            {String(min).padStart(2, '0')}min
          </option>
        ))}
      </select>
    </div>
  );
}
