<?php
/**
 * @package    Joomla.Site
 * @copyright  Copyright (C) 2005 - 2013 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/* The following line loads the MooTools JavaScript Library */
JHtml::_('behavior.framework', true);

/* The following line gets the application object for things like displaying the site name */
$app = JFactory::getApplication();
?>
<?php echo '<?'; ?>xml version="1.0" encoding="<?php echo $this->_charset ?>"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>" >
<head>
<jdoc:include type="head" />
<meta name="google-site-verification" content="xv_7TVb38wcem1jzXEBzqOKRs_i-vLYFRyQs-SVn6wI" />
<link rel="stylesheet" type="text/css" href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/fancy-box/jquery.fancybox.css"/>
<link href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/css/style.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/jquery-1.6.2.min.js"></script>
<script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/slider/jquery.bxSlider.min.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/slider/bx_styles/bx_styles.css"/>
<link rel="stylesheet" type="text/css" href="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/fancy-box/jquery.fancybox.css"/>
<script type="text/javascript" src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/script/fancy-box/jquery.fancybox.js?v=2.1.4"></script>
<script type="text/javascript">
  $(document).ready(function(){
  $('.hm-slider #slider').bxSlider({
  mode: 'fade',
  auto: true,
  controls: false,
  autoHover : true,
  });
  $('.slider').bxSlider({
  mode: 'fade',
  auto: true,
  controls: false,
  autoHover : true,
  pager  : true
  });
  $('.home-bx-slide ul').bxSlider({
  mode: 'vertical',
  auto: true,
  controls: false,
  autoHover : true,
  displaySlideQty : 1,
  moveSlideQty : 1
  });
});
</script>
<script type="text/javascript">
$(document).ready(function(){
// This function is used for displaying submenu with jQuery and css ***************************************************
  $(".nav li ul").hide();
    $(".nav li").hover(function(){
    $(this).find('ul:first').css({visibility: "visible",display: "none", background:""}).show(500);
    },function(){
    $(this).find('ul:first').css({visibility: "hidden",display: "none"});
    });
});
</script>
<script type="text/javascript">
    $(document).ready(function() {
      $("div.slider .fancybox").fancybox({
        'height'  : '100%',
        'autoScale'  : false,
        width    : '400px',
        type    : 'image',
        openEffect  : 'elastic',
        openSpeed  : 300,
        closeEffect : 'elastic',
        closeSpeed  : 300,
        autoPlay  : true,
        loop    : true
      });
    });
  </script>
<script type="text/javascript">
$(document).ready(function(){
$(".nav a").each(function() {   
    if (this.href == window.location.href) {
        $(this).parent(".nav li").addClass("active");
    }
});
});
//alert (window.location.href + '== <?php echo "http://". $_SERVER["HTTP_HOST"] ?>');
/*if(window.location.href == <?php echo "http://". $_SERVER["HTTP_HOST"] ?>){
  $(".home").show();
  $(".main-cont").hide();
  alert('ok');
}*/
</script>
</head>
<body >
<div class="header">
  <div class="logo"><img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/shivbaba.png" width="116" height="58" /></div>
  <div class="menu"> 
    <!-- Main Navigation -->
        <?php if ($this->countModules('top-menu')): ?>
      <jdoc:include type="modules" name="top-menu" style="xhtml" />
        <?php endif; ?>
    <!-- Main Navigation -->
      <!-- Contact Navigation -->
        <?php if ($this->countModules('contact-menu')): ?>
      <jdoc:include type="modules" name="contact-menu" style="xhtml" />
        <?php endif; ?>
      <!-- Contact Navigation -->
      <div class="clr"></div>
    <div id="title">Mob:. 09881502939,    09881331689<br />
      Email: propertydemand@gmail.com </div>
  </div>
</div>
<div class="main">
  <div class="hm-slider">
    <div id="title2">
        <img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/logo - pd.png" alt="" width="180" height="55" />
    </div>
    <div id="slider">
        <img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/slide1.png" width="960" height="300" />
        <img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/slide2.png" width="960" height="300" />
        <img src="<?php echo $this->baseurl ?>/templates/<?php echo $this->template ?>/images/slide4.png" width="960" height="300" />
    </div>
  </div>
<!-- Home Message -->
  <div class="home">
      <!-- Home Featured Property -->
        <?php if ($this->countModules('featured-property')): ?>
    <div class="home-box">
      <h1>Featured Property</h1>
      <div class="home-bx-slide">
      <jdoc:include type="modules" name="featured-property" style="xhtml" />
      </div>
    </div>
        <?php endif; ?>
      <!-- End Home Featured Property -->
      <!-- Home Featured Project -->
        <?php if ($this->countModules('featured-project')): ?>
    <div class="home-project">
      <h1>Featured Project:</h1>
      <jdoc:include type="modules" name="featured-project" style="xhtml" />
    </div>
        <?php endif; ?>
      <!-- End Home Featured Project -->
      <!-- Home Message -->
        <?php if ($this->countModules('home-message')): ?>
    <div class="home-msg">
      <p>
      <jdoc:include type="modules" name="home-message" style="xhtml" />
      </p>
    </div>
        <?php endif; ?>
      <!-- End Home Message-->
    <div class="clr"></div>
  </div>
<!-- End Home -->

<?php if (($this->countModules('featured-property')==false)): ?>

<!-- Other Pages -->
  <div class="main-cont">
    <div class="left_sidebar">
      <!-- Sidebar Modules -->
        <?php if ($this->countModules('sidebar')): ?>
      <jdoc:include type="modules" name="sidebar" style="xhtml" />
        <?php endif; ?>
      <!-- End Sidebar Modules -->
    </div>
    <div class="content">
      <!-- Content -->
    <?php if ($this->countModules('breadcrumb')): ?>
                <jdoc:include type="modules" name="breadcrumb" style="xhtml" />
        <?php endif; ?>
            <jdoc:include type="modules" name="top-content" style="xhtml" />
            <jdoc:include type="message" />
            <jdoc:include type="component" />
            <jdoc:include type="modules" name="bottom-content" style="none" />
      <!-- End Content -->
    </div>
    <div class="clr"></div>
  </div>
<!-- End Other Pages -->
        <?php endif; ?>


</div>
<div class="footer">
  <div class="footer-copy">
    <p>Copyright: Property Demand</p>
    <p>Design By <a href="http://www.wtouch.in">Web Touch</a></p>
  </div>
  <div class="footer-logo">Property Demand</div>
</div>
</body>
</html>
