<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = "
        SELECT *
        FROM stations_data
        ";
	
    $query = mysql_query($myquery);
    
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();

    # Build GeoJSON feature collection array
$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);
    
   
    while($row = mysql_fetch_assoc($dbquery)){

          $marker = array(
            'type' => 'Feature',
            'properties' => array(
              'title' => $row['name'],
              'marker-color' => '#f00',
              'marker-size' => 'small'
            ),
            'geometry' => array(
              'type' => 'Point',
              'coordinates' => array( 
                $row['lat'],
                $row['lng']
              )
            )
          );
      array_push($geojson['features'], $marker);
    }

   // for ($x = 0; $x < mysql_num_rows($query); $x++) {
   //     $data[] = mysql_fetch_assoc($query);
   // }
    
    echo json_encode($geojson);     
     
    mysql_close($server);
?>