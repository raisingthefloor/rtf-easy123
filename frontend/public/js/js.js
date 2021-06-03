$(document).ready(function() {

    //NOT INLCUDED IN THE FILE
	$('.read').click(function(){

var p=$(this).parent().parent();
$(p).find('.envcontents').fadeOut(500);
$(p).find('#content').show('normal');
$(p).find('.b').show();
var rotDegrees=0;
		var cssObj = {
			'-webkit-transform' : 'rotate('+ rotDegrees +'deg)',  // safari only
			'tranform' : 'rotate('+ rotDegrees +'deg)'}; // added in case CSS3 is standard
		$(p).css(cssObj);

 /*$(".polaroid").find('.date').fadeOut(500);
  $(".polaroid").find('.to').fadeOut(500);
   $(".polaroid").find('.from').fadeOut(500);
    $(".polaroid").find('.about').fadeOut(500);
	 $(".polaroid").find('.read').fadeOut(500);
	  $(".polaroid").find('img').fadeOut(500);*/

	/*	var toLoad = $(this).attr('href');
		$('#content').hide('fast',loadContent);
		$('#load').remove();
		$('#wrapper').append('<span id="load">LOADING...</span>');
		$('#load').fadeIn('normal');
		window.location.hash = $(this).attr('href').substr(0,$(this).attr('href').length-5);
		function loadContent() {
			$('#content').load(toLoad,'',showNewContent())
		}
		function showNewContent() {
			$('#content').show('normal',hideLoader());
		}
		function hideLoader() {
			$('#load').fadeOut('normal');
		}
		return false;*/
		
	});
	$('.back').click(function(){

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