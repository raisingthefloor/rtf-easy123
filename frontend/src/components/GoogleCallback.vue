<template>
  <div>
    <h2 style="text-align: center;">Processing ... </h2>
  </div>
</template>

<script>
const axios = require('axios')
export default {
  name: 'GoogleCallback',
  mounted() {
    this.checkRequestIsCorrect()
  },
  methods: {
    checkRequestIsCorrect() {
      var self = this
      if(!this.$route.query || !this.$route.query.code)
      {
          this.$router.push({ 'name': 'Login' })
      }

      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/googlecallback/',{
        code: self.$route.query.code
      })
      .then((response) => {
        if(response.data.status)
        {
          self.$store.commit('SET_GOOGLE_EMAIL', response.data.data.email)
          self.$router.push({ 'name': 'Login' })
        }
        else
        {
          self.$router.push({ 'name': 'Login' })
        }

      }, (error) => {
        console.log(error);
      })
    }
  }
}
</script>