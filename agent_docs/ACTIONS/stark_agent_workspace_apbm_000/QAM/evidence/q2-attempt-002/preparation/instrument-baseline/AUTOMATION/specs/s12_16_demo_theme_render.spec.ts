import { test, expect, open, P, ROWS, ledger, overflow, record, stressPreset, setTheme, blocked, SHOTS } from './_qa';
import path from 'node:path';
import fs from 'node:fs';

const DISCLOSURE = 'Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.';
const TOKENS = JSON.parse(fs.readFileSync('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/DESIGN/token-values.json', 'utf8'));
const near = (a: string, hex: string) => { const m = a.match(/\d+/g)!.map(Number), e = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)); return m.slice(0, 3).every((v, i) => Math.abs(v - e[i]) <= 1); };
const rgb = (hex: string) => `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;

test('S-12 demo context: permanent disclosure; edit/add/preview/remove make no network, upload or service calls', async ({ page }) => {
  const reqs: string[] = []; page.on('request', r => reqs.push(new URL(r.url()).pathname));
  await open(page, { query: 'agent=kestrel', preset: P.rows }); await expect(page.getByText('Recent conversations')).toBeVisible();
  const ctx = page.locator('.ws-context'); await expect(ctx.locator('.ws-notice')).toHaveText(DISCLOSURE);
  const before = reqs.length, l0 = (await ledger(page)).length;
  await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); const d = page.getByRole('dialog', { name: 'Edit demo instructions' });
  await expect(d.locator('.ws-notice')).toHaveText(DISCLOSURE); await d.getByLabel('Demo instructions', { exact: true }).fill('QA instructions A'); await d.getByRole('button', { name: 'Apply to demo' }).click();
  await expect(ctx.getByText('QA instructions A')).toBeVisible();
  await ctx.getByRole('button', { name: 'Add sample document' }).click(); await page.getByRole('dialog', { name: 'Add sample document' }).getByRole('button', { name: 'Research checklist.md' }).click();
  await ctx.getByRole('button', { name: 'Preview Research checklist.md' }).click(); await expect(page.getByRole('dialog', { name: 'Sample preview' })).toContainText('Fictional sample'); await page.keyboard.press('Escape');
  await ctx.getByRole('button', { name: 'Remove Workspace overview.md' }).click(); await expect(ctx.getByText('Workspace overview.md')).toHaveCount(0);
  expect(await page.locator('input[type=file]').count()).toBe(0); expect(reqs.slice(before).filter(p => !/^\/fonts\/Inter-\d+\.ttf$/.test(p))).toEqual([]); expect((await ledger(page)).length).toBe(l0);
  // CONTROL: an external browser request is aborted and logged by the exact-origin policy
  const b0 = blocked.length; await page.evaluate(() => fetch('https://example.invalid/x').catch(() => 'aborted')); expect(blocked.length).toBe(b0 + 1);
  record('s12-requests', { during_demo_actions: reqs.slice(before), blocked_controls: blocked.slice(b0) });
});

test('S-13 demo state is per agent and per identity; reload/reset clear it; never persisted', async ({ page }) => {
  await open(page, { query: 'agent=kestrel', preset: P.rows });
  const ctx = page.locator('.ws-context'); const edit = async (t: string) => { await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); await page.getByLabel('Demo instructions', { exact: true }).fill(t); await page.getByRole('button', { name: 'Apply to demo' }).click(); };
  await edit('QA instructions A'); await page.locator('.ws-desktop').getByRole('link', { name: 'Path Agent' }).click();
  await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Path Agent' })).toBeVisible(); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  await page.locator('.ws-desktop').getByRole('link', { name: 'Kestrel Ops' }).click(); await expect(ctx.getByText('QA instructions A')).toBeVisible();
  const scan = () => page.evaluate(async () => { const vals = [...Object.keys(localStorage).map(k => localStorage.getItem(k)), ...Object.keys(sessionStorage).map(k => sessionStorage.getItem(k))].join('\n');
    const dbs = (indexedDB as any).databases ? (await (indexedDB as any).databases()).map((d: any) => d.name).join(',') : ''; return vals + dbs; });
  expect(await scan()).not.toContain('QA instructions A');
  await page.evaluate(() => (window as any).qa.setIdentity('qa-user-b')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  await page.evaluate(() => (window as any).qa.setIdentity('qa-user-a')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0); // prior-user state never resurfaces
  await edit('QA instructions B'); await page.reload(); await page.waitForFunction(() => !!(window as any).qa); await expect(page.locator('.ws-context').getByText('QA instructions B')).toHaveCount(0);
  await edit('QA instructions C'); await ctx.getByRole('button', { name: 'Reset demo context' }).click(); await expect(ctx.getByText('QA instructions C')).toHaveCount(0);
  // CONTROL: the storage scan detects a seeded write
  await page.evaluate(() => localStorage.setItem('qa-seed', 'QA instructions A')); expect(await scan()).toContain('QA instructions A');
});

test('S-14 theme: dark when unset (either OS scheme); saved light honored; saved system not rewritten; tokens match design', async ({ browser }) => {
  const res: Record<string, unknown> = {};
  for (const scheme of ['light', 'dark'] as const) { const c = await browser.newContext({ colorScheme: scheme }); const p = await c.newPage(); await open(p);
    res[`unset-os-${scheme}`] = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); await c.close(); }
  expect(res['unset-os-light']).toEqual(['dark', null]); expect(res['unset-os-dark']).toEqual(['dark', null]);
  let c = await browser.newContext({ colorScheme: 'dark' }); let p = await c.newPage(); await setTheme(p, 'light'); await open(p, { query: 'agent=kestrel' });
  res.saved_light = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_light).toEqual(['light', 'light']); await c.close();
  c = await browser.newContext({ colorScheme: 'light' }); p = await c.newPage(); await setTheme(p, 'system'); await open(p, { preset: P.rows });
  await p.locator('.ws-agent-card').first().click(); await p.goBack();
  res.saved_system = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_system).toEqual(['light', 'system']); await c.close();
  const tok: Record<string, unknown> = {};
  for (const t of ['dark', 'light'] as const) { c = await browser.newContext(); p = await c.newPage(); await setTheme(p, t); await open(p);
    tok[t] = await p.evaluate(() => { const r = document.querySelector('.ws-root') as HTMLElement, cs = getComputedStyle(r); return { bg: cs.backgroundColor, rootColor: cs.color, fg: getComputedStyle(document.querySelector('.ws-root h1') as HTMLElement).color, font: getComputedStyle(document.querySelector('.ws-root h1') as HTMLElement).fontFamily, radius: cs.getPropertyValue('--radius').trim() }; });
    expect(near((tok[t] as any).bg, TOKENS[t].background)).toBe(true); expect(near((tok[t] as any).fg, TOKENS[t].foreground)).toBe(true); expect((tok[t] as any).font).toMatch(/Inter/); expect((tok[t] as any).radius).toBe('.75rem');
    // CONTROL: without workspace CSS the token assertion fails
    await open(p, { path: '/nows' }); const bgNo = await p.evaluate(() => getComputedStyle(document.querySelector('.ws-root') as HTMLElement).backgroundColor);
    tok[`${t}-nows`] = bgNo; expect(near(bgNo, TOKENS[t].background)).toBe(false); await c.close(); }
  record('s14-theme', { res, tok });
});

test('S-15 scope: sibling styles unchanged by workspace CSS; dialogs themed on first visible frame; portal/listener teardown', async ({ page }) => {
  const props = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'margin', 'padding', 'borderTopWidth', 'borderRadius', 'textDecorationLine', 'outlineStyle', 'boxShadow'];
  const sample = () => page.evaluate(ps => [...document.querySelectorAll('#qa-sibling, #qa-sibling *')].map(e => { const cs = getComputedStyle(e) as any; return ps.map((k: string) => cs[k]).join('|'); }), props);
  const diffs: Record<string, unknown> = {};
  for (const t of ['dark', 'light'] as const) { await setTheme(page, t); await open(page); const withWs = await sample(); await open(page, { path: '/nows' }); const without = await sample();
    diffs[t] = withWs.map((v, i) => v === without[i] ? null : { i, withWs: v, without: without[i] }).filter(Boolean); expect(diffs[t]).toEqual([]); }
  await open(page, { query: 'agent=kestrel&session=A', preset: P.rows }); await expect(page.getByText('only session A')).toBeVisible();
  await page.evaluate(() => { (window as any).__firstFrame = null; new MutationObserver((_, o) => { const d = document.querySelector('[role=dialog]') as HTMLElement | null;
    if (d) { const host = d.closest('[data-workspace-portal]') as HTMLElement; (window as any).__firstFrame = { inHost: !!host, bg: getComputedStyle(d).backgroundColor, hostVar: host ? getComputedStyle(host).getPropertyValue('--background').trim() : '' }; o.disconnect(); } }).observe(document.body, { childList: true, subtree: true }); });
  await page.getByRole('button', { name: 'Open demo instructions and context' }).click(); await expect(page.getByRole('dialog', { name: 'Demo context' })).toBeVisible();
  const ff = await page.evaluate(() => (window as any).__firstFrame); expect(ff.inHost).toBe(true); expect(ff.hostVar).not.toBe(''); expect(ff.bg).not.toBe('rgba(0, 0, 0, 0)');
  await page.keyboard.press('Escape');
  const t0 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm } }));
  await page.evaluate(() => (window as any).qa.unmount());
  const t1 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm }, inert: (document.querySelector('.ws-root') as any)?.inert ?? null }));
  expect(t0.portals).toBe(1); expect(t1.portals).toBe(0); expect(t1.mm.added - t1.mm.removed).toBe(0);
  record('s15-scope', { sibling_diffs: diffs, firstFrame: ff, teardown: { before: t0, after: t1 } });
});

const VIEWS: Record<string, { query: string; preset?: string }> = { directory: { query: '' }, workspace: { query: 'agent=kestrel', preset: P.rows }, conversation: { query: 'agent=kestrel&session=A', preset: stressPreset } };
test('S-16 render matrix 3 views × 2 themes × 375/768/1280 + 1023/1024/1025 + DPR2 spot check', async ({ browser }) => {
  test.setTimeout(240000); const metrics: Record<string, unknown> = {};
  const shoot = async (view: string, theme: 'dark' | 'light', w: number, dpr = 1) => {
    const c = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr }); const p = await c.newPage();
    await p.route('**/*', r => new URL(r.request().url()).origin === 'http://127.0.0.1:43181' ? r.continue() : r.abort());
    await setTheme(p, theme); await open(p, VIEWS[view]); await p.waitForTimeout(150);
    if (view === 'conversation') await expect(p.locator('.ws-thread table')).toBeVisible(); if (view === 'workspace') await expect(p.getByText('Planning the launch').first()).toBeVisible();
    const m = await p.evaluate(() => { const comp = document.querySelector('.ws-compose-wrap'), turns = document.querySelectorAll('.ws-turn'), last = turns[turns.length - 1];
      const scroll = document.querySelector('.ws-thread-scroll') as HTMLElement | null; if (scroll) scroll.scrollTop = scroll.scrollHeight;
      return { overflow: document.documentElement.scrollWidth - innerWidth, desktopNav: getComputedStyle(document.querySelector('.ws-desktop')!).display, mobileTop: getComputedStyle(document.querySelector('.ws-mobile-top')!).display,
        lastBottomVsComposerTop: last && comp ? Math.round(last.getBoundingClientRect().bottom - comp.getBoundingClientRect().top) : null }; });
    await p.screenshot({ path: path.join(SHOTS, `render-${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}.png`) }); metrics[`${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}`] = m; await c.close(); return m;
  };
  for (const view of Object.keys(VIEWS)) for (const theme of ['dark', 'light'] as const) for (const w of [375, 768, 1280]) {
    const m = await shoot(view, theme, w); expect(m.overflow).toBeLessThanOrEqual(1); if (m.lastBottomVsComposerTop !== null) expect(m.lastBottomVsComposerTop).toBeLessThanOrEqual(0); }
  for (const view of ['directory', 'conversation']) for (const w of [1023, 1024, 1025]) { const m = await shoot(view, 'dark', w); expect(m.overflow).toBeLessThanOrEqual(1);
    expect(m.desktopNav === 'none').toBe(w < 1024); expect(m.mobileTop === 'none').toBe(w >= 1024); }
  await shoot('conversation', 'dark', 375, 2);
  // CONTROL: the overflow detector reports a seeded 2000px element
  const c = await browser.newContext({ viewport: { width: 375, height: 900 } }); const p = await c.newPage(); await open(p);
  await p.evaluate(() => { const d = document.createElement('div'); d.style.width = '2000px'; d.style.height = '1px'; document.body.appendChild(d); }); expect(await overflow(p)).toBeGreaterThan(1); await c.close();
  record('s16-render-metrics', metrics);
});
