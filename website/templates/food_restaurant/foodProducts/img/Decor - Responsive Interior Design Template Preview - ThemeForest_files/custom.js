// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// by Liontheme 2014
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

jQuery(document).ready(function() {
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// change menu on mobile version
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	domready(function(){
		"use strict";
		selectnav('mainmenu', {
			label: '',
			nested: true,
			indent: '-'
		});
	});

	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// filtering gallery
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	var $container = jQuery('#gallery');
		$container.isotope({
			itemSelector: '.item',
			filter: '*',
	});
	jQuery('#filters a').click(function(){
		"use strict";
		var $this = jQuery(this);
		if ( $this.hasClass('selected') ) {
			return false;
			}
		var $optionSet = $this.parents();
		$optionSet.find('.selected').removeClass('selected');
		$this.addClass('selected');
				
		var selector = jQuery(this).attr('data-filter');
		$container.isotope({ 
		filter: selector,
	});
	return false;
	});
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// vertical center text
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery('.lt-list li').find("img").load(function() {
         picheight = jQuery('.lt-list li').find("img").css("height");
		 newheight = picheight.substring(0, picheight.length - 2)/2-25;
	 	 jQuery('.lt-list li').find(".text").css({'margin-top': newheight},'fast');
    });
	
	jQuery(function() {
         picheight = jQuery('.lt-list li').find("img").css("height");
		 newheight = picheight.substring(0, picheight.length - 2)/2-25;
	 	 jQuery('.lt-list li').find(".text").css({'margin-top': newheight},'fast');
    });
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// paralax background
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	$window = jQuery(window);
   	jQuery('section[data-type="background"]').each(function(){
    var $bgobj = jQuery(this); // assigning the object
                    
    jQuery(window).scroll(function() {
	var yPos = -($window.scrollTop() / $bgobj.data('speed')); 
	var coords = '50% '+ yPos + 'px';
	$bgobj.css({ backgroundPosition: coords });
		
	});
 	});
	document.createElement("article");
	document.createElement("section");
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// prettyPhoto function
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery("area[data-gal^='prettyPhoto']").prettyPhoto();
	jQuery("body:first a[data-gal^='prettyPhoto']").prettyPhoto({animation_speed:'fast',theme:'light_square',slideshow:3000, autoplay_slideshow: false});
	jQuery("body:gt(0) a[data-gal^='prettyPhoto']").prettyPhoto({animation_speed:'fast',slideshow:10000, hideflash: true});
		
	jQuery("#custom_content a[data-gal^='prettyPhoto']:first").prettyPhoto({
		custom_markup: '<div id="map_canvas" style="width:260px; height:265px"></div>',
		changepicturecallback: function(){ initialize(); }
	});
	jQuery("#custom_content a[data-gal^='prettyPhoto']:last").prettyPhoto({
		custom_markup: '<div id="bsap_1259344" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div><div id="bsap_1237859" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6" style="height:260px"></div><div id="bsap_1251710" class="bsarocks bsap_d49a0984d0f377271ccbf01a33f2b6d6"></div>',
		changepicturecallback: function(){ _bsap.exec(); }
	});
	

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// carousel function
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery("#testi-carousel").owlCarousel({
    singleItem:true,
    navigation : false,
	autoPlay : true
    });
	
	jQuery("#lt-slider").owlCarousel({
    singleItem:true,
    navigation : false,
	autoPlay : true
    });
	
	jQuery("#lt-carousel").owlCarousel({
    singleItem:true,
    navigation : false,
	pagination: false
    });

	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// scroll to top
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery().UItoTop({ easingType: 'easeInOutExpo' });
	  
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// gallery hover
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery('.gallery .item').hover(function() {
	"use strict";
	jQuery(this).stop().animate({opacity: .5}, 100);
	}, function() {
	jQuery(this).stop().animate({opacity: 1});}, 100);
	
	
	jQuery('.img-hover').hover(function() {
	"use strict";
	jQuery(this).stop().animate({opacity: .5}, 100);
	}, function() {
	jQuery(this).stop().animate({opacity: 1});}, 100);
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// resize
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	window.onresize = function(event) {
		jQuery('#gallery').isotope('reLayout');
		
		jQuery(function() {
		"use strict";
         picheight = jQuery('.lt-list li').find("img").css("height");
		 newheight = picheight.substring(0, picheight.length - 2)/2-25;
	 	 jQuery('.lt-list li').find(".text").css({'margin-top': newheight},'fast');
      });
  	};
	
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// show / hide slider navigation
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery('.callbacks_nav').hide();
	
	jQuery('#slider').hover(function() {
	"use strict";
	jQuery('.callbacks_nav').stop().animate({opacity: 1}, 100);
	}, function() {
	jQuery('.callbacks_nav').stop().animate({opacity: 0});}, 100);
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// image hover effect
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	jQuery(".pic-hover .hover").hide();
	jQuery(".pic-hover").hover(
	function() {
	 jQuery(this).find(".hover").width(jQuery(this).css("width"));
	 jQuery(this).find(".hover").height(jQuery(this).find("img").css("height"));
	 jQuery(this).find(".hover").fadeTo(150, .9);
	 
	 picheight = jQuery(this).find("img").css("height");
	 newheight = (picheight.substring(0, picheight.length - 2)/2-20);
	 //alert(newheight);
	 jQuery(this).find(".btn-view-details").css({'margin-top': newheight},'fast');
	 
	 },
    function() {
	 jQuery(this).find(".hover").fadeTo(150, 0);
  	})
	
	
	
	  
	  	// --------------------------------------------------
		// tabs
		// --------------------------------------------------
		jQuery('.lt_tab').find('.lt_tab_content div').hide();
		jQuery('.lt_tab').find('.lt_tab_content div:first').show();
		
		jQuery('.lt_nav li').click(function() {
			jQuery(this).parent().find('li span').removeClass("active");
			jQuery(this).find('span').addClass("active");
			jQuery(this).parent().parent().find('.lt_tab_content div').hide();
		
			var indexer = jQuery(this).index(); //gets the current index of (this) which is #nav li
			jQuery(this).parent().parent().find('.lt_tab_content div:eq(' + indexer + ')').fadeIn(); //uses whatever index the link has to open the corresponding box 
		});

});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	// lazyload
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 	
	    jQuery(document).ready(function() {
       // var $header = jQuery("header"),
         //   $clone = $header.before($header.clone().addClass("clone"));
		 
		$doc_height = $(window).innerHeight(); 
		//jQuery('#content').css("margin-top", $doc_height-270);
        
        jQuery(window).on("scroll", function() {
            var fromTop = jQuery(window).scrollTop();
            console.log(fromTop);
            jQuery("body").toggleClass("down", (fromTop > 240));
        });
    });


