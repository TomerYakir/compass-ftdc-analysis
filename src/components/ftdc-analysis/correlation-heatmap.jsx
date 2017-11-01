import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';
import $ from 'jquery';
import Actions from 'actions';

class CorrelationHeatMap extends Component {

  constructor(props) {
    super(props);
    this.currentSelectedMetrics = [];
  }

  getChartSpec() {
    return {
      'width': 400,
      'height': 400,
      'mark': 'rect',
      'encoding': {
        'y': {'field': 'MetricOne', 'type': 'nominal'},
        'x': {'field': 'MetricTwo', 'type': 'nominal'},
        'color': {'field': 'Score', 'type': 'quantitative', 'legend': {'orient': 'right'}},
        "tooltip": {"field": "Tooltip", "type": "ordinal"}
      },
      "selection": {
        "metrics": {
          "type": "single",
          "fields": ["MetricOne", "MetricTwo"],
          "bind": {"input": "text", "externalref": "inputs" }
        }
      }
    };
  }

  monitorSelection() {
    this.currentSelectedMetrics = [];
    $("input[externalref='inputs']").each((idx, elem) => {
      if (elem.value && this.currentSelectedMetrics.indexOf(elem.value) == -1) {
        // $("#metric_" + elem.value).attr("checked", true);
        const o = $("#metric_" + elem.value);
        if (!o.is(":checked")) {
          o.trigger("click");
        }
        // this.currentSelectedMetrics.push(elem.value)
      }
    });
    $(".vega-bindings").hide();
    /*
    if (JSON.stringify(this.currentSelectedMetrics) != JSON.stringify(this.props.selectedMetrics)) {
    Actions.selectCorrelations(this.currentSelectedMetrics);
    }
    */
  }

  componentDidMount() {
    $(".vega-bindings").hide();
    window.setInterval(this.monitorSelection.bind(this), 200);
  }

  doSomething() {
    debugger;
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
          <small>Click on the tile to show the correlated metrics. Bright tiles indicate a high correlation level.</small>
          <div className="row">
            <VegaLite data={data} spec={spec} onSignalClick={this.doSomething} />
          </div>
        </div>
      </div>
    );
  }
}

export default CorrelationHeatMap;
