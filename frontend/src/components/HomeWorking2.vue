<template>
  <div>
    <div id="containment-wrapper" >
      <a class="button"
         :style="{
            'left': '0px',
            'top': '0px'
          }"
         id="mail" ref="mail" @click="mailClick()" href="javascript:void(0)">
        <div id="mailbox_cont">
          <img  id="mailbox" ref="mailbox" src="mail/mailbox_c.png" />
        </div>

        <div  style=" position:absolute; left:55%; z-index:2; top:0%">
          <img  align='right' src='mail/call1.png' width="110" height="110" alt='' style="z-index:2;" />
        </div>
        <div style=" position:absolute; position:absolute; left:69%; top:10%; z-index:3; width: 130px">
          <h3>
            <b id="new_emails" style='color:#ffffff; font-size: 24px'>3 New </b>
          </h3>
        </div>
      </a>
      <a class="button"
         :style="{
            'left': `0px`
         }"
         href="javascript:void(0)" id="palbum" ref="palbum">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-80px; margin-left:-88px; z-index:3"><img width="175" height="175" id="palbumimg" src="mail/album2.png" /> </div>
      </a>
      <a class="button"
         :style="{
          'left': '0px'
         }"
         href="javascript:void(0)" id="icontact" ref="icontact">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-70px; margin-left:-75px; z-index:3">
          <img id="palbumimg" src="mail/contact.png" />
        </div>
      </a>

      <div id="drag-wrapper"
           :style="{
                  'height': `calc(${$store.getters.getViewportHeight}px)`,
                  'width': `calc(${$store.getters.getViewportWidth}px)`,
                  'left': 225+'px',
                  'top': '0px',
                  'position': 'absolute'
           }"
      ></div>
      <p class='pin' style=" display:none">hello</p>

      <img src="mail/trash_ball.png" style="display:none"/>
      <img src="mail/tray_envelope1.png" style="display:none"/>
      <img src="mail/tray_envelope2.png" style="display:none"/>


      <Polaroid v-for="polaroid in polaroids" :key="polaroid.id" :polaroid="polaroid" :polaroid_config="polaroid_config"></Polaroid>



      <div id="photocontent"></div>
    </div>

    <Flap
        v-show="flap_show"
        v-for="(flap_letter, index) in flap_letters"
        :letters="flap_letter"
        :key="index"
        :t="50 + (47 * index)"
        :top="flap_tops[index]"
    ></Flap>

    <div id="person" ref="person" style= "position:absolute;left:60px; top:306px;    width:120px; height:143px;border : 1px solid #f0e9eb; display:none; z-index: 3; background-color: #fefefe;     ">
      <div id="person_contact" ref="person_contact" style="display:none;">
        <img id="person_pic" src="contacts/gregg.gif" width="128" height="128" style="margin:30px;"/>
        <div id="person_name" align="left" style="padding-left:0px;position:absolute; left:188px; top:80px; font-size: 30px"></div>
        <div id ="options" style="position:absolute; left: -1px; top: 203px;" align="center">

          <a class="large awesome reply" href="javascript:void(0)">
            <img align="left" style="padding:0px" src="images/mail2.png"  />
            <div id="email" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Write Email to Gregg</div>
          </a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/phone1.png"  ><div id="call" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Call Gregg</div></a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/stack3.png" width="70" height="70" ><div id="photo" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">View Gregg's Photos</div></a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/Chat.png"  ><div  id="chat" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Chat with Gregg</div></a>
        </div>
      </div>
    </div>

    <Spiral
        v-show="spiral_show"
        v-for="(n, index) in 7"
        :key="'spiral'+index"
        :top="80 + (80 * (n - 1))"
    ></Spiral>


    <div id="contact" style="position:absolute;left:60px; top:306px; z-index:2;   width:120px; height:143px; display:none">

      <table id="newspaper-b" style="display:none">

        <tbody>
        <tr id="0" ref="people_ref_0" class="contact" style="height:95px;">
          <td style="padding-right:0px; margin:0px; width: 100px"><img id="contact_pic" src="contacts/Adam.jpg" width="70" height="70" /></td>
          <td id="contact_name" align="left" style="padding:0px; margin: 0px;" >Adam Smith</td>
        </tr>

        <tr id="1" ref="people_ref_1" class="contact" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Anna.jpg" width="70" height="70" style="" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Anna Johnson</td>
        </tr>

        <tr id="2" ref="people_ref_2" class="contact" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Becky.jpg" width="70" height="70" style="" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Becky Jones</td>
        </tr>

        <tr id="3" ref="people_ref_3" class="contact" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        <tr id="4" ref="people_ref_4" class="contact" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        <tr class="contact" id="5" ref="people_ref_5" style="height:95px;">
          <td style="padding-right:0px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        </tbody>
      </table>
    </div>

    <img src="mail/trash1_1.png" class="trash1 trash csstrash" v-show="trash1_show"
         :style="{
            'position': 'absolute',
            'left': `${$store.getters.getTrashX}px`,
            'top': `${$store.getters.getTrashY}px`
         }"
    />
    <img src="mail/trash1_2.png" class="trash2 trash csstrash" ref="trash2" v-show="trash2_show"
         :style="{
            'position': 'absolute',
            'left': `${$store.getters.getTrashX}px`,
            'top': `calc(${$store.getters.getTrashY}+37)px`
         }"
    />
    <img src="mail/desk.png" class="tray csstrash tray-extra" ref="tray" v-show="tray_show"
         :style="{
            'position': 'absolute',
            'left': '300px'
          }"
         width="133" height="133" />
  </div>
