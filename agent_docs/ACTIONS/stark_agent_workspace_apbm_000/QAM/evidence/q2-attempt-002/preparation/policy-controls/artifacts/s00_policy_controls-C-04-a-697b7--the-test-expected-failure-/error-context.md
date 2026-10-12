# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s00_policy_controls.spec.ts >> C-04 an unconsumed policy event fails the test (expected failure)
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s00_policy_controls.spec.ts:47:5

# Error details

```
Error: QA_POLICY_UNEXPECTED_EVENTS [{"kind":"request-offorigin-observed","detail":"https://qa-control.example.invalid/probe","at":1791720082118},{"kind":"request-blocked","detail":"https://qa-control.example.invalid/probe","at":1791720082118}]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#ws-main"
  - navigation "Workspace navigation" [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: S
      - generic [ref=e8]:
        - text: STARK
        - generic [ref=e9]: Agent Workspace
    - button "Choose an agent" [ref=e10] [cursor=pointer]:
      - img [ref=e11]
      - text: Choose an agent
    - link "All agents" [ref=e12] [cursor=pointer]:
      - /url: /chat
      - img [ref=e13]
      - generic [ref=e15]: All agents
    - generic [ref=e16]:
      - paragraph [ref=e17]: Your agents
      - link "Kestrel Ops" [ref=e19] [cursor=pointer]:
        - /url: /chat?agent=kestrel
        - img [ref=e20]
        - generic [ref=e22]: Kestrel Ops
      - link "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent" [ref=e24] [cursor=pointer]:
        - /url: /chat?agent=a%26b%3Dc
        - img [ref=e25]
        - generic [ref=e27]: Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent
      - link "<img src=x onerror=\"window.__qaXss=1\">" [ref=e29] [cursor=pointer]:
        - /url: /chat?agent=100%25-sure
        - img [ref=e30]
        - generic [ref=e32]: <img src=x onerror="window.__qaXss=1">
      - link "ATLAS mixed Case" [ref=e34] [cursor=pointer]:
        - /url: /chat?agent=spaced+id
        - img [ref=e35]
        - generic [ref=e37]: ATLAS mixed Case
      - link "Unicode Agent" [ref=e39] [cursor=pointer]:
        - /url: /chat?agent=%C3%BCn%C3%AF-%C5%9D
        - img [ref=e40]
        - generic [ref=e42]: Unicode Agent
      - link "Path Agent" [ref=e44] [cursor=pointer]:
        - /url: /chat?agent=x%2F..%2Fy
        - img [ref=e45]
        - generic [ref=e47]: Path Agent
    - button "Switch to light mode" [ref=e49] [cursor=pointer]:
      - img [ref=e50]
      - generic [ref=e56]: Light mode
  - generic [ref=e57]:
    - banner [ref=e58]:
      - link "Agents" [ref=e60] [cursor=pointer]:
        - /url: /chat
    - main [ref=e61]:
      - paragraph [ref=e62]: Your workspace
      - heading "Your agents" [level=1] [ref=e63]
      - paragraph [ref=e64]: Choose an agent. Pick up a conversation or start something new.
      - generic [ref=e65]: Find an agent
      - generic [ref=e66]:
        - img [ref=e67]
        - textbox "Find an agent" [ref=e70]:
          - /placeholder: Search names or descriptions
      - status [ref=e71]: 6 agents available
      - generic [ref=e72]:
        - link "Kestrel Ops Operations planning with kestrel precision. Open workspace" [ref=e73] [cursor=pointer]:
          - /url: /chat?agent=kestrel
          - img [ref=e75]
          - heading "Kestrel Ops" [level=2] [ref=e78]
          - paragraph [ref=e79]: Operations planning with kestrel precision.
          - generic [ref=e80]:
            - text: Open workspace
            - img [ref=e81]
        - link "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent Reserved characters in the identifier. Open workspace" [ref=e83] [cursor=pointer]:
          - /url: /chat?agent=a%26b%3Dc
          - img [ref=e85]
          - heading "Very long agent name Very long agent name Very long agent name Very long agent name Very long agent name Very long agent" [level=2] [ref=e88]
          - paragraph [ref=e89]: Reserved characters in the identifier.
          - generic [ref=e90]:
            - text: Open workspace
            - img [ref=e91]
        - link "<img src=x onerror=\"window.__qaXss=1\"> Literal markup in a name must render as text. Open workspace" [ref=e93] [cursor=pointer]:
          - /url: /chat?agent=100%25-sure
          - img [ref=e95]
          - heading "<img src=x onerror=\"window.__qaXss=1\">" [level=2] [ref=e98]
          - paragraph [ref=e99]: Literal markup in a name must render as text.
          - generic [ref=e100]:
            - text: Open workspace
            - img [ref=e101]
        - link "ATLAS mixed Case Configured agent workspace. Open workspace" [ref=e103] [cursor=pointer]:
          - /url: /chat?agent=spaced+id
          - img [ref=e105]
          - heading "ATLAS mixed Case" [level=2] [ref=e108]
          - paragraph [ref=e109]: Configured agent workspace.
          - generic [ref=e110]:
            - text: Open workspace
            - img [ref=e111]
        - link "Unicode Agent Ünïcode description text. Open workspace" [ref=e113] [cursor=pointer]:
          - /url: /chat?agent=%C3%BCn%C3%AF-%C5%9D
          - img [ref=e115]
          - heading "Unicode Agent" [level=2] [ref=e118]
          - paragraph [ref=e119]: Ünïcode description text.
          - generic [ref=e120]:
            - text: Open workspace
            - img [ref=e121]
        - link "Path Agent Slash and dot segments. Open workspace" [ref=e123] [cursor=pointer]:
          - /url: /chat?agent=x%2F..%2Fy
          - img [ref=e125]
          - heading "Path Agent" [level=2] [ref=e128]
          - paragraph [ref=e129]: Slash and dot segments.
          - generic [ref=e130]:
            - text: Open workspace
            - img [ref=e131]
```

