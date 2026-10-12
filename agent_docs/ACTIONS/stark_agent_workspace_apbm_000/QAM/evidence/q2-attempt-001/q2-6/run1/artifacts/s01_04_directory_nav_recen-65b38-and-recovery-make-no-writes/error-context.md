# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: s01_04_directory_nav_recents.spec.ts >> S-04 recents: ready/empty/loading/unavailable/partial/recovered are distinct; retry and recovery make no writes
- Location: agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/specs/s01_04_directory_nav_recents.spec.ts:74:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
  1  | // Shared QA spec helpers (disposable). Exact-origin browser policy, page-error capture, fixture control.
  2  | import { test as base, expect, type Page } from '@playwright/test';
  3  | import fs from 'node:fs';
  4  | import path from 'node:path';
  5  | export const ORIGIN = 'http://127.0.0.1:43181';
  6  | export const OUT = path.resolve(process.env.QA_OUT || 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-001/q2-6');
  7  | export const SHOTS = path.join(OUT, 'screens'); fs.mkdirSync(SHOTS, { recursive: true });
  8  | export const blocked: string[] = [];
  9  | export const test = base.extend<{ errors: string[] }>({
  10 |   errors: async ({ page }, use) => {
  11 |     const errors: string[] = [];
  12 |     await page.route('**/*', async route => { const u = new URL(route.request().url()); if (u.origin !== ORIGIN) { blocked.push(u.origin); await route.abort(); } else await route.continue(); });
  13 |     page.on('pageerror', e => errors.push(String(e)));
  14 |     await use(errors);
  15 |   },
  16 | });
  17 | export { expect };
  18 | export const ROWS = [{ id: 'row-a', sessionId: 'A', title: 'Planning the launch', updatedAt: '2026-10-04T10:00:00Z' }, { id: 'row-b', sessionId: 'B', title: 'Comparing options', updatedAt: '2026-10-03T10:00:00Z' }];
  19 | export async function open(page: Page, o: { query?: string; roster?: string; status?: string; path?: string; preset?: string } = {}) {
  20 |   if (o.preset) await page.addInitScript(`window.__qaPreset = ${o.preset};`);
  21 |   await page.goto(`${o.path || '/'}${o.query ? '?' + o.query : ''}#roster=${o.roster || 'QR1'}&status=${o.status || 'ready'}`);
  22 |   await page.waitForFunction(() => !!(window as any).qa);
  23 | }
  24 | // Common presets (stringified functions evaluated in the page)
  25 | export const P = {
  26 |   rows: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'user', content: 'Question for ' + c.session }, { role: 'assistant', content: 'only session ' + c.session }] }); }`,
  27 |   rowsDeferHistory: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); }`,
  28 | };
  29 | export const ledger = (page: Page) => page.evaluate(() => (window as any).qa.ledger as Array<{ seq: number; action: string; agent?: string; session?: string | null; message?: string; title?: string; row?: string }>);
  30 | export const count = async (page: Page, action: string) => (await ledger(page)).filter(c => c.action === action).length;
  31 | export const pendingOf = (page: Page, action: string) => page.evaluate(a => (window as any).qa.pendingOf(a) as number[], action);
> 32 | export const resolveLast = async (page: Page, action: string, value: unknown) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, v]) => (window as any).qa.resolve(id, v), [ids[ids.length - 1], value] as const); };
     |                                                                                                                                                  ^ Error: expect(received).toBeGreaterThan(expected)
  33 | export const rejectLast = async (page: Page, action: string, msg: string) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, m]) => (window as any).qa.reject(id, m), [ids[ids.length - 1], msg] as const); };
  34 | export const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  35 | export const setTheme = (page: Page, t: 'dark' | 'light') => page.addInitScript(th => { try { localStorage.setItem('theme', th); } catch { /* */ } }, t);
  36 | export function record(name: string, data: unknown) { fs.mkdirSync(path.join(OUT, 'records'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'records', name + '.json'), JSON.stringify(data, null, 2) + '\n'); }
  37 | export const STRESS_TOKEN = 'qa_long_token_'.repeat(150);
  38 | export const STRESS_ASSISTANT = [
  39 |   'Here is **bold** text and a [long link https://example.invalid/' + 'segment/'.repeat(40) + '](https://example.invalid/' + 'segment/'.repeat(40) + ').',
  40 |   '', '| ' + Array.from({ length: 40 }, (_, i) => 'Col' + i).join(' | ') + ' |', '|' + ' --- |'.repeat(40), '| ' + Array.from({ length: 40 }, (_, i) => 'v' + i).join(' | ') + ' |',
  41 |   '', '```typescript', `const token = "${STRESS_TOKEN}";`, 'console.log(token);', '```', '',
  42 |   STRESS_TOKEN, '', '<script>window.__qaXss=2</script><img src=x onerror="window.__qaXss=3"> [js link](javascript:window.__qaXss=4)',
  43 | ].join('\n');
  44 | export const STRESS_USER = 'User text <script>window.__qaXss=5</script><img src=x onerror="window.__qaXss=6"> ' + STRESS_TOKEN;
  45 | export const stressPreset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: ${JSON.stringify(STRESS_USER)} }, { role: 'assistant', content: ${JSON.stringify(STRESS_ASSISTANT)} }] }); }`;
  46 | 
```