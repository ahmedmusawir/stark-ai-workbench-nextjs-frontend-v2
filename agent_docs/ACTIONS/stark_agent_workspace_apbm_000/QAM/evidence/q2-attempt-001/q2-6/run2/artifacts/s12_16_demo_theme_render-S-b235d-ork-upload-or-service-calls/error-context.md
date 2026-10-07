# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s12_16_demo_theme_render.spec.ts >> S-12 demo context: permanent disclosure; edit/add/preview/remove make no network, upload or service calls
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s12_16_demo_theme_render.spec.ts:10:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - heading "Sibling heading" [level=1] [ref=e3]
    - paragraph [ref=e4]:
      - text: Sibling paragraph
      - link "link" [ref=e5] [cursor=pointer]:
        - /url: "#x"
    - button "Sibling button" [ref=e6] [cursor=pointer]
    - textbox "Sibling input" [ref=e7]: v
  - generic [ref=e9]:
    - link "Skip to content" [ref=e10] [cursor=pointer]:
      - /url: "#ws-main"
    - navigation "Workspace navigation" [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: S
        - generic [ref=e14]:
          - text: STARK
          - generic [ref=e15]: Agent Workspace
      - button "New chat" [ref=e16] [cursor=pointer]:
        - img [ref=e17]
        - text: New chat
      - link "All agents" [ref=e18] [cursor=pointer]:
        - /url: /chat
        - img [ref=e19]
        - generic [ref=e21]: All agents
      - generic [ref=e22]:
        - paragraph [ref=e23]: Your agents
        - link "Kestrel Ops" [ref=e25] [cursor=pointer]:
          - /url: /chat?agent=kestrel
          - img [ref=e26]
          - generic [ref=e28]: Kestrel Ops
        - link "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent" [ref=e30] [cursor=pointer]:
          - /url: /chat?agent=a%26b%3Dc
          - img [ref=e31]
          - generic [ref=e33]: Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent
        - link "<img src=x onerror=\"window.__qaXss=1\">" [ref=e35] [cursor=pointer]:
          - /url: /chat?agent=100%25-sure
          - img [ref=e36]
          - generic [ref=e38]: <img src=x onerror="window.__qaXss=1">
        - link "ATLAS mixed Case" [ref=e40] [cursor=pointer]:
          - /url: /chat?agent=spaced+id
          - img [ref=e41]
          - generic [ref=e43]: ATLAS mixed Case
        - link "Unicode Agent" [ref=e45] [cursor=pointer]:
          - /url: /chat?agent=%C3%BCn%C3%AF-%C5%9D
          - img [ref=e46]
          - generic [ref=e48]: Unicode Agent
        - link "Path Agent" [ref=e50] [cursor=pointer]:
          - /url: /chat?agent=x%2F..%2Fy
          - img [ref=e51]
          - generic [ref=e53]: Path Agent
      - button "Switch to light mode" [ref=e55] [cursor=pointer]:
        - img [ref=e56]
        - generic [ref=e62]: Light mode
    - generic [ref=e63]:
      - banner [ref=e64]:
        - generic [ref=e65]:
          - link "Agents" [ref=e66] [cursor=pointer]:
            - /url: /chat
          - img [ref=e67]
          - link "Kestrel Ops" [ref=e69] [cursor=pointer]:
            - /url: /chat?agent=kestrel
      - main [ref=e70]:
        - generic [ref=e71]:
          - img [ref=e73]
          - generic [ref=e76]:
            - heading "Kestrel Ops" [level=1] [ref=e77]
            - paragraph [ref=e78]: Operations planning with kestrel precision.
        - generic [ref=e79]:
          - text: Start a new conversation
          - textbox "Start a new conversation" [ref=e80]:
            - /placeholder: What would you like to work on?
          - generic [ref=e81]:
            - generic [ref=e82]:
              - img [ref=e83]
              - text: Kestrel Ops
            - generic [ref=e85]: Enter to send · Shift + Enter for a new line
            - button "Send message" [disabled] [ref=e86]:
              - img [ref=e87]
        - paragraph [ref=e89]: One agent. Separate conversations.
        - generic [ref=e90]:
          - generic [ref=e93]:
            - generic [ref=e94]:
              - img [ref=e95]
              - heading "Agent context" [level=2] [ref=e98]
              - generic [ref=e99]: Demo
            - paragraph [ref=e100]: Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.
            - generic [ref=e101]:
              - generic [ref=e102]:
                - heading "Instructions" [level=3] [ref=e103]
                - button "Edit demo instructions" [ref=e104] [cursor=pointer]:
                  - img [ref=e105]
              - paragraph [ref=e108]: QA instructions A
            - generic [ref=e109]:
              - generic [ref=e110]:
                - heading "Sample documents" [level=3] [ref=e111]
                - button "Add sample document" [active] [ref=e112] [cursor=pointer]:
                  - img [ref=e113]
              - generic [ref=e114]:
                - button "Preview Response preferences.md" [ref=e115] [cursor=pointer]:
                  - img [ref=e116]
                  - generic [ref=e119]: Response preferences.md
                - button "Remove Response preferences.md" [ref=e120] [cursor=pointer]:
                  - img [ref=e121]
              - generic [ref=e124]:
                - button "Preview Research checklist.md" [ref=e125] [cursor=pointer]:
                  - img [ref=e126]
                  - generic [ref=e129]: Research checklist.md
                - button "Remove Research checklist.md" [ref=e130] [cursor=pointer]:
                  - img [ref=e131]
              - paragraph [ref=e134]: Sample content only. No uploads.
              - button "Reset demo context" [ref=e135] [cursor=pointer]
          - generic [ref=e136]:
            - heading "Recent conversations" [level=2] [ref=e137]
            - generic [ref=e138]:
              - link "Planning the launch 10/4/2026" [ref=e139] [cursor=pointer]:
                - /url: /chat?agent=kestrel&session=A
                - img [ref=e140]
                - generic [ref=e142]:
                  - strong [ref=e143]: Planning the launch
                  - generic [ref=e144]: 10/4/2026
              - button "Actions for Planning the launch" [ref=e145] [cursor=pointer]:
                - img [ref=e146]
            - generic [ref=e150]:
              - link "Comparing options 10/3/2026" [ref=e151] [cursor=pointer]:
                - /url: /chat?agent=kestrel&session=B
                - img [ref=e152]
                - generic [ref=e154]:
                  - strong [ref=e155]: Comparing options
                  - generic [ref=e156]: 10/3/2026
              - button "Actions for Comparing options" [ref=e157] [cursor=pointer]:
                - img [ref=e158]
            - paragraph [ref=e162]: Each conversation keeps its own history.
```

# Test source

```ts
  1   | import { test, expect, open, P, ROWS, ledger, overflow, record, stressPreset, setTheme, blocked, SHOTS } from './_qa';
  2   | import path from 'node:path';
  3   | import fs from 'node:fs';
  4   | 
  5   | const DISCLOSURE = 'Demo context — changes are not sent to the agent and reset on reload. This panel does not manage the agent’s backend context.';
  6   | const TOKENS = JSON.parse(fs.readFileSync('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/DESIGN/token-values.json', 'utf8'));
  7   | const near = (a: string, hex: string) => { const m = a.match(/\d+/g)!.map(Number), e = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16)); return m.slice(0, 3).every((v, i) => Math.abs(v - e[i]) <= 1); };
  8   | const rgb = (hex: string) => `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;
  9   | 
  10  | test('S-12 demo context: permanent disclosure; edit/add/preview/remove make no network, upload or service calls', async ({ page }) => {
  11  |   const reqs: string[] = []; page.on('request', r => reqs.push(new URL(r.url()).pathname));
  12  |   await open(page, { query: 'agent=kestrel', preset: P.rows }); await expect(page.getByText('Recent conversations')).toBeVisible();
  13  |   const ctx = page.locator('.ws-context'); await expect(ctx.locator('.ws-notice')).toHaveText(DISCLOSURE);
  14  |   const before = reqs.length, l0 = (await ledger(page)).length;
  15  |   await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); const d = page.getByRole('dialog', { name: 'Edit demo instructions' });
  16  |   await expect(d.locator('.ws-notice')).toHaveText(DISCLOSURE); await d.getByLabel('Demo instructions', { exact: true }).fill('QA instructions A'); await d.getByRole('button', { name: 'Apply to demo' }).click();
  17  |   await expect(ctx.getByText('QA instructions A')).toBeVisible();
  18  |   await ctx.getByRole('button', { name: 'Add sample document' }).click(); await page.getByRole('dialog', { name: 'Add sample document' }).getByRole('button', { name: 'Research checklist.md' }).click();
  19  |   await ctx.getByRole('button', { name: 'Preview Research checklist.md' }).click(); await expect(page.getByRole('dialog', { name: 'Sample preview' })).toContainText('Fictional sample'); await page.keyboard.press('Escape');
  20  |   await ctx.getByRole('button', { name: 'Remove Workspace overview.md' }).click(); await expect(ctx.getByText('Workspace overview.md')).toHaveCount(0);
  21  |   expect(await page.locator('input[type=file]').count()).toBe(0); expect(reqs.slice(before).filter(p => !/^\/fonts\/Inter-\d+\.ttf$/.test(p))).toEqual([]); expect((await ledger(page)).length).toBe(l0);
  22  |   // CONTROL: an external browser request is aborted and logged by the exact-origin policy
> 23  |   const b0 = blocked.length; await page.evaluate(() => fetch('https://example.invalid/x').catch(() => 'aborted')); expect(blocked.length).toBe(b0 + 1);
      |                                                                                                                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  24  |   record('s12-requests', { during_demo_actions: reqs.slice(before), blocked_controls: blocked.slice(b0) });
  25  | });
  26  | 
  27  | test('S-13 demo state is per agent and per identity; reload/reset clear it; never persisted', async ({ page }) => {
  28  |   await open(page, { query: 'agent=kestrel', preset: P.rows });
  29  |   const ctx = page.locator('.ws-context'); const edit = async (t: string) => { await ctx.getByRole('button', { name: 'Edit demo instructions' }).click(); await page.getByLabel('Demo instructions', { exact: true }).fill(t); await page.getByRole('button', { name: 'Apply to demo' }).click(); };
  30  |   await edit('QA instructions A'); await page.locator('.ws-desktop').getByRole('link', { name: 'Path Agent' }).click();
  31  |   await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Path Agent' })).toBeVisible(); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  32  |   await page.locator('.ws-desktop').getByRole('link', { name: 'Kestrel Ops' }).click(); await expect(ctx.getByText('QA instructions A')).toBeVisible();
  33  |   const scan = () => page.evaluate(async () => { const vals = [...Object.keys(localStorage).map(k => localStorage.getItem(k)), ...Object.keys(sessionStorage).map(k => sessionStorage.getItem(k))].join('\n');
  34  |     const dbs = (indexedDB as any).databases ? (await (indexedDB as any).databases()).map((d: any) => d.name).join(',') : ''; return vals + dbs; });
  35  |   expect(await scan()).not.toContain('QA instructions A');
  36  |   await page.evaluate(() => (window as any).qa.setIdentity('qa-user-b')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0);
  37  |   await page.evaluate(() => (window as any).qa.setIdentity('qa-user-a')); await expect(ctx.getByText('QA instructions A')).toHaveCount(0); // prior-user state never resurfaces
  38  |   await edit('QA instructions B'); await page.reload(); await page.waitForFunction(() => !!(window as any).qa); await expect(page.locator('.ws-context').getByText('QA instructions B')).toHaveCount(0);
  39  |   await edit('QA instructions C'); await ctx.getByRole('button', { name: 'Reset demo context' }).click(); await expect(ctx.getByText('QA instructions C')).toHaveCount(0);
  40  |   // CONTROL: the storage scan detects a seeded write
  41  |   await page.evaluate(() => localStorage.setItem('qa-seed', 'QA instructions A')); expect(await scan()).toContain('QA instructions A');
  42  | });
  43  | 
  44  | test('S-14 theme: dark when unset (either OS scheme); saved light honored; saved system not rewritten; tokens match design', async ({ browser }) => {
  45  |   const res: Record<string, unknown> = {};
  46  |   for (const scheme of ['light', 'dark'] as const) { const c = await browser.newContext({ colorScheme: scheme }); const p = await c.newPage(); await open(p);
  47  |     res[`unset-os-${scheme}`] = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); await c.close(); }
  48  |   expect(res['unset-os-light']).toEqual(['dark', null]); expect(res['unset-os-dark']).toEqual(['dark', null]);
  49  |   let c = await browser.newContext({ colorScheme: 'dark' }); let p = await c.newPage(); await setTheme(p, 'light'); await open(p, { query: 'agent=kestrel' });
  50  |   res.saved_light = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_light).toEqual(['light', 'light']); await c.close();
  51  |   c = await browser.newContext({ colorScheme: 'light' }); p = await c.newPage(); await setTheme(p, 'system'); await open(p, { preset: P.rows });
  52  |   await p.locator('.ws-agent-card').first().click(); await p.goBack();
  53  |   res.saved_system = await p.evaluate(() => [document.documentElement.className, localStorage.getItem('theme')]); expect(res.saved_system).toEqual(['light', 'system']); await c.close();
  54  |   const tok: Record<string, unknown> = {};
  55  |   for (const t of ['dark', 'light'] as const) { c = await browser.newContext(); p = await c.newPage(); await setTheme(p, t); await open(p);
  56  |     tok[t] = await p.evaluate(() => { const r = document.querySelector('.ws-root') as HTMLElement, cs = getComputedStyle(r); return { bg: cs.backgroundColor, rootColor: cs.color, fg: getComputedStyle(document.querySelector('.ws-root h1') as HTMLElement).color, font: getComputedStyle(document.querySelector('.ws-root h1') as HTMLElement).fontFamily, radius: cs.getPropertyValue('--radius').trim() }; });
  57  |     expect(near((tok[t] as any).bg, TOKENS[t].background)).toBe(true); expect(near((tok[t] as any).fg, TOKENS[t].foreground)).toBe(true); expect((tok[t] as any).font).toMatch(/Inter/); expect((tok[t] as any).radius).toBe('.75rem');
  58  |     // CONTROL: without workspace CSS the token assertion fails
  59  |     await open(p, { path: '/nows' }); const bgNo = await p.evaluate(() => getComputedStyle(document.querySelector('.ws-root') as HTMLElement).backgroundColor);
  60  |     tok[`${t}-nows`] = bgNo; expect(near(bgNo, TOKENS[t].background)).toBe(false); await c.close(); }
  61  |   record('s14-theme', { res, tok });
  62  | });
  63  | 
  64  | test('S-15 scope: sibling styles unchanged by workspace CSS; dialogs themed on first visible frame; portal/listener teardown', async ({ page }) => {
  65  |   const props = ['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'margin', 'padding', 'borderTopWidth', 'borderRadius', 'textDecorationLine', 'outlineStyle', 'boxShadow'];
  66  |   const sample = () => page.evaluate(ps => [...document.querySelectorAll('#qa-sibling, #qa-sibling *')].map(e => { const cs = getComputedStyle(e) as any; return ps.map((k: string) => cs[k]).join('|'); }), props);
  67  |   const diffs: Record<string, unknown> = {};
  68  |   for (const t of ['dark', 'light'] as const) { await setTheme(page, t); await open(page); const withWs = await sample(); await open(page, { path: '/nows' }); const without = await sample();
  69  |     diffs[t] = withWs.map((v, i) => v === without[i] ? null : { i, withWs: v, without: without[i] }).filter(Boolean); expect(diffs[t]).toEqual([]); }
  70  |   await open(page, { query: 'agent=kestrel&session=A', preset: P.rows }); await expect(page.getByText('only session A')).toBeVisible();
  71  |   await page.evaluate(() => { (window as any).__firstFrame = null; new MutationObserver((_, o) => { const d = document.querySelector('[role=dialog]') as HTMLElement | null;
  72  |     if (d) { const host = d.closest('[data-workspace-portal]') as HTMLElement; (window as any).__firstFrame = { inHost: !!host, bg: getComputedStyle(d).backgroundColor, hostVar: host ? getComputedStyle(host).getPropertyValue('--background').trim() : '' }; o.disconnect(); } }).observe(document.body, { childList: true, subtree: true }); });
  73  |   await page.getByRole('button', { name: 'Open demo instructions and context' }).click(); await expect(page.getByRole('dialog', { name: 'Demo context' })).toBeVisible();
  74  |   const ff = await page.evaluate(() => (window as any).__firstFrame); expect(ff.inHost).toBe(true); expect(ff.hostVar).not.toBe(''); expect(ff.bg).not.toBe('rgba(0, 0, 0, 0)');
  75  |   await page.keyboard.press('Escape');
  76  |   const t0 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm } }));
  77  |   await page.evaluate(() => (window as any).qa.unmount());
  78  |   const t1 = await page.evaluate(() => ({ portals: document.querySelectorAll('[data-workspace-portal]').length, mm: { ...(window as any).qa.mm }, inert: (document.querySelector('.ws-root') as any)?.inert ?? null }));
  79  |   expect(t0.portals).toBe(1); expect(t1.portals).toBe(0); expect(t1.mm.added - t1.mm.removed).toBe(0);
  80  |   record('s15-scope', { sibling_diffs: diffs, firstFrame: ff, teardown: { before: t0, after: t1 } });
  81  | });
  82  | 
  83  | const VIEWS: Record<string, { query: string; preset?: string }> = { directory: { query: '' }, workspace: { query: 'agent=kestrel', preset: P.rows }, conversation: { query: 'agent=kestrel&session=A', preset: stressPreset } };
  84  | test('S-16 render matrix 3 views × 2 themes × 375/768/1280 + 1023/1024/1025 + DPR2 spot check', async ({ browser }) => {
  85  |   test.setTimeout(240000); const metrics: Record<string, unknown> = {};
  86  |   const shoot = async (view: string, theme: 'dark' | 'light', w: number, dpr = 1) => {
  87  |     const c = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr }); const p = await c.newPage();
  88  |     await p.route('**/*', r => new URL(r.request().url()).origin === 'http://127.0.0.1:43181' ? r.continue() : r.abort());
  89  |     await setTheme(p, theme); await open(p, VIEWS[view]); await p.waitForTimeout(150);
  90  |     if (view === 'conversation') await expect(p.locator('.ws-thread table')).toBeVisible(); if (view === 'workspace') await expect(p.getByText('Planning the launch').first()).toBeVisible();
  91  |     const m = await p.evaluate(() => { const comp = document.querySelector('.ws-compose-wrap'), turns = document.querySelectorAll('.ws-turn'), last = turns[turns.length - 1];
  92  |       const scroll = document.querySelector('.ws-thread-scroll') as HTMLElement | null; if (scroll) scroll.scrollTop = scroll.scrollHeight;
  93  |       return { overflow: document.documentElement.scrollWidth - innerWidth, desktopNav: getComputedStyle(document.querySelector('.ws-desktop')!).display, mobileTop: getComputedStyle(document.querySelector('.ws-mobile-top')!).display,
  94  |         lastBottomVsComposerTop: last && comp ? Math.round(last.getBoundingClientRect().bottom - comp.getBoundingClientRect().top) : null }; });
  95  |     await p.screenshot({ path: path.join(SHOTS, `render-${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}.png`) }); metrics[`${view}-${theme}-${w}${dpr > 1 ? '-dpr2' : ''}`] = m; await c.close(); return m;
  96  |   };
  97  |   for (const view of Object.keys(VIEWS)) for (const theme of ['dark', 'light'] as const) for (const w of [375, 768, 1280]) {
  98  |     const m = await shoot(view, theme, w); expect(m.overflow).toBeLessThanOrEqual(1); if (m.lastBottomVsComposerTop !== null) expect(m.lastBottomVsComposerTop).toBeLessThanOrEqual(0); }
  99  |   for (const view of ['directory', 'conversation']) for (const w of [1023, 1024, 1025]) { const m = await shoot(view, 'dark', w); expect(m.overflow).toBeLessThanOrEqual(1);
  100 |     expect(m.desktopNav === 'none').toBe(w < 1024); expect(m.mobileTop === 'none').toBe(w >= 1024); }
  101 |   await shoot('conversation', 'dark', 375, 2);
  102 |   // CONTROL: the overflow detector reports a seeded 2000px element
  103 |   const c = await browser.newContext({ viewport: { width: 375, height: 900 } }); const p = await c.newPage(); await open(p);
  104 |   await p.evaluate(() => { const d = document.createElement('div'); d.style.width = '2000px'; d.style.height = '1px'; document.body.appendChild(d); }); expect(await overflow(p)).toBeGreaterThan(1); await c.close();
  105 |   record('s16-render-metrics', metrics);
  106 | });
  107 | 
```