import { test, expect, open, P, ROWS, ledger, count, pendingOf, resolveLast, record, stressPreset, setTheme, SHOTS } from './_qa';
import type { Page } from '@playwright/test';
import path from 'node:path';

const focusInside = (page: Page, sel: string) => page.evaluate(s => !!document.activeElement && !!document.activeElement.closest(s), sel);
async function tabLoop(page: Page, sel: string, n = 20) { const esc: number[] = []; for (const key of ['Tab', 'Shift+Tab']) for (let i = 0; i < n; i++) { await page.keyboard.press(key); if (!(await focusInside(page, sel))) esc.push(i); } return esc; }

test('S-17 drawer (375 dark): focus contained, background inert, Escape/backdrop/Close dismiss and restore; breakpoint crossing closes and focuses visible nav', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 }); await setTheme(page, 'dark'); await open(page, { query: 'agent=kestrel', preset: P.rows });
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  for (const how of ['Escape', 'Close', 'backdrop']) {
    await menu.click(); const d = page.getByRole('dialog', { name: 'Navigation' }); await expect(d).toBeVisible();
    expect(await page.evaluate(() => (document.querySelector('.ws-root') as any).inert)).toBe(true);
    if (how === 'Escape') { expect(await tabLoop(page, '[role=dialog]')).toEqual([]); await page.keyboard.press('Escape'); }
    else if (how === 'Close') await d.getByRole('button', { name: 'Close Navigation' }).click();
    else await page.mouse.click(370, 790);
    await expect(d).toBeHidden(); await expect(menu).toBeFocused(); expect(await page.evaluate(() => (document.querySelector('.ws-root') as any).inert)).toBe(false);
  }
  await page.setViewportSize({ width: 800, height: 800 }); await menu.click(); await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.setViewportSize({ width: 1200, height: 800 }); await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
  await expect.poll(() => page.evaluate(() => { const a = document.activeElement as HTMLElement | null; return a?.closest('.ws-desktop') ? (a.getAttribute('aria-current') || a.textContent) : null; })).toBe('page');
});

test('S-17 context dialog (1280 light) and nested demo dialog (768 dark): containment, nested Escape, restore', async ({ page }) => {
  await setTheme(page, 'light'); await open(page, { query: 'agent=kestrel&session=A', preset: P.rows }); await expect(page.getByText('only session A')).toBeVisible();
  const opener = page.getByRole('button', { name: 'Open demo instructions and context' }); await opener.click();
  await expect(page.getByRole('dialog', { name: 'Demo context' })).toBeVisible(); expect(await tabLoop(page, '[role=dialog]')).toEqual([]);
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  await page.setViewportSize({ width: 768, height: 900 }); await page.evaluate(() => { localStorage.setItem('theme', 'dark'); }); await opener.click();
  const ctx = page.getByRole('dialog', { name: 'Demo context' }); const edit = ctx.getByRole('button', { name: 'Edit demo instructions' }); await edit.click();
  const nested = page.getByRole('dialog', { name: 'Edit demo instructions' }); await expect(nested).toBeVisible();
  await page.keyboard.press('Escape'); await expect(nested).toBeHidden(); await expect(ctx).toBeVisible(); await expect(edit).toBeFocused();
  await page.keyboard.press('Escape'); await expect(ctx).toBeHidden(); await expect(opener).toBeFocused();
});

test('S-17 controls: accessible names and ≥44×44 targets; hidden desktop/mobile copies unfocusable', async ({ page }) => {
  const report: Record<string, unknown> = {};
  for (const w of [375, 1280]) for (const [v, q, pre] of [['directory', '', undefined], ['workspace', 'agent=kestrel', P.rows], ['conversation', 'agent=kestrel&session=A', stressPreset]] as const) {
    await page.setViewportSize({ width: w, height: 900 }); await open(page, { query: q, preset: pre }); await page.waitForTimeout(150);
    report[`${v}-${w}`] = await page.evaluate(() => [...document.querySelectorAll('.ws-root button, .ws-root a[href], .ws-root input, .ws-root textarea, .ws-root [tabindex="0"]')].filter(e => {
      const r = (e as HTMLElement).getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).map(e => {
      const r = e.getBoundingClientRect(), el = e as HTMLElement; const name = (el.getAttribute('aria-label') || el.textContent || (el.id && (document.querySelector(`label[for="${el.id}"]`)?.textContent)) || '').trim();
      const inProse = !!el.closest('.ws-turn') && el.tagName === 'A';
      return { tag: el.tagName, name: name.slice(0, 40), w: Math.round(r.width), h: Math.round(r.height), inProse, skip: el.classList.contains('ws-skip') };
    }).filter(x => !x.name || (!x.inProse && !x.skip && (x.w < 44 || x.h < 44))));
    const hiddenCopy = w < 1024 ? '.ws-desktop' : '.ws-mobile-top'; const hits: number[] = [];
    await page.locator('body').click({ position: { x: 1, y: 1 } }); for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); if (await focusInside(page, hiddenCopy)) hits.push(i); }
    expect(hits).toEqual([]);
  }
  record('s17-names-targets', report);
  const violations = Object.entries(report).flatMap(([k, v]) => (v as Array<Record<string, unknown>>).map(x => ({ view: k, ...x })));
  expect.soft(violations, 'controls without names or below 44×44 (finding if non-empty)').toEqual([]);
  // CONTROL: tab-loop detector reports escape when no trap exists
  await page.setViewportSize({ width: 1280, height: 900 }); await open(page); await page.getByLabel('Find an agent').focus(); expect((await tabLoop(page, '.ws-filter', 5)).length).toBeGreaterThan(0);
});

