<template>
  <div class="text-center" style="height: 100%; display: flex; align-items: center; padding-top: 40px; padding-bottom: 40px; background-color: rgb(245, 245, 245);">
    <main class="form-signin" style="max-width: 400px;">
      <form @submit.prevent="submitForm">
        <h1 class="h3 mb-3 fw-normal">Login</h1>
        <div class="form-floating" v-show="showResendVerificationLink">
          <div class="alert alert-danger" role="alert" v-show="!sentVerificationEmail">
            <p>
              Please verify your email to continue. <br>
              It may take upto 1 minute to receive the email. <br> <br>
              <a href="javascript:void(0)" @click="resendVerificationLink" class="btn btn-sm btn-primary" v-if="!sendingVerificationEmail">Resend Verification Email</a>
              <a href="javascript:void(0)" disabled="true" class="btn btn-sm btn-primary" v-if="sendingVerificationEmail">Sending Verification Email...</a>
            </p>
          </div>

          <div class="alert alert-success" role="alert" v-show="sentVerificationEmail">
            <p>Verification email sent to {{ verificationLinkMail }}. <br></p>
          </div>

        </div>
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

        <p class="mt-4">Not a user? <router-link to="/register">Register</router-link> </p>


      </form>
    </main>


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
<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>
<script>
const axios = require('axios')

export default {
  name: 'Login',
  data() {
    return {
      password: null,
      email: null,
      showError: false,
      showResendVerificationLink: false,
      verificationLinkMail: null,
      sentVerificationEmail: false,
      sendingVerificationEmail: false
    }
  },
  computed: {
  },
  mounted() {
    this.checkLogin()

    //apply body styles
    document.querySelector('body').style.height = '100%'
    document.querySelector('body').style.alignItems = 'center'
    document.querySelector('body').style.paddingTop = '40px'
    document.querySelector('body').style.paddingBottom = '40px'
    document.querySelector('body').style.backgroundColor = '#f5f5f5'
    document.querySelector('body').style.overflowY = 'initial'
  },
  beforeDestroy() {
    document.querySelector('body').style.height = '100%'
    document.querySelector('body').style.alignItems = 'initial'
    document.querySelector('body').style.paddingTop = '0px'
    document.querySelector('body').style.paddingBottom = '0px'
    document.querySelector('body').style.backgroundColor = '#fff'
    document.querySelector('body').style.overflowY = 'hidden'
  },
  methods: {
    checkLogin() {
      var self = this
      let user = this.$store.state.AppActiveUser
      if (user.token)
      {
        if(user.role == "admin")
        {
          self.$router.push({ 'name': 'Admin' })
          self.$store.commit('SET_LAYOUT', 'admin-layout')
        }
        else
        {
          self.$router.push({ 'name': 'HomeWorking' })
          self.$store.commit('SET_LAYOUT', 'simple-layout')
        }
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
        if(response.data.status)
        {
          self.$store.commit('UPDATE_USER', response.data.data)

          if(response.data.data.role == "admin")
          {
            self.$store.commit('SET_LAYOUT', 'admin-layout')
            self.$router.push({ 'name': 'Admin' })
          }
          else {
            self.$store.commit('SET_LAYOUT', 'simple-layout')
            self.$router.push({ 'name': 'HomeWorking' })
          }

        }
        else {
          if(response.data.message == "NOT_VERIFIED")
          {
            self.showResendVerificationLink = true
            self.verificationLinkMail = response.data.data.email
          }
          else
          {
            console.log("do nothing")
          }

        }

      }, (error) => {
        console.log(error);
      })

    },
    resendVerificationLink() {
      var self = this
      if(!self.verificationLinkMail)
      {
        return
      }



      self.sendingVerificationEmail = true

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/resend-verification-mail/',{
        email: self.verificationLinkMail
      })
          .then((response) => {
            self.sendingVerificationEmail = false
            if (response.data.status)
            {
              self.sentVerificationEmail = true
            }
          }, (error) => {
            self.sendingVerificationEmail = false
            self.$toasted.show("Failed to send verification email", {
              theme: "toasted-primary",
              position: "top-right",
              duration : 5000,
              type: "error"
            })
            console.log(error)
          })


    }
  }
}
</script>