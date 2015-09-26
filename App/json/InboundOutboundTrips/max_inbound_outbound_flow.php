<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $sql = "SELECT T1.*
	FROM (
	(
	select
	i.STATION_ID AS STATION_ID,
	i.STATION AS STATION,
	i.TIME_INTERVAL AS TIME_INTERVAL,
	o.TOTAL AS OUTBOUND,
	i.TOTAL AS INBOUND,
	abs(o.TOTAL - i.TOTAL) AS DIFF
	from
	inbound_stations i,
	outbound_stations o
	where i.STATION_ID = o.STATION_ID
	AND i.TIME_INTERVAL = o.TIME_INTERVAL
	AND i.STATION = o.STATION
	) T1)
	WHERE (TIME_INTERVAL,T1.DIFF) IN (
	SELECT TIME_INTERVAL,MAX(T1.DIFF)
	FROM(
	select
	i.STATION_ID AS STATION_ID,
	i.STATION AS STATION,
	i.TIME_INTERVAL AS TIME_INTERVAL,
	o.TOTAL AS OUTBOUND,
	i.TOTAL AS INBOUND,
	abs(o.TOTAL - i.TOTAL) AS DIFF
	from
	inbound_stations i,
	outbound_stations o
	where i.STATION_ID = o.STATION_ID
	AND i.TIME_INTERVAL = o.TIME_INTERVAL
	AND i.STATION = o.STATION
	) T1 
        GROUP BY T1.time_interval)";
	
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
