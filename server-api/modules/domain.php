<?php
	require_once 'db/dbHelper.php';
	$db = new dbHelper();
	$reqMethod = $app->request->getMethod();
	
	//getMethod
	if($reqMethod=="POST"){
		function sendme($url){
			$curl = curl_init('-k');
			curl_setopt($curl, CURLOPT_URL, $url);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // disable for ssl verification
			$result = curl_exec($curl);
			$error = curl_error ($curl);
			if($error) return $error;
			curl_close($curl);
			return $result;
		}

		$input = json_decode($body,true);
		
		$domainArr = explode('.', $input['domain']);
		
		$domain = $domainArr[0];
		$tlds = (count($domainArr) == 1 ) ? "com" : $domainArr[1];
		
		$url = 'https://test.httpapi.com/api/domains/available.json?auth-userid=435878&api-key=KA4O3YJGiLcc0o86jhKT2vnDdzzCdoCd&domain-name='.$domain.'&tlds='.$tlds;
		//echo $url;
		$message_id = sendme($url);

		echo $message_id;
	}
 ?>