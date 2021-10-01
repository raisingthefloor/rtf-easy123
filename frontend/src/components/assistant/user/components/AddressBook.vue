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
  <div class="row">
    <div class="col-md-12">

    </div>
    <div class="col-md-3">
      <a href="javascript:void(0)" class="btn btn-sm btn-primary mb-3 me-4" @click="addContact" v-show="!show_add_contact_form">Add Contact</a>
      <div class="address-book" style="position: relative;">
        <input type="text" style="width: 100%; height: 35px;" v-model="search_contact" placeholder="Search All Contacts">
        <div class="list-group address-book-contact-list" id="address-book-contact-list" style="max-height: 75vh; overflow-y: scroll;">
          <a href="javascript:void(0)" class="list-group-item list-group-item-action address-book-list-item" v-bind:class="(current_contact.id == contact.id)?'active':''"  v-for="contact in contacts" :key="contact.id" @click="showContact(contact.id)">
            {{ contact.name }}
          </a>

        </div>

        <div class="slider-nav" style="position: absolute; max-height: 70vh; top: 0px; right: 0px;">
          <ul>
            <li><a href="javascript:void(0)" @click="moveToContact('a')" alt="#a">a</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('b')" alt="#b">b</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('c')" alt="#c">c</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('d')" alt="#d">d</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('e')" alt="#e">e</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('f')" alt="#f">f</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('g')" alt="#g">g</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('h')" alt="#h">h</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('i')" alt="#i">i</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('j')" alt="#j">j</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('k')" alt="#k">k</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('l')" alt="#l">l</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('m')" alt="#m">m</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('n')" alt="#n">n</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('o')" alt="#o">o</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('p')" alt="#p">p</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('q')" alt="#q">q</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('r')" alt="#r">r</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('s')" alt="#s">s</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('t')" alt="#t">t</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('u')" alt="#u">u</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('v')" alt="#v">v</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('w')" alt="#w">w</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('x')" alt="#x">x</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('y')" alt="#y">y</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('z')" alt="#z">z</a></li>
            <li><a href="javascript:void(0)" @click="moveToContact('#')" alt="#z">#</a></li>
          </ul>

        </div>
      </div>

    </div>
    <div class="col-md-9">
      <div class="card">
        <div class="card-body">

          <div class="row g-0">
            <div v-if="show_add_contact_form">
              <form @submit.prevent="saveContact()">
                <vue-avatar
                    :width=200
                    :height=200
                    :rotation="rotation"
                    :scale="scale"
                    ref="vueavatar"
                    @vue-avatar-editor:image-ready="onImageReady"
                    @select-file="onSelectFile($event)"
                    @imageLoaded="onImageLoaded($event)"
                    :image="vueSampleAvatar"
                >
                </vue-avatar>

                <span class="form-text text-danger" v-show="errors.avatar">Please select image</span>

                <div class="mb-3 mt-3">
                  <label for="name" class="form-label"><b>Name</b></label>
                  <input type="text" class="form-control" id="name" v-model="name" required>
                  <span class="form-text text-danger" v-show="errors.name">Please enter name</span>
                </div>
                <div class="mb-3 mt-3">
                  <label for="skypeid" class="form-label"><b>Skype ID</b></label>
                  <input type="text" class="form-control" id="skypeid" v-model="skypeid">
                </div>
                <div class="mb-3 mt-3">
                  <label for="zoom_meeting_url" class="form-label"><b>Zoom Meeting URL</b></label>
                  <input type="text" class="form-control" id="zoom_meeting_url" v-model="zoom_meeting_url">
                  <span class="form-text text-danger" v-show="errors.name">Please enter Zoom Meeting URL</span>
                </div>
                <div class="mb-3 mt-3">
                  <label for="notes" class="form-label"><b>Notes</b></label>
                  <textarea name="notes" id="notes" rows="3" class="form-control" v-model="notes"></textarea>
                  <span class="form-text text-danger" v-show="errors.name">Please enter Notes</span>
                </div>

                <div class="mb-3 p-2" style="border: 1px solid black;">
                  <div class="row">
                    <div class="col-md-12">
                      <label for="email" class="form-label"><b>Email</b></label>
                      <div class="row">
                        <div class="col-md-6 mb-3" style="position:relative;" v-for="(email_field, index) in email" :key="index">
                          <input type="email" class="form-control" :name="'email'+index" v-model="email[index]" id="email">
                          <span style="position: absolute; right: 20px; top: 9px;"><a href="javascript:void(0)" @click="removeEmail(index)" style="text-decoration: none;"><font-awesome-icon :icon="['fas', 'window-close']" /></a></span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="d-grid gap-2 mt-2">
                        <button class="btn btn-sm btn-info btn-block" type="button" @click="addEmail()">Add Email</button>
                      </div>
                    </div>

                  </div>

                  <span class="form-text text-danger" v-show="errors.email">Please enter email</span>
                </div>

                <div class="mb-3 p-2" style="border: 1px solid black;">
                  <div class="row">
                    <label for="phone_number" v-if="!phoneNumber.length"><b>Phone Number</b></label>
                    <div class="col-md-12" v-for="(pn, index) in phoneNumber" :key="index">
                      <hr v-if="index != 0" style="height: 5px;">
                      <div class="row" style="position:relative;">
                        <div class="col-md-12">
                          <div @click="deletePhoneNumber(index)" style="position: absolute; right: 20px;">
                            <a href="javascript:void(0)" style="text-decoration: none;"><font-awesome-icon :icon="['fas', 'window-close']" /></a>
                          </div>
                        </div>

                        <div class="col-md-4">
                          <label :for="'phone_number_type_'+index"><b>Type</b></label>
                          <select class="form-select" :id="'phone_number_type_'+index" :name="'phone_number_type_'+index" v-model="pn.type" required>
                            <option value="Mobile">Mobile</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div class="col-md-4" v-if="pn.type == 'Mobile'">
                          <label :for="'phone_number_carrier'+index"><b>Carrier</b></label>
                          <select class="form-select" :id="'phone_number_carrier'+index" :name="'phone_number_carrier'+index" v-model="pn.carrier">
                            <option value="Verizon">Verizon</option>
                            <option value="AT&T">AT&T</option>
                            <option value="T-Mobile">T-Mobile</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div class="col-md-4">
                          <label :for="'phone_number_'+index" class=""><b>Phone Number</b></label>
                          <input type="text" :id="'phone_number_'+index" :name="'phone_number_'+index" autocomplete="off" class="form-control" v-model.number="pn.number" @keypress="isNumber($event)">
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="d-grid gap-2 mt-3">
                        <button class="btn btn-sm btn-info btn-block" type="button" @click="addPhoneNumber()">Add Phone Number</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-primary me-2" type="submit" :disabled="processingForm" :readonly="processingForm">
                    <span v-if="processingForm">Saving...</span>
                    <span v-if="!processingForm">Save</span>
                  </button>
                  <button class="btn btn-secondary" @click="saveContactCancel" type="button">Cancel</button>
                </div>
              </form>

            </div>
            <div v-if="show_edit_contact_form">
              <form @submit.prevent="saveContact()">
                <div v-if="showEditAvatar">
                  <vue-avatar
                      :width=200
                      :height=200
                      :rotation="rotation"
                      :scale="scale"
                      ref="vueavatar_edit"
                      @vue-avatar-editor:image-ready="onImageReady"
                      @select-file="onSelectFile($event)"
                      @imageLoaded="onImageLoaded($event)"
                      :image="vueSampleAvatarEdit"
                  ></vue-avatar>
                </div>
                <div style="height: 250px; width: 250px; background-color: #7F7F7F; color: #FFFFFF; padding-top: 109px;" v-if="!showEditAvatar">
                  <h5 class="text-center">Loading...</h5>
                </div>

                <span class="form-text text-danger" v-show="errors.avatar">Please select image</span>

                <div class="mb-3 mt-3">
                  <label for="name" class="form-label"><b>Name</b></label>
                  <input type="text" class="form-control" id="name" v-model="name" required>
                  <span class="form-text text-danger" v-show="errors.name">Please enter name</span>
                </div>
                <div class="mb-3 mt-3">
                  <label for="skypeid" class="form-label"><b>Skype ID</b></label>
                  <input type="text" class="form-control" id="skypeid" v-model="skypeid">
                </div>
                <div class="mb-3 mt-3">
                  <label for="zoom_meeting_url" class="form-label"><b>Zoom Meeting URL</b></label>
                  <input type="text" class="form-control" id="zoom_meeting_url" v-model="zoom_meeting_url">
                  <span class="form-text text-danger" v-show="errors.name">Please enter Zoom Meeting URL</span>
                </div>
                <div class="mb-3 mt-3">
                  <label for="notes" class="form-label"><b>Notes</b></label>
                  <textarea name="notes" id="notes" rows="3" class="form-control" v-model="notes"></textarea>
                  <span class="form-text text-danger" v-show="errors.name">Please enter Notes</span>
                </div>

                <div class="mb-3 p-2" style="border: 1px solid black;">
                  <div class="row">
                    <div class="col-md-12">
                      <label for="email" class="form-label"><b>Email</b></label>
                      <div class="row">
                        <div class="col-md-6 mb-3" style="position:relative;" v-for="(email_field, index) in email" :key="index">
                          <input type="email" class="form-control" :name="'email'+index" v-model="email[index]" id="email">
                          <span style="position: absolute; right: 20px; top: 9px;"><a href="javascript:void(0)" @click="removeEmail(index)" style="text-decoration: none;"><font-awesome-icon :icon="['fas', 'window-close']" /></a></span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="d-grid gap-2 mt-2">
                        <button class="btn btn-sm btn-info btn-block" type="button" @click="addEmail()">Add Email</button>
                      </div>
                    </div>

                  </div>

                  <span class="form-text text-danger" v-show="errors.email">Please enter email</span>
                </div>

                <div class="mb-3 p-2" style="border: 1px solid black;">
                  <div class="row">
                    <div class="col-md-12" v-for="(pn, index) in phoneNumber" :key="index">
                      <hr style="height: 5px;" v-if="index != 0">
                      <div class="row" style="position:relative;">
                        <div class="col-md-12">
                          <div @click="deletePhoneNumber(index)" style="    position: absolute; right: 20px;"><a
                              href="javascript:void(0)" style="text-decoration: none;"><font-awesome-icon :icon="['fas', 'window-close']" /></a></div>
                        </div>

                        <div class="col-md-6">
                          <label :for="'phone_number_edit_'+index">Phone Number</label>
                          <input type="text" :id="'phone_number_edit_'+index" :name="'phone_number_edit_'+index" autocomplete="off" class="form-control" v-model.number="pn.number" @keypress="isNumber($event)">
                        </div>
                        <div class="col-md-6">
                          <label :for="'phone_number_type_edit_'+index">Type</label>
                          <select class="form-select" :id="'phone_number_type_edit_'+index" :name="'phone_number_type_edit_'+index" autocomplete="off" v-model="pn.type">
                            <option value="Mobile">Mobile</option>
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div class="col-md-6" v-if="pn.type == 'Mobile'">
                          <label :for="'phone_number_carrier_edit_'+index" class="mt-2">Carrier</label>
                          <select class="form-select" :id="'phone_number_carrier_edit_'+index" :name="'phone_number_carrier_edit_'+index" v-model="pn.carrier">
                            <option value="Verizon">Verizon</option>
                            <option value="AT&T">AT&T</option>
                            <option value="T-Mobile">T-Mobile</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-12">
                      <div class="d-grid gap-2 mt-3">
                        <button class="btn btn-sm btn-info btn-block" type="button" @click="addPhoneNumber()">Add Phone Number</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <button class="btn btn-primary me-2" type="submit" :disabled="form_submit_status == 'PROCESSING'" :readonly="form_submit_status == 'PROCESSING'">
                    <span v-if="form_submit_status == 'PROCESSING'">Saving...</span>
                    <span v-if="form_submit_status != 'PROCESSING'">Save</span>
                  </button>
                  <button class="btn btn-secondary" @click="saveContactCancel" type="button">Cancel</button>
                </div>
              </form>

            </div>
            <div class="col-md-4" v-show="!show_add_contact_form && !show_edit_contact_form" >
              <address-book-contact-image v-if="current_contact.avatarName" :image="current_contact"></address-book-contact-image>
              <img v-else src="@/assets/images/contact-profile-pic.png" alt="">
            </div>
            <div class="col-md-8" v-show="!show_add_contact_form && !show_edit_contact_form" v-if="current_contact.id">

              <div class="card-body">
                <h5 class="card-title">{{ current_contact.name }} </h5>
                <p class="card-text">Email: {{ current_contact.email.join(", ") }}</p>
                <p class="card-text">
                  Phone Number(s):
                  <ul>
                    <li v-for="(pn, index) in current_contact.phoneNumber" :key="'show_pn_'+index">
                      {{ pn.number }} ({{ pn.type }}) <span v-if="pn.carrier">- {{ pn.carrier }}</span>
                    </li>
                  </ul>
                </p>
                <p class="card-text">Skype ID: {{ current_contact.skypeid }}</p>
                <p class="card-text">Zoom Meeting URL: {{ current_contact.zoom_meeting_url }}</p>
                <p>Notes: {{ current_contact.notes }}</p>
