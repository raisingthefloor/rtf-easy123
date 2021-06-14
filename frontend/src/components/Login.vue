<template>
  <div class="text-center" style="height: 100%; display: flex; align-items: center; padding-top: 40px; padding-bottom: 40px; background-color: rgb(245, 245, 245);">
    <main class="form-signin">
      <form @submit.prevent="submitForm">

        <h1 class="h3 mb-3 fw-normal">Login</h1>
        <div class="form-floating">
          <p style="color: red" v-show="showError">Please enter correct username or password</p>
        </div>
        <div class="form-floating">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" autofocus>
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
          <label for="floatingPassword">Password</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>

        <p class="mt-4">Not a user? <a :href="newUserURL">Register</a></p>

      </form>
    </main>
<!--    <div style="text-align: center">
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
    </div>-->

  </div>
</template>
<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}
</style>
<style scoped src="../assets/bootstrap.min.css">

</style>
<script>
const axios = require('axios')
//import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min.js'

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

    //apply body styles
    document.querySelector('body').style.height = '100%'
    document.querySelector('body').style.alignItems = 'center'
    document.querySelector('body').style.paddingTop = '40px'
    document.querySelector('body').style.paddingBottom = '40px'
    document.querySelector('body').style.backgroundColor = '#f5f5f5'
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
        }
        //console.log(response.data)
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