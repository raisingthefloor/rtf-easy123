/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 var ip="ezcomm.dyndns.org:8084/web";
// ip="localhost:8084/ez_here";
 var dragging = 0;
 var W=screen.width;
 var H=screen.height;
 var filter=0;
 var filter2=0;
 var deletedEmail;
 var openedDeleted;
 var lastDragged;
 var trayEmails=new Array();
 var trayEmailsFlag=new Array();
 var trayptr=-1;
 var contactOpened=0;
 var mailOpened=0;
 var albumOpened=0;
 var loadingPhotos=1;
var MARGIN=0;
var buttonwidth=0;
var savez=0;
var USERNAME="Eleanor";
var USERPIC="contacts/Martha.jpg";
var destination;
 $(document).ready(function() {



//$("<div class='polaroid' r='unread' t='none' in='c'><img src='mail/mailinbox.png' id='mailinbox' style='display:none'><div class='envcontents' style='display:none; width:355px'><img src='mail/envelope.png'   id='envelope' style='position:absolute;'/><img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' /><div id='letter' style='display:none; top:132px;left:25px; position:absolute; '><img id='paper' src='mail/paper2.png' />    	<div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>Hi Eleanor, <br> We will be having a picnic this Sunday.. Would you like to join us? <br> Thanks<br> Tracy <button class='reply' style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Reply</span></button> <button class='close' style=' padding-left:10px;position:absolute; top:580px; left:120px; padding-right:10px; '> <span style=' font-size:19px;'>Keep</span></button>  <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>        </div></div><img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/><img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>   </div><div id='frontcontents' style='display:none;'><div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div><div style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>Tracy</div><div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div><div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'>Eleanor</div>	<div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'>About: balhblah</div><div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'> 04.25.2012</div><div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div><div style='position:absolute; left: 288px; top: 11px;' ><img src='contacts/Tracy.jpg'  width='48' height='56'/></div><div style='position:absolute; left: 285px; top: 15px;' ></div><div style='position:absolute; left: 195px; top: 40px;' ></div></div></div>").appendTo('#drag-wrapper');
var isPerson=0;

var people= new Array();
people[0]=new Array("Adam Smith","Anna Johnson","Becky Jones");  //AB
people[1]=new Array("Cathy Richards"); //CD
people[2]=new Array(""); //EF
people[3]=new Array("Gregg Vanderheiden","Heather Anderson"); //GH
people[4]=new Array("Jimmy");  //IJ
people[5]=new Array("Lee");  //KL
people[6]=new Array("Martha Brown","Mridu Sinha"); //MN
people[7]=new Array("");  //OP
people[8]=new Array("");   //QR
people[9]=new Array("Smita Ravi","Tracy"); //ST
people[10]=new Array("");
people[11]=new Array("");
people[12]=new Array("");

var t=50;
var i=0;

$('.flap').each(function(){
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

$('.flap').click(function()
{
if(isPerson==1)
{
isPerson=0;
$('#person_contact').hide();
    $('#person').animate({'width':'0px'}, 1000,function(){
        $(this).hide();
    });

/*            var a1=$('#person').css('left');
            var b1=parseInt((a1.substring(0, a1.length-2)));
           var a=$('#person').css('width');
            var b=parseInt((a.substring(0, a.length-2)));
    $('#person').animate({'left':''+(b1-b)+'px'},500,function(){
            $('#person').css('z-index',1);
    });

    $('#person').animate({'left':b1+'px'},500);*/




}
var index=parseInt($(this).attr('people'));
var stop=people[index].length;

for (var p=0;p<=5;p++)
    {
        if(p<stop)
            {
        var name=people[index][p].split(' ');
        $('#'+p).find('#contact_pic').attr('src','contacts/'+name[0]+'.jpg');
        $('#'+p).find('#contact_pic').show();
        $('#'+p).find('#contact_name').html(people[index][p]);
            }
            else
                {
        $('#'+p).find('#contact_pic').hide();
        $('#'+p).find('#contact_name').html('&nbsp;');

                }
    }

});





var viewportwidth;
var viewportheight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
$('.flap').hide();
$('.spiral').hide();
$('#contact').hide();
$('#person').hide();
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }

 // older versions of IE

 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }


  

var trash_x =(viewportwidth-128-5);
var trash_y = (viewportheight-128-5);
var moimg=new Image();
$(moimg).attr('src','mail/mailbox_o.png');
$(moimg).attr('id','mailbox');
var mcimg=new Image();
$(mcimg).attr('src','mail/mailbox_c.png');
$(mcimg).attr('id','mailbox');

		var csstrash = {left:'1100px',
                    top:'475px',
                    position:'absolute'
                  };

                  var people= new Array();
people[0]=new Array("Adam Smith","Anna Johnson","Becky Jones");  //AB
people[1]=new Array("Cathy Richards"); //CD
people[2]=new Array(); //EF
people[3]=new Array("Gregg Vanderheiden","Heather Anderson"); //GH
people[4]=new Array("Jimmy");  //IJ
people[5]=new Array("Lee");  //KL
people[6]=new Array("Martha Brown","Mridu Sinha"); //MN
people[7]=new Array();  //OP
people[8]=new Array();   //QR
people[9]=new Array("Smita Ravi","Tracy"); //ST
people[10]=new Array();
people[11]=new Array();
people[12]=new Array();

$('.contact').click(function(){
    
    
    
    var name=$(this).find('#contact_name').text().split(' ');
    var image=$(this).find('#contact_pic').attr('src');
    if(name[0].length>1)
      {  
          isPerson=1;
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
});



                //    $("#containment-wrapper").css('height',viewportheight-10+'px');
               //   $("#containment-wrapper").css('width',viewportwidth-20+'px');
                  $("#drag-wrapper").css('height',viewportheight+'px');
                  $("#drag-wrapper").css('width',viewportwidth-225+'px');
                  $("#drag-wrapper").css('left',225+'px');
                  $("#drag-wrapper").css('top','0px');
                  $("#drag-wrapper").css('position','absolute');
   //$("body").css('height',viewportheight-10+'px');
    //              $("body").css('width',viewportwidth-20+'px');



		$(".trash1").css(csstrash);
                $(".trash1").css('left',trash_x+'px');
                $(".trash1").css('top',trash_y+'px');

                $("#mail").css('left','0px');
                $("#mail").css('top','0px');
                                $("#palbum").css('left','0px');
                $("#palbum").css('top',getInt($('#mail').css('margin'))+getInt($('#mail').css('height'))+'px');
                
                                $("#icontact").css('left','0px');
                $("#icontact").css('top',2*getInt($('#palbum').css('margin'))+2*getInt($('#palbum').css('height'))+'px');

                $(".tray").css(csstrash);
                //$(".tray").css('top',trash_y+'px');


		$(".trash2").css(csstrash);
                $(".trash2").css('left',trash_x+'px');
                $(".trash2").css('top',(trash_y+37)+'px');
                //csstrash.top=trash_y+128-73+'px';
                csstrash.left=300+'px';
                csstrash.top=trash_y+5+'px';
                $(".tray").css(csstrash);


	$imgs = $(".polaroid");
	$imgCount = $imgs.length;

var curr_index=0;
var z = 1; //for setting the initial z-index's
var inAnimation = false; //flag for testing if we are in a animation
trash_x=trash_x-buttonwidth-MARGIN;
  $('.polaroid').each(function() { //set the initial z-index's
    z++; //at the end we have the highest z-index value stored in the z variable
    $(this).css('z-index', z); //apply increased z-index to <img>
  });

        curr_index=z;
  z++;
  $(".trash1").css('z-index',z+1);
$(".tray").css('z-index',1);
  //$(".trash_ball").css('z-index',z+2);
$(".trash2").css('z-index',z+3);
  $('.polaroid').mousedown(function() {

              dragging = $(this).css('left');
           if($(this).find('.envcontents').find('#envelope').attr('src')=='mail/tray_envelope1.png'||$(this).find('.envcontents').find('#envelope').attr('src')=='mail/tray_envelope2.png')
           {



if(trayptr!=-1)
    {
        var deletedEmail1=trayEmails[trayptr];

        $(deletedEmail1).attr('t','none');
        var openedT=trayEmailsFlag[trayptr];
trayptr--;

//alert(deletedEmail1);
                		var csstrash1 = {

                    position:'absolute'
                  };
csstrash1.top=trash_y-128+'px';
$( deletedEmail1 ).draggable({disabled: false});
var nowz=$(deletedEmail1).css('z-index');
 $('.polaroid').each(function() {

    if($(this).css('z-index')>nowz)
        $(this).css('z-index',$(this).css('z-index')-1);
  });


$(deletedEmail1).css('z-index', curr_index);
    //$(deletedEmail1).css('z-index', z+2);
    $(deletedEmail1).animate(csstrash1,500,function(){
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

                csstrash1.top=trash_y-128-239+'px';
//                csstrash1.left=trash_x+34-355+'px';

                $(deletedEmail1).css(csstrash1);

                csstrash1.top=trash_y-128-239-50+ 10*((trayptr+1) % 10 )+'px';
                csstrash1.left=trash_x-900+200+10*((trayptr+1) % 10 )+'px';
                $(deletedEmail1).animate(csstrash1,500,function(){


                });
    });

    }


           }










  });
$('.trash').mousedown(function(){

        var dE1;
        lastDragged=dE1;
if(deletedEmail!=undefined)
    {
        //console.log('trash mousedown');
      var  deletedEmail1=deletedEmail;
deletedEmail=dE1;
$(deletedEmail1).attr('t','none');

//alert(deletedEmail1);
                		var csstrash1 = {

                    position:'absolute'
                  };
csstrash1.top=trash_y-128+'px';
$( deletedEmail1 ).draggable({disabled: false});
var nowz=$(deletedEmail1).css('z-index');
 $('.polaroid').each(function() {

    if($(this).css('z-index')>nowz)
        $(this).css('z-index',$(this).css('z-index')-1);
  });



    $(deletedEmail1).css('z-index', z+2);
    $(deletedEmail1).animate(csstrash1,500,function(){
                $(deletedEmail1).find('.envcontents').find('#envelope').attr('src','mail/envelope.png');
                     $(deletedEmail1).css('z-index', curr_index);
                $(deletedEmail1).find('#frontcontents').show();
                if($(deletedEmail1).attr('r')=="read")
                {
                $(deletedEmail1).find('.envcontents').find('#rot2').show();
                     $(deletedEmail1).find('.envcontents').find('#envelope').css('top','128px');
                    $(deletedEmail1).find('#frontcontents').css('position','absolute');
                    $(deletedEmail1).find('#frontcontents').css('top','128px');

                     openedDeleted=dE1;
                }
                                $(deletedEmail1).css('z-index',curr_index);
                csstrash1.top=trash_y-128-239+'px';
                csstrash1.left=trash_x+34-355+'px';

                $(deletedEmail1).css(csstrash1);

                csstrash1.top=trash_y-128-239-50+'px';
                csstrash1.left=trash_x+34-355-75+'px';
                $(deletedEmail1).animate(csstrash1,500,function(){
                

                });
    });

    }

});


$('.tray').mousedown(function(){



if(trayptr!=-1)
    {
        var deletedEmail1=trayEmails[trayptr];
        
        $(deletedEmail1).attr('t','none');
        var openedT=trayEmailsFlag[trayptr];
        
trayptr--;

//alert(deletedEmail1);
                		var csstrash1 = {

                    position:'absolute'
                  };
csstrash1.top=trash_y-128+'px';
$( deletedEmail1 ).draggable({disabled: false});
var nowz=$(deletedEmail1).css('z-index');
 $('.polaroid').each(function() {

    if($(this).css('z-index')>nowz)
        $(this).css('z-index',$(this).css('z-index')-1);
  });


$(deletedEmail1).css('z-index', curr_index);
    //$(deletedEmail1).css('z-index', z+2);
    $(deletedEmail1).animate(csstrash1,500,function(){
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

                csstrash1.top=trash_y-128-239+'px';
//                csstrash1.left=trash_x+34-355+'px';

                $(deletedEmail1).css(csstrash1);

                csstrash1.top=trash_y-128-239-50+ 10*((trayptr+1) % 10 )+'px';
                csstrash1.left=trash_x-900+200+10*((trayptr+1) % 10 )+'px';
                $(deletedEmail1).animate(csstrash1,500,function(){


                });
    });

    }

});




$('.trash').mouseup(function(){

if(lastDragged!=undefined)
       {var lastDragged1=lastDragged;
           var flag123;
                   var a=$(lastDragged1).css('left');
            var b=parseInt((a.substring(0, a.length-2)));
            var a1=$(lastDragged1).css('top');
            var b1=parseInt((a1.substring(0, a1.length-2)));


            if(b+275>trash_x && b1>trash_y-64-240-20)
             {//alert($(lastDragged1).css('z-index'));
                 lastDragged=undefined;



                 var z123=$(lastDragged1).css('z-index');

                 if($(lastDragged1).find('.envcontents').find('#rot2').css('display')!='none')
                 {
                     $(lastDragged1).find('.envcontents').find('#rot2').css('display','none');
                     flag123=1;
                 }
                 else
                     flag123=undefined;
                 $( lastDragged1 ).draggable({disabled: true});
                 $(lastDragged1).find('.envcontents').find('#envelope').css('left','0px');
                 $(lastDragged1).find('.envcontents').find('#envelope').css('top','0px');
                                 $(lastDragged1).css('z-index',z+2);
                $(lastDragged1).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                $(lastDragged1).find('#frontcontents').css('display','none');
                $(lastDragged1).draggable(false);

                		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };


                $(lastDragged1).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(lastDragged1).animate(csstrash1,1000,function(){
                                    csstrash1.top=trash_y+128-73-20+'px';
                $(lastDragged1).animate(csstrash1,0,function(){

                     csstrash1.top=trash_y+128-73+'px';
                $(lastDragged1).animate(csstrash1,0,function(){
                     $(lastDragged1).css('z-index',z123);
                     $(lastDragged1).attr('t','trash');
                     //alert($(this).css('z-index'));
                     $(deletedEmail).css('display','none');
                     $(deletedEmail).attr('t','deleted');
                                      deletedEmail=$(lastDragged1);
                                      openedDeleted=flag123;
                });

                });

                });



             }


   }


});
    $(".polaroid").draggable({drag: function() {
     lastDragged=$(this);},containment: "#drag-wrapper", scroll: false});


$('.polaroid').mouseup(function(e){
   var target = $(e.target);


   //if(!target.is('.close')&&!target.is('#message'))
   if($(this).find('.envcontents').find('#envelope').attr('src')!='mail/trash_ball.png'&&$(this).find('.envcontents').find('#envelope').attr('src')!='mail/tray_envelope1.png'&&$(this).find('.envcontents').find('#envelope').attr('src')!='mail/tray_envelope2.png')
       {



//console.log("TARGET Id,class :"+$(target).attr('id')+","+$(target).attr('class')+target.html());
    var flag123;
            var a=$(this).css('left');
            var b=parseInt((a.substring(0, a.length-2)));
            var a1=$(this).css('top');
            var b1=parseInt((a1.substring(0, a1.length-2)));


            if(b+275>trash_x && b1>trash_y-64-240-20 && $(this).find('.envcontents').find('#envelope').attr('src')=='mail/envelope.png')
             {//alert($(this).css('z-index'));
                // console.log('polarioid mouseup');



                 var z123=$(this).css('z-index');

                 if($(this).find('.envcontents').find('#rot2').css('display')!='none')
                 {
                     $(this).find('.envcontents').find('#rot2').css('display','none');
                     flag123=1;
                 }
                 else
                     flag123=undefined;
                 $( this ).draggable({disabled: true});
                 $(this).find('.envcontents').find('#envelope').css('left','0px');
                 $(this).find('.envcontents').find('#envelope').css('top','0px');
                                 $(this).css('z-index',z+2);
                $(this).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                $(this).attr('t','trash');
                $(this).find('#frontcontents').css('display','none');
                $(this).draggable(false);

                		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };


                $(this).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(this).animate(csstrash1,1000,function(){
                                    csstrash1.top=trash_y+128-73-20+'px';
                $(this).animate(csstrash1,0,function(){

                     csstrash1.top=trash_y+128-73+'px';
                $(this).animate(csstrash1,0,function(){
                     $(this).css('z-index',z123);
                     $(deletedEmail).css('display','none');
                     $(deletedEmail).attr('t','deleted');
                                      deletedEmail=$(this);
                                      openedDeleted=flag123;
                     //alert($(this).css('z-index'));
                });

                });

                });



             }
             var height;
             if($(this).find('.envcontents').find('#rot2').css('display')=='none')
                 height=240;
             else
                 height=240+128;

//CODE FOR TRAY EMAILs
            if(b<trash_x-900+225+133 && b1+height>trash_y+64 && $(this).find('.envcontents').find('#envelope').attr('src')=='mail/envelope.png')
             {//alert($(this).css('z-index'));

              //   console.log('polarioid mouseup');

                 //$(deletedEmail).css('display','none');
                 trayptr++;
                 var z123=$(this).css('z-index');

                 if($(this).find('.envcontents').find('#rot2').css('display')!='none')
                 {

                     $(this).find('.envcontents').find('#rot2').css('display','none');
                     $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');

                    trayEmailsFlag[trayptr]=1;
                 }
                 else
                     {
                     $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
                     trayEmailsFlag[trayptr]=0;
                     }
                 $( this ).draggable({disabled: true});
                 $(this).find('.envcontents').find('#envelope').css('left','0px');
                 $(this).find('.envcontents').find('#envelope').css('top','40px');
                 $(this).attr('t','tray');

                $(this).find('#frontcontents').css('display','none');
                   		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };

                csstrash1.top=trash_y+5+10-3*(trayptr % 5)+'px';
                csstrash1.left=getInt($('.tray').css('left'))+20-buttonwidth-MARGIN+'px';
                $(this).animate(csstrash1,1000);
               $(this).css('z-index',z123);
               trayEmails[trayptr]=$(this);


             }




var p = $(this);
var position = p.position();
var L=position.left;
var T=position.top;
 var dragging1=$(this).css('left');
var isCurrent=0;
var isOverlapped=0;
if($(this).css('z-index')==curr_index)
    isCurrent=1;
var t='';
var nowzi=$(this).css('z-index');
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

if(flag1!=1 && flag2!=1 && flag3!=1 && flag4!=1 && nowzi<$(this).css('z-index'))
    {
    isOverlapped=1;
    overlapped=overlapped+$(this).css('z-index')+',';
    }
});


if(dragging == dragging1)
 {

 $(this).attr('r','read');
var maxLeft=0;
//move to side
 $('.polaroid').each(function() {
var p1 = $(this);
var position1 = p1.position();
var zCheck=$(this).css('z-index')+',';
if(maxLeft<position1.left && overlapped.indexOf(zCheck)!=-1)
    maxLeft=position1.left;

  });
var nowleft=$(this).css('left');
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

    $(this).animate({



    left: ''+(nowleft)
  //	top: '+='+300
  }, "slow");
      $(this).attr('in','o');
        
 }

else
{
// if not overlapped, no animation - just change the z-index
       var zIndex=0;

       if($(this).css('z-index')==curr_index)
       {
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
       }

       else
           {
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

           }
$(this).attr('in','o');
}


var size=$(this).children(':first-child').css('width');

  $('.pin').text(size);



 }
 else
 {
 filter=0;
 }
       }


});






