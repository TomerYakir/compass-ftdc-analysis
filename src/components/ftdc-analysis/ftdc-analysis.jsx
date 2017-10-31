import React, { Component } from 'react';
import AnomaliesOverview from './anomalies-overview';
import AnomaliesCharts from './anomalies-charts';
import CorrelationHeatMap from './correlation-heatmap';
import styles from './ftdc-analysis.less';
import classnames from 'classnames';

class FTDCAnalysis extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={classnames('container', styles.vscrollbar)}>
        <AnomaliesOverview {...this.props} />
        <AnomaliesCharts {...this.props} />
        <CorrelationHeatMap {...this.props} />
      </div>
    );
  }
}

export default FTDCAnalysis;
