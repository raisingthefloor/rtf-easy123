<template>
  <div class="row">
    <div class="col-md-3">
      <div class="address-book" style="position: relative;">
        <div class="list-group" style="max-height: 75vh; overflow-y: scroll;">
          <a href="#" class="list-group-item list-group-item-action" v-bind:class="(current_contact.id == contact.id)?'active':''"  v-for="contact in contacts" :key="contact.id" @click="showContact(contact.id)">
            {{ contact.first_name + " " + contact.last_name }}
          </a>

        </div>
        <div class="slider-nav" style="position: absolute; max-height: 70vh; top: 20px; right: 0px;"><ul><li><a alt="#a">a</a></li><li><a alt="#b">b</a></li><li><a alt="#c">c</a></li><li><a alt="#d">d</a></li><li><a alt="#e">e</a></li><li><a alt="#f">f</a></li><li><a alt="#g">g</a></li><li><a alt="#h">h</a></li><li><a alt="#i">i</a></li><li><a alt="#j">j</a></li><li><a alt="#k">k</a></li><li><a alt="#l">l</a></li><li><a alt="#m">m</a></li><li><a alt="#n">n</a></li><li><a alt="#o">o</a></li><li><a alt="#p">p</a></li><li><a alt="#q">q</a></li><li><a alt="#r">r</a></li><li><a alt="#s">s</a></li><li><a alt="#t">t</a></li><li><a alt="#u">u</a></li><li><a alt="#v">v</a></li><li><a alt="#w">w</a></li><li><a alt="#x">x</a></li><li><a alt="#y">y</a></li><li><a alt="#z">z</a></li></ul></div>
      </div>

    </div>
    <div class="col-md-9">
      <div class="card">
        <div class="card-body">
          <div class="row g-0">
            <div class="col-md-4">
<!--              <img src="https://picsum.photos/200/250" class="img-fluid rounded-start" alt="...">-->
              <img :src="current_contact.image" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">{{ current_contact.first_name }} {{ current_contact.last_name }}</h5>
                <p class="card-text">{{ current_contact.email }}</p>
                <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
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

<script>
import contacts from './fackcontacts.json'
export default {
  name: 'AddressBook',
  data() {
    return {
      contacts: contacts,
      current_contact: {}
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
    }
  }
}
</script>