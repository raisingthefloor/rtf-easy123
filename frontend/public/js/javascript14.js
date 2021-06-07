$(document).ready(function() {
	$imgs = $("#photo_stack img");
	$imgCount = $imgs.length;
	$curr_index = 0;
	$imgs.last().addClass('current');
	var x1=[0,2,1,4];
		var x=[0,3,2,1];
	for(var i=1; i<=$imgs.length; i++) {
		$random_deg =  (Math.round((Math.random()*3)+1))
		$suff = '';

			
		if (i % 2 == 0) 
			$suff = 'neg';
		$imgs.eq(i-1).addClass('deg' + x[i] + $suff);
		
	}







	
						   });