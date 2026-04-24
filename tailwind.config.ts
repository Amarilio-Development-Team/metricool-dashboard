import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class', '[data-theme="black"]'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      mblg: '540px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        xl: '2rem',
      },
    },
    extend: {
      colors: {
        primary: '#FFC200',
        accent: '#cdc4c5',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'fantasy',
      'black',
      {
        fantasy: {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          ...require('daisyui/src/theming/themes')['fantasy'],
          '.text-strong': {
            color: '#000000',
          },
          '.text-default': {
            color: '#1F1F1F',
          },
          '.text-medium': {
            color: '#2A2A2A',
          },
          '.text-low': {
            color: '#353535',
          },
          '.text-lower': {
            color: '#424242',
          },
          '.text-placeholder': {
            color: '#646464',
          },

          '.container-color': {
            background: '#E8E8E8',
          },

          '.main-container-color': {
            background: '#FFFFFF',
          },

          '.input-bg': {
            background: '#FFFFFF',
            border: '0.4px solid #08080844',
          },

          '.line-separator': {
            background: '#000000',
          },

          '.primary-color-50': {
            background: '#FFFDEA',
          },
          '.primary-color-100': {
            background: '#FFF6C5',
          },
          '.primary-color-200': {
            background: '#FFEA85',
          },
          '.primary-color-300': {
            background: '#FFDE4B',
          },
          '.primary-color-400': {
            background: '#FFD21F',
          },
          '.primary-color-500': {
            background: '#FFC200',
          },
          '.primary-color-600': {
            background: '#DBA600',
          },
          '.primary-color-700': {
            background: '#B78B00',
          },
          '.primary-color-800': {
            background: '#937000',
          },
          '.primary-color-900': {
            background: '#7A5C00',
          },
          '.primary-color-950': {
            background: '#463500',
          },

          '.border-primary': {
            borderColor: '#20202011',
          },
        },

        black: {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          ...require('daisyui/src/theming/themes')['black'],

          '.text-strong': {
            color: '#FEFEFE',
          },
          '.text-default': {
            color: '#EAEAEA',
          },
          '.text-medium': {
            color: '#D7D7D7',
          },
          '.text-low': {
            color: '#C0C0C0',
          },
          '.text-lower': {
            color: '#A9A9A9',
          },
          '.text-placeholder': {
            color: '#939393',
          },

          '.container-color': {
            background: '#353535',
          },
          '.main-container-color': {
            background: '#202020',
          },

          '.input-bg': {
            background: '#1C1C1C',
            border: '0.4px solid #f8f8f823',
          },
          '.line-separator': {
            background: '#FFFFFF',
          },

          '.primary-color-50': {
            background: '#2E2200',
          },
          '.primary-color-100': {
            background: '#463500',
          },
          '.primary-color-200': {
            background: '#7A5C00',
          },
          '.primary-color-300': {
            background: '#937000',
          },
          '.primary-color-400': {
            background: '#B78B00',
          },
          '.primary-color-500': {
            background: '#DBA600',
          },
          '.primary-color-600': {
            background: '#FFC200',
          },
          '.primary-color-700': {
            background: '#FFD21F',
          },
          '.primary-color-800': {
            background: '#FFDE4B',
          },
          '.primary-color-900': {
            background: '#FFEA85',
          },
          '.primary-color-950': {
            background: '#FFF6C5',
          },

          '.border-primary': {
            borderColor: '#f8f8f823',
          },
        },
      },
    ],
    darkTheme: 'black',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
} satisfies Config;
