import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _69266c01 = () => interopDefault(import('..\\src\\pages\\addpopup.vue' /* webpackChunkName: "pages/addpopup" */))
const _745e4c03 = () => interopDefault(import('..\\src\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _4b04a39e = () => interopDefault(import('..\\src\\pages\\recent\\index.vue' /* webpackChunkName: "pages/recent/index" */))
const _a3bcc6b4 = () => interopDefault(import('..\\src\\pages\\json\\json.vue' /* webpackChunkName: "pages/json/json" */))
const _aa92ae28 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _2d86584e = () => interopDefault(import('..\\src\\pages\\detail\\_detail.vue' /* webpackChunkName: "pages/detail/_detail" */))

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
    component: _69266c01,
    name: "addpopup"
  }, {
    path: "/login",
    component: _745e4c03,
    name: "login"
  }, {
    path: "/recent",
    component: _4b04a39e,
    name: "recent"
  }, {
    path: "/json/json",
    component: _a3bcc6b4,
    name: "json-json"
  }, {
    path: "/",
    component: _aa92ae28,
    name: "index"
  }, {
    path: "/detail/:detail?",
    component: _2d86584e,
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
