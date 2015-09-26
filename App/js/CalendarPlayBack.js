///////////////////////////////////////////////////////
// Weather in Chicago-- extended Prof. Johnson's code
// by Sharad Tanwar for Project 6 : Bicycle Race 
//////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////
    // Calling global variables to be used in functions
    ////////////////////////////////////////////////////////
        var MapView = null;
        var Aerial = null;
        var map3 = null;
        var map3Counter = 1;
        var map4Counter = 2;
        var polyline;

        var svg = null;

    ////////////////////////////////////////////////////////////
    //   Function to control toggle from buttons from map.html
    ///////////////////////////////////////////////////////////

        function setMap(whichMap)
        {
            //divvyBikeLayer();
            if (whichMap ==1){
            ////////////////////////////////////////////////////////////
            //   FLOW CONTROL MODE
            ///////////////////////////////////////////////////////////
                
                clear_polyline();
                drawInflowOutFlow();
                divvyflowLayer(); 
                
            } 
            if (whichMap ==2){

            ////////////////////////////////////////////////////////////
            //   PATTERN MODE 
            ///////////////////////////////////////////////////////////
                // Clearing pages
                clear_polyline();
                drawPatternLayer();
                divvyPatternLayer();
                // Adding Stations
               
            }
       /*     else if (whichMap == 3) {
            ////////////////////////////////////////////////////////////
            //   PLAYBACK/CALENDAR MODE
            ///////////////////////////////////////////////////////////

                // Clearing pages
                clear_polyline();

                //Calling the Line Layer Function
                divvyCalendarLineLayer(); 

                // Calling the Trips Toggle
                drawTrips();

                // Calling up the temperature function
                usWeatherApp.updateOutsideTemp();

            }
        */
        }

    ////////////////////////////////////////////////////////////
    //   FUNCTION TO CLEAR OBJECTS AND PATH FROM THE MAP
    ///////////////////////////////////////////////////////////

        function drawPatternLayer(){

            var e1 = document.getElementById("PatternList");
            var e2 = e1.options[e1.selectedIndex].text;
            var csvFile ="";

            console.log('e2' + e2);
            if (e2 == "TimesOfTheDay") {

                var e3= document.getElementById("TOD");
                          console.log('e3'  +e3);
                var e4=e3.options[e3.selectedIndex].text;
                console.log('e4'  +e4);
                if (e4=='Morning'){
                    csvFile ='./App/json/Map/trips_by_interval/trips_data_by_interval_0000_to_0600.csv';
                }
                else if(e4=='Lunch'){
                    csvFile ='./App/json/Map/trips_by_interval/trips_data_by_interval_0600_to_1200.csv';
                }
                else if(e4=='Evening'){
                    csvFile ='./App/json/Map/trips_by_interval/trips_data_by_interval_1200_to_1800.csv';
                }
                else if(e4=='Night'){
                    csvFile ='./App/json/Map/trips_by_interval/trips_data_by_interval_1800_to_0000.csv';
                }
            }
            else if(e2="DaysOfTheWeek") {
                var e5= document.getElementById("DOW");
                var e6=e5.options[e5.selectedIndex].text;

                if(e6=='Monday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Monday.csv';
                }
                else if(e6=='Tuesday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Tuesday.csv';
                }
                else if(e6=='Wednesday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Wednesday.csv';
                }
                else if(e6=='Thursday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Thursday.csv';
                }
                else if(e6=='Friday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Friday.csv';
                }
                else if(e6=='Saturday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Saturday.csv';
                }
                else if(e6=='Sunday'){
                    csvFile = './App/json/Map/trips_by_dayofweek/trips_data_by_dayofweek_Sunday.csv';
                }
            }
            d3.csv(csvFile, function (data) {
                var e1 = document.getElementById("PatternChicago");
                var e2 = e1.options[e1.selectedIndex].text;
                var selected= [];

                if (e2 =="Communities"){
                    $("#leftPattern2").each(function(){
                        selected = $(this).val();     
                    })
                }
                else {
                    $("#leftPattern1").each(function(){
                        selected = $(this).val();     
                    })

                }

                //console.log("before hashmap");
                console.log('dataLength : ' + data.length);
                console.log('getCommunityArea' + getCommunityArea.features.length);

                if (e2 == "Communities") {
                    for (var i = 0; i < selected.length; i++) {
                        for (var h = 0; h < getCommunityArea.features.length; h++) {
                            //console.log('fsad;fasd;fhas;hf;ashdf;asdhfkajs' + getCommunityArea.features[h].properties.name + 'ssellected'+ selected[i]);

                            if (getCommunityArea.features[h].properties.name === selected[i]) {
                                //console.log('X'  + getCommunityArea.features[h]);
                                L.geoJson(getCommunityArea.features[h]).addTo(map);
                            }
                            console.log('After');
                        }
                        for (var j = 0; j < data.length; j++) {
                            if (data[j]['from_community'] == selected[i]) {
                                //console.log('from_community');
                                polyline = L.polyline([
                                    [
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
                                ], {
                                    color: 'orange',
                                    weight: 5,
                                    opacity: .7,
                                    // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map);

                            }
                        }
                    }
                }
                else {
                    console.log('inside else for stations');
                    for (var i = 0; i < selected.length; i++) {

                        for (var j = 0; j < data.length; j++) {
                            //console.log('from_station_name');
                            //console.log('conss ' + fromHash[selected[j]]);
                            if (data[j]['from_station_name'] == selected[i]) {
                                //console.log('from_station_name');
                                polyline = L.polyline([
                                    [
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
                                ], {
                                    color: '#5D4Bd1',
                                    weight: 3,
                                    opacity: .7,
                                    // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map);

                            }
                        }
                    }
                }
            });
    }
    ////////////////////////////////////////////////////////////
    //   FUNCTION TO CLEAR OBJECTS AND PATH FROM THE MAP
    ///////////////////////////////////////////////////////////

        function clear_polyline() {
            d3.selectAll("path").remove();
            d3.selectAll("circle").remove();
            d3.selectAll("text").remove();
            $("div").remove(".leaflet-top leaflet-right");
            $("div").remove(".leaflet-top leaflet-right");
            $("div").remove(".info.leaflet-control");   
            $("div").remove(".map.image.leaflet-control");
        }

    ////////////////////////////////////////////////////////////
    //   FUNCTION TO SHOW STATIONS FOR FLOW CONTROL
    ///////////////////////////////////////////////////////////
        function divvyflowLayer()
        { 
            d3.json("./App/json/Map/ChicagoDivvy.json", function(collection) {
            var dropSelect = document.getElementById("FlowStationList");
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
                        var bluecolor="blue";
                        var greencolor = "green";
                        var colorValue;
                            if (d.stationName==xdropSelect){
                                return bluecolor; 
                            }
                })
                .attr("r", function(d){
                        if (d.stationName==xdropSelect){
                                return 25; 
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
    ////////////////////////////////////////////////////////////
    // Function to show stations per pattern
    ////////////////////////////////////////////////////////////
    function divvyPatternLayer()
        { 
            d3.json("./App/json/Map/ChicagoDivvy.json", function(collection) {

                    var e1 = document.getElementById("PatternChicago");
                    var e2 = e1.options[e1.selectedIndex].text;
                    var selected= [];

                    if (e2 =="Communities"){
                        $("#leftPattern2").each(function(){
                            selected = $(this).val();     
                        })
                    }
                    else {
                        $("#leftPattern1").each(function(){
                            selected = $(this).val();     
                        })

                    }

                    console.log('selected length' + selected[0]);
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
                            .style("stroke-width", "1")
                            .style("opacity", 1.0)
                            .style("fill", function(d){

                                var colorValue;
                                var bluecolor = "blue";
                                var redcolor = "red";
                                var greencolor = "green";
                                //console.log('colorValue'  + colorValue);
                                if(e2 == "Communities"){
                                    for(var i=0;i<=selected.length;i++){
                                        for(var h=0;h<Station_Community.length;h++){
                                            for(var k=0;k<Station_Community[h].Stations.length;k++){
                                                if(selected[i]==Station_Community[h].Community && Station_Community[h].Stations[k] == d.stationName){
                                                    colorValue= bluecolor;
                                                }
                                            }
                                        }
                                    } 

                                    if(colorValue){
                                        return bluecolor;
                                    }
                                    else {
                                        return greencolor;
                                    }  
                                }
                                else if(e2 == "Stations"){
                                    for(var i=0;i<=selected.length;i++){                                   
                                        if (selected[i]===d.stationName){
                                            console.log('INSIDE STATIONS');
                                            colorValue= redcolor; 
                                        }
                                    }
                                    if(colorValue){
                                        return colorValue;
                                    }
                                    else {
                                        return greencolor;
                                    } 
                                }
        
                            })
                            .attr("r", 10)
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
                        .style("font-size", "30px")
                        .style("font-family", "Arial")
                        .style("text-anchor", "start")
                        .style("font-weight", "bold")
                        .text(function (d) {
                            for (var i = 0; i < selected.length; i++) {
                                if (selected[i] === d.stationName) {
                                    if (e2 == "Communities") {
                                        if (selected[i] == d.from_community_name) {
                                            return d.stationName;
                                        }
                                    }
                                    else if (e2 == "Stations") {
                                        return d.stationName;
                                    }
                                }
                            }
                        });

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

                    };

            }); 
        }
    ////////////////////////////////////////////////////////////
    //   SHOW INFLOW AND OUTFLOW ON MAP
    ///////////////////////////////////////////////////////////
        function drawInflowOutFlow(){

            var csvFile = "./App/json/Map/trips_data.csv";

            var dropSelect = document.getElementById("FlowStationList");

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
                var j= 1;

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
                                    color: 'green',
                                    weight: 3,
                                    opacity: .7,
                                   // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map); 

                    }
                    else if (data[j]['to_station_name'] == xdropSelect){
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
                                    weight: 3,
                                    opacity: .7,
                                   // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map); 

                    }
                }

                var Inflowlegend = L.control({position: 'bottomright'});

                    Inflowlegend.onAdd = function (map) {

                        var div = L.DomUtil.create('div', 'info legend'),
                            //legendgrades = [0,1,10, 15, 20, 25, 30, 35],
                            labels = [];

                            labels.push(
                            '<i style="background:' + 'orange' + '"></i> ' +
                                'Inflow');
                            labels.push(
                            '<i style="background:' + 'green' + '"></i> ' +
                                'OutFlow');
                        

                       

                        div.innerHTML = labels.join('<br>');
                        return div;
                     }
                    Inflowlegend.addTo(map);

            });
        }
    ////////////////////////////////////////////////////////////
    // Function to show Lines for a day for Playback Mode 
    ////////////////////////////////////////////////////////////
        function drawTrips(DateStringThing) {   

            // Calling up the temperature function
            //usWeatherApp.updateOutsideTemp();

            ////////////////////////////////////////////////////////////
            //   PLAYBACK/CALENDAR MODE
            ///////////////////////////////////////////////////////////

            // Clearing pages
            clear_polyline();

            //Calling the Line Layer Function
            divvyCalendarLineLayer(); 

            // Calling up the temperature function
            usWeatherApp.updateOutsideTemp(DateStringThing);

            var TimePickerValue = new Date(DateStringThing);

            console.log(' TimePickerValue' + TimePickerValue);
                //document.getElementById("TimeControl").value;
            //= '07/12/2013 18:00';
            //var DayToRun = TimePickerValue.substring(0, TimePickerValue.length - 6);
            //TimePickerValue = new Date(TimePickerValue);

            //console.log('DayToRun' + DayToRun);
            var AtTimeRun = TimePickerValue.getHours();

            if (AtTimeRun <=9) {
                AtTimeRun = "0" + AtTimeRun;
            }

            console.log(AtTimeRun);
            console.log('drawTrips -->');

/*
            var parseDate = ((DayToRun.substring(0,DayToRun.length-8)).length == 2 ? (DayToRun.substring(0,DayToRun.length-8)) 
                                                                  : '0' + (DayToRun.substring(0,DayToRun.length-8)) )
                            + '_' 
                            + DayToRun.substring(DayToRun.length-7,DayToRun.length-5) 
                            + '_'
                            +DayToRun.substring(DayToRun.length-4,DayToRun.length);
*/

            var parseDate = 
                            (((TimePickerValue.getMonth() + 1) >= 10) ? (TimePickerValue.getMonth() + 1) : '0' + (TimePickerValue.getMonth() + 1)) 
                            + '_' 
                            + ((TimePickerValue.getDate()) <= 9 ? ('0' + TimePickerValue.getDate()) : TimePickerValue.getDate())
                            + '_' 
                            + TimePickerValue.getFullYear();

            console.log('parseDate' + parseDate);

            var csvFile = "./App/json/Map/trips_by_day/trips_data_by_day_" + parseDate + ".csv";

            console.log('parseDate' + parseDate);

            var time;
            var filteredtime;
            d3.csv(csvFile, function (unFilterData) {

                console.log('Inside csv file');
                // Filtering data for a particular time
                var data = unFilterData.filter(function (d, i) {

                    time = new Date(d.starttime).getHours();
                    if (time.length <=9) {
                        time = "0" + time;
                    }
                    if (AtTimeRun == time) {
                        return d;
                    }


                });
                var selected = [];

                var e1 = document.getElementById("Chicago_Data");
                var e2 = e1.options[e1.selectedIndex].text;
                if (e2 == "Communities") {
                    $("#leftValues2").each(function () {
                        selected = $(this).val();
                    })
                }
                else {
                    $("#leftValues1").each(function () {
                        selected = $(this).val();
                    })
                }

                //console.log("before hashmap");
                console.log('dataLength : ' + data.length);
                console.log('getCommunityArea' + getCommunityArea.features.length);

                if (e2 == "Communities") {
                    for (var i = 0; i < selected.length; i++) {
                        for (var h = 0; h < getCommunityArea.features.length; h++) {
                            //console.log('fsad;fasd;fhas;hf;ashdf;asdhfkajs' + getCommunityArea.features[h].properties.name + 'ssellected'+ selected[i]);

                            if (getCommunityArea.features[h].properties.name === selected[i]) {
                                //console.log('X'  + getCommunityArea.features[h]);
                                L.geoJson(getCommunityArea.features[h]).addTo(map);
                            }
                            console.log('After');
                        }
                        for (var j = 0; j < data.length; j++) {
                            if (data[j]['from_community'] == selected[i]) {
                                //console.log('from_community');
                                polyline = L.polyline([
                                    [
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
                                ], {
                                    color: 'orange',
                                    weight: 3,
                                    opacity: .7,
                                    // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map);

                            }
                        }
                    }
                }
                else {
                    console.log('inside else for stations');
                    for (var i = 0; i < selected.length; i++) {

                        for (var j = 0; j < data.length; j++) {
                            //console.log('from_station_name');
                            //console.log('conss ' + fromHash[selected[j]]);
                            if (data[j]['from_station_name'] == selected[i]) {
                                //console.log('from_station_name');
                                polyline = L.polyline([
                                    [
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
                                ], {
                                    color: 'orange',
                                    weight: 3,
                                    opacity: .7,
                                    // dashArray: '20,15',
                                    lineJoin: 'round'
                                }).addTo(map);

                            }
                        }
                    }
                }
            });
        }

    ////////////////////////////////////////////////////////////
    //   Stations for Calendar Playback
    ///////////////////////////////////////////////////////////

        function divvyCalendarLineLayer(){
            // Calling the data function
            dealWithData();

            function dealWithData()
            {       
                d3.json("./App/json/Map/ChicagoDivvy.json", function(collection) {

                    var e1 = document.getElementById("Chicago_Data");
                    var e2 = e1.options[e1.selectedIndex].text;
                    var selected= [];

                    if (e2 =="Communities"){
                        $("#leftValues2").each(function(){
                            selected = $(this).val();     
                        })
                    }
                    else {
                        $("#leftValues1").each(function(){
                            selected = $(this).val();     
                        })

                    }

                    console.log('selected length' + selected[0]);
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
                            .style("stroke-width", "1")
                            .style("opacity", 1.0)
                            .style("fill", function(d){

                                var colorValue;
                                var bluecolor = "blue";
                                var redcolor = "red";
                                var greencolor = "green";
                                //console.log('colorValue'  + colorValue);
                                if(e2 == "Communities"){
                                    for(var i=0;i<=selected.length;i++){
                                        for(var h=0;h<Station_Community.length;h++){
                                            for(var k=0;k<Station_Community[h].Stations.length;k++){
                                                if(selected[i]==Station_Community[h].Community && Station_Community[h].Stations[k] == d.stationName){
                                                    colorValue= bluecolor;
                                                }
                                            }
                                        }
                                    } 

                                    if(colorValue){
                                        return bluecolor;
                                    }
                                    else {
                                        return greencolor;
                                    }  
                                }
                                else if(e2 == "Stations"){
                                    for(var i=0;i<=selected.length;i++){                                   
                                        if (selected[i]===d.stationName){
                                            console.log('INSIDE STATIONS');
                                            colorValue= redcolor; 
                                        }
                                    }
                                    if(colorValue){
                                        return colorValue;
                                    }
                                    else {
                                        return greencolor;
                                    } 
                                }
        
                            })
                            .attr("r", 10)
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
                        .style("font-size", "30px")
                        .style("font-family", "Arial")
                        .style("text-anchor", "start")
                        .style("font-weight", "bold")
                        .text(function (d) {
                            for (var i = 0; i < selected.length; i++) {
                                if (selected[i] === d.stationName) {
                                    if (e2 == "Communities") {
                                        if (selected[i] == d.from_community_name) {
                                            return d.stationName;
                                        }
                                    }
                                    else if (e2 == "Stations") {
                                        return d.stationName;
                                    }
                                }
                            }
                        });

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

                    };

                }); 

            }
        }

    
    ////////////////////////////////////////////////////////////
    //   DEFINING MAP VIEWS TO SHOW AS BASE LAYERS
    ///////////////////////////////////////////////////////////
        var mapURL2 = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';
        var mapCopyright2 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX';

        var mapURL1 = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        var mapCopyright1 = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX';

        var mapURL3 = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var mapCopyright3 = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

        var Aerial = L.tileLayer(mapURL1, {attribution: mapCopyright1}),
            MapView   =  L.tileLayer(mapURL2, {attribution: mapCopyright2}),
            ColorView = L.tileLayer(mapURL3, {attribution: mapCopyright3});

        var baseLayers = {
            "ColorView": ColorView,
            "MapView": MapView,
            "Aerial": Aerial

        };

    ////////////////////////////////////////////////////////////
    //   DEFINING VARIOUS LAYERS TO SHOW ON MAP
    ///////////////////////////////////////////////////////////

        var Communities = new L.LayerGroup();
        var Popularity = new L.LayerGroup();
        var StationLayer = new L.LayerGroup();

    ////////////////////////////////////////////////////////////
    //   DEFINING MAP PARAMETERS AND ZOOM LEVEL AND VIEW
    ///////////////////////////////////////////////////////////

        var map = L.map('map', {
            center: [41.869910, -87.65],
            zoom: 11,
            layers: [ColorView,MapView,Aerial]
            });

    //////////////////////////////////////////////////////////////////////////
    // Creating Station Layer with Popups
    //////////////////////////////////////////////////////////////////////////

        var stationGeoJson = 
                    L.geoJson(MapGeoJson, { 
                        pointToLayer: function (feature, latlng) {
                            
                            var content = "<table border=1><tr><th colspan=2 bgcolor=#99CCFF font-size><b>" + feature.properties.station_name + "</th></tr><tr><td>Popularity Rank" + "</td><td>"+ feature.properties.popularity +"/300</td></tr><tr><td> Community Name </td><td>" +  feature.properties.community + "</td></tr></table>";
                            var popup = L.popup().setContent(content);

                            var greenMarkerOptions = {
                                radius: 10,
                                fillColor: "Green",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            };
                var marker = L.circleMarker(latlng, greenMarkerOptions);
                    marker.bindPopup(popup);
                return marker;  
                            
                }
            }).addTo(StationLayer);

    ////////////////////////////////////////////////////////////
    //   DEFINING THE COMMUNITY LAYER WITH HOVER AND INFO CONTROL
    ///////////////////////////////////////////////////////////

        // control that shows community info on hover
        var info = L.control({position: 'bottomleft'});

        // Updating the info control on div
        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();  
            return this._div;
        };

        // Showing the Community Name on Hover
        info.update = function (props) {
           
                this._div.innerHTML = '<h4>Community Name</h4>' +  (props ?
                '<b>' + props.name + '</b>' + '<br>' + '<b>No. of Divvy Stations: ' 
                + props.divvy_station + '</b>'
                : 'Hover over a community');

        };

        // Highlight area of community when hovered over
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

        // Color Function
        function getColor(d) {
            console.log("feature.properties.divvy_station" + d);
            return  d > 35 ? '#800026' :
            d > 30  ? '#BD0026' :
            d > 25  ? '#E31A1C' :
            d > 20  ? '#FC4E2A' :
            d > 15   ? '#FD8D3C' :
            d > 10   ? '#FEB24C' :
            d > 0   ? '#f2bb10' :
            d == 0   ? '#eeeee6':
            '#eeeee6';
        }

        //Style function for Map
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

        //Reset style on update
        function resetHighlight(e) {
            geojson.resetStyle(e.target);
            info.update();
        }

        // Zoom Function when clicked on community
        function zoomToFeature(e) {
            map.fitBounds(e.target.getBounds());
        }

        // Layer features 
        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight,
                click: zoomToFeature
            });
        }

        // Adding geoJson data for Community and adding it to the Communities overlay 
        var geojson = L.geoJson(worldMap,{
                style: mapStyle,
                onEachFeature: onEachFeature
            }).addTo(Communities); 
       
        ////////////////////////////////////////////////////////////////////
        // Legend Creation for Community OverLay
        ////////////////////////////////////////////////////////////////////
            var legend = L.control({position: 'bottomright'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    legendgrades = [0,1,10, 15, 20, 25, 30, 35],
                    labels = [],from, to;
                    labels.push('<i>No_Of_Stations</i>');
                for (var i = legendgrades.length-1; i >0 ; i--) {
                    from = legendgrades[i];
                    to = legendgrades[i + 1];

                    if (from !=0){
                        labels.push(
                        '<i style="background:' + getColor(from + 1) + '"></i>' +
                            (from+1) + (to ? '&ndash;' + to : '+'));
                    }
                    else {
                         labels.push(
                        '<i style="background:' + getColor(from + 1) + '"></i>' +
                            (from) + (to ? '&ndash;' + to : '+'));
                    }

                }

                div.innerHTML = labels.join('<br>');
                return div;
            };

            // Color function based on popularity
            function getPopularityColor(d) {

                d = parseInt(d);

                return  d >= 250  ? '#006600' :
                    d >= 200  ? '#009933' :
                    d >= 150  ? '#669900' :
                    d >= 100   ? '#CCCC00' :
                    d >= 50   ? '#7A0000' :
                    d >= 10   ? '#CC0066' :
                    d >= 0   ? '#FF0000':
                    '#FF0000';
            }

            // Adding geoJson data based on popularity to the Popularity overlay
            var popularityGeoJson = 
                        L.geoJson(MapGeoJson, { 
                            pointToLayer: function (feature, latlng) {
                                
                                var content = "<table border=1><tr><th colspan=2 bgcolor=#99CCFF font-size><b>" + feature.properties.station_name + "</th></tr><tr><td>Popularity Rank" + "</td><td>"+ feature.properties.popularity +"/300 </td></tr><tr><td> Community Name </td><td>" +  feature.properties.community + "</td></tr><tr><td>Overall Inflow</td><td>"+ feature.properties.inflow+"</td></tr><tr><td>Overall Outflow</td><td>"+ feature.properties.outflow+"</td></tr></table>";
                                var popup = L.popup().setContent(content);

                                var greenMarkerOptions = {
                                    radius: 10,
                                    fillColor: getPopularityColor(feature.properties.popularity),
                                    color: "#000",
                                    weight: 1,
                                    opacity: 1,
                                    fillOpacity: 0.8
                                };
                        

                var marker = L.circleMarker(latlng, greenMarkerOptions);
                    marker.bindPopup(popup);
                return marker;  
                            
                }
            }).addTo(Popularity);

        ////////////////////////////////////////////////////////////////////
        // Legend for Community OverLay
        ////////////////////////////////////////////////////////////////////
            var legend2 = L.control({position: 'bottomright'});

            legend2.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend'),
                    legendgrades = [0,10,50, 100, 150, 200, 250],
                    labels = [],from, to;
                    labels.push('<i>Popularity_Rank</i>');
                for (var i = 0; i <legendgrades.length; i++) {
                    from = legendgrades[i];
                    to = legendgrades[i + 1];
                    if (from !=0){
                        labels.push(
                        '<i style="background:' + getPopularityColor(from) + '"></i>' +
                            (from+1) + (to ? '&ndash;' + to : '+'));
                    }
                    else {
                         labels.push(
                        '<i style="background:' + getPopularityColor(from + 1) + '"></i>' +
                            (from+1) + (to ? '&ndash;' + to : '+'));
                    }

                }

                div.innerHTML = labels.join('<br>');
                return div;
            };


        ////////////////////////////////////////////////////////////////////
        // Adding all the overlays to the overLayMaps Variable
        ////////////////////////////////////////////////////////////////////
            var overlayMaps = {
                "Station"    : StationLayer,
                "Communities": Communities,
                "Popularity" : Popularity
            };

            map._initPathRoot();  

            L.control.layers(baseLayers, overlayMaps).addTo(map);

            var LayerCounter =1;
            var LayerCounter2 =1;
            // Add and remove layers
            map.on('overlayadd', function (d) {
            // Switch to the Permafrost legend...
                
                
                console.log('ADD'  + d.name);
                if (d.name === 'Communities') {
                            legend.addTo(this);
                            info.addTo(this);
                }
                
                else
                    if(d.name ==='Popularity'){
                            legend2.addTo(this);

                }
            });

        ////////////////////////////////////////////////////////////////////
        // Adding OverLay Remove to remove controls and divs
        ////////////////////////////////////////////////////////////////////

            map.on('overlayremove', function (d) {

                console.log('REMOVE'  + d.name);
                if (d.name === 'Communities') {
                        this.removeControl(legend);
                        this.removeControl(info);
                }
                
                else
                    if(d.name ==='Popularity'){
                            this.removeControl(legend2);
                        }
                
            });

        ////////////////////////////////////////////////////////////////////
        // Variables
        ////////////////////////////////////////////////////////////////////

            /* We simply pick up the SVG from the map object */
            svg = d3.select(map.getPanes().overlayPane).select("svg");

            var g = svg.append("g");

            var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

            var today = new Date();
