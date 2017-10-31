import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ShardChart from './shard-chart';
import classnames from 'classnames';
import styles from './shard-overview.less';
import PropTypes from 'prop-types';

class ShardOverview extends Component {
  static propTypes = {
    shards: PropTypes.object,
    balancerEnabled: PropTypes.bool,
    balancerRunning: PropTypes.bool,
    balancerLockedWhen: PropTypes.object,
    balancerLockedBy: PropTypes.string,
    balancerLockedWhy: PropTypes.string,
    balancerErrors: PropTypes.array,
    numberOfShards: PropTypes.number,
    totalSize: PropTypes.number,
    actions: PropTypes.object,
    'actions.refresh': PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  getShardCharts() {
    if (this.props.shards) {
      return Object.keys(this.props.shards).map(function(shard) {
        const shardObj = this.props.shards[shard];
        return (
          <ShardChart
            key={shard}
            name={shard}
            size={shardObj.size}
            numberOfShards={this.props.numberOfShards}
            hosts={shardObj.hosts}
            totalSize={this.props.totalSize} />
        );
      }, this);
    }
    return null;
  }

  getNumberOfShards() {
    const { numberOfShards } = this.props;
    if (numberOfShards > 1) {
      return `${numberOfShards} Shards`;
    } else if (numberOfShards === 1) {
      return '1 Shard';
    }
    return 'Unknown';
  }

  getShardBalancerStateClass() {
    return this.props.balancerEnabled ? 'cluster-balancer-enabled' : 'cluster-balancer-disabled';
  }

  getShardBalancerRunningClass() {
    return this.props.balancerRunning ? 'cluster-balancer-enabled' : 'cluster-balancer-notrunning';
  }

  getBalancerTooltip() {
    if (this.props.balancerLockedBy) {
      return (
        <Tooltip id="balancerRunningTooltip">
          <div className="align-left">
            <strong>Locked By:</strong> {this.props.balancerLockedBy}<br></br>
            <strong>Locked At:</strong> {this.props.balancerLockedWhen.toISOString()}<br></br>
            <strong>Reason for locking:</strong> {this.props.balancerLockedWhy}<br></br>
            <strong>Latest balancer errors:</strong><br></br>
            {this.getBalancerErrors()}
          </div>
        </Tooltip>
      );
    } else if (this.props.balancerErrors > 0) {
      return (
        <Tooltip id="balancerRunningTooltip">
          <div className="align-left">
            {this.getBalancerErrors()}
          </div>
        </Tooltip>
      );
    }
    return (
      <Tooltip id="balancerRunningTooltip">
        <div>
          Balancer not running and no errors detected
        </div>
      </Tooltip>
    );
  }

  getBalancerErrors() {
    if (this.props.balancerErrors > 0) {
      return this.props.balancerErrors.map(function(balancerError) {
        return (
          <div key={balancerError.time}>
            {balancerError.time + ' ' + balancerError.details.errmsg}
          </div>
        );
      });
    }
  }

  getShardBalancerWarningIcon() {
    if (this.props.balancerErrors.length > 0) {
      return (
        <i className={classnames('fa', 'fa-warning', styles['warning-icon'])} ></i>
      );
    }
  }

  handleRefresh() {
    this.props.actions.refresh();
  }

  render() {
    return (
      <div className={classnames(styles.top)}>
        <div className="row">
          <div className="col-md-7">
            <span>
              <button onClick={this.handleRefresh}>
                <i className="fa fa-repeat"> </i>
              </button>
            </span>
            <span className={classnames('badge', styles['badge-spacing'])}>
              {this.getNumberOfShards()}
            </span>
          </div>
          <OverlayTrigger placement="bottom" overlay={this.getBalancerTooltip()}>
            <div className="col-md-5">
              <span>
                BALANCER:
              </span>
              <span className={classnames('badge', styles['square-badge'], styles['badge-spacing'],
                styles['to-upper'], styles[this.getShardBalancerStateClass()])}>
                { this.props.balancerEnabled ? 'Enabled' : 'Disabled' }
              </span>
              <span className={classnames('badge', styles['square-badge'], styles['badge-spacing'],
                styles['to-upper'], styles[this.getShardBalancerRunningClass()])}>
                { this.props.balancerRunning ? 'Running' : 'Not Running' }
              </span>
              <span>
                { this.getShardBalancerWarningIcon() }
              </span>
            </div>
          </OverlayTrigger>
        </div>
        <div className="row">
          <div className="col-md-12">
            <small>
              Hover over the shard charts/balancer status for more details.
            </small>
          </div>
        </div>
        <div className="row">
          <ul className={classnames(styles['list-group-horizontal'])}>
            { this.getShardCharts() }
          </ul>
        </div>
      </div>
    );
  }
}

export default ShardOverview;
