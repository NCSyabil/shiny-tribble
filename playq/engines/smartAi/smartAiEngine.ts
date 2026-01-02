/* Duplicate minimal SmartAI implementation removed to avoid redeclaration. The advanced SmartAI engine below is the canonical export. */
import { Page as PWPage, Locator } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';
import { webFixture, vars } from '@playq/core';

import { smartDataRules } from './smartAiRuleMap';

declare global {
  interface Window {
    extractSmartLoc: () => any[];
  }
}

const isSmartIQConsoleLogEnabled = (String(vars.getConfigValue('smartAI.consoleLog')).toLowerCase().trim() === 'true') ? true : false;
const smartIQResolveMode = (String(vars.getConfigValue('smartAI.resolve')).toLowerCase().trim() === 'always') ? 'always' : 'smart';

// Local helpers
function isXPath(selector: string): boolean {
  return selector?.startsWith('/') || selector?.startsWith('(');
}
function isCss(selector: string): boolean {
  return !!selector && !isXPath(selector);
}

const keyMap: Record<string, string> = {
  tp: 'type',
  lb: 'label',
  tx: 'text',
  cs: 'css',
  xp: 'xpath',
  tg: 'tag',
  pi: 'parentIndex',
  i: 'index',
  at: 'attributes',
  pos: 'position',
  fs: 'fieldset',
  ld: 'labelDetection'
};

const attributeKeyMap: Record<string, string> = {
  cl: 'class',
  id: 'id',
  rl: 'role',
  al: 'aria-label',
  nm: 'name',
  ph: 'placeholder',
  vl: 'value',
  tp: 'type',
  ck: 'checked',
};

function expandKeys(obj: Record<string, any>): Record<string, any> {
  const expanded: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'at' && typeof value === 'object') {
      const attrExpanded: Record<string, string> = {};
      for (const [attrKey, attrValue] of Object.entries(value)) {
        attrExpanded[attributeKeyMap[attrKey] || attrKey] = String(attrValue);
      }
      expanded['attributes'] = attrExpanded;
    } else {
      expanded[keyMap[key] || key] = value;
    }
  }
  return expanded;
}

async function runSmartAi(page: PWPage) {
  const scriptPath = path.resolve(__dirname, 'smartAiLocScript.js');
  let elements: any;
  try {
    await page.waitForSelector('body', { state: 'attached' });
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("load");
    await page.waitForTimeout(1000);
    await page.addScriptTag({ path: scriptPath });
    await page.waitForFunction(() => typeof window.extractSmartLoc === 'function');
    elements = await page.evaluate(() => window.extractSmartLoc());
  } catch (err) {
    console.error('❌ Error evaluating SmartIQ script:', err);
    elements = [];
  }

  if (!Array.isArray(elements)) {
    console.warn('⚠️ SmartIQ script did not return an array. Falling back to empty array.');
    elements = [];
  }

  webFixture.setSmartIQData(elements);
  if (isSmartIQConsoleLogEnabled) console.log(`✅ SmartAI data captured: ${elements.length} elements`);

  const outputDir = path.resolve('_Temp', 'smartAI');
  const outputFile = path.join(outputDir, `smartAI-${Date.now()}.json`);
  try { fs.mkdirSync(outputDir, { recursive: true }); } catch {}
  try { fs.writeFileSync(outputFile, JSON.stringify(elements, null, 2), 'utf-8'); } catch {}
  if (isSmartIQConsoleLogEnabled) console.log(`📝 SmartAI JSON saved to: ${outputFile}`);
}

