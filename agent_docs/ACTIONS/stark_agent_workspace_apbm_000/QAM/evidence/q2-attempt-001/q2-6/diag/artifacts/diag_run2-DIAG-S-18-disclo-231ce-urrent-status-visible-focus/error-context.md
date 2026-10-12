# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diag_run2.spec.ts >> DIAG S-18: disclosure (trigger hidden on desktop by design), resize focus rescue, skip link, aria-current, status, visible focus
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/diag_run2.spec.ts:22:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
      - main [active] [ref=e70]:
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
  1  | // Targeted diagnostic retries (one each) for run-2 INSTRUMENT failures only: S-06 reachability, S-12 network control, S-18.
  2  | // Product-candidate failures (S-17 drawer focus target, 44px breadcrumb) are NOT retried.
  3  | import { test, expect, open, P, stressPreset, blocked, record } from './_qa';
  4  | 
  5  | test('DIAG S-06: composer reachable at 375×700 with the harness sibling removed from layout', async ({ page }) => {
  6  |   await page.setViewportSize({ width: 375, height: 700 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
  7  |   const withSibling = await page.getByLabel('Message', { exact: true }).boundingBox();
  8  |   const sib = await page.evaluate(() => Math.round((document.getElementById('qa-sibling') as HTMLElement).getBoundingClientRect().height));
  9  |   await page.evaluate(() => { (document.getElementById('qa-sibling') as HTMLElement).style.display = 'none'; window.scrollTo(0, 0); });
  10 |   const b = await page.getByLabel('Message', { exact: true }).boundingBox();
  11 |   record('diag-s06', { siblingHeight: sib, composerWithSibling: withSibling, composerWithoutSibling: b, docScrollHeight: await page.evaluate(() => document.documentElement.scrollHeight) });
  12 |   expect(b).not.toBeNull(); expect(b!.y + b!.height).toBeLessThanOrEqual(700); expect(b!.y).toBeGreaterThan(0);
  13 | });
  14 | 
  15 | test('DIAG S-12 control: an external browser request is aborted and logged by the exact-origin route policy', async ({ page }) => {
  16 |   await open(page, { query: 'agent=kestrel', preset: P.rows }); const b0 = blocked.length;
  17 |   const res = await page.evaluate(() => fetch('https://192.0.2.10/qa-control').then(() => 'LOADED', e => 'ABORTED ' + String(e)));
  18 |   await expect.poll(() => blocked.length).toBe(b0 + 1); expect(res).toMatch(/^ABORTED/);
  19 |   record('diag-s12-control', { result: res, blocked: blocked.slice(b0) });
  20 | });
  21 | 
  22 | test('DIAG S-18: disclosure (trigger hidden on desktop by design), resize focus rescue, skip link, aria-current, status, visible focus', async ({ page }) => {
  23 |   await page.setViewportSize({ width: 375, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  24 |   const trig = page.getByRole('button', { name: 'Demo context', exact: true }); await expect(trig).toHaveAttribute('aria-expanded', 'false');
  25 |   const id = (await trig.getAttribute('aria-controls'))!; const content = page.locator(`[id="${id}"]`);
  26 |   await expect(content).toBeHidden(); await trig.click(); await expect(trig).toHaveAttribute('aria-expanded', 'true'); await expect(content).toBeVisible(); await trig.click(); await expect(content).toBeHidden();
  27 |   await page.setViewportSize({ width: 1280, height: 900 }); await expect(content).toBeVisible();
  28 |   const desk = await page.locator('.ws-disclosure-trigger').evaluate(e => ({ display: getComputedStyle(e).display, ariaExpanded: e.getAttribute('aria-expanded') }));
  29 |   await page.getByRole('button', { name: 'Edit demo instructions' }).focus(); await page.setViewportSize({ width: 375, height: 900 });
  30 |   await expect(trig).toBeFocused(); await expect(content).toBeHidden();
  31 |   await page.setViewportSize({ width: 1280, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  32 |   await page.getByLabel('Sibling input').focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  33 |   await page.keyboard.press('Enter'); await expect(page.locator('#ws-main')).toBeFocused();
> 34 |   expect(await page.locator('.ws-desktop [aria-current="page"]').count()).toBe(1); expect(await page.locator('.ws-root [role=status]').count()).toBeGreaterThan(0);
     |                                                                                                                                                 ^ Error: expect(received).toBeGreaterThan(expected)
  35 |   const focusStyle: Record<string, unknown> = {};
  36 |   for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t);
  37 |     await page.getByRole('button', { name: 'Actions for Planning the launch' }).focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  38 |     focusStyle[t] = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement!); return { el: (document.activeElement as HTMLElement).getAttribute('aria-label'), outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow }; });
  39 |     const f = focusStyle[t] as Record<string, string>; expect(f.outlineStyle !== 'none' || f.boxShadow !== 'none').toBe(true); }
  40 |   record('diag-s18', { desktopTrigger: desk, focusStyle });
  41 | });
  42 | 
```