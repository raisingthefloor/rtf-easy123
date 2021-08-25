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
        <li class="breadcrumb-item"> <router-link to="/assistant">Members</router-link> </li>
        <li class="breadcrumb-item active" aria-current="page">Edit Member</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-md-12">
        <h4 class="mb-3">Edit Member </h4>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Profile</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="imapdetails-tab" data-bs-toggle="tab" data-bs-target="#imapdetails" type="button" role="tab" aria-controls="imapdetails" aria-selected="false">IMAP/SMTP details</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="addressbook-tab" data-bs-toggle="tab" data-bs-target="#addressbook" type="button" role="tab" aria-controls="addressbook" aria-selected="false">Address book</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="photos-tab" data-bs-toggle="tab" data-bs-target="#photos" type="button" role="tab" aria-controls="photos" aria-selected="false">Photos</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="easyweb-tab" data-bs-toggle="tab" data-bs-target="#easyweb" type="button" role="tab" aria-controls="easyweb" aria-selected="false">EasyWeb</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <form method="post" @submit.prevent="submitUserProfile()">
              <p class="text-danger mt-3" v-if="profileFormSubmitStatus === 'ERROR'">Please fill the form correctly.</p>
              <div class="mb-3 mt-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" v-bind:class="{ 'is-invalid': $v.name.$error }" id="name" v-model.trim="$v.name.$model">
                <div class="invalid-feedback">
                  <span v-if="!$v.name.required">Name is required.</span>
                  <span v-if="!$v.name.minLength">Name should atlist 3 character long.</span>
                </div>
              </div>
              <div class="mb-3 mt-3">
                <label for="nickname" class="form-label">Nickname</label>
                <input type="text" class="form-control" v-bind:class="{ 'is-invalid': $v.nickname.$error }" id="nickname" v-model.trim="$v.nickname.$model">
                <div class="invalid-feedback">
                  <span v-if="!$v.nickname.required">Nickname is required. </span>
                  <span v-if="!$v.nickname.minLength">Nickname should be minimum 3 character long.</span>
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" v-bind:class="{ 'is-invalid': $v.email.$error }" id="email" v-model.trim="$v.email.$model">
                <div class="invalid-feedback">
                  <span v-if="!$v.email.required">Email is required.</span>
                  <span v-if="!$v.email.email">Please enter a valid email.</span>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div style="position:relative;">
                  <input :type="(show_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.password.$error }" id="password" v-model.trim="$v.password.$model">
                  <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_password_protected=false" v-show="show_password_protected" />
                  <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_password_protected=true" v-show="!show_password_protected" />
                </div>
                <div class="invalid-feedback" v-bind:class="{ 'd-block': $v.password.$error }">
                  <span v-if="!$v.password.required">Password is required.</span>
                  <span v-if="!$v.password.minLength">Password must be 8 characters long.</span>
                </div>
              </div>
              <button type="submit" class="btn btn-primary mb-5" :readonly="profileFormSubmitStatus == 'PROCESSING'" :disabled="profileFormSubmitStatus == 'PROCESSING'">
                <span v-if="profileFormSubmitStatus == 'PROCESSING'">Submitting...</span>
                <span v-if="profileFormSubmitStatus != 'PROCESSING'">Submit</span>
              </button>
            </form>

          </div>
          <div class="tab-pane fade" id="imapdetails" role="tabpanel" aria-labelledby="imapdetails-tab">
            <form @submit.prevent="submitImapSmtpDetails()">
              <div>
                <h6 class="mt-3"><b>Incoming Mail Server (IMAP)</b></h6>
                <div class="mb-3">
                  <label for="imap_username" class="form-label">User Name</label>
                  <input type="text" class="form-control" id="imap_username" v-model.trim="$v.imap_username.$model" v-bind:class="{ 'is-invalid': $v.imap_username.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.imap_username.required">User Name is required.</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="imap_password" class="form-label">Password</label>
                  <div style="position:relative;">
                    <input :type="(show_imap_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.imap_password.$error }" id="imap_password" v-model.trim="$v.imap_password.$model">
                    <div class="invalid-feedback">
                      <span v-if="!$v.imap_password.required">Password is required.</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_imap_password_protected=false" v-show="show_imap_password_protected" />
                    <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_imap_password_protected=true" v-show="!show_imap_password_protected" />
                  </div>

                </div>
                <div class="mb-3">
                  <label for="imap_host" class="form-label">Host</label>
                  <input type="text" class="form-control" id="imap_host" v-model.trim="$v.imap_host.$model" v-bind:class="{ 'is-invalid': $v.imap_host.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.imap_host.required">Host is required.</span>
                  </div>
                </div>
              </div>
              <div>
                <h6 class="mt-4"><b>Outgoing Mail Server (SMTP)</b></h6>
                <div class="mb-3">
                  <label for="smtp_username" class="form-label">User Name</label>
                  <input type="text" class="form-control" id="smtp_username" v-model.trim="$v.smtp_username.$model" v-bind:class="{ 'is-invalid': $v.smtp_username.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.smtp_username.required">User Name is required.</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="smtp_password" class="form-label">Password</label>
                  <div style="position:relative;">
                    <input :type="(show_smtp_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.smtp_password.$error }" id="smtp_password" v-model.trim="$v.smtp_password.$model">
                    <div class="invalid-feedback">
                      <span v-if="!$v.smtp_password.required">Password is required.</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_smtp_password_protected=false" v-show="show_smtp_password_protected" />
                    <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_smtp_password_protected=true" v-show="!show_smtp_password_protected" />
                  </div>
                </div>
                <div class="mb-3">
                  <label for="smtp_host" class="form-label">Host</label>
                  <input type="text" class="form-control" id="smtp_host" v-model.trim="$v.smtp_host.$model" v-bind:class="{ 'is-invalid': $v.smtp_host.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.smtp_host.required">Host is required.</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="smtp_port" class="form-label">Port</label>
                  <input type="text" class="form-control" id="smtp_port" v-model.trim="$v.smtp_port.$model" v-bind:class="{ 'is-invalid': $v.smtp_port.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.smtp_port.required">Port is required.</span>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary mb-5" :readonly="imapSmtpFormSubmitStatus == 'PROCESSING'" :disabled="imapSmtpFormSubmitStatus == 'PROCESSING'">
                <span v-if="imapSmtpFormSubmitStatus == 'PROCESSING'">Submitting...</span>
                <span v-if="imapSmtpFormSubmitStatus != 'PROCESSING'">Submit</span>
              </button>
            </form>



          </div>
          <div class="tab-pane fade" id="addressbook" role="tabpanel" aria-labelledby="addressbook-tab">
            <AddressBook class="mt-3"></AddressBook>
          </div>
          <div class="tab-pane fade" id="photos" role="tabpanel" aria-labelledby="photos-tab">
            <Photos></Photos>
          </div>
          <div class="tab-pane fade" id="easyweb" role="tabpanel" aria-labelledby="easyweb-tab">
            <EasyWeb></EasyWeb>
          </div>
        </div>

      </div>
    </div>

  </div>


