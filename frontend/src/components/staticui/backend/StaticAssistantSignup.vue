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

        <h1 class="h3 mb-3 fw-normal">Register</h1>
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
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingFirstName" placeholder="First Name" v-model="first_name" autofocus required>
          <label for="floatingFirstName">First Name</label>
        </div>
        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingLastName" placeholder="Last Name" v-model="last_name" autofocus required>
          <label for="floatingLastName">Last Name</label>
        </div>

        <div class="form-floating mb-3">
          <input type="text" class="form-control" id="floatingName" placeholder="Group Name" v-model="group_name" autofocus required>
          <label for="floatingName">Group Name</label>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" required>
          <label for="floatingInput">{{ $t('email_address') }}</label>
        </div>


        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password" min="8" max="15" required>
          <label for="floatingPassword">{{ $t('password') }}</label>
        </div>
        <p class="text-muted text-start"><small style="font-size: 1rem;">{{
            $t('password_help')
          }}</small></p>

        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="registerSubmitClicked" :readonly="registerSubmitClicked">
          <span v-if="!registerSubmitClicked">{{ $t('submit') }}</span>
          <span v-if="registerSubmitClicked">{{ $t('processing') }}</span>
        </button>

        <p class="mt-4">{{ $t('already_a_user') }} <a href="javascript:void(0)">Login</a>  </p>
<!--        <router-link to="/">{{ $t('login') }}</router-link>-->
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
      email: null,
      first_name: null,
      last_name: null,
      group_name: null,
      password: null,
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
      if(!this.email || !this.first_name || !this.last_name || !this.group_name || !this.password || this.password.length < 8)
      {
        this.registerSubmitClicked = false
        this.showError = true
        return
      }
      this.showError = false

      swal({
        title: self.getTranslation('congratulations'),
        text: self.getTranslation('register_success_message'),
        icon: "success",
        button: self.getTranslation('continue'),
        closeOnClickOutside: false,
        closeOnEsc: false
      }).then((swalResponse) => {
        console.log("success",swalResponse)
        if(swalResponse)
        {
          this.$router.push('/static/assistant/create-user')
        }
      })

    },
    redirectToLogin() {
      this.$router.push({'name': 'Login'})
    }
  }
}
</script>