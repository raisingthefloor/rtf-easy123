<template>
  <div>
    <div id="containment-wrapper" >
      <a class="button" style=" position: absolute; left: 0px; top: 0px; margin:25px;" id="mail" href="#">
        <div id="mailbox_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-88; margin-left:-88; z-index:1">
          <img  id="mailbox" src="mail/mailbox_c.png" />
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
      <a class="button" style=" position: absolute;  margin:25px;"  href="#" id="palbum">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-80; margin-left:-88; z-index:3"><img width="175" height="175" id="palbumimg" src="mail/album2.png" /> </div>
      </a>
      <a class="button" style=" position: absolute;  margin:25px;"  href="#" id="icontact">
        <div id="palbum_cont" style="vertical-align:middle; top:50%; left:50%; position:absolute; margin-top:-70; margin-left:-75; z-index:3">
          <img id="palbumimg" src="mail/contact.png" />
        </div>
      </a>

      <div id="drag-wrapper"></div>
      <p class='pin' style=" display:none">hello</p>

      <img src="mail/trash_ball.png" style="display:none"/>
      <img src="mail/tray_envelope1.png" style="display:none"/>
      <img src="mail/tray_envelope2.png" style="display:none"/>

      <div class='polaroid' r='unread' t='none' in='c'>
        <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
        <div class='envcontents' style='display:none; width:355px'>
          <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
          <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
          <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
            <img id='paper' src='mail/paper2.png' />
            <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
              Hi Granny, <br>  My birthday is next week and I am really excited about it..  <br><br> It would be awesome if you could join us.. :) <br>Love<br> Becky
              <button class='reply' style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button>
              <button class='close' style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>
              <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>
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
          <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: My Birthday Party!</div>

          <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div>

          <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
          <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
          <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
          <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

        </div>

      </div>

      <div class='polaroid' r='unread' t='none' in='c'>
        <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
        <div class='envcontents' style='display:none; width:355px'>
          <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
          <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
          <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
            <img id='paper' src='mail/paper2.png' />
            <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>

              <p style="margin-top: 0px; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-family: 'times new roman', 'new york', times, serif; font-size: 16px; ">
              <p class="MsoNormal">Hi Mom,</p>
              <div></div>
              <div>Thought you would like this one</div>
              <div>Gregg</div>
              <div><br></div>
              <p class="MsoNormal">
                <b>
                    <span style="font-size: 15pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">
                    If you are an owner of a dog or know someone who has a dog&nbsp;belonging to a dangerous breed category,&nbsp;or if&nbsp;you have a child visiting your house, please take this as a warning.
                    </span>
                </b>
                <b>
                  <span style="font-size: 10pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">&nbsp;<br></span>
                </b>
                <b>
                    <span style="font-size: 18pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">
                      Don't leave your dog with any small
                    </span>
                </b>

                <b>
                  <span style="font-size: 13.5pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">&nbsp;</span>
                </b>
                <b>
                    <span style="font-size: 18pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">
                      child unattended under any circumstances!&nbsp;<br>
                    </span>
                </b>

                <b>
                  <span style="font-size: 10pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; "></span>
                </b>

                <b>
                  <span style="font-size: 15pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">Only one little moment was</span>
                </b>

                <b>
                  <span style="font-size: 13.5pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">&nbsp;</span>
                </b>

                <b>
                  <span style="font-size: 15pt; background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; font-family: serif; background-position: initial initial; background-repeat: initial initial; ">enough for the following to happen.&nbsp;</span>
                </b>
              </p>
              <p style="font-family: 'times new roman', 'new york', times, serif; font-size: 16px; ">
                <strong style="font-size: 10pt; ">&nbsp;
                  <span style="background-image: initial; background-attachment: initial; background-origin: initial; background-clip: initial; background-color: white; background-position: initial initial; background-repeat: initial initial; ">
                    <img src="images/AT.jpg" width="144" height="192">The Dog
                  </span>
                </strong>
              </p>

              <button class='reply' style=' padding-left:10px; position:absolute; top:580px; left:25px; '>
                <span style=' font-size:19px;'>Reply</span>
              </button>

              <button class='close' style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '>
                <span style=' font-size:19px;'>Keep</span>
              </button>

              <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '>
                <span style=' font-size:19px;'>Throw Away</span>
              </button>
            </div>
          </div>
          <img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/>
          <img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>
        </div>

        <div id='frontcontents' style='display:none;'>
          <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
          <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>Gregg C Vanderheiden</div>
          <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div>
          <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> Eleanor</div>
          <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: Dog Warning!</div>

          <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div>

          <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
          <div style='position:absolute; left: 288px; top: 11px;' ><img src='mail/Gregg.gif'  width='48' height='56'/></div>
          <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
          <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

        </div>
      </div>

      <div class='polaroid' r='unread' t='none' in='c'>
        <img src='mail/mailinbox.png' id='mailinbox' style='display:none'>
        <div class='envcontents' style='display:none; width:355px'>
          <img src='mail/envelope.png'   id='envelope' style='position:absolute;'/>
          <img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' />
          <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
            <img id='paper' src='mail/paper2.png' />
            <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
              Hi Eleanor, <br> We will be having a picnic this Sunday.. Would you like to join us? <br> Thanks<br> Tracy
              <button class='reply' style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button>
              <button class='close' style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>
              <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>
            </div>
          </div>
          <img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/>
          <img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>
        </div>

        <div id='frontcontents' style='display:none;'>
          <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>


          <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>Tracy</div>
          <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div>
          <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'>Eleanor</div>
          <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: Picnic Sunday</div>

          <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div>

          <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
          <div style='position:absolute; left: 288px; top: 11px;' ><img src='contacts/Tracy.jpg'  width='48' height='56'/></div>
          <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
          <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

        </div>
      </div>

      <div id="photocontent"></div>
    </div>

    <div class="flap" style="position:absolute; z-index: 5; left: 852px; top: 61px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">A B</div> </div>

    <div class="flap" style="position:absolute; z-index: 5; left: 852px; top: 109px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">C D</div></div>

    <div  class="flap" style="position:absolute;z-index: 5; left: 852px; top: 156px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">E F</div></div>

    <div class="flap"  style="position:absolute;z-index: 5; left: 852px; top: 203px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">G H</div></div>

    <div  class="flap" style="position:absolute;z-index: 5; left: 852px; top: 250px;"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">I J</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 297px;"> <img src="images/contact1.png"  /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">K L</div> </div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 344px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">M N</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 391px;"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">O P</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 438px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">Q R</div></div>

    <div class="flap" style="position:absolute; z-index: 5;left: 852px; top: 485px;"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">S T</div></div>

    <div class="flap" style="position:absolute; z-index: 5;left: 852px; top: 532px;"> <img src="images/contact1.png" /> <div style="position:absolute; left: 7px; top: 7px; font-size: 22px">U V</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 579px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">W X</div></div>

    <div class="flap" style="position:absolute;z-index: 5; left: 852px; top: 626px;"> <img src="images/contact1.png"  /><div style="position:absolute; left: 7px; top: 7px; font-size: 22px">Y Z</div></div>

    <div id="person" style= "position:absolute;left:60px; top:306px;    width:120px; height:143px;border : 1px solid #f0e9eb; display:none; z-index: 3; background-color: #fefefe;     ">
      <div id="person_contact" style="display:none;">
        <img id="person_pic" src="contacts/gregg.gif" width="128" height="128" style="margin:30px;"/>
        <div id="person_name" align="left" style="padding-left:0px;position:absolute; left:188px; top:80px; font-size: 30px"></div>
        <div id ="options" style="position:absolute; left: -1px; top: 203px;" align="center">

          <a class="large awesome reply" href="#">
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
          <tr id="0" class="contact" style="height:95px;">
            <td style="padding-right:0px; margin:0px; width: 100px"><img id="contact_pic" src="contacts/Adam.jpg" width="70" height="70" /></td>
            <td id="contact_name" align="left" style="padding:0px; margin: 0px;" >Adam Smith</td>
          </tr>

          <tr id="1" class="contact" style="height:95px;">
            <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Anna.jpg" width="70" height="70" style="" /></td>
            <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Anna Johnson</td>
          </tr>

          <tr id="2" class="contact" style="height:95px;">
            <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/Becky.jpg" width="70" height="70" style="" /></td>
            <td id="contact_name" align="left" style="padding-left:0px; margin:0px">Becky Jones</td>
          </tr>

          <tr id="3" class="contact" style="height:95px;">
            <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
            <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
          </tr>

          <tr id="4" class="contact" style="height:95px;">
            <td style="padding-right:0px;width: 100px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
            <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
          </tr>

          <tr class="contact" id="5" style="height:95px;">
            <td style="padding-right:0px; margin:0px"><img id="contact_pic" src="contacts/gregg.gif" width="70" height="70" style="display:none;" /></td>
            <td id="contact_name" align="left" style="padding-left:0px; margin:0px">&nbsp;</td>
          </tr>

        </tbody>
      </table>
    </div>

    <img src="mail/trash1_1.png" class="trash1 trash" />
    <img src="mail/trash1_2.png" class="trash2 trash" />
    <img src="mail/desk.png" class="tray" width="133" height="133" style="position:absolute; top:100px;"/>
  </div>
