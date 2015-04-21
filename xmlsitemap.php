<?php
$xml = new DomDocument('1.0', 'utf-8'); 
$xml->formatOutput = true; 

// creating base node
$urlset = $xml->createElement('urlset'); 
$urlset -> appendChild(
    new DomAttr('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
);

    // appending it to document
$xml -> appendChild($urlset);
$yourSiteContent = array(
    array('permalink' => 'http://www.somesite.com/someurl1', 'updated' => '2012-08-11T04:08:53+01:00'),
    array('permalink' => 'http://www.somesite.com/someurl2', 'updated' => '2012-09-11T04:08:53+01:00'),
    array('permalink' => 'http://www.somesite.com/someurl3', 'updated' => '2012-10-11T04:08:53+01:00')
);
// building the xml document with your website content
foreach($yourSiteContent as $entry)
{

    //Creating single url node
    $url = $xml->createElement('url'); 

    //Filling node with entry info
    $url -> appendChild( $xml->createElement('loc', $entry['permalink']) ); 
    $url -> appendChild( $lastmod = $xml->createElement('lastmod', $entry['updated']) ); 
    $url -> appendChild( $changefreq = $xml->createElement('changefreq', 'monthly') ); 
    $url -> appendChild( $priority = $xml->createElement('priority', '0.5') ); 

    // append url to urlset node
    $urlset -> appendChild($url);

}

$xml->save("data.xml");

?>