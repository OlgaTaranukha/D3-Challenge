//Define the SVG area dimensions.
var svgWidth = 960;
var svgHeight = 660;

//Define the chart's margins as an object.
var margin = {
	top: 20,
	right: 40,
	bottom: 200,
	left: 100
};

 //calculate chart area minus margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create a SVG warper and append the SVG group that will hold our chart and 
//the latter by the top and right margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//var chart = svg.append("g");
// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Append a div to the body to create tooltips, and assign it a class.
d3.select("#scatter")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 1);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, inputData) {
	if (err) throw err;

	inputData.forEach(function(d) {
		d.poverty = +d.poverty;
		d.healthcare= +d.healthcare;
	});

	//Create the xLinearScale function.
	var xLinearScale = d3.scaleLinear().range([0, width]);

	//Create the yLinearScale function.
	var yLinearScale = d3.scaleLinear().range([height,0]);
	
	//Create the axis functions.
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	//Scale the domain.
	xLinearScale.domain([0, d3.max(inputhData, function(d){
		return +d.poverty;
	})]);

	yLinearScale.domain([0, d3.max(inputData,function(d){
		return +d.healthStatus;
	})]);

	//create tooltip
	var toolTip = d3.tip()
	  .attr("class", "toolTip")
	  .offset([80, -60])
	  .html(function(d) {
	    var state = d.abbr;
	    var poverty = +d.poverty;
	    var healthcare = +d.healthcare;
	    return (state + "<br> In Poverty(%): " + poverty + "<br> Lacks Healthcare(%): " + healthcare);
	  });

	 chartGroup.call(toolTip);

	//Function to append the data points to the chart.
	 chartGroup.selectAll("circle")
	  .data(inputData)
	  .enter().append("circle")
	    .attr("cx", function(data, index) {
	    	console.log(data.poverty);
	    	return xLinearScale(data.poverty);
	    })
	    .attr("cy", function(data, index) {
	    	console.log(data.healthcare);
	    	return yLinearScale(data.healthcare);
	    })
	    .attr("r", "10")
	    .attr("fill","blue")
	    .style("opacity", 0.5)
	    .on("click", function(data) {
	    	toolTip.show(data);
	    })
	    //onmousover event
	    .on("mouseover", function(data) {
	    	toolTip.show(data);
	    })	
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

	  //Append the bottom axis.
	  chart.append("g")
	   .attr("transform", `translate(0, ${height})`)
	   .call(bottomAxis);

     //Append the left axis.
     chartGroup.append("g")
       .call(leftAxis);

     //Append the y-axis labels.
     chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Lacks Healthcare(%)");

     //Append the x-axis labels.
    chartGroup.append("text")
     .attr("transform", "translate(" + (width/3) + "," + (height + margin.top + 30) + ")") 
     .attr("class", "axisText")
     .text("In Poverty(%)");

});