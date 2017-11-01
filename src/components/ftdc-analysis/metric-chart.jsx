import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';

class MetricChart extends Component {

  constructor(props) {
    super(props);
  }

  getChartSpec() {
    const ratio = this.props.mean > 1 ? 1.0 : Math.max(this.props.min / this.props.mean, 1 - (this.props.max / this.props.max));
    const domain = ratio > 1.0 ? [this.props.min * ratio,this.props.mean,this.props.max * (1/ratio)] : [this.props.min, this.props.max];
    return {
      width: 650,
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
              format: '%d/%m %H:%M:%S',
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
            scale: {
                domain: domain,
            },
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
