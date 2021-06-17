<template>
  <div>
    <div id="containment-wrapper" >
      <a class="button" style=" position: absolute; left: 0px; top: 0px; margin:25px;" id="mail" @click="mailClick()" href="javascript:void(0)">
        <div id="mailbox_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top: -88px; margin-left: -88px; z-index:1">
          <img  id="mailbox" src="mail/mailbox_c.png" />
        </div>

        <div  style=" position:absolute; left:55%; z-index:2; top:0%">
          <img  align='right' src='mail/call1.png' width="110" height="110" alt='' style="z-index:2;" />
        </div>
        <div style=" position:absolute; position:absolute; left:69%; top:10%; z-index:3; width: 130px">
          <h3>
            <b id="new_emails" style='color:#ffffff; font-size: 24px'>{{ getNewMailString }} </b>
          </h3>
        </div>
      </a>
      <a class="button" style=" position: absolute;  margin:25px;"  href="javascript:void(0)" id="palbum" @click="palbumClick()">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-80px; margin-left:-88px; z-index:3"><img width="175" height="175" id="palbumimg" src="mail/album2.png" /> </div>
      </a>
      <a class="button" style=" position: absolute;  margin:25px;"  href="javascript:void(0)" id="icontact" @click="icontactClick">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-70px; margin-left:-75px; z-index:3">
          <img id="palbumimg" src="mail/contact.png" />
        </div>
      </a>

      <div id="drag-wrapper"></div>
      <p class='pin' style=" display:none">hello</p>

      <img src="mail/trash_ball.png" style="display:none"/>
      <img src="mail/tray_envelope1.png" style="display:none"/>
      <img src="mail/tray_envelope2.png" id="tray_envelope2" style="display:none"/>

      <Polaroid2
          :mail="mail"
          :key="mail.id"
          v-for="mail in mails"
          @mousedown="polaroidMousedown($event)"
          @mouseup="polaroidMouseup($event)"
          @replyClick="replyClick($event)"
          @closeClick="closeClick($event)"
          @throwawayClick="throwawayClick($event)"
      ></Polaroid2>




      <div id="photocontent"></div>
    </div>

    <div class="flap" style="position:absolute; z-index: 5; left: 852px; top: 61px;" @click="flapClick($event)"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">A B</div> </div>

    <div class="flap" style="position:absolute; z-index: 5; left: 852px; top: 109px;" @click="flapClick($event)"> <img src="images/contact1.png" /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">C D</div></div>

    <div  class="flap" style="position:absolute;z-index: 5; left: 852px; top: 156px;" @click="flapClick($event)"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">E F</div></div>

    <div class="flap"  style="position:absolute;z-index: 5; left: 852px; top: 203px;" @click="flapClick($event)"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">G H</div></div>

    <div  class="flap" style="position:absolute;z-index: 5; left: 852px; top: 250px;" @click="flapClick($event)"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">I J</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 297px;" @click="flapClick($event)"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">K L</div> </div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 344px;" @click="flapClick($event)"> <img src="images/contact1.png" /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">M N</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 391px;" @click="flapClick($event)"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">O P</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 438px;" @click="flapClick($event)"> <img src="images/contact1.png" /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">Q R</div></div>

    <div class="flap" style="position:absolute; z-index: 5;left: 852px; top: 485px;" @click="flapClick($event)"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">S T</div></div>

    <div class="flap" style="position:absolute; z-index: 5;left: 852px; top: 532px;" @click="flapClick($event)"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">U V</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 579px;" @click="flapClick($event)"> <img src="images/contact1.png" /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">W X</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 626px;" @click="flapClick($event)"> <img src="images/contact1.png" /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">Y Z</div></div>

    <div id="person" ref="person" style= "position:absolute;left:60px; top:306px;    width:120px; height:143px;border : 1px solid #f0e9eb; display:none; z-index: 3; background-color: #fefefe;     ">
      <div id="person_contact" ref="person_contact" style="display:none;">
        <img id="person_pic" src="contacts/gregg.gif" width="128" height="128" style="margin:30px;"/>
        <div id="person_name" align="left" style="padding-left:0px;position:absolute; left:188px; top:80px; font-size: 30px"></div>
        <div id ="options" style="position:absolute; left: -1px; top: 203px;" align="center">

          <a class="large awesome reply" @click="replyClick($event)" href="javascript:void(0)">
            <img align="left" style="padding:0px" src="images/mail2.png"  />
            <div id="email" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Write Email to Gregg</div>
          </a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/phone1.png"  ><div id="call" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Call Gregg</div></a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/stack3.png" width="70" height="70" ><div id="photo" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">View Gregg's Photos</div></a>
          <a class="large awesome" href="#"><img align="left" style="padding:0px" src="images/Chat.png"  ><div  id="chat" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">Chat with Gregg</div></a>
        </div>
      </div>
    </div>

    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>
    <img class="spiral" src="mail/spiral1.png" style="position:absolute;top:80px;left:267px; z-index:3"/>

    <div id="contact" style="position:absolute;left:60px; top:306px; z-index:2;   width:120px; height:143px; display:none">

      <table id="newspaper-b" style="display:none">

        <tbody>
        <tr id="0" ref="people_ref_0" class="contact" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px; margin:0px; width: 100px"><img id="contact_pic" src="contacts/Adam.jpg" width="70" height="70" /></td>
          <td id="contact_name" align="left" style="padding:0px; margin: 0px;" >Adam Smith</td>
        </tr>

        <tr id="1" ref="people_ref_1" class="contact" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Anna.jpg" width="70" height="70" style="" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Anna Johnson</td>
        </tr>

        <tr id="2" ref="people_ref_2" class="contact" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Becky.jpg" width="70" height="70" style="" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Becky Jones</td>
        </tr>

        <tr id="3" ref="people_ref_3" class="contact" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        <tr id="4" ref="people_ref_4" class="contact" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        <tr class="contact" id="5" ref="people_ref_5" @click="contactClick($event)" style="height:95px;">
          <td style="padding-right:0px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
          <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
        </tr>

        </tbody>
      </table>
    </div>

    <img src="mail/trash1_1.png" class="trash1 trash" @mousedown="trashMousedown" @mouseup="trashMouseup" />
    <img src="mail/trash1_2.png" class="trash2 trash" @mousedown="trashMousedown" @mouseup="trashMouseup" />
    <img src="mail/desk.png" class="tray" @mousedown="trayMousedown" width="133" height="133" style="position:absolute; top:100px;"/>
  </div>
</template>

<style scoped src="../assets/css/newcss.css">
</style>
<style scoped src="../assets/css/demo14-styles.css">
</style>
<style scoped src="../assets/css/contacts.css">
</style>
<style scoped src="../assets/css/style.css">
</style>
<style scoped src="../assets/css/contact_buttons.css">
</style>

<script>
import Polaroid2 from "./working/Polaroid2";
export default {
  components: {Polaroid2}
}
</script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>
<script>
const axios = require('axios')
import Polaroid from "./working/Polaroid"
import Polaroid2 from "./working/Polaroid2"
const toBlobURL = require('stream-to-blob-url')

