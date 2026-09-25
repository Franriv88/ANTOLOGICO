import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import TimeSelect from '../components/TimeSelect';
import { workshops as api } from '../services/api';
import { useEspacio } from '../context/EspacioContext';
import { TIPO_CONFIG, TIPOS } from '../lib/tipoWorkshop';
import { DEMO_MODE } from '../lib/demo';

// ── Constants ─────────────────────────────────────────────────────────────────
const HEADER_PALETTE = [
  '#E85D4A', '#8C2E1F', '#B98527', '#E8A23A',
  '#D4563E', '#C2445A', '#E84488', '#9D174D',
  '#3B82F6', '#6366F1', '#8B5CF6', '#14B8A6',
  '#10B981', '#059669', '#4B5563', '#1A1611',
];

const DIAS_ABR  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DIAS_FULL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MESES     = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                   'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Converts JS getDay() (0=Sun) → Monday-first index (0=Mon)
const jsDayToIdx = (d) => (d + 6) % 7;

const IS_MULTI = (t) => t === 'TALLER' || t === 'CURSO';

const TIPO_DESC = {
  WORKSHOP: 'Encuentro intensivo de un día. Los participantes aprenden una habilidad práctica de forma inmersiva.',
  TALLER:   'Varios encuentros progresivos. Práctica profunda y seguimiento a lo largo del tiempo.',
  CLASE:    'Encuentro individual o parte de un ciclo. Sin necesidad de seguimiento grupal.',
  CURSO:    'Formación estructurada en varios encuentros con programa, objetivos y evaluación.',
};

const INPUT_CLS = 'w-full px-3 py-2 bg-white border border-border rounded-md text-sm text-[#2B241A] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-ink-muted mb-1';

// ── Helpers ───────────────────────────────────────────────────────────────────
function isValidColor(str) {
  if (!str) return false;
  const s = new Option().style;
  s.color = str;
  return s.color !== '';
}

