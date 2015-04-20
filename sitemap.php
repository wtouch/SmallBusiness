<?php header('Content-type: text/xml'); ?>
<?php echo '<?xml version="1.0" encoding="utf-8"?>' ?>
<?php
	/* for corn job in cpanel
		/usr/bin/php -q /home/wtoucct8/public_html/mybusiness/sitemap.php
	*/
 ?>
<?php
	$host = $_SERVER['SERVER_NAME'];
	$inputJSON = file_get_contents('http://'.$host.'/sitemap');
	$input= json_decode($inputJSON, TRUE); //convert JSON into array
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
<?php 
	if(is_array($input)){
		foreach($input as $url) {
?>
		<url>
			<loc><?php echo $url["url"]; ?></loc>
			<?php
				if(isset($url["image"])){
					echo '<image:image><image:loc>'.$url["image"].'</image:loc></image:image>';
				}
			?>
			<changefreq>monthly</changefreq>
			<priority>0.5</priority>
		</url>
<?php
		}
	}
?>
</urlset>