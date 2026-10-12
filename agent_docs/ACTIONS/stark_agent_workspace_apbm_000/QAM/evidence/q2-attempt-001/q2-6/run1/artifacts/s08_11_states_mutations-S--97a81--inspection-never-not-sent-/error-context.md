# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s08_11_states_mutations.spec.ts >> S-09 unknown outcome (resolved-uncertain): send paused, attempted text visible, only history inspection, never "not sent"
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s08_11_states_mutations.spec.ts:27:7

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('Message') resolved to 4 elements:
    1) <button type="button" title="Copy message" aria-label="Copy message">…</button> aka getByRole('button', { name: 'Copy message' }).first()
    2) <button type="button" title="Copy message" aria-label="Copy message">…</button> aka getByRole('button', { name: 'Copy message' }).nth(1)
    3) <textarea rows="1" id="_r_0_" placeholder="Message Kestrel Ops…"></textarea> aka getByRole('textbox', { name: 'Message' })
    4) <button disabled type="submit" aria-label="Send message" class="ws-primary ws-icon">…</button> aka getByRole('button', { name: 'Send message' })

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
      - generic [ref=e54]:
        - paragraph [ref=e55]: Conversations
        - link "Planning the launch" [ref=e57] [cursor=pointer]:
          - /url: /chat?agent=kestrel&session=A
          - img [ref=e58]
          - generic [ref=e60]: Planning the launch
        - link "Comparing options" [ref=e62] [cursor=pointer]:
          - /url: /chat?agent=kestrel&session=B
          - img [ref=e63]
          - generic [ref=e65]: Comparing options
      - button "Switch to light mode" [ref=e67] [cursor=pointer]:
        - img [ref=e68]
        - generic [ref=e74]: Light mode
    - generic [ref=e75]:
      - banner [ref=e76]:
        - generic [ref=e77]:
          - link "Agents" [ref=e78] [cursor=pointer]:
            - /url: /chat
          - img [ref=e79]
          - link "Kestrel Ops" [ref=e81] [cursor=pointer]:
            - /url: /chat?agent=kestrel
          - img [ref=e82]
          - generic [ref=e84]: Planning the launch
        - button "Open demo instructions and context" [ref=e85] [cursor=pointer]:
          - img [ref=e86]
          - generic [ref=e89]: Context
      - main [ref=e90]:
        - generic [ref=e92]:
          - generic [ref=e93]:
            - generic [ref=e94]: Kestrel Ops
            - button "Copy conversation as Markdown" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
              - generic [ref=e100]: Copy conversation as Markdown
          - generic [ref=e102]:
            - generic [ref=e103]: Question for A
            - button "Copy message" [ref=e106] [cursor=pointer]:
              - img [ref=e107]
              - generic [ref=e110]: Copy message
          - generic [ref=e112]:
            - paragraph [ref=e113]: Kestrel Ops
            - paragraph [ref=e115]: only session A
            - generic [ref=e116]:
              - button "Copy message" [ref=e118] [cursor=pointer]:
                - img [ref=e119]
                - generic [ref=e122]: Copy message
              - button "Read aloud" [ref=e123] [cursor=pointer]:
                - img [ref=e124]
          - status [ref=e128]: Reply received
        - generic [ref=e129]:
          - generic [ref=e130]:
            - generic [ref=e131]: Message
            - textbox "Message" [ref=e132]:
              - /placeholder: Message Kestrel Ops…
            - button "Send message" [disabled] [ref=e134]:
              - img [ref=e135]
          - paragraph [ref=e137]: Enter to send · Shift + Enter for a new line
