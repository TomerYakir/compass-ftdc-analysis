import React, { Component } from 'react';
import { StoreConnector } from 'hadron-react-components';
import ClusterHealth from 'components/cluster-health';
import ClusterHealthStore from 'stores/cluster-health-store';
import 'bootstrap/dist/css/bootstrap.css';
import Actions from 'actions';

class ClusterHealthPlugin extends Component {
  static displayName = 'ClusterHealthPlugin';

  /**
   * Connect the Plugin to the store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={ClusterHealthStore}>
        <ClusterHealth actions={Actions} {...this.props} />
      </StoreConnector>
    );
  }
}

export default ClusterHealthPlugin;
export { Plugin };
