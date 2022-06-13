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
  <div>
    <main class="form-signin text-center" style="max-width: 400px;">
      <h2>{{ $t('easy123') }}</h2>
      <h3 v-show="!is_request_processed">{{ $t('verifying_email') }}</h3>
      <div class="alert alert-success" role="alert" v-show="is_request_processed && request_success">
        <h4 class="alert-heading">{{ $t('well_done') }}</h4>
        <p>{{ $t('your_email_is_verified') }} <br><a class="alert-link" @click="redirectToLogin" href="javascript:void(0)">{{ $t('click_here') }}</a>
          {{ $t('to_login') }}</p>
      </div>
      <div class="alert alert-danger" role="alert" v-show="is_request_processed && request_fail">
        <h4 class="alert-heading">Oops!</h4>
        <p>{{ $t('login_to_resent_verification_link') }} <br><br><a @click="redirectToLogin" href="javascript:void(0)" class="btn btn-primary">{{ $t('login') }}</a></p>
      </div>
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
  name: 'VerifyEmail',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Verify Email - Easy123',
  },
  data() {
    return{
      is_request_processed: false,
      request_success: false,
      request_fail: false,
      verificationError: null
    }
  },
  mounted() {
    this.verifyEmail()

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
    verifyEmail() {
      var self = this
      let email = this.$route.params.email
      let token = this.$route.params.token

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/confirmation/',{
        email: email,
        token: token
      })
        .then((response) => {
          if(response.data) {
            self.is_request_processed = true
            if(response.data.status == true)
            {
              self.request_success = true
            }
            else {
              self.request_fail = true
              self.verificationError = response.data.message
            }
          }
        }, (error) => {
          console.log(error)
        })
    },
    redirectToLogin() {
      this.$router.push({'name': 'Login'})
    }
  }
}
</script>