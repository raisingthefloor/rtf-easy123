<template>
  <div class='polaroid' :r='mail.r' :t='mail.t' :in='mail.in' @mousedown="thisMousedown($event)" @mouseup="thisMouseup($event)">
    <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
    <div class='envcontents' style='display:none; width:355px'>
      <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
      <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
      <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
        <img id='paper' src='mail/paper2.png' />
        <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
          <iframe :srcdoc="getDecodedMailBody" frameborder="0" style="height: 535px; width: 430px;"></iframe>
          <button class='reply' @click="replyClick($event)" style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button>
          <button class='close' @click="closeClick($event)" style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>
          <button class='throwaway' @click="throwawayClick($event)" style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>
        </div>
      </div>
      <img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/>
      <img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>
    </div>

    <div id='frontcontents' style='display:none;'>
      <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
      <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>{{ strip_html_tags(findMailHeader('From')) }}</div>
      <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px' class="mail-to"> To</div>
      <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> {{ strip_html_tags(findMailHeader('To')) }}</div>
      <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333' class="mail-subject">About:
        {{ strip_html_tags(findMailHeader('Subject')) }}</div>
      <input type="hidden" name="mail_subject" id="mail-subject" :value="findMailHeader('Subject')">
      <input type="hidden" name="mail_header_from" id="mail-header-from" :value="findMailHeader('From')">
      <input type="hidden" name="message_id" id="mail-header-message-id" :value="findMailHeader('Message-ID')">
      <input type="hidden" name="references" id="mail-header-references" :value="findMailHeader('References')">
      <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'>
        {{ findMailHeader('Date') }}</div>

      <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
      <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
      <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
      <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

    </div>

  </div>
</template>

<script>
import * as moment from 'moment';
export default {
  name: 'Polaroid2',
  props: ['mail'],
  mounted() {
    //console.log("mounted", moment())
  },
  computed: {
    getMailBody() {
      if(this.mail.decoded_parts)
      {
        return this.mail.decoded_parts[0]
      }
      else if(this.mail.decoded_body)
      {
        return this.mail.decoded_body[0]
      }
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
      if(this.mail.decoded_body)
      {
        return this.mail.decoded_body[0]
      }
      else {
        return this.mail.decoded_parts[0]
      }
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
    closeClick(event) {
      this.$emit('closeClick', event)
    },
    throwawayClick(event) {
      this.$emit('throwawayClick', event)
    },
    strip_html_tags(str)
    {
      if ((str===null) || (str===''))
        return false;
      else
        str = str.toString();
      return str.replace(/<[^>]*>/g, '');
    }
  }
}
</script>