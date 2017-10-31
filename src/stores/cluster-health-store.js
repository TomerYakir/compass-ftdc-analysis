import Reflux from 'reflux';
import Actions from 'actions';
import StateMixin from 'reflux-state-mixin';
import Connection from 'mongodb-connection-model';
import DataService from 'mongodb-data-service';
import assert from 'assert';
import { deactivate } from '../index';

const ClusterHealthStore = Reflux.createStore({
  mixins: [StateMixin.store],

  listenables: Actions,
  dataService: null,
  data: {},
  appRegistry: null,
  mockup: false,
  compass: true,
  databases: [],
  INIT_STATE: {
    numberOfShards: 0,
    balancerRunning: false,
    balancerEnabled: false,
    totalSize: 0,
    balancerLockedBy: '',
    balancerLockedWhen: {},
    balancerLockedWhy: '',
    balancerErrors: [],
    shards: {},
    numberOfShardedCollections: 0,
    collections: {}
  },

  refresh() {
    this.loadData();
  },

  onActivated(appRegistry) {
    appRegistry.on('data-service-connected', this.onConnected.bind(this));
    this.appRegistry = appRegistry;
  },

  getInitialState() {
    if (this.mockup) {
      // mockup
      return this.getMockProps();
    }
    this.loadData = this.loadData.bind(this);
    if (!this.compass) {
      if (!this.dataService) {
        this.dataService = new DataService(new Connection({
          hostname: '127.0.0.1',
          port: 27017,
          ns: 'test'
        }));
      }
      this.dataService.connect((err) => {assert.equal(null, err); this.loadData();});
    }
    return this.INIT_STATE;
  },

  onConnected: function(error, dataService) {
    if (error) {
      console.log('onConnected:error - ' + error);
    } else {
      this.dataService = dataService;
      this.loadData();
    }
  },

  deregisterFromCompass() {
    deactivate(this.appRegistry);
  },

  returnPromise(func, arg) {
    return new Promise(func.bind(this, arg));
  },

  getBalancerEnabled(arg, resolve) {
    const sort = [[ '_id', 1 ]];
    const filter = {_id: 'balancer'};
    const findOptions = {
      sort: sort,
      fields: null,
      skip: 0,
      limit: 1,
      promoteValues: false
    };

    this.dataService.find('config.settings', filter, findOptions, (error, documents) => {
      if (error) {
        console.error('getBalancerEnabled:error - ' + error);
      } else {
        this.data.balancerEnabled = (documents.length === 0 || (documents.length && !documents[0].stopped));
      }
      resolve(true);
    });
  },

  getBalancerRunningByLocks(arg, resolve) {
    const sort = [[ '_id', 1 ]];
    const findOptions = {
      sort: sort,
      fields: null,
      skip: 0,
      limit: 1,
      promoteValues: false
    };
    const filter = {_id: 'balancer', state: 2};
    this.dataService.find('config.locks', filter, findOptions, (error, documents) => {
      if (error) {
        console.error('getBalancerRunningByLocks:error - ' + error);
      } else {
        this.data.balancerRunning = documents.length > 0;
        if (documents.length > 0) {
          this.data.balancerLockedBy = documents[0].who;
          this.data.balancerLockedWhen = documents[0].when;
          this.data.balancerLockedWhy = documents[0].why;
        }
      }
      resolve(true);
    });
  },

  getBalancerRunningByAdminCmd(arg, resolve) {
    this.dataService.command('admin', {balancerStatus: 1}, (error, results) => {
      if (error) {
        console.log('cannot run balancerStatus admin command - ' + error);
      } else {
        this.data.balancerRunning = !(results && !results.inBalancerRound);
      }
      resolve(true);
    });
  },

  loadBalancerStats(arg, resolve) {
    Promise.all([
      this.returnPromise(this.getBalancerEnabled),
      this.returnPromise(this.getBalancerRunningByLocks),
      this.returnPromise(this.getBalancerRunningByAdminCmd)
    ]).then(() => {
      resolve(true);
    });
  },

  getShardNamesHosts(arg, resolve) {
    const collection = 'config.shards';
    const filter = {};
    const sort = [[ '_id', 1 ]];
    const limit = 0;
    const project = {};

    const findOptions = {
      sort: sort,
      fields: project,
      limit: limit,
      promoteValues: false
    };
    this.dataService.find(collection, filter, findOptions, (error, documents) => {
      if (error) {
        console.error('getShardNamesHosts:error - ' + error);
      } else {
        this.data.shards = {};
        for (const shard in documents) {
          if (documents.hasOwnProperty(shard)) {
            const shardObj = documents[shard];
            this.data.shards[shardObj._id] = {
              hosts: shardObj.host,
              size: 0,
              databaseSizes: []
            };
          }
        }
        this.data.totalSize = 0;
      }
      resolve(true);
    });
  },

  getShardDatabaseSize(arg, resolve) {
    const gbScale = 1024 * 1024 * 1024;
    this.dataService.command(arg, {dbStats: 1, scale: gbScale}, (error, results) => {
      if (error) {
        console.error('getShardDatabaseSize:error - ' + error);
      } else {
        for (let shard in results.raw) {
          if (results.raw.hasOwnProperty(shard)) {
            const shardObj = results.raw[shard];
            if (shard.indexOf('/') > 0) {
              shard = shard.split('/')[0];
            }
            this.data.shards[shard].databaseSizes.push(shardObj.dataSize + shardObj.indexSize);
          }
        }
      }
      resolve(true);
    });
  },

  getShardSizes(arg, resolve) {
    const collection = 'config.databases';
    const filter = {};
    const limit = 0;
    const project = {};
    const findOptions = {
      fields: project,
      limit: limit,
      promoteValues: false
    };
    this.dataService.find(collection, filter, findOptions, (error, documents) => {
      if (error) {
        console.error('getShardSizes:error - ' + error);
      } else {
        const shardSizePromises = [];
        for (const doc in documents) {
          if (documents.hasOwnProperty(doc)) {
            shardSizePromises.push(this.returnPromise(this.getShardDatabaseSize, documents[doc]._id));
          }
        }
        Promise.all(shardSizePromises).then(() => {
          resolve(true);
        });
      }
    });
  },

  loadShardOverviewStats(arg, resolve) {
    this.returnPromise(this.getShardNamesHosts).then(
      () => {
        this.returnPromise(this.getShardSizes).then(() => {
          let totalSize = 0;
          for (const shard in this.data.shards) {
            if (this.data.shards.hasOwnProperty(shard)) {
              const shardSize = this.data.shards[shard].databaseSizes.reduce((accumulator, value) => {return accumulator + value;});
              totalSize += shardSize;
              this.data.shards[shard].size = parseFloat(shardSize.toFixed(4));
            }
          }
          this.data.totalSize = parseFloat(totalSize.toFixed(4));
          this.data.numberOfShards = Object.keys(this.data.shards).length;
          resolve(true);
        });
      }
    );
  },

  getCollectionDistributionStats(arg, resolve) {
    this.dataService.shardedCollectionDetail(arg.name, (error, result) => {
      if (error) {
        console.error('getCollectionDistributionStats:error - ' + error);
      } else {
        const shardDistribution = [];
        for (const shard in result.shards) {
          if (result.shards.hasOwnProperty(shard)) {
            const shardObj = result.shards[shard];
            shardDistribution.push({
              shard: shard,
              chunks: shardObj.estimatedDataPercent,
              avgObjSize: shardObj.avgObjSize,
              count: shardObj.count,
              estimatedDataPerChunk: shardObj.estimatedDataPerChunk.toFixed(2),
              estimatedDocPercent: shardObj.estimatedDocPercent,
              estimatedDocsPerChunk: shardObj.estimatedDocsPerChunk
            });
          }
        }
        this.data.collections[result._id].chunkDistribution = shardDistribution;
      }
      resolve(true);
    });
  },

  getCollectionStats(arg, resolve) {
    const collection = 'config.collections';
    const filter = {};
    const sort = [[ '_id', 1 ]];
    const limit = 0;
    const project = {'lastmodEpoc': 0, 'lastmod': 0};
    const findOptions = {
      sort: sort,
      fields: project,
      limit: limit,
      promoteValues: false
    };
    this.dataService.find(collection, filter, findOptions, (error, documents) => {
      if (error) {
        console.error('getCollectionStats:error - ' + error);
        resolve(true);
      } else {
        this.data.numberOfShardedCollections = documents.length;
        this.data.collections = {};
        const collDistPromises = [];
        for (let idx = 0; idx < documents.length; idx++) {
          const doc = documents[idx];
          const collObj = {
            'name': doc._id,
            'shardKey': JSON.stringify(doc.key),
            'chunkDistribution': []
          };
          this.data.collections[collObj.name] = collObj;
          collDistPromises.push(this.returnPromise(this.getCollectionDistributionStats, collObj));
        }
        Promise.all(collDistPromises).then(() => {
          resolve(true);
        });
      }
    });
  },

  loadCollectionStats(arg, resolve) {
    this.returnPromise(this.getCollectionStats).then(() => {
      resolve(true);
    });
  },

  loadData() {
    if (this.compass && !this.dataService.isMongos()) {
      this.deregisterFromCompass();
    } else {
      console.log('loading data');
      Promise.all([
        this.returnPromise(this.loadBalancerStats),
        this.returnPromise(this.loadShardOverviewStats),
        this.returnPromise(this.loadCollectionStats)
      ]).then(() => {
        console.log('data loaded');
        this.setState(this.data);
      });
    }
  },

  getMockProps() {
    return {
      numberOfShards: 3,
      balancerEnabled: false,
      balancerRunning: false,
      totalSize: 15,
      balancerLockedBy: 'MDB_MS01',
      balancerLockedWhen: new Date(),
      balancerLockedWhy: 'Doing balancing round',
      balancerErrors: [
        {
          time: new Date(),
          details: {
            errmsg: 'Cannot stop balancer'
          }
        },
        {
          time: new Date(),
          details: {
            errmsg: 'Chunk too big'
          }
        }
      ],
      shards: {
        'Shard_0': {
          'size': 4.5,
          'hosts': 'MDBS0_N1, MDBS0_N2, MDBS0_N3'
        },
        'Shard_1': {
          'size': 5.5,
          'hosts': 'MDBS1_N1, MDBS1_N2, MDBS1_N3'
        },
        'Shard_2': {
          'size': 2.5,
          'hosts': 'MDBS2_N1, MDBS2_N2, MDBS2_N3'
        }
      },
      numberOfShardedCollections: 2,
      collections: {
        'Events': {
          name: 'Events',
          shardKey: '{userId: 1, type: 1, timestamp: 1}',
          chunkDistribution: [
            {
              shard: 'Shard_0',
              chunks: 34,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            },
            {
              shard: 'Shard_1',
              chunks: 28,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            },
            {
              shard: 'Shard_2',
              chunks: 40,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            }
          ]
        },
        'Files': {
          name: 'Files',
          shardKey: '{region: 1, extension: 1}',
          chunkDistribution: [
            {
              shard: 'Shard_0',
              chunks: 17,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            },
            {
              shard: 'Shard_1',
              chunks: 18,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            },
            {
              shard: 'Shard_2',
              chunks: 48,
              avgObjSize: 1022,
              capped: false,
              count: 1402033,
              estimatedDataPerChunk: 3023,
              estimatedDocPercent: 28,
              estimatedDocsPerChunk: 3320
            }
          ]
        }
      }
    };
  }
});

export default ClusterHealthStore;
export {ClusterHealthStore};
