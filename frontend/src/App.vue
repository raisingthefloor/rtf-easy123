<template>
  <div id="app">
    <component v-bind:is="layout"></component>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
import SimpleLayout from './layouts/SimpleLayout'
import AdminLayout from './layouts/AdminLayout'

require('@/assets/home-style.css')

export default {
  name: 'App',
  computed: {
    layout () {
      let user = localStorage.getItem("user")
      if (user !== null) {
        user = JSON.parse(user)
        if (user.role == "admin") {
          return 'admin-layout'
        } else {
          return this.$store.getters.layout
        }
      }
      else {
        return this.$store.getters.layout
      }

    }
  },
  components: {
    'simple-layout': SimpleLayout,
    'admin-layout': AdminLayout
    // define as many layouts you want for the application
  }
}
</script>

<style>
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
