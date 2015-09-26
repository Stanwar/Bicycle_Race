var Bikes_DayOfYear = Class.extend({

	construct: function() {
		this.areaMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.areaCanvasWidth = 1500;
		this.areaCanvasHeight = 400;

		this.areaWidth = 0;
		this.areaHeight = 0;
		
		this.svgarea1 = null;
		
		this.myTag = "";
	},

	/////////////////////////////////////////////////////////////

	startup: function (whereToRender)
	{
		this.myTag = whereToRender;
		this.updateScreen();
	},

	/////////////////////////////////////////////////////////////

	//Drawing the bar chart for Origin distribution for the first visualization group.	
	drawAreaChart: function (error, data)
	{
		var width = this.areaCanvasWidth;
		var height = this.areaCanvasHeight;
		var svg = this.svgarea1;
		//var parseDate = d3.time.format("%d/%m/%Y").parse;
		svg.selectAll("*").remove();
		
		/*var x = d3.time.scale()
    		.domain([new Date(Map[0].date), d3.time.day.offset(new Date(Map[Map.length - 1].date), 1)])
    		.rangeRound([0, width - margin.left - margin.right]);*/

		var x = d3.scale.ordinal()
            .domain([178,365])
           .rangeRoundBands([0, width]);
		//d3.time.scale().range([0, width]);
		var y = d3.scale.linear()
			.range([height, 0]);
		
		var color = d3.scale.ordinal()
			.range(["#98abc5"]);

        var days = [ 190,220, 250,280,310,340,365];

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");


        xAxis
            .tickValues(days)
           // .tickValues(["July 1","Aug 15","Sept 15","Oct 15", "Nov 15","Dec 31"])
        ;

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));
		
		
		
		color.domain(d3.keys(data[0])
			.filter(function(key) {return key === "No_Of_Bikes"}));		 
			
		data.forEach(function(d) {
			//d.date = parseDate(d.date);
			d.No_Of_Bikes = +d.No_Of_Bikes;
           // d.Day_of_Year = new Date(+d.Day_of_Year);
		});
		 
		//x.domain(d3.extent(Map,function(d) { return d.date; }));
		x.domain(data.map(function(d) { return +d.Day_of_Year; }));
		y.domain([0, d3.max(data, function(d) { return d.No_Of_Bikes; })]);
		//y.domain(d3.extent(Map, function(d) { return d.close; }));
		var area = d3.svg.area()
    		.x(function(d) { return x( +d.Day_of_Year); })
    		.y0(height)
    		.y1(function(d) { return y(d.No_Of_Bikes); });
		

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
            /*.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)"
            })*/

        ;
		/*.append("text")
		.selectAll("text")
			.style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)")
		//.attr("y", 50)
		//.attr("x", width/2)
		.text("Day of Year");*/
		 
		svg.append("path")
      		.datum(data)
      		.attr("class", "area")
      		.style("fill", "steelblue")
      		.attr("d", area);

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Active Bikes");
		
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-600)
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
		var fileToLoad = "App/json/bikesDistTime/Bikes_DayOfYear_Chicago.json";
		this.inDataCallbackFunc = this.drawAreaChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	}
});