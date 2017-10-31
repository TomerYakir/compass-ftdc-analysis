import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './anomalies-overview.less';
import Actions from 'actions';


class AnomaliesOverview extends Component {

  constructor(props) {
    super(props);
  }

  getMetricAnomalies() {
    return Object.keys(this.props.metrics).map((metric) => {
      const metricObj = this.props.metrics[metric];
      return (
        <div key={metric} className="checkbox">
          <label><input id={`metric_${metricObj.heatMapCode}`}
            type="checkbox" value={metricObj.checked}
            onChange={() => { Actions.checkMetric(metric) }}  />{metricObj.heatMapCode} - {metricObj.displayName}</label>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading"><span className="label label-warning">{Object.keys(this.props.metrics).length} anomalies detected</span></div>
        <div className="panel-body">
          <small>Check metrics to show as graph</small>
          { this.getMetricAnomalies() }
        </div>
      </div>
    );
  }
}

export default AnomaliesOverview;
