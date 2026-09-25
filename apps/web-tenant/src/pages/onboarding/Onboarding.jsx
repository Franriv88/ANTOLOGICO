import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEspacio } from '../../context/EspacioContext';
import { espacios as espacioApi } from '../../services/api';
import StepPerfil   from './StepPerfil';
import StepEspacio  from './StepEspacio';
import StepPlan     from './StepPlan';

const STEPS = ['Tu perfil', 'Tu espacio', 'Elige un plan'];

export default function Onboarding() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState({});   // acumula datos entre pasos
  const navigate          = useNavigate();
  const { refresh }       = useEspacio();

  function next(newData) {
    const merged = { ...data, ...newData };
    setData(merged);
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function finish(planId) {
    // Solo intentar asignar plan si planId es un UUID válido (no un nombre de fallback)
    const isUUID = planId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(planId);
    if (isUUID && data.espacioId) {
      try {
        await espacioApi.updatePlan(data.espacioId, planId);
      } catch (e) {
        console.error('Error al guardar el plan:', e);
      }
    }
    // Pasar el espacio recién creado como fallback por si listMyEspacios devuelve vacío
    await refresh(data.espacioId ? { id: data.espacioId, nombre: data.espacioNombre || 'Mi espacio', estado: 'ACTIVO' } : null);
    navigate('/workshops', { replace: true });
  }

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center px-4 py-12">
      {/* Cabecera */}
      <div className="mb-8 text-center">
        <span className="font-display text-2xl text-ink">Antológico</span>
        <p className="text-sm text-ink-muted mt-1">Configurá tu cuenta en 3 pasos</p>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < step
                    ? 'bg-primary text-white'
                    : i === step
                    ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-1'
                    : 'bg-surface-200 text-ink-muted'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Contenido del paso */}
      <div className={`w-full bg-surface-100 border border-border rounded-xl p-8 ${step === 2 ? 'max-w-3xl' : 'max-w-md'}`}>
        {step === 0 && <StepPerfil  onNext={next} />}
        {step === 1 && <StepEspacio onNext={next} onBack={back} accumulated={data} />}
        {step === 2 && <StepPlan    onFinish={finish} onBack={back} />}
      </div>
    </div>
  );
}