</template>








<style>
#containment-wrapper
{
  width: 100%;
  height: 100%;
  background : #f7f7f7;
  border : 1px solid #f0e9eb;
  padding:0px
}
</style>


<script type="text/javascript" src="jquery/jquery-1.3.2.js"></script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>

<script type="text/javascript" src="js/mail.js"></script>
<script type="text/javascript" src="js/animate_photo.js"></script>

<script>
/*function mySideChange(front) {
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
}*/
function mySideChange1(front) {
  var p=$(this).parent().parent();
  var z=p.css('z-index');
  if (front) {


  } else {


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
  +//        $(this).css('display','none');
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
function myComplete2() {

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


    trayptr++;
    var z123=$(polaroid).css('z-index');

    if($(polaroid).find('.envcontents').find('#rot2').css('display')!='none')
    {

      $(polaroid).find('.envcontents').find('#rot2').css('display','none');
      $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');

      trayEmailsFlag[trayptr]=1;
    }
    else
    {
      $(polaroid).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
      trayEmailsFlag[trayptr]=0;
    }
    $( polaroid ).draggable({disabled: true});
    $(polaroid).find('.envcontents').find('#envelope').css('left','0px');
    $(polaroid).find('.envcontents').find('#envelope').css('top','40px');
    $(polaroid).attr('t','tray');

    $(polaroid).find('#frontcontents').css('display','none');
    var csstrash1 = {left:'1100px',

      position:'absolute'
    };

    csstrash1.top=getInt($('.trash1').css('top'))+5+10-3*(trayptr % 5)+'px';
    csstrash1.left=getInt($('.tray').css('left'))+20-buttonwidth-MARGIN+'px';
    $(polaroid).animate(csstrash1,1000);
    $(polaroid).css('z-index',z123);
    trayEmails[trayptr]=$(polaroid);
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
  name: 'HomeCustom',
  mounted() {
    this.$nextTick(function () {
      $('.trash').draggable({
        drag: function(e){
          e.preventDefault();
        }
      });
      $('.tray').draggable({
        drag: function(e){
          e.preventDefault();
        }
      });


      $('.close').click(function(){
        var p=$(this).parent().parent();
        var z=parseInt($(p).parent().parent().css('z-index'));
        $(p).parent().parent().attr('in','c')
        $(p).find('#message').hide();

        $(p).find('#paper').attr('src','mail/paper2.png');
        $(p).find('#paper').animate({'width':'305px','height':'230px'},650,function(){
          $(p).find('#paper').css('width','305px');
          $(p).find('#paper').css('height','230px');

        });

        $(p).animate({'left':'25px', 'top':'-90px'},650,function(){
          $(p).css('z-index',z+1);
          $(p).animate({'top':'132px'},300,function(){
            $(p).parent().parent().find('.envcontents').rotate3Di('-180',300,{
              sideChange:mySideChange1,
              complete:myComplete2
            });
          });
        });
      });
    })
  }
}
</script>