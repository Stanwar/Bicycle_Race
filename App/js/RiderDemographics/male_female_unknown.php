<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "select 'Male' as GENDER, COUNT(*) as POPULATION from trips_data where gender = 'Male'
		union
		select 'Female' as GENDER, COUNT(*) as POPULATION from trips_data where gender = 'Female'
		union
		select 'Unknown' as GENDER, COUNT(*) as POPULATION from trips_data where 
		gender != 'Male' and gender != 'Female'";
	
	$sql_query = mysql_query($sql);

    if ( ! $sql_query ) {
        echo mysql_error();
        die;
    }
   

    $sql_data = array();
    for ($x = 0; $x < mysql_num_rows($sql_query); $x++) {
        $sql_data[] = mysql_fetch_assoc($sql_query);
    }
    echo json_encode($sql_data);     
    mysql_close($server);
?>
