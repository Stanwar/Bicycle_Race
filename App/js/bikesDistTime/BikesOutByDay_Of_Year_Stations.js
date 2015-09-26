var Bikes_DayOfYear_Chicago = Class.extend({

	construct: function() {
		this.areaMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.areaCanvasWidth = 1900;
		this.areaCanvasHeight = 200;

		this.areaWidth = 0;
		this.areaHeight = 0;
		
		this.svgarea1 = null;
		
		this.myTag = "";
		this.communityArea = "";
		this.station = "";
	},
	/////////////////////////////////////////////////////////////

	//Begin the application with a specific community instead of the default Chicago.
	initAppWithCommunityAndStation: function(community,station)
	{
		this.communityArea = community;
		this.station = station;
	},

	/////////////////////////////////////////////////////////////

	startup: function (whereToRender)
	{
		this.myTag = whereToRender;
		this.updateScreen();
	},
	/////////////////////////////////////////////////////////////

	/////////////////////////////////////////////////////////////

	showCommunityList: function(){
        
        d3.json("json/bikesDistTime/Communities.json",function(json){
            //populate dropdown
            var community = d3.select("#communitySelection");
            community.selectAll("option")
                .data(json)
                .enter()
                .append("option")
                .attr("value",function(data){
                        return data.name;
                })
                .text(function(data,index){ 
                    return data.name;
                   
                });
        });
    },

    showStationsList: function(){
        
        d3.json("json/bikesDistTime/stations_final.json",function(json){
            //populate dropdown
            var station = d3.select("#stationSelection");
            station.selectAll("option")
                .data(json)
                .enter()
                .append("option")
                .attr("value",function(data){
                        return data.stationName;
                })
                .text(function(data,index){
                    return data.stationName;
                });
        });
    },

     setCommunityArea: function(element){
        this.communityArea = element.value;

        this.myTag = "#areaChart1";
		this.updateData();

    },

    setStation: function(element){
        this.station = element.value;

        this.myTag = "#areaChart1";
		this.updateData();

    },
	/////////////////////////////////////////////////////////////

	//Drawing the bar chart for Origin distribution for the first visualization group.	
	drawAreaChart: function (error, data)
	{
		var width = this.areaCanvasWidth;
		var height = this.areaCanvasHeight;
		var svg = this.svgarea1;
		var community = this.communityArea;
		var station = this.station;
		var parseDate = d3.time.format("%Y-%m-%d").parse;
		svg.selectAll("*").remove();
		
		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
		
		var line = d3.svg.line()
			    .x(function(d) { return x(d.STARTDATE); })
			    .y(function(d) { return y(d.TOTAL_BIKES); });

		 data.forEach(function(d) {
			    d.STARTDATE = parseDate(d.STARTDATE);
			    d.TOTAL_BIKES = +d.TOTAL_BIKES;
			  });
		 
		
		  
		 x.domain(d3.extent(data, function(d) { return d.STARTDATE; }));
  		 y.domain(d3.extent(data.filter(function(d){
				return d.COMMUNITY === community && d.STATION_NAME === station;
			}), function(d) { return d.TOTAL_BIKES; }));
		

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
		
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Active Bikes");

		svg.append("path")
			.datum(data.filter(function(d){
				return d.COMMUNITY === community && d.STATION_NAME === station;
			}))
      		.attr("class", "line")
      		.attr("d", line);
      		
		
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-200)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Bikes Distribution by Day of Year");
	},


	updateWindow: function ()
	{
		var xWin, yWin;
		
		xWin = d3.select(this.myTag).style("width");
		yWin = d3.select(this.myTag).style("height");

		this.areaWidth = xWin;
		this.areaHeight = yWin;
		
		var totalAreaSizeX = this.areaCanvasWidth+this.areaMargin.left+this.areaMargin.right;
		var totalAreaSizeY = this.areaCanvasHeight+this.areaMargin.top+this.areaMargin.bottom;

		this.svgarea1 = d3.select(this.myTag).append("svg:svg")
				.attr("width", this.areaWidth)
				.attr("height", this.areaHeight)
				.attr("viewBox", "" + -this.areaMargin.left + " 0 " + totalAreaSizeX + " " + this.areaCanvasHeight);
	},

	/////////////////////////////////////////////////////////////

	updateData: function (){	
		var fileToLoad = "App/JsonData/Bikes_Year_Stations.json";
		this.inDataCallbackFunc = this.drawAreaChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	}
});