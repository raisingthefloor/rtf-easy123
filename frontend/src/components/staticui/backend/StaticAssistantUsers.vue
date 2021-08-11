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
        <li class="breadcrumb-item active" aria-current="page"> Members</li>
      </ol>
    </nav>

    <div class="table-responsive">
      <div>
        <h3 class="float-start">John Doe Family</h3>
        <router-link to="/static/assistant/create-user" class="float-end btn btn-primary">Create Member</router-link>
      </div>
      <table class="table mt-5">
        <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.first_name + ' ' + user.last_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <!--            <button type="button" class="btn btn-danger btn-sm" @click="deleteUser(user.id)" v-show="user.role != 'admin'">Delete</button>-->
            <button type="button" v-show="user.role != 'Assistant/Owner'" class="btn btn-info btn-sm me-2" @click="editUser(user.id)">Edit</button>
            <button type="button" class="btn btn-danger btn-sm" @click="deleteUserAlert(user.id)" v-show="user.role != 'admin' && user.role != 'Assistant/Owner'">Delete</button>
          </td>
        </tr>
        <tr v-if="!users.length" >
          <td colspan="4" style="text-align: center;">No Users</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
</style>

<script>
import swal from 'sweetalert';
const axios = require('axios')
export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Easy123 Assistant - Users List',
  },
  data() {
    return {
      users: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@plenartech.com",
          role: "Assistant/Owner"
        },
        {
          id: 2,
          first_name: "Jatin",
          last_name: "Raikwar",
          email: "jatin.raikwar@plenartech.com",
          role: "End User"
        },
        {
          id: 3,
          first_name: "Mayur",
          last_name: "Upadhayay",
          email: "mayur.upadhayay@plenartech.com",
          role: "End User"
        },
        {
          id: 4,
          first_name: "Parikshit",
          last_name: "Thakur",
          email: "parikshit.thakur@plenartech.com",
          role: "Family & Friends"
        },
        {
          id: 5,
          first_name: "Hardik",
          last_name: "Shah",
          email: "hardik.shah@plenartech.com",
          role: "Family & Friends"
        }
      ]
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
        //this.deleteUser(id)
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
    editUser(id) {
      console.log(id)
      this.$router.push('/static/assistant/edit-user')
    }
  }
}
</script>