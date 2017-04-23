import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import './bootwatch/css/bootstrap.css'
import './bootwatch/css/font-awesome.css'

import 'bootstrap/dist/js/bootstrap.js'

import App from './App'
import routes from './routes'

import vModel from './modules/model.vue'

Vue.component('v-model', vModel)

Vue.use(Electron)
Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)

Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
