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
            <div v-show="show_add_contact_form">
              <form @submit.prevent="saveContact()">
                <vue-avatar
                    :width=200
                    :height=200
                    :rotation="rotation"
                    :scale="scale"
                    ref="vueavatar"
                    @vue-avatar-editor:image-ready="onImageReady"
                    :image="vueSampleAvatar"
                >
                </vue-avatar>
<!--                <vue-dropzone
                    ref="avatarDropzone"
                    id="dropzone"
                    :options="dropzoneOptions"
                    @vdropzone-complete="handleVueDropzoneComplete"
                    class="mb-2"
                ></vue-dropzone>-->
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

                <div class="mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <label for="email" class="form-label"><b>Email</b></label>
                      <div class="row">
                        <div class="col-md-6 mb-3" style="position:relative;" v-for="(email_field, index) in email" :key="index">
                          <input type="email" class="form-control" :name="'email'+index" v-model="email[index]" id="email" required>
                          <span style="position: absolute; right: 20px; top: 9px;" v-show="index > 0"><a href="javascript:void(0)" @click="removeEmail(index)" style="text-decoration: none;">X</a></span>
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

<!--                <div class="mb-3">
                  <div class="row">
                    <div class="col-md-12">
                      <label for="phone_number" class="form-label"><b>Phone Number</b></label>
                      <div class="row">
                        <div class="col-md-6">
                          <label for="phone_number">Phone Number</label>
                          <input type="text" id="phone_number" class="form-control">
                        </div>
                        <div class="col-md-6">
                          <label for="phone_number_type">Type</label>
                          <select class="form-select" aria-label="Default select example" id="phone_number_type">
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>-->

                <div>
                  <button class="btn btn-primary me-2" type="submit">Save</button>
                  <button class="btn btn-secondary" @click="saveContactCancel" type="button">Cancel</button>
                </div>
              </form>

            </div>
            <div class="col-md-4" v-show="!show_add_contact_form" v-if="current_contact.image">
              <!--              <img src="https://picsum.photos/200/250" class="img-fluid rounded-start" alt="...">-->
              <img :src="getImageURL(current_contact.image)" class="img-fluid rounded-start" alt="..." width="200" height="250">
            </div>
            <div class="col-md-8" v-show="!show_add_contact_form" v-if="current_contact.id">

              <div class="card-body">
                <h5 class="card-title">{{ current_contact.name }} </h5>
                <p class="card-text">Email: {{ current_contact.email.join(", ") }}</p>
                <p class="card-text">Skype ID: {{ current_contact.skypeid }}</p>
                <p class="card-text">Zoom Meeting URL: {{ current_contact.zoom_meeting_url }}</p>
                <p>Notes: {{ current_contact.notes }}</p>
<!--                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>-->
                <a href="javascript:void(0)" class="btn btn-sm btn-info me-2" @click="editContatct(current_contact.id)">Edit Contact</a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" @click="deleteContatct(current_contact.id)">Delete Contact</a>
              </div>
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

export default {
  name: 'AddressBook',
  components: {
    //vueDropzone: vue2Dropzone,
    VueAvatar
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
        image: null
      },
      search_contact: null,
      show_add_contact_form: false,
      image_path: null,
      name: null,
      skypeid: null,
      zoom_meeting_url: null,
      notes: null,
      email: [],

      vueSampleAvatar: null,

      scale: 1,
      rotation: 0,

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
                gender: null,
                skypeid: response.data.data[i].skypeId,
                zoom_meeting_url: response.data.data[i].zoomMeetingURL,
                notes: response.data.data[i].notes,
                image: response.data.data[i].avatar
              }

              self.contacts.push(contact)
              self.contacts.sort(function (a, b) {
                return a.name.localeCompare(b.name)
              })
              self.current_contact = self.contacts[0]
            }
          }

        }
      }, (error) => {
        console.log(error)
      })
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
    deleteContatct(id) {
      this.contacts = this.contacts.filter(obj => obj.id != id)
      this.current_contact = this.contacts[0]
    },
    editContatct(id) {
      this.edit_id = id
      this.show_add_contact_form = true
      this.name = this.current_contact.name
      this.skypeid = this.current_contact.skypeid
      this.zoom_meeting_url = this.current_contact.zoom_meeting_url
      this.notes = this.current_contact.notes
      this.email = this.current_contact.email
      let image_url = this.current_contact.image.split('?')
      this.myFiles.push(image_url[0])
    },
    addContact() {
      this.show_add_contact_form = true
      this.name = null
      this.skypeid = null
      this.zoom_meeting_url = null
      this.notes = null
      this.email = []
      this.addEmail()
      this.vueSampleAvatar = null
    },
    saveContactCancel() {
      this.show_add_contact_form = false
    },
    saveContact() {
      let self = this
      this.errors.name = false
      this.errors.email = false
      this.errors.avatar = false


      let avatar = this.$refs.vueavatar.getImageScaled().toDataURL()
      //let avatar = this.$refs.vueavatar.getImageScaled()
      /*avatar.toBlob(function (blob) {
        console.log("blob", blob)
      })
      console.log("avatar", avatar)*/
      //check the contact validation

      if(!this.name) {
        this.errors.name = true
      }
      else {
        this.errors.name = false
      }
      if (!this.email) {
        this.errors.email = true
      }
      else {
        this.errors.email = false
      }

      if (!avatar && !this.edit_id)
      {
        this.errors.avatar = true
      }
      else {
        this.errors.avatar = false
      }

      if(this.errors.name || this.errors.email || this.errors.avatar)
      {
        return
      }

      //check if edit form
      if(this.edit_id)
      {
        for (let i = 0; i < this.contacts.length ; i++)
        {
          if(this.contacts[i].id == this.edit_id)
          {
            this.contacts[i].name = this.name
            this.contacts[i].skypeid = this.skypeid
            this.contacts[i].zoom_meeting_url = this.zoom_meeting_url
            this.contacts[i].notes = this.notes
            this.contacts[i].email = this.email
            this.contacts.sort(function (a, b) {
              return a.name.localeCompare(b.name)
            })
            this.show_add_contact_form = false
            return
          }
        }

      }
      else {

        axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/add-contact", {
          id: self.$route.params.id,
          name: this.name,
          skypeid: this.skypeid,
          zoom_meeting_url: this.zoom_meeting_url,
          notes: this.notes,
          email: this.email,
          avatar: avatar
        })
        .then((response) => {
          self.contacts.push({
            id: response.data.data.id,
            name: response.data.data.contactName,
            skypeid: response.data.data.skypeId,
            zoom_meeting_url: response.data.data.zoomMeetingURL,
            notes: response.data.data.notes,
            email: response.data.data.email,
            image: response.data.data.avatar
          })

          self.contacts.sort(function (a, b) {
            return a.name.localeCompare(b.name)
          })
          self.current_contact = self.contacts[0]
          /*self.contacts.sort(function (a, b) {
            return a.name.localeCompare(b.name)
          })*/
        }, (error) => {
          console.log(error)
        })



        this.show_add_contact_form = false
      }
    },
    saveContact1() {
      var img = this.$refs.vueavatar.getImageScaled()
      //this.$refs.image.src = img.toDataURL()

      console.log(img.toDataURL())
    },
    addEmail() {
      this.email.push("")
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
    }
  }
}
</script>