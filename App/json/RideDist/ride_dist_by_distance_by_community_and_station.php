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
	$intervals_data = array();
	$intervals_data = mysql_fetch_assoc($query);
	$intervals = floor($intervals_data['INTRVL']);	

	$dist_by_dist_query = "";
	for($multiplier = 1; $multiplier < $no_of_bins + 1; $multiplier++){
		$lower = $intervals * $multiplier;
		$higher = $intervals * ($multiplier + 1) - 1;
		$dist_by_dist_query .= ("SELECT td.FROM_COMMUNITY AS COMMUNITY,td.FROM_STATION_NAME AS STATION_NAME," . ($lower) .
			" AS DIST_METERS, COUNT(*) AS TOTAL_TRIPS FROM trips_data td, stations_data sd WHERE " . ($lower) . " < DIST_METERS AND DIST_METERS < " . ($higher) . 
			" AND td.FROM_COMMUNITY = sd.COMMUNITY AND td.FROM_STATION_NAME = sd.STATIONNAME GROUP BY td.FROM_COMMUNITY,td.FROM_STATION_NAME UNION ");
	}

    function str_replace_last( $search , $replace , $str ) {
        if( ( $pos = strrpos( $str , $search ) ) !== false ) {
            $search_length  = strlen( $search );
            $str    = substr_replace( $str , $replace , $pos , $search_length );
        }
        return $str;
    }

	$str = $dist_by_dist_query;
	$search = 'UNION';
	$replace = '';
	$dist_by_dist_query = str_replace_last( $search , $replace , $str );
	
	$query = mysql_query($dist_by_dist_query);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $dist_by_dist_data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $dist_by_dist_data[] = mysql_fetch_assoc($query);
    }
	
    echo json_encode($dist_by_dist_data);     
    mysql_close($server);
?>