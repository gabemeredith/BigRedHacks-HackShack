/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* === DESIGN SYSTEM COLORS === */
      colors: {
        /* Brand Colors */
        primary: {
          50: 'rgb(var(--color-primary-50))',
          100: 'rgb(var(--color-primary-100))',
          200: 'rgb(var(--color-primary-200))',
          300: 'rgb(var(--color-primary-300))',
          400: 'rgb(var(--color-primary-400))',
          500: 'rgb(var(--color-primary-500))',
          600: 'rgb(var(--color-primary-600))',
          700: 'rgb(var(--color-primary-700))',
          800: 'rgb(var(--color-primary-800))',
          900: 'rgb(var(--color-primary-900))',
          950: 'rgb(var(--color-primary-950))',
          DEFAULT: 'rgb(var(--color-primary-500))',
          foreground: 'rgb(var(--color-text-inverse))',
        },
        secondary: {
          50: 'rgb(var(--color-secondary-50))',
          100: 'rgb(var(--color-secondary-100))',
          200: 'rgb(var(--color-secondary-200))',
          300: 'rgb(var(--color-secondary-300))',
          400: 'rgb(var(--color-secondary-400))',
          500: 'rgb(var(--color-secondary-500))',
          600: 'rgb(var(--color-secondary-600))',
          700: 'rgb(var(--color-secondary-700))',
          800: 'rgb(var(--color-secondary-800))',
          900: 'rgb(var(--color-secondary-900))',
          950: 'rgb(var(--color-secondary-950))',
          DEFAULT: 'rgb(var(--color-secondary-500))',
          foreground: 'rgb(var(--color-text-inverse))',
        },
        accent: {
          50: 'rgb(var(--color-accent-50))',
          100: 'rgb(var(--color-accent-100))',
          200: 'rgb(var(--color-accent-200))',
          300: 'rgb(var(--color-accent-300))',
          400: 'rgb(var(--color-accent-400))',
          500: 'rgb(var(--color-accent-500))',
          600: 'rgb(var(--color-accent-600))',
          700: 'rgb(var(--color-accent-700))',
          800: 'rgb(var(--color-accent-800))',
          900: 'rgb(var(--color-accent-900))',
          950: 'rgb(var(--color-accent-950))',
          DEFAULT: 'rgb(var(--color-accent-500))',
          foreground: 'rgb(var(--color-text-inverse))',
        },
        success: {
          50: 'rgb(var(--color-success-50))',
          100: 'rgb(var(--color-success-100))',
          200: 'rgb(var(--color-success-200))',
          300: 'rgb(var(--color-success-300))',
          400: 'rgb(var(--color-success-400))',
          500: 'rgb(var(--color-success-500))',
          600: 'rgb(var(--color-success-600))',
          700: 'rgb(var(--color-success-700))',
          800: 'rgb(var(--color-success-800))',
          900: 'rgb(var(--color-success-900))',
          950: 'rgb(var(--color-success-950))',
          DEFAULT: 'rgb(var(--color-success-500))',
        },
        error: {
          50: 'rgb(var(--color-error-50))',
          100: 'rgb(var(--color-error-100))',
          200: 'rgb(var(--color-error-200))',
          300: 'rgb(var(--color-error-300))',
          400: 'rgb(var(--color-error-400))',
          500: 'rgb(var(--color-error-500))',
          600: 'rgb(var(--color-error-600))',
          700: 'rgb(var(--color-error-700))',
          800: 'rgb(var(--color-error-800))',
          900: 'rgb(var(--color-error-900))',
          950: 'rgb(var(--color-error-950))',
          DEFAULT: 'rgb(var(--color-error-500))',
        },
        
        /* Surface & Background */
        background: 'rgb(var(--color-background))',
        surface: 'rgb(var(--color-surface))',
        'surface-elevated': 'rgb(var(--color-surface-elevated))',
        
        /* Text Colors */
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
        'text-tertiary': 'rgb(var(--color-text-tertiary))',
        'text-inverse': 'rgb(var(--color-text-inverse))',
        
        /* Border Colors */
        'border-light': 'rgb(var(--color-border-light))',
        'border-medium': 'rgb(var(--color-border-medium))',
        'border-strong': 'rgb(var(--color-border-strong))',
        
        /* Legacy shadcn compatibility */
        border: 'rgb(var(--color-border-light))',
        input: 'rgb(var(--color-border-medium))',
        ring: 'rgb(var(--color-primary-500))',
        foreground: 'rgb(var(--color-text-primary))',
        muted: {
          DEFAULT: 'rgb(var(--color-secondary-100))',
          foreground: 'rgb(var(--color-text-secondary))',
        },
        destructive: {
          DEFAULT: 'rgb(var(--color-error-500))',
          foreground: 'rgb(var(--color-text-inverse))',
        },
        popover: {
          DEFAULT: 'rgb(var(--color-surface-elevated))',
          foreground: 'rgb(var(--color-text-primary))',
        },
        card: {
          DEFAULT: 'rgb(var(--color-surface))',
          foreground: 'rgb(var(--color-text-primary))',
        },
      },
      
      /* === TYPOGRAPHY === */
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        serif: ['var(--font-family-serif)'],
        mono: ['var(--font-family-mono)'],
      },
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-snug)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-snug)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-tight)' }],
        '7xl': ['var(--font-size-7xl)', { lineHeight: 'var(--line-height-tight)' }],
      },
      fontWeight: {
        light: 'var(--font-weight-light)',
        normal: 'var(--font-weight-normal)',
        medium: 'var(--font-weight-medium)',
        semibold: 'var(--font-weight-semibold)',
        bold: 'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      
      /* === SPACING === */
      spacing: {
        0: 'var(--spacing-0)',
        1: 'var(--spacing-1)',
        2: 'var(--spacing-2)',
        3: 'var(--spacing-3)',
        4: 'var(--spacing-4)',
        5: 'var(--spacing-5)',
        6: 'var(--spacing-6)',
        8: 'var(--spacing-8)',
        10: 'var(--spacing-10)',
        12: 'var(--spacing-12)',
        16: 'var(--spacing-16)',
        20: 'var(--spacing-20)',
        24: 'var(--spacing-24)',
        32: 'var(--spacing-32)',
      },
      
      /* === BORDER RADIUS === */
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        base: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },
      
      /* === SHADOWS === */
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        base: 'var(--shadow-base)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        inner: 'var(--shadow-inner)',
      },
      
      /* === Z-INDEX === */
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
      
      /* === TRANSITIONS === */
      transitionDuration: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },
      
      /* === LEGACY SHADCN ANIMATIONS === */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
