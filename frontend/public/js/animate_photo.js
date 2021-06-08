

$(document).ready(function() {

            $.ajax({url:"photo_c.html", success:function(result){

    $("#photocontent").html(result);
    

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
//alert(viewportwidth+"**"+viewportheight);
var currentLeft;
var currentAlbum;
var stackFlag=0;
var N=2;

var margins=250;
var height=550;
var width=733;
var album_list=$('#album_list').text().split(",");
$('#album_list').hide();
$('#title').hide();
$('#title1').hide();
$('#go').click(function(){
    for(var i=0;i<album_list.length-1;i++)
    {


toStack("."+album_list[i],margins+i*150+'px',i,1);
    }
    $('#album_list').show();
});
//toStack(".apr5",'170px',1);

var Ctop=165;
var h2=height*0.6;
var w2=width*0.6;
var ts=(viewportwidth-width-margins);
ts=230;
var ts2=2*(ts/3);
var ts1=1*(ts/3);
//alert(ts+","+ts2+","+ts1);
ts2=ts2/2;
ts1=ts1/2;

var h1=h2*0.6;
var w1=w2*0.6;
var top2=0.2*height;
var top1=0.2*h2;
var extra_padding=viewportwidth-2*ts1-2*ts2-width-margins;
var exta_padding=extra_padding/2;
margins=margins+extra_padding/2;
//var ts2=w2/4;
// var ts1=w1/4;
$('#title1').css('left',margins+'px');

$('#title1').css('top',Ctop+height+10+'px');
//alert('hello'+margins+"c"+Ctop+height+10);
var cssL1 = {
  'left':'93px',
  'top':'350px',
  'width':'81px',
   'height':'56px',
  'position':'absolute'
  };

cssL1.height=h1+'px';
cssL1.width=w1+'px';
cssL1.left=margins+'px';
cssL1.top=Ctop+top1+top2;

var cssL2 = {
  'left':'159px',
  'top':'302px',
  'width':'165px',
   'height':'124px',
  'position':'absolute'
  };

cssL2.height=h2+'px';
cssL2.width=w2+'px';
cssL2.left=margins+w1-(w1-ts1)+'px';
cssL2.top=Ctop+top2+'px';


var cssC = {
  'left':'324px',
  'top':'171px',
  'width':'335px',
   'height':'275px',
  'position':'absolute'

  };

cssC.height=height+'px';
cssC.width=width+'px';
cssC.left=margins+w1-(w1-ts1)+w2-(w2-ts2)+'px';
cssC.top=Ctop+'px';

var cssR2= {
  'left':'659px',
  'top':'302px',
  'width':'165px',
   'height':'124px',
  'position':'absolute'
  };

cssR2.height=h2+'px';
cssR2.width=w2+'px';
cssR2.left=margins+w1-(w1-ts1)+w2-(w2-ts2)+width-(w2-ts2)+'px';
 cssR2.top=Ctop+top2;
var cssR1 = {
  'left':'809px',
  'top':'350px',
  'width':'81px',
   'height':'56px',
  'position':'absolute'


  };

cssR1.height=h1+'px';
cssR1.width=w1+'px';
cssR1.left=margins+w1-(w1-ts1)+w2-(w2-ts2)+width-(w2-ts2)+w2-(w1-ts1)+'px';
cssR1.top=Ctop+top1+top2+'px';










var cssd={'-webkit-transform': 'rotate(0deg)',
   	'-moz-transform': 'rotate(0deg)',
   	'transform': 'rotate(0deg)',
    'margin':'0px'};

  var tosl;
var tosr;
        $('.c')	.mouseenter( function() {
		//if ($(this).hasClass('current')) {
			//$(this).addClass('hover');
		//}
	});
        $('.c')	.mouseleave( function() {
		//if ($(this).hasClass('current')) {
			//$(this).removeClass('hover');
		//}
	});
       /*    $('.photos').onselect(function(){alert('hello');


   });*/
           $('.photos').draggable({
        drag: function(e){
            e.preventDefault();
        }
    });


$('.photos').bind('mousedown',function(){

        var status=$(this).attr('status');
var album=$(this).attr('class');
var album=album.substring(0,album.indexOf(' '));
album='.'+album;

$imgs = $(album);
var imgCount = $imgs.length;



if(status=='stack' )
    {
                var tmpleft=currentLeft;
                var tmpAlbum=currentAlbum;

                if(tmpAlbum!=undefined)
                        toStack(tmpAlbum,tmpleft,0,1);
        currentLeft=$(album).css('left');
        currentAlbum=album;
    var lr=toCarousel(album,imgCount,cssL1,cssL2,cssR1,cssR2,cssC,cssd);
      tosl=parseInt(lr.charAt(0));
        tosr=parseInt(lr.charAt(2));

    }
    else
        {

var pos=$(this).attr('id');
var left1;
var left2;
var center;
var right2;
var right1;

    if(pos == "left2")
        {
            var time=1200;
            left1=move(tosl,"left1",imgCount+1,cssL2,time,album);
            tosl--;
            left2=move(imgCount+1,"left2",imgCount+2,cssC,time,album);
            center=move(imgCount+2,"center",imgCount+1,cssR2,time,album);
            tosr++;
            right2=move(imgCount+1,"right2",tosr,cssR1,time,album);
            $(left1).attr('id','left2');
            $(left2).attr('id','center');
            $(center).attr('id','right2');
            $(right2).attr('id','right1');
        }
    else if(pos == "left1")
    {
    var time=1500;

var toc=move (tosl,"left1",imgCount+2,cssC,time,album);
tosl--;
var tol2=move(tosl,"left1",imgCount+1,cssL2,time,album);
tosl--;
var tor2=move (imgCount+1,"left2",imgCount+1,cssR2,time,album);
tosr++;
var tor1=move (imgCount+1,"right2",tosr,cssR1,time,album);
tosr++;
var tor1a=move (imgCount+2,"center",tosr,cssR1,time,album);



$(toc).attr('id','center');
$(tol2).attr('id','left2');
$(tor2).attr('id','right2');
$(tor1).attr('id', 'right1');
$(tor1a).attr('id', 'right1');

    }
    else if(pos == "right2")
        {
            var time=1200;
            var tor2=move(tosr,"right1",imgCount+1,cssR2,time,album);
            tosr--;
            var toc=move(imgCount+1,"right2",imgCount+2,cssC,time,album);
            var tol2=move(imgCount+2,"center",imgCount+1,cssL2,time,album);
            tosl++;
            var tol1=move(imgCount+1,"left2",tosl,cssL1,time,album);
            $(tol2).attr('id','left2');
            $(toc).attr('id','center');
            $(tor2).attr('id','right2');
            $(tol1).attr('id','left1');
        }
    else if(pos == "right1")
    {


    var time=1500;

var toc=move (tosr,"right1",imgCount+2,cssC,time,album);
tosr--;
var tor2=move(tosr,"right1",imgCount+1,cssR2,time,album);
tosr--;
var tol2=move (imgCount+1,"right2",imgCount+1,cssL2,time,album);
tosl++;
var tol1=move (imgCount+1,"left2",tosl,cssL1,time,album);
tosl++;
var tol1a=move (imgCount+2,"center",tosl,cssL1,time,album);
$(toc).attr('id','center');
$(tol2).attr('id','left2');
$(tor2).attr('id','right2');
$(tol1).attr('id','left1');
$(tol1a).attr('id', 'left1');

    }

        }
});
}});

loadingPhotos=0;
});


