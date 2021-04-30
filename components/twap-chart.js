const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class TwapChart extends D3Component {
  initialize(node, props) {
    var margin = {top: 20, right: 40, bottom: 20, left: 40};

    var dataSet = [
      { x: 0, y: 0.8},
      { x: 0.5, y: 0.6},
      { x: 1, y: 1},
      { x: 1.5, y: 1.4},
      { x: 2, y: 1.2},
    ];

    var xScale = d3.scaleLinear()
      .domain([0, 2]) // input
      .range([0, 500]); // output


    var yScale = d3.scaleLinear()
      .domain([0.5, 1.5]) // input 
      .range([200, 0]); // output

    var line = d3.line()
      .x(function(d) { return xScale(d.x); }) // set the x values for the line generator
      .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
      .curve(d3.curveNatural); // apply smoothing to the line

    var svg = d3.select(node).append('svg')
      .attr("width", 500 + margin.left + margin.right)
      .attr("height", 200 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function dragstarted(d) {
      d3.select(this)
        .raise()
        .classed("active", true);
    }

    function dragged(d) {
      const minY = 5;
      const maxY = 300;
      // d[0] = xScale.invert(d3.event.x);
      if (Math.sign(d3.event.y) !== -1 && d3.event.y < 300) {
        d[1] = yScale.invert(d3.event.y);
      }

      d3.select(this)
        .attr("cy", (d.y = Math.max(minY, Math.min(maxY, d3.event.y))));
      
      var p = svg.select("path");
      debugger;
      //.attr("d", line);
    }

    function dragended(d) {
      d3.select(this).classed("active", false);
    }

    const drag = d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);



    svg.append("g")
      .attr("transform", "translate(0," + 200 + ")")
      .call(d3.axisBottom(xScale).tickValues([0, 1, 2])); // Create an axis component with d3.axisBottom


    svg.append("g")
      .call(d3.axisLeft(yScale).tickValues([0.5, 1, 1.5])); // Create an axis component with d3.axisLeft

    svg.append("path")
      .datum(dataSet) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line); // 11. Calls the line generator 

    svg.selectAll(".dot")
      .data(dataSet)
      .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d) { return xScale(d.x) })
      .attr("cy", function(d) { return yScale(d.y) })
      .attr("r", 5);

      svg.selectAll("circle").call(drag);

      this.svg = svg;
  }

  update(props, oldProps) {
    this.svg
      .selectAll('circle')
      .transition()
      .duration(750)
      .attr('cx', Math.random() * size)
      .attr('cy', Math.random() * size);
  }
}

module.exports = TwapChart;
