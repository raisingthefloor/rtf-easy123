<template>
  <div>
    <img v-if="!loading" :src="localImage" :alt="image.avatarName" 
      :height="height" :width="width"
      style="max-width: 200px; max-height: 200px;">
    <span class="mt-3" v-if="loading">{{loadingText}}</span>
  </div>
</template>

<style scoped src="@/assets/bootstrap-5/css/bootstrap.css">
</style>

<script>

import axios from "axios";

export default {
  name: 'AddressBookContactImage',
  props: ['image', 'height', 'width'],
  data() {
    return {
      localImage: null,
      loading: false
    }
  },
  computed:{
    loadingText(){
      let text = "Loading ...";

      if(this.height == 70 && this.width == 70){
        text = "...";
      }
      return text; 
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
      console.log("val", val)
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
            let imageData = response.data.data

            let b64 = 'data:'

            b64 = b64 + val.avatarMIME
            b64 = b64 + ';base64,'
            b64 = b64 + imageData
            self.localImage = b64
            //emitting an event that updates the original object with imageData
            self.$emit('privateImageLoaded', {id:self.image.id, imageData});

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