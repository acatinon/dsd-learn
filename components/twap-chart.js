const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class TwapChart extends D3Component {
  initialize(node, props) {
    var margin = {top: 20, right: 40, bottom: 20, left: 40};
    var pointsData = props.points;
    var twap = props.twap;
    
    this.twapData = [[0, twap], [2, twap]];
    
    var xScale = d3.scaleLinear()
      .domain([-0.05, 2.05]) // input
      .range([0, 500]); // output


    var yScale = d3.scaleLinear()
      .domain([0.5, 1.5]) // input 
      .range([200, 0]); // output

    var line = d3.line()
      .x(function(d) { return xScale(d.cx); })
      .y(function(d) { return yScale(d.cy); })
      .curve(d3.curveNatural);

    this.twapLine = d3.line()
      .x(function(d) { return xScale(d[0]); })
      .y(function(d) { return yScale(d[1]); })

    var svg = d3.select(node).append('svg')
      .attr("width", 500 + margin.left + margin.right)
      .attr("height", 200 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", 500)
      .attr("height", 200)
      .attr("x", 0)
      .attr("y", 0);

    const chartContent = svg.append("g").attr("clip-path", "url(#clip)");

    function dragstarted(d) {
      d3.select(this)
        .raise()
        .classed("active", true);
    }

    function dragged(event, d) {
      const minY = 5;
      const maxY = 200;
      
      if (Math.sign(event.y) !== -1 && event.y < 200) {
        d.cy = yScale.invert(event.y);
      }

      props.updateProps({
        points: []
      });

      props.updateProps({
        points: pointsData
      });

      d3.select(this)
        .attr("cy", Math.max(minY, Math.min(maxY, event.y)));
      
      chartContent.select("path").attr("d", line);
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

    chartContent.append("path")
      .datum(pointsData)
      .attr("class", "line")
      .attr("d", line);

    chartContent.append("path")
      .datum(this.twapData)
      .attr("class", "twap-line") 
      .attr("d", this.twapLine);

    chartContent.selectAll(".dot")
      .data(pointsData)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function(d) { return xScale(d.cx) })
      .attr("cy", function(d) { return yScale(d.cy) })
      .attr("r", 5);

    chartContent.selectAll("circle").call(drag);

    this.svg = svg;
  }

  update(props, oldProps) {
    this.twapData[0][1] = props.twap;
    this.twapData[1][1] = props.twap;

    this.svg.select(".twap-line").attr("d", this.twapLine);
  }
}

module.exports = TwapChart;
