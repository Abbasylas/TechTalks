/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node runner uses CommonJS and NODE_PATH for bundled Playwright. */
// Run with the bundled Playwright module available through NODE_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const evidence = path.resolve(__dirname, '../output/playwright');
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 960, height: 720 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const results = [];
  try {
    await page.goto(process.env.POC_BASE_URL ?? 'http://127.0.0.1:3000', { waitUntil: 'networkidle' });
    const boxes = page.getByRole('checkbox');
    assert.equal(await boxes.count(), 3);
    await page.getByRole('checkbox', { name: 'Sword control', exact: true }).focus();
    async function verify(action, count) {
      await page.waitForFunction((expected) =>
        document.querySelector('[data-testid="count"]').textContent === `${expected} / 3`, count);
      const checked = await boxes.evaluateAll((elements) => elements.filter((el) => el.checked).length);
      const countText = await page.getByTestId('count').innerText();
      const percentText = await page.getByTestId('percentage').innerText();
      assert.equal(checked, count, action);
      assert.equal(countText, `${checked} / 3`, action);
      assert.equal(percentText, `${Math.round(checked / 3 * 100)}%`, action);
      assert.ok(checked >= 0 && checked <= 3);
      results.push({ action, count: countText, percentage: percentText, result: 'PASS' });
    }
    await verify('Start with no tasks complete', 0);
    await page.screenshot({ path: path.join(evidence, 'poc-initial.png'), fullPage: true });
    await boxes.nth(0).check();
    await verify('Complete one task', 1);
    await boxes.nth(1).check();
    await verify('Complete a second task', 2);
    await boxes.nth(2).check();
    await verify('Complete all tasks', 3);
    await boxes.nth(0).uncheck();
    await verify('Undo one completed task', 2);
    await page.screenshot({ path: path.join(evidence, 'poc-after-undo.png'), fullPage: true });
    for (let i = 0; i < 20; i++) {
      await boxes.nth(0).click();
      await verify(`Repeated toggle ${i + 1}`, i % 2 === 0 ? 3 : 2);
    }
    // Exercise all eight possible combinations, changing tasks in varied order.
    for (let mask = 0; mask < 8; mask++) {
      for (let i = 2; i >= 0; i--) await boxes.nth(i).setChecked(Boolean(mask & (1 << i)));
      await verify(`Combination ${mask.toString(2).padStart(3, '0')}`, mask.toString(2).replaceAll('0', '').length);
    }
    await page.reload({ waitUntil: 'networkidle' });
    await verify('Refresh preserves all completed tasks', 3);
    await boxes.nth(0).uncheck();
    await page.reload({ waitUntil: 'networkidle' });
    await verify('Refresh preserves undone completion', 2);
    await boxes.nth(0).focus();
    await page.keyboard.press('Space');
    await verify('Keyboard Space completes a task', 3);
    await page.keyboard.press('Space');
    await verify('Keyboard Space undoes completion', 2);
    await page.screenshot({ path: path.join(evidence, 'poc-persisted.png'), fullPage: true });
    await page.evaluate(() => localStorage.setItem('asta-training-completion-v1', '{broken'));
    await page.reload({ waitUntil: 'networkidle' });
    await verify('Malformed saved data falls back safely', 0);
    await boxes.nth(0).check();
    await page.reload({ waitUntil: 'networkidle' });
    await verify('A new toggle repairs malformed saved data', 1);
    await page.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
      Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    });
    await page.reload({ waitUntil: 'networkidle' });
    await verify('Unavailable storage falls back safely', 0);
    await boxes.nth(0).check();
    await verify('Tasks remain usable when storage is blocked', 1);
    assert.match(await page.locator('main > p:last-child').innerText(), /saving is unavailable/);
    await page.setViewportSize({ width: 320, height: 720 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: path.join(evidence, 'poc-mobile.png'), fullPage: true });
    assert.deepEqual(errors, []);
    const report = { environment: 'Local Next.js development server, headless Chromium', checks: results, repeatedToggles: 20, allCombinationsChecked: 8, mobileWidth: 320, horizontalOverflow: false, pageErrors: errors };
    fs.writeFileSync(path.join(evidence, 'poc-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
