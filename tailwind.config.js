/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#1E97BA',
        'secondary': '#F26E22',
        'background': '#F5EFE0',
        'accent': '#D65625',
        'desert': {
          50: '#FCF9F2',
          100: '#F8F1E0',
          200: '#F1E3C0',
          300: '#EAD5A0',
          400: '#E3C780',
          500: '#DCB960',
          600: '#B0954D',
          700: '#85713A',
          800: '#594C26',
          900: '#2C2613',
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/3889928/pexels-photo-3889928.jpeg')",
        'texture': "url('https://images.pexels.com/photos/7130538/pexels-photo-7130538.jpeg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};