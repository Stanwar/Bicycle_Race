var MembersDistApp = Class.extend({

	construct: function() {
		this.pieMargin = {top: 500, right: 20, bottom: 40, left: 750};
		this.pieCanvasWidth = 1000;
		this.pieCanvasHeight = 125;
		
		this.pieWidth;
		this.pieHeight;
		
		this.svgPie = null;
		this.myTag = "";
	},

	/////////////////////////////////////////////////////////////

	startup: function (whereToRender)
	{
		this.myTag = whereToRender;
		this.updateScreen();
	},

	/////////////////////////////////////////////////////////////

	drawPieChart: function (error, data)
	{	
		var width = 700;
		var height = 600;
		var svg = this.svgPie;		
		var radius = Math.min(width, height) / 2;

		svg.selectAll("*").remove();	
		var color = d3.scale.ordinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		var arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.POPULATION; });

		data.forEach(function(d) {
			d.POPULATION = +d.POPULATION;
		});

		svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height / 1.5) + ")");

		var g = svg.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

		g.append("path")
		  .attr("d", arc)
		  .style("fill", function(d) { return color(d.data.MEMBER_TYPE); });
		
		g.append("text")
		  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		  .attr("dy", ".35em")
		  .attr("font-family", "sans-serif")
		  .style("text-anchor", "middle")
		  .text(function(d) { return d.data.MEMBER_TYPE + " = " + d.data.POPULATION; });
	  
		svg.selectAll(".chart-title")
		   .data(data)
		   .enter()
		   .append("text")
		   .attr("x", (width/2-335))
		   .attr("y", 0 - (height/2))
		   .attr("font-family", "sans-serif")
		   .attr("text-anchor","middle")
		   .attr('font-size','20pt')
		   .text("Members Distribution");
	},
	
	/////////////////////////////////////////////////////////////

	updateWindow: function ()
	{
		var xWin, yWin;
		
		xWin = d3.select(this.myTag).style("width");
		yWin = d3.select(this.myTag).style("height");

		this.pieWidth = xWin;
		this.pieHeight = yWin;
		
		var totalPieSizeX = this.pieCanvasWidth+this.pieMargin.left+this.pieMargin.right;
		var totalPieSizeY = this.pieCanvasHeight+this.pieMargin.top+this.pieMargin.bottom;

		this.svgPie = d3.select(this.myTag).append("svg:svg")
		.attr("width", this.pieWidth)
		.attr("height", this.pieHeight)
		.attr("viewBox", "" + -this.pieMargin.left + " 0 " + totalPieSizeX + " " + this.pieCanvasHeight);
	},

	/////////////////////////////////////////////////////////////

	updateData: function (){	
		var fileToLoad = "App/json/RiderDemographics/population_by_usertype.json";
		this.inDataCallbackFunc = this.drawPieChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
	  this.updateWindow();
	  this.updateData();
	}
});