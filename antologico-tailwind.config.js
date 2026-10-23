/**
 * Antológico — extensión de Tailwind con los tokens del sistema de diseño (Coral).
 * Copiar el contenido de `extend` dentro de tu tailwind.config.js (theme.extend).
 * Requiere las Google Fonts cargadas (ver antologico-tokens.css).
 *
 * Los colores usan CSS custom properties con RGB channels para soportar
 * el modificador de opacidad de Tailwind (bg-primary/50, text-ink/80, etc.)
 * y cambiar automáticamente entre modo claro y oscuro.
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          0: 'rgb(var(--color-surface-0) / <alpha-value>)',
          100: 'rgb(var(--color-surface-100) / <alpha-value>)',
          200: 'rgb(var(--color-surface-200) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          mid: 'rgb(var(--color-primary-mid) / <alpha-value>)',
          strong: 'rgb(var(--color-primary-strong) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(150deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-mid)) 55%, rgb(var(--color-primary-strong)) 100%)',
      },
    },
  },
};
