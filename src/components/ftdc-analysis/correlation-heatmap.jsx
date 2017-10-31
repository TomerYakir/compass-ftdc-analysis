import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';
import $ from 'jquery';

class CorrelationHeatMap extends Component {

  constructor(props) {
    super(props);
  }

  getChartSpec() {
    return {
      'mark': 'rect',
      'width': 600,
      'height': 600,
      'encoding': {
        'y': {'field': 'MetricOne', 'type': 'nominal'},
        'x': {'field': 'MetricTwo', 'type': 'nominal'},
        'color': {'field': 'Score', 'type': 'quantitative', 'legend': {'orient': 'bottom-left'}}
      },
      "selection": {
        "org": {
          "type": "single",
          "fields": ["MetricOne", "MetricTwo"],
          "bind": {"input": "text", "externalref": "inputs" }
        }
      }
    };
  }

  changed() {
    debugger;
  }

  componentDidMount() {
    //$(".vega-bindings").hide();
    $("input[externalref='inputs']").blur(() => {
      debugger;
    })
  }

  render() {
    const spec = this.getChartSpec();
    const data = {
      values: this.props.correlations
    };
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Correlation Map</div>
        <div className="panel-body">
          <small>Click on the tile to show the correlated metrics</small>
          <div className="row">
            <VegaLite data={data} spec={spec} />
          </div>
        </div>
      </div>
    );
  }
}

export default CorrelationHeatMap;
