import ClusterHealthPlugin from './plugin';
import {ClusterHealthStore} from 'stores';

/**
 * @param {Object} appRegistry - The Hadron appRegisrty to activate this plugin with.
 **/

const INSTANCE_TAB_ROLE = {
  component: ClusterHealthPlugin,
  name: 'CLUSTER HEALTH',
  order: 3
};

function activate(appRegistry) {
  // Register RecentQueryCollection
  appRegistry.registerRole('Instance.Tab', INSTANCE_TAB_ROLE);

  // Register Stores
  appRegistry.registerStore('ClusterHealth.Store', ClusterHealthStore);
}

/**
 * Deactivate all the components in the Cluster Health package.
 * @param {Object} appRegistry - The Hadron appRegisrty to deactivate this plugin with.
 **/
function deactivate(appRegistry) {
  appRegistry.deregisterRole('Instance.Tab', INSTANCE_TAB_ROLE);
  // De-register Stores
  appRegistry.deregisterStore('ClusterHealth.Store');
}

export default ClusterHealthPlugin;
export {
  activate,
  deactivate
};
