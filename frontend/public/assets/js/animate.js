 var dragging = 0;
 var W=screen.width;
 var H=screen.height;
 var filter=0;
 var filter2=0;
 $(document).ready(function() {
 var viewportwidth;
 var viewportheight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

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

var trash_x =(viewportwidth-128-30);
var trash_y = (viewportheight-128-30);

		var csstrash = {left:'1100px',
                    top:'475px',
                    position:'absolute',
                    display:'none'};





		$(".trash").css(csstrash);
                $(".trash").css('left',trash_x+'px');
                $(".trash").css('top',trash_y+'px');

	$imgs = $(".polaroid");
	$imgCount = $imgs.length;
	
	var curr_index=0;
  var z = 0; //for setting the initial z-index's
  var inAnimation = false; //flag for testing if we are in a animation
  
  $('.polaroid').each(function() { //set the initial z-index's
    z++; //at the end we have the highest z-index value stored in the z variable
    $(this).css('z-index', z); //apply increased z-index to <img>
  });
	
	//alert('Your resolution is '+screen.width+'x'+screen.height);
	
        curr_index=z;
  z++;
  $(".trash").css('z-index',z+1);

  $('.polaroid').mousedown(function() {

       dragging = $(this).css('left');

  });

$('.polaroid').mouseup(function(e){
  
     var target = $(e.target);
var isChild=(target.is("#other"));

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
var  overlapped='';
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
if(L>L1+400)
    flag1=1;

//Cond2.  If A's right edge is to the left of the B's left edge,
//           -  then A is Totally to left Of B

if(L+400<L1)
    flag2=1;

//Cond3.  If A's top edge is below B's bottom  edge,
//           -  then A is Totally below B

if(T>T1+340)
    flag3=1;

//Cond4.  If A's bottom edge is above B's top edge,
//           -  then A is Totally above B

if(T+340<T1)
    flag4=1;

if(flag1!=1 && flag2!=1 && flag3!=1 && flag4!=1 && nowzi<$(this).css('z-index'))
    {
    isOverlapped=1;
    overlapped=overlapped+''+$(this).css('z-index')+',';
    }
});
/*if((position1.left>L&&position1.left<L+400) || (position1.left+400>L&&position1.left+400<L+400))
    flagh=1;
if((position1.top>T&&position1.top<T+340) || (position1.top+340>L&&position1.top+340<(T+340)))
    flagv=1;

t=t+''+flagh+''+flagv+$(this).css('z-index')+',';

if(((position1.left>L&&position1.left<L+400) || (position1.left+400>L&&position1.left+400<L+400)) && ((position1.top>T&&position1.top<T+340) || (position1.top+340>L&&position1.top+340<(T+340)))  && nowzi<$(this).css('z-index'))
{
       isOverlapped=1;
}

  });*/
//$('.pin2').text(t+isOverlapped)

if(dragging == dragging1 && !isChild)
 {
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

    left: ''+(maxLeft+400)
  	//top: '-='+300
  }, "fast",function(){

       var zIndex=0;

       if($(this).css('z-index')==curr_index)
       {

       }

       else
           {
var nowz=$(this).css('z-index');
 $('.polaroid').each(function() {
	
    if($(this).css('z-index')>nowz)
        $(this).css('z-index',$(this).css('z-index')-1);
  });
	
     $(this).css('z-index', curr_index);
           }

  });

    $(this).animate({



    left: ''+(nowleft)
  //	top: '+='+300
  }, "slow");

    }
 //Bringing to front
else
{

       var zIndex=0;

       if($(this).css('z-index')==curr_index)
       {

       }

       else
           {
var nowz=$(this).css('z-index');
 $('.polaroid').each(function() {

    if($(this).css('z-index')>nowz)
        $(this).css('z-index',$(this).css('z-index')-1);
  });

     $(this).css('z-index', curr_index);
           }
}









///////////////////////////////






var size=$(this).children(':first-child').css('width');

  $('.pin').text(size);