function localDateStr(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function localTimeStr(d) {
  const date = new Date(d);
  const h = String(date.getHours()).padStart(2,'0');
  const min = String(date.getMinutes()).padStart(2,'0');
  const snapped = [0,15,30,45].reduce((p,c) => Math.abs(c-Number(min)) < Math.abs(p-Number(min)) ? c : p);
  return `${h}:${String(snapped).padStart(2,'0')}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const day   = String(d.getDate()).padStart(2,'0');
  const month = d.toLocaleString('es-AR', { month: 'short' }).toUpperCase().replace('.','');
  return `${day} ${month} ${d.getFullYear()}`;
}

// Weekday index derived from a 'YYYY-MM-DD' string (0=Lun … 6=Dom)
function weekdayIdxOf(dateStr) {
  if (!dateStr) return null;
  return jsDayToIdx(new Date(dateStr + 'T12:00:00').getDay());
}

// All dates matching a weekday between startDate and endDate (inclusive)
// step: 7 = semanal, 14 = quincenal
function computeWeeklyDates(startStr, endStr, myIdx, step = 7) {
  if (!startStr || !endStr || myIdx === null) return [];
  const jsDay = (myIdx + 1) % 7;
  const dates = [];
  let cur = new Date(startStr + 'T12:00:00');
  const end = new Date(endStr + 'T12:00:00');
  // Advance to first matching weekday
  while (cur.getDay() !== jsDay) {
    cur = new Date(cur.getTime() + 86400000);
    if (cur > end) return dates;
  }
  while (cur <= end) {
    dates.push(localDateStr(cur));
    cur = new Date(cur.getTime() + step * 86400000);
  }
  return dates;
}

function buildScheduleData(form) {
  if (!form.scheduleMode) return null;
  const myIdx = weekdayIdxOf(form.fecha);
  if (form.scheduleMode === 'SPECIFIC_DATES') return { mode: 'SPECIFIC_DATES', dates: form.specificDates };
  if (form.scheduleMode === 'WEEKLY') return {
    mode: 'WEEKLY',
    day: myIdx,
    frequency: form.weeklyFrequency || 'SEMANAL',
    endDate: form.weeklyEndDate || null,
  };
  return null;
}

// ── EMPTY state ───────────────────────────────────────────────────────────────
const EMPTY = {
  nombre: '',
  tipo: null,
  descripcion: '',
  cuposTotales: '',
  precio: '',
  fecha: '',
  hora: '09:00',
  duracionHoras: '',
  duracionMinutos: '0',
  _estadoAction: 'OCULTAR',   // 'ACTIVO' | 'OCULTAR' | 'AGOTAR'
  experienciaPrevia: null,
  scheduleMode: null,          // 'SPECIFIC_DATES' | 'WEEKLY'
  specificDates: [],
  weeklyEndDate: '',
  weeklyNumSessions: '',       // synced with weeklyEndDate (bidireccional)
  weeklyFrequency: 'SEMANAL',  // 'SEMANAL' | 'QUINCENAL'
  headerType: 'COLOR',         // 'COLOR' | 'IMAGE'
  headerValue: '#E85D4A',      // hex para COLOR, URL para IMAGE
};

function deriveEstadoAction(w) {
  if (w.estado === 'PUBLICADO' && w.cuposDisponibles === 0) return 'AGOTAR';
  if (w.estado === 'PUBLICADO') return 'ACTIVO';
  return 'OCULTAR';
}

// ── MultiDateCalendar ─────────────────────────────────────────────────────────
function MultiDateCalendar({ selected, onChange, startDate }) {
  const initView = () => {
    const ref = startDate || new Date().toISOString().slice(0,10);
    const d = new Date(ref + 'T12:00:00');
    return { year: d.getFullYear(), month: d.getMonth() };
  };
  const [view, setView] = useState(initView);

  useEffect(() => {
    if (startDate) {
      const d = new Date(startDate + 'T12:00:00');
      setView({ year: d.getFullYear(), month: d.getMonth() });
    }
  }, [startDate]);

  const prevMonth = () => setView(v => { const d = new Date(v.year, v.month-1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const nextMonth = () => setView(v => { const d = new Date(v.year, v.month+1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });

  const offset      = jsDayToIdx(new Date(view.year, view.month, 1).getDay());
  const daysInMonth = new Date(view.year, view.month+1, 0).getDate();

  function ds(day) {
    return `${view.year}-${String(view.month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  function toggle(day) {
    const s = ds(day);
    onChange(selected.includes(s) ? selected.filter(x => x !== s) : [...selected, s].sort());
  }

  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_,i) => i+1)];

  return (
    <div className="border border-border rounded-lg bg-white p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center hover:bg-surface-200 rounded text-ink-muted">‹</button>
        <span className="text-xs font-semibold text-ink">{MESES[view.month]} {view.year}</span>
        <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center hover:bg-surface-200 rounded text-ink-muted">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DIAS_ABR.map(d => <div key={d} className="text-center text-xs text-ink-muted py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const s = ds(day);
          const isSel = selected.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(day)}
              className={`h-8 w-full text-xs rounded-full flex items-center justify-center transition-colors ${
                isSel ? 'bg-primary text-white font-semibold' : 'text-ink hover:bg-surface-200'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="mt-2 text-xs text-ink-muted text-center">
          {selected.length} fecha{selected.length !== 1 ? 's' : ''} seleccionada{selected.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

// ── WeekdayCalendarPicker ─────────────────────────────────────────────────────
// Calendar where only dates matching `weekdayMyIdx` AND after `startDate` are selectable.
// `computedDates` (optional) highlights the full range; `startDate` is shown as anchor.
function WeekdayCalendarPicker({ startDate, weekdayMyIdx, value, onChange, computedDates = [], step = 7 }) {
  const initView = () => {
    const ref = value || startDate;
    if (ref) { const d = new Date(ref + 'T12:00:00'); return { year: d.getFullYear(), month: d.getMonth() }; }
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  };
  const [view, setView] = useState(initView);

  const prevMonth = () => setView(v => { const d = new Date(v.year, v.month-1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const nextMonth = () => setView(v => { const d = new Date(v.year, v.month+1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });

  const offset      = jsDayToIdx(new Date(view.year, view.month, 1).getDay());
  const daysInMonth = new Date(view.year, view.month+1, 0).getDate();

  function ds(day) {
    return `${view.year}-${String(view.month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  }
  function isSelectable(day) {
    const s = ds(day);
    if (jsDayToIdx(new Date(s + 'T12:00:00').getDay()) !== weekdayMyIdx) return false;
    if (startDate && s <= startDate) return false;
    return true;
  }

  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_,i) => i+1)];

  return (
    <div className="border border-border rounded-lg bg-white p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center hover:bg-surface-200 rounded text-ink-muted">‹</button>
        <span className="text-xs font-semibold text-ink">{MESES[view.month]} {view.year}</span>
        <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center hover:bg-surface-200 rounded text-ink-muted">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DIAS_ABR.map(d => <div key={d} className="text-center text-xs text-ink-muted py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const s        = ds(day);
          const isStart  = s === startDate;
          const isSel    = computedDates.includes(s); // includes start + all range + end
          const canClick = isSelectable(day);
          return (
            <button
              key={s}
              type="button"
              disabled={!canClick && !isStart}
              onClick={() => canClick && onChange(s)}
              title={isStart ? 'Fecha de inicio' : undefined}
              className={`h-8 w-full text-xs rounded-full flex items-center justify-center transition-colors ${
                isStart
                  ? 'bg-primary text-white font-semibold cursor-default'
                  : isSel
                    ? 'bg-primary text-white font-semibold'
                    : canClick
                      ? 'text-ink font-medium hover:bg-surface-200'
                      : 'text-ink-muted/25 cursor-not-allowed'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      {startDate && !value && (
        <p className="mt-2 text-xs text-ink-muted/60 text-center">
          Elegí la última fecha del ciclo
        </p>
      )}
    </div>
  );
}

// ── WeeklyPicker ──────────────────────────────────────────────────────────────
function WeeklyPicker({ startDate, endDate, numSessions, frequency, onEndDateChange, onNumSessionsChange, onFrequencyChange }) {
  const myIdx   = weekdayIdxOf(startDate);
  const dayName = myIdx !== null ? DIAS_FULL[myIdx] : null;
  const step    = frequency === 'QUINCENAL' ? 14 : 7;
  const dates   = computeWeeklyDates(startDate, endDate, myIdx, step);

  const freqLabel = frequency === 'QUINCENAL' ? 'cada dos semanas' : 'cada semana';

  if (!startDate) {
    return (
      <p className="text-xs text-ink-muted italic">Primero indicá la Fecha de inicio del taller.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Selector de frecuencia */}
      <div>
        <span className="block text-xs font-medium text-ink-muted mb-1.5">Frecuencia</span>
        <div className="flex gap-2">
          {[
            { val: 'SEMANAL',   label: 'Semanal',   desc: 'Cada semana' },
            { val: 'QUINCENAL', label: 'Quincenal', desc: 'Cada 2 semanas' },
          ].map(({ val, label, desc }) => (
            <button
              key={val}
              type="button"
              onClick={() => onFrequencyChange(val)}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                frequency === val
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-ink hover:border-primary/40 bg-white'
              }`}
            >
              {label}
              <span className="block text-ink-muted/60 text-xs font-normal">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Se repite todos los <strong>{dayName?.toLowerCase()}</strong> <span className="text-ink-muted/70">({freqLabel})</span>. Elegí la última fecha:
      </p>
      <WeekdayCalendarPicker
        startDate={startDate}
        weekdayMyIdx={myIdx}
        value={endDate}
        onChange={onEndDateChange}
        computedDates={dates}
        step={step}
      />
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-muted shrink-0">o indicá la cantidad de encuentros:</span>
        <input
          type="number"
          min="2"
          value={numSessions}
          onChange={e => onNumSessionsChange(e.target.value)}
          placeholder="Ej: 8"
          className="w-20 px-2 py-1.5 bg-white border border-border rounded-md text-sm text-[#2B241A] font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      {endDate && (
        <p className="text-xs text-ink-muted italic bg-surface-100 rounded-md px-3 py-2 border border-border">
          Todos los {dayName?.toLowerCase()} ({freqLabel}) hasta el {formatShortDate(endDate)}
        </p>
      )}
      {dates.length > 0 && (
        <div>
          <p className="text-xs text-ink-muted mb-1.5">{dates.length} encuentros:</p>
          <div className="flex flex-wrap gap-1.5">
            {dates.map(d => (
              <span
                key={d}
                className="text-xs font-mono bg-primary/8 text-primary rounded px-2 py-0.5 border border-primary/20"
              >
                {new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { weekday:'short', day:'2-digit', month:'short' })}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── WorkshopForm ──────────────────────────────────────────────────────────────
export default function WorkshopForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { activeEspacio } = useEspacio();
  const planNombre = activeEspacio?.plan?.nombre ?? null;
  const canUploadImage = DEMO_MODE || planNombre === 'Profesional' || planNombre === 'Estudio';
  const imgInputRef = useRef(null);

  // Paleta: colores de marca del espacio primero, luego el default
  const rawBC = activeEspacio?.brandColors;
  const brandColors = Array.isArray(rawBC) ? rawBC : (rawBC?.palette ?? []);
  const activePalette = brandColors.length
    ? [...new Set([...brandColors, ...HEADER_PALETTE])].slice(0, 16)
    : HEADER_PALETTE;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(id)
      .then((w) => {
        const existingFecha     = localDateStr(w.fecha);
        const existingEndDate   = w.scheduleData?.endDate ?? '';
        const existingIdx       = weekdayIdxOf(existingFecha);
        const existingFrequency = w.scheduleData?.frequency ?? 'SEMANAL';
        const existingStep      = existingFrequency === 'QUINCENAL' ? 14 : 7;
        const existingDates     = existingFecha && existingEndDate
          ? computeWeeklyDates(existingFecha, existingEndDate, existingIdx, existingStep)
          : [];
        setForm({
          nombre:              w.nombre,
          tipo:                w.tipo ?? null,
          descripcion:         w.descripcion ?? '',
          cuposTotales:        String(w.cuposTotales),
          precio:              String(w.precio),
          fecha:               existingFecha,
          hora:                localTimeStr(w.fecha),
          duracionHoras:       w.duracionHoras    != null ? String(w.duracionHoras)    : '',
          duracionMinutos:     w.duracionMinutos  != null ? String(w.duracionMinutos)  : '0',
          _estadoAction:       deriveEstadoAction(w),
          experienciaPrevia:   w.experienciaPrevia ?? null,
          scheduleMode:        w.scheduleData?.mode      ?? null,
          specificDates:       w.scheduleData?.dates     ?? [],
          weeklyEndDate:       existingEndDate,
          weeklyNumSessions:   existingDates.length ? String(existingDates.length) : '',
          weeklyFrequency:     w.scheduleData?.frequency ?? 'SEMANAL',
          headerType:          w.headerType  ?? 'COLOR',
          headerValue:         w.headerValue ?? '#E85D4A',
        });
      })
      .catch((e) => alert(e.message))
      .finally(() => setLoadingData(false));
  }, [id]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }

  function handleFechaChange(newFecha) {
    setForm(prev => {
      const updates = { fecha: newFecha };
      if (prev.scheduleMode === 'SPECIFIC_DATES') {
        const withoutOld = prev.specificDates.filter(d => d !== prev.fecha);
        updates.specificDates = newFecha ? [...withoutOld, newFecha].sort() : withoutOld;
      }
      if (prev.scheduleMode === 'WEEKLY' && prev.weeklyEndDate && newFecha >= prev.weeklyEndDate) {
        updates.weeklyEndDate = '';
        updates.weeklyNumSessions = '';
      }
      return { ...prev, ...updates };
    });
    setErrors(prev => ({ ...prev, fecha: '' }));
  }

  function handleWeeklyEndDate(newEndDate) {
    setForm(prev => {
      const myIdx = weekdayIdxOf(prev.fecha);
      const step  = prev.weeklyFrequency === 'QUINCENAL' ? 14 : 7;
      const computed = computeWeeklyDates(prev.fecha, newEndDate, myIdx, step);
      return { ...prev, weeklyEndDate: newEndDate, weeklyNumSessions: computed.length ? String(computed.length) : '' };
    });
  }

  function handleWeeklyNumSessions(n) {
    setForm(prev => {
      if (!prev.fecha || !n || Number(n) < 2) {
        return { ...prev, weeklyNumSessions: n, weeklyEndDate: '' };
      }
      const step = prev.weeklyFrequency === 'QUINCENAL' ? 14 : 7;
      const start = new Date(prev.fecha + 'T12:00:00');
      const endDate = localDateStr(new Date(start.getTime() + (Number(n) - 1) * step * 86400000));
      return { ...prev, weeklyNumSessions: n, weeklyEndDate: endDate };
    });
  }

  function handleWeeklyFrequency(freq) {
    setForm(prev => ({ ...prev, weeklyFrequency: freq, weeklyEndDate: '', weeklyNumSessions: '' }));
  }

  function handleTipoChange(t) {
    const active = form.tipo === t;
    setForm(prev => ({
      ...prev,
      tipo: active ? null : t,
      ...(!active && !IS_MULTI(t)) || (active && IS_MULTI(prev.tipo))
        ? { scheduleMode: null, specificDates: [], weeklyEndDate: '', weeklyNumSessions: '' }
        : {},
    }));
  }

  function handleScheduleMode(mode) {
    if (form.scheduleMode === mode) { set('scheduleMode', null); return; }
    if (mode === 'SPECIFIC_DATES' && form.fecha) {
      setForm(prev => ({
        ...prev,
        scheduleMode: mode,
        specificDates: prev.specificDates.includes(prev.fecha)
          ? prev.specificDates
          : [...prev.specificDates, prev.fecha].sort(),
      }));
    } else {
      set('scheduleMode', mode);
    }
  }

  function handleEstadoAction(action) {
    setForm(prev => ({ ...prev, _estadoAction: action }));
  }

  function validate() {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido';
    if (!form.cuposTotales || isNaN(form.cuposTotales) || Number(form.cuposTotales) < 1)
      errs.cuposTotales = 'Debe ser mayor a 0';
    if (!form.precio || isNaN(form.precio) || Number(form.precio) < 0)
      errs.precio = 'Precio inválido';
    if (!form.fecha) errs.fecha = 'La fecha es requerida';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const cuposTotales     = Number(form.cuposTotales);
      const estadoFinal      = form._estadoAction === 'OCULTAR' ? 'BORRADOR' : 'PUBLICADO';
      const cuposDisponibles = form._estadoAction === 'AGOTAR' ? 0 : cuposTotales;

      const payload = {
        nombre:            form.nombre,
        tipo:              form.tipo   || null,
        descripcion:       form.descripcion || null,
        cuposTotales,
        cuposDisponibles,
        precio:            Number(form.precio),
        fecha:             new Date(`${form.fecha}T${form.hora}:00`).toISOString(),
        duracionHoras:     form.duracionHoras   !== '' ? Number(form.duracionHoras)   : null,
        duracionMinutos:   form.duracionMinutos !== '0' ? Number(form.duracionMinutos) : null,
        estado:            estadoFinal,
        experienciaPrevia: form.experienciaPrevia,
        scheduleData:      buildScheduleData(form),
        headerType:  form.headerType || 'COLOR',
        // Base64 data URLs no caben en varchar(500); se guardará null hasta implementar Storage
        headerValue: (form.headerValue && !form.headerValue.startsWith('data:'))
          ? form.headerValue
          : (DEMO_MODE && form.headerType === 'IMAGE' && form.headerValue?.startsWith('data:'))
            ? form.headerValue  // En demo, localStorage no tiene límite de varchar
            : (form.headerType === 'COLOR' ? (form.headerValue || null) : null),
      };

      if (isEdit) {
        const updated = await api.update(id, activeEspacio.id, payload);
        if (!updated) throw new Error('El taller no pudo actualizarse. Verificá que el emulador de Firebase esté activo.');
      } else {
        const created = await api.create(activeEspacio.id, payload);
        if (!created) throw new Error('El taller no pudo guardarse. Verificá que el emulador de Firebase esté activo.');
      }
      navigate('/workshops', { state: { refresh: Date.now() } });
    } catch (err) {
      setErrors({ _server: err?.message || 'Error desconocido al guardar' });
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return <Layout><p className="text-sm text-ink-muted">Cargando taller…</p></Layout>;
  }

  const fechaGlow = IS_MULTI(form.tipo) && form.scheduleMode === 'WEEKLY' && !form.fecha;

  return (
    <Layout>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232, 93, 74, 0); border-color: var(--color-border, #e5e3df); }
          50%       { box-shadow: 0 0 0 4px rgba(232, 93, 74, 0.28); border-color: #E85D4A; }
        }
        .fecha-glow { animation: glow-pulse 1.4s ease-in-out infinite; }
      `}</style>
      <div className="w-full max-w-5xl">
        <Link to="/workshops" className="text-xs text-ink-muted hover:text-ink mb-4 inline-block">
          ← Volver a talleres
        </Link>
        <h1 className="font-display text-3xl text-ink mb-6">
          {isEdit ? 'Editar taller' : 'Nuevo taller'}
        </h1>

        {errors._server && (
          <p className="mb-5 text-xs text-danger bg-danger/5 border border-danger/20 rounded px-3 py-2">
            {errors._server}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10 items-start">

            {/* ── Columna principal ── */}
            <div className="flex flex-col gap-5">

              {/* Nombre */}
              <div>
                <label className={LABEL_CLS}>Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => set('nombre', e.target.value)}
                  placeholder="Ej: Introducción a la acuarela"
                  className={INPUT_CLS}
                />
                {errors.nombre && <p className="mt-1 text-xs text-danger">{errors.nombre}</p>}
              </div>

              {/* Tipo */}
              <div>
                <label className={LABEL_CLS}>Tipo de encuentro</label>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                  {TIPOS.map(t => {
                    const cfg = TIPO_CONFIG[t];
                    const active = form.tipo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTipoChange(t)}
                        className={`text-left px-3 py-2.5 rounded-md border-2 transition-colors ${
                          active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-white'
                        }`}
                      >
                        <span className="block text-xs font-semibold text-ink mb-0.5">{cfg.label}</span>
                        <span className="block text-xs text-ink-muted leading-snug">{TIPO_DESC[t]}</span>
                        <span className="block text-xs text-ink-muted/60 mt-1 italic">{cfg.duracion}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Schedule (solo Taller / Curso) */}
              {IS_MULTI(form.tipo) && (
                <div>
                  <label className={LABEL_CLS}>Modalidad de encuentros</label>
                  <div className="flex gap-2 mb-3">
                    {[
                      { mode: 'SPECIFIC_DATES', label: 'Días específicos' },
                      { mode: 'WEEKLY',         label: 'Frecuencia semanal' },
                    ].map(({ mode, label }) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => handleScheduleMode(mode)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                          form.scheduleMode === mode
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-ink hover:border-primary/40 bg-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {form.scheduleMode === 'SPECIFIC_DATES' && (
                    <MultiDateCalendar
                      selected={form.specificDates}
                      onChange={dates => set('specificDates', dates)}
                      startDate={form.fecha}
                    />
                  )}
                  {form.scheduleMode === 'WEEKLY' && (
                    <WeeklyPicker
                      startDate={form.fecha}
                      endDate={form.weeklyEndDate}
                      numSessions={form.weeklyNumSessions}
                      frequency={form.weeklyFrequency}
                      onEndDateChange={handleWeeklyEndDate}
                      onNumSessionsChange={handleWeeklyNumSessions}
                      onFrequencyChange={handleWeeklyFrequency}
                    />
                  )}
                </div>
              )}

              {/* Descripción */}
              <div>
                <label className={LABEL_CLS}>Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => set('descripcion', e.target.value)}
                  rows={4}
                  placeholder="Describí el taller brevemente…"
                  className={INPUT_CLS + ' resize-none'}
                />
              </div>

              {/* Experiencia previa */}
              <div>
                <label className={LABEL_CLS}>Requisito de experiencia</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {[
                    { val: true,  label: 'Se requiere experiencia previa' },
                    { val: false, label: 'No se requiere experiencia' },
                  ].map(({ val, label }) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => set('experienciaPrevia', form.experienciaPrevia === val ? null : val)}
                      className={`flex-1 px-3 py-2 rounded-md border text-xs font-medium transition-colors ${
                        form.experienciaPrevia === val
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-ink hover:border-primary/40 bg-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Columna secundaria ── */}
            <div className="flex flex-col gap-5">

              {/* a) Fecha de inicio y hora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>Fecha de inicio *</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={e => handleFechaChange(e.target.value)}
                    className={INPUT_CLS + ' font-mono' + (fechaGlow ? ' fecha-glow' : '')}
                  />
                  {errors.fecha && <p className="mt-1 text-xs text-danger">{errors.fecha}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Hora de inicio *</label>
                  <TimeSelect value={form.hora} onChange={v => set('hora', v)} />
                </div>
              </div>

              {/* b) Cupos y precio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLS}>Cupos totales *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.cuposTotales}
                    onChange={e => set('cuposTotales', e.target.value)}
                    className={INPUT_CLS + ' font-mono'}
                  />
                  {errors.cuposTotales && <p className="mt-1 text-xs text-danger">{errors.cuposTotales}</p>}
                </div>
                <div>
                  <label className={LABEL_CLS}>Precio (ARS) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={e => set('precio', e.target.value)}
                    className={INPUT_CLS + ' font-mono'}
                  />
                  {errors.precio && <p className="mt-1 text-xs text-danger">{errors.precio}</p>}
                </div>
              </div>


              {/* c) Duración */}
              <div>
                <label className={LABEL_CLS}>Duración</label>
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={form.duracionHoras}
                      onChange={e => set('duracionHoras', e.target.value)}
                      placeholder="0"
                      className="w-20 px-3 py-2 bg-white border border-border rounded-md text-sm text-[#2B241A] font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-sm text-ink-muted shrink-0">hs</span>
                  </div>
                  <select
                    value={form.duracionMinutos}
                    onChange={e => set('duracionMinutos', e.target.value)}
                    className="w-28 px-3 py-2 bg-white border border-border rounded-md text-sm text-[#2B241A] font-mono focus:outline-none focus:border-primary"
                  >
                    <option value="0">0 min</option>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                  </select>
                </div>
              </div>

              {/* Encabezado de tarjeta */}
              <div>
                <label className={LABEL_CLS}>Encabezado de tarjeta</label>
                {/* Selector COLOR / IMAGEN — solo mostrar IMAGE si el plan lo permite */}
                {canUploadImage && (
                  <div className="flex gap-2 mb-3">
                    {[
                      { val: 'COLOR', label: 'Color' },
                      { val: 'IMAGE', label: 'Imagen' },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, headerType: val }))}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                          form.headerType === val
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-ink hover:border-primary/40 bg-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {form.headerType === 'COLOR' && (
                  <div className="flex flex-col gap-2.5">
                    {/* Preview del encabezado */}
                    <div
                      className="w-full h-12 rounded-md border border-border transition-colors"
                      style={{ backgroundColor: isValidColor(form.headerValue) ? form.headerValue : '#E85D4A' }}
                    />
                    {/* Paleta (brand colors del espacio + defaults) */}
                    {brandColors.length > 0 && (
                      <p className="text-xs text-ink-muted/70 -mb-1">Tu paleta de marca aparece primero</p>
                    )}
                    <div className="grid grid-cols-8 gap-1.5">
                      {activePalette.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, headerValue: color }))}
                          title={color}
                          className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 ${
                            form.headerValue === color
                              ? 'border-ink/60 scale-110'
                              : 'border-transparent hover:border-ink/20'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    {/* Input manual hex / rgb */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full shrink-0 border border-border"
                        style={{ backgroundColor: isValidColor(form.headerValue) ? form.headerValue : '#E85D4A' }}
                      />
                      <input
                        type="text"
                        value={form.headerValue}
                        onChange={e => setForm(prev => ({ ...prev, headerValue: e.target.value }))}
                        placeholder="#E85D4A o rgb(232, 93, 74)"
                        className="flex-1 px-2 py-1.5 bg-white border border-border rounded-md text-xs font-mono text-[#2B241A] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {form.headerType === 'IMAGE' && (
                  <div>
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setForm(prev => ({ ...prev, headerType: 'IMAGE', headerValue: ev.target.result }));
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div
                      onClick={() => imgInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (!file || !file.type.startsWith('image/')) return;
                        const reader = new FileReader();
                        reader.onload = ev => setForm(prev => ({ ...prev, headerType: 'IMAGE', headerValue: ev.target.result }));
                        reader.readAsDataURL(file);
                      }}
                      className="relative border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
                      style={{ height: 80 }}
                    >
                      {form.headerValue && form.headerValue.startsWith('data:') ? (
                        <img
                          src={form.headerValue}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-1">
                          <p className="text-xs font-medium text-ink-muted">Arrastrá o hacé click</p>
                          <p className="text-xs text-ink-muted/60">JPG, PNG, WebP</p>
                        </div>
                      )}
                    </div>
                    {form.headerValue && form.headerValue.startsWith('data:') && (
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, headerValue: '' }))}
                        className="mt-1 text-xs text-danger hover:underline"
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* d) Estado — botones */}
              <div>
                <label className={LABEL_CLS}>Estado</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { action: 'ACTIVO',  label: 'Activo',  desc: 'Visible y con inscripciones abiertas' },
                    { action: 'OCULTAR', label: 'Ocultar', desc: 'Solo vos lo ves, no aparece al público' },
                    { action: 'AGOTAR',  label: 'Agotar',  desc: 'Publicado pero sin cupos disponibles' },
                  ].map(({ action, label, desc }) => (
                    <button
                      key={action}
                      type="button"
                      title={desc}
                      onClick={() => handleEstadoAction(action)}
                      className={`px-2 py-2.5 rounded-md border-2 text-xs font-semibold transition-colors ${
                        form._estadoAction === action
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-ink hover:border-primary/40 bg-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-ink-muted">
                  {{
                    ACTIVO:  'Visible y con inscripciones abiertas.',
                    OCULTAR: 'Solo vos lo ves, no aparece al público.',
                    AGOTAR:  'Publicado pero sin cupos disponibles.',
                  }[form._estadoAction]}
                </p>
              </div>

            </div>
          </div>

          {/* ── Botones centrados al fondo ── */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
            <Link
              to="/workshops"
              className="px-5 py-2 text-sm font-medium text-ink hover:bg-surface-200 rounded-md transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-strong transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