function mySideChange(front) {
  var p=$(this).parent().parent();
  var z=p.css('z-index');
  if (front) {
  } else {

    //$(this).parent('.envcontents').parent('.polaroid').find('#frontcontents').css('display', 'none');
    var a1=$(this).parent('.envcontents').parent('.polaroid').css('top');
    var b1=parseInt((a1.substring(0, a1.length-2)));

    $(this).attr('src', 'mail/fullback2_2.png');
    p.find('.envcontents').find('#rot2').css('left','-1px');

    if(p.find('#rot2').css('display')=='none')
      $(this).parent('.envcontents').parent('.polaroid').css('top', b1-128+'px');
    $(this).css('top', '128px');

  }
}
function mySideChange1(front) {

  var p=$(this).parent().parent();

  var z=p.css('z-index');
  if (front) {


  } else {
    //alert('hello');
    //$(this).css('display','none');
    $(this).find('#letter').css('display','none');
    $(this).find('#rot3').css('display','none');
    $(this).find('#rot2').css('left','0px');
    $(this).find('#envelope').attr('src', 'mail/envelope.png');
  }
}
function myComplete1() {
  var p=$(this).parent().parent();

  //       p.find('#frontcontents').show();
//        $(this).css('display','none');
  p.find('.envcontents').find('#rot3').css('z-index','auto');
  p.find('.envcontents').find('#letter').css('z-index','auto');
  p.find('.envcontents').find('#rot1').css('z-index','auto');
  p.find('.envcontents').css('z-index','auto');




}
function myComplete2_1() {

  //alert('hello');
  var p=$(this);
  var polaroid=$(this).parent();
  if(p.find('#letter').css('display')=='none')
  {
    p.parent().find('#frontcontents').show();

    $(p).parent().find('#frontcontents').css('position','absolute');
    $(p).parent().find('#frontcontents').css('top','128px');
  }

  /*

   //       p.find('#frontcontents').show();
  //        $(this).css('display','none');
  p.find('.envcontents').find('#rot3').css('z-index','auto');
          p.find('.envcontents').find('#letter').css('z-index','auto');
               p.find('.envcontents').find('#rot1').css('z-index','auto');
               p.find('.envcontents').css('z-index','auto');*/
  $(this).rotate3Di('unflip',1);
  $(this).find('#envelope').rotate3Di('unflip',1);
  $(this).find('#rot2').rotate3Di('unflip',1);

}
function myComplete2_reply() {



  //alert('hello');
  var p=$(this);
  var polaroid=$(this).parent();

  $( polaroid ).draggable({disabled: true});
  $(polaroid).animate({'top':'-50px','left':'350px'},1000,function(){

    $(polaroid).find('#frontcontents').hide();
    $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/truck_env.png');
    $(polaroid).animate({'top':'-70px','left':'275px'},1000,function(){
      $('#truck').animate({'left': $(window).width() + 'px'},3000,function(){
        $(this).remove();
      });
      $(this).remove();


    });

  });
  if(p.find('#letter').css('display')=='none')
  {
    p.parent().find('#frontcontents').show();

    $(p).parent().find('#frontcontents').css('position','absolute');
    $(p).parent().find('#frontcontents').css('top','128px');
  }

  /*

   //       p.find('#frontcontents').show();
  //        $(this).css('display','none');
  p.find('.envcontents').find('#rot3').css('z-index','auto');
          p.find('.envcontents').find('#letter').css('z-index','auto');
               p.find('.envcontents').find('#rot1').css('z-index','auto');
               p.find('.envcontents').css('z-index','auto');*/
  $(this).find('#rot2').hide();
  $(this).rotate3Di('unflip',1);
  $(this).find('#envelope').rotate3Di('unflip',1);
  $(this).find('#rot2').rotate3Di('unflip',1);


}
function myComplete() {
  var p=$(this).parent().parent();
  var z123=p.css('z-index');
  var z=parseInt(z123);
  if(p.find('#rot3').css('display') == 'none')
  {
    p.find('#rot3').css('z-index',z+2);
    p.find('#rot3').show();
    p.find('#letter').css('z-index',z+1);
    p.find('#letter').show();
    p.find('#letter').find('#message').css('display','none');


    p.find('#rot1').css('z-index',z+3);
    if(p.find('#rot2').css('display')=='none')
    { p.find('#rot1').show();
      p.find('#rot1').animate({
        width:'355px',
        height:'30px'
      },300,function(){

        p.find('#rot1').hide();
        //p.find('#rot2').css('left','-1px');
        p.find('#rot2').show();
        p.find('#letter').css('width','500px');
        p.find('#letter').find('#paper').show();
        p.find('#letter').animate({'top':'-90px'},300,function(){
          $(this).css('z-index',z+5);

          $(this).find('#paper').attr('src','mail/paper.png');

          $(this).find('#paper').css('width','305px');
          $(this).find('#paper').css('height','230px');
          $(this).css('height','230px');
          $(this).css('width','305px');

          $(this).find('#paper').animate({'width':'488px','height':'648px'},650,function(){
            //p.find('#envcontents').find('#message').css('z-index',z+9) ;
            $(this).parent().find('#message').show();
            $(this).parent().find('#message').css('top','0px');
            $(this).parent().find('#message').css('width','430px');
          });


          $(this).animate({
            'top': '10px',
            'left' : '-69px'

          },600, function(){
            var csso={'top':'0px','left':'10px'};
            csso.top='10px';
            csso.left= 350+(randomXToY(1,10))*10+'px';

            $(p).animate(csso,1000);
          });


        });

      });

    }
    else
    {


      p.find('#rot1').hide();
      p.find('#rot2').show();
      p.find('#letter').css('width','500px');
      p.find('#letter').find('#paper').show();
      p.find('#letter').animate({'top':'-90px'},300,function(){
        $(this).css('z-index',z+5);
        $(this).find('#paper').attr('src','mail/paper.png');
        $(this).find('#paper').css('width','305px');
        $(this).find('#paper').css('height','230px');
        $(this).css('height','230px');
        $(this).css('width','305px');
        $(this).find('#paper').animate({'width':'488px','height':'648px'},650,function(){
          //p.find('#envcontents').find('#message').css('z-index',z+9) ;
          $(this).parent().find('#message').show();
          $(this).parent().find('#message').css('top','0px');
          $(this).parent().find('#message').css('width','430px');
        });


        $(this).animate({
          'top': '10px',
          'left' : '-69px'

        },600, function(){
          var csso={'top':'0px','left':'10px'};
          csso.top='10px';
          csso.left= 350+(randomXToY(1,10))*10+'px';;
          $(p).animate(csso,1000);
        });


      });



    }


  }

}
function myComplete_reply() {
  var p=$(this).parent().parent();
  var z123=p.css('z-index');
  var z=parseInt(z123);

  if(p.find('#rot3').css('display') == 'none')
  {
    p.find('#rot3').css('z-index',z+2);
    // p.find('#rot3').show();
    p.find('#letter').css('z-index',z+1);
    p.find('#letter').show();
    p.find('#letter').find('#message').css('display','none');


    p.find('#rot1').css('z-index',z+3);
    if(p.find('#rot2').css('display')=='none')
    {// p.find('#rot1').show();
      p.find('#rot1').animate({
        width:'355px',
        height:'30px'
      },0,function(){

        p.find('#rot1').hide();


        p.find('#letter').css('width','500px');
        p.find('#letter').find('#paper').show();
        p.find('#rot3').show();
        p.find('#rot2').show();
        p.find('#letter').animate({'top':'-90px'},0,function(){
          $(this).css('z-index',z+5);

          $(this).find('#paper').attr('src','mail/paper.png');

          $(this).find('#paper').css('width','305px');
          $(this).find('#paper').css('height','230px');
          $(this).css('height','230px');
          $(this).css('width','305px');

          $(this).find('#paper').animate({'width':'488px','height':'648px'},0,function(){
            $(this).hide();
            $(this).parent().find('#inputpaper').show();

            $(this).parent().find('#message').show();
            $(this).parent().find('#message').css('top','0px');
            $(this).parent().find('#message').css('width','430px');
          });


          $(this).animate({
            'top': '10px',
            'left' : '-69px'

          },0, function(){
            var csso={'top':'0px','left':'10px'};
            csso.top='10px';
            csso.left= 360+'px';

            $(p).animate(csso,1000,function(){

              $(this).parent().find('#inputpaper').focus();
            });
          });


        });

      });

    }
    else
    {


      p.find('#rot1').hide();
      p.find('#rot2').show();
      p.find('#letter').css('width','500px');
      p.find('#letter').find('#paper').show();
      p.find('#letter').animate({'top':'-90px'},300,function(){
        $(this).css('z-index',z+5);
        $(this).find('#paper').attr('src','mail/paper.png');
        $(this).find('#paper').css('width','305px');
        $(this).find('#paper').css('height','230px');
        $(this).css('height','230px');
        $(this).css('width','305px');
        $(this).find('#paper').animate({'width':'488px','height':'648px'},650,function(){
          //p.find('#envcontents').find('#message').css('z-index',z+9) ;
          $(this).parent().find('#message').show();
          $(this).parent().find('#message').css('top','0px');
          $(this).parent().find('#message').css('width','430px');
        });


        $(this).animate({
          'top': '10px',
          'left' : '-69px'

        },600, function(){
          var csso={'top':'0px','left':'10px'};
          csso.top='10px';
          csso.left= 350+(randomXToY(1,10))*10+'px';;

        });


      });



    }


  }

}
function randomXToY(minVal,maxVal,floatVal) {
  var randVal = minVal+(Math.random()*(maxVal-minVal));
  return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
}

