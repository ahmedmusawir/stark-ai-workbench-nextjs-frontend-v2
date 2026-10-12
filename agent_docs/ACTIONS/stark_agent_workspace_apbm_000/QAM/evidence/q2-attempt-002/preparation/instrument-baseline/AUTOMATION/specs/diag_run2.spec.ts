// Targeted diagnostic retries (one each) for run-2 INSTRUMENT failures only: S-06 reachability, S-12 network control, S-18.
// Product-candidate failures (S-17 drawer focus target, 44px breadcrumb) are NOT retried.
import { test, expect, open, P, stressPreset, blocked, record } from './_qa';

test('DIAG S-06: composer reachable at 375×700 with the harness sibling removed from layout', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
  const withSibling = await page.getByLabel('Message', { exact: true }).boundingBox();
  const sib = await page.evaluate(() => Math.round((document.getElementById('qa-sibling') as HTMLElement).getBoundingClientRect().height));
  await page.evaluate(() => { (document.getElementById('qa-sibling') as HTMLElement).style.display = 'none'; window.scrollTo(0, 0); });
  const b = await page.getByLabel('Message', { exact: true }).boundingBox();
  record('diag-s06', { siblingHeight: sib, composerWithSibling: withSibling, composerWithoutSibling: b, docScrollHeight: await page.evaluate(() => document.documentElement.scrollHeight) });
  expect(b).not.toBeNull(); expect(b!.y + b!.height).toBeLessThanOrEqual(700); expect(b!.y).toBeGreaterThan(0);
});

test('DIAG S-12 control: an external browser request is aborted and logged by the exact-origin route policy', async ({ page }) => {
  await open(page, { query: 'agent=kestrel', preset: P.rows }); const b0 = blocked.length;
  const res = await page.evaluate(() => fetch('https://192.0.2.10/qa-control').then(() => 'LOADED', e => 'ABORTED ' + String(e)));
  await expect.poll(() => blocked.length).toBe(b0 + 1); expect(res).toMatch(/^ABORTED/);
  record('diag-s12-control', { result: res, blocked: blocked.slice(b0) });
});

test('DIAG S-18: disclosure (trigger hidden on desktop by design), resize focus rescue, skip link, aria-current, status, visible focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  const trig = page.getByRole('button', { name: 'Demo context', exact: true }); await expect(trig).toHaveAttribute('aria-expanded', 'false');
  const id = (await trig.getAttribute('aria-controls'))!; const content = page.locator(`[id="${id}"]`);
  await expect(content).toBeHidden(); await trig.click(); await expect(trig).toHaveAttribute('aria-expanded', 'true'); await expect(content).toBeVisible(); await trig.click(); await expect(content).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 }); await expect(content).toBeVisible();
  const desk = await page.locator('.ws-disclosure-trigger').evaluate(e => ({ display: getComputedStyle(e).display, ariaExpanded: e.getAttribute('aria-expanded') }));
  await page.getByRole('button', { name: 'Edit demo instructions' }).focus(); await page.setViewportSize({ width: 375, height: 900 });
  await expect(trig).toBeFocused(); await expect(content).toBeHidden();
  await page.setViewportSize({ width: 1280, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  await page.getByLabel('Sibling input').focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter'); await expect(page.locator('#ws-main')).toBeFocused();
  expect(await page.locator('.ws-desktop [aria-current="page"]').count()).toBe(1); expect(await page.locator('.ws-root [role=status]').count()).toBeGreaterThan(0);
  const focusStyle: Record<string, unknown> = {};
  for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t);
    await page.getByRole('button', { name: 'Actions for Planning the launch' }).focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    focusStyle[t] = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement!); return { el: (document.activeElement as HTMLElement).getAttribute('aria-label'), outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow }; });
    const f = focusStyle[t] as Record<string, string>; expect(f.outlineStyle !== 'none' || f.boxShadow !== 'none').toBe(true); }
  record('diag-s18', { desktopTrigger: desk, focusStyle });
});
