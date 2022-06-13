<!--
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
-->
<template>
  <div class="text-center" style="height: 100%; display: flex; align-items: center; padding-top: 40px; padding-bottom: 40px; background-color: rgb(245, 245, 245);">
    <main class="form-signin" style="max-width: 400px;">
      <div v-if="tokenVerified == 'INVALID_TOKEN_OR_EXPIRED'" class="bg-danger text-white p-3">
        {{ $t('invalid_token_or_expired') }}

      </div>
      <div v-if="tokenVerified == 'VERIFYING'">
        <h4>Processing...</h4>
      </div>
      <div v-if="tokenVerified == 'PASSWORD_CHANGED'" class="bg-success text-white p-3 mb-2">
        {{ $t('password_changed_successfully') }}
      </div>
      <form @submit.prevent="submitForm" v-if="tokenVerified == 'SUCCESS'">
        <h1 class="h3 mb-3 fw-normal">{{ $t('reset_password') }}</h1>
        <div v-if="formSubmitted == 'ERROR'" class="bg-danger text-light p-3 mb-3">
          {{ $t('server_error_occurred_please_contact_admin') }}
        </div>
        <div v-if="showError" class="bg-danger text-white p-2 mb-2">
          {{ showError }}
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="password" placeholder="new-password" v-model="password" autofocus autocomplete="new-password" name="new_username_easy123_1" required>
          <label for="password">{{ $t('password') }}</label>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="confirmPassword" placeholder="new-password" v-model="confirmPassword" autofocus autocomplete="new-password" name="new_username_easy123_2" required>
          <label for="confirmPassword">{{ $t('confirm_password') }}</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="formSubmitted == 'PROCESSING'" :readonly="formSubmitted == 'PROCESSING'">
          <span v-if="formSubmitted != 'PROCESSING'">{{ $t('submit') }}</span>
          <span v-if="formSubmitted == 'PROCESSING'">{{ $t('processing') }}</span>
        </button>



      </form>
      <p class="mt-4"><router-link to="/">{{ $t('login') }}</router-link> </p>
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
  name: 'ResetForgotPassword',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Forgot Password',
  },
  data() {
    return {
      tokenVerified: "NOT_VERIFIED",
      user_id: "",
      password: null,
      confirmPassword: null,
      showError: false,
      formSubmitted: "NOT_SUBMITTED"
    }
  },
  computed: {
  },
  mounted() {

    //apply body styles
    document.querySelector('body').style.height = '100%'
    document.querySelector('body').style.alignItems = 'center'
    document.querySelector('body').style.paddingTop = '40px'
    document.querySelector('body').style.paddingBottom = '40px'
    document.querySelector('body').style.backgroundColor = '#f5f5f5'
    document.querySelector('body').style.overflowY = 'initial'

    this.vefifyToken()
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
    vefifyToken() {
      let self = this
      self.tokenVerified = "VERIFYING"
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/check-forgot-password-token", {
        token: self.$route.params.token
      })
      .then(response => {
        //console.log(response.data)
        if(response.data.status)
        {
          self.tokenVerified = "SUCCESS"
        }
        else {
          if(response.data.message == "token_invalid_or_expired")
          {
            self.tokenVerified = "INVALID_TOKEN_OR_EXPIRED"
            return
          }
          self.tokenVerified = "FAILED"
        }
      }, error => {
        self.formSubmitted = "ERROR"
        console.log(error)
      })
    },
    submitForm() {
      var self = this
      //validate
      if(self.password != self.confirmPassword)
      {
        self.showError = self.$t('password_confirm_password_not_match')
        return
      }
      if(self.password.length < 8)
      {
        self.showError = self.$t('password_error')
        return
      }

      self.showError = null
      //return;

      self.formSubmitted = "PROCESSING"
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/reset-forgot-password',{
        token: self.$route.params.token,
        password: self.password
      })
      .then((response) => {
        self.formSubmitted = "PROCESSED"
        if(response.data.status)
        {
          self.tokenVerified = "PASSWORD_CHANGED"
          //self.formSubmitted = "PROCESSED"

          //Password reset link sent to your email address please check
        }
        else {
          if(response.data.message == "token_invalid_or_expired")
          {
            self.tokenVerified = "INVALID_TOKEN_OR_EXPIRED"
            return
          }
          self.formSubmitted = "ERROR"
          //console.log(response.data)
        }


      }, (error) => {
        self.formSubmitted = "ERROR"
        //self.showError = true
        console.log(error);
      })

    }
  }
}
</script>