import React, { Component } from 'react';
import ShardOverview from './shard-overview';
import ShardCollectionsList from './shard-collections-list';

class ClusterHealth extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <ShardOverview {...this.props} />
        <ShardCollectionsList {...this.props} />
      </div>
    );
  }
}

export default ClusterHealth;
