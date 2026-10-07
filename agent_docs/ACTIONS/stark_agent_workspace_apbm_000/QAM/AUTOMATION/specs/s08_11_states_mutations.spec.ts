import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, rejectLast, record, SHOTS } from './_qa';
import path from 'node:path';
import fs from 'node:fs';

const historyPreset = (h: string) => `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); qa.auto.history = ${h}; }`;
const writes = async (page: import('@playwright/test').Page) => (await ledger(page)).filter(c => ['send', 'rename', 'archive'].includes(c.action)).length;

test('S-08 missing / unavailable / access-unavailable are distinct from empty with constrained actions', async ({ page }) => {
  const shots: Record<string, Buffer> = {}; const main = page.locator('#ws-main');
  await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'empty', messages: [] })`) });
  await expect(page.getByText('Chat with Kestrel Ops')).toBeVisible(); shots.empty = await main.screenshot();
  await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'missing', messages: [] })`) });
  await expect(page.getByRole('heading', { name: 'Conversation not found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'New conversation' })).toBeVisible(); await expect(page.getByRole('button', { name: 'Back to workspace' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Try loading again|Recreate|Restore/ })).toHaveCount(0); shots.missing = await main.screenshot();
  await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => new Error('history down')`) });
  await expect(page.getByRole('heading', { name: 'History unavailable' })).toBeVisible(); shots.unavailable = await main.screenshot();
  const h0 = await count(page, 'history'); await page.getByRole('button', { name: 'Try loading again' }).click();
  await expect.poll(() => count(page, 'history')).toBe(h0 + 1); expect(await writes(page)).toBe(0);
  await open(page, { query: 'agent=kestrel&session=A', preset: historyPreset(`() => ({ status: 'access-unavailable', messages: [] })`) });
  await expect(page.getByRole('heading', { name: 'Conversation access unavailable' })).toBeVisible(); await expect(page.getByLabel('Message', { exact: true })).toBeDisabled(); shots.access = await main.screenshot();
  for (const k of ['missing', 'unavailable', 'access']) expect(Buffer.compare(shots.empty, shots[k])).not.toBe(0);
  for (const [k, b] of Object.entries(shots)) fs.writeFileSync(path.join(SHOTS, `s08-${k}.png`), b);
});

for (const mode of ['resolved-uncertain', 'rejected-throw', 'pending-35s-then-timeout'] as const) {
  test(`S-09 unknown outcome (${mode}): send paused, attempted text visible, only history inspection, never "not sent"`, async ({ page }) => {
    test.setTimeout(mode === 'pending-35s-then-timeout' ? 90000 : 30000);
    await open(page, { query: 'agent=kestrel&session=A', preset: P.rows });
    await expect(page.getByText('only session A')).toBeVisible();
    await page.getByLabel('Message', { exact: true }).fill(`attempt ${mode}`); await page.getByLabel('Message', { exact: true }).press('Enter');
    await expect(page.getByText('Waiting for a reply')).toBeVisible();
    if (mode === 'resolved-uncertain') await resolveLast(page, 'send', { status: 'uncertain' });
    else if (mode === 'rejected-throw') await rejectLast(page, 'send', 'network reset');
    else { await page.waitForTimeout(35000); expect(await pendingOf(page, 'send')).toHaveLength(1); await rejectLast(page, 'send', 'Request timed out after 35000ms'); }
    await expect(page.getByRole('heading', { name: 'Send outcome unknown' })).toBeVisible();
    await expect(page.getByText('Message not sent')).toHaveCount(0);
    await expect(page.locator('.ws-thread').getByText(`attempt ${mode}`)).toBeVisible();
    await expect(page.getByLabel('Message', { exact: true })).toBeDisabled();
    if (mode !== 'resolved-uncertain') expect((await page.evaluate(() => (window as any).qa.rejections)).length).toBe(1); // control: fixture really rejected
    const h0 = await count(page, 'history'); await page.evaluate(() => { (window as any).qa.auto.history = () => ({ status: 'empty', messages: [] }); });
    await page.getByRole('button', { name: 'Check history' }).click(); await expect.poll(() => count(page, 'history')).toBe(h0 + 1);
    await expect(page.getByRole('heading', { name: 'Send outcome unknown' })).toBeVisible(); // degraded empty read does not resolve uncertainty
    expect(await count(page, 'send')).toBe(1); expect(await writes(page)).toBe(1);
    record(`s09-${mode}`, await ledger(page));
  });
}

test('S-09 confirmed not-sent keeps an editable draft and requires deliberate send', async ({ page }) => {
  await open(page, { query: 'agent=kestrel&session=A', preset: P.rows });
  await page.getByLabel('Message', { exact: true }).fill('keep me'); await page.getByLabel('Message', { exact: true }).press('Enter'); await resolveLast(page, 'send', { status: 'not-sent' });
  await expect(page.getByRole('heading', { name: 'Message not sent' })).toBeVisible(); await expect(page.getByLabel('Message', { exact: true })).toBeEnabled(); await expect(page.getByLabel('Message', { exact: true })).toHaveValue('keep me');
  await page.waitForTimeout(500); expect(await count(page, 'send')).toBe(1);
  await page.getByLabel('Message', { exact: true }).press('Enter'); await expect.poll(() => count(page, 'send')).toBe(2);
});

test('S-10 pending status; metadata warning keeps ID/transcript and offers list read only', async ({ page }) => {
  await open(page, { query: 'agent=kestrel&new=1', preset: P.rows });
  await page.getByLabel('Message', { exact: true }).fill('start'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await expect(page.locator('[role=status]', { hasText: 'Waiting for a reply' })).toBeVisible();
  await resolveLast(page, 'send', { status: 'sent', sessionId: 'M1', reply: 'Confirmed reply', metadataWarning: true });
  await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=M1');
  await expect(page.getByRole('heading', { name: 'Conversation started; title not saved' })).toBeVisible(); await expect(page.getByText('Confirmed reply')).toBeVisible();
  const l0 = await count(page, 'list'); await page.getByRole('button', { name: 'Check conversation list' }).click();
  await expect.poll(() => count(page, 'list')).toBe(l0 + 1); expect(await count(page, 'send')).toBe(1);
});

test('S-10 late history cannot paint another session; identity switch mid-flight cannot surface prior-user content', async ({ page }) => {
  await open(page, { query: 'agent=kestrel&session=A', preset: P.rowsDeferHistory });
  await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1); const [hA] = await pendingOf(page, 'history');
  await page.locator('.ws-desktop').getByRole('link', { name: 'Comparing options' }).click();
  await expect.poll(() => pendingOf(page, 'history')).toHaveLength(2); const hB = (await pendingOf(page, 'history')).find(x => x !== hA)!;
  await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'only session B' }] }), hB);
  await expect(page.getByText('only session B')).toBeVisible();
  await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'only session A' }] }), hA);
  await page.waitForTimeout(300); await expect(page.getByText('only session A')).toHaveCount(0);
  // identity switch while a history read is in flight
  await open(page, { query: 'agent=kestrel&session=A', preset: P.rowsDeferHistory }); await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1);
  const [old] = await pendingOf(page, 'history'); await page.evaluate(() => (window as any).qa.setIdentity('qa-user-b'));
  await page.evaluate(id => (window as any).qa.resolve(id, { status: 'ready', messages: [{ role: 'assistant', content: 'PRIOR USER CONTENT' }] }), old);
  await page.waitForTimeout(300); await expect(page.getByText('PRIOR USER CONTENT')).toHaveCount(0);
  // CONTROL: a mis-keyed resolution (A content delivered for B's request) is detected by the same check
  await open(page, { query: 'agent=kestrel&session=B', preset: P.rowsDeferHistory }); await expect.poll(() => pendingOf(page, 'history')).toHaveLength(1);
  await resolveLast(page, 'history', { status: 'ready', messages: [{ role: 'assistant', content: 'only session A' }] });
  await expect(page.getByText('only session A')).toHaveCount(1);
});

test('S-11 rename/archive: whitespace rejected, literal punctuation, failure retention, archive hides only, focus destinations', async ({ page }) => {
  await open(page, { query: 'agent=kestrel', preset: `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: ${JSON.stringify(ROWS)} }); }` });
  const opener = page.getByRole('button', { name: 'Actions for Planning the launch' }); await opener.click();
  const dlg = page.getByRole('dialog', { name: 'Conversation actions' }); await expect(dlg).toBeVisible();
  await dlg.getByLabel('Conversation title').fill('   '); await expect(dlg.getByRole('button', { name: 'Save name' })).toBeDisabled(); expect(await count(page, 'rename')).toBe(0);
  await page.keyboard.press('Escape'); await expect(dlg).toBeHidden(); await expect(opener).toBeFocused();
  const LIT = `<b>&amp;"'</b> 🚀`;
  await opener.click(); await dlg.getByLabel('Conversation title').fill(LIT); await dlg.getByRole('button', { name: 'Save name' }).click();
  await resolveLast(page, 'rename', undefined); await expect(dlg).toBeHidden();
  await expect(page.locator('.ws-recent-row strong', { hasText: LIT })).toHaveCount(1); await expect(page.getByRole('button', { name: `Actions for ${LIT}` })).toHaveCount(1);
  expect(await page.locator('.ws-recents b').count()).toBe(0); expect((await ledger(page)).find(c => c.action === 'rename')).toMatchObject({ row: 'row-a', title: LIT });
  await page.getByRole('button', { name: `Actions for ${LIT}` }).click(); await dlg.getByLabel('Conversation title').fill('Should not stick'); await dlg.getByRole('button', { name: 'Save name' }).click();
  await rejectLast(page, 'rename', 'metadata down'); await expect(dlg.getByRole('alert')).toHaveText('Could not save this change. The conversation and title have been kept.');
  await page.keyboard.press('Escape'); await expect(page.locator('.ws-recent-row strong', { hasText: LIT })).toHaveCount(1);
  await page.getByRole('button', { name: 'Actions for Comparing options' }).click(); await dlg.getByRole('button', { name: 'Archive conversation' }).click();
  await page.keyboard.press('Escape'); await expect(dlg).toBeVisible(); // Escape ignored while mutation pending
  await rejectLast(page, 'archive', 'archive down'); await expect(dlg.getByRole('alert')).toBeVisible(); await page.keyboard.press('Escape');
  await expect(page.getByText('Comparing options')).toBeVisible();
  await page.getByRole('button', { name: 'Actions for Comparing options' }).click(); await dlg.getByRole('button', { name: 'Archive conversation' }).click(); await resolveLast(page, 'archive', undefined);
  await expect(page.getByText('Comparing options')).toHaveCount(0); await expect(page.getByRole('heading', { name: 'Recent conversations' })).toBeFocused();
  const l = await ledger(page); expect(l.filter(c => c.action === 'archive').map(c => c.row)).toEqual(['row-b', 'row-b']); expect(l.some(c => !['list', 'rename', 'archive'].includes(c.action))).toBe(false);
  await page.evaluate(lit => { (window as any).qa.auto.list = () => ({ status: 'ready', rows: [{ id: 'row-a', sessionId: 'A', title: lit }] }); (window as any).qa.auto.history = () => ({ status: 'ready', messages: [] }); }, LIT);
  await page.locator('.ws-recent-row a').first().click(); await expect(page.locator('.ws-crumbs')).toContainText(LIT);
  // CONTROL: the HTML-element detector finds an unsafe injection
  await page.evaluate(() => { const d = document.createElement('div'); d.className = 'ws-recents'; d.innerHTML = '<b>x</b>'; document.body.appendChild(d); });
  expect(await page.locator('.ws-recents b').count()).toBe(1);
  record('s11-ledger', l); await page.screenshot({ path: path.join(SHOTS, 's11-after-mutations.png') });
});
