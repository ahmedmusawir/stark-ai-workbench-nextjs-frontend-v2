import { test, expect } from './_policy_wrap'; // QA outer mandatory policy/error wrapper (attempt-002)
import fs from 'node:fs';
import path from 'node:path';
const evidence = path.resolve('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-002/acceptance/H/repair-copy-out');
const origin = 'http://127.0.0.1:43183';
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    if (new URL(route.request().url()).origin !== origin) {
      await route.abort(); throw Error('Unexpected external request in offline engineering check');
    }
    await route.continue();
  });
  page.on('pageerror', error => { throw error; });
});

test('F02: breakpoint teardown keeps focus on the visible current item, after close callbacks settle', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/?query=agent%3Decho');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCount(0);
  const current = page.locator('.ws-sidebar [aria-current="page"]');
  await expect(current).toHaveText('Echo');
  await expect(current).toBeVisible();
  await expect(current).toBeFocused();
  // Check after Radix's delayed close-autofocus, not just the media handler.
  await page.waitForTimeout(400);
  await expect(current).toBeFocused();
  expect(await page.locator('.ws-root').evaluate(el => (el as HTMLElement).inert)).toBe(false);
});

test('F02: no visible current item falls back to visible All agents', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/?query=agent%3Decho');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.locator('.ws-sidebar [aria-current]').evaluateAll(links => links.forEach(el => { (el as HTMLElement).style.visibility = 'hidden'; }));
  await page.setViewportSize({ width: 1200, height: 900 });
  await expect(page.locator('.ws-sidebar').getByRole('link', { name: 'All agents' })).toBeFocused();
  await page.waitForTimeout(400);
  await expect(page.locator('.ws-sidebar').getByRole('link', { name: 'All agents' })).toBeFocused();
});

for (const method of ['Escape', 'Close', 'backdrop']) test(`F02: normal mobile ${method} still restores the menu trigger`, async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/?view=workspace');
  const trigger = page.getByRole('button', { name: 'Open navigation menu' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  if (method === 'Escape') await page.keyboard.press('Escape');
  else if (method === 'Close') await page.getByRole('button', { name: 'Close Navigation' }).click();
  else await page.locator('.ws-overlay').click({ position: { x: 370, y: 20 } });
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

for (const view of ['directory', 'workspace', 'conversation']) for (const theme of ['dark', 'light']) for (const width of [375, 768, 1280]) {
  test(`F03/fonts: ${view} ${theme} ${width} has no page overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(value => localStorage.setItem('theme', value), theme);
    await page.goto(`/?view=${view}`);
    await expect(page.locator('.ws-root')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const agents = page.locator('.ws-crumbs').getByRole('link', { name: 'Agents', exact: true });
    const box = await agents.boundingBox();
    expect(box).not.toBeNull();
    if (width === 375) { expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44); }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    fs.mkdirSync(path.join(evidence, 'screens'), { recursive: true });
    await page.screenshot({ path: path.join(evidence, 'screens', `${view}-${theme}-${width}.png`) });
    fs.writeFileSync(path.join(evidence, `${view}-${theme}-${width}-metrics.json`), JSON.stringify({ box, overflow }, null, 2) + '\n');
  });
}

for (const width of [375, 1280]) for (const blocked of [false, true]) {
  test(`root typography ${width}: prior/local declarations match with fonts ${blocked ? 'blocked' : 'loaded'}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    if (blocked) await page.route('**/font-files/*', route => route.abort());
    const records: unknown[] = [];
    for (const variant of ['before', 'after']) {
      await page.goto(`/typography?font=${variant}`);
      await page.evaluate(() => document.fonts.ready);
      records.push(await page.evaluate(() => ({
        body: { family: getComputedStyle(document.body).fontFamily, style: getComputedStyle(document.body).fontStyle },
        probes: Array.from(document.querySelectorAll('[data-font-probe]'), el => {
          const box = el.getBoundingClientRect(), css = getComputedStyle(el);
          return { x: box.x, y: box.y, width: box.width, height: box.height,
            family: css.fontFamily, size: css.fontSize, weight: css.fontWeight, lineHeight: css.lineHeight };
        }),
        faces: Array.from(document.fonts).filter(face => face.family.replaceAll('"', '') === 'Inter').map(face => ({
          style: face.style, weight: face.weight, display: face.display, status: face.status,
        })),
        overflow: document.documentElement.scrollWidth - innerWidth,
      })));
    }
    expect(records[1]).toEqual(records[0]);
    const result = records[1] as { faces: Array<{ style: string; weight: string; display: string; status: string }>; overflow: number };
    expect(result.faces).toHaveLength(7);
    for (const face of result.faces) {
      expect(face.style).toBe('normal'); expect(face.weight).toBe('100 900'); expect(face.display).toBe('swap');
      if (!blocked) expect(face.status).toBe('loaded');
    }
    expect(result.overflow).toBeLessThanOrEqual(1);
    fs.writeFileSync(path.join(evidence, `typography-${width}-${blocked ? 'fallback' : 'loaded'}.json`), JSON.stringify(records, null, 2) + '\n');
  });
}
