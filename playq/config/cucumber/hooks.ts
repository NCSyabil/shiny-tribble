import { BeforeAll, Before, After, AfterAll } from '@cucumber/cucumber';
import { setupEnvAndBrowser, shutdownBrowser } from './testLifecycleHooks';
import { handleScenarioSetup } from './scenarioHooks';
import { handleScenarioTeardown, setAttachFn } from './supportHooks';
import { webFixture, logFixture } from '@src/global';
import { isPlaywrightRunner, isCucumberRunner } from '@config/runner';
import { loadEnv } from '@src/helper/bundle/env';

if (isPlaywrightRunner()) {
  console.warn('⚠️ Skipping getWorld() in Playwright Runner');
}
loadEnv();
import './parameterHook';
import '@src/exec/preLoader'; // Ensure preLoader from @playq/core runs before hooks

BeforeAll(async function () {
  await setupEnvAndBrowser();
});

Before({ tags: 'not @auth' }, async function (ctx) {
  await handleScenarioSetup(ctx, false);
  setAttachFn(this.attach);
  webFixture.setWorld(this); //
});

Before({ tags: '@auth' }, async function (ctx) {
  await handleScenarioSetup(ctx, true);
  setAttachFn(this.attach);
  webFixture.setWorld(this); //
});

After(async function (ctx) {
  // If any soft assertion failures were logged, mark scenario as failed
  const world = this as any;
  if (world.softAssertionFailed) {
    const failedStep = world.softAssertionStep || 'Unknown Step';
    throw new Error(
      `❌ Soft assertion(s) failed at step: "${failedStep}" in scenario: "${ctx.pickle.name}"`
    );
  }

  await handleScenarioTeardown.call(this, ctx);
});

AfterAll(async function () {
  await shutdownBrowser();
  console.log('[PlayQ DEBUG] AfterAll hook complete.');
});
