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
        <li class="breadcrumb-item"> <router-link to="/static/assistant/users">Users</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">Edit End User</li>
      </ol>
    </nav>



    <div class="row">
      <div class="col-md-1"></div>
      <div class="col-md-10">
        <h4 class="mb-3">Edit End User</h4>
        <form class="">

        </form>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">Profile</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="imapdetails-tab" data-bs-toggle="tab" data-bs-target="#imapdetails" type="button" role="tab" aria-controls="imapdetails" aria-selected="false">IMAP details</button>
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
            <div class="mb-3 mt-3">
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
            <button type="submit" class="btn btn-primary mb-5">Submit</button>
          </div>
          <div class="tab-pane fade" id="imapdetails" role="tabpanel" aria-labelledby="imapdetails-tab">
            <div class="mb-3 mt-3">
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

            <button type="submit" class="btn btn-primary mb-5">Submit</button>
          </div>
          <div class="tab-pane fade" id="addressbook" role="tabpanel" aria-labelledby="addressbook-tab">
            <AddressBook class="mt-3"></AddressBook>
          </div>
          <div class="tab-pane fade" id="photos" role="tabpanel" aria-labelledby="photos-tab">Photos</div>
          <div class="tab-pane fade" id="easyweb" role="tabpanel" aria-labelledby="easyweb-tab">EasyWeb</div>
        </div>

      </div>
    </div>


  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
</style>


<script>
import AddressBook from './components/AddressBook'
import swal from 'sweetalert';
const axios = require('axios')
export default {
  name: 'NewUser',
  components: {
    AddressBook: AddressBook
  },
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
  },
  methods: {

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