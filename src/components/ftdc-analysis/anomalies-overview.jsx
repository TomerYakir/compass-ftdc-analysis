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
        <div key={metric} className="checkbox col-md-4">
          <label><input id={`metric_${metric}`}
            type="checkbox" value={metricObj.checked}
            onChange={() => { Actions.checkMetric(metric) }}/>{metric} - {metricObj.displayName}</label>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <button className="btn btn-info btn-xs" onClick={Actions.refresh}>Analyze FTDC</button>
          <span>   </span>
          <span className="label label-info">{this.props.metricsProcessed} metrics processed</span>
          <span>   </span>
          <span className="label label-warning">{Object.keys(this.props.metrics).length} anomalies detected</span></div>
        <div className="panel-body">
          <small>Check metrics to show as graph</small>
          <div className="col-md-12">
          { this.getMetricAnomalies() }
          </div>
        </div>
      </div>
    );
  }
}

export default AnomaliesOverview;
