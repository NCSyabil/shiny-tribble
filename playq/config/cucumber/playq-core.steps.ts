// This shim makes PlayQ core step definitions visible to VS Code Cucumber plugins
// and available to cucumber-js at runtime without needing to scan node_modules TS sources.
// Import from the published JS (dist) to avoid subpath export issues.

import '@playq/core/dist/helper/actions/webStepDefs.js';
import '@playq/core/dist/helper/actions/commStepDefs.js';
import '@playq/core/dist/helper/actions/stepGroupStepDefs.js';
