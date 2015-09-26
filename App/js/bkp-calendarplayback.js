////////////////////////////////////////
// Weather in Chicago-- extended Prof. Johnson's code
// by Sharad Tanwar for Project 6 : Bicycle Race 
////////////////////////////////////////


var USweatherApp = Class.extend({

construct: function() {

this.gwin = {};

this.gwin.canvasWidth = 1200;
this.gwin.canvasHeight = 800;

this.gwin.latMinTemp = 26.5;
this.gwin.latMaxTemp = 48.5;

this.gwin.lonMinTemp = -124;
this.gwin.lonMaxTemp = -67;

this.gwin.boxSize = 100;

this.gwin.appID = "";
this.gwin.myTag = "";

this.gwin.mode = 0;
this.gwin.itsF = "F";

this.gwin.projection = null;

this.gwin.maxX = 0;
this.gwin.maxY = 0;

this.gwin.iconmostlycloudynight = new Image();
this.gwin.iconpartlycloudynight = new Image();
this.gwin.iconclearnight        = new Image();
this.gwin.iconsnow              = new Image();
this.gwin.iconunknown           = new Image();
this.gwin.iconstorms            = new Image();
this.gwin.icontstorms           = new Image();
this.gwin.iconmostlycloudy      = new Image();
this.gwin.iconpartlycloudy      = new Image();
this.gwin.iconrain              = new Image();
this.gwin.iconfog               = new Image();
this.gwin.iconhazy              = new Image();
this.gwin.iconsleet             = new Image();
this.gwin.iconcloudy            = new Image();
this.gwin.iconclear             = new Image();
this.gwin.iconsunny             = new Image();
this.gwin.iconsnownight     = new Image();
this.gwin.iconstormsnight   = new Image();
this.gwin.iconcloudynight  = new Image();

this.gwin.numIconsLoaded = 0;
},
///////////////////////////////////////

makeCallback: function (weatherOut,time)
{
    var iconSet;
    var weather;
    var weatherIcon;
    var weatherImage;

    var userSelectedTime = time;

    var userTime = new Date(userSelectedTime);
    var userHour = userTime.getHours(); 

    for (var i = 0 ; i<weatherOut.history.observations.length;i++){

        if(weatherOut.history.observations[i].date.hour== userTime.getHours()){
            console.log('inside usertime');
            weather = weatherOut.history.observations[i].tempi;
            console.log('weather' + weather);
            iconSet = weatherOut.history.observations[i].icon;
            console.log('iconSet'  + iconSet)

        }
    }

    weatherIcon = iconSet;
    var weatherName = weatherIcon;

    if (weatherName === "")
            weatherName = "unknown";

    weatherImage = this.getCorrectWeatherIcon(weatherName, 0); //day
    console.log('+sdsa'  + weatherImage);

    var times = SunCalc.getTimes(userTime, 41.8739580629, -87.6277394859);
    console.log(times);

    var sunrise = times.sunrise.getHours() + times.sunrise.getMinutes()/60;
    console.log(sunrise);

    var sunset = times.sunset.getHours() + times.sunset.getMinutes()/60;
    console.log(sunset);

    if (sunset < 12)
        sunset += 24;
    // Check if night or not
    if ( (userHour < sunrise) || (userHour > sunset) )
        {
        if ((weatherName == "mostlycloudy") || (weatherName == "partlycloudy") ||
            (weatherName == "clear"))
            {
                weatherImage = this.getCorrectWeatherIcon(weatherName, 1); 
            }
        }

    var self = this;
    self.drawEverything(weather, weatherImage.src);
},

///////////////////////////////////////

updateOutsideTemp: function ()
{ 
    //Getting the temperature 
    console.log('inside updateOutsideTemp');
    var lat, lon;
 
    var self = this;
    var replace = 0;

    var userSelectedTime = document.getElementById("TimeControl").value;

    var timeSS = new Date(userSelectedTime);

    console.log('timeSS'  + timeSS);

    //console.log('timeSS.getMonth() +1).length' + ((timeSS.getMonth()).length) );

    var parseDate = timeSS.getFullYear() + '_' + (((timeSS.getMonth() +1) >=10) ? (timeSS.getMonth() +1) : '0'+(timeSS.getMonth() + 1))+ '_'+ timeSS.getDate();

    console.log('parseDate' + parseDate);

    // Concatenating the date and picking up the data files.
    var jsonFile = './App/json/weather/'+ parseDate+'__output.json';

    // Calling the Json and temp Function
    d3.json(jsonFile, 
        function(err, json)
            {
            if(err)
                {
                console.log("NO DATA");
                return;
                }
          // self.makeCallbackFunc(lat, lon, response, arrayX, arrayY);
           self.makeCallback(json,userSelectedTime);
            });

},

////////////////////////////////////////

drawEverything: function (weather, iconSrc)
{
    var weatherlegend = L.control({position: 'bottomright'});

            weatherlegend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'map image');

            div.innerHTML = '<img src="' + iconSrc + '"/>' + '<I class="WeatherIcon" font-size=20px>'+weather + ' F</I>';
            return div;
    };

    weatherlegend.addTo(map);
},

