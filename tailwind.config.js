/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#FEF2F2',
          100: '#FCD5D5',
          200: '#F5A3A3',
          300: '#EF6B6B',
          400: '#E84545',
          500: '#D43232',
          600: '#B22222',
          700: '#911A1A',
          800: '#701414',
          900: '#500E0E',
        },
        sky: {
          light: '#89A7B5',
          DEFAULT: '#6E8FA0',
          dark: '#536B78',
        },
        cream: {
          50: '#FEF2F2',
          100: '#FCD5D5',
          200: '#F5A3A3',
          300: '#EF6B6B',
        },
        gold: {
          light: '#D4BE8A',
          DEFAULT: '#C2A96E',
          dark: '#A08650',
        },
        charcoal: '#2C2C2C',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
