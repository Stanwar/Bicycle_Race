<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$no_of_bins = 10;
	$intervals_query = "SELECT (MAX(DIST_METERS) - MIN(DIST_METERS))/$no_of_bins AS INTRVL FROM trips_data";	
    $query = mysql_query($intervals_query);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
	$intervals_data = mysql_fetch_assoc($query);

	$intervals = floor($intervals_data['INTRVL']);	
	$dist_by_dist = "";
	for($multiplier = 1; $multiplier < $no_of_bins + 1; $multiplier++){
		$lower = $intervals * $multiplier;
		$higher = $intervals * ($multiplier + 1) - 1;
		if($multiplier != $no_of_bins){
			$dist_by_dist .= ("SELECT " . ($lower) .
				" AS DIST_METERS, COUNT(*) AS TOTAL_TRIPS FROM trips_data WHERE " . ($lower) . " < DIST_METERS AND DIST_METERS < " .($higher) . " UNION ");
		} else {
			$dist_by_dist .= ("SELECT " . ($lower) .
				" AS DIST_METERS, COUNT(*) AS TOTAL_TRIPS FROM trips_data WHERE " . ($lower) . " < DIST_METERS AND DIST_METERS < " .($higher));
		}
	}
	
	$dist_by_dist_query = mysql_query($dist_by_dist);
    if ( ! $dist_by_dist_query ) {
        echo mysql_error();
        die;
    }
    
    $dist_by_dist_data = array();
    for ($x = 0; $x < mysql_num_rows($dist_by_dist_query); $x++) {
        $dist_by_dist_data[] = mysql_fetch_assoc($dist_by_dist_query);
    }
    echo json_encode($dist_by_dist_data);     
    mysql_close($server);
?>
