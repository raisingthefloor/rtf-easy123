<template>
  <div>
    <img v-if="!loading && !folderthumb" :src="localImage" alt="" style="max-width: 200px; max-height: 152px;">
    <img v-if="!loading && folderthumb" :src="localImage" alt="" style="max-width: 65px;">
    <span class="mt-3" v-if="loading">Loading...</span>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<script>

import axios from "axios";

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
            let imageData = response.data.data

            let b64 = 'data:'

            b64 = b64 + val.imageMimeType
            b64 = b64 + ';base64,'
            b64 = b64 + imageData
            self.localImage = b64

          }, (error) => {
            console.log(error)
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