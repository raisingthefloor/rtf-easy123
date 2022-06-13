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
    <main class="form-signin text-center">
      <form @submit.prevent="formSubmit">

        <h1 class="h3 mb-3 fw-normal">{{ $t('register') }}</h1>
        <div class="form-floating">
          <p v-show="showError" style="color: red; font-size: 15px;">
            <span v-show="!nodeErrorArr.length" v-html="$t('register_client_validation')">
            </span>
            <span v-show="nodeErrorArr.length">
              {{ $t('please_fill_all_details_correctly') }} <br>
              <span v-for="(nodeError, index) in nodeErrorArr" :key="'error'+index">
                {{ nodeError.msg }} <br>
              </span>
            </span>
          </p>
        </div>
        <div class="mb-3" style="text-align: left !important;">
          <label for="account_name">{{ $t('account_name') }}</label>
          <input type="text" class="form-control" id="account_name" :placeholder="$t('account_name_placeholder')" v-model="account_name" autocomplete="new-password" name="new_account_name_easy123_1" autofocus required >
        </div>
        <div class="mb-3" style="text-align: left !important;">
          <label for="account_nickname">{{ $t('account_nickname') }}</label>
          <input type="text" class="form-control" id="account_nickname" :placeholder="$t('account_nickname_placeholder')" v-model="account_nickname" required>
        </div>
        <div style="padding: 15px; border: 1px solid #a9a9a9;" class="mb-3">
          <h6>{{ $t('assistant_details') }}</h6>
          <div class="mb-3" style="text-align: left !important;">
            <label for="name">{{ $t('name') }}</label>
            <input type="text" class="form-control" id="name" :placeholder="$t('enter_your_full_name')" v-model="name" required>
          </div>

          <div class="mb-3" style="text-align: left !important;">
            <label for="email">{{ $t('email_address') }}</label>
            <input type="email" class="form-control" id="email" placeholder="name@example.com" v-model="email" v-bind:class="{ 'is-invalid': email_already_exist }" required autocomplete="new-password" name="email_easy123_register">
          </div>

          <div class="" style="text-align: left !important;">
            <label for="password">{{ $t('password') }}</label>
            <input type="password" class="form-control" id="password" :placeholder="$t('password_placeholder')" v-model="password" min="8" max="15" autocomplete="new-password" name="password_2" required>
          </div>
          <p class="text-muted text-start"><small style="font-size: 1rem;">{{
              $t('password_help')
            }}</small></p>
        </div>


        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="registerSubmitClicked" :readonly="registerSubmitClicked">
          <span v-if="!registerSubmitClicked">{{ $t('submit') }}</span>
          <span v-if="registerSubmitClicked">{{ $t('processing') }}</span>
        </button>

        <p class="mt-4">
          {{ $t('already_a_user') }} <router-link to="/" class="mt-4">{{ $t('login') }}</router-link>
        </p>

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
import swal from 'sweetalert'
const axios = require('axios')


export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Register',
  },
  data() {
    return{
      id: null,
      account_name: null,
      account_nickname: null,

      email: null,
      name: null,
      password: null,

      email_already_exist: false,

      user: {},
      showError: false,
      nodeErrorArr: [],
      registerSubmitClicked: false
    }
  },
  mounted() {
    //this.getUser()

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
    getTranslation(name) {
      return this.$t(name)
    },
    getUser() {
      var self = this
      this.id = this.$route.params.id

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/get-user/',{
        id: self.id
      })
          .then((response) => {
            let user = response.data
            if(!user.length)
              this.$router.push({ name: 'Login' })

            self.user = user[0]
            self.email = self.user.email
          }, (error) => {
            console.log(error);
          })
    },
    formSubmit()
    {
      var self = this
      this.registerSubmitClicked = true
      self.nodeErrorArr = []
      if(!this.email || !this.name || !this.password || this.password.length < 8 || !this.account_name || !this.account_nickname)
      {
        this.registerSubmitClicked = false
        this.showError = true
        return
      }
      this.showError = false

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/register/',{
        account_name: self.account_name,
        account_nickname: self.account_nickname,
        name: self.name,
        email: self.email,
        password: self.password,
        confirmedPassword: self.password,
      })
      .then((response) => {
        self.registerSubmitClicked = false
        //console.log(response)
        if(response.data && response.data.status)
        {
          //self.is_form_submitted = true
          //self.$router.push({'name': 'HomeWorking'})

          swal({
            title: self.getTranslation('congratulations'),
            text: self.getTranslation('register_success_message'),
            icon: "success",
            button: self.getTranslation('continue'),
            closeOnClickOutside: false,
            closeOnEsc: false
          }).then((swalResponse) => {
            self.email_already_exist = false
            if (swalResponse) {

              self.$store.commit('UPDATE_USER', response.data.data)
              if(response.data.data.role == "admin")
              {
                self.$store.commit('SET_LAYOUT', 'admin-layout')
                self.$router.push({ 'name': 'Admin' })
              }
              else if(response.data.data.role == "assistant")
              {
                self.$store.commit('SET_LAYOUT', 'admin-layout')
                self.$router.push({ 'name': 'Assistant' })
              }
              else {
                self.$store.commit('SET_LAYOUT', 'simple-layout')
                self.$router.push({ 'name': 'HomeWorking' })
              }
              //localStorage.setItem("user", JSON.stringify(response.data.data))
              //self.$router.push({ 'name': 'HomeWorking' })
            } else {
              //pressed cancel button
            }
          })
        }
        else
        {
          swal(self.getTranslation('server_error_occurred_please_contact_admin'), {
            icon: "warning",
          })
        }
      }, (error) => {
        self.registerSubmitClicked = false
        if(error && error.response && error.response.status == 422)
        {
          self.nodeErrorArr = error.response.data.data
          if (error.response.data.data[0].param == "email")
          {
            self.email_already_exist = true
          }
          self.showError = true
        }
        else
        {
          console.log(error)
        }
      })

      return

    },
    redirectToLogin() {
      this.$router.push({'name': 'Login'})
    }
  }
}
</script>