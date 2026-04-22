import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0b6fbf', /* blue */
        primaryDark: '#0a3057', /* dark blue */
        secondary: '#138486', /* teal */
        success: '#28a23c', /* green */
        successLight: '#6db838', /* light green */
        successDark: '#137e44',
        accent: '#70a248',
        surface: '#FFFFFF',
        background: '#F1F5F9',
        textMain: '#020617',
        textMuted: '#64748B',
        mufti: {
          green: '#28a23c',
          lightGreen: '#6db838',
          primaryBlue: '#063c8f',
          darkGreen: '#0c4636',
          teal: '#138486',
          darkBlue: '#0a3057',
          emerald: '#137e44',
          blue: '#0b6fbf',
          leaf: '#70a248',
        }
      }
    }
  },
  plugins: [
    // This plugin enables the 'no-scrollbar' class used in your main wrapper
    function ({ addUtilities }: any): void {
      addUtilities({
        '.no-scrollbar': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}

export default config;