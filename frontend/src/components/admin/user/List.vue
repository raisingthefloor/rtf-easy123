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
    <div class="table-responsive">
      <table class="table mt-5">
        <thead>
        <tr>
          <th scope="col">Assistant Name</th>
          <th scope="col">Assistant Email</th>
          <th scope="col">Account Name</th>
          <th scope="col">Account Nickname</th>
          <th scope="col">Role</th>
          <th scope="col">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.account_name }}</td>
          <td>{{ user.account_nickname }}</td>
          <td style="text-transform: capitalize;">{{ user.role }}</td>
          <td>
<!--            <button type="button" class="btn btn-danger btn-sm" @click="deleteUser(user.id)" v-show="user.role != 'admin'">Delete</button>-->
            <button type="button" class="btn btn-danger btn-sm" @click="deleteUserAlert(user.id)" v-show="user.role != 'Admin'">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <nav class="float-end" v-if="tableConfig.totalRecords > tableConfig.perPage">
        <ul class="pagination">
          <li class="page-item" v-for="(page, index) in pages" :key="'pagination_'+index" v-bind:class="{ 'disabled': page.disable,  'active': page.active}">
            <a class="page-link" href="javascript:void(0)" @click="pageNumberClicked(page)">{{ page.name }}</a>

          </li>
        </ul>
      </nav>
    </div>

  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.min.css">
</style>

<script>
import swal from 'sweetalert';
const axios = require('axios')
/*import DataTable from "@andresouzaabreu/vue-data-table";
import "bootstrap/dist/css/bootstrap.min.css";*/

export default {
  name: 'NewUser',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Easy123 Users',
  },
  components: {
    //DataTable
  },
  data() {
    return {
      users: [],
      tableConfig: {
        perPage: 50,
        sortBy: "updatedAt",
        sortByOrder: 1,
        page: 1,
        totalRecords: 0,
      }
    }
  },
  mounted() {
    this.getUsers()
  },
  watch: {
    'tableConfig.page': {
      handler: function () {
        this.getUsers()
      },
      deep: true
    }
  },
  computed: {
    bindings() {
      return {
        columns: [
          {
            key: "name",
            title: "Assistant Name"
          },
          {
            key: "email",
            title: "Assistant Email"
          },
          {
            key: "account_name",
            title: "Account Name"
          },
          {
            key: "account_nickname",
            title: "Account Nickname"
          },
          {
            key: "role",
            title: "Role"
          },
        ],
        data: this.users,
        /* other props...*/
        actionMode: "multiple",
      }
    },
    pages() {
      let pageObjs = []
      let totalPages = Math.ceil(this.tableConfig.totalRecords/this.tableConfig.perPage)

      if(this.tableConfig.page == 1)
      {
        pageObjs.push({
          disable: true,
          active: false,
          name: "Previous",
          params: {
            page: 0
          }
        })
      }
      else {
        pageObjs.push({
          disable: false,
          active: false,
          name: "Previous",
          params: {
            page: 0,
            action: 'previous'
          }
        })
      }

      for (let i = 1; i <= totalPages; i++) {
        let tempObj = {
          disable: false,
          active: false,
          name: i,
          params: {
            page: i
          }
        }
        if(this.tableConfig.page == i)
        {
          tempObj.active = true
        }
        pageObjs.push(tempObj)
      }

      if(totalPages == this.tableConfig.page)
      {
        pageObjs.push({
          disable: true,
          active: false,
          name: "Next",
          params: {
            page: 0
          }
        })
      }
      else {
        pageObjs.push({
          disable: false,
          active: false,
          name: "Next",
          params: {
            page: 0,
            action: 'next'
          }
        })
      }

      return pageObjs
      //if(totalPages == this.tableConfig.page)
      //Math.ceil(total_items/limit)
    }
  },
  methods: {
    getUsers() {
      var self = this

      //let appActiveUser = this.$store.state.AppActiveUser
      //console.log('AppActiveUser', appActiveUser)

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/admin/get-users/',{
        tableConfig: self.tableConfig
      })
      .then((response) => {
        self.users = response.data.data.users
        self.tableConfig.totalRecords = response.data.data.total
        //console.log(self.users)
      }, (error) => {
        console.log(error)
      })
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
    },

    handleAction(actionName, data) {
      console.log(actionName, data);
      window.alert("check out the console to see the logs");
    },

    pageNumberClicked(obj)
    {
      //console.log("pageNumberClicked", obj)

      if(obj.params.action && obj.params.action == "next")
      {
        this.tableConfig.page++
      }
      else if(obj.params.action && obj.params.action == "previous")
      {
        this.tableConfig.page--
      }
      else if(this.tableConfig.page != obj.name)
      {
        this.tableConfig.page = obj.name
      }
    }
  }
}
</script>