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
    <nav class="mt-3" style="--bs-breadcrumb-divider: '>'; position: relative;" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"> <router-link to="/assistant">{{ $t('assistant_module.members') }}</router-link> </li>
        <li class="breadcrumb-item active" aria-current="page">{{ $t('assistant_module.edit_member') }}</li>
      </ol>
      <router-link to="/assistant" class="btn btn-secondary btn-sm" style="position: absolute; right: 0px; top: 0px;">{{ $t('assistant_module.go_back_members_list') }}</router-link>
    </nav>

    <div class="row">
      <div class="col-md-12">
        <h4 class="mb-3">{{ $t('edit') }} <span style="font-size: 0.9rem;">{{ $t('assistant_module.accounts_name', { nickname: nickname}) }}</span></h4>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">{{ $t('assistant_module.user_profile') }} <font-awesome-icon :icon="['fas', 'exclamation-circle']" style="color: red" v-if="!email || !passwordIsSet" /></button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="imapdetails-tab" data-bs-toggle="tab" data-bs-target="#imapdetails" type="button" role="tab" aria-controls="imapdetails" aria-selected="false">{{ $t('assistant_module.imap_smtp_details') }}</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="addressbook-tab" data-bs-toggle="tab" data-bs-target="#addressbook" type="button" role="tab" aria-controls="addressbook" aria-selected="false">{{ $t('assistant_module.address_book') }}</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="photos-tab" data-bs-toggle="tab" data-bs-target="#photos" type="button" role="tab" aria-controls="photos" aria-selected="false">
              {{ $t('assistant_module.photos') }}</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="easyweb-tab" data-bs-toggle="tab" data-bs-target="#easyweb" type="button" role="tab" aria-controls="easyweb" aria-selected="false">
              {{ $t('assistant_module.easyweb') }}</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="easyweb-tab" data-bs-toggle="tab" data-bs-target="#generalsettings" type="button" role="tab" aria-controls="generalsettings" aria-selected="false">{{ $t('assistant_module.general_settings') }}</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <form method="post" @submit.prevent="submitUserProfile()">
              <p class="text-danger mt-3" v-if="profileFormSubmitStatus === 'ERROR'">{{ $t('validation.please_fill_form_correctly') }}</p>
              <div class="mb-3 mt-3">
                <label for="name" class="form-label">{{ $t('assistant_module.name') }}</label>
                <input type="text" class="form-control" v-bind:class="{ 'is-invalid': $v.name.$error }" id="name" v-model.trim="$v.name.$model">
                <div class="invalid-feedback">
                  <span v-if="!$v.name.required">{{ $t('validation.name_is_required') }}</span>
                  <span v-if="!$v.name.minLength">{{ $t('validation.name_should_3_char_long') }}</span>
                </div>
              </div>
              <div class="mb-3 mt-3">
                <label for="nickname" class="form-label">{{ $t('assistant_module.nickname') }}</label>
                <input type="text" class="form-control" v-bind:class="{ 'is-invalid': $v.nickname.$error }" id="nickname" v-model.trim="$v.nickname.$model">
                <div class="invalid-feedback">
                  <span v-if="!$v.nickname.required">{{ $t('validation.nickname_is_required') }} </span>
                  <span v-if="!$v.nickname.minLength">{{ $t('validation.nickname_should_3_char_long') }}</span>
                </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">{{ $t('assistant_module.easy123_username') }}</label>
                <input type="email" class="form-control" v-bind:class="{ 'is-invalid': $v.email.$error }" id="email" v-model.trim="$v.email.$model" :placeholder="$t('assistant_module.easy123_username_placeholder')">
                <div class="invalid-feedback">
                  <span v-if="!$v.email.required">{{ $t('validation.email_is_required') }}</span>
                  <span v-if="!$v.email.email">{{ $t('validation.enter_valid_email') }}</span>
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">{{ $t('assistant_module.easy123_password') }}</label>
                <div style="position:relative;">
                  <input :type="(show_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.password.$error }" id="password" v-model.trim="$v.password.$model" :placeholder="$t('assistant_module.easy123_password_placeholder')" autocomplete="new-password" name="new_password_1">
                  <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_password_protected=false" v-show="show_password_protected" />
                  <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_password_protected=true" v-show="!show_password_protected" />
                </div>
                <small class="form" v-if="passwordIsSet">{{ $t('assistant_module.password_secured_with_encryption') }}</small>
                <div class="invalid-feedback" v-bind:class="{ 'd-block': $v.password.$error }">
                  <span v-if="!$v.password.required">{{ $t('validation.password_is_required') }}</span>
                  <span v-if="!$v.password.minLength">{{ $t('validation.password_8_char_long') }}</span>
                </div>
              </div>
              <button type="submit" class="btn btn-primary mb-5" :readonly="profileFormSubmitStatus == 'PROCESSING'" :disabled="profileFormSubmitStatus == 'PROCESSING'">
                <span v-if="profileFormSubmitStatus == 'PROCESSING'">{{ $t('saving_process') }}</span>
                <span v-if="profileFormSubmitStatus != 'PROCESSING'">{{ $t('save') }}</span>
              </button>
            </form>

          </div>
          <div class="tab-pane fade" id="imapdetails" role="tabpanel" aria-labelledby="imapdetails-tab">
            <form @submit.prevent="submitImapSmtpDetails()">
              <div>
                <h6 class="mt-3"><b>{{ $t('assistant_module.imap_heading') }}</b></h6>
                <div class="mb-3">
                  <label for="imap_username" class="form-label">{{ $t('assistant_module.imap_email_address') }}</label>
                  <input type="text" class="form-control" id="imap_username" v-model.trim="$v.imap_username.$model" v-bind:class="{ 'is-invalid': $v.imap_username.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.imap_username.required">{{ $t('validation.imap_email_is_required') }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="imap_password" class="form-label">{{ $t('assistant_module.imap_password') }}</label>
                  <div style="position:relative;">
                    <input :type="(show_imap_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.imap_password.$error }" id="imap_password" v-model.trim="$v.imap_password.$model" autocomplete="new-password">
                    <div class="invalid-feedback">
                      <span v-if="!$v.imap_password.required">{{ $t('validation.imap_password_is_required') }}</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_imap_password_protected=false" v-show="show_imap_password_protected" />
                    <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_imap_password_protected=true" v-show="!show_imap_password_protected" />
                  </div>
                  <small class="form" v-html="$t('assistant_module.imap_password_desc')">
                  </small>

                </div>
                <div class="mb-3">
                  <label for="imap_host" class="form-label">{{ $t('assistant_module.imap_host') }}</label>
                  <input type="text" class="form-control" id="imap_host" v-model.trim="$v.imap_host.$model" v-bind:class="{ 'is-invalid': $v.imap_host.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.imap_host.required">{{ $t('validation.imap_host_required') }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <a href="javascript:void(0)" class="btn btn-sm btn-info" :disabled="testIncomingMailStatus == 'PROCESSING'" :readonly="testIncomingMailStatus == 'PROCESSING'" @click="testIncomingMail()" v-bind:class="{ 'disabled': testIncomingMailStatus == 'PROCESSING' }">
                    <span v-if="testIncomingMailStatus != 'PROCESSING'">{{ $t('assistant_module.test_incoming_mail') }}</span>
                    <span v-if="testIncomingMailStatus == 'PROCESSING'">{{ $t('assistant_module.test_incoming_mail_processing') }}</span>
                  </a>
                </div>
              </div>
              <div>
                <h6 class="mt-4"><b>{{ $t('assistant_module.smtp_heading') }}</b></h6>
                <div class="mb-3">
                  <label for="smtp_username" class="form-label">{{ $t('assistant_module.smtp_email_address') }}</label>
                  <input type="text" class="form-control" id="smtp_username" v-model.trim="$v.smtp_username.$model" v-bind:class="{ 'is-invalid': $v.smtp_username.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.smtp_username.required">{{ $t('validation.imap_email_is_required') }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="smtp_password" class="form-label">Password</label>
                  <div style="position:relative;">
                    <input :type="(show_smtp_password_protected)?'password':'text'" class="form-control" v-bind:class="{ 'is-invalid': $v.smtp_password.$error }" id="smtp_password" v-model.trim="$v.smtp_password.$model" autocomplete="new-password">
                    <div class="invalid-feedback">
                      <span v-if="!$v.smtp_password.required">{{ $t('validation.imap_password_is_required') }}</span>
                    </div>
                    <font-awesome-icon :icon="['fas', 'eye']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_smtp_password_protected=false" v-show="show_smtp_password_protected" />
                    <font-awesome-icon :icon="['fas', 'eye-slash']" style="position: absolute;right: 9px; top: 12px; cursor: pointer;" @click="show_smtp_password_protected=true" v-show="!show_smtp_password_protected" />
                  </div>
                </div>
                <div class="mb-3">
                  <label for="smtp_host" class="form-label">{{ $t('assistant_module.imap_host') }}</label>
                  <input type="text" class="form-control" id="smtp_host" v-model.trim="$v.smtp_host.$model" v-bind:class="{ 'is-invalid': $v.smtp_host.$error }">
                  <div class="invalid-feedback">
                    <span v-if="!$v.smtp_host.required">{{ $t('validation.imap_host_required') }}</span>
                  </div>
                </div>
                  
                <div class="mb-3">
                  <a href="javascript:void(0)" class="btn btn-sm btn-info" :disabled="testOutgoingMailStatus == 'PROCESSING'" :readonly="testOutgoingMailStatus == 'PROCESSING'" @click="testOutgoingMail()" v-bind:class="{ 'disabled': testOutgoingMailStatus == 'PROCESSING' }">
                    <span v-if="testOutgoingMailStatus != 'PROCESSING'">{{ $t('assistant_module.test_outgoing_mail') }}</span>
                    <span v-if="testOutgoingMailStatus == 'PROCESSING'">{{ $t('assistant_module.test_outgoing_mail_processing') }}</span>
                  </a>
                </div>

                <button type="button" class="mb-3 btn btn-sm btn-warning" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">{{ $t('assistant_module.advance_settings') }}</button>
                <div>
                  <div class="collapse collapse-horizontal" id="collapseWidthExample">
                    <div class="mb-3">
                      <label for="smtp_port" class="form-label">{{ $t('assistant_module.smtp_port') }}</label>
                      <input type="text" class="form-control" id="smtp_port" v-model.trim="$v.smtp_port.$model" v-bind:class="{ 'is-invalid': $v.smtp_port.$error }">
                      <div class="invalid-feedback">
                        <span v-if="!$v.smtp_port.required">{{ $t('validation.smtp_port_required') }}</span>
                      </div>
                    </div>

                    <div class="form-check mb-3">
                      <input class="form-check-input" type="checkbox" value="true" id="smtp_use_tls_ssl" v-model="smtp_use_tls_ssl">
                      <label class="form-check-label" for="smtp_use_tls_ssl">
                        {{ $t('assistant_module.use_tls_ssl') }}
                      </label>
                    </div>

                    <div class="mb-3">
                      <label for="smtp_authentication" class="form-label">{{ $t('assistant_module.smtp_authentication_type') }}</label>
                      <select class="form-select" id="smtp_authentication" v-model.trim="$v.smtp_authentication.$model" v-bind:class="{ 'is-invalid': $v.smtp_authentication.$error }">
                        <option value="None">{{ $t('assistant_module.smtp_authentication_type_option_none') }}</option>
                        <option value="Password" selected>{{ $t('assistant_module.smtp_authentication_type_option_password') }}</option>
                      </select>
                      <div class="invalid-feedback">
                        <span v-if="!$v.smtp_authentication.required">{{ $t('validation.smtp_authentication_method_required') }}</span>
                      </div>
                    </div>
                  </div>
                </div>


              </div>




              <button type="submit" class="btn btn-primary mb-5" :readonly="imapSmtpFormSubmitStatus == 'PROCESSING'" :disabled="imapSmtpFormSubmitStatus == 'PROCESSING'">
                <span v-if="imapSmtpFormSubmitStatus == 'PROCESSING'">{{ $t('saving_process') }}</span>
                <span v-if="imapSmtpFormSubmitStatus != 'PROCESSING'">{{ $t('save') }}</span>
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
          <div class="tab-pane fade" id="generalsettings" role="tabpanel" aria-labelledby="generalsettings-tab">
            <form @submit.prevent="submitGeneralSettings()">
              <div>
                <div class="mt-3 mb-3 row">
                  <label for="screen_saver_start_after" class="col-sm-3 col-form-label">{{ $t('assistant_module.screen_saver_start_after') }}</label>
                  <div class="col-sm-9">
                    <select name="screen_saver_start_after" id="screen_saver_start_after" class="form-control" v-model="screenSaverStartAfter">
                      <option :value="i" v-for="i in 60" :key="'option_'+i">{{ i }} {{ (i == 1)? $t('assistant_module.minute'): $t('assistant_module.minutes') }}</option>
                    </select>
                  </div>
                </div>
                <div class="mt-3 mb-3 row">
                  <label for="screen_saver_photo_transition_period" class="col-sm-3 col-form-label">{{
                      $t('assistant_module.screen_saver_photo_transition_period')
                    }}</label>
                  <div class="col-sm-9">
                    <select name="screen_saver_photo_transition_period" id="screen_saver_photo_transition_period" class="form-control" v-model="screenSaverPhotoTransitionPeriod">
                      <option :value="i" v-for="i in 60" :key="'option_'+i">{{ i }} {{ (i == 1)? $t('assistant_module.second'): $t('assistant_module.seconds') }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary mb-5" :readonly="generalSettingSubmitStatus == 'PROCESSING'" :disabled="generalSettingSubmitStatus == 'PROCESSING'">
                <span v-if="generalSettingSubmitStatus == 'PROCESSING'">{{ $t('saving_process') }}</span>
                <span v-if="generalSettingSubmitStatus != 'PROCESSING'">{{ $t('save') }}</span>
              </button>
            </form>
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
    title: 'Easy123 Assistant - Edit User',
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
        smtpPortNumber: null,
        smtpUseTlsSsl: null,
        smtpAuthentication: null
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
      smtp_use_tls_ssl: false,
      smtp_authentication: 'Password',
      imapSmtpFormSubmitStatus: 'NOT_SUBMITTED',
      testIncomingMailStatus: "NONE",
      testOutgoingMailStatus: "NONE",

      screenSaverStartAfter: 1,
      screenSaverPhotoTransitionPeriod: 2,
      generalSettingSubmitStatus: 'NOT_SUBMITTED'
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
    },
    smtp_authentication: {
      required
    }
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
        self.smtp_use_tls_ssl =  response.data.data.smtpUseTlsSsl
        self.smtp_authentication =  response.data.data.smtpAuthentication,

        self.screenSaverStartAfter = response.data.data.settings.screenSaverStartAfter
        self.screenSaverPhotoTransitionPeriod = response.data.data.settings.screenSaverPhotoTransitionPeriod

        if(response.data.data.password)
        {
          self.passwordIsSet = true
        }

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

          swal(self.$t('success'), self.$t('assistant_module.profile_details_saved'), "success");

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
      this.$v.smtp_authentication.$touch()

      if (this.$v.imap_username.$invalid || this.$v.imap_password.$invalid || this.$v.imap_host.$invalid || this.$v.smtp_username.$invalid || this.$v.smtp_password.$invalid || this.$v.smtp_host.$invalid || this.$v.smtp_port.$invalid || this.$v.smtp_authentication.$invalid)
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
          smtp_port: self.smtp_port,
          smtp_use_tls_ssl: self.smtp_use_tls_ssl,
          smtp_authentication: self.smtp_authentication

        })
        .then((response) => {
          self.imapSmtpFormSubmitStatus = "PROCESSING_SUCCESS"
          self.item = response.data.data

          swal(self.$t('success'), self.$t('imap_smtp_details_saved'), "success");

        }, (error) => {
          self.imapSmtpFormSubmitStatus = "ERROR"
          console.log(error)
        })
      }

    },
    submitGeneralSettings() {
      let self = this
      self.generalSettingSubmitStatus = "PROCESSING"
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/member/save-general-settings", {
        id: self.$route.params.id,
        screenSaverStartAfter: self.screenSaverStartAfter,
        screenSaverPhotoTransitionPeriod: self.screenSaverPhotoTransitionPeriod
      })
      .then((response) => {
        self.generalSettingSubmitStatus = "PROCESSING_SUCCESS"
        if(response.data.status)
        {
          swal(self.$t('success'), self.$t('assistant_module.settings_saved_successfully'), "success");
        }
        else {
          swal(self.$t('error'), self.$t('assistant_module.failed_to_save_settings'), "error");
        }
      }, (error) => {
        self.generalSettingSubmitStatus = "ERROR"
        swal(self.$t('error'), self.$t('server_error_occurred_please_contact_admin'), "error");
        console.log(error)
      })
    },
    async deleteUserAlert(id) {
      //console.log(id)
      let willDelete = await swal({
        title: this.$t('swal_delete_title'),
        text: this.$t('swal_delete_text'),
        icon: "warning",
        buttons: [this.$t('cancel'), this.$t('delete')],
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
    },
    /** test incoming mail **/
    testIncomingMail() {
      let self = this


      this.$v.imap_username.$touch()
      this.$v.imap_password.$touch()
      this.$v.imap_host.$touch()

      if (!this.$v.imap_username.$invalid || !this.$v.imap_password.$invalid || !this.$v.imap_host.$invalid)
      {
        this.testIncomingMailStatus = "PROCESSING"
        // let imap_username_value = self.imap_username.value
        // let imap_password_value = self.imap_password.value
        // let imap_host_value = self.imap_host.value
        axios.get(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/member/test-incoming-mail", {
          params: {
            test: true,
            imap_username: self.imap_username,
            imap_password: self.imap_password,
            imap_host: self.imap_host
          }

        })
        .then((response) => {
          if (response.data.error == false)
          {
            self.testIncomingMailStatus = "SUCCESS"
            swal({
              title: self.$t('success'),
              text: self.$t('imap_credentials_working'),
              icon: "success",
            });

            //console.log(response.data)
          }
          else
          {
            self.testIncomingMailStatus = "FAILED"
            swal({
              title: self.$t('failed'),
              text: self.$t('assistant_module.imap_credentials_not_working'),
              icon: "warning",
            })

            //console.log(response.data)
          }
        }, (error) => {
          self.testIncomingMailStatus = "FAILED"
          let rerr = error.response.data
          //console.log("err_message", error.response.data)
          if(rerr.message && rerr.message.code && rerr.message.code == "ENOTFOUND")
          {
            swal({
              title: self.$t('failed'),
              text: self.$t('assistant_module.not_found'),
              icon: "error",
            })
          }
          else if (rerr.message && rerr.message.textCode == "ALERT" && rerr.message.customMessage)
          {
            swal({
              title: self.$t('failed'),
              text: rerr.message.customMessage,
              icon: "error",
            })
          }
          else if(rerr.message && rerr.message.textCode && rerr.message.textCode == "AUTHENTICATIONFAILED")
          {
            swal({
              title: self.$t('failed'),
              text: self.$t('assistant_module.authentication_failed'),
              icon: "error",
            })
          }
          else if(rerr.message && rerr.message.source == "timeout")
          {
            swal({
              title: self.$t('failed'),
              text: self.$t('assistant_module.timeout'),
              icon: "error",
            })
          }

          else
          {
            swal({
              title: self.$t('failed'),
              text: self.$t('assistant_module.imap_credentials_not_working'),
              icon: "error",
            })
          }

          console.log(error)
        })
      }


    },
    /** test outgoing mail **/
    testOutgoingMail() {
      let self = this


      this.$v.smtp_username.$touch()
      this.$v.smtp_password.$touch()
      this.$v.smtp_host.$touch()
      this.$v.smtp_port.$touch()
      //this.$v.smtp_use_tls_ssl.$touch()
      this.$v.smtp_authentication.$touch()

      if (!this.$v.imap_username.$invalid || !this.$v.imap_password.$invalid || !this.$v.imap_host.$invalid)
      {
        this.testOutgoingMailStatus = "PROCESSING"
        //let smtp_username_value = self.smtp_username.value
        //let smtp_password_value = self.smtp_password.value
        //let smtp_host_value = self.smtp_host.value
        //let smtp_port_value = self.smtp_port.value
        //let smtp_authentication_value = self.smtp_authentication.value
        let input_data = {
          test: true,
          smtp_username: self.smtp_username,
          smtp_password: self.smtp_password,
          smtp_host: self.smtp_host,
          smtp_port: self.smtp_port,
          smtp_use_tls_ssl: self.smtp_use_tls_ssl,
          smtp_authentication: self.smtp_authentication
        }
        //console.log(input_data)
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/member/test-outgoing-mail", input_data)
            .then((response) => {
              if (response.data.status)
              {
                self.testOutgoingMailStatus = "SUCCESS"
                swal({
                  title: self.$t('success'),
                  text: self.$t('assistant_module.smtp_credentials_working'),
                  icon: "success",
                })

              }
              else
              {
                self.testOutgoingMailStatus = "FAILED"
                if(response.data.error)
                {
                  let serr = response.data.error
                  if(serr.code == "ETIMEDOUT")
                  {
                    swal({
                      title: self.$t('failed'),
                      text: self.$t('assistant_module.connection_timeout'),
                      icon: "warning",
                    })
                  }
                  else if(serr.code == "EDNS")
                  {
                    swal({
                      title: self.$t('failed'),
                      text: self.$t('assistant_module.extended_dns_error'),
                      icon: "warning",
                    })
                  }
                  else if (serr.code == "EAUTH")
                  {
                    swal({
                      title: self.$t('failed'),
                      text: serr.response,
                      icon: "warning",
                    })
                  }
                  else if (serr.code == "CUSTOM_CONNECTION_CLOSED")
                  {
                    swal({
                      title: self.$t('failed'),
                      text: self.$t('assistant_module.smtp_connection_closed_auto'),
                      icon: "warning",
                    })
                  }
                  else
                  {
                    swal({
                      title: self.$t('failed'),
                      text: self.$t('assistant_module.smtp_credentials_not_working'),
                      icon: "warning",
                    })
                  }
                }
                else
                {
                  swal({
                    title: self.$t('failed'),
                    text: self.$t('assistant_module.smtp_credentials_not_working'),
                    icon: "warning",
                  })
                }

              }
            }, (error) => {
              self.testOutgoingMailStatus = "FAILED"
              swal({
                title: self.$t('failed'),
                text: self.$t('assistant_module.smtp_credentials_not_working'),
                icon: "error",
              })

              console.log(error)
            })
      }
    }
  }
}
</script>