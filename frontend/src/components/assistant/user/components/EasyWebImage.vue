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
    <img v-if="!loading && !folderthumb" :src="localImage" alt="" style="max-width: 200px; max-height: 152px;">
    <img v-if="!loading && folderthumb" :src="localImage" alt="" style="max-width: 65px;">
    <span class="mt-3" v-if="loading">{{ $t('loading_progress') }}</span>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<script>

import axios from "axios";
import swal from "sweetalert";

export default {
  name: 'EasyWebImage',
  props: ['image', 'folderthumb'],
  data() {
    return {
      localImage: null,
      loading: false
    }
  },
  watch: {
    image: function (newVal)
    {
      this.formateImage(newVal)
      //this.localImage = newVal
    }
  },
  mounted() {
    this.formateImage(this.image)
    //this.localImage = this.image
  },
  methods: {
    formateImage(val) {
      let self = this
      //check if object
      if(val.imagePath)
      {
        if(val.imageData)
        {
          let b64 = 'data:'

          b64 = b64 + val.imageMimeType
          b64 = b64 + ';base64,'
          b64 = b64 + val.imageData
          self.localImage = b64
        }
        else
        {
          this.loading = true
          //check if image data is available
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
            photo: {
              path: val.imagePath,
              name: val.imageFileName
            }
          }).then((response) => {
            self.loading = false
            if(response.data.status)
            {
              let imageData = response.data.data

              let b64 = 'data:'

              b64 = b64 + val.imageMimeType
              b64 = b64 + ';base64,'
              b64 = b64 + imageData
              self.localImage = b64
            }
            else {
              swal(self.$t('server_error_occurred_please_contact_admin'), {
                icon: "warning",
              })
            }



          }, (error) => {
            console.log(error)
            swal(self.$t('server_error_occurred_please_contact_admin'), {
              icon: "warning",
            })
            self.loading = false
          })
        }



      }
      else
      {
        this.localImage = val.image
      }
    }
  }
}
</script>