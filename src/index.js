import FTDCAnalysisPlugin from './plugin';
import {FTDCAnalysisStore} from 'stores';

/**
 * @param {Object} appRegistry - The Hadron appRegisrty to activate this plugin with.
 **/

const INSTANCE_TAB_ROLE = {
  component: FTDCAnalysisPlugin,
  name: 'Metric Anomalies',
  order: 3
};

function activate(appRegistry) {
  appRegistry.registerRole('Instance.Tab', INSTANCE_TAB_ROLE);
  appRegistry.registerStore('FTDCAnalysis.Store', FTDCAnalysisStore);
}

/**
 * Deactivate all the components in the FTDC Analysis package.
 * @param {Object} appRegistry - The Hadron appRegisrty to deactivate this plugin with.
 **/
function deactivate(appRegistry) {
  appRegistry.deregisterRole('Instance.Tab', INSTANCE_TAB_ROLE);
  // De-register Stores
  appRegistry.deregisterStore('FTDCAnalysis.Store');
}

export default FTDCAnalysisPlugin;
export {
  activate,
  deactivate
};
