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
          <th scope="col">{{ $t('admin_module.assistant_name') }}</th>
          <th scope="col">{{ $t('admin_module.assistant_email') }}</th>
          <th scope="col">{{ $t('admin_module.account_name') }}</th>
          <th scope="col">{{ $t('admin_module.account_nickname') }}</th>
          <th scope="col">{{ $t('admin_module.role') }}</th>
          <th scope="col">{{ $t('admin_module.actions') }}</th>
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
            <button type="button" class="btn btn-danger btn-sm" @click="deleteUserAlert(user.id)" v-show="user.role != 'Admin'">{{ $t('delete') }}</button>
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
            title: this.$t('admin_module.assistant_name')
          },
          {
            key: "email",
            title: this.$t('admin_module.assistant_email')
          },
          {
            key: "account_name",
            title: this.$t('admin_module.account_name')
          },
          {
            key: "account_nickname",
            title: this.$t('admin_module.account_nickname')
          },
          {
            key: "role",
            title: this.$t('admin_module.role')
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
          name: this.$t('previous'),
          params: {
            page: 0
          }
        })
      }
      else {
        pageObjs.push({
          disable: false,
          active: false,
          name: this.$t('previous'),
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
          name: this.$t('next'),
          params: {
            page: 0
          }
        })
      }
      else {
        pageObjs.push({
          disable: false,
          active: false,
          name: this.$t('next'),
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
        title: this.$t("swal_delete_title"),
        text: this.$t("swal_delete_text"),
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

    pageNumberClicked(obj)
    {
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