export default {
  name: 'HomeWorking',
  metaInfo: {
    // if no subcomponents specify a metaInfo.title, this title will be used
    title: 'Home',
  },
  components: {
    "Polaroid": Polaroid,
    "Polaroid2": Polaroid2
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
      trayptr: -1,
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

      mails: [],
      auth_user: null
    }
  },
  computed: {
    getNewMailString() {
      if(this.mails.length)
      {
        return this.mails.length + " New"
      }
      else
      {
        return "Checking"
      }
    }
  },
  watch: {
    mails: function(newVal, oldVal) {
      console.log("newVal", newVal)
      console.log("oldVal", oldVal)
      let z = 1
      $('.polaroid').each(function() { //set the initial z-index's
        z++; //at the end we have the highest z-index value stored in the z variable
        $(this).css('z-index', z); //apply increased z-index to <img>
      });
      $(".polaroid").draggable({drag: function() {
          self.lastDragged=$(this);
        },containment: "#drag-wrapper", scroll: false});
    }
  },
  mounted() {
    this.initMount()
    console.log("API_URL", process.env)
    //console.log("date", moment())
  },
  methods: {
    initMount() {
      var self = this

      if (localStorage.getItem("user") === null) {
        this.$router.push({'name': 'Login'})
      }
      else
      {
        let auth_user = localStorage.getItem("user")
        auth_user = JSON.parse(auth_user)
        if(auth_user && auth_user.id)
        {
          self.auth_user = auth_user
        }
        else
        {
          console.log("User not found")
        }
      }

      //get unread mails
      axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/get-unread-mails/', {
        user_id: self.auth_user.id
      })
      .then(function (response) {
        if(response.data.error)
        {
          console.log("Mails did not came")
          return
        }
        self.mails = response.data
        self.mails.forEach(function(mail, index) {
          if (!mail.r) {
            mail.r = "unread"
          }
          if (!mail.t) {
            mail.t = "none"
          }
          if (!mail.in) {
            mail.in = "c"
          }

          //add attachment HTML in mail
          let attachmentHTML = ""
          if(mail.decoded_attachments && mail.decoded_attachments.length)
          {
            let i = 0
            for (let decodedAttachment of mail.decoded_attachments)
            {
              if (decodedAttachment.attachment_data.data.length > 0)
              {
                let dataBase64Rep = decodedAttachment.attachment_data.data.replace(/-/g, '+').replace(/_/g, '/')
                let urlBlob = self.b64toBlob(dataBase64Rep, decodedAttachment.mimeType, decodedAttachment.attachment_data.size)

                attachmentHTML += `<a href="`+urlBlob+`" download="`+decodedAttachment.filename+`"> <div style="margin-top: 0.5rem; padding: 0.3rem; border: 1px solid #ccc; cursor: pointer;">
                `+decodedAttachment.filename+`
            </div></a>`
                URL.revokeObjectURL(urlBlob)
              }


              i++
            }

            if(mail.payload.mimeType == "multipart/mixed")
            {
              //check if </body> exist
              if(mail.decoded_body[0].includes("</body>"))
              {
                //<body> exists
                attachmentHTML += "</body>"
                mail.decoded_body[0].replace("</body>", attachmentHTML)
              }
              else
              {
                //<body> does not exists
                mail.decoded_body[0] += attachmentHTML
              }
            }

          }
        })
        console.log(self.mails)
        //self.generateMailsHTML()
      })
      .catch(function (error) {
        console.log(error);
      });

      this.people[0]=new Array("Adam Smith","Anna Johnson","Becky Jones");  //AB
      this.people[1]=new Array("Cathy Richards"); //CD
      this.people[2]=new Array(); //EF
      this.people[3]=new Array("Gregg Vanderheiden","Heather Anderson"); //GH
      this.people[4]=new Array("Jimmy");  //IJ
      this.people[5]=new Array("Lee");  //KL
      this.people[6]=new Array("Martha Brown","Mridu Sinha"); //MN
      this.people[7]=new Array();  //OP
      this.people[8]=new Array();   //QR
      this.people[9]=new Array("Smita Ravi","Tracy"); //ST
      this.people[10]=new Array();
      this.people[11]=new Array();
      this.people[12]=new Array();

      //console.log(self.$store.state)

      let t = 50
      let i = 0

      $('.flap').each(function() {
        $(this).css('top',t+'px');
        $(this).attr("people",i);
        i=i+1;
        t=t+47;
      });

      t=80;
      $('.spiral').each(function(){
        $(this).css('top',t+'px');
        $(this).css('height','22px');
        $(this).css('left','472px');
        t=t+30+50;
      });

      $('.flap').hide();
      $('.spiral').hide();
      $('#contact').hide();
      $('#person').hide();

      if (typeof window.innerWidth != 'undefined')
      {
        self.viewportwidth = window.innerWidth
        self.viewportheight = window.innerHeight
      }
      // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
      else if (typeof document.documentElement != 'undefined'
          && typeof document.documentElement.clientWidth !=
          'undefined' && document.documentElement.clientWidth != 0)
      {
        self.viewportwidth = document.documentElement.clientWidth
        self.viewportheight = document.documentElement.clientHeight
      }
      // older versions of IE
      else
      {
        self.viewportwidth = document.getElementsByTagName('body')[0].clientWidth
        self.viewportheight = document.getElementsByTagName('body')[0].clientHeight
      }

      self.trash_x =(self.viewportwidth-128-5);
      self.trash_y = (self.viewportheight-128-5);
      this.moimg=new Image();

      $(this.moimg).attr('src','mail/mailbox_o.png');
      $(this.moimg).attr('id','mailbox');

      this.mcimg=new Image();
      $(this.mcimg).attr('src','mail/mailbox_c.png');
      $(this.mcimg).attr('id','mailbox');

      var csstrash = {
        left:'1100px',
        top:'475px',
        position:'absolute'
      };

      $("#drag-wrapper").css('height',self.viewportheight+'px');
      $("#drag-wrapper").css('width',self.viewportwidth-225+'px');
      $("#drag-wrapper").css('left',225+'px');
      $("#drag-wrapper").css('top','0px');
      $("#drag-wrapper").css('position','absolute');

      $(".trash1").css(csstrash);
      $(".trash1").css('left',self.trash_x+'px');
      $(".trash1").css('top',self.trash_y+'px');

      $("#mail").css('left','0px');
      $("#mail").css('top','0px');
      $("#palbum").css('left','0px');
      $("#palbum").css('top',self.getInt($('#mail').css('margin'))+this.getInt($('#mail').css('height'))+'px');

      $("#icontact").css('left','0px');
      $("#icontact").css('top',2 * self.getInt($('#palbum').css('margin'))+ 2 * self.getInt($('#palbum').css('height'))+'px');

      $(".tray").css(csstrash);

      $(".trash2").css(csstrash);
      $(".trash2").css('left',self.trash_x+'px');
      $(".trash2").css('top',(self.trash_y+37)+'px');
      //csstrash.top=trash_y+128-73+'px';
      csstrash.left=300+'px';
      csstrash.top=self.trash_y+5+'px';
      $(".tray").css(csstrash);

      var $imgs = $(".polaroid");
      var $imgCount = $imgs.length;

      self.curr_index=0;
      self.z = 1; //for setting the initial z-index's
      var inAnimation = false; //flag for testing if we are in a animation

      self.trash_x = self.trash_x-self.buttonwidth-self.MARGIN;
      /*$('.polaroid').each(function() { //set the initial z-index's
        self.z++; //at the end we have the highest z-index value stored in the z variable
        $(this).css('z-index', self.z); //apply increased z-index to <img>
      });

      self.curr_index = self.z;
      self.z++;*/
      self.curr_index = 99
      self.z = 100
      $(".trash1").css('z-index',self.z+1);
      $(".tray").css('z-index',1);
      $(".trash2").css('z-index',self.z+3);

      /*$(".polaroid").draggable({drag: function() {
        self.lastDragged=$(this);
        },containment: "#drag-wrapper", scroll: false});*/
    },
    //generate mails html
    generateMailsHTML() {
      var self = this
      var html = ""
      self.mails.forEach(function(mail, index) {
        if(!mail.r)
        {
          mail.r = "unread"
        }
        if(!mail.t)
        {
          mail.t = "none"
        }
        if(!mail.in)
        {
          mail.in = "c"
        }
        html = `<div class='polaroid' @mousedown="polaroidMousedown($event)" @mouseup="polaroidMouseup($event)" r='`+mail.r+`' t='`+mail.t+`' in='`+mail.in+`'>
          <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
          <div class='envcontents' style='display:none; width:355px'>
            <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
            <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
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

          <div id='frontcontents' style='display:none;'>
            <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
            <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>Becky</div>
            <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div>
            <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> Eleanor</div>
            <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: `+self.findMailHeader(mail, 'Subject')+`</div>

            <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div>

            <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
            <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
            <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
            <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

          </div>

        </div>`

        $(html).insertAfter("#tray_envelope2")

      })
    },
    b64toBlob (b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 512

      var byteCharacters = atob(b64Data)
      var byteArrays = []

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)

      }
      var blob = new Blob(byteArrays, {type: contentType})
      let urlBlob = URL.createObjectURL(blob)
      return urlBlob
    },

    //find header with name form the mail.payload.headers
    findMailHeader(mail, header_name){
      return mail.payload.headers.find(x => x.name === header_name).value;
    },
    flapClick(e) {
      var self = this
      if(self.isPerson==1)
      {
        self.isPerson=0;
        $('#person_contact').hide();
        $('#person').animate({'width':'0px'}, 1000,function(){
          $(this).hide();
        });
      }
      var index = parseInt($(e.currentTarget).attr('people'));
      var stop = self.people[index].length;
      for (var p=0;p<=5;p++)
      {
        if(p<stop)
        {
          var name = self.people[index][p].split(' ');
          $('#'+p).find('#contact_pic').attr('src','contacts/'+name[0]+'.jpg');
          $('#'+p).find('#contact_pic').show();
          $('#'+p).find('#contact_name').html(self.people[index][p]);
        }
        else
        {
          $('#'+p).find('#contact_pic').hide();
          $('#'+p).find('#contact_name').html('&nbsp;');

        }
      }
    },
    contactClick(e) {
      var self = this
      //console.log(e.currentTarget)
      //return;
      var name=$(e.currentTarget).find('#contact_name').text().split(' ');
      var image=$(e.currentTarget).find('#contact_pic').attr('src');
      //console.log(name, image)
      //return;
      if(name[0].length>1) {
        self.isPerson=1;
        $('#person').show();
        $('#person_contact').hide();
        $('#person').animate({width:'550px'}, 1000,function(){
          $('#person_contact').show();
        });
        $('#person').find('#person_name').text($(this).find('#contact_name').text());
        $('#person').find('#person_pic').attr('src',image);
        $('#person').find('#email').text("Write Email to "+ name[0]);
        $('#person').find('#call').text("Call "+ name[0]);
        $('#person').find('#photo').text("View "+ name[0]+"'s photos");
        $('#person').find('#chat').text(name[0]+" is available to chat");
      }
    },
    mailClick() {
      var self = this
      let zi = 1
      $('.polaroid').each(function() { //set the initial z-index's
        zi++; //at the end we have the highest z-index value stored in the z variable
        $(this).css('z-index', zi); //apply increased z-index to <img>
      });
      $(".polaroid").draggable({drag: function() {
          self.lastDragged=$(this);
        },containment: "#drag-wrapper", scroll: false});
      var a1=$('#mail').css('top');
      var top=parseInt((a1.substring(0, a1.length-2)));
      var left=$('#mail').css('left');
      var left=parseInt((left.substring(0, left.length-2)));
      var margin=$('#mail').css('margin');
      var margin=parseInt((margin.substring(0, margin.length-2)));
      var width=$('#mail').css('width');
      var width=parseInt((width.substring(0, width.length-2)));
      var cssop={top:'0px',left:'0px'};
      var delay=0;

      if(self.mailOpened==0)
      {
        if(self.albumOpened==1)
        {
          self.albumOpened=0;
          self.albumin();
          delay=1000;
        }

        if(self.contactOpened==1)
        {
          self.contactOpened=0;
          self.contactin();
          delay=1000;
        }

        setTimeout(function(){
          //console.log("this", this)
          //return;
          self.mailOpened=1;
          $('.tray').show();
          $('.trash1').show();
          $('.trash2').show();
          $('#mailbox').remove();
          $('#mailbox_cont').append(self.moimg);
          $('#mailbox_cont').css('right','34%');
          var a1=$('#mail').css('top');
          // $('#mailinbox').show();
          top=0;
          margin=self.MARGIN;
          left=0;

          cssop.top=top+margin+130+'px';
          cssop.left=left+margin+175+'px';

          $('.polaroid').css(cssop);
          var cnta=0;

          $(".polaroid").each(function (){
            $(this).find('#mailinbox').show();
            cssop.top=top+margin+130+'px';
            cssop.left=left+margin+175-(cnta % 5)*3-self.buttonwidth-self.MARGIN+'px';

            cnta++;
            $(this).css(cssop);
          });

          $(".polaroid").each(function () {
            var type=$(this).attr('t');

            var oc=$(this).attr('r');
            if(type=='trash')
            {
              $(this).show();
              var  cnt=0;
              $(this).find('#mailinbox').hide();

              var flag123=undefined;

              var z123=$(this).css('z-index');

              if(oc=="read")
              {
                flag123=1;
              }
              else
              {
                flag123=undefined;
              }


              $( this ).draggable({disabled: true});
              $(this).find('.envcontents').find('#envelope').css('left','0px');
              $(this).find('.envcontents').find('#envelope').css('top','0px');

              $(this).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
              $(this).find('.envcontents').show();


              $(this).find('.envcontents').find('#envelope').show();

              $(this).find('#frontcontents').css('display','none');
//                $(this).draggable(false);

              var csstrash1 = {left:'1100px',top:'10px',

                position:'absolute'
              };


              $(this).css('left',self.trash_x+34+'px');
              csstrash1.top = self.trash_y+128-73+'px';
              csstrash1.left = self.trash_x+34+'px';
              $(this).find('.envcontents').find('#envelope').show();
              csstrash1.top = self.trash_y+128-73+'px';
              $(this).css(csstrash1);
              $(this).css('z-index',z123);

              self.deletedEmail=$(this);
              self.openedDeleted=flag123;
            }
            else if(type=="tray")
            {

              $(this).show();
              $(this).find('#mailinbox').hide();
              self.trayptr++;
              var z123=$(this).css('z-index');

              if(oc=="read")
              {

                $(this).find('.envcontents').find('#rot2').css('display','none');
                $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');
                //     openedDeleted=1;
                self.trayEmailsFlag[self.trayptr]=1;
              }
              else
              {
                $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
                self.trayEmailsFlag[self.trayptr]=0;
              }

              $(this).find('.envcontents').find('#envelope').load(function(){

                $(this).parent().show();
              });
              $( this ).draggable({disabled: true});
              $(this).find('.envcontents').find('#envelope').css('left','0px');
              $(this).find('.envcontents').find('#envelope').css('top','40px');
              $(this).find('#frontcontents').css('display','none');
              var csstrash1 = {left:'1100px',top:'450px',position:'absolute'};



              csstrash1.top = self.trash_y+5+10-3*(self.trayptr % 5)+'px';
              csstrash1.left = self.getInt($('.tray').css('left'))+20-self.buttonwidth-self.MARGIN+'px';
              //$(this).css(csstrash1);
              $(this).css('z-index',z123);
              $(this).animate(csstrash1,1200);
              self.trayEmails[self.trayptr]=$(this);
            }

            else if(type=='none')
            {

              $(this).show();
              var sub=0;
              if(self.trayptr > -1)
                sub=self.trayptr+1;
              if(self.deletedEmail!=undefined)
                sub=sub+1;

              $(this).animate({

                left: '+='+'150',
                top: '+='+'60'
              },500,function(){


                $(this).find("#mailinbox").hide();

                $(this).find(".envcontents").show();
                if($(this).attr('in')=='c')
                  $(this).find("#frontcontents").show();
                else
                {
                  //    alert('hello');

                  $(this).find("#frontcontents").hide();
                }
                if(oc=='read')
                {
                  $(this).find("#rot2").show();
                  $(this).find("#frontcontents").css('position','absolute');
                  $(this).find('#envelope').attr('src', 'mail/envelope.png');
                  $(this).find('#envelope').css('top', '128px');
                  $(this).find("#frontcontents").css('top','128px');
                }

                $(this).css('top',self.getInt($(this).css('top'))-100+'px');
                var str = $('.pin').html();
                var rotDegrees = self.randomXToY(130, 500);
                var rotDegreesy = self.randomXToY(0, 300);
                var tempVal = Math.round(Math.random());
                if(tempVal == 1) {
                  rotDegrees = self.randomXToY(355, 360); // rotate left
                } else {
                  rotDegrees = self.randomXToY(5, 10); // rotate right
                }

                var cssObj = {
                  '-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
                  'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
                rotDegrees = self.randomXToY(width+25+50,self.viewportwidth-700-225 );
                rotDegreesy = self.randomXToY(200,self.viewportheight-700);
                $(this).animate({
                  left: 225+rotDegrees,
                  top: '+='+rotDegreesy
                }, 1000);

              });
            }
          });

          $('.pin').text("blah");


        },delay);
      }
      else if(self.mailOpened==1)
      {
        self.mailOpened=0;
        self.mailin(self.mcimg);

      }
    },
    palbumClick() {
      var self = this
      if(self.albumOpened==0 && self.loadingPhotos==0)
      {
        var delay=0;
        self.albumOpened=1;
        $('.tray').hide();
        $('.trash1').hide();
        $('.trash2').hide();

        if(self.mailOpened==1)
        {
          self.mailOpened=0;
          mailin(mcimg);
          delay=1000;
        }
        else if(self.contactOpened==1)
        {
          self.contactOpened=0;
          contactin();
          delay=1000;
        }

        setTimeout(function(){
          var album_list=$('#album_list').text().split(",");
          $('.photos').show();
          for(var i=0;i<album_list.length-1;i++)
          {


            toStack("."+album_list[i],250+i*150+'px',i,1);
          }
          $('#album_list').show();


        },delay);
      }
      else
      {
        self.albumOpened=0;
        self.albumin();
      }
    },
    icontactClick() {
      var self = this
      if(self.contactOpened==0)
      {
        var delay=0;

        self.contactOpened=1;
        $('.trash').show();
        //$('.trash').show();
        //$('.trash').show();
        if(self.mailOpened==1)
        {
          delay=1000;
          self.mailin(self.mcimg);
        }
        else if(self.albumOpened==1)
        {
          delay=1000;
          self.albumin();
        }
        $('.tray').hide();
        $('.trash1').show();
        $('.trash2').show();
        setTimeout(function(){
          if(self.isPerson==1)
            $('#person').show();
          else
          {
            $('#person').hide();
          }

          $('#person_contact').hide();
          $('#newspaper-b').hide();
          $('#contact').show();
          $('#person').animate({'position':'absolute','left':'300px', 'top':'20px',    'width':'550px','height':'650px'},1000,function() {
            if(self.isPerson==1) {
              $('#person_contact').show();
            }
            else {
              $('#person_contact').hide();
              $('#person').hide();
            }
          });
          $('#contact').animate({'position':'absolute','left':'300px', 'top':'20px',    'width':'550px','height':'650px'},1000,function(){
            $('#newspaper-b').show();
            $(".flap").show();
            $('.spiral').show();
            $('.spiral').css('left','267px');
          });
        },delay);
      }
      else
      {
        self.contactOpened=0;
        self.contactin();
      }
    },
    replyClick(e) {

      var self = this
      var polar=$(e.currentTarget).parent().parent().parent().parent();
      var subject = $(polar).find("#mail-subject").val()
      var mail_header_from = $(polar).find("#mail-header-from").val()
      var mail_header_message_id = $(polar).find("#mail-header-message-id").val()
      var mail_header_references = $(polar).find("#mail-header-references").val()
      self.destination=$(polar).find('#from').html();
      var LEFT;
      var TOP;
      var csss={'left':'0px'};
      var l = self.getInt($(polar).css('left'));
      csss.left=100+'px';

      $(polar).animate(csss,1000,function(){
        LEFT = self.getInt($(this).css('left'));
        TOP = self.getInt($(this).css('top'));
        self.curr_index = self.z;
        self.z++;
        var reply_index = self.curr_index;
        if(self.contactOpened==1)
        {
          reply_index=20;
          self.destination=$('#person').find('#person_name').text();

        }
        self.savez=reply_index;
        $(".trash1").css('z-index',self.z+1);
        $(".tray").css('z-index',1);
        //$(".trash_ball").css('z-index',self.z+2);
        $(".trash2").css('z-index',self.z+3);
        var names=self.destination.split(" ");
        $("<div class='polaroid' r='unread' t='none' in='c'><img src='mail/mailinbox.png' id='mailinbox' style='display:none'><div class='envcontents' style='display:none; width:355px'><img src='mail/envelope.png'   id='envelope' style='position:absolute;'/><img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' /><div id='letter' style='display:none; top:132px;left:25px; position:absolute; '><textarea id='inputpaper' scroll=no style='padding: 35px;   font-size:18px; font-weight:bold; overflow: none;  resize:none; background-image: url(mail/inputpaper.png); border:0; overflow: none;  display:none; width:416px;height:577px' >"+"Hi "+names[0]+"</textarea> <input type='hidden' value='"+subject+"' name='reply_subject' id='reply-subject' /><input type='hidden' value='"+mail_header_from+"' name='reply_mail_header_from' id='reply-mail-header-from' /><input type='hidden' value='"+mail_header_message_id+"' name='mail_header_message_id' id='reply-mail-header-message-id' /><input type='hidden' value='"+mail_header_references+"' name='mail_header_references' id='reply-mail-header-references' /> <img id='paper' src='mail/paper2.png' />    	<div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '> <button class='send' style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Send</span></button>  <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>        </div></div><img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/><img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>   </div><div id='frontcontents' style='display:none;'><div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div><div style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>"+self.USERNAME+"</div><div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div><div style='position:absolute; width:400px; left: 120px; top: 128px; font:Times New Roman; font-size:20px'>"+self.destination+"</div>	<div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'></div><div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'></div><div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div><div style='position:absolute; left: 288px; top: 11px;' ><img src='"+self.USERPIC+"'  width='48' height='56'/></div><div style='position:absolute; left: 285px; top: 15px;' ></div><div style='position:absolute; left: 195px; top: 40px;' ></div></div></div>")
            .css('z-index',1000)

            .draggable({drag: function() {
                self.lastDragged = $(this);},containment: "#drag-wrapper", scroll: false})

            .attr('t',"reply")

            .appendTo('#drag-wrapper');

        $(".polaroid").each(function () {
          var type=$(this).attr('t');

          var oc=$(this).attr('r');


          if(type=='reply')
          {
            var polar=$(this);

            $(this).find('.throwaway').bind('click',function() {
              var p=$(this).parent().parent();
              var q=$(p).parent().parent();
              var css23={top:'0px',left:'2px'};
              css23.left = self.viewportwidth-255-488+'px';
              css23.top = self.viewportheight-600+'px';
              $(q).animate(css23,500, function() {
                var p=$(this).find("#letter");

                //var z=parseInt($(p).parent().parent().css('z-index'));
                // alert($(p).parent().parent().attr('class'));
                $(p).parent().parent().attr('in','c');
                console.log("set c", $(p).parent().parent())
                //console.log($(p).parent().parent().attr('class')+":"+z+","+$(p).parent().parent().find('.envcontents').find('#rot3').css('z-index')+","+p.css('z-index'));

                $(p).find('#message').hide();

                $(p).find('#paper').attr('src','mail/paper2.png');
                $(p).find('#paper').animate({'width':'305px','height':'230px'},0,function() {
                  $(p).find('#paper').css('width','305px');
                  $(p).find('#paper').css('height','230px');

                });
                $(p).animate({'left':'25px', 'top':'-90px'},0,function() {

                  $(p).css('z-index',self.z+1);
                  $(p).animate({'top':'132px'},0,function(){
                    $(p).parent().parent().find('.envcontents').rotate3Di('-180',0,{
                      sideChange:mySideChange1,
                      complete:myComplete2_1
                    });
                  });
                  var polar=$(p).parent().parent();
                  var z123=$(polar).css('z-index');

                  var flag123=1;
                  $( polar ).draggable({disabled: true});
                  $(polar).find('.envcontents').find('#envelope').css('left','0px');
                  $(polar).find('.envcontents').find('#envelope').css('top','0px');
                  $(polar).css('z-index',self.z+2);
                  $(polar).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                  $(polar).attr('t','trash');
                  $(polar).find('#rot2').css('display','none');
                  $(polar).find('#frontcontents').css('display','none');
                  $(polar).draggable(false);

                  var csstrash1 = {left:'1100px',
                    position:'absolute'
                  };

                  $(polar).css('left', self.trash_x+34+'px');
                  csstrash1.top = self.trash_y+128-73+'px';
                  csstrash1.left = self.trash_x+34+'px';
                  $(polar).animate(csstrash1,1000,function(){
                    csstrash1.top = self.trash_y+128-73-20+'px';
                    $(polar).animate(csstrash1,0,function(){

                      csstrash1.top = self.trash_y+128-73+'px';
                      $(polar).animate(csstrash1,0,function(){
                        $(polar).css('z-index',z123);
                        $(this).remove();
                      });

                    });

                  });
                });



              });

            });
            $(this).find('.send').bind('click',function() {
              var p=$(this).parent().parent();
              //send message
              axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/reply-mail', {
                user_id: self.auth_user.id,
                message: $(p).find('#inputpaper').val(),
                subject: $(p).find('#reply-subject').val(),
                from: $(p).find('#reply-mail-header-from').val(),
                message_id: $(p).find('#reply-mail-header-message-id').val(),
                references: $(p).find('#reply-mail-header-references').val()
              })
              .then((response) => {
                if(response.data.error)
                {
                  console.log("Mails did not sent")
                  return
                }
                console.log(response)
              }, (error) => {
                console.log(error);
              })

              var q=$(p).parent().parent();
              $(q).css('z-index',self.savez);
              $("<img id='truck' src='mail/truck.png' style='z-index:100; position: absolute'></img>").appendTo("#containment-wrapper");
              $("#truck").animate({'left':'400px'},1000);
              var z=parseInt($(p).parent().parent().css('z-index'));
              $(p).parent().parent().attr('in','c');



              $(p).find('#message').hide();
              $(p).find('#inputpaper').hide();
              $(p).find('#paper').show();
              $(p).find('#paper').attr('src','mail/paper2.png');
              $(p).find('#paper').animate({'width':'305px','height':'230px'},650,function(){
                $(p).find('#paper').css('width','305px');
                $(p).find('#paper').css('height','230px');

              });
              $(p).animate({'left':'25px', 'top':'-90px'},650,function(){
                $(p).css('z-index',self.z+1);
                $(p).animate({'top':'132px'},300,function(){

                  /*$(polar).find('#rot2').hide("slide", { direction: "bottom" }, 3000,function(){

                  });*/
                  $(p).parent().parent().find('.envcontents').rotate3Di('-180',300,{
                    sideChange:mySideChange1,
                    complete:myComplete2_reply
                  });
                });


              });



            });



            var a1=$('#mail').css('top');
            var top=parseInt((a1.substring(0, a1.length-2)));
            var left=$('#mail').css('left');
            var left=parseInt((left.substring(0, left.length-2)));
            var margin=$('#mail').css('margin');
            var margin=parseInt((margin.substring(0, margin.length-2)));
            var width=$('#mail').css('width');
            var width=parseInt((width.substring(0, width.length-2)));
            var cssop={top:'0px',left:'0px'};


            $(this).find("#mailinbox").hide();

            $(this).find(".envcontents").show();
            if($(this).attr('in')=='c')
              $(this).find("#frontcontents").show();
            else
            {
              //    alert('hello');

              $(this).find("#frontcontents").hide();
            }
            if(oc=='read') {
              $(this).find("#rot2").show();
              $(this).find("#frontcontents").css('position','absolute');
              $(this).find('#envelope').attr('src', 'mail/envelope.png');
              $(this).find('#envelope').css('top', '128px');
              $(this).find("#frontcontents").css('top','128px');
            }
            $(this).css('top',self.getInt($(this).css('top'))-100+'px');
            var str = $('.pin').html();
            cssop.left = self.viewportwidth+'px';
            cssop.top=10+'px';


            $(this).animate(cssop,0,function() {
              $(this).find('#frontcontents').css('display','none');
              $(this).find('#envelope').rotate3Di('180',0,
                  {
                    sideChange:function(front = false) {
                      var p=$(this).parent().parent();
                      var z=p.css('z-index');
                      if (front) {
                      } else {

                        //$(this).parent('.envcontents').parent('.polaroid').find('#frontcontents').css('display', 'none');
                        var a1=$(this).parent('.envcontents').parent('.polaroid').css('top');
                        var b1=parseInt((a1.substring(0, a1.length-2)));

                        $(this).attr('src', 'mail/fullback2_2.png');
                        p.find('.envcontents').find('#rot2').css('left','-1px');

                        if(p.find('#rot2').css('display')=='none')
                          $(this).parent('.envcontents').parent('.polaroid').css('top', b1-128+'px');
                        $(this).css('top', '128px');

                      }
                    },
                    complete: function() {
                      var p=$(this).parent().parent();

                      var z123=p.css('z-index');
                      var z=parseInt(z123);

                      if(p.find('#rot3').css('display') == 'none')
                      {

                        p.find('#rot3').css('z-index',z+2);
                        // p.find('#rot3').show();
                        p.find('#letter').css('z-index',z+1);
                        p.find('#letter').show();
                        p.find('#letter').find('#message').css('display','none');


                        p.find('#rot1').css('z-index',z+3);
                        if(p.find('#rot2').css('display')=='none')
                        {// p.find('#rot1').show();

                          p.find('#rot1').animate({
                            width:'355px',
                            height:'30px'
                          },0,function(){

                            p.find('#rot1').hide();


                            p.find('#letter').css('width','500px');
                            p.find('#letter').find('#paper').show();
                            p.find('#rot3').show();
                            p.find('#rot2').show();
                            p.find('#letter').animate({'top':'-90px'},0,function(){
                              $(this).css('z-index',z+5);

                              $(this).find('#paper').attr('src','mail/paper.png');

                              $(this).find('#paper').css('width','305px');
                              $(this).find('#paper').css('height','230px');
                              $(this).css('height','230px');
                              $(this).css('width','305px');

                              $(this).find('#paper').animate({'width':'488px','height':'648px'},0,function(){
                                $(this).hide();
                                $(this).parent().find('#inputpaper').show();

                                $(this).parent().find('#message').show();
                                $(this).parent().find('#message').css('top','0px');
                                $(this).parent().find('#message').css('width','430px');
                              });


                              $(this).animate({
                                'top': '10px',
                                'left' : '-69px'

                              },0, function(){
                                var csso={'top':'0px','left':'10px'};
                                csso.top='10px';
                                csso.left= 360+'px';

                                $(p).animate(csso,1000,function(){

                                  $(this).parent().find('#inputpaper').focus();
                                });
                              });


                            });

                          });

                        }
                        else
                        {


                          p.find('#rot1').hide();
                          p.find('#rot2').show();
                          p.find('#letter').css('width','500px');
                          p.find('#letter').find('#paper').show();
                          p.find('#letter').animate({'top':'-90px'},300,function(){
                            $(this).css('z-index',z+5);
                            $(this).find('#paper').attr('src','mail/paper.png');
                            $(this).find('#paper').css('width','305px');
                            $(this).find('#paper').css('height','230px');
                            $(this).css('height','230px');
                            $(this).css('width','305px');
                            $(this).find('#paper').animate({'width':'488px','height':'648px'},650,function(){
                              //p.find('#envcontents').find('#message').css('z-index',z+9) ;
                              $(this).parent().find('#message').show();
                              $(this).parent().find('#message').css('top','0px');
                              $(this).parent().find('#message').css('width','430px');
                            });


                            $(this).animate({
                              'top': '10px',
                              'left' : '-69px'

                            },600, function(){
                              var csso={'top':'0px','left':'10px'};
                              csso.top='10px';
                              csso.left= 350+(self.randomXToY(1,10))*10+'px';;

                            });


                          });



                        }


                      }
                    }
                  }
              );

            });



          }

        });


      });
    },
    throwawayClick(e) {
      var self = this
      var p = $(e.currentTarget).parent().parent();

      var q = p = $(p).parent().parent();
      var css23={top:'0px',left:'2px'};
      css23.left = self.viewportwidth-488+'px';
      css23.top = self.viewportheight-600+'px';
      $(q).css('z-index',self.savez);
      $(q).animate(css23,500, function(){
        var p = $(this).find("#letter");


        //var z=parseInt($(p).parent().parent().css('z-index'));
        // alert($(p).parent().parent().attr('class'));
        $(p).parent().parent().attr('in','c');
        //console.log($(p).parent().parent().attr('class')+":"+z+","+$(p).parent().parent().find('.envcontents').find('#rot3').css('z-index')+","+p.css('z-index'));

        $(p).find('#message').hide();

        $(p).find('#paper').attr('src','mail/paper2.png');
        $(p).find('#paper').animate({'width':'305px','height':'230px'},0,function() {
          $(p).find('#paper').css('width','305px');
          $(p).find('#paper').css('height','230px');

        });
        $(p).animate({'left':'25px', 'top':'-90px'},0,function() {
          $(p).css('z-index',self.z+1);
          $(p).animate({'top':'132px'},0,function() {
            $(p).parent().parent().find('.envcontents').rotate3Di('-180',0,{
              sideChange:function() {
                let front = false
                var p=$(this).parent().parent();

                var z=p.css('z-index');
                if (front) {


                } else {
                  //alert('hello');
                  //$(this).css('display','none');
                  $(this).find('#letter').css('display','none');
                  $(this).find('#rot3').css('display','none');
                  $(this).find('#rot2').css('left','0px');
                  $(this).find('#envelope').attr('src', 'mail/envelope.png');
                }
              },
              complete:function() {
                var p=$(this);
                var polaroid=$(this).parent();
                if(p.find('#letter').css('display')=='none')
                {
                  p.parent().find('#frontcontents').show();

                  $(p).parent().find('#frontcontents').css('position','absolute');
                  $(p).parent().find('#frontcontents').css('top','128px');
                }

                $(this).rotate3Di('unflip',1);
                $(this).find('#envelope').rotate3Di('unflip',1);
                $(this).find('#rot2').rotate3Di('unflip',1);
              }
            });
          });
          var polar = $(p).parent().parent();
          var z123 = $(polar).css('z-index');

          var flag123 = 1;
          $( polar ).draggable({disabled: true});
          $(polar).find('.envcontents').find('#envelope').css('left','0px');
          $(polar).find('.envcontents').find('#envelope').css('top','0px');
          $(polar).css('z-index',self.z+2);
          $(polar).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
          $(polar).attr('t','trash');
          $(polar).find('#rot2').css('display','none');
          $(polar).find('#frontcontents').css('display','none');
          $(polar).draggable(false);

          var csstrash1 = {
            left:'1100px',
            position:'absolute'
          };

          $(polar).css('left',self.trash_x+34+'px');
          csstrash1.top = self.trash_y+128-73+'px';
          csstrash1.left = self.trash_x+34+'px';
          $(polar).animate(csstrash1,1000,function() {
            csstrash1.top = self.trash_y+128-73-20+'px';
            $(polar).animate(csstrash1,0,function(){

              csstrash1.top = self.trash_y+128-73+'px';
              $(polar).animate(csstrash1,0,function() {
                $(polar).css('z-index',z123);
                $(self.deletedEmail).css('display','none');
                $(self.deletedEmail).attr('t','deleted');
                self.deletedEmail=$(polar);

                self.openedDeleted=flag123;
                //alert($(this).css('z-index'));
              });
            });
          });
        });
      });
    },
    closeClick(e) {

      var self = this
      var p = $(e.currentTarget).parent().parent();
      var z = parseInt($(p).parent().parent().css('z-index'));
      $(p).parent().parent().attr('in','c')

      $(p).find('#message').hide();

      $(p).find('#paper').attr('src','mail/paper2.png');
      $(p).find('#paper').animate({'width':'305px','height':'230px'},650,function() {
        $(p).find('#paper').css('width','305px');
        $(p).find('#paper').css('height','230px');

      });
      $(p).animate({'left':'25px', 'top':'-90px'},650,function() {
        $(p).css('z-index',z+1);
        $(p).animate({'top':'132px'},300,function() {
          $(p).parent().parent().find('.envcontents').rotate3Di('-180',300,{
            sideChange:mySideChange1,
            complete:function() {
              //alert('hello');
              var p=$(this);
              var polaroid=$(this).parent();
              if(p.find('#letter').css('display')=='none')
              {
                p.parent().find('#frontcontents').show();

                $(p).parent().find('#frontcontents').css('position','absolute');
                $(p).parent().find('#frontcontents').css('top','128px');
              }
              setTimeout(function(){
                /*                                var csso1={top:'0px',left:'1px'};
                       csso1.top=getInt($('.trash1').css('top'))-200+5+10-3*(trayptr % 5)+'px';
                       csso1.left=getInt($('.tray').css('left'))+200+20-buttonwidth-MARGIN+'px';
                       $(polaroid).animate(csso1, 1000);*/


                self.trayptr++;
                var z123=$(polaroid).css('z-index');

                if($(polaroid).find('.envcontents').find('#rot2').css('display')!='none')
                {

                  $(polaroid).find('.envcontents').find('#rot2').css('display','none');
                  $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');

                  self.trayEmailsFlag[self.trayptr]=1;
                }
                else
                {
                  $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
                  self.trayEmailsFlag[self.trayptr]=0;
                }
                $( polaroid ).draggable({disabled: true});
                $(polaroid).find('.envcontents').find('#envelope').css('left','0px');
                $(polaroid).find('.envcontents').find('#envelope').css('top','40px');
                $(polaroid).attr('t','tray');

                $(polaroid).find('#frontcontents').css('display','none');
                var csstrash1 = {left:'1100px',

                  position:'absolute'
                };

                csstrash1.top=self.getInt($('.trash1').css('top'))+5+10-3*(self.trayptr % 5)+'px';
                csstrash1.left=self.getInt($('.tray').css('left'))+20-self.buttonwidth-self.MARGIN+'px';
                $(polaroid).animate(csstrash1,1000);
                $(polaroid).css('z-index',z123);
                self.trayEmails[self.trayptr]=$(polaroid);
              },300);
              /*

               //       p.find('#frontcontents').show();
              //        $(this).css('display','none');
              p.find('.envcontents').find('#rot3').css('z-index','auto');
                      p.find('.envcontents').find('#letter').css('z-index','auto');
                           p.find('.envcontents').find('#rot1').css('z-index','auto');
                           p.find('.envcontents').css('z-index','auto');*/
              $(this).rotate3Di('unflip',1);
              $(this).find('#envelope').rotate3Di('unflip',1);
              $(this).find('#rot2').rotate3Di('unflip',1);
            }
          });
        });
      });
    },
    polaroidMousedown(e) {
      var self = this
      console.log("mail opened 00000000 1")
      self.dragging = $(e.currentTarget).css('left');
      if($(e.currentTarget).find('.envcontents').find('#envelope').attr('src')=='mail/tray_envelope1.png' || $(e.currentTarget).find('.envcontents').find('#envelope').attr('src')=='mail/tray_envelope2.png')
      {
        console.log("mail opened 00000000 2")
        if(self.trayptr!=-1)
        {
          console.log("mail opened 00000000 3")
          var deletedEmail1 = self.trayEmails[self.trayptr];

          $(deletedEmail1).attr('t','none');
          var openedT = self.trayEmailsFlag[self.trayptr];
          self.trayptr--;

          var csstrash1 = {
            position:'absolute'
          };
          csstrash1.top = self.trash_y-128+'px';
          $( deletedEmail1 ).draggable({disabled: false});
          var nowz=$(deletedEmail1).css('z-index');
          $('.polaroid').each(function() {
            if($(this).css('z-index')>nowz)
              $(this).css('z-index',$(this).css('z-index')-1);
          });

          $(deletedEmail1).css('z-index', self.curr_index);
          //$(deletedEmail1).css('z-index', z+2);
          $(deletedEmail1).animate(csstrash1,500,function() {
            $(deletedEmail1).find('.envcontents').find('#envelope').attr('src','mail/envelope.png');

            $(deletedEmail1).find('#frontcontents').show();
            if(openedT==1)
            {
              $(deletedEmail1).find('.envcontents').find('#rot2').show();
              $(deletedEmail1).find('.envcontents').find('#envelope').css('top','128px');
              $(deletedEmail1).find('#frontcontents').css('position','absolute');
              $(deletedEmail1).find('#frontcontents').css('top','128px');
            }
            else
            {
              $(deletedEmail1).find('.envcontents').find('#envelope').css('top','0px');
            }

            csstrash1.top = self.trash_y-128-239+'px';

            $(deletedEmail1).css(csstrash1);

            csstrash1.top = self.trash_y-128-239-50+ 10*((self.trayptr+1) % 10 )+'px';
            csstrash1.left = self.trash_x-900+200+10*((self.trayptr+1) % 10 )+'px';
            $(deletedEmail1).animate(csstrash1,500,function() {

            });
          });
        }
      }
    },
    trashMousedown() {
      var self = this
      var dE1;
      self.lastDragged=dE1;
      if(self.deletedEmail!=undefined)
      {
        //console.log('trash mousedown');
        var deletedEmail1 = self.deletedEmail;
        console.log("trashMousedown live", deletedEmail1)
        self.deletedEmail=dE1;
        $(deletedEmail1).attr('t','none');

        var csstrash1 = {
          position:'absolute'
        };
        csstrash1.top = self.trash_y-128+'px';

        $( deletedEmail1 ).draggable({disabled: false});
        var nowz = $(deletedEmail1).css('z-index');
        $('.polaroid').each(function() {
          if($(this).css('z-index') > nowz)
            $(this).css('z-index',$(this).css('z-index')-1);
        });

        $(deletedEmail1).css('z-index', self.z+2);
        $(deletedEmail1).animate(csstrash1,500,function(){
          $(deletedEmail1).find('.envcontents').find('#envelope').attr('src','mail/envelope.png');
          $(deletedEmail1).css('z-index', self.curr_index);
          $(deletedEmail1).find('#frontcontents').show();
          if($(deletedEmail1).attr('r')=="read")
          {
            $(deletedEmail1).find('.envcontents').find('#rot2').show();
            $(deletedEmail1).find('.envcontents').find('#envelope').css('top','128px');
            $(deletedEmail1).find('#frontcontents').css('position','absolute');
            $(deletedEmail1).find('#frontcontents').css('top','128px');

            self.openedDeleted=dE1;
          }
          $(deletedEmail1).css('z-index', self.curr_index);
          csstrash1.top = self.trash_y-128-239+'px';
          csstrash1.left = self.trash_x+34-355+'px';

          $(deletedEmail1).css(csstrash1);

          csstrash1.top = self.trash_y-128-239-50+'px';
          csstrash1.left = self.trash_x+34-355-75+'px';
          $(deletedEmail1).animate(csstrash1,500,function() {


          });
        });

      }
    },
    trayMousedown() {
      var self = this
      if(self.trayptr!=-1)
      {
        var deletedEmail1 = self.trayEmails[self.trayptr];

        $(deletedEmail1).attr('t','none');
        var openedT = self.trayEmailsFlag[self.trayptr];

        self.trayptr--;

        //alert(deletedEmail1);
        var csstrash1 = {

          position:'absolute'
        };
        csstrash1.top = self.trash_y - 128+'px';
        $( deletedEmail1 ).draggable({disabled: false});
        var nowz = $(deletedEmail1).css('z-index');
        $('.polaroid').each(function() {
          if($(this).css('z-index')>nowz)
            $(this).css('z-index',$(this).css('z-index')-1);
        });

        $(deletedEmail1).css('z-index', self.curr_index);
        //$(deletedEmail1).css('z-index', z+2);
        $(deletedEmail1).animate(csstrash1,500,function(){
          $(deletedEmail1).find('.envcontents').find('#envelope').attr('src','mail/envelope.png');

          $(deletedEmail1).find('#frontcontents').show();
          if(openedT == 1)
          {
            $(deletedEmail1).find('.envcontents').find('#rot2').show();
            $(deletedEmail1).find('.envcontents').find('#envelope').css('top','128px');
            $(deletedEmail1).find('#frontcontents').css('position','absolute');
            $(deletedEmail1).find('#frontcontents').css('top','128px');
          }
          else
          {
            $(deletedEmail1).find('.envcontents').find('#envelope').css('top','0px');
          }

          csstrash1.top = self.trash_y-128-239+'px';

          $(deletedEmail1).css(csstrash1);

          csstrash1.top = self.trash_y-128-239-50+ 10*((self.trayptr+1) % 10 )+'px';
          csstrash1.left = self.trash_x-900+200+10*((self.trayptr+1) % 10 )+'px';
          $(deletedEmail1).animate(csstrash1,500,function(){


          });
        });

      }
    },
    trashMouseup() {
      var self = this
      if(self.lastDragged != undefined)
      {
        var lastDragged1 = self.lastDragged;
        var flag123;
        var a = $(lastDragged1).css('left');
        var b = parseInt((a.substring(0, a.length-2)));
        var a1 = $(lastDragged1).css('top');
        var b1 = parseInt((a1.substring(0, a1.length-2)));


        if(b+275>self.trash_x && b1>self.trash_y-64-240-20)
        {
          //alert($(lastDragged1).css('z-index'));
          self.lastDragged=undefined;

          var z123 = $(lastDragged1).css('z-index');

          if($(lastDragged1).find('.envcontents').find('#rot2').css('display')!='none')
          {
            $(lastDragged1).find('.envcontents').find('#rot2').css('display','none');
            flag123 = 1;
          }
          else
            flag123 = undefined;
          $( lastDragged1 ).draggable({disabled: true});
          $(lastDragged1).find('.envcontents').find('#envelope').css('left','0px');
          $(lastDragged1).find('.envcontents').find('#envelope').css('top','0px');
          $(lastDragged1).css('z-index',self.z+2);
          $(lastDragged1).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
          $(lastDragged1).find('#frontcontents').css('display','none');
          $(lastDragged1).draggable(false);

          var csstrash1 = {left:'1100px',

            position:'absolute'
          };


          $(lastDragged1).css('left',self.trash_x+34+'px');
          csstrash1.top = self.trash_y + 128 - 73+'px';
          csstrash1.left = self.trash_x + 34+'px';
          $(lastDragged1).animate(csstrash1,1000,function(){
            csstrash1.top = self.trash_y+128-73-20+'px';
            $(lastDragged1).animate(csstrash1,0,function(){

              csstrash1.top = self.trash_y+128-73+'px';
              $(lastDragged1).animate(csstrash1,0,function(){
                $(lastDragged1).css('z-index',z123);
                $(lastDragged1).attr('t','trash');
                //alert($(this).css('z-index'));
                $(self.deletedEmail).css('display','none');
                $(self.deletedEmail).attr('t','deleted');
                self.deletedEmail=$(lastDragged1);
                self.openedDeleted = flag123;
              });

            });

          });
        }
      }
    },
    polaroidMouseup(e) {
      console.log("mail opened1")
      //console.log("event: polaroidMouseup", e.currentTarget)
      //return;
      var self = this
      var target = $(e.currentTarget);

      //if(!target.is('.close')&&!target.is('#message'))
      if($(e.currentTarget).find('.envcontents').find('#envelope').attr('src')!='mail/trash_ball.png'&&$(e.currentTarget).find('.envcontents').find('#envelope').attr('src')!='mail/tray_envelope1.png'&&$(e.currentTarget).find('.envcontents').find('#envelope').attr('src')!='mail/tray_envelope2.png')
      {
        console.log("mail opened 2")
        //console.log("TARGET Id,class :"+$(target).attr('id')+","+$(target).attr('class')+target.html());
        var flag123;
        var a=$(e.currentTarget).css('left');
        var b=parseInt((a.substring(0, a.length-2)));
        var a1=$(e.currentTarget).css('top');
        var b1=parseInt((a1.substring(0, a1.length-2)));



        if(b+275>self.trash_x && b1>self.trash_y-64-240-20 && $(e.currentTarget).find('.envcontents').find('#envelope').attr('src')=='mail/envelope.png')
        {
          console.log("mail opened 3")
          //alert($(this).css('z-index'));
          // console.log('polarioid mouseup');

          var z123=$(e.currentTarget).css('z-index');

          if($(e.currentTarget).find('.envcontents').find('#rot2').css('display')!='none')
          {
            console.log("mail opened 4")
            $(e.currentTarget).find('.envcontents').find('#rot2').css('display','none');
            flag123 = 1;
          }
          else
            flag123 = undefined;
          $( e.currentTarget ).draggable({disabled: true});
          $(e.currentTarget).find('.envcontents').find('#envelope').css('left','0px');
          $(e.currentTarget).find('.envcontents').find('#envelope').css('top','0px');
          $(e.currentTarget).css('z-index',self.z+2);
          $(e.currentTarget).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
          $(e.currentTarget).attr('t','trash');
          $(e.currentTarget).find('#frontcontents').css('display','none');
          $(e.currentTarget).draggable(false);

          var csstrash1 = {left:'1100px',

            position:'absolute'
          };

          $(e.currentTarget).css('left',self.trash_x+34+'px');
          csstrash1.top = self.trash_y+128-73+'px';
          csstrash1.left = self.trash_x+34+'px';
          $(e.currentTarget).animate(csstrash1,1000,function(){
            csstrash1.top = self.trash_y+128-73-20+'px';
            $(this).animate(csstrash1,0,function(){

              csstrash1.top = self.trash_y+128-73+'px';
              $(this).animate(csstrash1,0,function(){
                $(this).css('z-index',z123);
                $(self.deletedEmail).css('display','none');
                $(self.deletedEmail).attr('t','deleted');
                self.deletedEmail=$(this);
                self.openedDeleted = flag123;
                //alert($(this).css('z-index'));
              });

            });

          });
        }
        var height;
        if($(e.currentTarget).find('.envcontents').find('#rot2').css('display')=='none')
          height=240;
        else
          height=240+128;

        //CODE FOR TRAY EMAILs
        if(b<self.trash_x-900+225+133 && b1+height>self.trash_y+64 && $(e.currentTarget).find('.envcontents').find('#envelope').attr('src')=='mail/envelope.png')
        {
          console.log("mail opened2")
          //alert($(this).css('z-index'));
          //   console.log('polarioid mouseup');
          //$(deletedEmail).css('display','none');
          self.trayptr++;
          var z123 = $(e.currentTarget).css('z-index');

          if($(e.currentTarget).find('.envcontents').find('#rot2').css('display')!='none')
          {

            $(e.currentTarget).find('.envcontents').find('#rot2').css('display','none');
            $(e.currentTarget).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');

            self.trayEmailsFlag[self.trayptr]=1;
          }
          else
          {
            $(e.currentTarget).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
            self.trayEmailsFlag[self.trayptr]=0;
          }
          $( e.currentTarget ).draggable({disabled: true});
          $(e.currentTarget).find('.envcontents').find('#envelope').css('left','0px');
          $(e.currentTarget).find('.envcontents').find('#envelope').css('top','40px');
          $(e.currentTarget).attr('t','tray');

          $(e.currentTarget).find('#frontcontents').css('display','none');
          var csstrash1 = {
            left:'1100px',
            position:'absolute'
          };

          csstrash1.top = self.trash_y+5+10-3*(self.trayptr % 5)+'px';
          csstrash1.left = self.getInt($('.tray').css('left'))+20-self.buttonwidth - self.MARGIN+'px';
          $(e.currentTarget).animate(csstrash1,1000);
          $(e.currentTarget).css('z-index',z123);
          self.trayEmails[self.trayptr] = $(e.currentTarget);
        }

        var p = $(e.currentTarget);
        var position = p.position();
        var L = position.left;
        var T=position.top;
        var dragging1=$(e.currentTarget).css('left');
        var isCurrent=0;
        var isOverlapped=0;
        if($(e.currentTarget).css('z-index') == self.curr_index)
          isCurrent=1;
        var t='';
        var nowzi=$(e.currentTarget).css('z-index');
        var overlapped='';
        $('.polaroid').each(function() {
          var p1 = $(this);
          var position1 = p1.position();
          var L1=position1.left;
          var T1=position1.top;
          var flagh=0;
          var flagv=0;

          var flag1=0;
          var flag2=0;
          var flag3=0;
          var flag4=0;

          //Cond1.  If A's left edge is to the right of the B's right edge,
          //           -  then A is Totally to right Of B
          if(L>L1+335)
            flag1=1;

          //Cond2.  If A's right edge is to the left of the B's left edge,
          //           -  then A is Totally to left Of B

          if(L+335<L1)
            flag2=1;

          //Cond3.  If A's top edge is below B's bottom  edge,
          //           -  then A is Totally below B

          if(T>T1+275)
            flag3=1;

          //Cond4.  If A's bottom edge is above B's top edge,
          //           -  then A is Totally above B

          if(T+275<T1)
            flag4=1;

          if(flag1!=1 && flag2!=1 && flag3!=1 && flag4!=1 && nowzi<$(e.currentTarget).css('z-index'))
          {
            isOverlapped=1;
            overlapped=overlapped+$(this).css('z-index')+',';
          }
        });


        if(self.dragging == dragging1)
        {
          $(e.currentTarget).attr('r','read');
          var maxLeft=0;
          //move to side
          $('.polaroid').each(function() {
            var p1 = $(this);
            var position1 = p1.position();
            var zCheck=$(this).css('z-index')+',';
            if(maxLeft<position1.left && overlapped.indexOf(zCheck)!=-1)
              maxLeft=position1.left;

          });
          var nowleft=$(e.currentTarget).css('left');
          if(isOverlapped==1)
          {
            $(this).animate({

              left: ''+(maxLeft+335)
              //top: '-='+300
            }, "slow",function(){

              var zIndex=0;


              var nowz=$(this).css('z-index');
              $('.polaroid').each(function() {
                if($(this).css('z-index')>nowz)
                  $(this).css('z-index',$(this).css('z-index')-1);
              });

              $(this).css('z-index', curr_index);
              $(this).find('#envelope').rotate3Di('180',300,
                  {
                    sideChange:mySideChange,
                    complete: myComplete
                  }
              );

              $(this).find('#rot2').rotate3Di('180',300,
                  {
                    //complete: myComplete2
                  }
              );

              $(this).find('#frontcontents').css('display','none');

            });

            $(e.currentTarget).animate({



              left: ''+(nowleft)
              //	top: '+='+300
            }, "slow");
            $(this).attr('in','o');

          }

          else
          {
// if not overlapped, no animation - just change the z-index
            var zIndex=0;

            if($(e.currentTarget).css('z-index') == self.curr_index)
            {
              $(e.currentTarget).find('#envelope').rotate3Di('180',300,
                  {
                    sideChange:mySideChange,
                    complete: myComplete
                  }
              );
              $(e.currentTarget).find('#rot2').rotate3Di('180',300,
                  {
                    //complete: myComplete2
                  }
              );
              $(e.currentTarget).find('#frontcontents').css('display','none');
            }

            else
            {
              var nowz=$(e.currentTarget).css('z-index');
              $('.polaroid').each(function() {

                if($(this).css('z-index')>nowz)
                  $(this).css('z-index',$(this).css('z-index')-1);
              });

              $(e.currentTarget).css('z-index', self.curr_index);
              $(e.currentTarget).find('#envelope').rotate3Di('180',300,
                  {
                    sideChange:mySideChange,
                    complete: myComplete
                  }
              );
              $(e.currentTarget).find('#rot2').rotate3Di('180',300,
                  {
                    //complete: myComplete2
                  }
              );
              $(e.currentTarget).find('#frontcontents').css('display','none');

            }
            $(e.currentTarget).attr('in','o');
          }


          var size=$(e.currentTarget).children(':first-child').css('width');

          $('.pin').text(size);



        }
        else
        {
          self.filter=0;
        }
      }


    },
    getInt(a) {
      return parseInt((a.substring(0, a.length-2)));
    },
    randomXToY(minVal,maxVal,floatVal) {
      let randVal = minVal+(Math.random()*(maxVal-minVal));
      return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
    },
    mailin(mcimg) {
      var self = this
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
    myComplete2(targetElement) {
      var self = this
      //alert('hello');
      var p=$(targetElement);
      console.log("test p", p)
      var polaroid=$(targetElement).parent();
      if(p.find('#letter').css('display')=='none')
      {
        p.parent().find('#frontcontents').show();

        $(p).parent().find('#frontcontents').css('position','absolute');
        $(p).parent().find('#frontcontents').css('top','128px');
      }
      setTimeout(function(){
          /*                                var csso1={top:'0px',left:'1px'};
                 csso1.top=getInt($('.trash1').css('top'))-200+5+10-3*(trayptr % 5)+'px';
                 csso1.left=getInt($('.tray').css('left'))+200+20-buttonwidth-MARGIN+'px';
                 $(polaroid).animate(csso1, 1000);*/


          self.trayptr++;
          var z123=$(polaroid).css('z-index');

          if($(polaroid).find('.envcontents').find('#rot2').css('display')!='none')
          {

            $(polaroid).find('.envcontents').find('#rot2').css('display','none');
            $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');

            self.trayEmailsFlag[self.trayptr]=1;
          }
          else
          {
            $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
            self.trayEmailsFlag[self.trayptr]=0;
          }
          $( polaroid ).draggable({disabled: true});
          $(polaroid).find('.envcontents').find('#envelope').css('left','0px');
          $(polaroid).find('.envcontents').find('#envelope').css('top','40px');
          $(polaroid).attr('t','tray');

          $(polaroid).find('#frontcontents').css('display','none');
          var csstrash1 = {left:'1100px',

            position:'absolute'
          };

          csstrash1.top=self.getInt($('.trash1').css('top'))+5+10-3*(self.trayptr % 5)+'px';
          csstrash1.left=self.getInt($('.tray').css('left'))+20-self.buttonwidth-self.MARGIN+'px';
          $(polaroid).animate(csstrash1,1000);
          $(polaroid).css('z-index',z123);
          self.trayEmails[self.trayptr]=$(polaroid);
        },300);
      /*

       //       p.find('#frontcontents').show();
      //        $(this).css('display','none');
      p.find('.envcontents').find('#rot3').css('z-index','auto');
              p.find('.envcontents').find('#letter').css('z-index','auto');
                   p.find('.envcontents').find('#rot1').css('z-index','auto');
                   p.find('.envcontents').css('z-index','auto');*/
      $(targetElement).rotate3Di('unflip',1);
      $(targetElement).find('#envelope').rotate3Di('unflip',1);
      $(targetElement).find('#rot2').rotate3Di('unflip',1);
    }
  }
}
</script>