<?php
	$username = "akumar34"; 
	$password = "password1";   
	$host = "bicyclerace6.mysql.uic.edu";
	$database="bicyclerace6";
    
	$server = mysql_connect($host, $username, $password);
	$connection = mysql_select_db($database, $server);

	$no_of_bins = 24; // 12 total bins
	$range = 24; // 24 hours
	$intervals = floor($range/$no_of_bins);
	$lower = date_create('6/27/2013 00:00');
	$higher = date_create('6/27/2013 00:00');
	date_add($higher, date_interval_create_from_date_string($intervals . " hours"));

	$sql = "SELECT DAY, TIME_INTERVAL, COUNT(*) AS TOTAL FROM (";
	for($multiplier = 1; $multiplier < $no_of_bins + 1; $multiplier++){	
		if($multiplier != $no_of_bins){
			$sql .= ("SELECT DISTINCT '" 
			     . (date_format($lower,"G:i")) . "' AS TIME_INTERVAL, 
				DATE(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AS DAY, 
				BIKEID
				FROM trips_data 
				WHERE 
				TIME(STR_TO_DATE('". (date_format($lower,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($higher,"G:i")) . "', '%H:%i')) > TIME(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($lower,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STOPTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($higher,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STOPTIME,'%m/%d/%Y %H:%i')) UNION ");
		} else {
			$sql .= ("SELECT DISTINCT '" 
			     . (date_format($lower,"G:i")) . "' AS TIME_INTERVAL, 
				DATE(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AS DAY, 
				BIKEID
				FROM trips_data 
				WHERE 
				TIME(STR_TO_DATE('". (date_format($lower,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($higher,"G:i")) . "', '%H:%i')) > TIME(STR_TO_DATE(STARTTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($lower,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STOPTIME,'%m/%d/%Y %H:%i')) AND 
				TIME(STR_TO_DATE('". (date_format($higher,"G:i")) . "', '%H:%i')) <= TIME(STR_TO_DATE(STOPTIME,'%m/%d/%Y %H:%i')) ");		}
    
  		date_add($lower, date_interval_create_from_date_string( $intervals . " hours"));
		date_add($higher, date_interval_create_from_date_string( $intervals . " hours"));	
	}

	$sql .= ") TBL GROUP BY DAY, TIME_INTERVAL ";

	print($sql);

/*	$query = mysql_query($sql);
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
    
	$data = array();
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	echo json_encode($data);     
	mysql_close($server);*/
?>
