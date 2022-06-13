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
    <vue-webrtc
        ref="webrtc"
        width="100%"
        :roomId="roomId"
        cameraHeight="300"
    />
    Host: {{ createdBy.name }} <br>
    <button @click="leaveVideo" v-if="hasJoined" style="margin:5px;background-color: rgb(108, 117, 125); border: 1px solid transparent; color: rgb(255, 255, 255); text-align: center; text-decoration: none; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.25rem;">Leave</button>
<!--    <input type="text" v-model="roomId">-->
<!--    <button @click="startVideo" v-if="!hasJoined">Start</button>-->

  </div>

</template>

<script>
import axios from 'axios'
import swal from "sweetalert"
export default {
  name: 'VideoCall',
  data() {
    return {
      call: {},
      createdBy:{},
      roomId: "sample-video",
      enableLogs: true,
      autoplay: true,
      hasJoined: false
    }
  },
  computed: {
    getCurrentPageLink() {
      return window.location
    }
  },
  mounted: function () {
    this.getCallData()
    //this.$refs.webrtc.join()
  },
  destroyed() {
    if(this.hasJoined)
    {
      this.$refs.webrtc.leave()
    }
  },
  methods: {
    /** get call data from call id **/
    getCallData() {
      let self = this
      self.roomId = self.$route.params.id
      //console.log(self.$route.query.email)
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/get-call-data", {
        call: self.$route.params.id,
        email: self.$route.query.email
      })
      .then(response => {
        if(response.data.status)
        {
          self.call = response.data.data.call
          self.createdBy = response.data.data.createdBy
          self.startVideo()
        }
        else {
          if(response.data.message == "not_a_valid_link")
          {
            swal(self.$t('home_module.not_valid_link'), {
              icon: "warning",
            })
          }
          else if(response.data.message == "failed") {
            swal(self.$t('home_module.call_not_found'), {
              icon: "warning",
            })
          }
          console.log(response.data)
        }
      }, error => {
        swal(self.$t('server_error_occurred_please_contact_admin'), {
          icon: "warning",
        })
        console.log(error)
      })
    },
    startVideo() {
      this.hasJoined = true
      this.$refs.webrtc.join()
    },
    leaveVideo() {
      this.hasJoined = false
      this.$refs.webrtc.leave()
      this.$router.back()

      if(window.history.length == 1)
      {
        this.$router.push('/')
      }
    }
  }
}
</script>

