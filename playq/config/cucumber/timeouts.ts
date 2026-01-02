import { setDefaultTimeout } from '@cucumber/cucumber';
// Increase default step/hook timeout to 60s to allow browser launch and env setup
setDefaultTimeout(60 * 1000);
