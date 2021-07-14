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
  <div class='polaroid' r='unread' t='none' in='c' :style="{
    'left': localPolaroid.easyconfig.left,
    'top': localPolaroid.easyconfig.top
  }" v-show="localPolaroid.easyconfig.show">
    <img src='mail/mailinbox.png' id='mailinbox' v-show="localPolaroid.mailinbox_show" style='display:none'>
    <div class='envcontents' style='display:none; width:355px' v-show="localPolaroid.easyconfig.envcontents_show">
      <img src='mail/envelope.png' id='envelope'
           :style="{
              'position': 'absolute',
              'top': localPolaroid.easyconfig.envelope_top
            }"
      />
      <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' v-show="localPolaroid.easyconfig.rot2_show" />
      <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
        <img id='paper' src='mail/paper2.png' />
        <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
          Hi Granny, <br>  My birthday is next week and I am really excited about it..  <br><br> It would be awesome if you could join us.. :) <br>Love<br> Becky
          <button class='reply' @click="replyClick($event)" style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button>
          <button class='close' @click="closeClick($event)" style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>
          <button class='throwaway' @click="throwawayClick($event)" style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>
        </div>
      </div>
      <img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/>
      <img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>
    </div>

    <div id='frontcontents'
         :style="{
           'position': localPolaroid.easyconfig.frontcontents_position,
           'top': localPolaroid.easyconfig.frontcontents_top
         }"
         v-show="localPolaroid.easyconfig.frontcontents_show">
      <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
      <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>Becky</div>
      <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div>
      <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> Eleanor</div>
      <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: My Birthday Party!</div>

      <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div>

      <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
      <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
      <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
      <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

    </div>

  </div>
</template>

<script type="text/javascript" src="jquery/jquery-1.3.2.js"></script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>

<script>
export default {
  name: 'Polaroid',
  props: ['polaroid', 'polaroid_config'],
  data() {
    return {
      localPolaroid: {}
    }
  },
  watch: {
    'polaroid': {
      deep: true,
      handler (newVal, oldVal) {
        console.log("polaroid value changed newVal", newVal)
        this.localPolaroid = newVal
      }
    },
    polaroid_config: {
      deep:true,
      handler (newVal, oldVal) {
        console.log("polaroid config value changed")
      }
    }
  },
  created() {
    this.localPolaroid.easyconfig = {}
  },
  mounted() {
    let localPolaroid = this.polaroid
    if(!localPolaroid.easyconfig)
    {
      localPolaroid.easyconfig = {}
    }
    this.localPolaroid = localPolaroid

    //console.log("polaroid", this.polaroid)
  },
  methods: {
  }
}
</script>
