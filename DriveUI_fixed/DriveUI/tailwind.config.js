/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      colors: {
        void: {
          DEFAULT: '#0a0c12',
          50: '#f5f6f8',
          900: '#0a0c12',
          950: '#05060a'
        },
        surface: {
          DEFAULT: '#12151d',
          light: '#ffffff'
        },
        aurora: {
          violet: '#8b7cfa',
          teal: '#43d9c8',
          amber: '#ffb86b',
          rose: '#fa7c9c'
        },
        ink: {
          DEFAULT: '#f5f5f7',
          muted: '#9aa0ac',
          faint: '#5c6270'
        }
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #8b7cfa 0%, #43d9c8 100%)',
        'aurora-gradient-soft': 'linear-gradient(135deg, rgba(139,124,250,0.18) 0%, rgba(67,217,200,0.18) 100%)',
        'aurora-radial': 'radial-gradient(circle at 30% 20%, rgba(139,124,250,0.25), transparent 60%), radial-gradient(circle at 80% 80%, rgba(67,217,200,0.18), transparent 55%)'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.28)',
        'glass-light': '0 8px 32px rgba(20,20,40,0.08)',
        glow: '0 0 24px rgba(139,124,250,0.35)',
        'glow-teal': '0 0 24px rgba(67,217,200,0.3)'
      },
      borderRadius: {
        xl2: '18px',
        xl3: '22px'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' }
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        ringSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
        floatY: 'floatY 4s ease-in-out infinite',
        ringSpin: 'ringSpin 8s linear infinite'
      }
    }
  },
  plugins: []
};
