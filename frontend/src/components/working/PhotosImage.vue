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
    <img v-if="!loading" :src="localImage" :alt="image.avatarName"
         :height="height" :width="width" style="max-height: 100%; max-width: 100%;">
</template>


<script>

import axios from "axios";
import swal from "sweetalert";

export default {
  name: 'PhotosPhoto',
  props: ['image', 'folder', 'height', 'width'],
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
      this.formatImage(newVal)
      //this.localImage = newVal
    }
  },
  mounted() {
    this.formatImage(this.image)
    //this.formatImage(this.image)
    //this.localImage = this.image
  },
  methods: {
    formatImage(val) {
      //console.log("val", val)
      let self = this
      //check if object
      if(val.path)
      {
        if(!val.imageData)
        {
          this.loading = true
          //check if image data is available
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-private-image", {
            photo: {
              path: val.path,
              name: val.name
            },
            signed: true
          })
          .then((response) => {
            self.loading = false
            if(response.data.status)
            {

              let imageData = response.data.data
              //console.log("imageData", imageData)
              self.localImage = imageData
              let payload = {
                imageData: imageData,
                folder_id: self.folder,
                photo_id: val._id
              }
              console.log("payload", payload)
              self.$store.commit('STORE_HOME_FOLDER_PHOTO_URL', payload)
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
        else
        {
          this.localImage = val.imageData
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