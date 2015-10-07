$.fn.pngFix = function() {
  if (!$.browser.msie || $.browser.version >= 9) { return $(this); }

  return $(this).each(function() {
    var img = $(this),
        src = img.attr('src');

    img.attr('src', 'blank.gif')
        .css('filter', "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src='" + src + "')");
  });
};


/*(function ($) {
if (!$) return;
$.fn.extend({
    fixPNG: function(sizingMethod, forceBG) {
            if (!($.browser.msie)) return this;
            var emptyimg = "blank.gif"; //Path to empty 1x1px GIF goes here
            sizingMethod = sizingMethod || "scale"; //sizingMethod, defaults to scale (matches image dimensions)
            this.each(function() {
                    var isImg = (forceBG) ? false : jQuery.nodeName(this, "img"),
                            imgname = (isImg) ? this.src : this.currentStyle.backgroundImage,
                            src = (isImg) ? imgname : imgname.substring(5,imgname.length-2);
                    this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='" + sizingMethod + "')";
                    if (isImg) this.src = emptyimg;
                    else this.style.backgroundImage = "url(" + emptyimg + ")";
            });
            return this;
    }
});
})(jQuery);*/


//Ajax form	


// *************************************************************************************************************************

$(document).ready(function() {
	$('.roundabout-moveable-item img').pngFix();
	
	$("#formvalidate2").validate({
				   submitHandler: function(form) {
					SubmitForm2();
				   }
				})
	//$('#roundBanner').roundabout({shape: 'square',btnNext: '#next',btnPrev: '#prev'});
	
	var interval;
	$('#roundBanner')
		.roundabout({
			shape: 'square',btnNext: '#next',btnPrev: '#prev'})
			.hover(
				function() {clearInterval(interval);
				},
				function() {interval = startAutoPlay();
				}
			);
		interval = startAutoPlay();	
			

	$('#toTop').css({ right: '-100px'});
	$('.logo').css({ top: '-150px' });
	$('.logo').animate({ top: '-10px' }, 800);
	
	$(".logo").hover(function() {
		$(this).stop(true,true).animate({ top: '-0px'}, 300);
	},function() {
		$(this).stop(true,true).animate({ top: '-10px'}, 500);
	});
	
	$("#about_menu_child").hover(function() {
		$("#about_menu_parent").addClass('active');
	},function() {
		$("#about_menu_parent").removeClass('active');
	});
	
	$('#ourproject').bxSlider({auto: true,autoHover:true,pause:5000,easing:'easeOutSine',displaySlideQty: 2,pager: false});
	
	$('.txtfocus').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('title')) {
			input.val('');
			input.removeClass('ftitle');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('title')) {
			input.addClass('ftitle');
			input.val(input.attr('title'));
		  }
		}).blur();
	
	
}); 

function startAutoPlay() {
	return setInterval(function() {
		$('#roundBanner').roundabout_animateToNextChild();
	}, 3000);
}

$(function() {
	$(window).scroll(function() {
		if($(this).scrollTop() != 0) {
			$('#toTop').stop(true,true).animate({ right: '0px' }, 400);	
		} else {
			$('#toTop').stop(true,true).animate({ right: '-100px' }, 400);	
		}
	});
	
	$('#toTop').click(function() {
		$('body,html').animate({scrollTop:0},800);
		$(this).stop(true,true).animate({ right: '-100px' }, 400);
	});
});