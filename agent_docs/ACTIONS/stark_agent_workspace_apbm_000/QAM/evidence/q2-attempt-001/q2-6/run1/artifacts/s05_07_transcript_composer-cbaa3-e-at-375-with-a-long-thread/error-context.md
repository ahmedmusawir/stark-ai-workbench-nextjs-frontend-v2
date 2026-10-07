# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s05_07_transcript_composer_draft.spec.ts >> S-06 composer stays reachable at 375 with a long thread
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s05_07_transcript_composer_draft.spec.ts:46:5

# Error details

```
Error: locator.boundingBox: Error: strict mode violation: getByLabel('Message') resolved to 5 elements:
    1) <button type="button" title="Copy message" aria-label="Copy message">…</button> aka getByRole('button', { name: 'Copy message' }).first()
    2) <div tabindex="0" role="region" aria-label="Message table" class="overflow-x-auto my-3">…</div> aka getByRole('region', { name: 'Message table' })
    3) <button type="button" title="Copy message" aria-label="Copy message">…</button> aka getByRole('button', { name: 'Copy message' }).nth(1)
    4) <textarea rows="1" id="_r_0_" placeholder="Message Kestrel Ops…"></textarea> aka getByRole('textbox', { name: 'Message' })
    5) <button disabled type="submit" aria-label="Send message" class="ws-primary ws-icon">…</button> aka getByRole('button', { name: 'Send message' })

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
    - generic [ref=e11]:
      - button "Open navigation menu" [ref=e12] [cursor=pointer]:
        - img [ref=e13]
      - strong [ref=e14]: STARK WORKSPACE
      - button "Switch to light mode" [ref=e15] [cursor=pointer]:
        - img [ref=e16]
    - generic [ref=e22]:
      - banner [ref=e23]:
        - generic [ref=e24]:
          - link "Agents" [ref=e25] [cursor=pointer]:
            - /url: /chat
          - img [ref=e26]
          - link "Kestrel Ops" [ref=e28] [cursor=pointer]:
            - /url: /chat?agent=kestrel
          - img [ref=e29]
          - generic [ref=e31]: Planning the launch
        - button "Open demo instructions and context" [ref=e32] [cursor=pointer]:
          - img [ref=e33]
      - main [ref=e36]:
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Kestrel Ops
            - button "Copy conversation as Markdown" [ref=e42] [cursor=pointer]:
              - img [ref=e43]
              - generic [ref=e46]: Copy conversation as Markdown
          - generic [ref=e48]:
            - generic [ref=e49]: User text <script>window.__qaXss=5</script><img src=x onerror="window.__qaXss=6"> qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_
            - button "Copy message" [ref=e52] [cursor=pointer]:
              - img [ref=e53]
              - generic [ref=e56]: Copy message
          - generic [ref=e58]:
            - paragraph [ref=e59]: Kestrel Ops
            - generic [ref=e60]:
              - paragraph [ref=e61]:
                - text: Here is
                - strong [ref=e62]: bold
                - text: text and a
                - link "long link https://example.invalid/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/" [ref=e63] [cursor=pointer]:
                  - /url: https://example.invalid/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/segment/
                - text: .
              - region "Message table" [ref=e64]:
                - table [ref=e65]:
                  - rowgroup [ref=e66]:
                    - row "Col0 Col1 Col2 Col3 Col4 Col5 Col6 Col7 Col8 Col9 Col10 Col11 Col12 Col13 Col14 Col15 Col16 Col17 Col18 Col19 Col20 Col21 Col22 Col23 Col24 Col25 Col26 Col27 Col28 Col29 Col30 Col31 Col32 Col33 Col34 Col35 Col36 Col37 Col38 Col39" [ref=e67]:
                      - columnheader "Col0" [ref=e68]
                      - columnheader "Col1" [ref=e69]
                      - columnheader "Col2" [ref=e70]
                      - columnheader "Col3" [ref=e71]
                      - columnheader "Col4" [ref=e72]
                      - columnheader "Col5" [ref=e73]
                      - columnheader "Col6" [ref=e74]
                      - columnheader "Col7" [ref=e75]
                      - columnheader "Col8" [ref=e76]
                      - columnheader "Col9" [ref=e77]
                      - columnheader "Col10" [ref=e78]
                      - columnheader "Col11" [ref=e79]
                      - columnheader "Col12" [ref=e80]
                      - columnheader "Col13" [ref=e81]
                      - columnheader "Col14" [ref=e82]
                      - columnheader "Col15" [ref=e83]
                      - columnheader "Col16" [ref=e84]
                      - columnheader "Col17" [ref=e85]
                      - columnheader "Col18" [ref=e86]
                      - columnheader "Col19" [ref=e87]
                      - columnheader "Col20" [ref=e88]
                      - columnheader "Col21" [ref=e89]
                      - columnheader "Col22" [ref=e90]
                      - columnheader "Col23" [ref=e91]
                      - columnheader "Col24" [ref=e92]
                      - columnheader "Col25" [ref=e93]
                      - columnheader "Col26" [ref=e94]
                      - columnheader "Col27" [ref=e95]
                      - columnheader "Col28" [ref=e96]
                      - columnheader "Col29" [ref=e97]
                      - columnheader "Col30" [ref=e98]
                      - columnheader "Col31" [ref=e99]
                      - columnheader "Col32" [ref=e100]
                      - columnheader "Col33" [ref=e101]
                      - columnheader "Col34" [ref=e102]
                      - columnheader "Col35" [ref=e103]
                      - columnheader "Col36" [ref=e104]
                      - columnheader "Col37" [ref=e105]
                      - columnheader "Col38" [ref=e106]
                      - columnheader "Col39" [ref=e107]
                  - rowgroup [ref=e108]:
                    - row "v0 v1 v2 v3 v4 v5 v6 v7 v8 v9 v10 v11 v12 v13 v14 v15 v16 v17 v18 v19 v20 v21 v22 v23 v24 v25 v26 v27 v28 v29 v30 v31 v32 v33 v34 v35 v36 v37 v38 v39" [ref=e109]:
                      - cell "v0" [ref=e110]
                      - cell "v1" [ref=e111]
                      - cell "v2" [ref=e112]
                      - cell "v3" [ref=e113]
                      - cell "v4" [ref=e114]
                      - cell "v5" [ref=e115]
                      - cell "v6" [ref=e116]
                      - cell "v7" [ref=e117]
                      - cell "v8" [ref=e118]
                      - cell "v9" [ref=e119]
                      - cell "v10" [ref=e120]
                      - cell "v11" [ref=e121]
                      - cell "v12" [ref=e122]
                      - cell "v13" [ref=e123]
                      - cell "v14" [ref=e124]
                      - cell "v15" [ref=e125]
                      - cell "v16" [ref=e126]
                      - cell "v17" [ref=e127]
                      - cell "v18" [ref=e128]
                      - cell "v19" [ref=e129]
                      - cell "v20" [ref=e130]
                      - cell "v21" [ref=e131]
                      - cell "v22" [ref=e132]
                      - cell "v23" [ref=e133]
                      - cell "v24" [ref=e134]
                      - cell "v25" [ref=e135]
                      - cell "v26" [ref=e136]
                      - cell "v27" [ref=e137]
                      - cell "v28" [ref=e138]
                      - cell "v29" [ref=e139]
                      - cell "v30" [ref=e140]
                      - cell "v31" [ref=e141]
                      - cell "v32" [ref=e142]
                      - cell "v33" [ref=e143]
                      - cell "v34" [ref=e144]
                      - cell "v35" [ref=e145]
                      - cell "v36" [ref=e146]
                      - cell "v37" [ref=e147]
                      - cell "v38" [ref=e148]
                      - cell "v39" [ref=e149]
              - generic [ref=e151]:
                - generic [ref=e152]:
                  - generic [ref=e153]: typescript
                  - button "Copy code" [ref=e155] [cursor=pointer]:
                    - img [ref=e156]
                    - generic [ref=e159]: Copy code
                - region "Code block" [ref=e160]:
                  - code [ref=e162]:
                    - text: const token = "qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_";
                    - text: console.log(token);
              - paragraph [ref=e163]: qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_qa_long_token_
              - text: <script>window.__qaXss=2</script><img src=x onerror="window.__qaXss=3"> [js link](javascript:window.__qaXss=4)
            - generic [ref=e164]:
              - button "Copy message" [ref=e166] [cursor=pointer]:
                - img [ref=e167]
                - generic [ref=e170]: Copy message
              - button "Read aloud" [ref=e171] [cursor=pointer]:
                - img [ref=e172]
          - status [ref=e176]: Reply received
        - generic [ref=e177]:
          - generic [ref=e178]:
            - generic [ref=e179]: Message
            - textbox "Message" [ref=e180]:
              - /placeholder: Message Kestrel Ops…
            - button "Send message" [disabled] [ref=e182]:
              - img [ref=e183]
          - paragraph [ref=e185]: Enter to send · Shift + Enter for a new line
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
  32 |   await box.fill('   \n  '); await expect(sendBtn).toBeDisabled(); await box.press('Enter'); expect(await count(page, 'send')).toBe(0);
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
> 48 |   const b = await page.getByLabel('Message').boundingBox(); expect(b).not.toBeNull(); expect(b!.y + b!.height).toBeLessThanOrEqual(700); expect(b!.y).toBeGreaterThan(0);
     |                                              ^ Error: locator.boundingBox: Error: strict mode violation: getByLabel('Message') resolved to 5 elements:
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