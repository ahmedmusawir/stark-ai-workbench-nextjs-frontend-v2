# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s12_16_demo_theme_render.spec.ts >> S-13 demo state is per agent and per identity; reload/reset clear it; never persisted
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s12_16_demo_theme_render.spec.ts:26:5

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('Demo instructions') resolved to 4 elements:
    1) <button class="ws-icon" aria-label="Edit demo instructions">…</button> aka locator('[id="_r_1_"]').getByLabel('Edit demo instructions')
    2) <div role="dialog" tabindex="-1" id="radix-_r_2_" data-state="open" class="ws-modal " aria-labelledby="radix-_r_3_">…</div> aka getByRole('dialog', { name: 'Edit demo instructions' })
    3) <button type="button" class="ws-icon" aria-label="Close Edit demo instructions">…</button> aka getByRole('button', { name: 'Close Edit demo instructions' })
    4) <textarea class="ws-field" id="ws-demo-instructions">Be clear and practical. Explain the reasoning, th…</textarea> aka getByRole('textbox', { name: 'Demo instructions' })

Call log:
  - waiting for getByLabel('Demo instructions')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - heading [level=1]: Sibling heading
    - paragraph:
      - text: Sibling paragraph
      - link:
        - /url: "#x"
        - text: link
    - button: Sibling button
    - textbox: v
  - generic:
    - generic:
      - link:
        - /url: "#ws-main"
        - text: Skip to content
      - navigation:
        - generic:
          - generic: S
          - generic:
            - text: STARK
            - generic: Agent Workspace
        - button:
          - img
          - text: New chat
        - link:
          - /url: /chat
          - img
          - generic: All agents
        - generic:
          - paragraph: Your agents
          - generic:
            - link:
              - /url: /chat?agent=kestrel
              - img
              - generic: Kestrel Ops
          - generic:
            - link:
              - /url: /chat?agent=a%26b%3Dc
              - img
              - generic: Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent
          - generic:
            - link:
              - /url: /chat?agent=100%25-sure
              - img
              - generic: <img src=x onerror="window.__qaXss=1">
          - generic:
            - link:
              - /url: /chat?agent=spaced+id
              - img
              - generic: ATLAS mixed Case
          - generic:
            - link:
              - /url: /chat?agent=%C3%BCn%C3%AF-%C5%9D
              - img
              - generic: Unicode Agent
          - generic:
            - link:
              - /url: /chat?agent=x%2F..%2Fy
              - img
              - generic: Path Agent
        - generic:
          - button:
            - img
            - generic: Light mode
      - generic:
        - banner:
          - generic:
            - link:
              - /url: /chat
              - text: Agents
            - img
            - link:
              - /url: /chat?agent=kestrel
              - text: Kestrel Ops
        - main:
          - generic:
            - generic:
              - img
            - generic:
              - heading [level=1]: Kestrel Ops
              - paragraph: Operations planning with kestrel precision.
          - generic:
            - text: Start a new conversation
            - textbox:
              - /placeholder: What would you like to work on?
            - generic:
              - generic:
                - img
                - text: Kestrel Ops
              - generic: Enter to send · Shift + Enter for a new line
              - button [disabled]:
                - img
          - paragraph: One agent. Separate conversations.
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - img
                    - heading [level=2]: Agent context
                    - generic: Demo
                  - paragraph: Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.
                  - generic:
                    - generic:
                      - heading [level=3]: Instructions
                      - button:
                        - img
                    - paragraph: Be clear and practical. Explain the reasoning, then suggest a useful next step.
                  - generic:
                    - generic:
                      - heading [level=3]: Sample documents
                      - button:
                        - img
                    - generic:
                      - button:
                        - img
                        - generic: Workspace overview.md
                      - button:
                        - img
                    - generic:
                      - button:
                        - img
                        - generic: Response preferences.md
                      - button:
                        - img
                    - paragraph: Sample content only. No uploads.
                    - button: Reset demo context
            - generic:
              - heading [level=2]: Recent conversations
              - generic:
                - link:
                  - /url: /chat?agent=kestrel&session=A
                  - img
                  - generic:
                    - strong: Planning the launch
                    - generic: 10/4/2026
                - button:
                  - img
              - generic:
                - link:
                  - /url: /chat?agent=kestrel&session=B
                  - img
                  - generic:
                    - strong: Comparing options
                    - generic: 10/3/2026
                - button:
                  - img
              - paragraph: Each conversation keeps its own history.
  - dialog "Edit demo instructions" [ref=e2]:
    - banner [ref=e3]:
      - heading "Edit demo instructions" [level=2] [ref=e4]
      - button "Close Edit demo instructions" [active] [ref=e5] [cursor=pointer]:
        - img [ref=e6]
    - paragraph [ref=e9]: Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.
    - text: Demo instructions
    - textbox "Demo instructions" [ref=e10]: Be clear and practical. Explain the reasoning, then suggest a useful next step.
    - button "Apply to demo" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, open, P, ROWS, ledger, overflow, record, stressPreset, setTheme, blocked, SHOTS } from './_qa';
  2   | import path from 'node:path';
  3   | import fs from 'node:fs';
  4   | 
  5   | const DISCLOSURE = 'Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.';
  6   | const TOKENS = JSON.parse(fs.readFileSync('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/DESIGN/token-values.json', 'utf8'));
  7   | const rgb = (hex: string) => `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;
  8   | 
  9   | test('S-12 demo context: permanent disclosure; edit/add/preview/remove make no network, upload or service calls', async ({ page }) => {
  10  |   const reqs: string[] = []; page.on('request', r => reqs.push(new URL(r.url()).pathname));
  11  |   await open(page, { query: 'agent=kestrel', preset: P.rows }); await expect(page.getByText('Recent conversations')).toBeVisible();
  12  |   const ctx = page.locator('.ws-context'); await expect(ctx.locator('.ws-notice')).toHaveText(DISCLOSURE);
  13  |   const before = reqs.length, l0 = (await ledger(page)).length;
  14  |   await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); const d = page.getByRole('dialog', { name: 'Edit demo instructions' });
  15  |   await expect(d.locator('.ws-notice')).toHaveText(DISCLOSURE); await d.getByLabel('Demo instructions').fill('QA instructions A'); await d.getByRole('button', { name: 'Apply to demo' }).click();
  16  |   await expect(ctx.getByText('QA instructions A')).toBeVisible();
  17  |   await ctx.getByRole('button', { name: 'Add sample document' }).click(); await page.getByRole('dialog', { name: 'Add sample document' }).getByRole('button', { name: 'Research checklist.md' }).click();
  18  |   await ctx.getByRole('button', { name: 'Preview Research checklist.md' }).click(); await expect(page.getByRole('dialog', { name: 'Sample preview' })).toContainText('Fictional sample'); await page.keyboard.press('Escape');
  19  |   await ctx.getByRole('button', { name: 'Remove Workspace overview.md' }).click(); await expect(ctx.getByText('Workspace overview.md')).toHaveCount(0);
  20  |   expect(await page.locator('input[type=file]').count()).toBe(0); expect(reqs.length).toBe(before); expect((await ledger(page)).length).toBe(l0);
  21  |   // CONTROL: an external browser request is aborted and logged by the exact-origin policy
  22  |   const b0 = blocked.length; await page.evaluate(() => fetch('https://example.invalid/x').catch(() => 'aborted')); expect(blocked.length).toBe(b0 + 1);
  23  |   record('s12-requests', { during_demo_actions: reqs.slice(before), blocked_controls: blocked.slice(b0) });
  24  | });
  25  | 
  26  | test('S-13 demo state is per agent and per identity; reload/reset clear it; never persisted', async ({ page }) => {
  27  |   await open(page, { query: 'agent=kestrel', preset: P.rows });
> 28  |   const ctx = page.locator('.ws-context'); const edit = async (t: string) => { await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); await page.getByLabel('Demo instructions').fill(t); await page.getByRole('button', { name: 'Apply to demo' }).click(); };
      |                                                                                                                                                                                                      ^ Error: locator.fill: Error: strict mode violation: getByLabel('Demo instructions') resolved to 4 elements:
  29  |   await edit('QA instructions A'); await page.locator('.ws-desktop').getByRole('link', { name: 'Path Agent' }).click();
  30  |   await expect(page.getByRole('heading', { level: 1, name: 'Path Agent' })).toBeVisible(); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  31  |   await page.locator('.ws-desktop').getByRole('link', { name: 'Kestrel Ops' }).click(); await expect(ctx.getByText('QA instructions A')).toBeVisible();
  32  |   const scan = () => page.evaluate(async () => { const vals = [...Object.keys(localStorage).map(k => localStorage.getItem(k)), ...Object.keys(sessionStorage).map(k => sessionStorage.getItem(k))].join('\n');
  33  |     const dbs = (indexedDB as any).databases ? (await (indexedDB as any).databases()).map((d: any) => d.name).join(',') : ''; return vals + dbs; });
  34  |   expect(await scan()).not.toContain('QA instructions A');
  35  |   await page.evaluate(() => (window as any).qa.setIdentity('qa-user-b')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  36  |   await page.evaluate(() => (window as any).qa.setIdentity('qa-user-a')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0); // prior-user state never resurfaces
  37  |   await edit('QA instructions B'); await page.reload(); await page.waitForFunction(() => !!(window as any).qa); await expect(page.locator('.ws-context').getByText('QA instructions B')).toHaveCount(0);
  38  |   await edit('QA instructions C'); await ctx.getByRole('button', { name: 'Reset demo context' }).click(); await expect(ctx.getByText('QA instructions C')).toHaveCount(0);
  39  |   // CONTROL: the storage scan detects a seeded write
  40  |   await page.evaluate(() => localStorage.setItem('qa-seed', 'QA instructions A')); expect(await scan()).toContain('QA instructions A');
  41  | });
  42  | 
  43  | test('S-14 theme: dark when unset (either OS scheme); saved light honored; saved system not rewritten; tokens match design', async ({ browser }) => {
  44  |   const res: Record<string, unknown> = {};
  45  |   for (const scheme of ['light', 'dark'] as const) { const c = await browser.newContext({ colorScheme: scheme }); const p = await c.newPage(); await open(p);
  46  |     res[`unset-os-${scheme}`] = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); await c.close(); }
  47  |   expect(res['unset-os-light']).toEqual(['dark', null]); expect(res['unset-os-dark']).toEqual(['dark', null]);
  48  |   let c = await browser.newContext({ colorScheme: 'dark' }); let p = await c.newPage(); await setTheme(p, 'light'); await open(p, { query: 'agent=kestrel' });
  49  |   res.saved_light = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_light).toEqual(['light', 'light']); await c.close();
  50  |   c = await browser.newContext({ colorScheme: 'light' }); p = await c.newPage(); await setTheme(p, 'system'); await open(p, { preset: P.rows });
  51  |   await p.locator('.ws-agent-card').first().click(); await p.goBack();
  52  |   res.saved_system = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_system).toEqual(['light', 'system']); await c.close();
  53  |   const tok: Record<string, unknown> = {};
  54  |   for (const t of ['dark', 'light'] as const) { c = await browser.newContext(); p = await c.newPage(); await setTheme(p, t); await open(p);
  55  |     tok[t] = await p.evaluate(() => { const r = document.querySelector('.ws-root') as HTMLElement, cs = getComputedStyle(r); return { bg: cs.backgroundColor, fg: cs.color, font: cs.fontFamily, radius: cs.getPropertyValue('--radius').trim() }; });
  56  |     expect((tok[t] as any).bg).toBe(rgb(TOKENS[t].background)); expect((tok[t] as any).fg).toBe(rgb(TOKENS[t].foreground)); expect((tok[t] as any).font).toMatch(/Inter/); expect((tok[t] as any).radius).toBe('.75rem');
  57  |     // CONTROL: without workspace CSS the token assertion fails
  58  |     await open(p, { path: '/nows' }); const bgNo = await p.evaluate(() => getComputedStyle(document.querySelector('.ws-root') as HTMLElement).backgroundColor);
  59  |     tok[`${t}-nows`] = bgNo; expect(bgNo).not.toBe(rgb(TOKENS[t].background)); await c.close(); }
  60  |   record('s14-theme', { res, tok });
  61  | });
  62  | 
  63  | test('S-15 scope: sibling styles unchanged by workspace CSS; dialogs themed on first visible frame; portal/listener teardown', async ({ page }) => {
  64  |   const props = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'margin', 'padding', 'borderTopWidth', 'borderRadius', 'textDecorationLine', 'outlineStyle', 'boxShadow'];
  65  |   const sample = () => page.evaluate(ps => [...document.querySelectorAll('#qa-sibling, #qa-sibling *')].map(e => { const cs = getComputedStyle(e) as any; return ps.map((k: string) => cs[k]).join('|'); }), props);
  66  |   const diffs: Record<string, unknown> = {};
  67  |   for (const t of ['dark', 'light'] as const) { await setTheme(page, t); await open(page); const withWs = await sample(); await open(page, { path: '/nows' }); const without = await sample();
  68  |     diffs[t] = withWs.map((v, i) => v === without[i] ? null : { i, withWs: v, without: without[i] }).filter(Boolean); expect(diffs[t]).toEqual([]); }
  69  |   await open(page, { query: 'agent=kestrel&session=A', preset: P.rows }); await expect(page.getByText('only session A')).toBeVisible();
  70  |   await page.evaluate(() => { (window as any).__firstFrame = null; new MutationObserver((_, o) => { const d = document.querySelector('[role=dialog]') as HTMLElement | null;
  71  |     if (d) { const host = d.closest('[data-workspace-portal]') as HTMLElement; (window as any).__firstFrame = { inHost: !!host, bg: getComputedStyle(d).backgroundColor, hostVar: host ? getComputedStyle(host).getPropertyValue('--background').trim() : '' }; o.disconnect(); } }).observe(document.body, { childList: true, subtree: true }); });
  72  |   await page.getByRole('button', { name: 'Open demo instructions and context' }).click(); await expect(page.getByRole('dialog', { name: 'Demo context' })).toBeVisible();
  73  |   const ff = await page.evaluate(() => (window as any).__firstFrame); expect(ff.inHost).toBe(true); expect(ff.hostVar).not.toBe(''); expect(ff.bg).not.toBe('rgba(0, 0, 0, 0)');
  74  |   await page.keyboard.press('Escape');
  75  |   const t0 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm } }));
  76  |   await page.evaluate(() => (window as any).qa.unmount());
  77  |   const t1 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm }, inert: (document.querySelector('.ws-root') as any)?.inert ?? null }));
  78  |   expect(t0.portals).toBe(1); expect(t1.portals).toBe(0); expect(t1.mm.added - t1.mm.removed).toBe(0);
  79  |   record('s15-scope', { sibling_diffs: diffs, firstFrame: ff, teardown: { before: t0, after: t1 } });
  80  | });
  81  | 
  82  | const VIEWS: Record<string, { query: string; preset?: string }> = { directory: { query: '' }, workspace: { query: 'agent=kestrel', preset: P.rows }, conversation: { query: 'agent=kestrel&session=A', preset: stressPreset } };
  83  | test('S-16 render matrix 3 views × 2 themes × 375/768/1280 + 1023/1024/1025 + DPR2 spot check', async ({ browser }) => {
  84  |   test.setTimeout(240000); const metrics: Record<string, unknown> = {};
  85  |   const shoot = async (view: string, theme: 'dark' | 'light', w: number, dpr = 1) => {
  86  |     const c = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr }); const p = await c.newPage();
  87  |     await p.route('**/*', r => new URL(r.request().url()).origin === 'http://127.0.0.1:43181' ? r.continue() : r.abort());
  88  |     await setTheme(p, theme); await open(p, VIEWS[view]); await p.waitForTimeout(150);
  89  |     if (view === 'conversation') await expect(p.locator('.ws-thread table')).toBeVisible(); if (view === 'workspace') await expect(p.getByText('Planning the launch').first()).toBeVisible();
  90  |     const m = await p.evaluate(() => { const comp = document.querySelector('.ws-compose-wrap'), turns = document.querySelectorAll('.ws-turn'), last = turns[turns.length - 1];
  91  |       const scroll = document.querySelector('.ws-thread-scroll') as HTMLElement | null; if (scroll) scroll.scrollTop = scroll.scrollHeight;
  92  |       return { overflow: document.documentElement.scrollWidth - innerWidth, desktopNav: getComputedStyle(document.querySelector('.ws-desktop')!).display, mobileTop: getComputedStyle(document.querySelector('.ws-mobile-top')!).display,
  93  |         lastBottomVsComposerTop: last && comp ? Math.round(last.getBoundingClientRect().bottom - comp.getBoundingClientRect().top) : null }; });
  94  |     await p.screenshot({ path: path.join(SHOTS, `render-${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}.png`) }); metrics[`${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}`] = m; await c.close(); return m;
  95  |   };
  96  |   for (const view of Object.keys(VIEWS)) for (const theme of ['dark', 'light'] as const) for (const w of [375, 768, 1280]) {
  97  |     const m = await shoot(view, theme, w); expect(m.overflow).toBeLessThanOrEqual(1); if (m.lastBottomVsComposerTop !== null) expect(m.lastBottomVsComposerTop).toBeLessThanOrEqual(0); }
  98  |   for (const view of ['directory', 'conversation']) for (const w of [1023, 1024, 1025]) { const m = await shoot(view, 'dark', w); expect(m.overflow).toBeLessThanOrEqual(1);
  99  |     expect(m.desktopNav === 'none').toBe(w < 1024); expect(m.mobileTop === 'none').toBe(w >= 1024); }
  100 |   await shoot('conversation', 'dark', 375, 2);
  101 |   // CONTROL: the overflow detector reports a seeded 2000px element
  102 |   const c = await browser.newContext({ viewport: { width: 375, height: 900 } }); const p = await c.newPage(); await open(p);
  103 |   await p.evaluate(() => { const d = document.createElement('div'); d.style.width = '2000px'; d.style.height = '1px'; document.body.appendChild(d); }); expect(await overflow(p)).toBeGreaterThan(1); await c.close();
  104 |   record('s16-render-metrics', metrics);
  105 | });
  106 | 
```