////////////////////////////////////////

getCorrectWeatherIcon: function(weatherCondition, night)
{
    console.log('getCorrectWeatherIcon');
    if (night === 1)
        {   
            switch(weatherCondition) {
                case "mostlycloudy": return(this.gwin.iconmostlycloudynight);
                case "partlycloudy": return(this.gwin.iconpartlycloudynight);
                case "clear": return(this.gwin.iconclearnight);
            }
        }
    else // night === 0
        {
            switch(weatherCondition) {
                case "snow": return(this.gwin.iconsnow);
                case "unknown": return(this.gwin.iconunknown);
                case "storms": return(this.gwin.iconstorms);
                case "tstorms": return(this.gwin.icontstorms);
                case "mostlycloudy": return(this.gwin.iconmostlycloudy);
                case "partlycloudy": return(this.gwin.iconpartlycloudy);

                case "rain": return(this.gwin.iconrain);
                case "fog": return(this.gwin.iconfog);
                case "hazy": return(this.gwin.iconhazy);
                case "sleet": return(this.gwin.iconsleet);
                case "cloudy": return(this.gwin.iconcloudy);
                case "clear": return(this.gwin.iconclear);
                case "sunny": return(this.gwin.iconsunny);
            }
        }
},

// load in all of the weather icons at startup time
loadInIcons: function()
{
    console.log('loadInIcons');
    var path = "./App/json/weather/icons/";
    var self = this;

    this.gwin.iconmostlycloudynight.src     = path+"mostlycloudy-night.jpg";
    this.gwin.iconmostlycloudynight.onload  = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconpartlycloudynight.src     = path+"partlycloudy-night.jpg";
    this.gwin.iconpartlycloudynight.onload  = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconclearnight.src            = path+"clear-night.jpg";
    this.gwin.iconclearnight.onload         = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconsnownight.src             = path+"snow-night.jpg";
    this.gwin.iconsnownight.onload          = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconstormsnight.src           = path+"storms-night.jpg";
    this.gwin.iconstormsnight.onload        = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconcloudynight.src           = path+"cloudy-night.jpg";
    this.gwin.iconcloudynight.onload        = function(){self.gwin.numIconsLoaded++};


    this.gwin.iconsnow.src          = path+"snow.jpg";
    this.gwin.iconsnow.onload       = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconunknown.src       = path+"unknown.jpg";
    this.gwin.iconunknown.onload    = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconstorms.src        = path+"storms.jpg";
    this.gwin.iconstorms.onload     = function(){self.gwin.numIconsLoaded++};
    this.gwin.icontstorms.src       = path+"tstorms.jpg";
    this.gwin.icontstorms.onload    = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconmostlycloudy.src  = path+"mostlycloudy.jpg";
    this.gwin.iconmostlycloudy.onload = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconpartlycloudy.src  = path+"partlycloudy.jpg";
    this.gwin.iconpartlycloudy.onload = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconrain.src          = path+"rain.jpg";
    this.gwin.iconrain.onload       = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconfog.src           = path+"fog.jpg";
    this.gwin.iconfog.onload        = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconhazy.src          = path+"hazy.jpg";
    this.gwin.iconhazy.onload       = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconsleet.src         = path+"sleet.jpg";
    this.gwin.iconsleet.onload      = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconcloudy.src        = path+"cloudy.jpg";
    this.gwin.iconcloudy.onload     = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconclear.src         = path+"clear.jpg";
    this.gwin.iconclear.onload      = function(){self.gwin.numIconsLoaded++};
    this.gwin.iconsunny.src         = path+"sunny.jpg";
    this.gwin.iconsunny.onload      = function(){self.gwin.numIconsLoaded++};
},
////////////////////////////////////////