test('S-18 disclosure aria/visibility, resize focus rescue, skip link, single aria-current, status regions, visible focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows });
  const trig = page.getByRole('button', { name: 'Demo context', exact: true }); await expect(trig).toHaveAttribute('aria-expanded', 'false');
  const id = await trig.getAttribute('aria-controls'); expect(await page.locator(`[id="${id}"]`).isHidden()).toBe(true);
  await trig.click(); await expect(trig).toHaveAttribute('aria-expanded', 'true'); expect(await page.locator(`[id="${id}"]`).isVisible()).toBe(true); await trig.click();
  await page.setViewportSize({ width: 1280, height: 900 }); await expect(trig).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Edit demo instructions' }).focus(); await page.setViewportSize({ width: 375, height: 900 });
  await expect(trig).toBeFocused();
  await page.setViewportSize({ width: 1280, height: 900 }); await open(page, { query: 'agent=kestrel', preset: P.rows }); await page.getByLabel('Sibling input').focus(); await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused(); await page.keyboard.press('Enter'); await expect(page.locator('#ws-main')).toBeFocused();
  expect(await page.locator('.ws-desktop [aria-current="page"]').count()).toBe(1); expect(await page.locator('[role=status]').count()).toBeGreaterThan(0);
  const focusStyle: Record<string, unknown> = {};
  for (const t of ['dark', 'light'] as const) { await page.evaluate(th => document.documentElement.className = th, t); await page.getByRole('button', { name: 'Actions for Planning the launch' }).focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    focusStyle[t] = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement!); return { outlineStyle: cs.outlineStyle, outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor, boxShadow: cs.boxShadow }; });
    const f = focusStyle[t] as Record<string, string>; expect(f.outlineStyle !== 'none' || f.boxShadow !== 'none').toBe(true); }
  record('s18-focus-style', focusStyle);
});

test('S-19 copy payloads, blocked clipboard fallback, speech lifecycle, unavailable explanation, no autoplay', async ({ browser }) => {
  const md = 'Answer with **bold** and code:\n\n```js\nconst x = 1;\n```';
  const preset = `(qa) => { qa.auto.list = () => ({ status: 'ready', rows: [] }); qa.auto.history = () => ({ status: 'ready', messages: [{ role: 'user', content: 'Q?' }, { role: 'assistant', content: ${JSON.stringify(md)} }] }); }`;
  let c = await browser.newContext(); let p = await c.newPage();
  await p.addInitScript(() => { (window as any).__clip = []; (window as any).__speech = { speak: 0, cancel: 0 };
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (t: string) => { (window as any).__clip.push(t); } }, configurable: true });
    class U { text: string; onstart?: () => void; onend?: () => void; onerror?: () => void; constructor(t: string) { this.text = t; } } (window as any).SpeechSynthesisUtterance = U;
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, writable: true, value: { speaking: false, speak(u: U) { (window as any).__speech.speak++; this.speaking = true; u.onstart?.(); }, cancel() { (window as any).__speech.cancel++; this.speaking = false; }, getVoices: () => [] } }); });
  await open(p, { query: 'agent=kestrel&session=A', preset });
  await expect(p.locator('.ws-thread code').first()).toBeVisible(); expect(await p.evaluate(() => (window as any).__speech.speak)).toBe(0);
  await p.locator('.ws-turn').nth(1).getByRole('button', { name: 'Copy message' }).click();
  await p.getByRole('button', { name: 'Copy conversation as Markdown' }).click(); await p.getByRole('button', { name: 'Copy code' }).click();
  const clip = await p.evaluate(() => (window as any).__clip);
  expect(clip).toEqual([md, `## You\n\nQ?\n\n## Kestrel Ops\n\n${md}`, 'const x = 1;']);
  expect(clip[0]).not.toEqual(md + ' '); // CONTROL: recorder distinguishes a wrong payload
  const rb = p.getByRole('button', { name: 'Read aloud' }); await rb.click(); expect(await p.evaluate(() => (window as any).__speech.speak)).toBe(1);
  const stop = p.getByRole('button', { name: 'Stop reading' }); await expect(stop).toBeVisible(); await stop.click(); expect(await p.evaluate(() => (window as any).__speech.cancel)).toBeGreaterThan(0);
  await expect(p.getByRole('button', { name: 'Read aloud' })).toBeVisible(); await c.close();
  c = await browser.newContext(); p = await c.newPage();
  await p.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } }, configurable: true }); delete (window as any).speechSynthesis; try { delete (Window.prototype as any).speechSynthesis; } catch { /* */ } });
  await open(p, { query: 'agent=kestrel&session=A', preset }); await p.locator('.ws-turn').nth(1).getByRole('button', { name: 'Copy message' }).click();
  await expect(p.getByText('Clipboard unavailable. Select and copy the text below.')).toBeVisible(); const ta = p.getByLabel('Text to copy manually'); await expect(ta).toHaveValue(md);
  await ta.focus(); expect(await ta.evaluate((e: HTMLTextAreaElement) => [e.selectionStart, e.selectionEnd])).toEqual([0, md.length]);
  await expect(p.getByText('Read aloud unavailable in this browser.')).toBeVisible(); await p.screenshot({ path: path.join(SHOTS, 's19-fallbacks.png') }); await c.close();
});

