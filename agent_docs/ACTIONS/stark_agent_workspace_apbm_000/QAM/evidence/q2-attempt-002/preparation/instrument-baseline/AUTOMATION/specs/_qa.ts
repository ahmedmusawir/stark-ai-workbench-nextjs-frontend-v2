// Shared QA spec helpers (disposable). Exact-origin browser policy, page-error capture, fixture control.
import { test as base, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
export const ORIGIN = 'http://127.0.0.1:43181';
export const OUT = path.resolve(process.env.QA_OUT || 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-attempt-001/q2-6');
export const SHOTS = path.join(OUT, 'screens'); fs.mkdirSync(SHOTS, { recursive: true });
export const blocked: string[] = [];
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = [];
    await page.route('**/*', async route => { const u = new URL(route.request().url()); if (u.origin !== ORIGIN) { blocked.push(u.origin); await route.abort(); } else await route.continue(); });
    page.on('pageerror', e => errors.push(String(e)));
    await use(errors);
  },
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
export const setTheme = (page: Page, t: 'dark' | 'light') => page.addInitScript(th => { try { localStorage.setItem('theme', th); } catch { /* */ } }, t);
export function record(name: string, data: unknown) { fs.mkdirSync(path.join(OUT, 'records'), { recursive: true }); fs.writeFileSync(path.join(OUT, 'records', name + '.json'), JSON.stringify(data, null, 2) + '\n'); }
export const STRESS_TOKEN = 'qa_long_token_'.repeat(150);
export const STRESS_ASSISTANT = [
  'Here is **bold** text and a [long link https://example.invalid/' + 'segment/'.repeat(40) + '](https://example.invalid/' + 'segment/'.repeat(40) + ').',
  '', '| ' + Array.from({ length: 40 }, (_, i) => 'Col' + i).join(' | ') + ' |', '|' + ' --- |'.repeat(40), '| ' + Array.from({ length: 40 }, (_, i) => 'v' + i).join(' | ') + ' |',
  '', '```typescript', `const token = "${STRESS_TOKEN}";`, 'console.log(token);', '```', '',
  STRESS_TOKEN, '', '<script>window.__qaXss=2</script><img src=x onerror="window.__qaXss=3"> [js link](javascript:window.__qaXss=4)',
].join('\n');
export const STRESS_USER = 'User text <script>window.__qaXss=5</script><img src=x onerror="window.__qaXss=6"> ' + STRESS_TOKEN;
export const stressPreset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: ${JSON.stringify(STRESS_USER)} }, { role: 'assistant', content: ${JSON.stringify(STRESS_ASSISTANT)} }, { role: 'user', content: 'Short question?' }] }); }`;
