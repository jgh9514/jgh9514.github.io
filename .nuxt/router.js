import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5f639c0a = () => interopDefault(import('..\\src\\pages\\addpopup.vue' /* webpackChunkName: "pages/addpopup" */))
const _93f2ad8c = () => interopDefault(import('..\\src\\pages\\inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _05bb9af2 = () => interopDefault(import('..\\src\\pages\\detail\\detail.vue' /* webpackChunkName: "pages/detail/detail" */))
const _5dd33532 = () => interopDefault(import('..\\src\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    path: "/inspire",
    component: _93f2ad8c,
    name: "inspire"
  }, {
    path: "/detail/detail",
    component: _05bb9af2,
    name: "detail-detail"
  }, {
    path: "/",
    component: _5dd33532,
    name: "index"
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
