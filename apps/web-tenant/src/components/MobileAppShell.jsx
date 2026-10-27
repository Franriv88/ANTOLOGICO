import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconAntologico } from './LogoAntologico';

// El query param ?from=mobile-cta sirve para que la landing muestre una
// pantalla específica de "necesitás una computadora" cuando el usuario llega
// aquí desde el footer del app mobile.
const PROMO_URL = 'https://www.antologico.app/?from=mobile-cta';

const NAV_ITEMS = [
  { to: '/inicio',       label: 'Inicio',       icon: 'home' },
  { to: '/mis-reservas', label: 'Mis reservas', icon: 'calendar' },
  { to: '/mis-datos',    label: 'Mi perfil',    icon: 'user' },
];

const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  qr: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3"/>
    </svg>
  ),
  menu: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

export default function MobileAppShell({
  title = 'Antológico',
  subtitle,
  isAuthed = false,
  onLogout,
  showQR = false,
  onShowQR,
  children,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col">
      {/* Menú hamburguesa overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE8DE]">
              <div className="flex items-center gap-2">
                <IconAntologico size={22} />
                <span className="font-semibold text-sm text-[#1A1611]">Antológico</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-md hover:bg-[#FAF7F2] text-[#6B5F4C] transition-colors"
                aria-label="Cerrar menú"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col p-3">
              {NAV_ITEMS.map(item => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-colors w-full ${
                      active
                        ? 'bg-[#E85D4A]/10 text-[#E85D4A] font-semibold'
                        : 'text-[#2B241A] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span style={{ color: active ? '#E85D4A' : '#9B9083' }}>{ICONS[item.icon]}</span>
                    {item.label}
                  </Link>
                );
              })}

              {isAuthed && (
                <>
                  <div className="mx-3 my-2 border-t border-[#EDE8DE]" />
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[#6B5F4C] hover:bg-[#FAF7F2] transition-colors w-full text-left"
                  >
                    <span className="text-[#9B9083]">{ICONS.logout}</span>
                    Cerrar sesión
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Header coral */}
      <div className="w-full bg-[#E85D4A] px-4 pt-5 pb-7">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white transition-colors shrink-0"
            aria-label="Abrir menú"
          >
            {ICONS.menu}
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0 justify-center">
            <IconAntologico size={26} />
            <div className="text-white min-w-0">
              {subtitle ? (
                <>
                  <p className="font-display text-white/70 text-[10px] leading-none mb-0.5">{title}</p>
                  <h1 className="font-display text-base font-bold leading-tight truncate">{subtitle}</h1>
                </>
              ) : (
                <span className="font-display text-base font-semibold">{title}</span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            {showQR ? (
              <button
                onClick={onShowQR}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/30 hover:bg-white/10 transition-colors text-white text-xs font-semibold"
                aria-label="Escanear QR"
              >
                {ICONS.qr}
                QR
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Footer: CTA + Powered by */}
      <footer className="w-full bg-[#F4EFE4] border-t border-[#EDE8DE]">
        <div className="max-w-lg mx-auto px-4 py-6 text-center">
          <p className="text-sm text-[#2B241A] font-semibold mb-1">¿Querés tu propio espacio Antológico?</p>
          <p className="text-xs text-[#6B5F4C] mb-4">Publicá tus talleres, gestioná reservas y cobrá online.</p>
          <a
            href={PROMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E85D4A] text-white font-semibold rounded-xl text-sm hover:bg-[#c94a38] transition-colors"
          >
            Creá tu cuenta profesional
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <p className="text-[11px] text-[#9B9083] mt-4">
            Powered by <span className="font-semibold">Antológico</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
