var CalendarControlApp = Class.extend({

    construct: function () {
        this.barMargin = {top: 20, right: 20, bottom: 70, left: 120};
        this.barCanvasWidth = 790;
        this.barCanvasHeight = 410;

        this.barWidth = 0;
        this.barHeight = 0;

        this.svgBar1 = null;
        this.svgBar2 = null;

        this.myTag = "";

	this.stationArray = [];
        this.dateAsString = '';

	this.filter = {};
	this.filter.gender = "";
	this.filter.members = "";
	this.filter.age = "";
	
    },


    /////////////////////////////////////////////////////////////

    startup: function (whereToRender) {
        this.myTag = whereToRender;
        this.updateScreen();
    },

    /////////////////////////////////////////////////////////////

    initAppWithTickerAndStations: function (stations,ticker){
	this.stationArray = stations;
	this.dateAsString = ticker;
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.
    drawBarChart1: function (error, data) {
        var top = this.barMargin.top,
            bottom = this.barMargin.bottom,
            left = this.barMargin.left,
            right = this.barMargin.right;
        var width = this.barCanvasWidth - left - right;
        var height = this.barCanvasHeight - top - bottom;
        var date = this.dateAsString;
        var dataCount = new Array(24);
	var ticker = this.dateAsString.split(" ")[1];

        var graph = this.svgBar1;

        graph.selectAll("*").remove();
	
	for(var i = 0; i < 24; i++){
		dataCount[i] = 0;
	}
     	data.forEach(function (d) {
		d.starttime = new Date(d.starttime);
		dataCount[ d.starttime.getHours() ] += 1;
	});

        var x = d3.scale.linear().domain([0, dataCount.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, 140+d3.max(dataCount)])
            .range([height, 0]);
        var color = d3.scale.ordinal()
            .range(["#98abc5"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));
        xAxis.tickSize(-height).tickSubdivide(true);
        var line = d3.svg.line()
            .x(function (d, i) {
                return x(i);
            })
            .y(function (d) {

                return y(d);
            });

        graph
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + right + "," + top + ")");
        xAxis.ticks(23);


        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 35)
            .attr("x", width / 2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Time Interval");

	graph.selectAll("label")
	     .data(dataCount.filter(function(d,i){
	           return i === (+ticker);
	      }))
	     .enter()
   	     .append("text")
	     .text(function(d){
	          return d;
	     })
	     .attr("x", function(d){
		return x(ticker);
		})
	     .attr("y", function(d){
		return y(d) ;
		})
	     .style("font-size", "120%")
             .style("font-color", "steelblue");

        graph.append("svg:g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("#Active Bikes");

        graph.append("svg:path").attr("d", line(dataCount));

	graph.selectAll(".chart-title")
		.data(data)
	   .enter()
	   .append("text")
	   .attr("x", width/2)
	   .attr("y", height-295)
	   .attr("text-anchor","middle")
	   .attr("font-family", "sans-serif")
	   .attr("font-size","85%")
	   .text("Overall Active Rides Line Chart");

    },

    /////////////////////////////////////////////////////////////

    
    drawBarChart2: function (error, data) {
       var top = this.barMargin.top,
            bottom = this.barMargin.bottom,
            left = this.barMargin.left,
            right = this.barMargin.right;
        var width = this.barCanvasWidth - left - right;
        var height = this.barCanvasHeight - top - bottom;
        var date = this.dateAsString;
 	var dataCount = new Array(24);    
	var ticker = this.dateAsString.split(" ")[1];
	var Stations = this.stationArray;
        var graph = this.svgBar2;
	var sum = 0;

	var gender = this.filter.gender;
	var members = this.filter.members;
	var age = this.filter.age;

        graph.selectAll("*").remove();
	

	for(var i = 0; i < 24; i++){
		dataCount[i] = {};
	}

	for(var i = 0; i < 24; i++){
		for(var j = 0; j < Stations.length; j++){
			dataCount[i].intervals = i;
			dataCount[i][Stations[j]] = 0;
		}
	}

        Stations.forEach(function(s,i){
        	data
			.filter(function(d){
				if(gender !== "") {
					if(gender === "All") return true;
					else return d.gender === gender;
				}
				else if(age !== ""){
					if(age === "All") return true;
					else if(d.birthday === null || d.birthday === "" || d.birthday === "null") return false;
					 
					else {
						var lower = (+age.split("_")[0]);
						var upper = (+age.split("_")[1]);
						return (lower <= (2013 - d.birthday) && (2013 - d.birthday) <= upper);
					}
				}
				else if(members !== ""){
					if(members === "All") return true;
					else return d.usertype === members;
				}
				else{
					return true;
				}
			})
			.forEach(function (d) {
           		d.starttime = new Date(d.starttime);
			if(d.from_station_name === s){
				dataCount[ d.starttime.getHours() ].intervals = d.starttime.getHours();
				dataCount[ d.starttime.getHours() ][Stations[i]] += 1;

			}
		 });
	});
        

	Stations.forEach(function(s,i){
        	dataCount.forEach(function (d) {
           		d.intervals = +d.intervals;
			d[Stations[i]] = +d[Stations[i]];
		 });
	});

        var x = d3.scale.linear().domain([0, dataCount.length]).range([0, width]);

	sum = 0;

	Stations.forEach(function(s){
		dataCount.forEach(function (d) {
			sum = sum + d[s];
		 });
	});

        var y = d3.scale.linear().domain([0, 120+sum])
        .range([height, 0]);

        var color = d3.scale.ordinal()
            .range(["#98abc5"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));
        xAxis.tickSize(-height).tickSubdivide(true);
        
	var line = d3.svg.line()
            .x(
		function (d) {
			return x(+d.intervals);
            	}
	    )
            .y(
		function (d) {
			sum = 0;

			Stations.forEach(function(s){
				sum = sum + (+d[s]);
			});
			return y(sum);
            	}
	    );

        graph
            .attr("width", width)
            .attr("height", height)
            .append("svg:g")
            .attr("transform", "translate(" + right + "," + top + ")");
        xAxis.ticks(23);


        graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 35)
            .attr("x", width / 2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Time Interval");

	graph.selectAll("text.label")
	     .data(dataCount.filter(function(d){
	           return d.intervals === (+ticker);
	      }))
	     .enter()
   	     .append("text")
	     .text(function(d){
                  sum = 0;
	          Stations.forEach(function(s){
		      sum += d[s];
                  });
		  return sum;
               })
	     .attr("x", function(d){
		return x(ticker);
		})
	     .attr("y", function(d){
		return y(sum) ;
		})
	     .style("font-size", "120%")
             .style("font-color", "steelblue");

        graph.append("svg:g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("#Active Bikes");

        graph.append("svg:path").attr("d", line(dataCount));

	graph.selectAll(".chart-title")
		.data(data.filter(function(d){
				if(gender !== "") {
					if(gender === "All") return true;
					else return d.gender === gender;
				}
				else if(age !== ""){
					if(age === "All") return true;
					else if(d.birthday === null || d.birthday === "" || d.birthday === "null") return false;
					 
					else {
						var lower = (+age.split("_")[0]);
						var upper = (+age.split("_")[1]);
						return (lower <= (2013 - (+d.birthday)) && (2013 - (+d.birthday)) <= upper);
					}
				}
				else if(members !== ""){
					if(members === "All") return true;
					else return d.usertype === members;
				}
				else{
					return true;
				}
			}))
	   .enter()
	   .append("text")
	   .attr("x", width/2)
	   .attr("y", height-295)
	   .attr("text-anchor","middle")
	   .attr("font-family", "sans-serif")
	   .attr("font-size","85%")
	   .text("Stations Active Rides Line Chart");
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function () {
        var xWin, yWin;

        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;

        var totalBarSizeX = this.barCanvasWidth + this.barMargin.left + this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight + this.barMargin.top + this.barMargin.bottom;

        switch (this.myTag) {
            case "#Vis1":
                this.svgBar1 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#Vis2":
                this.svgBar2 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateData: function () {
	var unformattedDate = this.dateAsString.split(" ");
	var date = new Date(unformattedDate[0]);
        var fileToLoad = "App/json/Map/trips_by_day/trips_data_by_day_" + this.monthFormated(date) + "_" + this.dayFormated(date) + "_" + date.getFullYear() + ".csv";
        switch (this.myTag) {
            case "#Vis1":
                this.inDataCallbackFunc = this.drawBarChart1.bind(this);
                d3.csv(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#Vis2":
                this.inDataCallbackFunc = this.drawBarChart2.bind(this);
                d3.csv(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function () {
        this.updateWindow();
        this.updateData();
    },

    setDateAndTime: function (DateString) {
        this.dateAsString = DateString;

        this.myTag = "#Vis1";
        this.updateData();

        this.myTag = "#Vis2";
        this.updateData();
    },

    updateStation: function (element) {
	var index = element.selectedIndex;
        var selectedItems = element.selectedOptions.valueOf(0);
        for(var index = 0; index < selectedItems.length; index++){
		this.stationArray.push(selectedItems[index].value);
        }
    },

    monthFormated: function(date){
	month = date.getMonth();
        return month < 10 ? "0" + (month+1) : month+1;
    },

    dayFormated: function(date){
	day = date.getDate();
        return day < 10 ? "0" + (day) : day;
    },

    setGenderFilter: function(element){
	this.filter.gender = element;
	this.filter.age = "";
	this.filter.members = "";
	this.updateData();
    },

    setMemberFilter: function(element){
	this.filter.gender = "";
	this.filter.age = "";
	this.filter.members = element;
	this.updateData();
    },

    setAgeFilter: function(element){
	this.filter.gender = "";
	this.filter.age = element;
	this.filter.members = "";
	this.updateData();
    },
   /* convertToDate: function (dateTime,number){
	var year = dateTime.getFullYear();
	var month = dateTime.getMonth();
	var day = dateTime.getDate();
	var date = new Date(year,month,day,number,0,0);
 	return date;
    },*/

    calculateAge: function(birthday) { 
	return 2013 - parseInt(birthday);
    }

});