init: function (newMode,whereToRender){

    this.makeCallbackFunc = this.makeCallback.bind(this);
    //this.jsonCallbackFunc = this.jsonCallback.bind(this);

    this.gwin.mode = newMode;

    this.gwin.appID = "A"+this.myTag; // search string cant start with #
 
    this.loadInIcons();
},

});

    var map = null;
    var map1 = null;
    var map2 = null;
    var map3 = null;
    var map3Counter = 1;
    var map4Counter = 2;
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
        else if (whichMap == 4) {
                map4Counter = map4Counter + 1;
                console.log('map4Counter' + map4Counter);
                if (map4Counter%2==0 )
                {

                    divvyCalendarLineLayer();  
                    drawTrips();

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
                    divvyCalendarLineLayer(); 
                    drawTrips();
                    usWeatherApp.updateOutsideTemp();
                }
        }
    }   

    function drawTrips(){
            //L.geoJson().addTo(map);
            //map.removeLayer(polyline);
            //var userSelectedTime = document.getElementById("TimeControl").value;
            var TimePickerValue =document.getElementById("TimeControl").value;
            //= '07/12/2013 18:00';
            var DayToRun =  TimePickerValue.substring(0,TimePickerValue.length-6);
                //TimePickerValue = new Date(TimePickerValue);

            console.log('DayToRun'  + DayToRun);
            var AtTimeRun = new Date(TimePickerValue).getHours();

            if (AtTimeRun.length <2){
                AtTimeRun = "0"+ AtTimeRun;
            }
                
            console.log(AtTimeRun );
            console.log('drawTrips -->');


            var parseDate = ((DayToRun.substring(0,DayToRun.length-8)).length = 2 ? (DayToRun.substring(0,DayToRun.length-8)) 
                                                                  : '0' + (DayToRun.substring(0,DayToRun.length-8)) )
                            + '_' 
                            + DayToRun.substring(DayToRun.length-7,DayToRun.length-5) 
                            + '_'
                            +DayToRun.substring(DayToRun.length-4,DayToRun.length);
            


            var csvFile = "./App/json/Map/trips_data_by_"+ parseDate + ".csv";

            console.log('parseDate' + parseDate);

            var time;
            var filteredtime ;
            d3.csv(csvFile,function(unFilterData){

                console.log('Inside csv file');
                // Filtering data for a particular time
                var data = unFilterData.filter(function(d,i){

                    time = new Date(d.starttime).getHours();
                    if (time.length <2){
                        time = "0" + time;
                    }
                    if (AtTimeRun==time)
                    {
                        return d;
                    }

                });                    
            var selected = [];
            var firstSelected = [];

            var e1 = document.getElementById("Chicago_Data");
            var e2 = e1.options[e1.selectedIndex].text;
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


           // console.log(selected[0][1]);
            
            var fromHash = {},
            toData = {},
            to_station_name,
            value =[];

            var j= 1;
            //console.log("before hashmap");
            console.log('dataLength : ' + data.length);
            console.log('getCommunityArea' + getCommunityArea.features.length);

            if (e2 =="Communities"){
                //map.removeLayer(polyline);
                // console.log('XXXXXX' + e2);
                for (var i = 0; i< selected.length; i ++){
                        for (var h =0; h < getCommunityArea.features.length;h++){
                    //console.log('fsad;fasd;fhas;hf;ashdf;asdhfkajs' + getCommunityArea.features[h].properties.name + 'ssellected'+ selected[i]);

                            if(getCommunityArea.features[h].properties.name === selected[i]){
                               //console.log('X'  + getCommunityArea.features[h]);
                               L.geoJson(getCommunityArea.features[h]).addTo(map);
                            }
                            console.log('After');
                        }
                    for (var j = 0 ; j <data.length; j++){
                    //console.log('from_station_name');
                        //console.log('conss ' + fromHash[selected[j]]);
                        if (data[j]['from_community'] == selected[i]){
                            //console.log('from_community');
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
                                        color: 'blue',
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
                for (var i = 0; i< selected.length; i ++){
                    
                    for (var j = 0 ; j <data.length; j++){
                    //console.log('from_station_name');
                        //console.log('conss ' + fromHash[selected[j]]);
                        if (data[j]['from_station_name'] == selected[i]){
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
                                        weight: 5,
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
    function divvyCalendarLineLayer(){
        map.addLayer(map3);

        dealWithData();

        function dealWithData()
        {       
            console.log("inside dealWithData");
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
                            var redcolor = "blue";
                            var greencolor = "green";
                            var colorValue;
                            for(var i=0;i<selected.length;i++){

                                    if(e2 == "Communities"){
                                        d3.csv("./App/Map/stationCommunity.csv",function(data){
                                            for (var kk=0;kk<data.length;kk++){
                                                if((data[kk].Community == selected[i]) && data[kk].StationName == d.stationName){
                                                    return redcolor;
                                                }

                                            }
                                        });
                                    }
                                    else if(e2 == "Stations"){
                                        if (selected[i]===d.stationName){
                                            return redcolor; 
                                        }
                                    }
                            }
                           // return greencolor;
                    })
                    .attr("r", 10)
                  /*  .on("click",function(){
                        circleCounter = circleCounter + 1;
                        console.log("circleCounter" + circleCounter);
                        if(circleCounter%2!=0){
                           d3.select(this).attr("class", "selected")
                           .style("fill","red"); 
                        }
                        else{
                            d3.select(this).attr("class", "unselected")
                            .style("fill","green"); 
                        }
                        
                    })
                    */
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
                    .style("font-weight","bold")
                    .text(function (d)
                        {   
                           // console.log( "station "+ d.stationName + "selected stations"  + selected[i]);
                                for(var i=0;i<selected.length;i++){
                                    if (selected[i]===d.stationName){
                                        if(e2 == "Communities"){
                                            if (selected[i]==d.from_community_name){
                                                return d.stationName; 
                                            }
                                        }
                                        else if(e2 == "Stations"){
                                            return d.stationName; 
                                        }
                                    }
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


    map = L.map('map', {layers: [map1,map2,map3], zoomControl: true}).setView([41.869910, -87.65], 16);
    /* Initialize the SVG layer */
    map._initPathRoot();  

    /* We simply pick up the SVG from the map object */
    svg = d3.select(map.getPanes().overlayPane).select("svg");

    var g = svg.append("g");

    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

    var today = new Date();
    var circleCounter = 0;

    var bigCollection = {};