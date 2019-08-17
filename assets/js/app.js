// Homework 16 D3 Visualizations_Peter Kim
// Chart Params
var svgWidth = 1500;
var svgHeight = 800;

var margin = { top: 30, right: 40, bottom: 60, left: 80 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
    // dynamic : function used for updating x-scale var upon click on axis label
    function xScale(response, chosenXAxis) {
      // create scales
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(response, d => d[chosenXAxis]) * 0.8,
          d3.max(response, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
  
      return xLinearScale;
  
    }
  
      // dynamic : function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
  
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
      return xAxis;
    }    
  
    // dynamic : //function used for updating circles group with a transition to
  // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
  
      return circlesGroup;
    }

    function renderLabels(circleLabels, xLinearScale, chosenXAxis) {
  
      circleLabels.transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[chosenXAxis]));
  
      return circleLabels;
    }
  
      // dynamic : // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {
  
      if (chosenXAxis === "age") {
        var label  = "Age (Median)";
      }
      else {
        var label = "In Poverty (%)";
      }  
      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
        });
  
       // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("mouseover", function(datalvl) {
        toolTip.show(datalvl, this);
      })
        // onmouseout event
        .on("mouseout", function(datalvl, index) {
          toolTip.hide(datalvl);
        });
  return circlesGroup;
}

// Import datalvl from an external CSV file.  Error code was causing issue.
d3.csv("assets/data/data.csv").then(function(response) { 
  console.log(response);
 
  // console.log([response]);

  // parse datalvl set integer value with '+'
  response.forEach(function(datalvl) {
    datalvl.poverty = +datalvl.poverty;
    datalvl.age = +datalvl.age;
    datalvl.smokes = +datalvl.smokes;
  });
  // xLinearScale function above csv 
var xLinearScale = xScale(response, chosenXAxis);
  // var xLinearScale = d3.scaleLinear()
  // .domain(d3.extent(response, d => d.age))
  // .range([0, width]);

  // Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(response, d => d.smokes)])
  .range([height, 0]);

// Step 6: Create initial Axes functions
// =============================================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 7: Append the axes to the chartGroup - ADD STYLING
// ==============================================
// Add bottomAxis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// CHANGE THE TEXT TO THE CORRECT COLOR
var yAxis = chartGroup.append("g")
  .attr("stroke", "red") // NEW!
  .call(leftAxis);


// Step 5: Create Circles
    // ==============================
var circlesGroup = chartGroup.selectAll("circle")
  .data(response)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "20")
  .attr("fill", "green")
  .attr("opacity", ".5");

  // labeling the circles
var circleLabels = chartGroup.selectAll(null).data(response).enter().append("text");

    circleLabels
      // .attr("x", function(d) {
        // return xLinearScale(d[chosenXAxis])
      // })
      .text(function(d) {
        return d.abbr;
      })
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      // .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", function(d) {
        return yLinearScale(d.smokes);
      })

      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

//*************** DYNAMIC*/ Create group for  2 x- axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

var ageLengthLabel = labelsGroup.append("text")
  // .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  // .attr("class", "axisText")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "age") // value to grab for event listener
  .classed("active", true)
  .text("Age (Median)");

var povertyLabel = labelsGroup.append("text")
//  .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
//  .attr("class", "axisText")     
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "poverty") // value to grab for event listener
 .classed("inactive", true)
 .text("In Poverty (%)");

// append y axis
chartGroup.append("text")
 .attr("transform", "rotate(-90)")
 .attr("y", 0 - margin.left)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .classed("axis-text", true)
 .text("Smokes (%)");


// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
 .on("click", function() {
   // get value of selection
   var value = d3.select(this).attr("value");
   if (value !== chosenXAxis) {

     // replaces chosenXAxis with value
     chosenXAxis = value;

     // console.log(chosenXAxis)

     // functions here found above csv import
     // updates x scale for new data
     xLinearScale = xScale(response, chosenXAxis);

     // updates x axis with transition
     xAxis = renderAxes(xLinearScale, xAxis);

     // updates circles with new x values
     circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    //  update circlelabel with new x values
     circleLabels = renderLabels(circleLabels, xLinearScale, chosenXAxis);
    
     // updates circlelabel with new info
     circleLabels = updateToolTip(chosenXAxis, circleLabels);

     // changes classes to change bold text
     if (chosenXAxis === "poverty") {
       povertyLabel
         .classed("active", true)
         .classed("inactive", false);
       ageLengthLabel
         .classed("active", false)
         .classed("inactive", true);
     }
     else {
       povertyLabel
         .classed("active", false)
         .classed("inactive", true);
       ageLengthLabel
         .classed("active", true)
         .classed("inactive", false);
     }
   }
 });
});