
// Preprocess feature files into _Temp/execution before exporting config.
// This ensures Step Groups, Examples data filters, SmartIQ, and variable replacement are applied.
const fs = require('fs');
const path = require('path');

function runPreprocessingOnce() {
  if (process.env.PLAYQ_PREPROCESSED) return; // idempotent guard
  try {
    const { generateStepGroupsIfNeeded } = require('@playq/core/dist/exec/sgGenerator.js');
    const { preprocessFeatureFile } = require('@playq/core/dist/exec/featureFilePreProcess.js');

    // 1. Generate / refresh Step Group cache & step defs
    generateStepGroupsIfNeeded(false);

  // 2. Preprocess each source feature under tests/bdd/scenarios --> _Temp/execution
  const srcRoot = path.resolve('tests/bdd/scenarios');
    const outRoot = path.resolve('_Temp/execution');
    fs.mkdirSync(outRoot, { recursive: true });
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir)) {
        const full = path.join(dir, entry);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full); else if (entry.endsWith('.feature')) preprocessFeatureFile(full);
      }
    };
    if (fs.existsSync(srcRoot)) walk(srcRoot);
    process.env.PLAYQ_PREPROCESSED = '1';
    console.log('✅ Cucumber preprocessing complete: _Temp/execution');
  } catch (err) {
    console.error('❌ Preprocessing failed (features may not expand Step Groups):', err);
  }
}

runPreprocessingOnce();

module.exports = {
    default: {
        formatOptions: {
            snippetInterface: "async-await"
        },
        // Execute only processed feature files
        paths: ["./_Temp/execution/**/*.feature"],
        dryRun: false,
    require: [
      // Enable TS support and path aliases
      "ts-node/register",
      "tsconfig-paths/register",
      // Register parameter types BEFORE any step definitions using {param}
      "./playq/config/cucumber/parameterHook.ts",
            // Step group step definitions are loaded via the project shim (test/steps/playq-core.steps.ts)
      // Global timeouts for steps/hooks
      "./playq/config/cucumber/timeouts.ts",
            // Generated Step Group step definitions
            "./tests/bdd/steps/_step_group/stepGroup_steps.ts",
            // Core step defs shim (imports @playq/core dist step-defs)
            "./playq/config/cucumber/playq-core.steps.ts",
            // Local aliases and project step defs
            "./tests/bdd/steps/**/*.ts",
            // Project addons (steps + actions)
            "./playq/addons/**/*.ts",
            // Cucumber hooks (project-level)
            "./playq/config/cucumber/hooks.ts"
        ],
        requireModule: [
            "ts-node/register",
            "tsconfig-paths/register"
        ],
        format: [
            "progress-bar",
            "html:test-results/cucumber-report.html",
            "json:test-results/cucumber-report.json",
            "rerun:@rerun.txt"
        ],
        parallel: 1
    },
    // rerun: {
    //     formatOptions: {
    //         snippetInterface: "async-await"
    //     },
    //     dryRun: false,
  //     require: [
  //         "ts-node/register",
  //         "tsconfig-paths/register",  // <-- added for rerun profile as well
  //         "./tests/bdd/steps/**/*.ts",
  //         "./src/hooks/hooks.ts"
  //     ],
    //     requireModule: [
    //         "ts-node/register"
    //     ],
    //     format: [
    //         "progress-bar",
    //         "html:test-results/cucumber-report.html",
    //         "json:test-results/cucumber-report.json",
    //         "rerun:@rerun.txt"
    //     ],
    //     parallel: 2
    // }
}