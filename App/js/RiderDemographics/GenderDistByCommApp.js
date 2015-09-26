var GenderDistByCommApp = Class.extend({

	construct: function() {
		//this.community = "Near North Side";
		
		this.community = null;
		
		this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
		this.barCanvasWidth = 1900;
		this.barCanvasHeight = 150;

		this.barWidth = 0;
		this.barHeight = 0;
		
		this.svgBar = null;
		
		this.myTag = "";
	},

	/////////////////////////////////////////////////////////////
	//Begin the application with a specific community instead of the default Chicago.
	initAppWithCommunity: function(community)
	{
		this.community = community;
	},

	/////////////////////////////////////////////////////////////

	startup: function (whereToRender)
	{
		this.myTag = whereToRender;
		this.updateScreen();
	},
	//Code Added by Theja to get Drop down values
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

	/////////////////////////////////////////////////////////////

	//Drawing the bar chart for Origin distribution for the first visualization group.	
	drawBarChart: function (error, data)
	{
		var width = this.barCanvasWidth;
		var height = this.barCanvasHeight;
		var community = this.community;
		var svg = this.svgBar;
		
		svg.selectAll("*").remove();
				
		var x0 = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1);

		var x1 = d3.scale.ordinal();		
		
		var y = d3.scale.linear()
				.range([height, 0]);
				
		var color = d3.scale.ordinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);		
			
		var xAxis = d3.svg.axis()
			.scale(x0)
			.orient("bottom");
		
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.tickFormat(d3.format(".2s"));
				
		var genderNames = d3.keys(data[0]).filter(function(key) { 
			return key === "MALE" || key === "FEMALE";
		});
				
		data.forEach(function(d) {
			d.genders = genderNames.map(function(name) { 
				return {
					name: name, value: +d[name]
				}; 
			});
		});
				
		x0.domain(data.map(function(d) { 
			return d.AGE_INTERVAL; 
		}));
		x1.domain(genderNames).rangeRoundBands([0, x0.rangeBand()]);
		//y.domain([0, d3.max(Map, function(d) {
		//	return d3.max(d.genders, function(d) { 
		//		return d.value; 
		//}); })]);
		
		y.domain([0, d3.max(
			data.filter(function(d){return d.COMMUNITY === community;}), 
			function(d) { 
				return d3.max(d.genders, function(d) { 
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
			.text("Population");
				
		var age_interval = svg.selectAll(".age_interval")
			.data(data.filter(function(d){
				return d.COMMUNITY === community;
			}))
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) { 
				return "translate(" + x0(d.AGE_INTERVAL) + ",0)"; 
			})
			
		age_interval.selectAll("rect")
			.data(function(d) { return d.genders; })
			.enter().append("rect")
			.attr("width", x1.rangeBand())
			.attr("x", function(d) { 
				return x1(d.name); 
			})
			.attr("y", function(d) {
				return y(d.value); 
			})
			.attr("height", function(d) { 
				return height - y(d.value); 
			})
			.style("fill", function(d) { 
				return color(d.name); 
			});				

		var legend = svg.selectAll(".legend")
			.data(genderNames.slice().reverse())
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
			.data(data.filter(function(d){
				return d.COMMUNITY === community;
			}))
		   .enter()
		   .append("text")
		   .attr("x", width/2)
		   .attr("y", height-200)
		   .attr("text-anchor","middle")
		   .attr("font-family", "sans-serif")
		   .attr("font-size","20pt")
		   .text("Population By Gender Bar Chart");
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
		var fileToLoad = "json/RiderDemographics/population_by_gender__age_community_2.php";
		this.inDataCallbackFunc = this.drawBarChart.bind(this);
		d3.json(fileToLoad, this.inDataCallbackFunc);
	},

	/////////////////////////////////////////////////////////////

	updateScreen: function (){
		this.updateWindow();
		this.updateData();
	},

	/////////////////////////////////////////////////////////////
	
	setCommunity: function(community){
		this.community = community.value;
		this.myTag = "#barchart";
		this.updateData();
	},
});