export async function smartAi(page: PWPage, type: string, selector: string, smartRefresh: 'before' | 'after' | '' = ''): Promise<Locator> {
  console.log(`🔍 Resolving SmartAI locator: ${selector} (Type: ${type}) (smartRefresh: ${smartRefresh})`);
  let smartData: any[] = webFixture.getSmartIQData();
  let expandedSmartData: any[] = [];
  

  let needsRefresh = false;
  if (smartRefresh.toLowerCase() === 'before') {
    console.log(`ℹ️ Refreshing SmartAI data before resolving selector: ${selector}`);
    needsRefresh = true;
  } else if (smartIQResolveMode === 'always') {
    console.log(`📣 SmartAI in "always" mode: Extracting data for every lookup.`);
    needsRefresh = true;
  } else if (smartIQResolveMode === 'smart' && (!smartData || smartData.length === 0)) {
    console.log(`ℹ️ SmartAI in "smart" mode: No cached data, injecting SmartAI script...`);
    needsRefresh = true;
  }

  if (needsRefresh) {
    await runSmartAi(page);
    smartData = webFixture.getSmartIQData();
  }

  expandedSmartData = smartData.map(expandKeys);

  let instance = 1;
  let location = '', section = '', cleanSelector = selector;
  const selectorPattern = /^(\{\{(.+?)\}\}\s*)?(\{(.+?)\}\s*)?([^\[]+)(?:\[(\d+)\])?$/;
  const match = selector.match(selectorPattern);

  if (match) {
    location = match[2]?.trim() || '';
    section = match[4]?.trim() || '';
    cleanSelector = match[5]?.trim();
    instance = match[6] ? parseInt(match[6], 10) : 1;
  }
  let matchedItemsMap: Record<string, any> = {};

  for (const ruleGroup of smartDataRules) {
    const ruleType = ruleGroup.type.toLowerCase();
    const filteredItems = expandedSmartData.filter(item => {
      const itemType = (item.type || item.tag || '').toLowerCase();
      if (ruleType === 'radio' && itemType === 'radio') return true;
      if (ruleType === 'checkbox' && itemType === 'checkbox') return true;
      if (ruleType === 'button' && (itemType === 'button' || item.tag === 'button')) return true;
      if (ruleType === 'input' && itemType !== 'radio' && itemType !== 'checkbox' && item.tag === 'input') return true;
      if (ruleType === 'dropdown' && (itemType === 'dropdown' || item.tag === 'select' || item.tag === 'button')) return true;
      if (ruleType === 'link' && itemType === 'link') return true;
      return false;
    });

    if (filteredItems.length === 0) {
      console.debug(`ℹ️ No matching items for rule type: ${ruleType}`);
      continue;
    }

    const sortedRules = [...ruleGroup.rules].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

    filteredItems.forEach(item => {
      const key = item.css || item.xpath || `${item.tag}-${item.label}-${item.text}`;
      for (const ruleObj of sortedRules) {
        if (!matchedItemsMap[key] && ruleObj.match(item, cleanSelector, { section, location })) {
          matchedItemsMap[key] = { item, priority: ruleObj.priority ?? 999, desc: ruleObj.desc };
          break;
        }
      }
    });
  }

  const matchedKeys = Object.keys(matchedItemsMap);
  let matchedItems = Object.values(matchedItemsMap);

  if (matchedItems.length === 0) {
    console.log(`❌ No match found for selector: ${selector}`);
    throw new Error(`❌ SmartIQ: Could not resolve selector: ${selector}`);
  }

  if (instance > matchedItems.length) {
    throw new Error(`❌ SmartIQ: Could not resolve instance ${instance} for selector: ${selector}. Only ${matchedItems.length} unique matches found.`);
  }

  if (isSmartIQConsoleLogEnabled) {
    console.log(`✅ All Matched Items (count: ${matchedItems.length}):`);
    matchedItems.forEach((m, idx) => {
      console.log(`  - [${idx + 1}] Priority: ${m.priority}, Rule: ${m.desc}, CSS: ${m.item.css}, Text: ${m.item.text}, Label: ${m.item.label}`);
    });
  }

  matchedItems.sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999) || (a.item?.index ?? 0) - (b.item?.index ?? 0));

  const target = matchedItems[instance - 1];

  if (!target) {
    throw new Error(`❌ SmartAI: Could not resolve instance ${instance} for selector: ${selector}`);
  }

  if (isSmartIQConsoleLogEnabled) {
    const resolvedInstance = matchedItems.indexOf(target) + 1;
    console.log(`✅ Resolved to user-requested instance ${instance}, actual matched instance ${resolvedInstance}:`, target.item);
    console.log(`✅ Locator used: ${target.item.css || target.item.xpath}`);
  }

  if (smartRefresh.toLowerCase() === 'after') {
    console.log(`ℹ️ Refreshing SmartIQ data after resolving selector: ${selector}`);
    webFixture.setSmartIQData([]);
  }

  // const finalLocator = await getVerifiedLocator(page, target.item.css, target.item.xpath);
  // return page.locator(finalLocator);
  const finalLocator = await getVerifiedLocator(page, target.item.css, target.item.xpath);
  return isXPath(finalLocator) ? page.locator(`xpath=${finalLocator}`) : page.locator(finalLocator);
}



// async function verifyLocator(page: PWPage, locator: string, type: 'css' | 'xpath'): Promise<boolean> {
//   if (type === 'css') {
//     const element = await page.$(locator);
//     return element !== null;
//   }
//   if (type === 'xpath') {
//     const elements = await page.$$(locator);
//     return elements.length > 0;
//   }
//   return false;
// }

async function verifyLocator(page: PWPage, locator: string, type: 'css' | 'xpath'): Promise<boolean> {
  if (type === 'css') {
    const elements = await page.$$(locator);
    return elements.length === 1; // ✅ Only accept if it's unique
  } else if (type === 'xpath') {
    const elements = await page.locator(`xpath=${locator}`).elementHandles();
    return elements.length === 1;
  }
  return false;
}

// async function getVerifiedLocator(page: PWPage, cssSelector: string, xpathSelector: string): Promise<string> {
//   if (await verifyLocator(page, cssSelector, 'css')) {
//     console.log(`✅ CSS Locator is valid: ${cssSelector}`);
//     return cssSelector;
//   } else if (await verifyLocator(page, xpathSelector, 'xpath')) {
//     console.warn(`⚠️ CSS Locator not valid. Falling back to XPath: ${xpathSelector}`);
//     return xpathSelector;
//   } else {
//     throw new Error(`❌ Both CSS and XPath locators are invalid. CSS: ${cssSelector}, XPath: ${xpathSelector}`);
//   }
// }

async function getVerifiedLocator(page: PWPage, cssSelector: string, xpathSelector: string): Promise<string> {
  if (isCss(cssSelector) && await verifyLocator(page, cssSelector, 'css')) {
    console.log(`✅ CSS Locator is valid: ${cssSelector}`);
    return cssSelector;
  } else if (isXPath(xpathSelector) && await verifyLocator(page, xpathSelector, 'xpath')) {
    console.warn(`⚠️ CSS Locator not valid. Falling back to XPath: ${xpathSelector}`);
    return xpathSelector;
  } else {
    throw new Error(`❌ Both CSS and XPath locators are invalid or not formatted correctly. CSS: ${cssSelector}, XPath: ${xpathSelector}`);
  }
}