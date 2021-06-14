import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'


Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMeta)

import App from './App.vue'

import router from './router'

// Vuex Store
import store from './store/store'


Vue.config.productionTip = false

//Vue.prototype.$apiHostname = (Vue.config.productionTip) ? 'https://liveHostname:port' : 'https://localhost:2000'


/*global.jQuery = require('jquery')
//require('jquery-ui')
var $ = global.jQuery
window.$ = $*/


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
