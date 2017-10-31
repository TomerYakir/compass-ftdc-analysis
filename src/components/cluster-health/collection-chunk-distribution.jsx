import React, { Component } from 'react';
import VegaLite from 'react-vega-lite';
import PropTypes from 'prop-types';

class CollectionChunkDistribution extends Component {
  static propTypes = {
    numberOfShards: PropTypes.number,
    chunkDistribution: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  getBarSpec() {
    return {
      mark: 'bar',
      width: this.props.numberOfShards * 100,
      height: 65,
      encoding: {
        x: {field: 'shard',
          type: 'ordinal',
          axis: {
            grid: false,
            title: '',
            labelAngle: 0,
            tickSize: 0,
            tickLabelColor: '#a09f9e',
            axisColor: '#EBEBED'
          }
        },
        y: {
          field: 'chunks',
          type: 'quantitative',
          axis: {
            grid: false,
            ticks: 2,
            title: 'Data %',
            titleColor: 'a09f9e',
            tickSize: 0,
            tickLabelColor: '#a09f9e',
            axisWidth: 0
          }
        },
        color: {
          field: 'type',
          type: 'ordinal',
          scale: {'range': ['#43b1e5', '#43b1e5', '#43b1e5']},
          legend: {
            values: [],
            title: ''
          },
          'tooltip': {
            'field': 'chunks',
            'type': 'quantitative'}
        }
      }
    };
  }

  render() {
    const barSpec = this.getBarSpec();
    const data = {
      values: this.props.chunkDistribution
    };
    return (
      <div>
        <VegaLite data={data} spec={barSpec} />
      </div>
    );
  }
}

export default CollectionChunkDistribution;