<!--                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>-->
                <a href="javascript:void(0)" class="btn btn-sm btn-info me-2" @click="editContact(current_contact.id)">Edit Contact</a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" @click="showDeleteContactDialog(current_contact)">Delete Contact</a>
              </div>
            </div>
            <div v-if="!show_add_contact_form && !show_edit_contact_form && !contacts.length">
              <h4 class="mt-2">No contacts found</h4>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<style scoped>
.slider-nav {
  z-index: 5;
}
.slider-nav>ul {
  list-style: none;
  background-color: #efeeee;
  padding: 0px;
  text-decoration: none;
  text-transform: capitalize;
  font-size: 0.8rem;
}
.slider-nav>ul>li {
  margin-bottom: 0.2rem;
}
.slider-nav>ul>li>a {
  text-decoration: none;
}
/* width */
.address-book-contact-list::-webkit-scrollbar {
  width: 3px;
}

/* Track */
.address-book-contact-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.address-book-contact-list::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
.address-book-contact-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<script>
//Dropzone
//import vue2Dropzone from 'vue2-dropzone'
//import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import axios from "axios";
import {VueAvatar} from 'vue-avatar-editor-improved'
import swal from "sweetalert";
import AddressBookContactImage from "./AddressBookContactImage";
//import contactProfilePic from '@/assets/images/contact-profile-pic.png'

