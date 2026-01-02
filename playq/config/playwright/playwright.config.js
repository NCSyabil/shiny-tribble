// Ensure ts-node uses the project's tsconfig when workspace root doesn't contain one
const fs = require('fs');
const path = require('path');
const projectTsconfigPath = path.resolve(__dirname, '../../../tsconfig.json');
try {
  const cwdTsconfig = path.resolve(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(cwdTsconfig) && fs.existsSync(projectTsconfigPath)) {
    // Point ts-node at the project tsconfig so it compiles with the right options
    process.env.TS_NODE_PROJECT = projectTsconfigPath;
  }
} catch (err) {
  // ignore
}

// Register ts-node programmatically with explicit project to avoid
// picking up a different tsconfig or incompatible defaults which can
// lead to weird compile-time helper collisions (e.g. _interopRequireWildcard).
// We prefer transpileOnly here so Playwright's own loader/runner handles
// runtime behavior; if you want full type-checking, remove transpileOnly.
require('ts-node').register({
  project: projectTsconfigPath,
  transpileOnly: true,
  // Ensure common interop helpers are emitted consistently
  compilerOptions: { esModuleInterop: true }
});
// Force tsconfig-paths to use this project's tsconfig.json explicitly
const tsConfigPaths = require('tsconfig-paths');

// Try loading tsconfig from current working directory first; if not found, fall back to project-level tsconfig
let configLoader = tsConfigPaths.loadConfig(process.cwd());
if (configLoader.resultType !== 'success') {
  // resolve project tsconfig relative to this file (playq/config/playwright)
  const projectTsconfig = projectTsconfigPath;
  configLoader = tsConfigPaths.loadConfig(projectTsconfig);
}

if (configLoader.resultType === 'success') {
  const baseUrl = configLoader.absoluteBaseUrl || (configLoader.config && configLoader.config.absoluteBaseUrl);
  const paths = configLoader.paths || (configLoader.config && configLoader.config.paths);
  if (baseUrl && paths) {
    tsConfigPaths.register({ baseUrl, paths });
  }
} else {
  require('tsconfig-paths/register');
}

// Delegate to the TypeScript config after loaders are in place
module.exports = require('./playwright.config.ts');