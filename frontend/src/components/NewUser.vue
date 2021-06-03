<template>
  <div>
    <div style="text-align: center;
    padding: 5rem;
    margin: auto;">
      <h4>New User</h4>
      <form @submit.prevent="formSubmit">
        <p v-show="showError" style="color: red; font-size: 12px;">
          Please fill all details correctly <br>
          <b>Name</b> should be a string <br>
          <b>Password</b> should be a string of 8 char long
        </p>
        <div>
          <input type="text" name="email" v-model="email" readonly="readonly" disabled="disabled">
        </div>
        <div>
          <input type="text" name="name" v-model="name" placeholder="Name" required>
        </div>
        <div>
          <input type="password" name="password" v-model="password" placeholder="Password" min="8" max="15" required>
        </div>
        <div>
          <input type="submit">
        </div>
      </form>
    </div>



  </div>
</template>

<script>
const axios = require('axios')

export default {
  name: 'NewUser',
  data() {
    return{
      id: null,
      email: null,
      name: null,
      password: null,
      user: {},
      showError: false
    }
  },
  mounted() {
    this.getUser()
  },
  methods: {
    getUser() {
      var self = this
      this.id = this.$route.params.id

      axios.post(self.$apiHostname+'/api/get-user/',{
        id: self.id
      })
      .then((response) => {
        let user = response.data
        if(!user.length)
          this.$router.push({ name: 'Login' })

        self.user = user[0]
        self.email = self.user.email
      }, (error) => {
        console.log(error);
      })
    },
    formSubmit()
    {
      var self = this
      if(!this.id || !this.name || !this.password || this.password.length < 8)
      {
        this.showError = true
        return
      }

      axios.post(self.$apiHostname+'/api/save-new-user/',{
        id: self.id,
        email: self.email,
        password: self.password,
        name: self.name
      })
      .then((response) => {
        if(response.data && response.data.ok)
        {
          self.$router.push({'name': 'HomeWorking'})
        }
      }, (error) => {
        console.log(error);
      })


    }
  }
}
</script>