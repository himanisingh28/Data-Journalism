// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var csvdata = 'assets/data/data.csv';

  // Load data from forcepoints.csv
d3.csv(csvdata).then(function(healthdata) {
    console.log(healthdata);
    // Format the data
    healthdata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

   // Create Scales
  //=============================================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthdata, d => d.poverty)*0.8, d3.max(healthdata, d => d.poverty)])
    .range([0, width]);
    
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthdata, d => d.obesity)*0.8, d3.max(healthdata, d => d.obesity)])
    .range([height, 0]);

    // Create Axes
  // =============================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  // Append the axes to the chartGroup - ADD STYLING
  // ==============================================
  // Add bottomAxis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);


    chartGroup.append("g") 
    .call(leftAxis);


    
    // Append the labels to x and y axis
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "aText")
    .text("In Poverty (%)");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity");


    // Create the circles and add text using data binding
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".25")
    .attr("class", "usStateCircle");;

    var textGroup = chartGroup.selectAll()
    .data(healthdata)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity)+3)
    .attr("fill", "white")
    .attr("opacity", "0.8")
    .attr("class", "stateText")
    ;

// Updating circles group with new tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty:${d.poverty}<br>Obesity:${d.obesity}`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
      })
        // on mouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
});