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
  <div :id="mail.messageId" class='polaroid' :r='mail.r' :t='mail.t' :in='mail.in' @mousedown="thisMousedown($event)" @mouseup="thisMouseup($event)">
    <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
    <div class='envcontents' style='display:none; width:355px'>
      <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
      <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
      <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
        <img id='paper' src='mail/paper2.png' />
        <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
          <iframe :srcdoc="getDecodedMailBody" frameborder="0" style="height: 535px; width: 430px;"></iframe>
          <button class='reply' @click="replyClick($event)" style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button>
          <button class='close' @click="closeClick($event, mail)" style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>
          <button class='throwaway' @click="throwawayClick($event, mail.messageId)" style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>
        </div>
      </div>
      <img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/>
      <img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>
    </div>

    <div id='frontcontents' style='display:none;'>
      <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
      <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>{{ strip_html_tags(mail.from) }}</div>
      <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px' class="mail-to"> To</div>
      <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> {{ strip_html_tags(mail.to) }}</div>
      <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333' class="mail-subject">About:
        {{ strip_html_tags(mail.subject) }}</div>
      <input type="hidden" name="mail_subject" id="mail-subject" :value="mail.subject">
      <input type="hidden" name="mail_header_from" id="mail-header-from" :value="mail.from">
      <input type="hidden" name="message_id" id="mail-header-message-id" :value="mail.messageId">
      <!--<input type="hidden" name="references" id="mail-header-references" :value="findMailHeader('References')"> -->
      <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'>
        {{ mail.date }}</div>

      <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
      <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
      <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
      <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

    </div>

  </div>
</template>

<script>
import * as moment from 'moment';
import axios from 'axios';
export default {
  name: 'Polaroid2',
  props: {
    mail: {
      type: Object,
      required: true
    }
  },
  mounted() {
    //console.log("mounted", moment())
    if(this.hasAttachments()){
      this.parseAttachments();
    }
  },
  computed: {
    getMailBody() {
      if(this.mail.body)
      {
        return this.mail.body
      }
      /*else if(this.mail.decoded_body)
      {
        return this.mail.decoded_body[0]
      }*/
      else {
        return  ""
      }
      /*if(this.mail.payload.parts && this.mail.payload.parts[0])
      {
        //console.log("decode", this.mail.payload.parts[0].body.data)
        return atob(this.mail.payload.parts[0].body.data)
      }

      else
        return ''*/
    },
    getDecodedMailBody() {
      if(this.mail.html)
      {
        return this.mail.html
      }
      return this.mail.text
    }
  },
  methods: {
    //find header with name from the mail.payload.headers
    findMailHeader(header_name){
      if(header_name == "Date")
      {
        return moment(this.mail.payload.headers.find(x => x.name === header_name).value).format('MM.DD.YYYY')
      }
      let header = this.mail.payload.headers.find(x => x.name === header_name);
      if(header)
      {
        return header.value
      }
      else {
        return ''
      }
    },
    thisMousedown(event) {
      this.$emit('mousedown', event)
    },
    thisMouseup(event) {
      this.$emit('mouseup', event)
    },
    replyClick(event) {
      this.$emit('replyClick', event)
    },
    closeClick(event, mail) {
      if(!mail.attrs.flags.includes("\\Seen")){
        let uid = mail.attrs.uid;
        axios.put(process.env.VUE_APP_API_HOST_NAME+`/api/message/${uid}/set-flag/seen`)
          .then(response => {
            console.log(response);
            //this.$emit('closeClick', event);
          })
          .catch(err => console.log(err));
      }
      this.$emit('closeClick', event);
    },
    throwawayClick(event, messageId) {
      let payload = {event, messageId};
      this.$emit('throwawayClick', payload);
    },
    strip_html_tags(str)
    {
      if ((str===null) || (str===''))
        return false;
      else
        str = str.toString();
      return str.replace(/<[^>]*>/g, '');
    },

    hasAttachments(){
      return this.mail.attachments.length
    },

    parseAttachments(){
      //check if mail body has a body tag
      let index = this.mail.html.indexOf("</body>");
      let attachmentHTML = `<hr /><p style="font-weight:bold">${this.mail.attachments.filter(attachment => attachment.filename).length} attachments</p>`;
      if(index !== -1){
        this.mail.html = [this.mail.html.slice(0, index), attachmentHTML, this.mail.html.slice(index)].join(' ');
      }
      else{
        this.mail.html += attachmentHTML;
      }
      //Create a download url for each attachment
      for(let attachment of this.mail.attachments){
        //has a file attachment
        if(attachment.filename){
          let blobData = new Blob([new Uint8Array(attachment.content.data)], {type: attachment.contentType});
          let blobURL = URL.createObjectURL(blobData);
          let fileLinks = `<p style="background-color:#d4cdcd73;border: 1px solid transparent;font-weight: bold;padding: 4px 4px 4px 8px;"><a style="text-decoration:none" href="${blobURL}" download="${attachment.filename}" title="Click to download attachment">
            ${attachment.filename} <span style="color:#777">(${Math.round(attachment.size / 1000)}K</span>)
            </a></p>`
          let index = this.mail.html.indexOf("</body>");
          //console.log(anchor, index);
          if(index !== -1){
            //
            this.mail.html = [this.mail.html.slice(0, index), fileLinks, this.mail.html.slice(index)].join(' ');
          }
          else{
            this.mail.html += fileLinks;
          }
        }
      }
    }
  }
}
</script>