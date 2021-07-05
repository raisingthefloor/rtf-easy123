import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import * as Sentry from "@sentry/vue"
import { Integrations } from "@sentry/tracing"
import axios from 'axios'

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
  beforeCreate()
  {
    this.$store.commit('INITIALISE_STORE')
    this.$store.commit('SET_INITIAL_LAYOUT')

    let self = this

    //request interceptors
    axios.interceptors.request.use(async config => {
      if(store.state.AppActiveUser.token != null || store.state.AppActiveUser.token == "")
      {
        config.headers.authorization = 'Bearer ' + store.state.AppActiveUser.token
        return config
      }
      else
      {
        return config
      }
    })

    //response interceptors
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do nothing here
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // if its 401 which is Authorization token error redirect to login page
      if (error.response && error.response.status == 401)
      {
        self.$store.commit('LOGOUT_USER', router)
        self.$store.commit('SET_INITIAL_LAYOUT')
      }

      return Promise.reject(error)
    });
  },
  render: h => h(App),
}).$mount('#app')
