<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT USERTYPE AS MEMBER_TYPE, COUNT(*) AS POPULATION FROM
			(SELECT DISTINCT USERTYPE, BIKEID FROM trips_data) AS TBL
			WHERE
			TBL.USERTYPE = 'Customer'
			UNION
			SELECT USERTYPE AS MEMBER_TYPE,COUNT(*) AS POPULATION FROM
			(SELECT DISTINCT USERTYPE, BIKEID FROM trips_data) AS TBL
			WHERE
			TBL.USERTYPE = 'Subscriber'";
	
    $query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    echo json_encode($data);     
    mysql_close($server);
?>