# Test source

```ts
  1   | // Shared QA spec helpers (disposable). Attempt-002 (plan v0.3 §3): the exact-origin browser policy and page-error capture are
  2   | // MANDATORY for every context and page — an auto worker fixture guards every browser.newContext() (incl. S-14/S-16/S-19 manual
  3   | // contexts and browser.newPage) and an auto test fixture guards the default context, keeps a per-test ledger and FAILS the test
  4   | // on any unconsumed event. Controls consume only their own labelled events (consumeControl).
  5   | import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
  6   | import fs from 'node:fs';
  7   | import path from 'node:path';
  8   | export const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:43181';
  9   | export const OUT = path.resolve(process.env.QA_OUT || 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-002/acceptance/G');
  10  | export const SHOTS = path.join(OUT, 'screens'); fs.mkdirSync(SHOTS, { recursive: true });
  11  | 
  12  | type PolicyEvent = { kind: 'request-blocked' | 'request-offorigin-observed' | 'websocket-blocked' | 'serviceworker' | 'pageerror' | 'crash'; detail: string; at: number; consumedBy?: string };
  13  | const policy = { events: [] as PolicyEvent[], contexts: 0, pages: 0, requests: 0 };
  14  | // Origins/paths only (never query strings or bodies) — ledgers stay free of payloads.
  15  | const redact = (raw: string) => { try { const u = new URL(raw); return u.protocol.startsWith('http') || u.protocol.startsWith('ws') ? `${u.origin}${u.pathname}` : `${u.protocol}…`; } catch { return 'unparseable-url'; } };
  16  | const exactOrigin = (raw: string) => { try { return new URL(raw).origin; } catch { return null; } };
  17  | export const blocked: string[] = []; // compat: blocked origins (attempt-001 specs)
  18  | const pageErrors: string[] = []; // compat: per-test page errors (all pages/contexts), exposed as the 'errors' fixture
  19  | 
  20  | export async function guardContext(ctx: BrowserContext) {
  21  |   const c = ctx as BrowserContext & { __qaGuarded?: boolean };
  22  |   if (c.__qaGuarded) return; c.__qaGuarded = true; policy.contexts++;
  23  |   await ctx.route('**/*', async route => {
  24  |     const raw = route.request().url();
  25  |     if (exactOrigin(raw) === ORIGIN) return route.continue();
  26  |     blocked.push(exactOrigin(raw) || 'non-origin'); policy.events.push({ kind: 'request-blocked', detail: redact(raw), at: Date.now() });
  27  |     await route.abort('blockedbyclient');
  28  |   });
  29  |   await ctx.routeWebSocket(/.*/, ws => { policy.events.push({ kind: 'websocket-blocked', detail: redact(ws.url()), at: Date.now() }); void ws.close(); });
  30  |   const attach = (p: Page) => {
  31  |     const g = p as Page & { __qaGuarded?: boolean }; if (g.__qaGuarded) return; g.__qaGuarded = true; policy.pages++;
  32  |     p.on('pageerror', e => { pageErrors.push(String(e).slice(0, 400)); policy.events.push({ kind: 'pageerror', detail: String(e).slice(0, 400), at: Date.now() }); });
  33  |     p.on('crash', () => policy.events.push({ kind: 'crash', detail: redact(p.url()), at: Date.now() }));
  34  |   };
  35  |   ctx.pages().forEach(attach); ctx.on('page', attach);
  36  |   ctx.on('request', r => { policy.requests++; if (exactOrigin(r.url()) !== ORIGIN) policy.events.push({ kind: 'request-offorigin-observed', detail: redact(r.url()), at: Date.now() }); });
  37  |   ctx.on('serviceworker', w => policy.events.push({ kind: 'serviceworker', detail: redact(w.url()), at: Date.now() }));
  38  | }
  39  | /** Mark matching unconsumed events as an expected control; returns how many were consumed. */
  40  | export function consumeControl(kind: PolicyEvent['kind'], match: RegExp, label: string) {
  41  |   let n = 0; for (const e of policy.events) if (!e.consumedBy && e.kind === kind && match.test(e.detail)) { e.consumedBy = label; n++; } return n;
  42  | }
  43  | export const policyEvents = () => policy.events.map(e => ({ ...e }));
  44  | export const policyCounters = () => ({ contexts: policy.contexts, pages: policy.pages, requests: policy.requests });
  45  | 
  46  | export const test = base.extend<{ errors: string[]; _qaPolicy: void }, { _qaBrowserGuard: void }>({
  47  |   _qaBrowserGuard: [async ({ browser }, use) => {
  48  |     const original = browser.newContext.bind(browser);
  49  |     (browser as unknown as { newContext: typeof browser.newContext }).newContext = async (options = {}) => {
  50  |       const ctx = await original({ ...options, serviceWorkers: 'block' }); await guardContext(ctx); return ctx;
  51  |     };
  52  |     await use();
  53  |   }, { scope: 'worker', auto: true }],
  54  |   _qaPolicy: [async ({ context }, use, testInfo) => {
  55  |     policy.events.length = 0; policy.contexts = 0; policy.pages = 0; policy.requests = 0; blocked.length = 0; pageErrors.length = 0;
  56  |     await guardContext(context); // idempotent; the patched newContext normally guarded it already
  57  |     await use();
  58  |     const unexpected = policy.events.filter(e => !e.consumedBy);
  59  |     const slug = testInfo.titlePath.slice(1).join(' › ').replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 150);
  60  |     fs.mkdirSync(path.join(OUT, 'ledgers'), { recursive: true });
  61  |     fs.writeFileSync(path.join(OUT, 'ledgers', `${slug}.json`), JSON.stringify({ test: testInfo.titlePath.slice(1), status: testInfo.status, origin: ORIGIN,
  62  |       counters: policyCounters(), events: policy.events, unexpected: unexpected.length }, null, 2) + '\n');
> 63  |     if (unexpected.length) throw new Error(`QA_POLICY_UNEXPECTED_EVENTS ${JSON.stringify(unexpected)}`);
      |                                  ^ Error: QA_POLICY_UNEXPECTED_EVENTS [{"kind":"request-offorigin-observed","detail":"https://qa-control.example.invalid/probe","at":1791720082118},{"kind":"request-blocked","detail":"https://qa-control.example.invalid/probe","at":1791720082118}]
  64  |   }, { auto: true }],
  65  |   // Compat for attempt-001 specs: page errors observed in this test (all pages/contexts). Depends on _qaPolicy so it is reset first.
  66  |   errors: async ({ _qaPolicy }, use) => { void _qaPolicy; await use(pageErrors); },
  67  | });
  68  | export { expect };
  69  | export const ROWS = [{ id: 'row-a', sessionId: 'A', title: 'Planning the launch', updatedAt: '2026-10-04T10:00:00Z' }, { id: 'row-b', sessionId: 'B', title: 'Comparing options', updatedAt: '2026-10-03T10:00:00Z' }];
  70  | export async function open(page: Page, o: { query?: string; roster?: string; status?: string; path?: string; preset?: string } = {}) {
  71  |   if (o.preset) await page.addInitScript(`window.__qaPreset = ${o.preset};`);
  72  |   await page.goto('about:blank');
  73  |   await page.goto(`${o.path || '/'}${o.query ? '?' + o.query : ''}#roster=${o.roster || 'QR1'}&status=${o.status || 'ready'}`);
  74  |   await page.waitForFunction(() => !!(window as any).qa);
  75  | }
  76  | // Common presets (stringified functions evaluated in the page)
  77  | export const P = {
  78  |   rows: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'user', content: 'Question for ' + c.session }, { role: 'assistant', content: 'only session ' + c.session }] }); }`,
  79  |   rowsDeferHistory: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); }`,
  80  | };
  81  | export const ledger = (page: Page) => page.evaluate(() => (window as any).qa.ledger as Array<{ seq: number; action: string; agent?: string; session?: string | null; message?: string; title?: string; row?: string }>);
  82  | export const count = async (page: Page, action: string) => (await ledger(page)).filter(c => c.action === action).length;
  83  | export const pendingOf = (page: Page, action: string) => page.evaluate(a => (window as any).qa.pendingOf(a) as number[], action);
  84  | export const resolveLast = async (page: Page, action: string, value: unknown) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, v]) => (window as any).qa.resolve(id, v), [ids[ids.length - 1], value] as const); };
  85  | export const rejectLast = async (page: Page, action: string, msg: string) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, m]) => (window as any).qa.reject(id, m), [ids[ids.length - 1], msg] as const); };
  86  | export const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  87  | export const setTheme = (page: Page, t: 'dark' | 'light' | 'system') => page.addInitScript(th => { try { localStorage.setItem('theme', th); } catch { /* */ } }, t);
  88  | export function record(name: string, data: unknown) { fs.mkdirSync(path.join(OUT, 'records'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'records', name + '.json'), JSON.stringify(data, null, 2) + '\n'); }
  89  | // Product root font (plan v0.3 §3): the harness serves the committed WOFF2 subsets under /fonts/inter/.
  90  | export const FONT_PATH = /^\/fonts\/inter\/inter-[a-z-]+\.woff2$/;
  91  | export const STRESS_TOKEN = 'qa_long_token_'.repeat(150);
  92  | export const STRESS_ASSISTANT = [
  93  |   'Here is **bold** text and a [long link https://example.invalid/' + 'segment/'.repeat(40) + '](https://example.invalid/' + 'segment/'.repeat(40) + ').',
  94  |   '', '| ' + Array.from({ length: 40 }, (_, i) => 'Col' + i).join(' | ') + ' |', '|' + ' --- |'.repeat(40), '| ' + Array.from({ length: 40 }, (_, i) => 'v' + i).join(' | ') + ' |',
  95  |   '', '```typescript', `const token = "${STRESS_TOKEN}";`, 'console.log(token);', '```', '',
  96  |   STRESS_TOKEN, '', '<script>window.__qaXss=2</script><img src=x onerror="window.__qaXss=3"> [js link](javascript:window.__qaXss=4)',
  97  | ].join('\n');
  98  | export const STRESS_USER = 'User text <script>window.__qaXss=5</script><img src=x onerror="window.__qaXss=6"> ' + STRESS_TOKEN;
  99  | export const stressPreset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: ${JSON.stringify(STRESS_USER)} }, { role: 'assistant', content: ${JSON.stringify(STRESS_ASSISTANT)} }, { role: 'user', content: 'Short question?' }] }); }`;
  100 | // WCAG relative-luminance contrast (focus indicator vs adjacent background).
  101 | export const CONTRAST_FN = `(() => { const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  102 |   return (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }; })()`;
  103 | 
```