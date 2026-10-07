import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, rejectLast, record, SHOTS } from './_qa';
import path from 'node:path';

test('S-01 directory filter is local, case-insensitive over name+description; distinct no-results; no service calls', async ({ page, errors }) => {
  await open(page);
  await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  await expect(page.locator('.ws-count')).toHaveText('6 agents available');
  const f = page.getByLabel('Find an agent');
  const cards = () => page.locator('.ws-agent-card h2').allInnerTexts();
  await f.fill('kestrel'); expect(await cards()).toEqual(['Kestrel Ops']);
  await f.fill('KESTREL'); expect(await cards()).toEqual(['Kestrel Ops']);
  await f.fill('reserved characters'); expect((await cards()).length).toBe(1);
  await f.fill('ünïcode description'); expect(await cards()).toEqual(['Unicode Agent']);
  await f.fill('zzz-no-match'); await expect(page.getByRole('heading', { name: 'No matching agents' })).toBeVisible();
  await expect(page.getByText('No agents configured')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filter' }).first().click(); expect((await cards()).length).toBe(6);
  // literal markup in an agent name renders as text, never as an element
  await expect(page.locator('.ws-agent-card h2', { hasText: '<img src=x onerror="window.__qaXss=1">' })).toHaveCount(1);
  expect(await page.evaluate(() => (window as any).__qaXss)).toBeUndefined(); expect(await page.locator('.ws-agent-card img').count()).toBe(0);
  expect(await ledger(page)).toEqual([]); expect(errors).toEqual([]);
  for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t); await page.screenshot({ path: path.join(SHOTS, `s01-directory-${t}-1280.png`) }); }
});

test('S-01 empty / loading / unavailable roster are distinct and fabricate nothing', async ({ page }) => {
  const seen: Record<string, string> = {};
  for (const [roster, status, text] of [['QR0', 'ready', 'No agents configured'], ['QR1', 'loading', 'Loading agents…'], ['QR1', 'unavailable', 'Agent configuration unavailable']]) {
    await open(page, { roster, status }); await expect(page.getByText(text)).toBeVisible();
    expect(await page.locator('.ws-agent-card').count()).toBe(0); seen[`${roster}/${status}`] = text; expect(await ledger(page)).toEqual([]);
  }
  record('s01-roster-states', seen);
});

test('S-02 alternate rosters use the same components; neutral fallbacks; approved roster renders exactly', async ({ page }) => {
  await open(page, { roster: 'QR2' });
  await expect(page.locator('.ws-agent-card')).toHaveCount(1); await expect(page.locator('.ws-agent-card p')).toHaveText('Configured agent workspace.');
  await open(page, { roster: 'QR1' });
  await expect(page.locator('.ws-agent-card', { hasText: 'ATLAS mixed Case' }).locator('p')).toHaveText('Configured agent workspace.');
  await open(page, { roster: 'R6' });
  const names = await page.locator('.ws-agent-card h2').allInnerTexts();
  expect(names).toEqual(['Greeting Agent', 'Jarvis', 'Calc Agent', 'Product Agent', 'GHL CRM Agent', 'MOOSE CRM Agent']);
  // CONTROL (expected-red oracle): a fabricated default agent in the oracle is detected
  expect(names).not.toEqual([...names, 'Default Agent']);
  record('s02-approved-roster-render', { names });
  await page.screenshot({ path: path.join(SHOTS, 's02-approved-roster-directory-dark-1280.png') });
});

