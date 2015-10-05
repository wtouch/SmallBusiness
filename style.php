<?php
header("Content-type: text/css");
require "/server-api/lib/lessphp/lessc.inc.php";


$less = new lessc;
$less->setFormatter("compressed");
echo $less->compileFile($_SERVER['DOCUMENT_ROOT']."/website/templates/educational_books/realone/less/style.less");