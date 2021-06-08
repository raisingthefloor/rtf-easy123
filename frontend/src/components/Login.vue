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
      <a :href="newUserURL">New User</a>
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
      showError: false,
      newUserURLLoaded: false,
      newUserURL: null
    }
  },
  computed: {
  },
  mounted() {
    //console.log("env file", this.$apiHostname)
    this.checkLogin()
  },
  methods: {
    checkLogin() {
      var self = this
      if (localStorage.getItem("user") !== null) {
        this.$router.push({'name': 'HomeWorking'})
      }

      //load registration URL
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/connect/',{
      })
      .then((response) => {
        if(response.data.status)
        {
          self.newUserURLLoaded = true
          self.newUserURL = response.data.data.url
          console.log("newUserURL", self.newUserURL)
        }
        console.log(response.data)
      }, (error) => {
        console.log(error);
      })

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

    }
  }
}
</script>