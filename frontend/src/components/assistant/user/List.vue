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

    <h6 class="mt-5"><b>{{ getMembersTitle() }}</b></h6>
    <div class="table-responsive">
      <table class="table mt-1">
        <thead>
        <tr>
          <th scope="col">{{ $t('assistant_module.name') }}</th>
          <th scope="col">{{ $t('assistant_module.nickname') }}</th>
          <th scope="col">{{ $t("assistant_module.email") }}</th>
          <th scope="col">{{ $t('assistant_module.role') }}</th>
          <th scope="col">{{ $t('assistant_module.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ getNickname(user.nickname) }}</td>
          <td>{{ user.email }}</td>
          <td style="text-transform: capitalize;">{{ user.role }}</td>
          <td>
            <button type="button" class="btn btn-info btn-sm me-2" @click="viewAsUser(user)" v-show="user.role == 'user'">
              {{ $t('assistant_module.view_as_user') }}</button>
            <button type="button" class="btn btn-info btn-sm me-2" v-if="$store.state.AppActiveUser.email != user.email" @click="editUser(user)" v-show="user.role != 'admin'">
              {{ $t('edit') }}</button>
            <button type="button" class="btn btn-danger btn-sm"  v-if="$store.state.AppActiveUser.email != user.email" @click="deleteUserAlert(user.id)" v-show="user.role != 'admin'">{{ $t('delete') }}</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
</style>

<script>
import swal from 'sweetalert'
const axios = require('axios')

export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Easy123 Assistant - Users List',
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

      // let appActiveUser = this.$store.state.AppActiveUser
      // console.log('AppActiveUser', appActiveUser)

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/assistant/get-users/',{})
          .then((response) => {
            if(response.data.status)
            {
              self.users = response.data.data
            }
            else
            {
              swal(self.getTranslation('server_error_occurred_please_contact_admin'), {
                icon: "warning",
              })
            }

            //console.log(self.users)
          }, (error) => {
            console.log(error)
          })
    },
    /** get members title **/
    getMembersTitle() {
      if(this.users.length)
      {
        let user = this.users.find(obj => obj.role == 'user')
        return this.$t('assistant_module.accounts_name', {nickname: user.nickname})
        //return user.nickname+"'s Account"
      }
      else {
        return ""
      }

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
    editUser(user) {
      this.$router.push('/assistant/member/'+user.id+'/edit/')
    },
    /** redirect to user view **/
    viewAsUser(user) {
      this.$store.commit('SET_LAYOUT', 'simple-layout')
      //this.$router.push('/assistant/member/'+user.id+'/view-as-user')
      this.$router.push('/'+user.id+'?type=viewasuser')
    },
    /** redirect to user screensaver view **/
    checkScreenSaver(user) {
      this.$store.commit('SET_LAYOUT', 'simple-layout')
      //this.$router.push('/assistant/member/'+user.id+'/view-as-user')
      this.$router.push('/'+user.id+'?type=viewasuser&screensaver=true')
    },
    /** get user nickname **/
    getNickname(nickname)
    {
      if(nickname)
        return nickname
      else
        return ""
    }
  }
}
</script>