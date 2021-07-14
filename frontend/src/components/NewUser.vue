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
      <form @submit.prevent="formSubmit" v-show="!is_form_submitted">

        <h1 class="h3 mb-3 fw-normal">New User</h1>
        <div class="form-floating">
          <p v-show="showError" style="color: red; font-size: 12px;">
            Please fill all details correctly <br>
            <b>Name</b> should be a string <br>
            <b>Password</b> should be a string of 8 char long
          </p>
        </div>
        <div class="form-floating mb-3">
          <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" v-model="email" readonly="readonly" disabled="disabled">
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input type="text" class="form-control" id="floatingName" placeholder="Name" v-model="name" autofocus>
          <label for="floatingName">Name</label>
        </div>
        <p class="text-muted text-start"><small style="font-size: 1rem;">Enter your full name</small></p>
        <div class="form-floating">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password" min="8" max="15" required>
          <label for="floatingPassword">Password</label>
        </div>
        <p class="text-muted text-start"><small style="font-size: 1rem;">Create new password for Easy123 System</small></p>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Submit</button>

      </form>

      <div class="alert alert-success" role="alert" v-show="is_form_submitted">
        <h4 class="alert-heading">Well done!</h4>
        <p>You are now registered to Easy123. <a class="alert-link" @click="redirectToLogin" href="javascript:void(0)">Click here</a> to login</p>
      </div>
    </main>
<!--    <div style="text-align: center;
    padding: 5rem;
    margin: auto;">
      <h4>New User</h4>
      <form @submit.prevent="formSubmit">
        <p v-show="showError" style="color: red; font-size: 12px;">
          Please fill all details correctly <br>
          <b>Name</b> should be a string <br>
          <b>Password</b> should be a string of 8 char long
        </p>
        <div>
          <input type="text" name="email" v-model="email" readonly="readonly" disabled="disabled">
        </div>
        <div>
          <input type="text" name="name" v-model="name" placeholder="Name" required>
        </div>
        <div>
          <input type="password" name="password" v-model="password" placeholder="Password" min="8" max="15" required>
        </div>
        <div>
          <input type="submit">
        </div>
      </form>
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

export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'New',
  },
  data() {
    return{
      id: null,
      email: null,
      name: null,
      password: null,
      user: {},
      showError: false,
      is_form_submitted: false
    }
  },
  mounted() {
    this.getUser()

    //apply body styles
    document.querySelector('body').style.height = '100%'
    document.querySelector('body').style.alignItems = 'center'
    document.querySelector('body').style.paddingTop = '40px'
    document.querySelector('body').style.paddingBottom = '40px'
    document.querySelector('body').style.backgroundColor = '#f5f5f5'
  },
  methods: {
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
      if(!this.id || !this.name || !this.password || this.password.length < 8)
      {
        this.showError = true
        return
      }

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/save-new-user/',{
        id: self.id,
        email: self.email,
        password: self.password,
        name: self.name
      })
      .then((response) => {
        if(response.data && response.data.ok)
        {
          self.is_form_submitted = true
          //self.$router.push({'name': 'HomeWorking'})
        }
      }, (error) => {
        console.log(error);
      })


    },
    redirectToLogin() {
      this.$router.push({'name': 'Login'})
    }
  }
}
</script>