if(size == '180px')
{

    $(this).children(':first-child').animate({

    width: '+=' + '200',
  	height: '+='+ '200'
  }, "slow");
 }
 else if(size=='380px')
 {

      $(this).children(':first-child').animate({

    width: '+=' + '-200',
  	height: '+='+ '-200'
  }, "slow");


 }
 }
 else
 {
 filter=0;
 }

});







$("#envelope").load(function(){
$(".envcontents").show();
$(".polaroid").each(function (i) {
 var str = $('.pin').html();
			var rotDegrees = randomXToY(130, 720);
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
		$(this).css(cssObj);

viewportwidth-335-128-30


			 rotDegrees = randomXToY(0, viewportwidth-400-128-30);
			 rotDegreesy = randomXToY(0, viewportwidth-340-128-30);



if(str == 'hello')
{

    $(this).animate({

    left: '+='+rotDegrees,
  	top: '+='+rotDegreesy
  }, "slow");

}
});

$('.pin').text("blah");

});



$(".stack").click(function () {
$('.pin1').text("blah");
var y=190;
var z=1;
var top=200;
$(".polaroid").each(function (i) {
 var str = $('.pin').html();


$(this).css('z-index',z);
z++;
var x=y+$(this).css('z-index')*20;
var s=x+'px';

var top1=top+$(this).css('z-index')*10;
var t=top1+'px';
    $(this).animate({

    left: s,
	top: t

  }, "slow");


});
});


$(".delete").click(function () {
$(".trash").fadeIn(500);
filter=1;
var p=$(this).parent().parent();
 $(p).find('.date').remove();
  $(p).find('.to').remove();
   $(p).find('.from').remove();
    $(p).find('.about').remove();
	 $(p).find('.read').remove();
	  $(p).find('.delete').remove();

       $(p).find('.env').animate({

    width: '100px',
  	height: '100px'
  }, "slow");


		var cssObj = {
			'left' : '1100px',  // safari only
			'top' : '450px'};

cssObj.left=(trash_x-103)+'px';
cssObj.top=(trash_y-103)+'px';



       $(p).animate(cssObj, "slow", function() {
   $(p).remove();
   $(".trash").fadeOut(1000);
  });

});


				$('.resizer a').click(function() {

        
			var textSize = $(this).parent().attr('class');
			$('body').removeClass('small medium large').addClass(textSize);
			//$.cookie('TEXT_SIZE',textSize, {path: '/', expires: 10000});
			return false;
		});


$(".delete1").click(function () {
$(".trash").fadeIn(1000);
filter=1;
var p=$(this).parent().parent();
 $(p).find('.envcontents').remove();
$(p).find('.b').remove();
	$('body').removeClass('small medium large').addClass('small');
$(p).find('#content').css('font-size','5px');

       $(p).find('#content').animate({

    width: '100px'
  }, "slow");


		var cssObj = {
			'left' : '1100px',  // safari only
			'top' : '450px'};

cssObj.left=(trash_x-103)+'px';
cssObj.top=(trash_y-103)+'px';




       $(p).animate(cssObj, "slow", function() {
   $(p).remove();
   $(".trash").fadeOut(1000);
  });





});



$(".archive").click(function () {
var p=$(this).parent().parent();
filter=1;
 $(p).find('.envcontents').remove();
$(p).find('.b').remove();
	$('body').removeClass('small medium large').addClass('small');
$(p).find('#content').css('font-size','5px');

       $(p).find('#content').animate({

    width: '100px'
  }, "slow");

       $(p).animate({


    left: '1100px',
  	top: '200px'
  }, "slow", function() {
   $(p).remove();
   
  });





});


	$('.read').click(function(){
filter=1;
var p=$(this).parent().parent();
$(p).find('.envcontents').fadeOut(500);
$(p).find('#content').show('normal');
$(p).find('.b').show();
var rotDegrees=0;
		var cssObj = {
			'-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
			'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
		$(p).css(cssObj);
	});
	$('.back').click(function(){
filter=1;
var p=$(this).parent().parent();
$(p).find('.envcontents').fadeIn(500);
$(p).find('#content').hide('normal');
$(p).find('.b').hide();
var rotDegrees=0;
		var cssObj = {
			'-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
			'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
		$(p).css(cssObj);

	});




});


