/**
 * Antológico — extensión de Tailwind con los tokens del sistema de diseño.
 * Fusionar el bloque `extend` con el theme.extend del tailwind.config.js de cada app.
 * Requiere las Google Fonts cargadas (ver tokens.css).
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#EFE7D8',
          100: '#FBF8F2',
          200: '#E4DAC5',
        },
        border: '#D2C4A8',
        ink: {
          DEFAULT: '#2B241A',
          muted: '#6B5F4C',
        },
        primary: {
          DEFAULT: '#E85D4A',
          mid: '#C94A38',
          strong: '#8C2E1F',
        },
        accent: '#B98527',
        danger: '#A23B34',
        success: '#3C6E4F',
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
        'brand-gradient': 'linear-gradient(150deg, #E85D4A 0%, #C94A38 55%, #8C2E1F 100%)',
      },
    },
  },
};
