var MaxInboundOutboundFlowApp = Class.extend({

	construct: function() {
		this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.barCanvasWidth = 1500;
		this.barCanvasHeight = 400;

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
				
		var x0 = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1);

		var x1 = d3.scale.ordinal();		
		
		var y = d3.scale.linear()
				.range([height, 0]);
				
		var color = d3.scale.ordinal()
			.range(["#98abc5", "#8a89a6"]);

		var xAxis = d3.svg.axis()
			.scale(x0)
			.orient("bottom");
		
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));
				
		var flowNames = d3.keys(data[0]).filter(function(key) { 
			return key === "INBOUND" || key === "OUTBOUND";
		});
				
		data.forEach(function(d) {
			d.flows = flowNames.map(function(name) { 
				return {
					name: name, value: +d[name]
				}; 
			});
		});
				
		x0.domain(data.map(function(d) { 
			return d.TIME_INTERVAL; 
		}));
		x1.domain(flowNames).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, d3.max(data, function(d) { 
			return d3.max(d.flows, function(d) { 
				return d.value; 
		}); })]);
		
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
			.text("Number of Trips");
				
		var age_interval = svg.selectAll(".time_interval")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { 
				return "translate(" + x0(d.TIME_INTERVAL) + ",0)"; 
			})
			
		age_interval.selectAll("rect")
			.data(function(d) { return d.flows; })
			.enter().append("rect")
			.attr("width", x1.rangeBand())
			.attr("x", function(d) { 
				return x1(d.name); 
			})
			.attr("y", function(d) {
				return y(+d.value);
			})
			.attr("height", function(d) { 
				return height - y(+d.value);
			})
			.style("fill", function(d) { 
				return color(d.name); 
			});	

		svg.selectAll("text.label")
			.data(data)
			.enter()
			.append("text")
			.text(function(d) {
				return d.STATION;
		    })
		    .attr("text-anchor", "middle") 
			.attr("x", function(d, index) {
			return (x0(d.TIME_INTERVAL) + (x0.rangeBand()/2)) - 25;
		    })
		    .attr("y", function(d) {
		    	return y(Math.max(d.INBOUND, d.OUTBOUND) + 10);
		    })
		    .style("font-size","60%");

		var legend = svg.selectAll(".legend")
			.data(flowNames.slice().reverse())
			.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { 
				return "translate(0," + i * 20 + ")"; 
			});

		legend.append("rect")
		  .attr("x", width - 18)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

		legend.append("text")
		  .attr("x", width - 24)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "end")
		  .text(function(d) { 
			return d; 
		});
						
		svg.selectAll(".chart-title")
			.data(data)
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-600)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Inbound Outbound Imbalance Bar Chart");
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
		var fileToLoad = "App/json/InboundOutboundTrips/max_inbound_outbound_flow.json";
		this.inDataCallbackFunc = this.drawBarChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	},
});
