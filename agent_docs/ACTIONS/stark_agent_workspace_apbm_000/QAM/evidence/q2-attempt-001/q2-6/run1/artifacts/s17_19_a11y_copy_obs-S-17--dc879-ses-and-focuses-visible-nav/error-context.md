# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s17_19_a11y_copy_obs.spec.ts >> S-17 drawer (375 dark): focus contained, background inert, Escape/backdrop/Close dismiss and restore; breakpoint crossing closes and focuses visible nav
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s17_19_a11y_copy_obs.spec.ts:8:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "page"
Received: "All agents"

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
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
      - link "All agents" [active] [ref=e18] [cursor=pointer]:
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
              - paragraph [ref=e108]: Be clear and practical. Explain the reasoning, then suggest a useful next step.
            - generic [ref=e109]:
              - generic [ref=e110]:
                - heading "Sample documents" [level=3] [ref=e111]
                - button "Add sample document" [ref=e112] [cursor=pointer]:
                  - img [ref=e113]
              - generic [ref=e114]:
                - button "Preview Workspace overview.md" [ref=e115] [cursor=pointer]:
                  - img [ref=e116]
                  - generic [ref=e119]: Workspace overview.md
                - button "Remove Workspace overview.md" [ref=e120] [cursor=pointer]:
                  - img [ref=e121]
              - generic [ref=e124]:
                - button "Preview Response preferences.md" [ref=e125] [cursor=pointer]:
                  - img [ref=e126]
                  - generic [ref=e129]: Response preferences.md
                - button "Remove Response preferences.md" [ref=e130] [cursor=pointer]:
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
  1   | import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, record, stressPreset, setTheme, SHOTS } from './_qa';
  2   | import type { Page } from '@playwright/test';
  3   | import path from 'node:path';
  4   | 
  5   | const focusInside = (page: Page, sel: string) => page.evaluate(s => !!document.activeElement && !!document.activeElement.closest(s), sel);
  6   | async function tabLoop(page: Page, sel: string, n = 20) { const esc: number[] = []; for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < n; i++) { await page.keyboard.press(key); if (!(await focusInside(page, sel))) esc.push(i); } return esc; }
  7   | 
  8   | test('S-17 drawer (375 dark): focus contained, background inert, Escape/backdrop/Close dismiss and restore; breakpoint crossing closes and focuses visible nav', async ({ page }) => {
  9   |   await page.setViewportSize({ width: 375, height: 800 }); await setTheme(page, 'dark'); await open(page, { query: 'agent=kestrel', preset: P.rows });
  10  |   const menu = page.getByRole('button', { name: 'Open navigation menu' });
  11  |   for (const how of ['Escape', 'Close', 'backdrop']) {
  12  |     await menu.click(); const d = page.getByRole('dialog', { name: 'Navigation' }); await expect(d).toBeVisible();
  13  |     expect(await page.evaluate(() => (document.querySelector('.ws-root') as any).inert)).toBe(true);
  14  |     if (how === 'Escape') { expect(await tabLoop(page, '[role=dialog]')).toEqual([]); await page.keyboard.press('Escape'); }
  15  |     else if (how === 'Close') await d.getByRole('button', { name: 'Close Navigation' }).click();
  16  |     else await page.mouse.click(370, 790);
  17  |     await expect(d).toBeHidden(); await expect(menu).toBeFocused(); expect(await page.evaluate(() => (document.querySelector('.ws-root') as any).inert)).toBe(false);
  18  |   }
  19  |   await page.setViewportSize({ width: 800, height: 800 }); await menu.click(); await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  20  |   await page.setViewportSize({ width: 1200, height: 800 }); await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
> 21  |   await expect.poll(() => page.evaluate(() => { const a = document.activeElement as HTMLElement | null; return a?.closest('.ws-desktop') ? (a.getAttribute('aria-current') || a.textContent) : null; })).toBe('page');
      |   ^ Error: expect(received).toBe(expected) // Object.is equality
  22  | });
  23  | 
  24  | test('S-17 context dialog (1280 light) and nested demo dialog (768 dark): containment, nested Escape, restore', async ({ page }) => {
  25  |   await setTheme(page, 'light'); await open(page, { query: 'agent=kestrel&session=A', preset: P.rows }); await expect(page.getByText('only session A')).toBeVisible();
  26  |   const opener = page.getByRole('button', { name: 'Open demo instructions and context' }); await opener.click();
  27  |   await expect(page.getByRole('dialog', { name: 'Demo context' })).toBeVisible(); expect(await tabLoop(page, '[role=dialog]')).toEqual([]);
  28  |   await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  29  |   await page.setViewportSize({ width: 768, height: 900 }); await page.evaluate(() => { localStorage.setItem('theme', 'dark'); }); await opener.click();
  30  |   const ctx = page.getByRole('dialog', { name: 'Demo context' }); const edit = ctx.getByRole('button', { name: 'Edit demo instructions' }); await edit.click();
  31  |   const nested = page.getByRole('dialog', { name: 'Edit demo instructions' }); await expect(nested).toBeVisible();
  32  |   await page.keyboard.press('Escape'); await expect(nested).toBeHidden(); await expect(ctx).toBeVisible(); await expect(edit).toBeFocused();
  33  |   await page.keyboard.press('Escape'); await expect(ctx).toBeHidden(); await expect(opener).toBeFocused();
  34  | });
  35  | 
  36  | test('S-17 controls: accessible names and ≥44×44 targets; hidden desktop/mobile copies unfocusable', async ({ page }) => {
  37  |   const report: Record<string, unknown> = {};
  38  |   for (const w of [375, 1280]) for (const [v, q, pre] of [['directory', '', undefined], ['workspace', 'agent=kestrel', P.rows], ['conversation', 'agent=kestrel&session=A', stressPreset]] as const) {
  39  |     await page.setViewportSize({ width: w, height: 900 }); await open(page, { query: q, preset: pre }); await page.waitForTimeout(150);
  40  |     report[`${v}-${w}`] = await page.evaluate(() => [...document.querySelectorAll('.ws-root button, .ws-root a[href], .ws-root input, .ws-root textarea, .ws-root [tabindex="0"]')].filter(e => {
  41  |       const r = (e as HTMLElement).getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).map(e => {
  42  |       const r = e.getBoundingClientRect(), el = e as HTMLElement; const name = (el.getAttribute('aria-label') || el.textContent || (el.id && (document.querySelector(`label[for="${el.id}"]`)?.textContent)) || '').trim();
  43  |       const inProse = !!el.closest('.ws-turn') && el.tagName === 'A';
  44  |       return { tag: el.tagName, name: name.slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), inProse, skip: el.classList.contains('ws-skip') };
  45  |     }).filter(x => !x.name || (!x.inProse && !x.skip && (x.w < 44 || x.h < 44))));
  46  |     const hiddenCopy = w < 1024 ? '.ws-desktop' : '.ws-mobile-top'; const hits: number[] = [];
  47  |     await page.locator('body').click({ position: { x: 1, y: 1 } }); for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); if (await focusInside(page, hiddenCopy)) hits.push(i); }
  48  |     expect(hits).toEqual([]);
  49  |   }
  50  |   record('s17-names-targets', report);
  51  |   const violations = Object.entries(report).flatMap(([k, v]) => (v as Array<Record<string, unknown>>).map(x => ({ view: k, ...x })));
  52  |   expect.soft(violations, 'controls without names or below 44×44 (finding if non-empty)').toEqual([]);
  53  |   // CONTROL: tab-loop detector reports escape when no trap exists
  54  |   await page.setViewportSize({ width: 1280, height: 900 }); await open(page); await page.getByLabel('Find an agent').focus(); expect((await tabLoop(page, '.ws-filter', 5)).length).toBeGreaterThan(0);
  55  | });
  56  | 
  57  | test('S-18 disclosure aria/visibility, resize focus rescue, skip link, single aria-current, status regions, visible focus', async ({ page }) => {
  58  |   await page.setViewportSize({ width: 375, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  59  |   const trig = page.getByRole('button', { name: 'Demo context' }); await expect(trig).toHaveAttribute('aria-expanded', 'false');
  60  |   const id = await trig.getAttribute('aria-controls'); expect(await page.locator(`[id="${id}"]`).isHidden()).toBe(true);
  61  |   await trig.click(); await expect(trig).toHaveAttribute('aria-expanded', 'true'); expect(await page.locator(`[id="${id}"]`).isVisible()).toBe(true); await trig.click();
  62  |   await page.setViewportSize({ width: 1280, height: 900 }); await expect(trig).toHaveAttribute('aria-expanded', 'true');
  63  |   await page.getByRole('button', { name: 'Edit demo instructions' }).focus(); await page.setViewportSize({ width: 375, height: 900 });
  64  |   await expect(trig).toBeFocused();
  65  |   await page.setViewportSize({ width: 1280, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows }); await page.keyboard.press('Tab');
  66  |   await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#ws-main')).toBeFocused();
  67  |   expect(await page.locator('.ws-desktop [aria-current="page"]').count()).toBe(1); expect(await page.locator('[role=status]').count()).toBeGreaterThan(0);
  68  |   const focusStyle: Record<string, unknown> = {};
  69  |   for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t); await page.getByRole('button', { name: 'Actions for Planning the launch' }).focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  70  |     focusStyle[t] = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement!); return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow }; });
  71  |     const f = focusStyle[t] as Record<string, string>; expect(f.outlineStyle !== 'none' || f.boxShadow !== 'none').toBe(true); }
  72  |   record('s18-focus-style', focusStyle);
  73  | });
  74  | 
  75  | test('S-19 copy payloads, blocked clipboard fallback, speech lifecycle, unavailable explanation, no autoplay', async ({ browser }) => {
  76  |   const md = 'Answer with **bold** and code:\n\n```js\nconst x = 1;\n```';
  77  |   const preset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: [] }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: 'Q?' }, { role: 'assistant', content: ${JSON.stringify(md)} }] }); }`;
  78  |   let c = await browser.newContext(); let p = await c.newPage();
  79  |   await p.addInitScript(() => { (window as any).__clip = []; (window as any).__speech = { speak: 0, cancel: 0 };
  80  |     Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (t: string) => { (window as any).__clip.push(t); } }, configurable: true });
  81  |     class U { text: string; onstart?: () => void; onend?: () => void; onerror?: () => void; constructor(t: string) { this.text = t; } } (window as any).SpeechSynthesisUtterance = U;
  82  |     (window as any).speechSynthesis = { speaking: false, speak(u: U) { (window as any).__speech.speak++; this.speaking = true; u.onstart?.(); }, cancel() { (window as any).__speech.cancel++; this.speaking = false; }, getVoices: () => [] }; });
  83  |   await open(p, { query: 'agent=kestrel&session=A', preset });
  84  |   await expect(p.locator('.ws-thread code').first()).toBeVisible(); expect(await p.evaluate(() => (window as any).__speech.speak)).toBe(0);
  85  |   await p.locator('.ws-turn').nth(1).getByRole('button', { name: 'Copy message' }).click();
  86  |   await p.getByRole('button', { name: 'Copy conversation as Markdown' }).click(); await p.getByRole('button', { name: 'Copy code' }).click();
  87  |   const clip = await p.evaluate(() => (window as any).__clip);
  88  |   expect(clip).toEqual([md, `## You\n\nQ?\n\n## Kestrel Ops\n\n${md}`, 'const x = 1;']);
  89  |   expect(clip[0]).not.toEqual(md + ' '); // CONTROL: recorder distinguishes a wrong payload
  90  |   const rb = p.getByRole('button', { name: 'Read aloud' }); await rb.click(); expect(await p.evaluate(() => (window as any).__speech.speak)).toBe(1);
  91  |   const stop = p.getByRole('button', { name: 'Stop reading' }); await expect(stop).toBeVisible(); await stop.click(); expect(await p.evaluate(() => (window as any).__speech.cancel)).toBeGreaterThan(0);
  92  |   await expect(p.getByRole('button', { name: 'Read aloud' })).toBeVisible(); await c.close();
  93  |   c = await browser.newContext(); p = await c.newPage();
  94  |   await p.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } }, configurable: true }); delete (window as any).speechSynthesis; });
  95  |   await open(p, { query: 'agent=kestrel&session=A', preset }); await p.locator('.ws-turn').nth(1).getByRole('button', { name: 'Copy message' }).click();
  96  |   await expect(p.getByText('Clipboard unavailable. Select and copy the text below.')).toBeVisible(); const ta = p.getByLabel('Text to copy manually'); await expect(ta).toHaveValue(md);
  97  |   await ta.focus(); expect(await ta.evaluate((e: HTMLTextAreaElement) => [e.selectionStart, e.selectionEnd])).toEqual([0, md.length]);
  98  |   await expect(p.getByText('Read aloud unavailable in this browser.')).toBeVisible(); await p.screenshot({ path: path.join(SHOTS, 's19-fallbacks.png') }); await c.close();
  99  | });
  100 | 
  101 | test('DIRECTOR-OBS-001 §11.3 browser A+B: two successful new chats both stay in recents; reopening A shows only A; no hidden archive/delete/recreate', async ({ page }) => {
  102 |   const preset = `(qa) => { const idx = []; let n = 0; qa.__idx = idx;
  103 |     qa.auto.list = (c) => ({ status: idx.length ? 'ready' : 'empty', rows: idx.filter(r => r.agent === c.agent).map(r => ({ id: r.id, sessionId: r.sid, title: r.title })) });
  104 |     qa.auto.send = (c) => { const sid = ['A', 'B', 'C'][n++]; if (!c.session) idx.push({ id: 'row-' + sid, sid, title: c.message, agent: c.agent }); return { status: 'sent', sessionId: sid, reply: 'reply in ' + sid }; };
  105 |     qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'user', content: 'stored question ' + c.session }, { role: 'assistant', content: 'stored reply ' + c.session }] }); }`;
  106 |   await open(page, { query: 'agent=kestrel', preset });
  107 |   await page.getByLabel('Start a new conversation').fill('first chat'); await page.getByLabel('Start a new conversation').press('Enter');
  108 |   await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=A'); await expect(page.getByText('reply in A')).toBeVisible();
  109 |   await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click(); await page.getByLabel('Message').fill('second chat'); await page.getByLabel('Message').press('Enter');
  110 |   await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=B'); await expect(page.getByText('reply in B')).toBeVisible(); await expect(page.getByText('reply in A')).toHaveCount(0);
  111 |   await page.locator('.ws-crumbs').getByRole('link', { name: 'Kestrel Ops' }).click();
  112 |   await expect(page.locator('.ws-recent-row strong')).toHaveText(['first chat', 'second chat']);
  113 |   await page.getByRole('link', { name: /first chat/ }).click(); await expect(page.getByText('reply in A')).toBeVisible(); await expect(page.getByText('reply in B')).toHaveCount(0);
  114 |   const inSession = await ledger(page); record('obs001-in-session-ledger', inSession);
  115 |   expect(inSession.filter(c => c.action === 'send').map(c => c.session)).toEqual([null, null]);
  116 |   expect(inSession.some(c => ['archive', 'rename'].includes(c.action))).toBe(false);
  117 |   // Fresh mount (reload equivalent) with an authoritative index already holding A+B: recents list both; opening A reads A's history only
  118 |   const seeded = `(qa) => { const idx = [{ id: 'row-A', sid: 'A', title: 'first chat', agent: 'kestrel' }, { id: 'row-B', sid: 'B', title: 'second chat', agent: 'kestrel' }];
  119 |     qa.auto.list = (c) => ({ status: 'ready', rows: idx.filter(r => r.agent === c.agent).map(r => ({ id: r.id, sessionId: r.sid, title: r.title })) });
  120 |     qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'assistant', content: 'stored reply ' + c.session }] }); }`;
  121 |   await page.goto('about:blank'); await open(page, { query: 'agent=kestrel', preset: seeded });
```