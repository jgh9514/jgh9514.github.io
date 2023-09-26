export default {
  srcDir: 'src/',
  ssr: false,
  target: 'server',
  head: {
    titleTemplate: process.env.npm_package_name,
    title: process.env.npm_package_name,
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE-11'},
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_name || '' },
    ],
    script: [],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { ref: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { ref: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css' },
      { ref: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/4.4.95/css/materialdesignicons.min.css' },
      { ref: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAND248,400,0,0' },
    ]
  },

  css: [
    // '~/assets/font/font.css',
    '~/assets/css/design.css',
    '~/assets/css/vuetify.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  loading: '~/components/LoadingBar.vue',
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/i18n',
  ],
  axios: {
    proxyHeaders: false,
    credentials: false,
    baseURL: 'http://localhost:8080',
    // baseURL: 'https://jgh9514.com',
  },
  proxy: {
  },
  i18n: {
    locales: ['ko'],
    deefaultLocale: 'ko',
    strategy: 'no_prefix',
    vueI18n: {
      failbackLocale: 'ko',
      silentFallbackWarn: true,
      silentTranslationWarn: true,
      messages: {
        ko: { sample: '샘플' },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      default: 'light',
      disable: false,
      options: {
        cspMonce: undefined,
        customProperties: undefined,
        minifyTheme: undefined,
        themeCache: undefined,
        variations: true,
      },
      themes: {
        light: {
          primary: '#062CSE',
          secondary: '#444444',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        },
        dark: {
          primary: '#2196F3',
          accent: '#424242',
          secondary: '#FF4081',
          info: '#FF5252',
          warning: '#2196F3',
          error: '#4CAF50',
          success: '#FB8C00',
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-router-tab'],
    parallel: true,
    cache: true,
    hardSource: true,
  },
  loaders: {
    css: {
        module: true,
    },
  },
  toast: {
    position: 'top-center',
    duration: 3000,
    className: 'toast',
    icon: 'check_circle',
    action: {
      text: ' X ',
      onclick: (e, toastObject) => {
        toastObject.goAway(0)
      },
    },
  },
  register: [
    {
      options: {
        name: 'custom toast',
      },
    },
  ],

}