export default {
  name: 'AddressBook',
  components: {
    //vueDropzone: vue2Dropzone,
    VueAvatar,
    AddressBookContactImage
  },
  data() {
    return {
      contacts: [
      ],
      current_contact: {
        id: null,
        name: null,
        email: [],
        gender: null,
        skypeid: null,
        zoom_meeting_url: null,
        notes: null,
        image: null,
        avatarPath: null,
        avatarMIME: null,
        avatarName: null
      },
      search_contact: null,
      show_add_contact_form: false,
      show_edit_contact_form: false,
      image_path: null,
      name: null,
      skypeid: null,
      zoom_meeting_url: null,
      notes: null,
      email: [],
      phoneNumber: [],

      add_contact_form_image_changed: false,
      edit_contact_form_image_changed: false,
      avatarMIME: null,

      showEditAvatar: false,

      vueSampleAvatar: null,
      vueSampleAvatarEdit: null,

      scale: 1,
      rotation: 0,

      form_submit_status: 'NOT_SUBMITTED',

      id: 2000,
      edit_id: null,
      errors: {
        name: false,
        email: false,
        avatar: false
      }
    }
  },
  computed: {
    dropzoneOptions() {
      return {
        paramName: 'avatar',
        url: process.env.VUE_APP_API_HOST_NAME + "/api/upload-contact-avatar-image",
        thumbnailWidth: 150,
        maxFilesize: 50, //in MB
        maxFiles: 1,
        headers: { "My-Awesome-Header": "header value" },
        params: {
          userId: this.$route.params.id
        }
      }
    },
    processingForm() {
      if (this.form_submit_status == 'PROCESSING')
      {
        return true
      }
      else
      {
        return false
      }
    }
  },
  watch: {
    search_contact(newVal) {
      let filter = newVal.toUpperCase()
      let li = document.getElementsByClassName("address-book-list-item")

      for (let i = 0; i < li.length; i++) {

        let txtValue = li[i].textContent || li[i].innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }

    }
  },
  mounted() {
    this.getContacts()
    if(this.contacts.length)
    {
      this.contacts.sort(function (a, b) {
        return a.name.localeCompare(b.name)
      })

      this.current_contact = this.contacts[0]
    }

  },
  methods: {
    getContacts() {
      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/get-all-contacts", {
        id: self.$route.params.id
      })
      .then((response) => {
        if(response.data.status)
        {
          if(response.data.data && response.data.data.length)
          {
            for (let i = 0; i < response.data.data.length; i++)
            {
              let contact = {
                id: response.data.data[i].id,
                name: response.data.data[i].contactName,
                email: response.data.data[i].email,
                phoneNumber: response.data.data[i].phoneNumber,
                gender: null,
                skypeid: response.data.data[i].skypeId,
                zoom_meeting_url: response.data.data[i].zoomMeetingURL,
                notes: response.data.data[i].notes,
                image: response.data.data[i].avatarName,
                avatarPath: response.data.data[i].avatarPath,
                avatarMIME: response.data.data[i].avatarMIME,
                avatarName: response.data.data[i].avatarName
              }

              self.contacts.push(contact)
              self.contacts.sort(function (a, b) {
                return a.name.localeCompare(b.name)
              })
              self.current_contact = self.contacts[0]
            }
          }
          else {
            self.addContact()
          }

        }
      }, (error) => {
        console.log(error)
      })
    },
    isNumber(evt) {
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    getImageURL(image) {
      return process.env.VUE_APP_API_HOST_NAME+"/"+image
    },
    showContact(id) {
      this.current_contact = this.contacts.find(obj => obj.id == id)
      //console.log(this.current_contact)
    },
    moveToContact(name) {
      //console.log(name)
      //check if char
      if((/[a-zA-Z]/).test(name))
      {
        //char
      }
      else {
        //not a char
      }


      // get the "Div" inside which you wish to scroll (i.e. the container element)
      const El = document.getElementById('address-book-contact-list');


      //get the height of each element
      //console.log("offsetHeight", El.firstChild.offsetHeight, El.firstChild.clientHeight)

      //get the element matching index
      let move_to_index = 0
      for (let i = 0; i < this.contacts.length; i++)
      {
        if(this.contacts[i].name.charAt(0) == name || this.contacts[i].name.charAt(0) == name.toUpperCase())
        {
          move_to_index = i
          if(move_to_index > 1)
          {
            move_to_index = move_to_index-1
          }
          //console.log("move_to_index", move_to_index, this.contacts[i].first_name)
          // Lets say you wish to scroll by 100px,
          El.scrollTo({top: (El.firstChild.offsetHeight * move_to_index), behavior: 'smooth'});
          break;
        }
      }







      // If you wish to scroll until the end of the container
      //El.scrollTo({top: El.scrollHeight, behavior: 'smooth'});
    },
    async showDeleteContactDialog(contact) {
      let willDelete = await swal({
        title: "Are you sure, you want to delete?",
        text: "Once deleted, you will not be able to recover!",
        icon: "warning",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
      })

      if (willDelete) {
        this.deleteContact(contact.id)
      } else {
        //pressed cancel button
      }
    },
    deleteContact(id) {
      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/delete-address-book-contact", {
        contact_id: id
      })
      .then(
          (response) => {
            if(response.data.status)
            {
              self.contacts = self.contacts.filter(obj => obj.id != id)
              if (self.contacts.length)
              {
                self.current_contact = self.contacts[0]
              }
              else
              {
                self.current_contact = {
                  id: null,
                  name: null,
                  email: [],
                  gender: null,
                  skypeid: null,
                  zoom_meeting_url: null,
                  notes: null,
                  image: null,
                  avatarMIME: null
                }
                self.addContact()
              }
            }
            else
            {
              swal(self.$t('server_error_occurred_please_contact_admin'), {
                icon: "warning",
              })
            }
          },
          (error) => {
            swal(self.getTranslation('server_error_occurred_please_contact_admin'), {
              icon: "warning",
            })
            console.log(error)
          }
      )


    },
    editContact(id) {
      this.edit_id = id
      this.show_edit_contact_form = true
      this.name = this.current_contact.name
      this.skypeid = this.current_contact.skypeid
      this.zoom_meeting_url = this.current_contact.zoom_meeting_url
      this.notes = this.current_contact.notes
      this.email = this.current_contact.email
      this.phoneNumber = this.current_contact.phoneNumber
      //let image_url = this.current_contact.image.split('?')
      //this.myFiles.push(image_url[0])
      this.vueSampleAvatar = null
      this.vueSampleAvatarEdit = null
      //this.vueSampleAvatarEdit = process.env.VUE_APP_API_HOST_NAME + "/" + this.current_contact.image
      this.add_contact_form_image_changed = false
      this.edit_contact_form_image_changed = false
      this.avatarMIME = null
      this.showEditAvatar = false

      let self = this
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
        photo: {
          path: this.current_contact.avatarPath,
          name: this.current_contact.avatarName
        },
        signed: true
      })
      .then((response) => {

        let imageData = response.data.data

        /*let b64 = 'data:'

        b64 = b64 + self.current_contact.avatarMIME
        b64 = b64 + ';base64,'
        b64 = b64 + imageData*/
        //self.localImage = b64

        //self.vueSampleAvatarEdit = b64
        self.vueSampleAvatarEdit = imageData

        setTimeout(function () {
          self.showEditAvatar = true
        }, 1000)
        //console.log(self.vueSampleAvatarEdit)
        //self.vueSampleAvatarEdit = self.getBase64Image(document.getElementById("imageid"))

      }, (error) => {
        console.log(error)
      })


    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    },
    addContact() {
      this.show_add_contact_form = true
      this.show_edit_contact_form = false
      this.name = null
      this.skypeid = null
      this.zoom_meeting_url = null
      this.notes = null
      this.email = []
      this.addEmail()
      this.phoneNumber = []
      this.addPhoneNumber()
      this.vueSampleAvatar = null
      this.vueSampleAvatarEdit = null
      this.add_contact_form_image_changed = false
      this.edit_contact_form_image_changed = false
      this.edit_id = null
      this.avatarMIME = null
    },
    saveContactCancel() {
      this.show_add_contact_form = false
      this.show_edit_contact_form = false
    },
    saveContact() {
      let self = this
      let avatar, image_changed
      this.errors.name = false
      this.errors.email = false
      this.errors.phoneNumber = false
      this.errors.avatar = false

      image_changed = false

      //check the contact validation

      if(!this.name) {
        this.errors.name = true
      }
      else {
        this.errors.name = false
      }


      if(this.edit_id)
      {
        avatar = this.$refs.vueavatar_edit.getImageScaled().toDataURL()
        if(this.edit_contact_form_image_changed)
        {
          image_changed = true
        }
      }
      else
      {
        avatar = this.$refs.vueavatar.getImageScaled().toDataURL()
        if(this.add_contact_form_image_changed)
        {
          image_changed = true
          //this.errors.avatar = false
        }
      }

      if(this.errors.name)
      {
        return
      }

      //check if edit form
      if(this.edit_id)
      {
        this.form_submit_status = 'PROCESSING'
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/edit-contact", {
          id: self.$route.params.id,
          edit_id: self.edit_id,
          name: this.name,
          skypeid: this.skypeid,
          zoom_meeting_url: this.zoom_meeting_url,
          notes: this.notes,
          email: this.email,
          phoneNumber: this.phoneNumber,
          avatar: avatar,
          image_changed: image_changed
        })
        .then((response) => {
          self.form_submit_status = 'PROCESSED'
          //console.log(response.data)

          for (let i = 0; i < self.contacts.length ; i++)
          {
            if(self.contacts[i].id == self.edit_id)
            {
              self.contacts[i].name = self.name
              self.contacts[i].skypeid = self.skypeid
              self.contacts[i].zoom_meeting_url = self.zoom_meeting_url
              self.contacts[i].notes = self.notes
              self.contacts[i].email = self.email
              self.contacts[i].phoneNumber = response.data.data.phoneNumber
              self.contacts[i].image = response.data.data.avatar
              self.contacts[i].avatarPath = response.data.data.avatarPath
              self.contacts[i].avatarMIME = response.data.data.avatarMIME
              self.contacts[i].avatarName = response.data.data.avatarName
              //image: response.data.data.avatar
              self.contacts.sort(function (a, b) {
                return a.name.localeCompare(b.name)
              })
              self.show_add_contact_form = false
              self.show_edit_contact_form = false

              self.contacts.sort(function (a, b) {
                return a.name.localeCompare(b.name)
              })
              self.current_contact = {}

              self.$nextTick(function () {
                self.showContact(response.data.data.id)
              })


              return
            }
          }

        }, (error) => {
          self.form_submit_status = 'PROCESSED'
          console.log(error)
        })



      }
      else {
        this.form_submit_status = 'PROCESSING'
        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/add-contact", {
          id: self.$route.params.id,
          name: this.name,
          skypeid: this.skypeid,
          zoom_meeting_url: this.zoom_meeting_url,
          notes: this.notes,
          email: this.email,
          phoneNumber: this.phoneNumber,
          avatar: avatar,
          image_changed: image_changed
        })
        .then((response) => {

          self.contacts.push({
            id: response.data.data.id,
            name: response.data.data.contactName,
            skypeid: response.data.data.skypeId,
            zoom_meeting_url: response.data.data.zoomMeetingURL,
            notes: response.data.data.notes,
            email: response.data.data.email,
            phoneNumber: response.data.data.phoneNumber,
            image: response.data.data.avatar,
            avatarPath: response.data.data.avatarPath,
            avatarMIME: response.data.data.avatarMIME,
            avatarName: response.data.data.avatarName
          })

          self.contacts.sort(function (a, b) {
            return a.name.localeCompare(b.name)
          })
          //self.current_contact = self.contacts[0]
          self.showContact(response.data.data.id)
          self.form_submit_status = 'PROCESSED'
          /*self.contacts.sort(function (a, b) {
            return a.name.localeCompare(b.name)
          })*/
          this.show_add_contact_form = false
          this.show_edit_contact_form = false
        }, (error) => {
          self.form_submit_status = 'PROCESSED'
          this.show_add_contact_form = false
          this.show_edit_contact_form = false
          console.log(error)
        })




      }
    },
    addEmail() {
      this.email.push("")
    },
    addPhoneNumber() {
      this.phoneNumber.push({
        number: null,
        type: 'Mobile',
        carrier: null
      })
    },
    deletePhoneNumber(index) {
      if (index > -1) {
        this.phoneNumber.splice(index, 1);
      }
    },
    removeEmail(index) {
      if (index > -1) {
        this.email.splice(index, 1);
      }
    },
    onImageReady()
    {
      this.scale = 1
      this.rotation = 0
    },
    onSelectFile(obj)
    {
      //console.log(obj[0], obj[0].type)
      if(obj.length == 1)
      {
        if(this.edit_id)
        {
          this.edit_contact_form_image_changed = true
          this.avatarMIME = obj[0].type
        }
        else
        {
          this.add_contact_form_image_changed = true
          this.avatarMIME = obj[0].type
        }

      }
    },
    /** check if image is loaded **/
    onImageLoaded(obj)
    {
      if(this.edit_id && obj)
      {
        this.edit_contact_form_image_changed = true
        this.avatarMIME = this.getMimeTypeFromDataURL(this.$refs.vueavatar_edit.getImageScaled().toDataURL())
      }
      else
      {
        this.add_contact_form_image_changed = true
        //console.log("mime", this.getMimeTypeFromDataURL(this.$refs.vueavatar.getImageScaled().toDataURL()))
        this.avatarMIME = this.getMimeTypeFromDataURL(this.$refs.vueavatar.getImageScaled().toDataURL())
      }
      /*if(obj)
      {
        this.edit_contact_form_image_changed = true
      }*/
      //console.log("onImageLoaded obj", obj, event)
    },
    /** get mimetype from dataurl **/
    getMimeTypeFromDataURL(data)
    {
      const base64Content = data

      // base64 encoded data doesn't contain commas
      let base64ContentArray = base64Content.split(",")

      // base64 content cannot contain whitespaces but nevertheless skip if there are!
      let mimeType = base64ContentArray[0].match(/[^:\s*]\w+\/[\w-+\d.]+(?=[;| ])/)[0]

      // base64 encoded data - pure
      //let base64Data = base64ContentArray[1]

      return mimeType
      /*console.log("base64Content: ", base64Content)
      console.log("mimeType: ", mimeType)
      console.log("base64Data: ", base64Data)*/
    }
  }
}
</script>