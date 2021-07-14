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