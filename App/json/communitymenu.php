<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "SELECT DISTINCT(COMMUNITY) AS COMMUNITY FROM stations_data";	
    $query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
	$data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
	
	foreach($data as $value){
		print "&lt;option value='" . $value['COMMUNITY'] . "'&gt;" . $value['COMMUNITY'] . "&lt;/option&gt;<br />";
	}
    
	//echo json_encode($data);     
    mysql_close($server);
?>