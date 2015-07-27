<?php header('Content-type: text/xml'); ?>
<?php echo '<?xml version="1.0" encoding="utf-8"?><?xml-stylesheet type="text/xsl" href="/website/sitemapcss/xml-sitemap.xsl"?>' ?>
<?php
	/* for corn job in cpanel
		/usr/bin/php -q /home/wtoucct8/public_html/mybusiness/sitemap.php
	*/
 ?>
<?php
	$host = $_SERVER['SERVER_NAME'];
	$inputJSON = file_get_contents('http://'.$host.'/sitemapdata');
	$input= json_decode($inputJSON, TRUE); //convert JSON into array
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<?php 
	function writeSitemap($input){
		if(is_array($input)){
			foreach($input as $url) {
				if(isset($url['childMenu']) && $url['status'] == 1){
					writeSitemap($url['childMenu']);
				}
				if($url['status'] == 1){
?>
				<url>
					<loc><?php echo (str_replace(" ", "-", str_replace("&", "%26",$url["url"]))); ?></loc>
					<?php
						if(isset($url["image"])){
							echo '<image:image><image:loc>'.$url["image"].'</image:loc></image:image>';
						}
					?>
					<changefreq>daily</changefreq>
					<priority>1</priority>
				</url>
	<?php
				}
			}
		}
	}
	writeSitemap($input['menus']);
	if(isset($input['sidebar'])){
		writeSitemap($input['sidebar']);
	}
?>
</urlset>