$(document).ready(function(){
$('.bxslider').bxSlider({
	mode:'horizontal',
	slideWidth: 250,
	minSlides:3,
	maxSlides: 4,
	slideMargin: 25,
	auto: true, 
	autoDirection:'next',
	moveSlides: 2,
	pause:2500,
	pager:true,
	pagerType:'full',
	autoControls: true, 
	controls:true, 
	autoHover:true,
	speed:1000,
});
$('.bxslidervertical').bxSlider({
	mode:'vertical',
	slideWidth: 600,
	minSlides: 3,
	maxSlides:3,
	slideMargin: 15,
	auto: true, 
	autoDirection:'next',
	moveSlides: 2,
	pause:5000,
	pager:false,
	pagerType:'full',
	autoControls: false, 
	controls:false, 
	autoHover:true,
	speed:3000,
});
});
		