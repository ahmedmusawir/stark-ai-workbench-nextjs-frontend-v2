# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s01_04_directory_nav_recents.spec.ts >> S-03 view identity: directory→workspace→conversation→draft, Back×3/Forward×3; encoded IDs
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s01_04_directory_nav_recents.spec.ts:47:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('heading', { level: 1 })
Expected substring: "Very long agent name"
Error: strict mode violation: getByRole('heading', { level: 1 }) resolved to 2 elements:
    1) <h1>Sibling heading</h1> aka getByRole('heading', { name: 'Sibling heading' })
    2) <h1>Very long agent name Very long agent name Very lo…</h1> aka getByRole('heading', { name: 'Very long agent name Very' })

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })

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
          - link "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent" [ref=e69] [cursor=pointer]:
            - /url: /chat?agent=a%26b%3Dc
      - main [ref=e70]:
        - generic [ref=e71]:
          - img [ref=e73]
          - generic [ref=e76]:
            - heading "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent" [level=1] [ref=e77]
            - paragraph [ref=e78]: Reserved characters in the identifier.
        - generic [ref=e79]:
          - text: Start a new conversation
          - textbox "Start a new conversation" [ref=e80]:
            - /placeholder: What would you like to work on?
          - generic [ref=e81]:
            - generic [ref=e82]:
              - img [ref=e83]
              - text: Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent
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
                - /url: /chat?agent=a%26b%3Dc&session=A
                - img [ref=e140]
                - generic [ref=e142]:
                  - strong [ref=e143]: Planning the launch
                  - generic [ref=e144]: 10/4/2026
              - button "Actions for Planning the launch" [ref=e145] [cursor=pointer]:
                - img [ref=e146]
            - generic [ref=e150]:
              - link "Comparing options 10/3/2026" [ref=e151] [cursor=pointer]:
                - /url: /chat?agent=a%26b%3Dc&session=B
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
  1  | import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, rejectLast, record, SHOTS } from './_qa';
  2  | import path from 'node:path';
  3  | 
  4  | test('S-01 directory filter is local, case-insensitive over name+description; distinct no-results; no service calls', async ({ page, errors }) => {
  5  |   await open(page);
  6  |   await expect(page.getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  7  |   await expect(page.locator('.ws-count')).toHaveText('6 agents available');
  8  |   const f = page.getByLabel('Find an agent');
  9  |   const cards = () => page.locator('.ws-agent-card h2').allInnerTexts();
  10 |   await f.fill('kestrel'); expect(await cards()).toEqual(['Kestrel Ops']);
  11 |   await f.fill('KESTREL'); expect(await cards()).toEqual(['Kestrel Ops']);
  12 |   await f.fill('reserved characters'); expect((await cards()).length).toBe(1);
  13 |   await f.fill('ünïcode description'); expect(await cards()).toEqual(['Unicode Agent']);
  14 |   await f.fill('zzz-no-match'); await expect(page.getByRole('heading', { name: 'No matching agents' })).toBeVisible();
  15 |   await expect(page.getByText('No agents configured')).toHaveCount(0);
  16 |   await page.getByRole('button', { name: 'Clear filter' }).first().click(); expect((await cards()).length).toBe(6);
  17 |   // literal markup in an agent name renders as text, never as an element
  18 |   await expect(page.locator('.ws-agent-card h2', { hasText: '<img src=x onerror="window.__qaXss=1">' })).toHaveCount(1);
  19 |   expect(await page.evaluate(() => (window as any).__qaXss)).toBeUndefined(); expect(await page.locator('.ws-agent-card img').count()).toBe(0);
  20 |   expect(await ledger(page)).toEqual([]); expect(errors).toEqual([]);
  21 |   for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t); await page.screenshot({ path: path.join(SHOTS, `s01-directory-${t}-1280.png`) }); }
  22 | });
  23 | 
  24 | test('S-01 empty / loading / unavailable roster are distinct and fabricate nothing', async ({ page }) => {
  25 |   const seen: Record<string, string> = {};
  26 |   for (const [roster, status, text] of [['QR0', 'ready', 'No agents configured'], ['QR1', 'loading', 'Loading agents…'], ['QR1', 'unavailable', 'Agent configuration unavailable']]) {
  27 |     await open(page, { roster, status }); await expect(page.getByText(text)).toBeVisible();
  28 |     expect(await page.locator('.ws-agent-card').count()).toBe(0); seen[`${roster}/${status}`] = text; expect(await ledger(page)).toEqual([]);
  29 |   }
  30 |   record('s01-roster-states', seen);
  31 | });
  32 | 
  33 | test('S-02 alternate rosters use the same components; neutral fallbacks; approved roster renders exactly', async ({ page }) => {
  34 |   await open(page, { roster: 'QR2' });
  35 |   await expect(page.locator('.ws-agent-card')).toHaveCount(1); await expect(page.locator('.ws-agent-card p')).toHaveText('Configured agent workspace.');
  36 |   await open(page, { roster: 'QR1' });
  37 |   await expect(page.locator('.ws-agent-card', { hasText: 'ATLAS mixed Case' }).locator('p')).toHaveText('Configured agent workspace.');
  38 |   await open(page, { roster: 'R6' });
  39 |   const names = await page.locator('.ws-agent-card h2').allInnerTexts();
  40 |   expect(names).toEqual(['Greeting Agent', 'Jarvis', 'Calc Agent', 'Product Agent', 'GHL CRM Agent', 'MOOSE CRM Agent']);
  41 |   // CONTROL (expected-red oracle): a fabricated default agent in the oracle is detected
  42 |   expect(names).not.toEqual([...names, 'Default Agent']);
  43 |   record('s02-approved-roster-render', { names });
  44 |   await page.screenshot({ path: path.join(SHOTS, 's02-approved-roster-directory-dark-1280.png') });
  45 | });
  46 | 
  47 | test('S-03 view identity: directory→workspace→conversation→draft, Back×3/Forward×3; encoded IDs', async ({ page }) => {
  48 |   await open(page, { preset: P.rows });
  49 |   const view = async () => { const u = new URL(page.url()); return u.search; };
  50 |   await page.locator('.ws-agent-card', { hasText: 'Kestrel Ops' }).click();
  51 |   expect(await view()).toBe('?agent=kestrel'); await expect(page.getByRole('heading', { level: 1, name: 'Kestrel Ops' })).toBeVisible();
  52 |   await page.getByRole('link', { name: /Planning the launch/ }).click();
  53 |   expect(await view()).toBe('?agent=kestrel&session=A'); await expect(page.getByText('only session A')).toBeVisible();
  54 |   await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  55 |   expect(await view()).toBe('?agent=kestrel&new=1'); await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible();
  56 |   const steps: string[] = [];
  57 |   for (const exp of ['?agent=kestrel&session=A', '?agent=kestrel', '']) { await page.goBack(); await expect.poll(view).toBe(exp); steps.push(exp); }
  58 |   await expect(page.getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  59 |   for (const exp of ['?agent=kestrel', '?agent=kestrel&session=A', '?agent=kestrel&new=1']) { await page.goForward(); await expect.poll(view).toBe(exp); steps.push(exp); }
  60 |   await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible();
  61 |   for (const [q, name] of [['agent=a%26b%3Dc', 'Very long agent name'], ['agent=x%2F..%2Fy', 'Path Agent'], ['agent=%C3%BCn%C3%AF-%C5%9D', 'Unicode Agent'], ['agent=spaced+id', 'ATLAS mixed Case']]) {
> 62 |     await open(page, { query: q }); await expect(page.getByRole('heading', { level: 1 })).toContainText(name);
     |                                                                                           ^ Error: expect(locator).toContainText(expected) failed
  63 |   }
  64 |   record('s03-history-steps', steps);
  65 | });
  66 | 
  67 | test('S-03 invalid/contradictory selectors: safe unavailable state, zero service calls', async ({ page }) => {
  68 |   const bad = ['agent=kestrel&new=0', 'agent=kestrel&new=1&session=s', 'session=s', 'agent=unknown', 'agent=kestrel&user=u2', 'agent=kestrel&agent=kestrel', 'agent=KESTREL', 'agent=kestrel&backend=x', 'agent=kestrel&session=%20'];
  69 |   for (const q of bad) { await open(page, { query: q }); await expect(page.getByRole('heading', { name: 'Workspace unavailable' })).toBeVisible(); expect(await ledger(page)).toEqual([]); }
  70 |   await page.getByRole('button', { name: 'Back to all agents' }).click(); await expect(page.getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  71 |   record('s03-invalid', bad);
  72 | });
  73 | 
  74 | test('S-04 recents: ready/empty/loading/unavailable/partial/recovered are distinct; retry and recovery make no writes', async ({ page }) => {
  75 |   await open(page, { query: 'agent=kestrel' });
  76 |   await expect(page.getByText('Loading conversations…')).toBeVisible(); // pending list
  77 |   const recents = page.locator('.ws-recents'); const shots: Record<string, Buffer> = {};
  78 |   await resolveLast(page, 'list', { status: 'ready', rows: ROWS }); await expect(recents.getByText('Planning the launch')).toBeVisible(); shots.ready = await recents.screenshot();
  79 |   await open(page, { query: 'agent=kestrel' }); await resolveLast(page, 'list', { status: 'empty', rows: [] });
  80 |   await expect(recents.getByRole('heading', { name: 'A fresh start' })).toBeVisible(); shots.empty = await recents.screenshot(); const emptyAgain = await recents.screenshot();
  81 |   await open(page, { query: 'agent=kestrel' }); await rejectLast(page, 'list', 'unavailable');
  82 |   await expect(recents.getByRole('heading', { name: 'Conversations unavailable' })).toBeVisible(); await expect(recents.getByText('History has not been deleted.')).toBeVisible(); shots.unavailable = await recents.screenshot();
  83 |   const before = await count(page, 'list'); await recents.getByRole('button', { name: 'Try again' }).click(); await expect.poll(() => count(page, 'list')).toBe(before + 1);
  84 |   await open(page, { query: 'agent=kestrel' }); await resolveLast(page, 'list', { status: 'partial', rows: ROWS });
  85 |   await expect(recents.getByRole('heading', { name: 'Conversation details unavailable' })).toBeVisible(); await expect(recents.getByRole('button', { name: /Actions for/ })).toHaveCount(0); shots.partial = await recents.screenshot();
  86 |   const l0 = (await ledger(page)).length; await recents.getByRole('button', { name: 'View available conversations' }).click();
  87 |   await expect(recents.getByRole('heading', { name: 'Recovery view' })).toBeVisible(); await expect(recents.getByText('Some listed conversations may have been archived.')).toBeVisible();
  88 |   expect((await ledger(page)).length).toBe(l0); shots.recovered = await recents.screenshot();
  89 |   // CONTROL: pixel detector — distinct states differ, identical state is identical
  90 |   expect(Buffer.compare(shots.empty, emptyAgain)).toBe(0); expect(Buffer.compare(shots.empty, shots.unavailable)).not.toBe(0);
  91 |   for (const [k, b] of Object.entries(shots)) require('fs').writeFileSync(path.join(SHOTS, `s04-recents-${k}.png`), b);
  92 |   expect(await pendingOf(page, 'send')).toEqual([]);
  93 | });
  94 | 
```