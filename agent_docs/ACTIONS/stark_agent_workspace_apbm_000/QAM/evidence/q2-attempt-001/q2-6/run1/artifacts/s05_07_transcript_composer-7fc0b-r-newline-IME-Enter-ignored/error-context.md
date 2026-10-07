# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s05_07_transcript_composer_draft.spec.ts >> S-06 composer: whitespace rejected; single send on Enter; repeat blocked while pending; Shift+Enter newline; IME Enter ignored
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s05_07_transcript_composer_draft.spec.ts:29:5

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('Message') resolved to 2 elements:
    1) <textarea rows="1" id="_r_0_" placeholder="Message Kestrel Ops…"></textarea> aka getByRole('textbox', { name: 'Message' })
    2) <button disabled type="submit" aria-label="Send message" class="ws-primary ws-icon">…</button> aka getByRole('button', { name: 'Send message' })

Call log:
  - waiting for getByLabel('Message')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - img [ref=e70]
          - generic [ref=e72]: New conversation
        - button "Open demo instructions and context" [ref=e73] [cursor=pointer]:
          - img [ref=e74]
          - generic [ref=e77]: Context
      - main [ref=e78]:
        - generic [ref=e80]:
          - generic [ref=e82]: Kestrel Ops
          - generic [ref=e83]:
            - heading "Chat with Kestrel Ops" [level=1] [ref=e84]
            - paragraph [ref=e85]: Send a message to start a separate conversation.
          - status [ref=e86]
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]: Message
            - textbox "Message" [ref=e90]:
              - /placeholder: Message Kestrel Ops…
            - button "Send message" [disabled] [ref=e92]:
              - img [ref=e93]
          - paragraph [ref=e95]: Enter to send · Shift + Enter for a new line
