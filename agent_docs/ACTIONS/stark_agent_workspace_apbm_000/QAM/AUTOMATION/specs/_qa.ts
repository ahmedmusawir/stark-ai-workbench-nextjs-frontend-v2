// Shared QA spec helpers (disposable). Attempt-002 (plan v0.3 §3): the exact-origin browser policy and page-error capture are
// MANDATORY for every context and page — an auto worker fixture guards every browser.newContext() (incl. S-14/S-16/S-19 manual
// contexts and browser.newPage) and an auto test fixture guards the default context, keeps a per-test ledger and FAILS the test
// on any unconsumed event. Controls consume only their own labelled events (consumeControl).
import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
export const ORIGIN = process.env.QA_ORIGIN || 'http://127.0.0.1:43181';
export const OUT = path.resolve(process.env.QA_OUT || 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-002/acceptance/G');
export const SHOTS = path.join(OUT, 'screens'); fs.mkdirSync(SHOTS, { recursive: true });

type PolicyEvent = { kind: 'request-blocked' | 'request-offorigin-observed' | 'websocket-blocked' | 'serviceworker' | 'pageerror' | 'crash'; detail: string; at: number; consumedBy?: string };
const policy = { events: [] as PolicyEvent[], contexts: 0, pages: 0, requests: 0 };
// Origins/paths only (never query strings or bodies) — ledgers stay free of payloads.
const redact = (raw: string) => { try { const u = new URL(raw); return u.protocol.startsWith('http') || u.protocol.startsWith('ws') ? `${u.origin}${u.pathname}` : `${u.protocol}…`; } catch { return 'unparseable-url'; } };
const exactOrigin = (raw: string) => { try { return new URL(raw).origin; } catch { return null; } };
export const blocked: string[] = []; // compat: blocked origins (attempt-001 specs)
const pageErrors: string[] = []; // compat: per-test page errors (all pages/contexts), exposed as the 'errors' fixture

export async function guardContext(ctx: BrowserContext) {
  const c = ctx as BrowserContext & { __qaGuarded?: boolean };
  if (c.__qaGuarded) return; c.__qaGuarded = true; policy.contexts++;
  await ctx.route('**/*', async route => {
    const raw = route.request().url();
    if (exactOrigin(raw) === ORIGIN) return route.continue();
    blocked.push(exactOrigin(raw) || 'non-origin'); policy.events.push({ kind: 'request-blocked', detail: redact(raw), at: Date.now() });
    await route.abort('blockedbyclient');
  });
  await ctx.routeWebSocket(/.*/, ws => { policy.events.push({ kind: 'websocket-blocked', detail: redact(ws.url()), at: Date.now() }); void ws.close(); });
  const attach = (p: Page) => {
    const g = p as Page & { __qaGuarded?: boolean }; if (g.__qaGuarded) return; g.__qaGuarded = true; policy.pages++;
    p.on('pageerror', e => { pageErrors.push(String(e).slice(0, 400)); policy.events.push({ kind: 'pageerror', detail: String(e).slice(0, 400), at: Date.now() }); });
    p.on('crash', () => policy.events.push({ kind: 'crash', detail: redact(p.url()), at: Date.now() }));
  };
  ctx.pages().forEach(attach); ctx.on('page', attach);
  ctx.on('request', r => { policy.requests++; if (exactOrigin(r.url()) !== ORIGIN) policy.events.push({ kind: 'request-offorigin-observed', detail: redact(r.url()), at: Date.now() }); });
  ctx.on('serviceworker', w => policy.events.push({ kind: 'serviceworker', detail: redact(w.url()), at: Date.now() }));
}
/** Mark matching unconsumed events as an expected control; returns how many were consumed. */
export function consumeControl(kind: PolicyEvent['kind'], match: RegExp, label: string) {
  let n = 0; for (const e of policy.events) if (!e.consumedBy && e.kind === kind && match.test(e.detail)) { e.consumedBy = label; n++; } return n;
}
export const policyEvents = () => policy.events.map(e => ({ ...e }));
export const policyCounters = () => ({ contexts: policy.contexts, pages: policy.pages, requests: policy.requests });

export const test = base.extend<{ errors: string[]; _qaPolicy: void }, { _qaBrowserGuard: void }>({
  _qaBrowserGuard: [async ({ browser }, use) => {
    const original = browser.newContext.bind(browser);
    (browser as unknown as { newContext: typeof browser.newContext }).newContext = async (options = {}) => {
      const ctx = await original({ ...options, serviceWorkers: 'block' }); await guardContext(ctx); return ctx;
    };
    await use();
  }, { scope: 'worker', auto: true }],
  _qaPolicy: [async ({ context }, use, testInfo) => {
    policy.events.length = 0; policy.contexts = 0; policy.pages = 0; policy.requests = 0; blocked.length = 0; pageErrors.length = 0;
    await guardContext(context); // idempotent; the patched newContext normally guarded it already
    await use();
    const unexpected = policy.events.filter(e => !e.consumedBy);
    const slug = testInfo.titlePath.slice(1).join(' › ').replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 150);
    fs.mkdirSync(path.join(OUT, 'ledgers'), { recursive: true });
    fs.writeFileSync(path.join(OUT, 'ledgers', `${slug}.json`), JSON.stringify({ test: testInfo.titlePath.slice(1), status: testInfo.status, origin: ORIGIN,
      counters: policyCounters(), events: policy.events, unexpected: unexpected.length }, null, 2) + '\n');
    if (unexpected.length) throw new Error(`QA_POLICY_UNEXPECTED_EVENTS ${JSON.stringify(unexpected)}`);
  }, { auto: true }],
  // Compat for attempt-001 specs: page errors observed in this test (all pages/contexts). Depends on _qaPolicy so it is reset first.
  errors: async ({ _qaPolicy }, use) => { void _qaPolicy; await use(pageErrors); },
});
export { expect };
export const ROWS = [{ id: 'row-a', sessionId: 'A', title: 'Planning the launch', updatedAt: '2026-10-04T10:00:00Z' }, { id: 'row-b', sessionId: 'B', title: 'Comparing options', updatedAt: '2026-10-03T10:00:00Z' }];
export async function open(page: Page, o: { query?: string; roster?: string; status?: string; path?: string; preset?: string } = {}) {
  if (o.preset) await page.addInitScript(`window.__qaPreset = ${o.preset};`);
  await page.goto('about:blank');
  await page.goto(`${o.path || '/'}${o.query ? '?' + o.query : ''}#roster=${o.roster || 'QR1'}&status=${o.status || 'ready'}`);
  await page.waitForFunction(() => !!(window as any).qa);
}
// Common presets (stringified functions evaluated in the page)
export const P = {
  rows: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'user', content: 'Question for ' + c.session }, { role: 'assistant', content: 'only session ' + c.session }] }); }`,
  rowsDeferHistory: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); }`,
};
export const ledger = (page: Page) => page.evaluate(() => (window as any).qa.ledger as Array<{ seq: number; action: string; agent?: string; session?: string | null; message?: string; title?: string; row?: string }>);
export const count = async (page: Page, action: string) => (await ledger(page)).filter(c => c.action === action).length;
export const pendingOf = (page: Page, action: string) => page.evaluate(a => (window as any).qa.pendingOf(a) as number[], action);
export const resolveLast = async (page: Page, action: string, value: unknown) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, v]) => (window as any).qa.resolve(id, v), [ids[ids.length - 1], value] as const); };
export const rejectLast = async (page: Page, action: string, msg: string) => { const ids = await pendingOf(page, action); expect(ids.length).toBeGreaterThan(0); await page.evaluate(([id, m]) => (window as any).qa.reject(id, m), [ids[ids.length - 1], msg] as const); };
export const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
export const setTheme = (page: Page, t: 'dark' | 'light' | 'system') => page.addInitScript(th => { try { localStorage.setItem('theme', th); } catch { /* */ } }, t);
export function record(name: string, data: unknown) { fs.mkdirSync(path.join(OUT, 'records'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'records', name + '.json'), JSON.stringify(data, null, 2) + '\n'); }
// Product root font (plan v0.3 §3): the harness serves the committed WOFF2 subsets under /fonts/inter/.
export const FONT_PATH = /^\/fonts\/inter\/inter-[a-z-]+\.woff2$/;
export const STRESS_TOKEN = 'qa_long_token_'.repeat(150);
export const STRESS_ASSISTANT = [
  'Here is **bold** text and a [long link https://example.invalid/' + 'segment/'.repeat(40) + '](https://example.invalid/' + 'segment/'.repeat(40) + ').',
  '', '| ' + Array.from({ length: 40 }, (_, i) => 'Col' + i).join(' | ') + ' |', '|' + ' --- |'.repeat(40), '| ' + Array.from({ length: 40 }, (_, i) => 'v' + i).join(' | ') + ' |',
  '', '```typescript', `const token = "${STRESS_TOKEN}";`, 'console.log(token);', '```', '',
  STRESS_TOKEN, '', '<script>window.__qaXss=2</script><img src=x onerror="window.__qaXss=3"> [js link](javascript:window.__qaXss=4)',
].join('\n');
export const STRESS_USER = 'User text <script>window.__qaXss=5</script><img src=x onerror="window.__qaXss=6"> ' + STRESS_TOKEN;
export const stressPreset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: ${JSON.stringify(STRESS_USER)} }, { role: 'assistant', content: ${JSON.stringify(STRESS_ASSISTANT)} }, { role: 'user', content: 'Short question?' }] }); }`;
// WCAG relative-luminance contrast (focus indicator vs adjacent background).
export const CONTRAST_FN = `(() => { const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  return (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }; })()`;
