var BikeDistApp = Class.extend({

    construct: function() {
        this.scatterMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.scatterCanvasWidth = 1500;
        this.scatterCanvasHeight = 400;

        this.scatterWidth = 0;
        this.scatterHeight = 0;
        
        this.svgScatter = null;
        
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
            .filter(function(key) {return key == "TOTAL_BIKES"}));       
            
        data.forEach(function(d) {
            d.DIST_METERS = +d.DIST_METERS;
            d.TOTAL_BIKES = +d.TOTAL_BIKES;
        });
         
        x.domain(data.map(function(d) { return d.DIST_METERS; }));
        y.domain([0, d3.max(data, function(d) { return d.TOTAL_BIKES; })]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 50)
        .attr("x", width/2)
        .attr("dx", ".71em")
        .style("text-anchor", "middle")
        .text("Distance Interval");
         
        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Total Bikes");
         
        svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return x(d.DIST_METERS); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.TOTAL_BIKES); })
            .attr("height", function(d) { return height - y(d.TOTAL_BIKES); });

        svg.selectAll("text.label")
            .data(data)
            .enter().append("text")
            .text(function(d) {
                return d.TOTAL_BIKES;
            })
            .attr("x", function(d, index) {
                return (x(d.DIST_METERS) + (x.rangeBand()/2)) - 20;
            })
            .attr("y", function(d) {
                return y(d.TOTAL_BIKES);
            })
            .style("font-size","120%");
        
        svg.selectAll(".chart-title")
            .data(data)
           .enter()
           .append("text")
           .attr("x", width/2)
           .attr("y", height-600)
           .attr("text-anchor","middle")
           .attr("font-family", "sans-serif")
           .attr("font-size","20pt")
           .text("Bike Dist. By Distance Bar Chart");
    },
    
    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.  
    drawScatterChart: function (error, data)
    {
        var width = this.scatterCanvasWidth;
        var height = this.scatterCanvasHeight;
        var padding = 30;
        var svg = this.svgScatter;
        
        svg.selectAll("*").remove();
                
        //Create scale functions
        var xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.BIKEID; })])
            .range([padding, width - padding * 2]);
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d3.round(d.DIST_METERS/1000,0); })])
            .range([height - padding, padding]);

        var rScale = d3.scale.linear()
             .domain([0, d3.max(data, function(d) { return d3.round(d.DIST_METERS/1000,0); })])
             .range([2, 5]);

        //Define X axis
        var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

        //Define Y axis
        var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

        //Create circles
        svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("cx", function(d) {
                return xScale(d.BIKEID);
           })
           .attr("cy", function(d) {
                return yScale(d3.round(d.DIST_METERS/1000,0));
           })
           .attr("r", function(d) {
                return rScale(d3.round(d.DIST_METERS/1000,0));
           });

        //Create labels
        svg.selectAll("text")
           .data(data)
           .enter()
           .append("text")
           .text(function(d) {
                return d.BIKEID;
           })
           .attr("x", function(d) {
                return xScale(d.BIKEID);
           })
           .attr("y", function(d) {
                return yScale(d3.round(d.DIST_METERS/1000,0));
           })
           .attr("font-family", "sans-serif")
           .attr("font-size", "11px")
           .attr("fill", "red");
        
        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);
        
        //Create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
    },

    /////////////////////////////////////////////////////////////

    updateWindow: function ()
    {
        var xWin, yWin;
        
        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        var totalScatterSizeX = this.scatterCanvasWidth+this.scatterMargin.left+this.scatterMargin.right;
        var totalScatterSizeY = this.scatterCanvasHeight+this.scatterMargin.top+this.scatterMargin.bottom;
                
        var totalBarSizeX = this.barCanvasWidth+this.barMargin.left+this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight+this.barMargin.top+this.barMargin.bottom;

        switch(this.myTag){
            case "#Bikebarchart":
                this.barWidth = xWin;
                this.barHeight = yWin;
                
                this.svgBar = d3.select(this.myTag).append("svg:svg")
                .attr("width", this.barWidth)
                .attr("height", this.barHeight)
                .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
            break;
            case "#Bikescatterchart":
                this.scatterWidth = xWin;
                this.scatterHeight = yWin;
                                
                this.svgScatter = d3.select(this.myTag).append("svg:svg")
                .attr("width", this.scatterWidth)
                .attr("height", this.scatterHeight)
                .attr("viewBox", "" + -this.scatterMargin.left + " 0 " + totalScatterSizeX + " " + this.scatterCanvasHeight);                               
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateData: function (){    
        switch(this.myTag){
            case "#Bikebarchart":
                var fileToLoad = "App/json/RideDist/bike_dist_by_distance.json";
                this.inDataCallbackFunc = this.drawBarChart.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#Bikescatterchart":
                var fileToLoad = "App/json/RideDist/bike_dist_by_distance_scatter.json";
                this.inDataCallbackFunc = this.drawScatterChart.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function (){
      this.updateWindow();
      this.updateData();
    }
});