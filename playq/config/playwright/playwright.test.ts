import { test as base, expect } from '@playwright/test';
import '@playwright-hook'; // Hooks file (now using @playq/core exports internally)

export { base as test, expect };
