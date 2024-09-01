import path from 'path';

export default {
  srcDir: 'src/',
  ssr: false,
  target: 'server',
  head: {
    titleTemplate: process.env.npm_package_name,
    title: process.env.npm_package_name,
    meta: [
      { 'http-equiv': 'X-UA-Compatible', content: 'IE-11' },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_name || '' },
    ],
    script: [],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { ref: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
    ]
  },

  css: [
    '~/assets/css/design.css',
    '~/assets/css/vuetify.css',
  ],

  plugins: [
    '~/plugins/axios',
    '~/plugins/routerTab',
  ],

  loading: '~/components/LoadingBar.vue',
  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
  ],
  axios: {
    proxyHeaders: false,
    credentials: false,
    withCredentials: true,
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://jgh9514.com',
  },
  proxy: {},
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

  vuetify: {
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

  build: {
    transpile: ['vue-router-tab'],
    parallel: true,
    cache: true,
    hardSource: true,
    extend(config, ctx) {
      config.resolve.alias['@'] = path.resolve(__dirname, 'src');
      config.resolve.alias['@components'] = path.resolve(__dirname, 'src/components');
      config.resolve.alias['@pages'] = path.resolve(__dirname, 'src/pages');
      config.resolve.alias['@assets'] = path.resolve(__dirname, 'src/assets');

      config.module.rules.forEach(rule => {
        if (rule.test && /\.(png|jpe?g|gif|svg|webp)$/.test(rule.test.toString())) {
          // 기존 로더 설정이 있다면 덮어씁니다.
          rule.use = [
            {
              loader: 'url-loader',
              options: {
                limit: 1000, // 1KB 이하의 파일은 base64로 인라인 처리
                name: 'img/[name].[contenthash:7].[ext]', // 이미지 파일에 해시 적용
                esModule: false, // esModule 옵션을 false로 설정하여 이미지 경로가 제대로 로드되도록 합니다.
              }
            }
          ];
        }
      });
    }
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