function toCarousel(album,imgCount,cssL1,cssL2,cssR1,cssR2,cssC,cssd)
   {
       $('#lock').text("closed");
$(album+"_caption").hide();
var mid= (imgCount/2)|0;
mid=mid+1;

var count=0;        var tosl=0;
var tosr=0;

  $(album).each(function() {

   $(this).attr('status','carousel');

   count++;

  });

var i=1;

  $(album).each(function() {
//alert($(this).attr('status'));


        if(i==mid-1)
  	{
  	$(this).attr('id','left2');


        $(this).animate(cssL2, 1500,function(){
            if(i==count+1)
                {


                $('#lock').text("open");
                }
        });


	}
       else if(i==mid+1)
  	{
  	$(this).attr('id','right2');


        $(this).animate(cssR2, 1500,function(){

            if(i==count+1)
                {
                $('#lock').text("open");
                }
        });


	}


        else if(i<mid)
  	{
  	$(this).attr('id','left1');

        tosl++;
        $(this).animate(cssL1, 1500,function(){
            if(i==count+1)
                {
                $('#lock').text("open");
                }
        });


	}
  else if(i>mid)
  	{

        $(this).attr('id','right1');

        tosr++;
  	 $(this).animate(cssR1,1500,function(){
            if(i==count+1)
                {
                $('#lock').text("open");
                }
         });

	}
  else
  	{
        $(this).attr('id','center');

        $(this).animate(cssC,1500,function(){
            if(i==count+1)
                {
                $('#lock').text("open");
                }

                     $('#title1').show();
                $('#title').html($(album+"_caption").text());
                $('#title').show();
        });

	}
$(this).removeClass('noshadow');
$(this).removeClass('deg1');
$(this).removeClass('deg2');
$(this).removeClass('deg3');
$(this).removeClass('deg4');
$(this).removeClass('deg1neg');
$(this).removeClass('deg2neg');
$(this).removeClass('deg3neg');
$(this).removeClass('deg4neg');
$(this).addClass('deg')

	i++;
  });
  return tosl+','+tosr;
   }
