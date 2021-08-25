/**
 Copyright 2020 Raising the Floor - International

 Licensed under the New BSD license. You may not use this file except in
 compliance with this License.

 You may obtain a copy of the License at
 https://github.com/GPII/universal/blob/master/LICENSE.txt

 The R&D leading to these results received funding from the:
 * Rehabilitation Services Administration, US Dept. of Education under
 grant H421A150006 (APCP)
 * National Institute on Disability, Independent Living, and
 Rehabilitation Research (NIDILRR)
 * Administration for Independent Living & Dept. of Education under grants
 H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
 * European Union's Seventh Framework Programme (FP7/2007-2013) grant
 agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
 * William and Flora Hewlett Foundation
 * Ontario Ministry of Research and Innovation
 * Canadian Foundation for Innovation
 * Adobe Foundation
 * Consumer Electronics Association Foundation
 **/
import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import * as Sentry from "@sentry/vue"
import { Integrations } from "@sentry/tracing"
import axios from 'axios'
import Toasted from 'vue-toasted'
import VueI18n from 'vue-i18n'
import messages from './lang/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vuelidate from 'vuelidate'

Vue.use(Vuelidate)

library.add([faEye, faEyeSlash])
Vue.component('font-awesome-icon', FontAwesomeIcon)

Sentry.init({
  Vue,
  dsn: "https://3b3b75713a3a4b5897450eaf04ace755@o464399.ingest.sentry.io/5806034",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: process.env.VUE_APP_ENV,
})


Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueMeta)
Vue.use(VueI18n)


export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

Vue.use(Toasted, {
  duration: 5000
})

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
  i18n,
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
