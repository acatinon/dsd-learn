
const React = require('react');
const d3 = require('d3');

class Twap extends React.Component {

  componentWillReceiveProps(nextProps) {
    var twap = d3.mean(nextProps.source.map(p => p.cy));

    nextProps.updateProps({
      value: twap
    });
  }
    
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

module.exports = Twap;
