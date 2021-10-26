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
      <form @submit.prevent="submitForm">
        <h1 class="h3 mb-3 fw-normal">{{ $t('forgot_password') }}</h1>
        <div class="form-floating">
          <p style="color: red" v-show="showError">{{ $t('please_enter_correct_username_or_password') }}</p>
        </div>
        <div v-if="formSubmitted == 'PROCESSED'" class="bg-success text-light p-3">
          {{ $t('forgot_password_link_sent', { email: email }) }}
        </div>
        <div v-if="formSubmitted == 'USER_NOT_FOUND'" class="bg-danger text-light p-3 mb-3">
          {{ $t('user_not_found', { email, email }) }}
        </div>
        <div v-if="formSubmitted == 'ERROR'" class="bg-danger text-light p-3 mb-3">
          {{ $t('server_error_occurred_please_contact_admin') }}
        </div>
        <div class="form-floating mb-3" v-if="formSubmitted != 'PROCESSED'">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" autofocus autocomplete="new-email" name="new_username_easy123_1" required>
          <label for="floatingInput">{{ $t('email_address') }}</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" v-if="formSubmitted != 'PROCESSED'" type="submit" :disabled="formSubmitted == 'PROCESSING'" :readonly="formSubmitted == 'PROCESSING'">
          <span v-if="formSubmitted != 'PROCESSING'">{{ $t('submit') }}</span>
          <span v-if="formSubmitted == 'PROCESSING'">{{ $t('processing') }}</span>
        </button>

        <p class="mt-4"><router-link to="/">{{ $t('login') }}</router-link> </p>

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
  name: 'ForgotPassword',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Forgot Password',
  },
  data() {
    return {
      email: null,
      showError: false,
      formSubmitted: "NOT_SUBMITTED"
    }
  },
  computed: {
  },
  watch: {
    email() {
      this.formSubmitted = "NOT_SUBMITTED"
    }
  },
  mounted() {

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
    submitForm() {
      var self = this
      self.formSubmitted = "PROCESSING"
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/forgot-password/',{
        email: self.email
      })
          .then((response) => {

            if(response.data.status)
            {
              self.formSubmitted = "PROCESSED"
              //Password reset link sent to your email address please check
            }
            else {
              self.formSubmitted = "USER_NOT_FOUND"
              console.log(response.data)
            }


          }, (error) => {
            self.formSubmitted = "ERROR"
            self.showError = true
            console.log(error);
          })

    }
  }
}
</script>