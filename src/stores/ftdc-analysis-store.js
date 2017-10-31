import Reflux from 'reflux';
import Actions from 'actions';
import StateMixin from 'reflux-state-mixin';
import assert from 'assert';
import { deactivate } from '../index';

const FTDCAnalysisStore = Reflux.createStore({
  mixins: [StateMixin.store],

  listenables: Actions,
  data: {},
  appRegistry: null,
  mockup: true,
  compass: false,
  INIT_STATE: {
    "metrics": {}
  },

  refresh() {
    this.loadData();
  },

  onActivated(appRegistry) {
    // TODO
  },

  getInitialState() {
    if (this.mockup) {
      // mockup
      this.data = this.getMockProps();
      return this.data;
    }
    this.loadData = this.loadData.bind(this);
    if (this.compass) {
        // get data from the python server
    }
    return this.INIT_STATE;
  },

  deregisterFromCompass() {
    deactivate(this.appRegistry);
  },

  returnPromise(func, arg) {
    return new Promise(func.bind(this, arg));
  },

  loadData() {
    console.log('loading data');
    Promise.all([

    ]).then(() => {
        console.log('data loaded');
        this.setState(this.data);
    });
  },

  checkMetric(metric) {
    this.data.metrics[metric].checked = !this.data.metrics[metric].checked
    console.log("checked: " + this.data.metrics[metric].checked);
    this.setState(this.data);
    this.trigger(this.state);
  },

  getMockProps() {
    return {
      "metrics": {
        "serverStatus.globalLock.currentQueue.writers": {
          "displayName": "server_queued_writers",
          "heatMapCode": "A",
          "checked": false,
          "mean": 0.3,
          "min": 0,
          "max": 10,
          "title": "#",
          "values": [
            {"date": new Date(1370001284000),
             "value": 0, "type": "normal"},
            {"date": new Date(1370001285000),
             "value": 1, "type": "normal"},
            {"date": new Date(1370001286000),
             "value": 1, "type": "normal"},
            {"date": new Date(1370001287000),
              "value": 4, "type": "outlier"},
            {"date": new Date(1370001288000),
               "value": 19, "type": "outlier"},
            {"date": new Date(1370001289000),
                "value": 3, "type": "normal"}
          ]
        },
        "serverStatus.globalLock.currentQueue.readers": {
          "displayName": "server_queued_readers",
          "heatMapCode": "B",
          "checked": false,
          "mean": 0.6,
          "min": 0,
          "max": 14,
          "title": "#",
          "values": [
            {"date": new Date(1370001284000),
             "value": 3, "type": "normal"},
            {"date": new Date(1370001285000),
             "value": 2, "type": "normal"},
            {"date": new Date(1370001286000),
             "value": 11, "type": "outlier"},
            {"date": new Date(1370001287000),
              "value": 4, "type": "normal"},
            {"date": new Date(1370001288000),
               "value": 0, "type": "normal"},
            {"date": new Date(1370001289000),
                "value": 0, "type": "normal"}
          ]
        },
        "serverStatus.wiredTiger.cache.bytes currently in the cache": {
          "displayName": "server_cache_bytes",
          "heatMapCode": "C",
          "checked": false,
          "mean": 1024,
          "min": 700,
          "max": 1730,
          "title": "bytes",
          "values": [
            {"date": new Date(1370001284000),
             "value": 1000, "type": "normal"},
            {"date": new Date(1370001285000),
             "value": 1300, "type": "outlier"},
            {"date": new Date(1370001286000),
             "value": 1333, "type": "outlier"},
            {"date": new Date(1370001287000),
              "value": 1730, "type": "outlier"},
            {"date": new Date(1370001288000),
               "value": 800, "type": "normal"},
            {"date": new Date(1370001289000),
                "value": 700, "type": "normal"}
          ]
        },
        "serverStatus.opcounters.insert": {
          "displayName": "inserts_per_sec",
          "heatMapCode": "D",
          "checked": false,
          "mean": 1300,
          "min": 100,
          "max": 2400,
          "title": "#",
          "values": [
            {"date": new Date(1370001284000),
             "value": 1200, "type": "normal"},
            {"date": new Date(1370001285000),
             "value": 1400, "type": "normal"},
            {"date": new Date(1370001286000),
             "value": 2000, "type": "normal"},
            {"date": new Date(1370001287000),
              "value": 2400, "type": "outlier"},
            {"date": new Date(1370001288000),
               "value": 1954, "type": "outlier"},
            {"date": new Date(1370001289000),
                "value": 100, "type": "normal"}
          ]
        }
      },
      "correlations": [
        {"MetricOne": "A", "MetricTwo": "B", "Score": 0.3},
        {"MetricOne": "A", "MetricTwo": "C", "Score": 0.7},
        {"MetricOne": "A", "MetricTwo": "D", "Score": 0.4},
        {"MetricOne": "B", "MetricTwo": "C", "Score": 0.1},
        {"MetricOne": "B", "MetricTwo": "D", "Score": 0.3},
        {"MetricOne": "C", "MetricTwo": "D", "Score": 0.9},
      ]
    };
  }
});

export default FTDCAnalysisStore;
export {FTDCAnalysisStore};
