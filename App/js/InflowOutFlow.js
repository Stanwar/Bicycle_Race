    var map = null;
    var map1 = null;
    var map2 = null;
    var map3 = null;
    var map3Counter = 1;
    var map4Counter = 1;
    var polyline;

    var svg = null;

    function setMap(whichMap)
    {
        var selectedOnes = null;

        if (whichMap === 1)
            {
                map.removeLayer(map2);
                map1.addTo(map);

                selectedOnes = svg.selectAll("text");
                selectedOnes.style("fill", "white");
            }
        else if (whichMap === 2)
            {
                map.removeLayer(map1);
                map2.addTo(map);

                selectedOnes = svg.selectAll("text");
                selectedOnes.style("fill", "black");    

            }
        else if (whichMap === 3 ){

                map3Counter = map3Counter + 1;
                
                if (map3Counter%2==0){

                // control that shows community info on hover
                var info = L.control();

                // Updating the community div
                info.onAdd = function (map) {
                    this._div = L.DomUtil.create('div', 'info');
                    this.update();  
                    return this._div;
                };

               /* info.onRemove = function (map){
                    // remove layer's DOM elements and listeners
                    map.getPanes().overlayPane.removeChild(this._div);
                    //map.off('viewreset', this._reset, this);
                }
                */

                // Showing the Community Name
                info.update = function (props) {
                   
                        this._div.innerHTML = '<h4>Community Name</h4>' +  (props ?
                        '<b>' + props.name + '</b>' + '<br>' + '<b>No. of Divvy Stations: ' 
                        + props.divvy_station + '</b>'
                        : 'Hover over a community');
            
                };

                // Adding to Map
                info.addTo(map);

                function highlightFeature(e) {
                    var layer = e.target;

                    layer.setStyle({
                    weight: 5,
                    color: '#555',
                    dashArray: '',
                    fillOpacity: 0.7
                    });

                    info.update(layer.feature.properties);
                }


                function getColor(d) {
                    console.log("feature.properties.divvy_station" + d);
                    return  d > 35 ? '#800026' :
                    d > 30  ? '#BD0026' :
                    d > 25  ? '#E31A1C' :
                    d > 20  ? '#FC4E2A' :
                    d > 15   ? '#FD8D3C' :
                    d > 10   ? '#FEB24C' :
                    d > 1   ? '#f2bb10' :
                    d == 0   ? '#eeeee6':
                    '#eeeee6';
                }

                function mapStyle(feature) {
                    return {
                        fillColor: getColor(feature.properties.divvy_station),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                }

                var geojson;

                function resetHighlight(e) {
                    geojson.resetStyle(e.target);
                    info.update();
                }

                function zoomToFeature(e) {
                    map.fitBounds(e.target.getBounds());
                }

                function onEachFeature(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: zoomToFeature
                    });
                }

                    geojson= L.geoJson(worldMap,{
                        style: mapStyle,
                        onEachFeature: onEachFeature
                    }).addTo(map);  
                    
                    //
                    var legend = L.control({position: 'bottomright'});

                    legend.onAdd = function (map) {

                        var div = L.DomUtil.create('div', 'info legend'),
                            legendgrades = [0,1,10, 15, 20, 25, 30, 35],
                            labels = [],from, to;

                        for (var i = 0; i < legendgrades.length; i++) {
                            from = legendgrades[i];
                            to = legendgrades[i + 1];
                            if (from !=0){
                                labels.push(
                                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                                    (from+1) + (to ? '&ndash;' + to : '+'));
                            }
                            else {
                                 labels.push(
                                '<i style="background:' + getColor(from + 1) + '"></i> ' +
                                    (from) + (to ? '&ndash;' + to : '+'));
                            }

                        }

                        div.innerHTML = labels.join('<br>');
                        return div;
                    };

                    legend.addTo(map);

                    // Adding Stations
                    divvyBikeLayer(); 
                }
                else {

                    // Removing the Community Layer
                    d3.selectAll("path").remove();

                    // removing divs
                    $("div").remove(".leaflet-top leaflet-right");
                    $("div").remove(".leaflet-top leaflet-right");
                    $("div").remove(".info.leaflet-control");

                    map.removeLayer(map3);
                    // Adding Stations
                    divvyBikeLayer(); 
                   
                }
        }
        else if (whichMap === 4) {
                map4Counter = map4Counter + 1;
                console.log('map4Counter' + map4Counter);
                if (map4Counter%2==0 )
                {

                     
                    drawInflowOutFlow();
                    divvyCalendarLineLayer(); 

                }
                else {

                    function clear_polyline() {
                        d3.selectAll("path").remove();
                        d3.selectAll("circle").remove();
                        d3.selectAll("text").remove();
                       // console.log('inside polyline');
                        //$("div").removeClass("leaflet-clickable");
                    }

                    clear_polyline();
                    drawInflowOutFlow();
                    divvyCalendarLineLayer(); 

                }
        }
    }   

    function drawInflowOutFlow(){
            //L.geoJson().addTo(map);
            //map.removeLayer(polyline);
            //var userSelectedTime = document.getElementById("TimeControl").value;

            var csvFile = "./App/json/Map/trips_data.csv";

            var dropSelect = document.getElementById("Stations");

            // Get Value of the drop down list
            var xdropSelect = dropSelect.options[dropSelect.selectedIndex].text;

            console.log("xdropSelect"+ xdropSelect);

            var time;
            var filteredtime ;
            d3.csv(csvFile,function(unFilterData){

                console.log('Inside csv file');
                // Filtering data for a particular time
                var data = unFilterData.filter(function(d,i){

                    if(d.from_station_name==xdropSelect || d.to_station_name ==xdropSelect){
                        return d;    
                    }
                    

                });                    
    //  polyline = L.polyline([[ data.from_station_long,data.from_station_latt],
    //                                [ data.to_station_long,data.to_station_latt]]).addTo(map);

    /*  var data = unFilterData.filter(function(d,i){

    if (d["community"] == myCommunityName )
    {
    return d;
    }

    });
    */
    // Filtering data according to the station list selected by the user
    /* for (var i =0; i<data.length; i++){

    while ()
    if (+data[i]['from_station_name'] == ){

    }
    }
    */

           // console.log(selected[0][1]);
            
            console.log('inside else for stations');
                
                for (var j = 0 ; j <data.length; j++){
                //console.log('from_station_name');
                    //console.log('conss ' + fromHash[selected[j]]);
                    if (data[j]['from_station_name'] == xdropSelect){
                        //console.log('from_station_name');
                        polyline = L.polyline([[ 
                                                //+data[parseInt(fromHash[name][i][1])]['from_station_latt'],
                                                +data[j]['from_station_latt'],
                                                //+data[parseInt(fromHash[name][i][1])]['from_station_long']
                                                +data[j]['from_station_long']
                                                ],
                                               [ 
                                               //+data[parseInt(fromHash[name][i][1])]['to_station_latt'],
                                               +data[j]['to_station_latt'],
                                                //+data[parseInt(fromHash[name][i][1])]['to_station_long']
                                                +data[j]['to_station_long']
                                               ]
                                            ],{
                                    color: 'red',
                                    weight: 2,
                                    opacity: .7,
                                   // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map); 

                    }
                    if (data[j]['to_station_name'] == xdropSelect){
                        //console.log('from_station_name');
                        polyline = L.polyline([[ 
                                                //+data[parseInt(fromHash[name][i][1])]['from_station_latt'],
                                                +data[j]['from_station_latt'],
                                                //+data[parseInt(fromHash[name][i][1])]['from_station_long']
                                                +data[j]['from_station_long']
                                                ],
                                               [ 
                                               //+data[parseInt(fromHash[name][i][1])]['to_station_latt'],
                                               +data[j]['to_station_latt'],
                                                //+data[parseInt(fromHash[name][i][1])]['to_station_long']
                                                +data[j]['to_station_long']
                                               ]
                                            ],{
                                    color: 'orange',
                                    weight: 2,
                                    opacity: .7,
                                   // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map); 

                    }
                }
                var legend = L.control({position: 'bottomright'});

                    legend.onAdd = function (map) {

                        var div = L.DomUtil.create('div', 'info legend'),
                            //legendgrades = [0,1,10, 15, 20, 25, 30, 35],
                            labels = [];

                            labels.push(
                            '<i style="background:' + 'red' + '"></i> ' +
                                'Inflow');
                            labels.push(
                            '<i style="background:' + 'orange' + '"></i> ' +
                                'OutFlow');
                        

                       

                        div.innerHTML = labels.join('<br>');
                        return div;
                     }
                    legend.addTo(map);

        });
    }
    function divvyCalendarLineLayer(){
        map.addLayer(map3);

        dealWithData();


        // Get Value of the drop down list

        //console.log("hash" + hash[]);
        function dealWithData()
        { 
            d3.json("./App/json/Map/ChicagoDivvy.json", function(collection) {
                var dropSelect = document.getElementById("Stations");
                var xdropSelect = dropSelect.options[dropSelect.selectedIndex].text;

                console.log('xdropSelect22'  + xdropSelect);  
                collection.stationBeanList.forEach(function(d) {
                    if (d.latitude && d.longitude)
                    {
                        if (isNaN(d.latitude))
                            console.log("latitude is not a number");
                        if (isNaN(d.longitude))
                            console.log("longitude is not a number");

                            d.LatLng = new L.LatLng(+d.latitude, +d.longitude);
                            d.color = "green";
                        }
                        else
                        {
                            d.LatLng = new L.LatLng(0,0);
                        }   
                    });



                    var feature = g.selectAll("circle")
                    .data(collection.stationBeanList)
                    .enter()
                    .append("svg:circle")
                    .style("stroke","white")  
                    .style("stroke-width", "2")
                    .style("opacity", 1.0)
                    .style("fill", function(d){
                            var redcolor = "red";
                            var greencolor = "green";
                            var colorValue;
                                if (d.stationName==xdropSelect){
                                    return greencolor; 
                                }
                    })
                    .attr("r", function(d){
                            if (d.stationName==xdropSelect){
                                    return 40; 
                                }
                            else {
                                return 10;
                            }
                    })
                    ;

                    var feature2 = g.selectAll("text")
                    .data(collection.stationBeanList)
                    .enter()
                    .append("svg:text")
                    .style("fill", "white")
                    .style("stroke", function (d) { 
                        // console.log( "station "+ d.stationName + "selected stations"  + selected[i]);
                        return d.color;       
                    })
                    .style("stroke-width", "1")
                    .style("font-size", "25px")
                    .style("font-family", "Arial")
                    .style("text-anchor", "start")
                    .style("font-weight","bold")
                    .text(function (d)
                        {   if(d.stationName==xdropSelect){
                                return d.stationName; 
                            }
                        });
                    ;
                
                    map.on("viewreset", update);
                    update();

                    function update() {
                                feature.attr("transform", 
                                function(d) { 
                                return "translate("+ 
                                map.latLngToLayerPoint(d.LatLng).x +","+ 
                                map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                        );

                        feature2.attr("transform", 
                            function(d) { 
                                return "translate("+ 
                                (map.latLngToLayerPoint(d.LatLng).x+20.0) +","+ 
                                (map.latLngToLayerPoint(d.LatLng).y+5.0) +")";
                            }
                        );


                    }       
            })  
        }
    }
    function divvyBikeLayer(){
        map.addLayer(map3);

        function getColor(d) {
            console.log("feature.properties.popularity" + d);

            d = parseInt(d);

            return  d > 300 ? '#5402f6' :
                    d > 250  ? '#9171d0' :
                    d > 200  ? '#f20cf4' :
                    d > 150  ? '#0ccbf4' :
                    d > 100   ? '#FD8D3C' :
                    d > 50   ? '#FEB24C' :
                    d > 11   ? '#54f602' :
                    d == 0   ? '#dcf602':
                    '#dcf602';
        }
             
        var greenMarkerOptions = {
                radius: 10,
                fillColor: "green",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };


        L.geoJson(MapGeoJson, {
            pointToLayer: function (feature, latlng) {
                
                var content = "<table border=1><tr><th colspan=2 bgcolor=#99CCFF font-size><b>" + feature.properties.station_name + "</th></tr><tr><th colspan=2><img src='DivvyLogo.jpg' height=80 width=200></th></tr><tr><td>Popularity Rank" + "</td><td>"+ feature.properties.popularity +"</td></tr><tr><td> Community Name </td><td>" +  feature.properties.community + "</td></tr><tr><td>Overall Inflow</td><td>"+ feature.properties.inflow+"</td></tr><tr><td>Overall Outflow</td><td>"+ feature.properties.outflow+"</td></tr></table>";
                var popup = L.popup().setContent(content);

                var greenMarkerOptions = {
                    radius: 10,
                    fillColor: getColor(feature.properties.popularity),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                

                var marker = L.circleMarker(latlng, greenMarkerOptions);
                    marker.bindPopup(popup);
                return marker;              
            }
        }).addTo(map);
    }

    var mapURL2 = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';
    var mapCopyright2 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    var mapURL3 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';


    var mapURL1 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    var mapCopyright1 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //var mapURL2 = 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}';
    //var mapCopyright2 = 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC';

    map1 = L.tileLayer(mapURL1, {attribution: mapCopyright1});
    map2 = L.tileLayer(mapURL2, {attribution: mapCopyright2});
    map3 = L.tileLayer(mapURL3, {attribution: mapCopyright3});


    map = L.map('map', {layers: [map1,map2,map3], zoomControl: true}).setView([41.869910, -87.65], 12);

    //map = L.map('map', {zoomControl: false}).setView([41.869910, -87.65], 16);

    // mapLink = L.tileLayer(mapURL1, {attribution: mapCopyright1}).addTo(map);


    /* Initialize the SVG layer */
    map._initPathRoot();  

    /* We simply pick up the SVG from the map object */
    svg = d3.select(map.getPanes().overlayPane).select("svg");

    var g = svg.append("g");

    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    var today = new Date();
    var circleCounter = 0;

    var bigCollection = {};