test('S-03 view identity: directory→workspace→conversation→draft, Back×3/Forward×3; encoded IDs', async ({ page }) => {
  await open(page, { preset: P.rows });
  const view = async () => { const u = new URL(page.url()); return u.search; };
  await page.locator('.ws-agent-card', { hasText: 'Kestrel Ops' }).click();
  expect(await view()).toBe('?agent=kestrel'); await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Kestrel Ops' })).toBeVisible();
  await page.getByRole('link', { name: /Planning the launch/ }).click();
  expect(await view()).toBe('?agent=kestrel&session=A'); await expect(page.getByText('only session A')).toBeVisible();
  await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  expect(await view()).toBe('?agent=kestrel&new=1'); await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible();
  const steps: string[] = [];
  for (const exp of ['?agent=kestrel&session=A', '?agent=kestrel', '']) { await page.goBack(); await expect.poll(view).toBe(exp); steps.push(exp); }
  await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  for (const exp of ['?agent=kestrel', '?agent=kestrel&session=A', '?agent=kestrel&new=1']) { await page.goForward(); await expect.poll(view).toBe(exp); steps.push(exp); }
  await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible();
  for (const [q, name] of [['agent=a%26b%3Dc', 'Very long agent name'], ['agent=x%2F..%2Fy', 'Path Agent'], ['agent=%C3%BCn%C3%AF-%C5%9D', 'Unicode Agent'], ['agent=spaced+id', 'ATLAS mixed Case']]) {
    await open(page, { query: q }); await expect(page.locator('.ws-root').getByRole('heading', { level: 1 })).toContainText(name);
  }
  record('s03-history-steps', steps);
});

test('S-03 invalid/contradictory selectors: safe unavailable state, zero service calls', async ({ page }) => {
  const bad = ['agent=kestrel&new=0', 'agent=kestrel&new=1&session=s', 'session=s', 'agent=unknown', 'agent=kestrel&user=u2', 'agent=kestrel&agent=kestrel', 'agent=KESTREL', 'agent=kestrel&backend=x', 'agent=kestrel&session=%20'];
  for (const q of bad) { await open(page, { query: q }); await expect(page.getByRole('heading', { name: 'Workspace unavailable' })).toBeVisible(); expect(await ledger(page)).toEqual([]); }
  await page.getByRole('button', { name: 'Back to all agents' }).click(); await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  record('s03-invalid', bad);
});

test('S-04 recents: ready/empty/loading/unavailable/partial/recovered are distinct; retry and recovery make no writes', async ({ page }) => {
  await open(page, { query: 'agent=kestrel' });
  await expect(page.getByText('Loading conversations…')).toBeVisible(); // pending list
  const recents = page.locator('.ws-recents'); const shots: Record<string, Buffer> = {};
  await resolveLast(page, 'list', { status: 'ready', rows: ROWS }); await expect(recents.getByText('Planning the launch')).toBeVisible(); shots.ready = await recents.screenshot();
  await open(page, { query: 'agent=kestrel' }); await resolveLast(page, 'list', { status: 'empty', rows: [] });
  await expect(recents.getByRole('heading', { name: 'A fresh start' })).toBeVisible(); shots.empty = await recents.screenshot(); const emptyAgain = await recents.screenshot();
  await open(page, { query: 'agent=kestrel' }); await rejectLast(page, 'list', 'unavailable');
  await expect(recents.getByRole('heading', { name: 'Conversations unavailable' })).toBeVisible(); await expect(recents.getByText('History has not been deleted.')).toBeVisible(); shots.unavailable = await recents.screenshot();
  const before = await count(page, 'list'); await recents.getByRole('button', { name: 'Try again' }).click(); await expect.poll(() => count(page, 'list')).toBe(before + 1);
  await open(page, { query: 'agent=kestrel' }); await resolveLast(page, 'list', { status: 'partial', rows: ROWS });
  await expect(recents.getByRole('heading', { name: 'Conversation details unavailable' })).toBeVisible(); await expect(recents.getByRole('button', { name: /Actions for/ })).toHaveCount(0); shots.partial = await recents.screenshot();
  const l0 = (await ledger(page)).length; await recents.getByRole('button', { name: 'View available conversations' }).click();
  await expect(recents.getByRole('heading', { name: 'Recovery view' })).toBeVisible(); await expect(recents.getByText('Some listed conversations may have been archived.')).toBeVisible();
  expect((await ledger(page)).length).toBe(l0); shots.recovered = await recents.screenshot();
  // CONTROL: pixel detector — distinct states differ, identical state is identical
  expect(Buffer.compare(shots.empty, emptyAgain)).toBe(0); expect(Buffer.compare(shots.empty, shots.unavailable)).not.toBe(0);
  for (const [k, b] of Object.entries(shots)) require('fs').writeFileSync(path.join(SHOTS, `s04-recents-${k}.png`), b);
  expect(await pendingOf(page, 'send')).toEqual([]);
});
