const GA_ID    = 'G-T3R0V5H0FE';
const META_ID  = null; // Se completa con el Pixel ID

function gtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
}

function fbq(...args) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq(...args);
}

export function trackEvent(name, params = {}) {
  gtag('event', name, params);
  fbq('trackCustom', name, params);
}

// ── Eventos de negocio ───────────────────────────────────────────────────────

export function trackRegistro({ method = 'google' } = {}) {
  gtag('event', 'sign_up', { method });
  fbq('track', 'CompleteRegistration', { method });
}

export function trackLogin({ method = 'google' } = {}) {
  gtag('event', 'login', { method });
}

export function trackOnboardingComplete({ espacioId, planId }) {
  gtag('event', 'onboarding_complete', { espacio_id: espacioId, plan_id: planId });
  fbq('track', 'Lead', { content_name: 'onboarding', plan_id: planId });
}

export function trackWorkshopCreado({ workshopId, espacioId }) {
  gtag('event', 'workshop_created', { workshop_id: workshopId, espacio_id: espacioId });
  fbq('trackCustom', 'WorkshopCreated', { workshop_id: workshopId });
}

export function trackWorkshopPublicado({ workshopId, espacioId }) {
  gtag('event', 'workshop_published', { workshop_id: workshopId, espacio_id: espacioId });
}

export function trackReserva({ workshopId, espacioId, monto }) {
  gtag('event', 'purchase', {
    currency: 'ARS',
    value: monto,
    items: [{ item_id: workshopId, item_category: 'workshop' }],
  });
  fbq('track', 'Purchase', { currency: 'ARS', value: monto, content_ids: [workshopId] });
}

export function trackSuscripcion({ planId, periodo, monto }) {
  gtag('event', 'subscribe', { plan_id: planId, periodo, currency: 'ARS', value: monto });
  fbq('track', 'Subscribe', { currency: 'ARS', value: monto, plan_id: planId });
}

export function trackPageView(path) {
  gtag('event', 'page_view', { page_path: path });
}
