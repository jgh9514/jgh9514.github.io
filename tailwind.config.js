/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,vue}',
    './src/pages/**/*.vue',
    './src/components/**/*.vue',
    './src/layouts/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/app.vue',
    './src/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Vuetify와 호환되는 색상 확장
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#738599', // Vuetify primary와 동일
          600: '#627d98',
          700: '#486581',
          800: '#334e68',
          900: '#243b53',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#444', // Vuetify secondary와 동일
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#1a1d20',
        },
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  // Vuetify와의 충돌 방지를 위한 설정
  corePlugins: {
    preflight: true, // Tailwind의 기본 스타일 리셋 활성화
  },
};