function toStack(album,left,flag,isAnimate)
{
    $('#title').hide();
$('#title1').hide();
$(album+"_caption").css('left',left);
    	$imgs = $(album);
        $imgs.attr('status','stack');

	$imgCount = $imgs.length;
	$curr_index = 0;
        var tosl=0;
var tosr=0;
var mid1= ($imgCount/2)|0;
mid1=mid1+1;
var i=1;
//alert(mid1);

$(album).each(function() {



        if(i==mid1-1)
  	{
        $(this).css('z-index',$imgCount+1);
	}
       else if(i==mid1+1)
  	{
        $(this).css('z-index',$imgCount+1);
	}
        else if(i<mid1)
  	{
        tosl++;
        $(this).css('z-index',tosl);
	}
  else if(i>mid1)
  	{
         tosr++;
         $(this).css('z-index',tosr);
	}
  else
  	{
        $(this).css('z-index',$imgCount+2);
	}
        $(this).removeClass('deg');
	i++;

  });


var x1=[0,2,1,4,3,2];
		var x=[0,3,2,1,1,4];
        if(flag%2==1)
            x=x1;
	for(var i=1; i<=$imgs.length; i++) {
		$random_deg =  (Math.round((Math.random()*3)+1))
		$suff = '';


		if (i % 2 == 0)
			$suff = 'neg';
		$imgs.eq(i-1).addClass('deg' + x1[i] + $suff);
                if(i>5)
                    $imgs.eq(i-1).addClass('noshadow');
        }
                // change this stuff
           var cssS = {
  left:'93px',
  top:'350px',
  width:'81px',
   height:'56px',
  position:'absolute'

  };
     cssS.left=left;
     cssS.width='100px';
     cssS.height='75px';
     cssS.top='20px';
     if(isAnimate==0)
         {
                $imgs.css('left',left);
                $imgs.css('width','100px');
                $imgs.css('height','75px');
                $imgs.css('top','20px');
         }
         else
               $imgs.animate(cssS,1500,function(){


                    $(album+"_caption").show();
               });




return tosl+','+tosr;

}
function toStack1(album,left,flag,isAnimate)
{
    $('#title').hide();
$('#title1').hide();
$(album+"_caption").css('left',left);
    	$imgs = $(album);
        $imgs.attr('status','stack');

	$imgCount = $imgs.length;
	$curr_index = 0;
        var tosl=0;
var tosr=0;
var mid1= ($imgCount/2)|0;
mid1=mid1+1;
var i=1;
//alert(mid1);

var x1=[0,2,1,4,3,2];
		var x=[0,3,2,1,1,4];
        if(flag%2==1)
            x=x1;
	for(var i=1; i<=$imgs.length; i++) {
		$random_deg =  (Math.round((Math.random()*3)+1))
		$suff = '';


		if (i % 2 == 0)
			$suff = 'neg';
		$imgs.eq(i-1).addClass('deg' + x1[i] + $suff);
                if(i>5)
                    $imgs.eq(i-1).addClass('noshadow');
        }
                // change this stuff
           var cssS = {
  left:'93px',
  top:'350px',
  width:'81px',
   height:'56px',
  position:'absolute'

  };
     cssS.left=left;
     cssS.width='100px';
     cssS.height='75px';
     cssS.top='20px';
     if(isAnimate==0)
         {
                $imgs.css('left',left);
                $imgs.css('width','100px');
                $imgs.css('height','75px');
                $imgs.css('top','20px');
         }
         else
               $imgs.animate(cssS,1500,function(){


                    $(album+"_caption").show();
                    toStack(album,left,flag,0);
               });




return tosl+','+tosr;

}

function move(tos,id,newz,css,time,album)
{
    var s;$('#lock').text("closed");
      $(album).each(function(){

        if($(this).css('z-index')==tos && $(this).attr('id')==id)
            {


                //$(this).css('z-index',newz);

                //var css1={'margin-top':'1px'};
   /*             $(this).animate(css1,600,function(){

                });

              /*  $(this).animate(css,

                {
                    duration:1200,
                    step: function( now,fx ){
                    //console.log( fx.pos,fx.prop, now );
                    if(fx.pos>=0.5&&fx.pos<=0.6)
                        {
                            $(this).css('z-index',newz);
                        }
                    }
		}

                );*/
                $(this).animate(css,time,function(){
                    $('#lock').text("open");
                });
                s=$(this);
               // $(this).css('z-index',newz);
                setTimeout(function(){
                 //   alert(newz+"**"+$(s).attr('class'));
                    $(s).css('z-index',newz);},0.5*time);

               /* $('#tempz').animate({'left':'250px'}, 750,function(){
                     $(s).css('z-index',newz);
                });*/


            }

            });

return s;

}
function setz(a)
{
    $(a).css('z-index', $('#tempz').text());
}

