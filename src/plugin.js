import React, { Component } from 'react';
import { StoreConnector } from 'hadron-react-components';
import FTDCAnalysis from 'components/ftdc-analysis';
import FTDCAnalysisStore from 'stores/ftdc-analysis-store';
import 'bootstrap/dist/css/bootstrap.css';
import Actions from 'actions';

class FTDCAnalysisPlugin extends Component {
  static displayName = 'FTDCAnalysisPlugin';

  /**
   * Connect the Plugin to the store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={FTDCAnalysisStore}>
        <FTDCAnalysis actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

export default FTDCAnalysisPlugin;
export { Plugin };
