import Vue from 'vue'

import Vuex from 'vuex'
import VueRouter from 'vue-router'


Vue.use(Vuex)
Vue.use(VueRouter)

import App from './App.vue'

import router from './router'

// Vuex Store
import store from './store/store'


Vue.config.productionTip = false

Vue.prototype.$apiHostname = (Vue.config.productionTip) ? 'https://liveHostname:port' : 'http://localhost:2000'


// const Foo = { template: '<div>foo</div>' }
// const Bar = { template: '<div>bar</div>' }
// const HelloWorld = require('./components/HelloWorld')


/*const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
  { path: '/hello', component: HelloWorld },
]

const router = new VueRouter({
  routes // short for `routes: routes`
})*/


/*global.jQuery = require('jquery')
//require('jquery-ui')
var $ = global.jQuery
window.$ = $*/


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
