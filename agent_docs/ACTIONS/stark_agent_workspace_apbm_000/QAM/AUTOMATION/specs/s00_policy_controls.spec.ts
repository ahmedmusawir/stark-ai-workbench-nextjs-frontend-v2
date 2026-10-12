// Attempt-002 detector controls (plan v0.3 §3): the mandatory policy reaches every page/context and fails tests on unconsumed events.
// Reserved .invalid targets only; the interceptor aborts before any DNS/socket, so no control can create real egress.
import { test, expect, open, consumeControl, policyEvents, policyCounters, record } from './_qa';
import type { Page } from '@playwright/test';

const RESERVED = 'https://qa-control.example.invalid/probe';
const probe = (p: Page) => p.evaluate(u => fetch(u).then(() => 'resolved', e => 'rejected:' + String(e).slice(0, 60)), RESERVED);
const failures: Record<string, string | null> = {};

test('C-01 off-origin request is aborted and logged by the browser interceptor in default, manual, newPage and popup contexts', async ({ page, browser }) => {
  page.on('requestfailed', r => { failures.default = r.failure()?.errorText ?? null; });
  await open(page); expect(await probe(page)).toMatch(/^rejected:/);
  expect(failures.default).toMatch(/^net::ERR_BLOCKED_BY_CLIENT(\.Inspector)?$/); // interceptor abort (CDP variant), not a DNS/network failure
  const manual = await browser.newContext(); const mp = await manual.newPage(); mp.on('requestfailed', r => { failures.manual = r.failure()?.errorText ?? null; });
  await open(mp); expect(await probe(mp)).toMatch(/^rejected:/); expect(failures.manual).toMatch(/^net::ERR_BLOCKED_BY_CLIENT(\.Inspector)?$/);
  const np = await browser.newPage(); await open(np); expect(await probe(np)).toMatch(/^rejected:/);
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.evaluate(() => { window.open('/', '_blank'); })]);
  await popup.waitForLoadState(); expect(await probe(popup)).toMatch(/^rejected:/);
  await manual.close(); await np.context().close();
  const blockedN = consumeControl('request-blocked', /^https:\/\/qa-control\.example\.invalid\/probe$/, 'C-01 reserved probe');
  const observedN = consumeControl('request-offorigin-observed', /^https:\/\/qa-control\.example\.invalid\/probe$/, 'C-01 reserved probe');
  expect(blockedN).toBe(4); expect(observedN).toBe(4); // exactly one interception per surface
  record('c01-interceptor-control', { failures, blockedN, observedN, counters: policyCounters(), events: policyEvents() });
});

test('C-02 page errors are captured from every page and only the labelled synthetic is consumed', async ({ page, browser }) => {
  await open(page);
  await page.evaluate(() => setTimeout(() => { throw new Error('QA_CONTROL_PAGEERROR default'); }, 0));
  const c = await browser.newContext(); const p2 = await c.newPage(); await open(p2);
  await p2.evaluate(() => setTimeout(() => { throw new Error('QA_CONTROL_PAGEERROR manual'); }, 0));
  await expect.poll(() => policyEvents().filter(e => e.kind === 'pageerror').length).toBe(2);
  await c.close();
  expect(consumeControl('pageerror', /QA_CONTROL_PAGEERROR (default|manual)/, 'C-02 synthetic')).toBe(2);
  record('c02-pageerror-control', policyEvents());
});

test('C-03 WebSocket transport is intercepted and closed', async ({ page }) => {
  await open(page);
  const outcome = await page.evaluate(() => new Promise<string>(r => { const ws = new WebSocket('wss://qa-control.example.invalid/socket'); ws.onopen = () => r('open'); ws.onclose = () => r('closed'); ws.onerror = () => r('error'); setTimeout(() => r('timeout'), 4000); }));
  expect(outcome).not.toBe('open');
  expect(consumeControl('websocket-blocked', /qa-control\.example\.invalid\/socket/, 'C-03 websocket')).toBe(1);
  consumeControl('request-offorigin-observed', /qa-control\.example\.invalid\/socket/, 'C-03 websocket');
  record('c03-websocket-control', { outcome, events: policyEvents() });
});

// Expected-red: an unconsumed off-origin event must fail the test in the auto fixture teardown.
test('C-04 an unconsumed policy event fails the test (expected failure)', async ({ page }) => {
  test.fail(true, 'detector control: the policy fixture must fail this test');
  await open(page); await probe(page);
});
