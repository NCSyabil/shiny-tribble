// playwright.global-setup.ts
import 'tsconfig-paths/register';
// import { setupEnvAndBrowser } from '../../src/hooks/testLifecycleHooks';

export default async () => {
  process.env.TEST_RUNNER = 'playwright';
  console.log('🔧 Global setup: tsconfig-paths/register loaded');

  // await setupEnvAndBrowser();
};


// // playwright.global-setup.ts
// // tsconfig-paths is registered in the JS shim (playwright.config.js)
// // This global setup ensures PlayQ environment is initialized before tests run.

// import path from 'path';

// export default async () => {
//   process.env.TEST_RUNNER = 'playwright';
//   console.log('🔧 Global setup: tsconfig-paths/register loaded');

//   // Ensure PLAYQ_PROJECT_ROOT is set to the project root (relative to this file)
//   process.env.PLAYQ_PROJECT_ROOT = process.env.PLAYQ_PROJECT_ROOT || path.resolve(__dirname, '../../../');
//   process.env.PLAYQ_CORE_ROOT = process.env.PLAYQ_CORE_ROOT || path.resolve(__dirname, '../../../../PlayQ_NPM_CORE/dist');

//   // Some launchers (VS Code Play) may start with a different CWD. Force CWD to project root
//   try {
//     const cwdBefore = process.cwd();
//     if (cwdBefore !== process.env.PLAYQ_PROJECT_ROOT) {
//       process.chdir(process.env.PLAYQ_PROJECT_ROOT);
//       console.log(`ℹ️ Changed CWD to PLAYQ_PROJECT_ROOT: ${process.env.PLAYQ_PROJECT_ROOT}`);
//     }
//   } catch (err) {
//     console.warn('⚠️ Could not change CWD to PLAYQ_PROJECT_ROOT:', err && (err as any).message ? (err as any).message : err);
//   }

//   // Try to load and run PlayQ pretest/setupEnvironment in-process.
//   let setupEnvironment: any = null;
//   try {
//     const pkgJsonPath = require.resolve('@playq/core/package.json');
//     const pkgRoot = path.dirname(pkgJsonPath);
//     // require compiled dist pretest
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const mod = require(path.join(pkgRoot, 'dist', 'scripts', 'pretest.js'));
//     setupEnvironment = mod && (mod.setupEnvironment || (mod.default && mod.default.setupEnvironment)) || mod.setupEnvironment;
//     console.log('✅ Loaded PlayQ pretest from @playq/core (via package root)');
//   } catch (err1) {
//     console.log('ℹ️ Could not load @playq/core pretest from node_modules, trying workspace dist...');
//     try {
//       const candidate = path.resolve(process.env.PLAYQ_CORE_ROOT, 'scripts/pretest.js');
//       // eslint-disable-next-line @typescript-eslint/no-var-requires
//       const mod2 = require(candidate);
//       setupEnvironment = mod2 && (mod2.setupEnvironment || (mod2.default && mod2.default.setupEnvironment)) || mod2.setupEnvironment;
//       console.log('✅ Loaded PlayQ pretest from', candidate);
//     } catch (err2) {
//       console.warn('⚠️ PlayQ pretest could not be resolved; skipping pretest.');
//     }
//   }

//   if (typeof setupEnvironment === 'function') {
//     try {
//       setupEnvironment();
//       console.log('✅ PlayQ setupEnvironment() executed successfully');
//     } catch (err) {
//       console.error('❌ Error running PlayQ setupEnvironment():', err);
//       throw err;
//     }
//   } else {
//     console.log('ℹ️ No setupEnvironment() function found; skipping PlayQ pretest tasks');
//   }
// };

