import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';

class MetricChart extends Component {

  constructor(props) {
    super(props);
  }

  getChartSpec() {
    return {
      width: 750,
      height: 65,
      layer: [
        {
        mark: 'point',
        encoding: {
          x: {
            field: 'date',
            type: 'temporal',
            axis: {
              grid: false,
              format: '%m/%d %H:%M:%S',
              title: '',
              labelAngle: 90,
              tickSize: 0,
              tickLabelColor: '#a09f9e',
              axisColor: '#EBEBED'
            }
          },
          y: {
            field: 'value',
            type: 'quantitative',
            axis: {
              grid: true,
              ticks: 10,
              title: this.props.title,
              titleColor: 'a09f9e',
              tickSize: 0,
              tickLabelColor: '#a09f9e',
              axisWidth: 0
            }
          },
          color: {
            field: 'type',
            type: 'nominal'
          },
          "shape": {"field": "type", "type": "nominal"}
        }
      },
      {
        "mark": "rule",
        "encoding": {
          "y": {
            "aggregate": "mean",
            "field": "value",
            "type": "quantitative"
          },
          "color": {"value": "red"},
          "size": {"value": 1}
        }
      }]
    };
  }

  render() {
    const spec = this.getChartSpec();
    const data = {
      values: this.props.values
    };
    return (
      <div>
        <VegaLite data={data} spec={spec} />
      </div>
    );
  }
}

export default MetricChart;
