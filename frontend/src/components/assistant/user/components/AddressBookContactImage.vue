<template>
  <div>
    <img v-if="!loading" :src="localImage" alt="" style="max-width: 200px; max-height: 200px;">
    <span class="mt-3" v-if="loading">Loading...</span>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<script>

import axios from "axios";
import swal from "sweetalert";

export default {
  name: 'AddressBookContactImage',
  props: ['image'],
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
    //this.formateImage(this.image)
    //this.localImage = this.image
  },
  methods: {
    formateImage(val) {
      //console.log("val", val)
      let self = this
      //check if object
      if(val.avatarName)
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
              path: val.avatarPath,
              name: val.avatarName
            }
          })
          .then((response) => {
            self.loading = false
            if(response.data.status)
            {

              let imageData = response.data.data

              let b64 = 'data:'

              b64 = b64 + val.avatarMIME
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