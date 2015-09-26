<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $sql = 
	"
	select TBL.TIME_INTERVAL, SUM(TBL.INBOUND) AS INBOUND, SUM(TBL.OUTBOUND) AS OUTBOUND
	FROM
	(
	select
	i.STATION_ID AS STATION_ID,
	i.STATION AS STATION,
	(
		select case 
			when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('0:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('3:59','%H:%i'))
				)
			then '00:00 to 03:59'
	
			when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('4:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('7:59','%H:%i'))
				)
			then '04:00 to 07:59'
	
	   	when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('08:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('11:59','%H:%i'))
				)
			then '08:00 to 11:59'
	
	   	when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('12:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('15:59','%H:%i'))
				)
			then '12:00 to 15:59'		

	   	when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('16:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('19:59','%H:%i'))
				)
			then '16:00 to 19:59'	

	   	when 
				(
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						>= TIME(STR_TO_DATE('20:00','%H:%i')) AND
					TIME(STR_TO_DATE(i.TIME_INTERVAL,'%H:%i')) 
						< TIME(STR_TO_DATE('23:59','%H:%i'))
				)
			then '20:00 to 23:59'	
		end	
	) AS TIME_INTERVAL,
	o.TOTAL AS OUTBOUND,
	i.TOTAL AS INBOUND,
	abs(o.TOTAL - i.TOTAL) AS DIFF
	from
	inbound_stations i,
	outbound_stations o
	where i.STATION_ID = o.STATION_ID
	AND i.TIME_INTERVAL = o.TIME_INTERVAL
	AND i.STATION = o.STATION) TBL GROUP BY TIME_INTERVAL";
	
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
