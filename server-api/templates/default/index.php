<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/style.css">
		<script src="js/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<title>Welcome </title>
	</head>
	<body>
		<?php include ('header.html');
			  include ('navbar.html');
			  include ('home.html');
		?>
		
		<?php if(isset($_GET['view'])){			
			include $_GET['view'].".php";
			}
		?>
			<p></p>
			
		<?php 
			  include ('footer.html');
		?>
		

	</body>
</html>