</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<script>
import AddressBook from './components/AddressBook'
import Photos from './components/Photos'
import EasyWeb from './components/EasyWeb'
import swal from 'sweetalert';
const axios = require('axios')
import { required, minLength, email, requiredIf } from 'vuelidate/lib/validators'

export default {
  name: 'NewUser',
  components: {
    AddressBook: AddressBook,
    Photos: Photos,
    EasyWeb: EasyWeb
  },
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Easy123 Assistant - Create User',
  },
  data() {
    return {
      users: [],
      item: {
        name: null,
        nickname: null,
        email: null,
        password: null,
        imapUsername: null,
        imapPassword: null,
        imapHost: null,
        smtpUsername: null,
        smtpPassword: null,
        smtpHost: null,
        smtpPortNumber: null
      },
      name: null,
      nickname: null,
      email: null,
      password: null,
      passwordIsSet: false,
      profileFormSubmitStatus: 'NOT_SUBMITTED',
      show_password_protected: true,

      show_imap_password_protected: true,
      show_smtp_password_protected: true,
      imap_username: null,
      imap_password: null,
      imap_host: null,
      smtp_username: null,
      smtp_password: null,
      smtp_host: null,
      smtp_port: null,
      imapSmtpFormSubmitStatus: 'NOT_SUBMITTED'
    }
  },
  validations: {

    name: {
      required,
      minLength: minLength(3)
    },
    nickname: {
      required,
          minLength: minLength(3)
    },
    email: {
      required,
          email,
          isUnique(value) {
        let self = this
        // standalone validator ideally should not assume a field is required
        if (value === '') return true

        // simulate async call, fail for all logins with even length
        return new Promise((resolve, reject) => {
          axios.get(process.env.VUE_APP_API_HOST_NAME+'/api/check-email-exists', {
            params: {
              id: self.$route.params.id,
              email: self.email
            }
          })
              .then((response) => {
                if(response.data.message != "user_exists")
                {
                  resolve(true)
                }
                else
                {
                  resolve(false)
                }
              })
              .catch(() => {
                reject("false")
              })
        })
      }
    },
    password: {
      required: requiredIf(function(){
        return !this.passwordIsSet
      }),
      minLength: minLength(8)
    },
    imap_username: {
      required
    },
    imap_password: {
      required
    },
    imap_host: {
      required
    },
    smtp_username: {
      required
    },
    smtp_password: {
      required
    },
    smtp_host: {
      required
    },
    smtp_port: {
      required
    }
  },
  watch: {
  },
  mounted() {
    this.getUserDetails()
  },
  methods: {
    getUserDetails() {
      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/user/detail/',{
        id: self.$route.params.id
      })
      .then((response) => {
        self.item = response.data.data
        self.name = response.data.data.name
        self.email = response.data.data.email
        self.nickname = response.data.data.nickname
        self.imap_username =  response.data.data.imapUsername
        self.imap_password =  response.data.data.imapPassword
        self.imap_host =  response.data.data.imapHost
        self.smtp_username =  response.data.data.smtpUsername
        self.smtp_password =  response.data.data.smtpPassword
        self.smtp_host =  response.data.data.smtpHost
        self.smtp_port =  response.data.data.smtpPortNumber

        if(response.data.data.password)
        {
          self.passwordIsSet = true
        }

        //console.log("data", response.data)
        //self.users = response.data.data
      }, (error) => {
        console.log(error)
      })
    },
    /** submit user profile **/
    submitUserProfile() {
      let self = this
      this.$v.name.$touch()
      this.$v.nickname.$touch()
      this.$v.email.$touch()
      this.$v.password.$touch()
      if (this.$v.name.$invalid || this.$v.nickname.$invalid || this.$v.email.$invalid || this.$v.password.$invalid)
      {
        self.profileFormSubmitStatus = 'ERROR'
      }
      else
      {
        //submit details
        self.profileFormSubmitStatus = 'PROCESSING'
        axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/member/save-profile', {
          id: self.$route.params.id,
          name: self.name,
          email: self.email,
          nickname: self.nickname,
          password: self.password
        })
        .then((response) => {
          self.profileFormSubmitStatus = "PROCESSING_SUCCESS"
          self.password = null
          self.item = response.data.data
          if(self.item.password)
          {
            self.passwordIsSet = true
          }

          swal("Success", "Profile details submitted.", "success");

        }, (error) => {
          self.profileFormSubmitStatus = "ERROR"
          console.log(error)
        })
      }

    },
    /** submit IMAP/SMTP details **/
    submitImapSmtpDetails() {
      let self = this
      this.$v.imap_username.$touch()
      this.$v.imap_password.$touch()
      this.$v.imap_host.$touch()
      this.$v.smtp_username.$touch()
      this.$v.smtp_password.$touch()
      this.$v.smtp_host.$touch()
      this.$v.smtp_port.$touch()

      if (this.$v.imap_username.$invalid || this.$v.imap_password.$invalid || this.$v.imap_host.$invalid || this.$v.smtp_username.$invalid || this.$v.smtp_password.$invalid || this.$v.smtp_host.$invalid || this.$v.smtp_port.$invalid)
      {
        self.imapSmtpFormSubmitStatus = 'ERROR'
      }
      else
      {
        //submit details
        self.imapSmtpFormSubmitStatus = 'PROCESSING'

        axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/member/save-imapsmtp-details', {
          id: self.$route.params.id,
          imap_username: self.imap_username,
          imap_password: self.imap_password,
          imap_host: self.imap_host,
          smtp_username: self.smtp_username,
          smtp_password: self.smtp_password,
          smtp_host: self.smtp_host,
          smtp_port: self.smtp_port

        })
        .then((response) => {
          self.imapSmtpFormSubmitStatus = "PROCESSING_SUCCESS"
          self.item = response.data.data

          swal("Success", "IMAP & SMTP details saved.", "success");

        }, (error) => {
          self.imapSmtpFormSubmitStatus = "ERROR"
          console.log(error)
        })
      }

      console.log("submitImapSmtpDetails")
    },
    async deleteUserAlert(id) {
      //console.log(id)
      let willDelete = await swal({
        title: "Are you sure, you want to delete?",
        text: "Once deleted, you will not be able to recover!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      })

      if (willDelete) {
        this.users = this.users.filter(user => user.id != id)
        this.deleteUser(id)
      } else {
        //pressed cancel button
      }
    },
    deleteUser(id) {
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/admin/delete-user/',{
        id: id
      })
          .then(() => {
            //self.users = response.data.data
          }, (error) => {
            console.log(error)
          })
    }
  }
}
</script>