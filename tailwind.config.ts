import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        totvs: {
          orange: '#e8622a',
          'orange-dark': '#c94e1f',
          'orange-light': '#f5844e',
        }
      }
    },
  },
  plugins: [],
}
export default config
