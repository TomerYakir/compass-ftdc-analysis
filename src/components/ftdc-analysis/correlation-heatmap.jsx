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
      'mark': 'rect',
      "signals": [
        {
          "name": "click",
          "init": null,
          'streams': [
            {'type': '*:mouseover', 'expr': 'null'},
            {'type': '*:mouseout', 'expr': 'null'},
            {'type': '*:mousedown', 'expr': 'null'}
          ]
        }
      ],
      'width': 400,
      'height': 400,
      'encoding': {
        'y': {'field': 'MetricOne', 'type': 'nominal'},
        'x': {'field': 'MetricTwo', 'type': 'nominal'},
        'color': {'field': 'Score', 'type': 'quantitative', 'legend': {'orient': 'bottom-left'}}
      },
      "selection": {
        "org": {
          "type": "single",
          "fields": ["MetricOne", "MetricTwo"],
          "bind": {"input": "text", "externalref": "inputs", "onchange": "this.trigger('change');", "oninput": "this.trigger('input');", "ontextchanged": "this.trigger('input');" }
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
