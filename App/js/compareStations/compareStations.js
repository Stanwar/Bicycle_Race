var Compare = Class.extend({

    construct: function () {

        this.station1 = "Dayton St & North Ave";
        this.station2 = "Dayton St & North Ave";

        this.barMargin = {top: 100, right: 20, bottom: 200, left: 110};
        this.barCanvasWidth = 1000;
        this.barCanvasHeight = 200;

        this.barWidth = 0;
        this.barHeight = 0;

        this.svgBar1 = null;
        this.svgBar2 = null;
        this.svgBar3 = null;
        this.svgBar4 = null;
        this.svgTable1 = null;
        this.svgTable2 = null;

        this.myTag = "";
    },

    //Begin the application with a specific community instead of the default Chicago.
    initAppWithStation1: function (station) {
        this.station1 = station;
    },

    initAppWithStation2: function (station) {
        this.station2 = station;
    },

    /////////////////////////////////////////////////////////////

    startup: function (whereToRender) {
        this.myTag = whereToRender;
        this.updateScreen();
    },

    //Code Added by Theja to get Drop down values
    showStationsList1: function () {

        d3.json("App/json/bikesDistTime/stations_final.json", function (json) {
            //populate dropdown
            var station = d3.select("#stationSelection1");
            station.selectAll("option")
                .data(json)
                .enter()
                .append("option")
                .attr("value", function (data) {
                    return data.stationName;
                })
                .text(function (data, index) {
                    return data.stationName;
                });
        });
    },

    showStationsList2: function () {

        d3.json("App/json/bikesDistTime/stations_final.json", function (json) {
            //populate dropdown
            var station = d3.select("#stationSelection2");
            station.selectAll("option")
                .data(json)
                .enter()
                .append("option")
                .attr("value", function (data) {
                    return data.stationName;
                })
                .text(function (data, index) {
                    return data.stationName;
                });
        });
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.
    drawBarChart1: function (error, data) {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var station = this.station1;

        var svg = this.svgBar1;

        svg.selectAll("*").remove();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
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
            .filter(function (key) {
                return key === "TOTAL_TRIPS"
            }));

        data.forEach(function (d) {
            d.DIST_METERS = +d.DIST_METERS;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });

        x.domain(data.map(function (d) {
            return d.DIST_METERS;
        }));
        //Modified Map to filtered Map - Theja
        y.domain([0, d3.max(data.filter(function (d) {
            return d.STATION_NAME === station;
        }), function (d) {
            return d.TOTAL_TRIPS;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 50)
            .attr("x", width / 2)
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
            .text("Total Trips");

        svg.selectAll("bar")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.DIST_METERS);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .attr("height", function (d) {
                return height - y(d.TOTAL_TRIPS);
            });

        svg.selectAll("text.label")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("text")
            .text(function (d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function (d, index) {
                return x(d.DIST_METERS) + (x.rangeBand() / 2 - 15);
            })
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size", "120%");

        svg.selectAll(".chart-title")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter()
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 200)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20pt")
            .text("Ride Dist. By Distance Bar Chart");
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the second visualization group.
    drawBarChart2: function (error, data) {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var station = this.station1;

        var svg = this.svgBar2;

        svg.selectAll("*").remove();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
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
            .filter(function (key) {
                return key == "TOTAL_TRIPS"
            }));

        data.forEach(function (d) {
            d.TRIP_DURATION = +d.TRIP_DURATION;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });

        x.domain(data.map(function (d) {
            return d.TRIP_DURATION;
        }));
        //Modified Map to filtered Map - Theja
        y.domain([0, d3.max(data.filter(function (d) {
            return d.STATION_NAME === station;
        }), function (d) {
            return d.TOTAL_TRIPS;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 50)
            .attr("x", width / 2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Time Interval");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Trips");

        svg.selectAll("bar")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.TRIP_DURATION);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .attr("height", function (d) {
                return height - y(d.TOTAL_TRIPS);
            });

        svg.selectAll("text.label")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("text")
            .text(function (d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function (d, index) {
                return x(d.TRIP_DURATION) + (x.rangeBand() / 2 - 15);
            })
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size", "120%");

        svg.selectAll(".chart-title")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter()
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 200)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20pt")
            .text("Ride Dist. By Time Bar Chart");
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the first visualization group.
    drawBarChart3: function (error, data) {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var station = this.station2;

        var svg = this.svgBar3;

        svg.selectAll("*").remove();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
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
            .filter(function (key) {
                return key === "TOTAL_TRIPS"
            }));

        data.forEach(function (d) {
            d.DIST_METERS = +d.DIST_METERS;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });

        x.domain(data.map(function (d) {
            return d.DIST_METERS;
        }));
        //Modified Map to filtered Map - Theja
        y.domain([0, d3.max(data.filter(function (d) {
            return d.STATION_NAME === station;
        }), function (d) {
            return d.TOTAL_TRIPS;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 50)
            .attr("x", width / 2)
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
            .text("Total Trips");

        svg.selectAll("bar")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.DIST_METERS);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .attr("height", function (d) {
                return height - y(d.TOTAL_TRIPS);
            });

        svg.selectAll("text.label")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("text")
            .text(function (d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function (d, index) {
                return x(d.DIST_METERS) + (x.rangeBand() / 2 - 15);
            })
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size", "120%");

        svg.selectAll(".chart-title")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter()
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 200)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20pt")
            .text("Ride Dist. By Distance Bar Chart");
    },

    /////////////////////////////////////////////////////////////

    //Drawing the bar chart for Origin distribution for the second visualization group.
    drawBarChart4: function (error, data) {
        var width = this.barCanvasWidth;
        var height = this.barCanvasHeight;
        var station = this.station2;

        var svg = this.svgBar4;

        svg.selectAll("*").remove();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
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
            .filter(function (key) {
                return key == "TOTAL_TRIPS"
            }));

        data.forEach(function (d) {
            d.TRIP_DURATION = +d.TRIP_DURATION;
            d.TOTAL_TRIPS = +d.TOTAL_TRIPS;
        });

        x.domain(data.map(function (d) {
            return d.TRIP_DURATION;
        }));
        //Modified Map to filtered Map - Theja
        y.domain([0, d3.max(data.filter(function (d) {
            return d.STATION_NAME === station;
        }), function (d) {
            return d.TOTAL_TRIPS;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 50)
            .attr("x", width / 2)
            .attr("dx", ".71em")
            .style("text-anchor", "middle")
            .text("Time Interval");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Trips");

        svg.selectAll("bar")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) {
                return x(d.TRIP_DURATION);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .attr("height", function (d) {
                return height - y(d.TOTAL_TRIPS);
            });

        svg.selectAll("text.label")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter().append("text")
            .text(function (d) {
                return d.TOTAL_TRIPS;
            })
            .attr("x", function (d, index) {
                return x(d.TRIP_DURATION) + (x.rangeBand() / 2 - 15);
            })
            .attr("y", function (d) {
                return y(d.TOTAL_TRIPS);
            })
            .style("font-size", "120%");

        svg.selectAll(".chart-title")
            .data(data.filter(function (d) {
                return d.STATION_NAME === station;
            }))
            .enter()
            .append("text")
            .attr("x", width / 2)
            .attr("y", height - 200)
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "20pt")
            .text("Ride Dist. By Time Bar Chart");
    },

    ////////////////////////////////////////////////////////////
    drawTable1: function (error, data) {
        var columns = ["Popularity", "Inflow", "Outflow"];
        var station = this.station1;
        d3.select("#table1").selectAll("table").remove();
        var table = d3.select("#table1").append("table")
            .style("border-collapse", "collapse")
            .style("width", "100%")
            .style("margin-top", "-2%")
            .style("margin-left", "10%")
            .attr("align", "left");

        thead = table.append("thead");
        tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function (column) {
                return column;
            })
            .style("font-size", "100%")
            //.style("text-anchor", "end")
            //.attr("y", 500)
            //.attr("dy", ".71em")
            .attr("align", "left");


        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data.filter(function (d) {
                return d.StationName === station;
            }))
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Arial")
            .attr("align", "left")
            .html(function (d) {
                return d.value;
            })
            .style("padding", "3%")
            .on("mouseover", function () {
                d3.select(this).style("background-color", "aliceblue")
            })
            .on("mouseout", function () {
                d3.select(this).style("background-color", "white")
            })
            .style("font-size", "80%");

    },
    ///////////////////////////////////////////////////////////////////////

    drawTable2: function (error, data) {
        var columns = ["Popularity", "Inflow", "Outflow"];
        var station = this.station2;
        d3.select("#table2").selectAll("table").remove();
        var table = d3.select("#table2").append("table")
            .style("border-collapse", "collapse")
            .style("width", "100%")
            .style("margin-top", "-2%")
            .style("margin-left", "10%")
            .attr("align", "left");

        thead = table.append("thead");
        tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function (column) {
                return column;
            })
            .style("font-size", "100%")
            .attr("align", "left");

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data.filter(function (d) {
                return d.StationName === station;
            }))
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function (row) {
                return columns.map(function (column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Arial")
            .attr("align", "left")
            .html(function (d) {
                return d.value;
            })
            .style("padding", "3%")
            .on("mouseover", function () {
                d3.select(this).style("background-color", "aliceblue")
            })
            .on("mouseout", function () {
                d3.select(this).style("background-color", "white")
            })
            .style("font-size", "80%");

    },
    ////////////////////////////////////////////////////////////////////////////////////
    updateWindow: function () {
        var xWin, yWin;

        xWin = d3.select(this.myTag).style("width");
        yWin = d3.select(this.myTag).style("height");

        this.barWidth = xWin;
        this.barHeight = yWin;

        var totalBarSizeX = this.barCanvasWidth + this.barMargin.left + this.barMargin.right;
        var totalBarSizeY = this.barCanvasHeight + this.barMargin.top + this.barMargin.bottom;

        switch (this.myTag) {
            case "#barchart1":
                this.svgBar1 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart2":
                this.svgBar2 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart3":
                this.svgBar3 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#barchart4":
                this.svgBar4 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#table1":
                this.svgTable1 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
            case "#table2":
                this.svgTable2 = d3.select(this.myTag).append("svg:svg")
                    .attr("width", this.barWidth)
                    .attr("height", this.barHeight)
                    .attr("viewBox", "" + -this.barMargin.left + " 0 " + totalBarSizeX + " " + this.barCanvasHeight);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateData: function () {
        switch (this.myTag) {
            case "#barchart1":
                var fileToLoad = "App/json/RideDist/ride_dist_by_distance_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart1.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart2":
                var fileToLoad = "App/json/RideDist/ride_dist_by_time_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart2.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart3":
                var fileToLoad = "App/json/RideDist/ride_dist_by_distance_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart3.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#barchart4":
                var fileToLoad = "App/json/RideDist/ride_dist_by_time_by_community_and_station.json";
                this.inDataCallbackFunc = this.drawBarChart4.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#table1":
                var fileToLoad = "App/json/bikesDistTime/stations_data.json";
                this.inDataCallbackFunc = this.drawTable1.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
            case "#table2":
                var fileToLoad = "App/json/bikesDistTime/stations_data.json";
                this.inDataCallbackFunc = this.drawTable2.bind(this);
                d3.json(fileToLoad, this.inDataCallbackFunc);
                break;
        }
    },

    /////////////////////////////////////////////////////////////

    updateScreen: function () {
        this.updateWindow();
        this.updateData();
    },

    setStation1: function (element) {
        var index = element.selectedIndex;
        var station = element[index].value;
        this.station1 = station;

        this.myTag = "#barchart1";
        this.updateData();

        this.myTag = "#barchart2";
        this.updateData();

        this.myTag = "#table1";
        this.updateData();

    },
    setStation2: function (element) {
        var index = element.selectedIndex;
        var station = element[index].value;
        this.station2 = station;

        this.myTag = "#barchart3";
        this.updateData();

        this.myTag = "#barchart4";
        this.updateData();

        this.myTag = "#table2";
        this.updateData();

    }
});