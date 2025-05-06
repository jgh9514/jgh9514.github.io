// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path';

export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  devtools: { enabled: true },
  srcDir: 'src/',
  /**
   * ssr (Server Side Rendering)
   * true: Server Side Rendering 실행
   * 페이지 로딩속도가 서버의 속도에 따라 빠를 수도 느릴 수도 있음.
   * SEO (Serch Engine Optimization) 최적화 가능
   * false: Server Side Rendering 미실행
   * 서버 부하 감소
   * 페이지 로딩속도가 사용자의 컴퓨터 사양에 따라 다를 수 있음.
   */
  ssr: false,
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@formkit/auto-animate',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    'dayjs-nuxt',
    'pinia-plugin-persistedstate',
    '@vue-email/nuxt',
    '@nuxtjs/device',
    'nuxt-aos',
    '@nuxtjs/i18n',
    'nuxt-toast',
  ],
  eslint: {
    // options here
  },
  pinia: {
    storesDirs: ['./src/stores/**'],
  },
  vuetify: {
    vuetifyOptions: {
      labComponents: true,
    },
    theme: {
      dark: false,
      default: 'light',
      disable: false,
      options: {
        cspNonce: undefined,
        customProperties: undefined,
        minifyTheme: undefined,
        themeCache: undefined,
        variations: true,
      },
      themes: {
        light: {
          primary: '#738599',
          secondary: '#444',
          accent: '#DC3641',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
        dark: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
      },
    },
  },
  i18n: {
    strategy: 'no_prefix',
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
  css: ['~/assets/css/default.scss', '~/assets/css/design.scss'],
  alias: {
    '@pages': path.resolve(__dirname, 'src/pages'),
  },
});
