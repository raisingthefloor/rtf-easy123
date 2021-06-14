import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import * as Sentry from "@sentry/vue"
import { Integrations } from "@sentry/tracing"

Sentry.init({
  Vue,
  dsn: "https://3b3b75713a3a4b5897450eaf04ace755@o464399.ingest.sentry.io/5806034",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})


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
