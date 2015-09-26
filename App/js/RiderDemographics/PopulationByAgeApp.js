var PopulationByAgeApp = Class.extend({

	construct: function() {
		this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.barCanvasWidth = 800;
		this.barCanvasHeight = 300;

		this.barWidth = 0;
		this.barHeight = 0;
		
		this.svgBar = null;
		
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
	drawBarChart: function (error, data)
	{
		var width = this.barCanvasWidth;
		var height = this.barCanvasHeight;
		var svg = this.svgBar;
		
		svg.selectAll("*").remove();
				
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .5);
		var y = d3.scale.linear()
			.rangeRound([height, 0]);
		var color = d3.scale.ordinal()
			.range(["#98abc5"]);
		 
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));

		color.domain(d3.keys(data[0])
			.filter(function(key) {return key === "POPULATION"}));		 
			
		data.forEach(function(d) {
			d.AGE_INTERVAL = d.AGE_INTERVAL;
			d.POPULATION = +d.POPULATION;
		});
		 
		x.domain(

		data.sort(
			function(d1, d2)
			{ 
				return d3.ascending(+d1.AGE_INTERVAL.split(" - ")[0], +d2.AGE_INTERVAL.split(" - ")[1]); 
			})
		.map(function(d) { return d.AGE_INTERVAL; }));
		y.domain([0, d3.max(data, function(d) { return d.POPULATION; })]);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", 50)
		.attr("x", width/2)
		.attr("dx", ".71em")
		.style("text-anchor", "middle")
		.text("Age Interval");
		 
		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Population");
		 
		svg.selectAll("bar")
			.data(
			data.sort(
				function(d1, d2)
				{ 
					return d3.ascending(+d1.AGE_INTERVAL.split(" - ")[0], +d2.AGE_INTERVAL.split(" - ")[1]); 
				}))
			.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function(d) { return x(d.AGE_INTERVAL); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.POPULATION); })
			.attr("height", function(d) { return height - y(d.POPULATION); });

		svg.selectAll("text.label")
			.data(data)
			.enter().append("text")
			.text(function(d) {
		        return d.POPULATION;
		    })
		    .attr("x", function(d, index) {
		        return (x(d.AGE_INTERVAL) + (x.rangeBand()/2)) - 25;
		    })
		    .attr("y", function(d) {
		    	return y(d.POPULATION);
		    })
		    .style("font-size","80%");
		
		svg.selectAll(".chart-title")
			.data(data.sort(
			function(d1, d2)
			{ 
				return d3.ascending(+d1.AGE_INTERVAL.split(" - ")[0], +d2.AGE_INTERVAL.split(" - ")[1]); 
			}))
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-600)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Population by Age Bar Chart");
	},
	
	/////////////////////////////////////////////////////////////

	updateWindow: function ()
	{
		var xWin, yWin;
		
		xWin = d3.select(this.myTag).style("width");
		yWin = d3.select(this.myTag).style("height");

		this.barWidth = xWin;
		this.barHeight = yWin;
		
		var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
		var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;

		this.svgBar = d3.select(this.myTag).append("svg:svg")
		.attr("width", this.barWidth)
		.attr("height", this.barHeight)
		.attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
		
	},

	/////////////////////////////////////////////////////////////

	updateData: function (){	
		var fileToLoad = "App/json/RiderDemographics/population_by_age.json";
		this.inDataCallbackFunc = this.drawBarChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	}
});
