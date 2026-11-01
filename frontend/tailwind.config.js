/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fk: {
          blue: '#2874f0',
          blueDark: '#1259c3',
          blueLight: '#f0f5ff',
          orange: '#fb641b',
          orangeDark: '#e6530b',
          yellow: '#ff9f00',
          yellowLight: '#fff8e6',
          green: '#388e3c',
          greenLight: '#e8f5e9',
          bg: '#f1f3f6',
          text: '#212121',
          subtext: '#878787',
          border: '#e0e0e0',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'fk-card': '0 2px 4px 0 rgba(0,0,0,.08)',
        'fk-header': '0 2px 10px 0 rgba(0,0,0,.15)',
        'fk-hover': '0 4px 16px 0 rgba(0,0,0,.12)'
      }
    },
  },
  plugins: [],
}