$("#envelope").load(function(){
});

$('.throwaway').click(function(){
       var p=$(this).parent().parent();
       var q= p=$(p).parent().parent();
       var css23={top:'0px',left:'2px'};
       css23.left=viewportwidth-488+'px';
       css23.top=viewportheight-600+'px';
       $(q).css('z-index',savez);
       $(q).animate(css23,500, function(){

var p=$(this).find("#letter");


    //var z=parseInt($(p).parent().parent().css('z-index'));
   // alert($(p).parent().parent().attr('class'));
$(p).parent().parent().attr('in','c');
//console.log($(p).parent().parent().attr('class')+":"+z+","+$(p).parent().parent().find('.envcontents').find('#rot3').css('z-index')+","+p.css('z-index'));

$(p).find('#message').hide();

$(p).find('#paper').attr('src','mail/paper2.png');
$(p).find('#paper').animate({'width':'305px','height':'230px'},0,function(){
$(p).find('#paper').css('width','305px');
$(p).find('#paper').css('height','230px');

   });
   $(p).animate({'left':'25px', 'top':'-90px'},0,function(){
        $(p).css('z-index',z+1);
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
                                 $(polar).css('z-index',z+2);
                $(polar).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                $(polar).attr('t','trash');
                $(polar).find('#rot2').css('display','none');
                $(polar).find('#frontcontents').css('display','none');
                $(polar).draggable(false);

                		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };


                $(polar).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(polar).animate(csstrash1,1000,function(){
                                    csstrash1.top=trash_y+128-73-20+'px';
                $(polar).animate(csstrash1,0,function(){

                     csstrash1.top=trash_y+128-73+'px';
                $(polar).animate(csstrash1,0,function(){
                     $(polar).css('z-index',z123);
                     $(deletedEmail).css('display','none');
                     $(deletedEmail).attr('t','deleted');
                                      deletedEmail=$(polar);
                                      openedDeleted=flag123;
                     //alert($(this).css('z-index'));
                });

                });

                });




   });
  


       });
    /*   var z=parseInt($(p).parent().parent().css('z-index'));
$(p).parent().parent().attr('in','c')
console.log($(p).parent().parent().attr('class')+":"+z+","+$(p).parent().parent().find('.envcontents').find('#rot3').css('z-index')+","+p.css('z-index'));

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


   });*/


/*
 p=$(p).parent().parent();
alert($(p).attr('class'));
               var z123=$(p).css('z-index');

                 if($(p).find('.envcontents').find('#rot2').css('display')!='none')
                 {
                     $(p).find('.envcontents').find('#rot2').css('display','none');
                     flag123=1;
                 }
                 else
                     flag123=undefined;
                 $( p ).draggable({disabled: true});
                 $(p).find('.envcontents').find('#envelope').css('left','0px');
                 $(p).find('.envcontents').find('#envelope').css('top','0px');
                                 $(this).css('z-index',z+2);
                $(p).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                $(p).attr('t','trash');
                $(p).find('#frontcontents').css('display','none');
                $(p).draggable(false);

                		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };


                $(p).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(p).animate(csstrash1,1000,function(){
                                    csstrash1.top=trash_y+128-73-20+'px';
                $(p).animate(csstrash1,500,function(){

                     csstrash1.top=trash_y+128-73+'px';
                $(p).animate(csstrash1,500,function(){
                     $(p).css('z-index',z123);
                     $(deletedEmail).css('display','none');
                     $(deletedEmail).attr('t','deleted');
                                      deletedEmail=p;
                                      openedDeleted=flag123;
                     //alert($(this).css('z-index'));
                });

                });

                });



*/

});






            $('#mail').click(function(e){

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
                if(mailOpened==0)
                    {

                    if(albumOpened==1)
                    {
                        albumOpened=0;
                        albumin();
            delay=1000;
                    }
                    if(contactOpened==1)
                    {
                        contactOpened=0;
                        contactin();
                        delay=1000;
                    }
                    setTimeout(function(){
                    mailOpened=1;

                   $('.tray').show();
                   $('.trash1').show();
                   $('.trash2').show();
                  $('#mailbox').remove();
                  $('#mailbox_cont').append(moimg);
                  $('#mailbox_cont').css('right','34%');
                                    var a1=$('#mail').css('top');
                 // $('#mailinbox').show();
                 top=0;
                 margin=MARGIN;
                 left=0;


                  cssop.top=top+margin+130+'px';
                  cssop.left=left+margin+175+'px';
    
                  $('.polaroid').css(cssop);
                  var cnta=0;
                  $(".polaroid").each(function (){

                  $(this).find('#mailinbox').show();
                  cssop.top=top+margin+130+'px';
                  cssop.left=left+margin+175-(cnta % 5)*3-buttonwidth-MARGIN+'px';

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
                     flag123=undefined;
                 
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

                  
                $(this).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(this).find('.envcontents').find('#envelope').show();
                     csstrash1.top=trash_y+128-73+'px';
                     $(this).css(csstrash1);
                     $(this).css('z-index',z123);
                
                                      deletedEmail=$(this);
                                      openedDeleted=flag123;
                              }
                 else if(type=="tray")
                  {

                                                $(this).show();
                 $(this).find('#mailinbox').hide();
                 trayptr++;
                 var z123=$(this).css('z-index');

                 if(oc=="read")
                 {

                     $(this).find('.envcontents').find('#rot2').css('display','none');
                     $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope1.png');
                //     openedDeleted=1;
                    trayEmailsFlag[trayptr]=1;
                 }
                 else
                     {
                     $(this).find('.envcontents').find('#envelope').attr('src','mail/tray_envelope2.png');
                     trayEmailsFlag[trayptr]=0;
                     }
                     
                     $(this).find('.envcontents').find('#envelope').load(function(){
                         
                            $(this).parent().show();
                     });
                 $( this ).draggable({disabled: true});
                 $(this).find('.envcontents').find('#envelope').css('left','0px');
                 $(this).find('.envcontents').find('#envelope').css('top','40px');
                $(this).find('#frontcontents').css('display','none');
var csstrash1 = {left:'1100px',top:'450px',position:'absolute'};



                csstrash1.top=trash_y+5+10-3*(trayptr % 5)+'px';
                csstrash1.left=getInt($('.tray').css('left'))+20-buttonwidth-MARGIN+'px';
                //$(this).css(csstrash1);
              $(this).css('z-index',z123);
              $(this).animate(csstrash1,1200);
             trayEmails[trayptr]=$(this);
                  }

                          else if(type=='none')
                          {

                                                        $(this).show();
                        var sub=0;
                        if(trayptr > -1)
                            sub=trayptr+1;
                        if(deletedEmail!=undefined)
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
                        $(this).css('top',getInt($(this).css('top'))-100+'px');
                        var str = $('.pin').html();
			var rotDegrees = randomXToY(130, 500);
			var rotDegreesy = randomXToY(0, 300);
		var tempVal = Math.round(Math.random());
		if(tempVal == 1) {
			 rotDegrees = randomXToY(355, 360); // rotate left
		} else {
			 rotDegrees = randomXToY(5, 10); // rotate right
		}

		var cssObj = {
			'-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
			'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
			rotDegrees = randomXToY(width+25+50,viewportwidth-700-225 );
			rotDegreesy = randomXToY(200,viewportheight-700);
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
                    else if(mailOpened==1)
                        {
                            mailOpened=0;
                            mailin(mcimg);

                        }

            });
$('#palbum').click(function(){
    if(albumOpened==0 && loadingPhotos==0)
    {
    var delay=0;
    albumOpened=1;
    $('.tray').hide();
    $('.trash1').hide();
    $('.trash2').hide();

    if(mailOpened==1)
    {
        mailOpened=0;
        mailin(mcimg);
        delay=1000;
    }
    else if(contactOpened==1)
    {
        contactOpened=0;
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
        albumOpened=0;
        albumin();
    }
});


$('#icontact').click(function(){
if(contactOpened==0)
    {
var delay=0;

contactOpened=1;
$('.trash').show();
    //$('.trash').show();
    //$('.trash').show();
if(mailOpened==1)
{
    delay=1000;
    mailin(mcimg);
}
else if(albumOpened==1)
{
    delay=1000;
    albumin();
}
                   $('.tray').hide();
                   $('.trash1').show();
                   $('.trash2').show();
setTimeout(function(){



if(isPerson==1)
        $('#person').show();
else
    {
        $('#person').hide();
    }

$('#person_contact').hide();
$('#newspaper-b').hide();
        $('#contact').show();
        $('#person').animate({'position':'absolute','left':'300px', 'top':'20px',    'width':'550px','height':'650px'},1000,function(){
            if(isPerson==1)
                $('#person_contact').show();
            else
              {$('#person_contact').hide();
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
contactOpened=0;
contactin();
}
});


$('.reply').click(function(){
var polar=$(this).parent().parent().parent().parent();
destination=$(polar).find('#from').html();
var LEFT;var TOP;
var csss={'left':'0px'};
var l=getInt($(polar).css('left'));
csss.left=100+'px';
$(polar).animate(csss,1000,function(){
LEFT=getInt($(this).css('left'));
TOP=getInt($(this).css('top'));
        curr_index=z;
  z++;
        var reply_index=curr_index;
        if(contactOpened==1)
        {
            reply_index=20;
            destination=$('#person').find('#person_name').text();
            
        }
        savez=reply_index;
  $(".trash1").css('z-index',z+1);
$(".tray").css('z-index',1);
  //$(".trash_ball").css('z-index',z+2);
$(".trash2").css('z-index',z+3);
var names=destination.split(" ");
$("<div class='polaroid' r='unread' t='none' in='c'><img src='mail/mailinbox.png' id='mailinbox' style='display:none'><div class='envcontents' style='display:none; width:355px'><img src='mail/envelope.png'   id='envelope' style='position:absolute;'/><img src='mail/fullback2_1.png'  id='rot2' style='position:absolute; display:none; top:11px;' /><div id='letter' style='display:none; top:132px;left:25px; position:absolute; '><textarea id='inputpaper' scroll=no style='padding: 35px;   font-size:18px; font-weight:bold; overflow: none;  resize:none; background-image: url(mail/inputpaper.png); border:0; overflow: none;  display:none; width:488px;height:648px' >"+"Hi "+names[0]+"</textarea> <img id='paper' src='mail/paper2.png' />    	<div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '> <button class='send' style=' padding-left:10px; position:absolute; top:580px; left:25px; '> <span style=' font-size:19px;'>Send</span></button>  <button class='throwaway' style=' padding-left:10px;  padding-right:10px; position:absolute; top:580px; left: 315px; position: absolute '> <span style=' font-size:19px;'>Throw Away</span></button>        </div></div><img src='mail/back2_2.png'   id='rot3' style='position:absolute; top: 128px; display:none;'/><img src='mail/uflap.png'  id='rot1' style='position:absolute; top: 128px; display:none '/>   </div><div id='frontcontents' style='display:none;'><div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div><div style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>"+USERNAME+"</div><div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px'> To</div><div style='position:absolute; width:400px; left: 120px; top: 128px; font:Times New Roman; font-size:20px'>"+destination+"</div>	<div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333'></div><div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'></div><div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div><div style='position:absolute; left: 288px; top: 11px;' ><img src='"+USERPIC+"'  width='48' height='56'/></div><div style='position:absolute; left: 285px; top: 15px;' ></div><div style='position:absolute; left: 195px; top: 40px;' ></div></div></div>")
.css('z-index',1000)

.draggable({drag: function() {
     lastDragged=$(this);},containment: "#drag-wrapper", scroll: false})

.attr('t',"reply")

.appendTo('#drag-wrapper');

                       $(".polaroid").each(function () {
                          var type=$(this).attr('t');
                          
                          var oc=$(this).attr('r');


                          if(type=='reply')
                          {
                        var polar=$(this);
                        $(this).find('.throwaway').bind('click',function(){
       var p=$(this).parent().parent();
       var q=$(p).parent().parent();
       var css23={top:'0px',left:'2px'};
       css23.left=viewportwidth-255-488+'px';
       css23.top=viewportheight-600+'px';
       $(q).animate(css23,500, function(){

var p=$(this).find("#letter");


    //var z=parseInt($(p).parent().parent().css('z-index'));
   // alert($(p).parent().parent().attr('class'));
$(p).parent().parent().attr('in','c');
//console.log($(p).parent().parent().attr('class')+":"+z+","+$(p).parent().parent().find('.envcontents').find('#rot3').css('z-index')+","+p.css('z-index'));

$(p).find('#message').hide();

$(p).find('#paper').attr('src','mail/paper2.png');
$(p).find('#paper').animate({'width':'305px','height':'230px'},0,function(){
$(p).find('#paper').css('width','305px');
$(p).find('#paper').css('height','230px');

   });
   $(p).animate({'left':'25px', 'top':'-90px'},0,function(){

            $(p).css('z-index',z+1);
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
                                 $(polar).css('z-index',z+2);
                $(polar).find('.envcontents').find('#envelope').attr('src','mail/trash_ball.png');
                $(polar).attr('t','trash');
                $(polar).find('#rot2').css('display','none');
                $(polar).find('#frontcontents').css('display','none');
                $(polar).draggable(false);

                		var csstrash1 = {left:'1100px',

                    position:'absolute'
                  };


                $(polar).css('left',trash_x+34+'px');
                csstrash1.top=trash_y+128-73+'px';
                csstrash1.left=trash_x+34+'px';
                $(polar).animate(csstrash1,1000,function(){
                                    csstrash1.top=trash_y+128-73-20+'px';
                $(polar).animate(csstrash1,0,function(){

                     csstrash1.top=trash_y+128-73+'px';
                $(polar).animate(csstrash1,0,function(){
                     $(polar).css('z-index',z123);
                     $(this).remove();
/*                     $(deletedEmail).css('display','none');
                     $(deletedEmail).attr('t','deleted');
                                      deletedEmail=$(polar);
                                      openedDeleted=flag123;*/
                });

                });

                });




   });



       });

});
                        $(this).find('.send').bind('click',function(){
                        var p=$(this).parent().parent();
                        var q=$(p).parent().parent();
                        $(q).css('z-index',savez);
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
                               $(p).css('z-index',z+1);
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
                      if(oc=='read')
                       {
                                $(this).find("#rot2").show();
                                $(this).find("#frontcontents").css('position','absolute');
                                $(this).find('#envelope').attr('src', 'mail/envelope.png');
                                $(this).find('#envelope').css('top', '128px');
                                $(this).find("#frontcontents").css('top','128px');
                       }
                        $(this).css('top',getInt($(this).css('top'))-100+'px');
                        var str = $('.pin').html();
                        cssop.left=viewportwidth+'px';
                        cssop.top=10+'px';
                        
                        
    $(this).animate(cssop,0,function(){
           $(this).find('#frontcontents').css('display','none');
           $(this).find('#envelope').rotate3Di('180',0,
{
            sideChange:mySideChange,
            complete: myComplete_reply
}
);

  });



                       }

                       });


});

});

});

function contactin()
{
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
}

function mailin(mcimg)
{
    var MARGIN=25;
    var TOP=0;
    var LEFT=0;
    var WIDTH=200;
                  var a1=$('#mail').css('top');
                  var top=parseInt((a1.substring(0, a1.length-2)));
                  var left=$('#mail').css('left');
                  var left=parseInt((left.substring(0, left.length-2)));
                  var margin=$('#mail').css('margin');
                  var margin=parseInt((margin.substring(0, margin.length-2)));
                  var width=$('#mail').css('width');
                   var width=parseInt((width.substring(0, width.length-2)));
                  var cssop={top:'0px',left:'0px',position:'absolute'};

                    var ani=1;
                   var cnta=0;
                  $(".polaroid").each(function (){
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
 //                                              $('.tray').hide();
 //                  $('.trash1').hide();
 //                  $('.trash2').hide();


}
function getInt(a)
{
            return parseInt((a.substring(0, a.length-2)));

}
function albumin()
{
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
$('.photos').animate({'top':'340px','left':'185px','width':'40px','height':'40px','z-index':'1'},1500,function(){

$('.photos').hide();


});

$('#title').hide();
    var album_list=$('#album_list').text().split(",");
    for(var i=0;i<album_list.length-1;i++)
    {

    
$("."+album_list[i]+'_caption').hide();
    }


}