```

# Test source

```ts
  1   | import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, rejectLast, record, SHOTS } from './_qa';
  2   | import path from 'node:path';
  3   | import fs from 'node:fs';
  4   | 
  5   | const historyPreset = (h: string) => `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = ${h}; }`;
  6   | const writes = async (page: import('@playwright/test').Page) => (await ledger(page)).filter(c => ['send', 'rename', 'archive'].includes(c.action)).length;
  7   | 
  8   | test('S-08 missing / unavailable / access-unavailable are distinct from empty with constrained actions', async ({ page }) => {
  9   |   const shots: Record<string, Buffer> = {}; const main = page.locator('#ws-main');
  10  |   await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'empty', messages: [] })`) });
  11  |   await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible(); shots.empty = await main.screenshot();
  12  |   await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'missing', messages: [] })`) });
  13  |   await expect(page.getByRole('heading', { name: 'Conversation not found' })).toBeVisible();
  14  |   await expect(page.getByRole('button', { name: 'New conversation' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Back to workspace' })).toBeVisible();
  15  |   await expect(page.getByRole('button', { name: /Try loading again|Recreate|Restore/ })).toHaveCount(0); shots.missing = await main.screenshot();
  16  |   await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => new Error('history down')`) });
  17  |   await expect(page.getByRole('heading', { name: 'History unavailable' })).toBeVisible(); shots.unavailable = await main.screenshot();
  18  |   const h0 = await count(page, 'history'); await page.getByRole('button', { name: 'Try loading again' }).click();
  19  |   await expect.poll(() => count(page, 'history')).toBe(h0 + 1); expect(await writes(page)).toBe(0);
  20  |   await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'access-unavailable', messages: [] })`) });
  21  |   await expect(page.getByRole('heading', { name: 'Conversation access unavailable' })).toBeVisible(); await expect(page.getByLabel('Message')).toBeDisabled(); shots.access = await main.screenshot();
  22  |   for (const k of ['missing', 'unavailable', 'access']) expect(Buffer.compare(shots.empty, shots[k])).not.toBe(0);
  23  |   for (const [k, b] of Object.entries(shots)) fs.writeFileSync(path.join(SHOTS, `s08-${k}.png`), b);
  24  | });
  25  | 
  26  | for (const mode of ['resolved-uncertain', 'rejected-throw', 'pending-35s-then-timeout'] as const) {
  27  |   test(`S-09 unknown outcome (${mode}): send paused, attempted text visible, only history inspection, never "not sent"`, async ({ page }) => {
  28  |     test.setTimeout(mode === 'pending-35s-then-timeout' ? 90000 : 30000);
  29  |     await open(page, { query: 'agent=kestrel&session=A', preset: P.rows });
  30  |     await expect(page.getByText('only session A')).toBeVisible();
> 31  |     await page.getByLabel('Message').fill(`attempt ${mode}`); await page.getByLabel('Message').press('Enter');
      |                                      ^ Error: locator.fill: Error: strict mode violation: getByLabel('Message') resolved to 4 elements:
  32  |     await expect(page.getByText('Waiting for a reply')).toBeVisible();
  33  |     if (mode === 'resolved-uncertain') await resolveLast(page, 'send', { status: 'uncertain' });
  34  |     else if (mode === 'rejected-throw') await rejectLast(page, 'send', 'network reset');
  35  |     else { await page.waitForTimeout(35000); expect(await pendingOf(page, 'send')).toHaveLength(1); await rejectLast(page, 'send', 'Request timed out after 35000ms'); }
  36  |     await expect(page.getByRole('heading', { name: 'Send outcome unknown' })).toBeVisible();
  37  |     await expect(page.getByText('Message not sent')).toHaveCount(0);
  38  |     await expect(page.locator('.ws-thread').getByText(`attempt ${mode}`)).toBeVisible();
  39  |     await expect(page.getByLabel('Message')).toBeDisabled();
  40  |     if (mode !== 'resolved-uncertain') expect((await page.evaluate(() => (window as any).qa.rejections)).length).toBe(1); // control: fixture really rejected
  41  |     const h0 = await count(page, 'history'); await page.evaluate(() => { (window as any).qa.auto.history = () => ({ status: 'empty', messages: [] }); });
  42  |     await page.getByRole('button', { name: 'Check history' }).click(); await expect.poll(() => count(page, 'history')).toBe(h0 + 1);
  43  |     await expect(page.getByRole('heading', { name: 'Send outcome unknown' })).toBeVisible(); // degraded empty read does not resolve uncertainty
  44  |     expect(await count(page, 'send')).toBe(1); expect(await writes(page)).toBe(1);
  45  |     record(`s09-${mode}`, await ledger(page));
  46  |   });
  47  | }
  48  | 
  49  | test('S-09 confirmed not-sent keeps an editable draft and requires deliberate send', async ({ page }) => {
  50  |   await open(page, { query: 'agent=kestrel&session=A', preset: P.rows });
  51  |   await page.getByLabel('Message').fill('keep me'); await page.getByLabel('Message').press('Enter'); await resolveLast(page, 'send', { status: 'not-sent' });
  52  |   await expect(page.getByRole('heading', { name: 'Message not sent' })).toBeVisible(); await expect(page.getByLabel('Message')).toBeEnabled(); await expect(page.getByLabel('Message')).toHaveValue('keep me');
  53  |   await page.waitForTimeout(500); expect(await count(page, 'send')).toBe(1);
  54  |   await page.getByLabel('Message').press('Enter'); await expect.poll(() => count(page, 'send')).toBe(2);
  55  | });
  56  | 
  57  | test('S-10 pending status; metadata warning keeps ID/transcript and offers list read only', async ({ page }) => {
  58  |   await open(page, { query: 'agent=kestrel&new=1', preset: P.rows });
  59  |   await page.getByLabel('Message').fill('start'); await page.getByLabel('Message').press('Enter');
  60  |   await expect(page.locator('[role=status]', { hasText: 'Waiting for a reply' })).toBeVisible();
  61  |   await resolveLast(page, 'send', { status: 'sent', sessionId: 'M1', reply: 'Confirmed reply', metadataWarning: true });
  62  |   await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=M1');
  63  |   await expect(page.getByRole('heading', { name: 'Conversation started; title not saved' })).toBeVisible(); await expect(page.getByText('Confirmed reply')).toBeVisible();
  64  |   const l0 = await count(page, 'list'); await page.getByRole('button', { name: 'Check conversation list' }).click();
  65  |   await expect.poll(() => count(page, 'list')).toBe(l0 + 1); expect(await count(page, 'send')).toBe(1);
  66  | });
  67  | 
  68  | test('S-10 late history cannot paint another session; identity switch mid-flight cannot surface prior-user content', async ({ page }) => {
  69  |   await open(page, { query: 'agent=kestrel&session=A', preset: P.rowsDeferHistory });
  70  |   await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1); const [hA] = await pendingOf(page, 'history');
  71  |   await page.locator('.ws-desktop').getByRole('link', { name: 'Comparing options' }).click();
  72  |   await expect.poll(() => pendingOf(page, 'history')).toHaveLength(2); const hB = (await pendingOf(page, 'history')).find(x => x !== hA)!;
  73  |   await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'only session B' }] }), hB);
  74  |   await expect(page.getByText('only session B')).toBeVisible();
  75  |   await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'only session A' }] }), hA);
  76  |   await page.waitForTimeout(300); await expect(page.getByText('only session A')).toHaveCount(0);
  77  |   // identity switch while a history read is in flight
  78  |   await open(page, { query: 'agent=kestrel&session=A', preset: P.rowsDeferHistory }); await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1);
  79  |   const [old] = await pendingOf(page, 'history'); await page.evaluate(() => (window as any).qa.setIdentity('qa-user-b'));
  80  |   await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'PRIOR USER CONTENT' }] }), old);
  81  |   await page.waitForTimeout(300); await expect(page.getByText('PRIOR USER CONTENT')).toHaveCount(0);
  82  |   // CONTROL: a mis-keyed resolution (A content delivered for B's request) is detected by the same check
  83  |   await open(page, { query: 'agent=kestrel&session=B', preset: P.rowsDeferHistory }); await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1);
  84  |   await resolveLast(page, 'history', { status: 'ready', messages: [{ role: 'assistant', content: 'only session A' }] });
  85  |   await expect(page.getByText('only session A')).toHaveCount(1);
  86  | });
  87  | 
  88  | test('S-11 rename/archive: whitespace rejected, literal punctuation, failure retention, archive hides only, focus destinations', async ({ page }) => {
  89  |   await open(page, { query: 'agent=kestrel', preset: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); }` });
  90  |   const opener = page.getByRole('button', { name: 'Actions for Planning the launch' }); await opener.click();
  91  |   const dlg = page.getByRole('dialog', { name: 'Conversation actions' }); await expect(dlg).toBeVisible();
  92  |   await dlg.getByLabel('Conversation title').fill('   '); await expect(dlg.getByRole('button', { name: 'Save name' })).toBeDisabled(); expect(await count(page, 'rename')).toBe(0);
  93  |   await page.keyboard.press('Escape'); await expect(dlg).toBeHidden(); await expect(opener).toBeFocused();
  94  |   const LIT = `<b>&amp;"'</b> 🚀`;
  95  |   await opener.click(); await dlg.getByLabel('Conversation title').fill(LIT); await dlg.getByRole('button', { name: 'Save name' }).click();
  96  |   await resolveLast(page, 'rename', undefined); await expect(dlg).toBeHidden();
  97  |   await expect(page.locator('.ws-recent-row strong', { hasText: LIT })).toHaveCount(1); await expect(page.getByRole('button', { name: `Actions for ${LIT}` })).toHaveCount(1);
  98  |   expect(await page.locator('.ws-recents b').count()).toBe(0); expect((await ledger(page)).find(c => c.action === 'rename')).toMatchObject({ row: 'row-a', title: LIT });
  99  |   await page.getByRole('button', { name: `Actions for ${LIT}` }).click(); await dlg.getByLabel('Conversation title').fill('Should not stick'); await dlg.getByRole('button', { name: 'Save name' }).click();
  100 |   await rejectLast(page, 'rename', 'metadata down'); await expect(dlg.getByRole('alert')).toHaveText('Could not save this change. The conversation and title have been kept.');
  101 |   await page.keyboard.press('Escape'); await expect(page.locator('.ws-recent-row strong', { hasText: LIT })).toHaveCount(1);
  102 |   await page.getByRole('button', { name: 'Actions for Comparing options' }).click(); await dlg.getByRole('button', { name: 'Archive conversation' }).click();
  103 |   await page.keyboard.press('Escape'); await expect(dlg).toBeVisible(); // Escape ignored while mutation pending
  104 |   await rejectLast(page, 'archive', 'archive down'); await expect(dlg.getByRole('alert')).toBeVisible(); await page.keyboard.press('Escape');
  105 |   await expect(page.getByText('Comparing options')).toBeVisible();
  106 |   await page.getByRole('button', { name: 'Actions for Comparing options' }).click(); await dlg.getByRole('button', { name: 'Archive conversation' }).click(); await resolveLast(page, 'archive', undefined);
  107 |   await expect(page.getByText('Comparing options')).toHaveCount(0); await expect(page.getByRole('heading', { name: 'Recent conversations' })).toBeFocused();
  108 |   const l = await ledger(page); expect(l.filter(c => c.action === 'archive').map(c => c.row)).toEqual(['row-b', 'row-b']); expect(l.some(c => !['list', 'rename', 'archive'].includes(c.action))).toBe(false);
  109 |   await page.locator('.ws-recent-row a').first().click(); await expect(page.locator('.ws-crumbs')).toContainText(LIT);
  110 |   // CONTROL: the HTML-element detector finds an unsafe injection
  111 |   await page.evaluate(() => { const d = document.createElement('div'); d.className = 'ws-recents'; d.innerHTML = '<b>x</b>'; document.body.appendChild(d); });
  112 |   expect(await page.locator('.ws-recents b').count()).toBe(1);
  113 |   record('s11-ledger', l); await page.screenshot({ path: path.join(SHOTS, 's11-after-mutations.png') });
  114 | });
  115 | 
```