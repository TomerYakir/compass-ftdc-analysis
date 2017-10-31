import React, { Component } from 'react';
import MetricChart from './metric-chart';
import classnames from 'classnames';
import styles from './anomalies-overview.less';


class AnomaliesCharts extends Component {

  constructor(props) {
    super(props);
  }

  getAnomaliesCharts() {
    return Object.keys(this.props.metrics).map((metric) => {
      const metricObj = this.props.metrics[metric];
      if (metricObj.checked) {
        return (
          <div key={metric} className="row" >
            <div className="col-md-12">
              <span><strong>{metricObj.fullName}</strong></span>
              <span className="pull-right">Mean: {metricObj.mean}, Min: {metricObj.min}, Max: {metricObj.max}</span>
            </div>
            <div className="col-md-12">
              <MetricChart values={metricObj.values} outliers={metricObj.outliers} title={metricObj.title} />
            </div>
          </div>
        )
      }
    })
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          { this.getAnomaliesCharts() }
        </div>
      </div>
    );
  }
}

export default AnomaliesCharts;
