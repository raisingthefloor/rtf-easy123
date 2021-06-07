

$(document).ready(

function(){
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
    
    t=t+30+50;


});

$('.flap').click(function()
{
if(isPerson==1)
{
isPerson=0;
    $('#person').hide("slide", { direction: "left" }, 1000);

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
var trash_y =(viewportheight-128-5);

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
    isPerson=1;
    var name=$(this).find('#contact_name').text().split(' ');
    var image=$(this).find('#contact_pic').attr('src');

    $('#person').show("slide", { direction: "left" }, 1000);
    $('#person').find('#person_name').text($(this).find('#contact_name').text());
    $('#person').find('#person_pic').attr('src',image);
    $('#person').find('#email').text("Write Email to "+ name[0]);
    $('#person').find('#call').text("Call "+ name[0]);
    $('#person').find('#photo').text("View "+ name[0]+"'s photos");
    $('#person').find('#chat').text(name[0]+" is available to chat");
/*            var a1=$('#person').css('left');
            var b1=parseInt((a1.substring(0, a1.length-2)));
           var a=$('#person').css('width');
            var b=parseInt((a.substring(0, a.length-2)));
    $('#person').animate({'left':''+(b1-b)+'px'},500,function(){
            $('#person').css('z-index',3);
    });

    $('#person').animate({'left':b1+'px'},500);*/




});

});