```

# Test source

```ts
  1  | import { test, expect, open, P, ledger, count, pendingOf, resolveLast, overflow, record, stressPreset, STRESS_ASSISTANT, SHOTS } from './_qa';
  2  | import path from 'node:path';
  3  | 
  4  | test('S-05 transcript: markdown/GFM/code render; no injected markup executes; long content scrolls in its own region', async ({ page, errors }) => {
  5  |   const metrics: Record<string, unknown> = {};
  6  |   for (const w of [375, 768, 1280]) {
  7  |     await page.setViewportSize({ width: w, height: 900 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
  8  |     await expect(page.locator('.ws-thread table')).toBeVisible();
  9  |     const m = await page.evaluate(() => {
  10 |       const t = document.querySelector('.ws-thread')!, table = t.querySelector('table')!.parentElement!, code = t.querySelector('.ws-code-scroll') as HTMLElement;
  11 |       const user = t.querySelector('.ws-turn')!.firstElementChild as HTMLElement; const ub = user.getBoundingClientRect(), tb = t.getBoundingClientRect();
  12 |       return { xss: (window as any).__qaXss ?? null, scripts: t.querySelectorAll('script').length, imgs: t.querySelectorAll('img').length,
  13 |         jsLinks: [...t.querySelectorAll('a')].filter(a => (a.getAttribute('href') || '').toLowerCase().startsWith('javascript')).length,
  14 |         tableScrolls: table.scrollWidth > table.clientWidth, codeScrolls: !!code && code.scrollWidth > code.clientWidth,
  15 |         overflow: document.documentElement.scrollWidth - innerWidth, threadWidth: Math.round(tb.width),
  16 |         userRightGap: Math.round(tb.right - ub.right), userLeftGap: Math.round(ub.left - tb.left), bold: t.querySelectorAll('strong').length };
  17 |     });
  18 |     metrics[w] = m;
  19 |     expect(m.xss).toBeNull(); expect(m.scripts).toBe(0); expect(m.imgs).toBe(0); expect(m.jsLinks).toBe(0);
  20 |     expect(m.tableScrolls).toBe(true); expect(m.codeScrolls).toBe(true); expect(m.overflow).toBeLessThanOrEqual(1); expect(m.bold).toBeGreaterThan(0);
  21 |     expect(m.userRightGap).toBeLessThan(m.userLeftGap); // user bubble aligned right
  22 |   }
  23 |   expect(errors).toEqual([]); record('s05-transcript-metrics', metrics);
  24 |   // CONTROL: the injection detector fires when the same string is injected unsafely
  25 |   await page.evaluate(s => { const d = document.createElement('div'); d.innerHTML = s; document.body.appendChild(d); }, STRESS_ASSISTANT.split('\n').slice(-1)[0]);
  26 |   await expect.poll(() => page.evaluate(() => (window as any).__qaXss ?? null)).not.toBeNull();
  27 | });
  28 | 
  29 | test('S-06 composer: whitespace rejected; single send on Enter; repeat blocked while pending; Shift+Enter newline; IME Enter ignored', async ({ page }) => {
  30 |   await open(page, { query: 'agent=kestrel&new=1', preset: P.rows });
  31 |   const box = page.getByLabel('Message'), sendBtn = page.getByRole('button', { name: 'Send message' });
> 32 |   await box.fill('   \n  '); await expect(sendBtn).toBeDisabled(); await box.press('Enter'); expect(await count(page, 'send')).toBe(0);
     |             ^ Error: locator.fill: Error: strict mode violation: getByLabel('Message') resolved to 2 elements:
  33 |   await box.fill('line one'); await box.press('Shift+Enter'); await box.pressSequentially('line two'); expect(await box.inputValue()).toBe('line one\nline two'); expect(await count(page, 'send')).toBe(0);
  34 |   await box.fill('ime text'); await box.evaluate(el => el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, isComposing: true })));
  35 |   await box.evaluate(el => { const e = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }); Object.defineProperty(e, 'keyCode', { get: () => 229 }); el.dispatchEvent(e); });
  36 |   expect(await count(page, 'send')).toBe(0);
  37 |   await box.press('Enter'); await expect.poll(() => count(page, 'send')).toBe(1);
  38 |   await expect(box).toBeDisabled(); await expect(page.getByText('Waiting for a reply')).toBeVisible();
  39 |   for (let i = 0; i < 5; i++) { await box.press('Enter', { timeout: 500 }).catch(() => {}); await sendBtn.click({ force: true, timeout: 500 }).catch(() => {}); }
  40 |   expect(await count(page, 'send')).toBe(1); expect((await ledger(page)).find(c => c.action === 'send')!.message).toBe('ime text');
  41 |   // CONTROL: the counter counts distinct deliberate sends (resolve, then send again -> 2)
  42 |   await resolveLast(page, 'send', { status: 'sent', sessionId: 'S1', reply: 'ok' }); await expect(page.getByText('ok', { exact: true })).toBeVisible();
  43 |   await page.getByLabel('Message').fill('second'); await page.getByLabel('Message').press('Enter'); await expect.poll(() => count(page, 'send')).toBe(2);
  44 | });
  45 | 
  46 | test('S-06 composer stays reachable at 375 with a long thread', async ({ page }) => {
  47 |   await page.setViewportSize({ width: 375, height: 700 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
  48 |   const b = await page.getByLabel('Message').boundingBox(); expect(b).not.toBeNull(); expect(b!.y + b!.height).toBeLessThanOrEqual(700); expect(b!.y).toBeGreaterThan(0);
  49 | });
  50 | 
  51 | test('S-07 New Chat: fresh local draft, clears old draft, no create/run before send; returned ID binds once; late result never hijacks', async ({ page }) => {
  52 |   await open(page, { query: 'agent=kestrel', preset: P.rows });
  53 |   await page.getByLabel('Start a new conversation').fill('unsent workspace draft');
  54 |   await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  55 |   await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&new=1'); await expect(page.getByLabel('Message')).toHaveValue('');
  56 |   await page.getByLabel('Message').fill('draft one'); await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  57 |   await expect(page.getByLabel('Message')).toHaveValue(''); expect(await count(page, 'send')).toBe(0);
  58 |   const listBefore = await count(page, 'list');
  59 |   await page.getByLabel('Message').fill('bind me'); await page.getByLabel('Message').press('Enter');
  60 |   await resolveLast(page, 'send', { status: 'sent', sessionId: 'created-X', reply: 'Bound reply' });
  61 |   await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=created-X');
  62 |   await expect(page.getByText('Bound reply')).toBeVisible();
  63 |   expect((await ledger(page)).filter(c => c.action === 'history' && c.session === 'created-X').length).toBe(0);
  64 |   await expect.poll(() => count(page, 'list')).toBe(listBefore + 1);
  65 |   // late result after navigating away must not move the user
  66 |   await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click(); await page.getByLabel('Message').fill('late'); await page.getByLabel('Message').press('Enter');
  67 |   await page.locator('.ws-desktop').getByRole('link', { name: 'All agents' }).click(); await expect.poll(() => new URL(page.url()).search).toBe('');
  68 |   await resolveLast(page, 'send', { status: 'sent', sessionId: 'late-Y', reply: 'late reply' });
  69 |   await page.waitForTimeout(300); expect(new URL(page.url()).search).toBe(''); await expect(page.getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  70 |   // CONTROL: a ledger with a pre-send 'send' entry is detected as a violation
  71 |   const fake = [{ action: 'send' }, ...(await ledger(page))]; expect(fake.findIndex(c => c.action === 'send')).toBe(0);
  72 |   record('s07-ledger', await ledger(page)); expect(await pendingOf(page, 'send')).toEqual([]);
  73 |   await page.screenshot({ path: path.join(SHOTS, 's07-after-late-result.png') });
  74 | });
  75 | 
```