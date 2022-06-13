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
  <div class="container-fluid">
    <nav class="mt-3" style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page">Create</li>
      </ol>
    </nav>



    <div class="row">
      <div class="col-md-3">
      </div>
      <div class="col-md-6">
        <h4 class="mb-3">Create User</h4>
        <form class="">
          <div class="mb-3">
            <label for="firstname" class="form-label">First Name</label>
            <input type="text" class="form-control" id="firstname">
          </div>
          <div class="mb-3">
            <label for="lastname" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="lastname">
          </div>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password">
          </div>
          <h5>Email IMAP details</h5>
          <div class="mb-3">
            <label for="host" class="form-label">Host</label>
            <input type="text" class="form-control" id="host">
          </div>
          <div class="mb-3">
            <label for="portnumber" class="form-label">Port Number</label>
            <input type="text" class="form-control" id="portnumber">
          </div>
          <div class="mb-3">
            <label for="imap_email" class="form-label">IMAP Email</label>
            <input type="text" class="form-control" id="imap_email">
          </div>
          <div class="mb-3">
            <label for="imap_password" class="form-label">IMAP Password</label>
            <input type="text" class="form-control" id="imap_password">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
      </div>
      <div class="col-md-3"></div>
    </div>


  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
</style>

<script>
const axios = require('axios')
export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Easy123 Assistant - Create User',
  },
  data() {
    return {
      users: []
    }
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      var self = this

      //let appActiveUser = this.$store.state.AppActiveUser
      //console.log('AppActiveUser', appActiveUser)

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/get-users/',{})
          .then((response) => {
            self.users = response.data.data
            if(!self.users.length)
            {
              //self.$router.push('/assistant/create-user')
              return
            }
            //console.log(self.users)
          }, (error) => {
            console.log(error)
          })
    }
  }
}
</script>