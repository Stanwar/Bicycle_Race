<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT TBL1.COMMUNITY, TBL1.AGE_INTERVAL, TBL1.MALE, TBL2.FEMALE FROM
			(select COMMUNITY,AGE_INTERVAL, SUM(POPULATION) AS MALE from population_by_gender_age
			where gender = 'Male' group by COMMUNITY, AGE_INTERVAL
			ORDER BY AGE_INTERVAL) AS TBL1,
			(select COMMUNITY, AGE_INTERVAL, SUM(POPULATION) AS FEMALE from population_by_gender_age
			where gender = 'Female' group by COMMUNITY, AGE_INTERVAL
			ORDER BY AGE_INTERVAL) AS TBL2
			WHERE 
			TBL1.COMMUNITY = TBL2.COMMUNITY AND 
			TBL1.AGE_INTERVAL = TBL2.AGE_INTERVAL
			GROUP BY TBL1.COMMUNITY, TBL1.AGE_INTERVAL
			ORDER BY TBL1.AGE_INTERVAL ASC, TBL2.AGE_INTERVAL ASC";
	$query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $sql_data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $sql_data[] = mysql_fetch_assoc($query);
    }
	
    echo json_encode($sql_data);     
    mysql_close($server);
?>
