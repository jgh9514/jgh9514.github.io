import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {"position":"top-center","duration":3000,"className":"toast","icon":"check_circle","action":{"text":" X ","onclick":(e, toastObject) => {
        toastObject.goAway(0);
      }}})

const globals = undefined
if(globals) {
  globals.forEach(global => {
    Vue.toasted.register(global.name, global.message, global.options)
  })
}

export default function (ctx, inject) {
  inject('toast', Vue.toasted)
}
