<!DOCTYPE html>
<html>
<head>
	<title><?php echo $userShortInfo ?></title>
</head>
<body>
<nav>navigation</nav>
<?php if(isset($_GET['view'])){
	include $_GET['view'].".php";
} ?>
	<p></p>
<footer>footer</footer>
</body>
</html>