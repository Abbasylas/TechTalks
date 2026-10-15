/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS browser verification. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const output = path.resolve(__dirname, '../output/playwright');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) failedRequests.push({ url: new URL(response.url()).pathname, status: response.status() }); });
  const checks = [];
  const record = (name, detail) => checks.push({ name, result: 'PASS', detail });
  try {
    const response = await page.goto(process.env.POC_BASE_URL ?? 'http://localhost:3000', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.getByRole('checkbox').first().waitFor();
    await page.waitForFunction(() => !document.querySelector('input[type="checkbox"]').disabled);
    await page.evaluate(() => document.fonts.ready);
    assert.match(await page.title(), /Asta.*Preparation Dashboard/);
    assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
    assert.match(await page.locator('header').innerText(), /Lucifero is the threat ahead/);
    record('Goal and threat', 'Asta title and brief Lucifero introduction present.');
    const expected = [
      ['Sword control', 'Practise precise anti-magic sword movements.', 'High priority'],
      ['Physical endurance', 'Complete a focused strength and stamina session.', 'Medium priority'],
      ['Team coordination', 'Review a preparation plan with the Black Bulls.', 'High priority'],
    ];
    const cards = page.locator('.task-card');
    assert.equal(await cards.count(), 3);
    for (let i = 0; i < expected.length; i++) {
      for (const text of expected[i]) assert.ok((await cards.nth(i).innerText()).includes(text));
      assert.equal(await page.getByRole('checkbox', { name: expected[i][0], exact: true }).count(), 1);
    }
    record('Task content and names', 'All three exact names, descriptions, priorities, and accessible checkbox names match.');
    assert.match(await page.locator('main').innerText(), /Progress measures preparation-plan completion/);
    record('Progress meaning', 'Visible preparation-plan completion explanation.');
    const boxes = page.getByRole('checkbox');
    for (let mask = 0; mask < 8; mask++) {
      for (let i = 0; i < 3; i++) await boxes.nth(i).setChecked(Boolean(mask & (1 << i)));
      const count = mask.toString(2).replaceAll('0', '').length;
      const percentage = Math.round(count / 3 * 100);
      assert.equal(await page.getByTestId('count').innerText(), `${count} / 3`);
      assert.equal(await page.getByTestId('percentage').innerText(), `${percentage}%`);
      assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuenow'), String(percentage));
      assert.equal(await page.getByTestId('progress-fill').evaluate(el => el.style.width), `${percentage}%`);
      assert.ok(percentage >= 0 && percentage <= 100);
      assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuemin'), '0');
      assert.equal(await page.getByRole('progressbar').getAttribute('aria-valuemax'), '100');
    }
    record('Progress bar and bounds', 'All 8 combinations: count, percentage, fill width and accessible progress values agree, 0–100%.');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByTestId('percentage').innerText(), '100%');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').innerText(), 'Skip to training plan');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'sword-control');
    const focus = await page.locator(':focus').evaluate(el => ({ width: getComputedStyle(el).outlineWidth, style: getComputedStyle(el).outlineStyle }));
    assert.equal(focus.width, '3px');
    assert.equal(focus.style, 'solid');
    await page.keyboard.press('Space');
    assert.equal(await page.getByTestId('percentage').innerText(), '67%');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'sword-control');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'physical-endurance');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('id'), 'team-coordination');
    record('Keyboard and focus', 'Tab reaches skip link and all three checkboxes in task order. Space undoes completion; 3px focus outline remains.');
    await page.getByRole('checkbox', { name: 'Sword control', exact: true }).focus();
    await page.screenshot({ path: path.join(output, 'mvp-keyboard-focus.png'), fullPage: true });
    await boxes.nth(1).uncheck();
    await boxes.nth(2).uncheck();
    await page.locator('h1').click();
    const live = page.locator('[aria-live="polite"][aria-atomic="true"]');
    assert.equal(await live.count(), 1);
    assert.match(await live.innerText(), /0% preparation-plan completion/);
    record('Assistive markup', 'Labelled checkboxes, described task text/status, named progressbar and atomic polite live summary. Spoken output not manually tested.');
    for (const width of [1440, 360, 320]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      const targets = await page.locator('.checkbox-target').evaluateAll(elements => elements.map(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height })));
      assert.ok(targets.every(target => target.width >= 44 && target.height >= 44));
      const descriptionSize = await page.locator('#sword-control-description').evaluate(el => getComputedStyle(el).fontSize);
      assert.equal(descriptionSize, '16px');
      await page.screenshot({ path: path.join(output, `mvp-${width}.png`), fullPage: true });
      record(`Layout at ${width}px`, 'No horizontal overflow; all completion targets at least 44 × 44px; descriptions 16px. Screenshot captured.');
    }
    assert.equal(await page.locator('main button').count(), 0);
    assert.equal(await page.locator('main a').count(), 0);
    record('No pretend actions', 'Only functional task inputs and a skip link; no decorative dashboard buttons or extra navigation.');
    const images = await page.locator('img').evaluateAll(elements => elements.map(el => ({ src: el.getAttribute('src'), loaded: el.complete && el.naturalWidth > 0 })));
    assert.equal(images.length, 3);
    assert.ok(images.every(image => image.loaded));
    record('Original artwork', 'All three local images load: supplied background, Asta, and Lucifero.');
    const colours = await page.evaluate(() => {
      const colour = (selector, property) => getComputedStyle(document.querySelector(selector))[property];
      return {
        foreground: colour('body', 'color'),
        muted: colour('#sword-control-description', 'color'),
        crimson: colour('[data-testid="percentage"]', 'color'),
        gold: colour('.text-gold', 'color'),
        surface: colour('.dashboard-panel', 'backgroundColor'),
        track: colour('[role="progressbar"]', 'backgroundColor'),
        checkbox: colour('.task-checkbox', 'borderTopColor'),
      };
    });
    function luminance(colour) {
      const values = colour.startsWith('#')
        ? colour.slice(1).match(/.{2}/g).map(x => parseInt(x, 16))
        : colour.match(/[\d.]+/g).slice(0, 3).map(Number);
      const channels = values.map(x => x / 255).map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }
    const ratio = (a, b) => { const l = [luminance(a), luminance(b)].sort((x, y) => y - x); return (l[0] + 0.05) / (l[1] + 0.05); };
    const contrast = {};
    for (const token of ['foreground', 'muted', 'crimson', 'gold']) {
      contrast[`${token}/surface`] = Number(ratio(colours[token], colours.surface).toFixed(2));
      assert.ok(contrast[`${token}/surface`] >= 4.5);
    }
    contrast['progress/track'] = Number(ratio(colours.crimson, colours.track).toFixed(2));
    contrast['checkbox/surface'] = Number(ratio(colours.checkbox, colours.surface).toFixed(2));
    assert.ok(contrast['progress/track'] >= 3);
    assert.ok(contrast['checkbox/surface'] >= 3);
    record('Colour contrast', contrast);
    assert.deepEqual(errors, []);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(failedRequests, []);
    const result = { server: process.env.POC_BASE_URL ?? 'http://localhost:3000', checks, pageErrors: errors, consoleErrors, failedRequests, limitations: ['Actual screen-reader spoken announcements not tested.', 'Only Chromium tested; no physical-device browser testing.', 'Automated contrast covers specified foreground/control pairs, not every possible OS rendering.'] };
    fs.writeFileSync(path.join(output, 'mvp-results.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
