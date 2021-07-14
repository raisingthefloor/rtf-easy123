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
    <h3>Call</h3>
    <div class="row">
      <div class="col-md-12 my-3">
        <h2>Room</h2>
        <input v-model="roomId">
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="">
          <vue-webrtc ref="webrtc"
                      width="100%"
                      :roomId="roomId"
                      :enable-logs="true"
                      cameraHeight="200"
                      :enableAudio="true"
                      :enableVideo="true"
                      v-on:joined-room="logEvent"
                      v-on:left-room="logEvent"
                      v-on:opened-room="logEvent"
                      v-on:share-started="logEvent"
                      v-on:share-stopped="logEvent"
                      @error="onError" />
        </div>
        <div class="row">
          <div class="col-md-12 my-3">
            <button type="button" class="btn btn-primary" @click="onJoin">Join</button>
            <button type="button" class="btn btn-primary" @click="onLeave">Leave</button>
            <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button>
            <button type="button" class="btn btn-primary" @click="onShareScreen">Share Screen</button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h2>Captured Image</h2>
        <figure class="figure">
          <img :src="img" class="img-responsive" />
        </figure>
      </div>
    </div>
  </div>

</template>
<script>
import Vue from 'vue'
import WebRTC from 'vue-webrtc'

import * as io from 'socket.io-client'
window.io = io
Vue.use(WebRTC)


export default {
  name: 'CallComponent',
  data() {
    return {
      img: null,
      roomId: "plenartech"
    };
  },
  mounted: function () {
    /*this.$refs.webrtc.join()
    console.log("joined ...")*/
  },
  methods: {
    onCapture() {
      this.img = this.$refs.webrtc.capture();
    },
    onJoin() {
      console.log("join clicked")
      this.$refs.webrtc.join();
    },
    onLeave() {
      this.$refs.webrtc.leave();
    },
    onShareScreen() {
      this.img = this.$refs.webrtc.shareScreen();
    },
    onError(error, stream) {
      console.log('On Error Event', error, stream);
    },
    logEvent(event) {
      console.log('Event : ', event);
    },
  }
}
</script>
