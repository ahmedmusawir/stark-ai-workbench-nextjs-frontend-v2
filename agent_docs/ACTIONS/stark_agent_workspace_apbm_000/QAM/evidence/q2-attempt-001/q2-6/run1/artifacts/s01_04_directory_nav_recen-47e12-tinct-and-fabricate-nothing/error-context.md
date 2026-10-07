# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s01_04_directory_nav_recents.spec.ts >> S-01 empty / loading / unavailable roster are distinct and fabricate nothing
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s01_04_directory_nav_recents.spec.ts:24:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Loading agents…')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Loading agents…')

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
      - button "Choose an agent" [ref=e16] [cursor=pointer]:
        - img [ref=e17]
        - text: Choose an agent
      - link "All agents" [ref=e18] [cursor=pointer]:
        - /url: /chat
        - img [ref=e19]
        - generic [ref=e21]: All agents
      - paragraph [ref=e23]: Your agents
      - button "Switch to light mode" [ref=e25] [cursor=pointer]:
        - img [ref=e26]
        - generic [ref=e32]: Light mode
    - generic [ref=e33]:
      - banner [ref=e34]:
        - link "Agents" [ref=e36] [cursor=pointer]:
          - /url: /chat
      - main [ref=e37]:
        - paragraph [ref=e38]: Your workspace
        - heading "Your agents" [level=1] [ref=e39]
        - paragraph [ref=e40]: Choose an agent. Pick up a conversation or start something new.
        - generic [ref=e41]: Find an agent
        - generic [ref=e42]:
          - img [ref=e43]
          - textbox "Find an agent" [ref=e46]:
            - /placeholder: Search names or descriptions
        - generic [ref=e47]:
          - heading "No agents configured" [level=2] [ref=e48]
          - paragraph [ref=e49]: Ask your administrator to configure an agent.
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
> 27 |     await open(page, { roster, status }); await expect(page.getByText(text)).toBeVisible();
     |                                                                              ^ Error: expect(locator).toBeVisible() failed
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
  62 |     await open(page, { query: q }); await expect(page.getByRole('heading', { level: 1 })).toContainText(name);
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