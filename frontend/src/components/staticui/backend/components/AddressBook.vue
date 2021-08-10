<template>
  <div class="row">
    <div class="col-md-12">
      <a href="javascript:void(0)" class="btn btn-sm btn-primary float-end mb-3" @click="addContact">Add Contact</a>
    </div>
    <div class="col-md-3">
      <div class="address-book" style="position: relative;">
        <input type="text" style="width: 100%; height: 35px;" v-model="search_contact" placeholder="Search All Contacts">
        <div class="list-group address-book-contact-list" id="address-book-contact-list" style="max-height: 75vh; overflow-y: scroll;">
          <a href="#" class="list-group-item list-group-item-action address-book-list-item" v-bind:class="(current_contact.id == contact.id)?'active':''"  v-for="contact in contacts" :key="contact.id" @click="showContact(contact.id)">
            {{ contact.first_name + " " + contact.last_name }}
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
              <div class="mb-3 mt-3">
                <label for="firstname" class="form-label">First Name</label>
                <input type="text" class="form-control" id="firstname" v-model="first_name">
              </div>
              <div class="mb-3">
                <label for="lastname" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="lastname" v-model="last_name">
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" v-model="email">
              </div>
              <file-pond
                  name="test"
                  ref="pond"
                  label-idle="Drop files here..."
                  v-bind:allow-multiple="true"
                  accepted-file-types="image/jpeg, image/png"
                  server="/api"
                  v-bind:files="myFiles"
                  v-on:init="handleFilePondInit"
              />
              <button class="btn btn-primary" @click="saveContact">Add</button>
            </div>
            <div class="col-md-4" v-show="!show_add_contact_form">
<!--              <img src="https://picsum.photos/200/250" class="img-fluid rounded-start" alt="...">-->
              <img :src="current_contact.image" class="img-fluid rounded-start" alt="..." width="200" height="250">
            </div>
            <div class="col-md-8" v-show="!show_add_contact_form">

              <div class="card-body">
                <h5 class="card-title">{{ current_contact.first_name }} {{ current_contact.last_name }}</h5>
                <p class="card-text">{{ current_contact.email }}</p>
                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" @click="deleteContatct(current_contact.id)">Delete Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
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
// Import Vue FilePond
import vueFilePond from "vue-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
// Import the plugin code
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

FilePond.registerPlugin(FilePondPluginImageCrop)


import contacts from './fackcontacts.json'
export default {
  name: 'AddressBook',
  components: {
    FilePond,
  },
  data() {
    return {
      contacts: contacts,
      current_contact: {},
      search_contact: null,
      show_add_contact_form: false,
      first_name: null,
      last_name: null,
      email: null,

      id: 2000,
      myFiles: []
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
    this.contacts.sort(function (a, b) {
      return a.first_name.localeCompare(b.first_name)
    })
    this.current_contact = this.contacts[0]
    //this.getContacts()
  },
  methods: {
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
        if(this.contacts[i].first_name.charAt(0) == name || this.contacts[i].first_name.charAt(0) == name.toUpperCase())
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
    addContact() {
      this.show_add_contact_form = true
    },
    saveContact() {
      this.contacts.push({
        id: this.id,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email
      })
      this.contacts.sort(function (a, b) {
        return a.first_name.localeCompare(b.first_name)
      })
      this.show_add_contact_form = false
      this.id = this.id + 1
    },
    handleFilePondInit: function () {
      console.log("FilePond has initialized");

      // FilePond instance methods are available on `this.$refs.pond`
    },
  }
}
</script>