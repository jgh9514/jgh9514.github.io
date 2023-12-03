import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _56801790 = () => interopDefault(import('..\\src\\pages\\addpopup.vue' /* webpackChunkName: "pages/addpopup" */))
const _c535a946 = () => interopDefault(import('..\\src\\pages\\inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _cd0c19c6 = () => interopDefault(import('..\\src\\pages\\json\\json.vue' /* webpackChunkName: "pages/json/json" */))
const _1e21e415 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _3e8a207c = () => interopDefault(import('..\\src\\pages\\detail\\_detail.vue' /* webpackChunkName: "pages/detail/_detail" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/addpopup",
    component: _56801790,
    name: "addpopup"
  }, {
    path: "/inspire",
    component: _c535a946,
    name: "inspire"
  }, {
    path: "/json/json",
    component: _cd0c19c6,
    name: "json-json"
  }, {
    path: "/",
    component: _1e21e415,
    name: "index"
  }, {
    path: "/detail/:detail?",
    component: _3e8a207c,
    name: "detail-detail"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
