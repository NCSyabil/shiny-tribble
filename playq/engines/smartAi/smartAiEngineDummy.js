// smartAiEngineDummy.js
/**
 * Dummy SmartAI function to fallback when addon is not available.
 * @param {import('@playwright/test').Page} page
 * @param {string} type
 * @param {string} selector
 * @param {'before' | 'after' | ''} [smartRefresh='']
 * @returns {import('@playwright/test').Locator}
 */
export async function smartAI(page, type, selector, smartRefresh = '') {
    console.warn(`❌ SmartAI module not found or invalid`);
    throw new Error(`❌ SmartAI module not found or invalid`);
  return page.locator(selector); // fallback to raw selector
}