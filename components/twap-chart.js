const React = require('react');
const D3Component = require('idyll-d3-component');
const d3 = require('d3');

const size = 600;

class TwapChart extends D3Component {
  initialize(node, props) {
    var margin = {top: 20, right: 40, bottom: 20, left: 40};

    this.svg = d3.select(node).append('svg')
      .attr("width", 500 + margin.left + margin.right)
      .attr("height", 200 + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleLinear()
      .domain([0, 2]) // input
      .range([0, 500]); // output


    var yScale = d3.scaleLinear()
      .domain([0.5, 1.5]) // input 
      .range([200, 0]); // output 

    this.svg.append("g")
      .attr("transform", "translate(0," + 200 + ")")
      .call(d3.axisBottom(xScale).tickValues([0, 1, 2])); // Create an axis component with d3.axisBottom


    this.svg.append("g")
      .call(d3.axisLeft(yScale).tickValues([0.5, 1, 1.5])); // Create an axis component with d3.axisLeft
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
