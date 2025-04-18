import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5f639c0a = () => interopDefault(import('..\\src\\pages\\addpopup.vue' /* webpackChunkName: "pages/addpopup" */))
const _169db94a = () => interopDefault(import('..\\src\\pages\\cog.vue' /* webpackChunkName: "pages/cog" */))
const _4078e619 = () => interopDefault(import('..\\src\\pages\\fommater.vue' /* webpackChunkName: "pages/fommater" */))
const _277ad849 = () => interopDefault(import('..\\src\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _adf6d712 = () => interopDefault(import('..\\src\\pages\\recent\\index.vue' /* webpackChunkName: "pages/recent/index" */))
const _08524a78 = () => interopDefault(import('..\\src\\pages\\search.vue' /* webpackChunkName: "pages/search" */))
const _24826b15 = () => interopDefault(import('..\\src\\pages\\siege\\index.vue' /* webpackChunkName: "pages/siege/index" */))
const _2b2067c0 = () => interopDefault(import('..\\src\\pages\\json\\json.vue' /* webpackChunkName: "pages/json/json" */))
const _5dd33532 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _31a3409f = () => interopDefault(import('..\\src\\pages\\detail\\_detail.vue' /* webpackChunkName: "pages/detail/_detail" */))

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
    component: _5f639c0a,
    name: "addpopup"
  }, {
    path: "/cog",
    component: _169db94a,
    name: "cog"
  }, {
    path: "/fommater",
    component: _4078e619,
    name: "fommater"
  }, {
    path: "/login",
    component: _277ad849,
    name: "login"
  }, {
    path: "/recent",
    component: _adf6d712,
    name: "recent"
  }, {
    path: "/search",
    component: _08524a78,
    name: "search"
  }, {
    path: "/siege",
    component: _24826b15,
    name: "siege"
  }, {
    path: "/json/json",
    component: _2b2067c0,
    name: "json-json"
  }, {
    path: "/",
    component: _5dd33532,
    name: "index"
  }, {
    path: "/detail/:detail?",
    component: _31a3409f,
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
