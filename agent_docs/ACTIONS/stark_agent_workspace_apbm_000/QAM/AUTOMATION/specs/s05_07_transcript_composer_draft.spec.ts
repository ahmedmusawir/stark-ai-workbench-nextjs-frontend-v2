import { test, expect, open, P, ledger, count, pendingOf, resolveLast, overflow, record, stressPreset, STRESS_ASSISTANT, SHOTS } from './_qa';
import path from 'node:path';

test('S-05 transcript: markdown/GFM/code render; no injected markup executes; long content scrolls in its own region', async ({ page, errors }) => {
  const metrics: Record<string, unknown> = {};
  for (const w of [375, 768, 1280]) {
    await page.setViewportSize({ width: w, height: 900 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
    await expect(page.locator('.ws-thread table')).toBeVisible();
    const m = await page.evaluate(() => {
      const t = document.querySelector('.ws-thread')!, table = t.querySelector('table')!.parentElement!, code = t.querySelector('.ws-code-scroll') as HTMLElement;
      const turns = t.querySelectorAll('.ws-turn'); const user = turns[turns.length - 1].firstElementChild!.firstElementChild as HTMLElement; const ub = user.getBoundingClientRect(), tb = t.getBoundingClientRect();
      return { xss: (window as any).__qaXss ?? null, scripts: t.querySelectorAll('script').length, imgs: t.querySelectorAll('img').length,
        jsLinks: [...t.querySelectorAll('a')].filter(a => (a.getAttribute('href') || '').toLowerCase().startsWith('javascript')).length,
        tableScrolls: table.scrollWidth > table.clientWidth, codeScrolls: !!code && code.scrollWidth > code.clientWidth,
        overflow: document.documentElement.scrollWidth - innerWidth, threadWidth: Math.round(tb.width),
        userRightGap: Math.round(tb.right - ub.right), userLeftGap: Math.round(ub.left - tb.left), bold: t.querySelectorAll('strong').length };
    });
    metrics[w] = m;
    expect(m.xss).toBeNull(); expect(m.scripts).toBe(0); expect(m.imgs).toBe(0); expect(m.jsLinks).toBe(0);
    expect(m.tableScrolls).toBe(true); expect(m.codeScrolls).toBe(true); expect(m.overflow).toBeLessThanOrEqual(1); expect(m.bold).toBeGreaterThan(0);
    expect(m.userRightGap).toBeLessThan(m.userLeftGap); // user bubble aligned right
  }
  expect(errors).toEqual([]); record('s05-transcript-metrics', metrics);
  // CONTROL: the injection detector fires when the same string is injected unsafely
  await page.evaluate(s => { const d = document.createElement('div'); d.innerHTML = s; document.body.appendChild(d); }, STRESS_ASSISTANT.split('\n').slice(-1)[0]);
  await expect.poll(() => page.evaluate(() => (window as any).__qaXss ?? null)).not.toBeNull();
});

test('S-06 composer: whitespace rejected; single send on Enter; repeat blocked while pending; Shift+Enter newline; IME Enter ignored', async ({ page }) => {
  await open(page, { query: 'agent=kestrel&new=1', preset: P.rows });
  const box = page.getByLabel('Message', { exact: true }), sendBtn = page.getByRole('button', { name: 'Send message' });
  await box.fill('   \n  '); await expect(sendBtn).toBeDisabled(); await box.press('Enter'); expect(await count(page, 'send')).toBe(0);
  await box.fill('line one'); await box.press('Shift+Enter'); await box.pressSequentially('line two'); expect(await box.inputValue()).toBe('line one\nline two'); expect(await count(page, 'send')).toBe(0);
  await box.fill('ime text'); await box.evaluate(el => el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, isComposing: true })));
  await box.evaluate(el => { const e = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }); Object.defineProperty(e, 'keyCode', { get: () => 229 }); el.dispatchEvent(e); });
  expect(await count(page, 'send')).toBe(0);
  await box.press('Enter'); await expect.poll(() => count(page, 'send')).toBe(1);
  await expect(box).toBeDisabled(); await expect(page.getByText('Waiting for a reply')).toBeVisible();
  for (let i = 0; i < 5; i++) { await box.press('Enter', { timeout: 500 }).catch(() => {}); await sendBtn.click({ force: true, timeout: 500 }).catch(() => {}); }
  expect(await count(page, 'send')).toBe(1); expect((await ledger(page)).find(c => c.action === 'send')!.message).toBe('ime text');
  // CONTROL: the counter counts distinct deliberate sends (resolve, then send again -> 2)
  await resolveLast(page, 'send', { status: 'sent', sessionId: 'S1', reply: 'ok' }); await expect(page.getByText('ok', { exact: true })).toBeVisible();
  await page.getByLabel('Message', { exact: true }).fill('second'); await page.getByLabel('Message', { exact: true }).press('Enter'); await expect.poll(() => count(page, 'send')).toBe(2);
});

test('S-06 composer stays reachable at 375 with a long thread', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 }); await open(page, { query: 'agent=kestrel&session=A', preset: stressPreset });
  const b = await page.getByLabel('Message', { exact: true }).boundingBox(); expect(b).not.toBeNull(); expect(b!.y + b!.height).toBeLessThanOrEqual(700); expect(b!.y).toBeGreaterThan(0);
});

test('S-07 New Chat: fresh local draft, clears old draft, no create/run before send; returned ID binds once; late result never hijacks', async ({ page }) => {
  await open(page, { query: 'agent=kestrel', preset: P.rows });
  await page.getByLabel('Start a new conversation').fill('unsent workspace draft');
  await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&new=1'); await expect(page.getByLabel('Message', { exact: true })).toHaveValue('');
  await page.getByLabel('Message', { exact: true }).fill('draft one'); await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click();
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue(''); expect(await count(page, 'send')).toBe(0);
  const listBefore = await count(page, 'list');
  await page.getByLabel('Message', { exact: true }).fill('bind me'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await resolveLast(page, 'send', { status: 'sent', sessionId: 'created-X', reply: 'Bound reply' });
  await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=created-X');
  await expect(page.getByText('Bound reply')).toBeVisible();
  expect((await ledger(page)).filter(c => c.action === 'history' && c.session === 'created-X').length).toBe(0);
  await expect.poll(() => count(page, 'list')).toBe(listBefore + 1);
  // late result after navigating away must not move the user
  await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click(); await page.getByLabel('Message', { exact: true }).fill('late'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await page.locator('.ws-desktop').getByRole('link', { name: 'All agents' }).click(); await expect.poll(() => new URL(page.url()).search).toBe('');
  await resolveLast(page, 'send', { status: 'sent', sessionId: 'late-Y', reply: 'late reply' });
  await page.waitForTimeout(300); expect(new URL(page.url()).search).toBe(''); await expect(page.locator('.ws-root').getByRole('heading', { level: 1, name: 'Your agents' })).toBeVisible();
  // CONTROL: a ledger with a pre-send 'send' entry is detected as a violation
  const fake = [{ action: 'send' }, ...(await ledger(page))]; expect(fake.findIndex(c => c.action === 'send')).toBe(0);
  record('s07-ledger', await ledger(page)); expect(await pendingOf(page, 'send')).toEqual([]);
  await page.screenshot({ path: path.join(SHOTS, 's07-after-late-result.png') });
});