test('DIRECTOR-OBS-001 §11.3 browser A+B: two successful new chats both stay in recents; reopening A shows only A; no hidden archive/delete/recreate', async ({ page }) => {
  const preset = `(qa) => { const idx = []; let n = 0; qa.__idx = idx;
    qa.auto.list = (c) => ({ status: idx.length ? 'ready' : 'empty', rows: idx.filter(r => r.agent === c.agent).map(r => ({ id: r.id, sessionId: r.sid, title: r.title })) });
    qa.auto.send = (c) => { const sid = ['A', 'B', 'C'][n++]; if (!c.session) idx.push({ id: 'row-' + sid, sid, title: c.message, agent: c.agent }); return { status: 'sent', sessionId: sid, reply: 'reply in ' + sid }; };
    qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'user', content: 'stored question ' + c.session }, { role: 'assistant', content: 'stored reply ' + c.session }] }); }`;
  await open(page, { query: 'agent=kestrel', preset });
  await page.getByLabel('Start a new conversation').fill('first chat'); await page.getByLabel('Start a new conversation').press('Enter');
  await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=A'); await expect(page.getByText('reply in A')).toBeVisible();
  await page.locator('.ws-desktop').getByRole('button', { name: 'New chat' }).click(); await page.getByLabel('Message', { exact: true }).fill('second chat'); await page.getByLabel('Message', { exact: true }).press('Enter');
  await expect.poll(() => new URL(page.url()).search).toBe('?agent=kestrel&session=B'); await expect(page.getByText('reply in B')).toBeVisible(); await expect(page.getByText('reply in A')).toHaveCount(0);
  await page.locator('.ws-crumbs').getByRole('link', { name: 'Kestrel Ops' }).click();
  await expect(page.locator('.ws-recent-row strong')).toHaveText(['first chat', 'second chat']);
  await page.getByRole('link', { name: /first chat/ }).click(); await expect(page.getByText('reply in A')).toBeVisible(); await expect(page.getByText('reply in B')).toHaveCount(0);
  const inSession = await ledger(page); record('obs001-in-session-ledger', inSession);
  expect(inSession.filter(c => c.action === 'send').map(c => c.session)).toEqual([null, null]);
  expect(inSession.some(c => ['archive', 'rename'].includes(c.action))).toBe(false);
  // Fresh mount (reload equivalent) with an authoritative index already holding A+B: recents list both; opening A reads A's history only
  const seeded = `(qa) => { const idx = [{ id: 'row-A', sid: 'A', title: 'first chat', agent: 'kestrel' }, { id: 'row-B', sid: 'B', title: 'second chat', agent: 'kestrel' }];
    qa.auto.list = (c) => ({ status: 'ready', rows: idx.filter(r => r.agent === c.agent).map(r => ({ id: r.id, sessionId: r.sid, title: r.title })) });
    qa.auto.history = (c) => ({ status: 'ready', messages: [{ role: 'assistant', content: 'stored reply ' + c.session }] }); }`;
  await page.goto('about:blank'); await open(page, { query: 'agent=kestrel', preset: seeded });
  await expect(page.locator('.ws-recent-row strong')).toHaveText(['first chat', 'second chat']);
  await page.getByRole('link', { name: /first chat/ }).click(); await expect(page.getByText('stored reply A')).toBeVisible(); await expect(page.getByText('stored reply B')).toHaveCount(0);
  const fresh = await ledger(page); expect(fresh.filter(c => c.action === 'history').map(c => c.session)).toEqual(['A']);
  expect(fresh.some(c => ['send', 'archive', 'rename'].includes(c.action))).toBe(false); record('obs001-fresh-mount-ledger', fresh);
  await page.screenshot({ path: path.join(SHOTS, 'obs001-reopen-A.png') });
});
