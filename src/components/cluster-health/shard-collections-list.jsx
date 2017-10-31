import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './shard-collections-list.less';
import CollectionChunkDistribution from './collection-chunk-distribution';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './tooltip.css';

class ShardCollectionsList extends Component {
  static propTypes = {
    collections: PropTypes.object,
    numberOfShardedCollections: PropTypes.number,
    numberOfShards: PropTypes.number
  };

  constructor(props) {
    super(props);
  }

  getShardedCollectionsNumber() {
    const { numberOfShardedCollections } = this.props;
    if (numberOfShardedCollections > 1) {
      return `${numberOfShardedCollections} Sharded Collections`;
    } else if (numberOfShardedCollections === 1) {
      return '1 Sharded Collection';
    }
    return 'Unknown';
  }

  getChunksInfo(collection) {
    return Object.keys(collection.chunkDistribution).map(function(key) {
      const shard = collection.chunkDistribution[key];
      return (
        <tr key={shard.shard}>
            <td><strong>{shard.shard}</strong></td>
            <td>{shard.avgObjSize}</td>
           <td>{shard.count}</td>
          <td>{shard.estimatedDataPerChunk}</td>
          <td>{shard.estimatedDocPercent}</td>
          <td>{shard.estimatedDocsPerChunk}</td>
        </tr>
      );
    }, this);
  }

  getCollectionTooltip(collection) {
    if (collection) {
      return (
        <Tooltip id="distTooltip" placement="right">
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>Shard</th>
                  <th>Average Object Size</th>
                  <th>Chunk Count</th>
                  <th>Estimated Data per Chunk</th>
                  <th>Estimated Docs %</th>
                  <th>Estimated Docs per Chunk</th>
                </tr>
              </thead>
              <tbody>
                {this.getChunksInfo(collection)}
              </tbody>
            </table>
          </div>
        </Tooltip>
      );
    }
    return (
      <Tooltip id="distTooltip">
        <div>
              Loading...
        </div>
      </Tooltip>
    );
  }

  getCollections() {
    return (
      Object.keys(this.props.collections).map((key) => {
        const collection = this.props.collections[key];
        return (
          <li
            key={collection.name}
            className={classnames('list-group-item', styles.collection, styles['no-left-padding'])}
            >
              <div className="col-md-5">
                <span>
                  <strong>
                    {collection.name}
                  </strong>
                </span>
                <OverlayTrigger placement="right" overlay={this.getCollectionTooltip(collection)}>
                  <span><i className="fa fa-info help-icon"> </i></span>
                </OverlayTrigger>
                <div>
                  Shard Key: <code>{collection.shardKey}</code>
                </div>
              </div>
              <div className="col-md-7">
                <CollectionChunkDistribution
                  chunkDistribution={collection.chunkDistribution}
                  numberOfShards={this.props.numberOfShards}
                  />
              </div>
          </li>
        );
      }, this)
    );
  }

  render() {
    return (
      <div className={classnames('container-fluid', styles['margin-top'])}>
        <div className="row">
          <span className="badge">
            { this.getShardedCollectionsNumber() }
          </span>
        </div>
        <small>Hover over the collection name for more sharding details.</small>
        <div className="row">
          <ul className="list-group">
            { this.getCollections() }
          </ul>
        </div>
      </div>
    );
  }
}

export default ShardCollectionsList;
