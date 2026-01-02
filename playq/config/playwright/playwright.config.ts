// playwright.config.ts
import { defineConfig } from '@playwright/test';
import * as path from 'path';
import { execFileSync } from 'child_process';
import * as fs from 'fs';

// Ensure the project-level "pretest" script runs before the Playwright
// config evaluation. We run it synchronously so that environment/fixtures
// it prepares are available when the rest of this file executes. This
// is useful when launching tests from VS Code (Play button) because the
// Playwright runner loads this config file directly.
if (!process.env.PLAYQ_PRETEST_LOADED) {
  try {
    // Try resolving the pretest script directly. If the package layout
    // is non-standard (monorepo, workspace), fall back to resolving the
    // package main and constructing the path to dist/scripts/pretest.js
    let pretestPath: string | undefined;
    try {
      pretestPath = require.resolve('@playq/core/dist/scripts/pretest');
    } catch {
      const coreMain = require.resolve('@playq/core');
      const candidate = path.resolve(path.dirname(coreMain), 'dist', 'scripts', 'pretest.js');
      if (fs.existsSync(candidate)) {
        pretestPath = candidate;
      } else {
        // try one level up if package main points into dist already
        const candidate2 = path.resolve(path.dirname(coreMain), '..', 'dist', 'scripts', 'pretest.js');
        if (fs.existsSync(candidate2)) pretestPath = candidate2;
      }
    }

    if (!pretestPath) throw new Error('pretest script not found in @playq/core');

  // Run the pretest script in a separate Node process so it doesn't
  // interfere with ts-node/module state. We inherit stdio so logs
  // are visible in the VS Code terminal.
  // Log explicitly so the VS Code terminal shows the preloader ran.
  // eslint-disable-next-line no-console
  console.log('⏳ Running playq pretest:', pretestPath);
  execFileSync(process.execPath, [pretestPath], { stdio: 'inherit' });
    process.env.PLAYQ_PRETEST_LOADED = '1';
  } catch (e: any) {
    // Don't fail the config load; just warn so tests can still run.
    // If pretest is essential, remove the try/catch so failures surface.
    // eslint-disable-next-line no-console
    console.warn('⚠️ playq pretest loader failed:', e && e.message ? e.message : e);
  }
}
// Direct imports to avoid alias resolution issues during packaging
// Use public entrypoint from @playq/core
import { loadEnv, vars } from '@playq/core';
const { getConfigValue, getValue, initVars } = vars as any;

loadEnv();
// Ensure config/variables are loaded in this process (ts-node is registered by JS shim)
if (typeof initVars === 'function') {
  try { initVars(); } catch (e: any) {}
}

console.log('🌐 Loaded environment variables:');
console.log('🌐 browser.browserType:', getConfigValue('browser.browserType'));
console.log('🌐 testExecution.timeout:', getConfigValue('testExecution.timeout'));

// Resolve project root from this config file's directory
const PROJECT_ROOT = path.resolve(__dirname, '../../../');

export default defineConfig({
  globalSetup: require.resolve('./playwright.global-setup'),
  globalTeardown: require.resolve('./playwright.global-teardown'),
  testDir: path.resolve(PROJECT_ROOT, 'tests/playwright'),
  // Ensure all artifacts are written to the project root, not under playq/config
  outputDir: path.resolve(PROJECT_ROOT, 'test-results'),
  workers: 1, // prevent multiple browsers in this template
  timeout: Number(getConfigValue('testExecution.timeout')),
  retries: 0,
  reporter: [
    ['html', { open: 'never', outputFolder: path.resolve(PROJECT_ROOT, 'playwright-report') }],
    ['json', { outputFile: path.resolve(PROJECT_ROOT, 'playwright-report/playwright-report.json') }],
    ['allure-playwright', { outputFolder: path.resolve(PROJECT_ROOT, 'allure-results') }],
    ['junit', { outputFile: path.resolve(PROJECT_ROOT, 'test-results/e2e-junit-results.xml') }]
  ],
  use: {
    browserName: getValue('config.browser.browserType') as 'chromium' | 'firefox' | 'webkit',
    headless: false,
    baseURL: 'https://ncs.co/',
    viewport: { width: 1480, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'on',
    actionTimeout: Number(getConfigValue('testExecution.actionTimeout')),
    navigationTimeout: Number(getConfigValue('testExecution.navigationTimeout')),
  },
});
