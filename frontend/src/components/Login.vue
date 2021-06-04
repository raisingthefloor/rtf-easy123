<template>
  <div>
    <div style="text-align: center">
      <h3 style="text-align: center;">Login</h3>
      <form @submit.prevent="submitForm">
        <p style="color: red" v-show="showError">Please enter correct username or password</p>
        <div>
          <input type="email" v-model="email" placeholder="Email">
        </div>
        <div>
          <input type="password" v-model="password" placeholder="Password">
        </div>
        <div>
          <input type="submit">
        </div>

      </form>
      <a :href="getNewUserURL">New User</a>
    </div>

  </div>
</template>
<script>
const axios = require('axios')
export default {
  name: 'Login',
  data() {
    return {
      password: null,
      email: null,
      showError: false
    }
  },
  computed: {
    getNewUserURL() {
      return process.env.VUE_APP_API_HOST_NAME + "/connect"
    }
  },
  mounted() {
    //console.log("env file", this.$apiHostname)
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      if (localStorage.getItem("user") !== null) {
        this.$router.push({'name': 'HomeWorking'})
      }
    },
    submitForm() {
      var self = this
      if(!this.email || !this.password)
      {
        this.showError = true
        return
      }

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/login/',{
        email: self.email,
        password: self.password
      })
      .then((response) => {
        let users = response.data
        if(!users.length )
        {
          self.showError = true
        }
        else {
          self.showError = false
          let user = users[0]
          localStorage.setItem("user", JSON.stringify(user))
          self.$router.push({ 'name': 'HomeWorking' })
        }
        console.log(response.data)
      }, (error) => {
        console.log(error);
      })



      /*if(this.password == "Plenar@Easy123")
      {
        this.showError = false

        if (typeof(Storage) !== "undefined") {
          // Code for localStorage/sessionStorage.
          console.log("support session storage")
        } else {
          console.log("not support session storage")
          // Display an error message showing that the browser doesn't support web storage
        }

        //this.$router.push({ name: 'SelectAccount' })
      }*/
    }
  }
}
</script>