</template>
<script type="text/javascript" src="jquery/jquery-1.3.2.js"></script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>
<script>
const axios = require('axios')
import Polaroid from "./working/Polaroid"
import Flap from "./working/Flap"
import Spiral from "./working/Spiral"


function randomXToY(minVal,maxVal,floatVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

export default {
  name: 'HomeWorking2',
  components: {
    "Polaroid": Polaroid,
    "Flap": Flap,
    "Spiral": Spiral
  },
  data() {
    return {
      dragging: 0,
      W: screen.width,
      H: screen.height,
      filter: 0,
      filter2: 0,
      deletedEmail: null,
      openedDeleted: null,
      lastDragged: null,
      trayEmails: [],
      trayEmailsFlag: [],
      trayptr: 1,
      contactOpened: 0,
      mailOpened: 0,
      albumOpened: 0,
      loadingPhotos: 1,
      MARGIN: 0,
      buttonwidth: 0,
      savez: 0,
      USERNAME: "Eleanor",
      USERPIC: "contacts/Martha.jpg",
      destination: null,

      isPerson: 0,
      people: [],
      viewportwidth: null,
      viewportheight: null,
      z: 1,
      curr_index: null,
      trash_x: null,
      trash_y: null,

      moimg: null,
      mcimg: null,

      unreadMails: [],
      ///////

      flap_letters: [
          "A B",
          "C D",
          "E F",
          "G H",
          "I J",
          "K L",
          "K L",
          "M N",
          "O P",
          "Q R",
          "S T",
          "U V",
          "W X",
          "Y Z",
      ],
      flap_tops: [
          61,
          109,
          156,
          203,
          250,
          297,
          344,
          391,
          438,
          485,
          532,
          579,
          626
      ],
      flap_show: false,
      spiral_show: false,
      contact_hide: true,
      person_hide: true,
      tray_show: true,
      trash1_show: true,
      trash2_show: true,
      polaroids: [],
      polaroid_config: []
    }
  },
  computed: {
    getPolaroids() {
      return this.$store.getters.getPolaroids
    }
  },
  watch: {
    '$store.state.polaroids': function(newVal, oldVal)
    {
      console.log("polaroids changed")
    },
    polaroids: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal)
      {
        console.log("polaroids changed home watch")
      }
    },
    polaroid_config: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal)
      {
        console.log("polaroids polaroid_config changed home watch")
      }
    }
  },
  mounted() {
    console.log("hostname")
    this.initMount()
  },
  methods: {
    initMount() {
      var self = this

      //console.log(self.$store.state)

      //get unread mails
      axios.get(self.$apiHostname+'/api/get-unread-mails/', {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:8080"
        }
      })
      .then(function (response) {
        console.log(response.data);
        //set polaroid
        self.$store.commit('SET_POLAROID', response.data)
        for (let j = 0; j < response.data.length; j++)
        {
          response.data[j].easyconfig = {
            r: 'unread',
            t: 'none',
            in: 'c'
          }
          self.polaroid_config[j] = {}
          if((j+1) == response.data.length)
          {
            self.polaroids = response.data
          }
        }

      })
      .catch(function (error) {
        console.log(error);
      });

      let t = 50
      let i = 0

      if (typeof window.innerWidth != 'undefined')
      {
        this.$store.commit('SET_VIEWPORT_WIDTH', window.innerWidth)
        this.$store.commit('SET_VIEWPORT_HEIGHT', window.innerHeight)
      }
      // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
      else if (typeof document.documentElement != 'undefined'
          && typeof document.documentElement.clientWidth !=
          'undefined' && document.documentElement.clientWidth != 0)
      {
        this.$store.commit('SET_VIEWPORT_WIDTH', document.documentElement.clientWidth)
        this.$store.commit('SET_VIEWPORT_HEIGHT', document.documentElement.clientHeight)
      }
      // older versions of IE
      else
      {
        this.$store.commit('SET_VIEWPORT_WIDTH', document.getElementsByTagName('body')[0].clientWidth)
        this.$store.commit('SET_VIEWPORT_HEIGHT', document.getElementsByTagName('body')[0].clientHeight)
      }

      let palbum_top = parseInt(this.getCss(this.$refs.mail, 'margin-right'), 10) + parseInt(this.getCss(this.$refs.mail, 'height'), 10)
      this.$refs.palbum.style.top = palbum_top+'px'

      let icontact_top = (2 * parseInt(this.getCss(this.$refs.palbum, 'margin-right'), 10)) + (2 * parseInt(this.getCss(this.$refs.palbum, 'height'), 10))
      this.$refs.icontact.style.top = icontact_top+'px'

      let trash2_top = this.$store.getters.getTrashY + 37
      this.$refs.trash2.style.top = trash2_top + 'px'

      let tray_top = this.$store.getters.getTrashY + 5
      this.$refs.tray.style.top = tray_top + 'px'

      this.z = 1
    },


    mailClick() {
      var self = this
      var a1 = this.getCss(this.$refs.mail, 'top')
      var top = parseInt((a1.substring(0, a1.length-2)));
      var left = this.getCss(this.$refs.mail, 'left')
      var left = parseInt((left.substring(0, left.length-2)));
      var margin = this.getCss(this.$refs.mail, 'margin-right')
      var margin = parseInt((margin.substring(0, margin.length-2)));
      var width = this.getCss(this.$refs.mail, 'width')
      var width = parseInt((width.substring(0, width.length-2)));
      var cssop = {top:'0px',left:'0px'};
      var delay=0;
      console.log("mailOpnened", this.$store.getters.getMailOpened)
      if(self.$store.getters.getMailOpened == 0)
      {

        if(self.$store.getters.getMailOpened == 1)
        {
          self.albumOpened=0;
          this.albumin();
          delay=1000;
        }

        if(self.$store.getters.getMailOpened == 1)
        {
          self.contactOpened=0;
          self.contactin();
          delay=1000;
        }

        setTimeout(function(){
          //return;
          self.$store.commit('SET_MAIL_OPENED', 1)
          self.tray_show = true
          self.trash1_show = true
          self.trash2_show = true

          self.$refs.mailbox.src = "mail/mailbox_o.png"

          self.$refs.mailbox.style.right = "34%"

          var a1 = parseInt(self.getCss(self.$refs.mail, 'top'), 10)
          // $('#mailinbox').show();
          top=0;
          margin = self.$store.getters.getMargin;
          left=0;

          //cssop.top = top+margin+130+'px';
          //cssop.left = left+margin+175+'px';

          //self.$store.commit('SET_POLAROID_CLASS', cssop)

          //$('.polaroid').css(cssop);
          var cnta=0;

          /*self.polaroids.forEach(function(item, index)
          {
            if(!item.easyconfig)
            {
              item.easyconfig = {}

            }
            item.easyconfig.mailinbox_show = true
            item.mailinbox_show = true
            self.polaroid_config[index].mailinbox_show = true
            self.deepChange(self.polaroid_config)
            //self.polaroid_config.__ob__.dep.notify()
          })*/

          for (let i = 0; i < self.polaroids.length; i++)
          {
            let easyconfig = {
              r: 'unread',
              t: 'none',
              in: 'c'
            }
            if(!self.polaroids[i].easyconfig)
            {
              self.polaroids[i].easyconfig = {
                r: 'unread',
                t: 'none',
                in: 'c'
              }
            }
            easyconfig = JSON.parse(JSON.stringify(self.polaroids[i].easyconfig))
            easyconfig.mailinbox_show = true
            self.polaroids[i].easyconfig.mailinbox_show = true
            //Vue.set(self.polaroids[i].easyconfig, 'mailinbox_show', true)
            //arr.splice(indexOfItem, 1, newValue)
            self.polaroid_config.splice(i, 1, true)
            //self.deepChange(self.polaroids)

            //console.log("polaroid_config", self.polaroid_config)
            easyconfig.mailinbox_show = true
            //self.deepChange(self.polaroids)
            //self.polaroids[i].easyconfig.top = top + margin + 130 + 'px'
            easyconfig.top = top + margin + 130 + 'px'
            easyconfig.left = left + margin + 175 - ( i % 5 ) * 3 - self.$store.getters.getButtonwidth - self.$store.getters.getMargin + 'px'




            if(!self.polaroids[i].easyconfig.type)
            {
              easyconfig.type = 'none'

            }
            let type = self.polaroids[i].easyconfig.type
            let oc = self.polaroids[i].easyconfig.r

            if(type == "trash")
            {

            }
            else if (type == "tray")
            {

            }
            else
            {
              easyconfig.show = true
              //self.deepChange(self.polaroids)
              var sub = 0
              if(self.trayptr > -1)
                sub = self.trayptr + 1

              if(self.deletedEmail != undefined)
                sub = sub + 1

              let csstop_left = parseInt(easyconfig.left, 10) + 150
              let csstop_top = parseInt(easyconfig.top, 10) + 60

              easyconfig.left = csstop_left + 'px'
              easyconfig.top = csstop_top + 'px'
              //self.deepChange(self.polaroids)

              easyconfig.mailinbox_show = false

              easyconfig.envcontents_show = true

              //self.deepChange(self.polaroids)

              if(self.polaroids[i].easyconfig.in == "c")
              {
                easyconfig.frontcontents_show = true
                //self.deepChange(self.polaroids)
              }
              else
              {
                easyconfig.frontcontents_show = false
                //self.deepChange(self.polaroids)
              }

              if(self.polaroids[i].easyconfig.r == "read")
              {
                easyconfig.rot2_show = true
                //self.deepChange(self.polaroids)
                easyconfig.frontcontents_position = 'absolute'
                //self.deepChange(self.polaroids)
                easyconfig.envelope_src = 'mail/envelope.png'
                easyconfig.envelope_top = '128px'
                //self.deepChange(self.polaroids)
                easyconfig.frontcontents_top = '128px'
              }

              let this_top = parseInt(easyconfig.top, 10)
              this_top = (this_top - 100) + 'px'

              var rotDegrees = self.randomXToY(130, 500)
              var rotDegreesy = self.randomXToY(0, 300)
              var tempVal = Math.round(Math.random())

              if(tempVal == 1)
              {
                rotDegrees = self.randomXToY(355, 360) // rotate left
              } else {
                rotDegrees = self.randomXToY(5, 10) // rotate right
              }

              var cssObj = {
                '-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
                'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
              rotDegrees = self.randomXToY(width+25+50,self.viewportwidth-700-225 );
              rotDegreesy = self.randomXToY(200,self.viewportheight-700);

              easyconfig.left = 225 + rotDegrees + 'px'
              this_top = parseInt(easyconfig.top, 10)
              easyconfig.top = this_top + rotDegreesy + 'px'

              self.polaroids[i].easyconfig = easyconfig
              self.deepChange(self.polaroids)
            }

          }




        },delay);
        //self.deepChange(self.polaroids)
      }
      else if(this.mailOpened==1)
      {
        this.mailOpened=0;
        self.mailin(self.mcimg);

      }
    },

    getInt(a) {
      return parseInt((a.substring(0, a.length-2)));
    },
    getCss(element, property) {
      return window.getComputedStyle(element).getPropertyValue(property)
    },
    randomXToY(minVal,maxVal,floatVal) {
      let randVal = minVal+(Math.random()*(maxVal-minVal));
      return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
    },
    mailin(mcimg) {
      console.log("You are in mailin")
      this.MARGIN=25;
      var TOP=0;
      var LEFT=0;
      var WIDTH=200;
      var a1=$('#mail').css('top');
      var top=parseInt((a1.substring(0, a1.length-2)));
      var left=$('#mail').css('left');
      left=parseInt((left.substring(0, left.length-2)));
      var margin=$('#mail').css('margin');
      margin=parseInt((margin.substring(0, margin.length-2)));
      var width=$('#mail').css('width');
      width=parseInt((width.substring(0, width.length-2)));
      var cssop={top:'0px',left:'0px',position:'absolute'};

      var ani=1;
      var cnta=0;
      $(".polaroid").each(function () {
        //alert(top+'jasldf'+$('a').css('margin'));

        cssop.top=0+25+130+60+'px';
        cssop.left=0+25+175+90-(ani % 5)*3+'px';

        ani++;

        //alert(cssop.left);
        $(this).animate(cssop,300,function(){
          $(this).find('#mailinbox').show();
          $(this).find('#frontcontents').hide();
          $(this).find('.envcontents').hide();
          $(this).find('#rot2').hide();
          cnta++;
          if(cnta==$(".polaroid").length)
          {
            var cnt=0;
            $(".polaroid").each(function () {
              //alert($(this).find('#envelope').attr('src'));

              $(this).animate({
                left: '+='+'-90',
                top: '+='+'-60'
              }, 400,function(){

                cnt++;
                if(cnt==$(".polaroid").length)
                {
                  $('.polaroid').hide();
                  $('#mailbox').remove();
                  $('#mailbox_cont').append(mcimg);
                  $('#mailbox_cont').css('right','0%');
                }
              });
            });
          }
        });
      });
    },
    albumin() {
      console.log("you are in albumin")
      $('.photos').removeClass('noshadow');
      $('.photos').removeClass('deg1');
      $('.photos').removeClass('deg2');
      $('.photos').removeClass('deg3');
      $('.photos').removeClass('deg4');
      $('.photos').removeClass('deg1neg');
      $('.photos').removeClass('deg2neg');
      $('.photos').removeClass('deg3neg');
      $('.photos').removeClass('deg4neg');
      $('.photos').addClass('degq')
      $('.photos').css('z-index','1');
      $('.photos').animate({'top':'340px','left':'185px','width':'40px','height':'40px','z-index':'1'},1500,function() {
        $('.photos').hide();
      });

      $('#title').hide();
      var album_list=$('#album_list').text().split(",");
      for(var i=0;i<album_list.length-1;i++)
      {
        $("."+album_list[i]+'_caption').hide();
      }
    },
    contactin() {
      var self = this
      $('.polaroid').each(function(){
        var type=$(this).attr('t');
        if(type=='reply')
          $(this).remove();
      });
      $('.trash').hide();

      $('#newspaper-b').hide();
      $(".flap").hide();
      $('.spiral').hide();
      $('#contact').animate({'position':'absolute','left':'60px', 'top':'506px', 'z-index':'2', 'width':'120px', 'height':'143px'},1000,function(){
        $(this).hide();
      });
      $('#person_contact').hide();
      $('#person').animate({'position':'absolute','left':'60px', 'top':'506px', 'z-index':'2', 'width':'120px', 'height':'143px'},1000,function(){
        $(this).hide();
      });
    },


    deepChange(obj) {
      obj.__ob__.dep.notify()
    }
  }
}
</script>