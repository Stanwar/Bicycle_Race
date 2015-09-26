<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT TBL1.AGE_INTERVAL, TBL1.MALE, TBL2.FEMALE FROM
			(select AGE_INTERVAL, SUM(POPULATION) AS MALE from population_by_gender_age
			where gender = 'Male' group by AGE_INTERVAL) AS TBL1,
			(select AGE_INTERVAL, SUM(POPULATION) AS FEMALE from population_by_gender_age
			where gender = 'Female' group by AGE_INTERVAL) AS TBL2
			WHERE TBL1.AGE_INTERVAL = TBL2.AGE_INTERVAL
			GROUP BY TBL1.AGE_INTERVAL";
	
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
