#!/usr/bin/env node
/*
 * APBM001 engineering live walk (ENVIRONMENT_AND_EFFECTS "Live walk"), real local frontend → named
 * cloud bundle, greeting_agent only. Engineering budget, enforced fail-closed in the browser:
 *   login cycles ≤2 · new sessions ≤2 · run messages ≤3 · session/list/history GET ≤30 · roster GET ≤4.
 *
 * Credentials: only from the ignored, untracked repo-root `.env.qa.local` holding exactly
 * APBM001_QA_EMAIL and APBM001_QA_PASSWORD. Values go to memory only; never printed, logged,
 * written, hashed or passed as arguments. Without that file this exits STOP-AUTH before any traffic.
 *
 * Usage (repo root, after `npm run build`):  node <this file> [--port 43191] [--out <dir>] [--interactive yes]
 * --interactive yes: no credential file; a visible Chrome window opens on the sign-in page and Tony
 * signs in by hand (twice: start and after the sign-out step). Nothing typed there is captured.
 * The script starts and stops its own `next start` on loopback (normal .env.local framework loading;
 * this script never reads .env.local). Evidence is sanitized: account pseudonym only, no cookies,
 * no auth headers, no other conversations' titles, screenshots of the A/B transcript region only.
 */
'use strict';
const { spawn, execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, v, i, all) => (v.startsWith('--') ? [...acc, [v.slice(2), all[i + 1]]] : acc), []));
const ROOT = execFileSync('git', ['--no-optional-locks', 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const PORT = Number(args.port || 43191);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = path.resolve(ROOT, args.out || 'agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/attempt-001/live');
const EXPECTED = { mode: 'live', supabaseRef: 'rwosuvbufaqwbaukohkk', endpoint: 'https://adk-bundle-prod-v2-952978338090.us-east1.run.app', bundle: 'v1', agent: 'greeting_agent' };
const BUDGET = { login: 2, create: 2, run: 3, read: 30, roster: 4 };
const INTERACTIVE = args.interactive === 'yes';
const expectedKey = crypto.createHash('sha256').update(JSON.stringify(['apbm001-backend-v1', EXPECTED.mode, EXPECTED.bundle, EXPECTED.endpoint])).digest('hex').slice(0, 16);

const ledger = []; const steps = []; const counts = { login: 0, create: 0, run: 0, read: 0, descriptor: 0, supabaseAuth: 0 }; const rosterStamps = new Set();
const started = new Date();
const stamp = () => new Date().toISOString();
const step = (id, result, detail = {}) => { steps.push({ id, result, at: stamp(), ...detail }); console.log(`${result.padEnd(7)} ${id}${detail.note ? ' — ' + detail.note : ''}`); };
function writeEvidence(status, extra = {}) {
  fs.mkdirSync(OUT, { recursive: true });
  const record = { tool: 'apbm001_live_walk.cjs', status, started: started.toISOString(), finished: stamp(), base: BASE, target: { agent: EXPECTED.agent, expectedBackendKey: expectedKey, supabaseRef: EXPECTED.supabaseRef }, account: 'qa-account-1 (pseudonym)', budget: BUDGET, used: { ...counts, roster: rosterStamps.size }, steps, ledger, ...extra };
  fs.writeFileSync(path.join(OUT, 'live-walk-ledger.json'), JSON.stringify(record, null, 2) + '\n');
}
function stop(code, reason) { step('STOP', 'STOP', { note: `${code}: ${reason}` }); writeEvidence(code, { stop: { code, reason } }); process.exitCode = 2; }

function loadCredentials() {
  const file = path.join(ROOT, '.env.qa.local');
  if (!fs.existsSync(file)) return null;
  try { execFileSync('git', ['--no-optional-locks', 'check-ignore', '-q', '.env.qa.local'], { cwd: ROOT }); } catch { throw new Error('STOP-AUTH: .env.qa.local is not git-ignored'); }
  let tracked = true; try { execFileSync('git', ['--no-optional-locks', 'ls-files', '--error-unmatch', '.env.qa.local'], { cwd: ROOT, stdio: 'ignore' }); } catch { tracked = false; }
  if (tracked) throw new Error('STOP-AUTH: .env.qa.local is tracked by Git');
  const values = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line); if (!m) throw new Error('STOP-AUTH: credential file has an unparseable line (content not shown)');
    values[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  const keys = Object.keys(values).sort();
  if (keys.join(',') !== 'APBM001_QA_EMAIL,APBM001_QA_PASSWORD' || !values.APBM001_QA_EMAIL || !values.APBM001_QA_PASSWORD) throw new Error('STOP-AUTH: credential file must hold exactly APBM001_QA_EMAIL and APBM001_QA_PASSWORD (values not shown)');
  return values;
}

async function main() {
  let creds;
  if (INTERACTIVE) { creds = { interactive: true }; step('credential-mode', 'PASS', { note: 'interactive sign-in by Tony; no credential file read' }); }
  else {
    try { creds = loadCredentials(); } catch (e) { return stop('STOP-AUTH', e.message.replace(/^STOP-AUTH: /, '')); }
    if (!creds) return stop('STOP-AUTH', 'no .env.qa.local credential file and no interactive login in this run; zero requests made');
    step('credential-file', 'PASS', { note: 'ignored, untracked, schema valid (values not read into evidence)' });
  }
  try { execFileSync('bash', ['-c', `! ss -ltn | grep -q ':${PORT} '`]); } catch { return stop('STOP-ENV', `port ${PORT} busy`); }
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) return stop('STOP-ENV', 'no production build; run npm run build first');
  const server = spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', String(PORT)], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  const serverLog = []; server.stdout.on('data', d => serverLog.push(String(d))); server.stderr.on('data', d => serverLog.push(String(d)));
  const { chromium } = require(path.join(ROOT, 'node_modules/@playwright/test'));
  let browser;
  try {
    for (let i = 0; i < 60; i++) { try { const r = await fetch(`${BASE}/auth`); if (r.status) break; } catch { /* starting */ } await new Promise(r => setTimeout(r, 500)); }
    browser = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', headless: !INTERACTIVE, args: ['--disable-background-networking'] });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await walk(context, creds);
  } catch (e) {
    let note = String(e && e.message || e).slice(0, 300);
    for (const value of creds && !creds.interactive ? [creds.APBM001_QA_EMAIL, creds.APBM001_QA_PASSWORD] : []) note = note.split(value).join('[redacted]');
    step('walk', 'FAIL', { note });
    writeEvidence('FAILED');
    process.exitCode = 1;
  } finally {
    creds = null;
    if (browser) await browser.close().catch(() => {});
    try { process.kill(-server.pid, 'SIGTERM'); } catch { /* already gone */ }
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, 'server-log-tail.txt'), serverLog.join('').split('\n').filter(l => !/@|password|token|cookie/i.test(l)).slice(-40).join('\n') + '\n');
  }
}

/**
 * Budget guard: every /api/agent and /api/auth request is classified and refused before it would
 * exceed budget; allowed requests continue untouched (no proxying, so auth cookies stay browser-native).
 * Statuses and timings come from context events; only method, path, status and timing are recorded.
 */
async function instrument(context) {
  const startedAt = new Map();
  await context.route('**/api/**', async route => {
    const req = route.request(); const url = new URL(req.url()); const p = url.pathname; const m = req.method();
    let kind = null;
    if (p === '/api/auth/login') kind = 'login';
    else if (p === '/api/agent/sessions' && m === 'POST') kind = 'create';
    else if (p === '/api/agent/run') kind = 'run';
    else if ((p === '/api/agent/sessions' && m === 'GET') || p === '/api/agent/history') kind = 'read';
    else if (p === '/api/agent/workspace') kind = 'descriptor';
    if (kind && kind !== 'descriptor' && counts[kind] >= BUDGET[kind]) { ledger.push({ at: stamp(), method: m, path: p, kind, refused: 'budget' }); return route.abort(); }
    if (kind) counts[kind]++;
    startedAt.set(req, { t0: Date.now(), kind: kind || 'other' });
    return route.continue();
  });
  context.on('response', async res => {
    const meta = startedAt.get(res.request()); if (!meta) return;
    const url = new URL(res.url());
    const entry = { at: stamp(), method: res.request().method(), path: url.pathname, kind: meta.kind, status: res.status(), ms: Date.now() - meta.t0 };
    if (meta.kind === 'descriptor' && res.ok()) { try { const body = await res.json(); entry.rosterCheckedAt = body.roster_checked_at; if (body.roster_checked_at) rosterStamps.add(body.roster_checked_at); } catch { /* body not needed */ } }
    if (res.status() >= 400 && url.pathname.startsWith('/api/agent/')) { try { entry.errorCode = (await res.json()).error.code; } catch { /* non-JSON */ } }
    ledger.push(entry);
  });
  context.on('requestfailed', req => { const meta = startedAt.get(req); if (meta) ledger.push({ at: stamp(), method: req.method(), path: new URL(req.url()).pathname, kind: meta.kind, failed: String(req.failure() && req.failure().errorText || 'failed').slice(0, 80), ms: Date.now() - meta.t0 }); });
  // Nothing in the page may reach anything except this local app and the frontend's own Supabase
  // auth project (normal session refresh, counted as authentication traffic, never as agent traffic).
  const authOrigin = `https://${EXPECTED.supabaseRef}.supabase.co`;
  await context.route(u => !u.href.startsWith(BASE), route => {
    if (route.request().url().startsWith(authOrigin + '/')) { counts.supabaseAuth++; return route.continue(); }
    ledger.push({ at: stamp(), path: 'external', refused: 'external' }); return route.abort();
  });
}

async function login(page, creds) {
  await page.goto(`${BASE}/auth`);
  if (creds.interactive) {
    console.log('ACTION  Sign in with the authorized test account in the open Chrome window (waiting up to 5 minutes)…');
    await page.waitForURL(u => !u.pathname.startsWith('/auth'), { timeout: 300_000 });
    return;
  }
  await page.locator('input[type="email"], input[name="email"]').first().fill(creds.APBM001_QA_EMAIL);
  await page.locator('input[type="password"]').first().fill(creds.APBM001_QA_PASSWORD);
  await Promise.all([page.waitForResponse(r => r.url().endsWith('/api/auth/login'), { timeout: 60_000 }), page.locator('button[type="submit"]').first().click()]);
  await page.waitForURL(u => !u.pathname.startsWith('/auth'), { timeout: 60_000 });
}

async function descriptor(page) {
  return page.evaluate(async () => { const r = await fetch('/api/agent/workspace', { cache: 'no-store' }); return { status: r.status, body: r.ok ? await r.json() : null }; });
}

const thread = page => page.locator('.ws-thread');
const threadText = page => thread(page).innerText();
async function shot(page, name) { fs.mkdirSync(path.join(OUT, 'screenshots'), { recursive: true }); await thread(page).screenshot({ path: path.join(OUT, 'screenshots', name) }); }
/** Wait until the thread shows `turns` messages or a terminal (non-loading, non-pending) state. */
async function settle(page, turns) {
  await page.waitForFunction(n => document.querySelectorAll('.ws-thread .ws-turn').length >= n || [...document.querySelectorAll('.ws-thread .ws-state h2')].some(h => !/^(Waiting for a reply|Loading conversation)$/.test(h.textContent.trim())), turns, { timeout: 110_000 });
  return { turns: await page.locator('.ws-thread .ws-turn').count(), states: await page.locator('.ws-thread .ws-state h2').allInnerTexts() };
}
const lastTurn = page => page.locator('.ws-thread .ws-turn').last().innerText();

async function walk(context, creds) {
  await instrument(context);
  const rnd = crypto.randomBytes(3).toString('hex');
  const markerA = `apbm001-eng-a-${rnd}`, markerB = `apbm001-eng-b-${rnd}`;
  // The marker leads so the automatic 80-character titles of A and B differ.
  const msg = m => `${m} — APBM001 engineering live walk. Remember this test marker for this conversation. Reply only with ACK followed by the marker. Do not use tools or take any external action.`;
  const title = text => Array.from(text.replace(/\s+/g, ' ').trim()).slice(0, 80).join('').trim();
  const ask = 'Which test marker did I give you earlier in this conversation? Reply only with the marker. Do not use tools or take any external action.';
  const titleA = title(msg(markerA)), titleB = title(msg(markerB));
  let page = await context.newPage();
  page.on('pageerror', e => ledger.push({ at: stamp(), pageError: String(e.message).slice(0, 200) }));

  await login(page, creds);
  step('login-1', 'PASS');
  const d1 = await descriptor(page);
  const greeting = d1.body && d1.body.agents.find(a => a.agent_name === EXPECTED.agent);
  const target = { mode: d1.body && d1.body.mode, supabaseRef: d1.body && d1.body.supabase_ref, greetingKeyMatches: !!greeting && greeting.backend_key === expectedKey, greetingAvailability: greeting && greeting.availability, moose: (d1.body && d1.body.agents.find(a => a.agent_name === 'moose_mcp_agent') || {}).availability };
  step('target-identity', target.mode === 'live' && target.supabaseRef === EXPECTED.supabaseRef && target.greetingKeyMatches && target.greetingAvailability === 'available' ? 'PASS' : 'STOP', { note: JSON.stringify(target) });
  if (steps.at(-1).result === 'STOP') return stop('STOP-ENV', 'effective target differs from the confirmed live bundle; no session created');
  const userA = d1.body.user.id;

  await page.goto(`${BASE}/chat`);
  const mooseCard = await page.getByRole('main').getByRole('link', { name: /MOOSE CRM Agent/ }).innerText();
  step('AC005-unavailable-agent', /Not available on this agent service/.test(mooseCard) ? 'PASS' : 'FAIL', { note: 'MOOSE CRM Agent card shows unavailable (manifest unchanged)' });
  await page.getByRole('main').getByRole('link', { name: /Greeting Agent/ }).click();
  await page.waitForFunction(() => !document.querySelector('.ws-recents [role="status"]') || !/Loading conversations/.test(document.querySelector('.ws-recents').textContent), null, { timeout: 70_000 });
  const nav = page.getByRole('navigation', { name: 'Workspace navigation' });

  const sendNew = async (marker, label) => {
    await nav.getByRole('button', { name: 'New chat' }).click();
    await page.waitForURL(u => u.searchParams.has('new'));
    await page.getByLabel('Message', { exact: true }).fill(msg(marker));
    await page.getByRole('button', { name: 'Send message' }).click();
    const result = await settle(page, 2);
    const session = new URL(page.url()).searchParams.get('session');
    if (result.turns < 2) { step(`send-${label}`, 'FAIL', { note: `send ended in state ${JSON.stringify(result.states)}; walk stopped to protect the budget` }); throw new Error(`send ${label} did not complete`); }
    const reply = await lastTurn(page);
    step(`send-${label}`, reply.includes(marker) ? 'PASS' : 'FAIL', { note: reply.includes(marker) ? `reply carried marker ${label}` : 'reply arrived without the marker (model output)' });
    return session;
  };
  const sessionA = await sendNew(markerA, 'A');
  const sessionB = await sendNew(markerB, 'B');
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  step('AC008-uuid-ids', uuid.test(sessionA) && uuid.test(sessionB) && sessionA !== sessionB ? 'PASS' : 'FAIL');
  for (let i = 0; i < 2; i++) {
    await nav.getByRole('link', { name: titleA }).click(); await thread(page).getByText(markerA).first().waitFor();
    if ((await threadText(page)).includes(markerB)) throw new Error('A shows B marker');
    await nav.getByRole('link', { name: titleB }).click(); await thread(page).getByText(markerB).first().waitFor();
    if ((await threadText(page)).includes(markerA)) throw new Error('B shows A marker');
  }
  step('AC011-switch-twice', 'PASS', { note: 'A/B transcripts separate across two switches (sidebar links by first-message title)' });

  await page.reload();
  const reloaded = await settle(page, 2); const textB = await threadText(page);
  step('AC012-reload-B', reloaded.turns === 2 && textB.includes(markerB) && !textB.includes(markerA) ? 'PASS' : 'FAIL', { note: `${reloaded.turns} turns from ADK history; states ${JSON.stringify(reloaded.states)}` });
  await shot(page, 'live-B-after-reload.png');
  const urlA = `${BASE}/chat?agent=${EXPECTED.agent}&session=${sessionA}&bk=${expectedKey}`;
  await page.close(); page = await context.newPage(); await page.goto(urlA);
  const reopenedTab = await settle(page, 2); const textA = await threadText(page);
  step('AC012-reopen-tab-A', reopenedTab.turns === 2 && textA.includes(markerA) && !textA.includes(markerB) ? 'PASS' : 'FAIL', { note: `${reopenedTab.turns} turns` });
  await page.getByLabel('Message', { exact: true }).fill(ask); await page.getByRole('button', { name: 'Send message' }).click();
  const continued = await settle(page, 4); const textContinued = await threadText(page);
  if (continued.turns < 4) { step('AC012-continue-A', 'FAIL', { note: `continuation ended in state ${JSON.stringify(continued.states)}` }); throw new Error('continuation did not complete'); }
  const recall = await lastTurn(page);
  step('AC012-continue-A', recall.includes(markerA) && !textContinued.includes(markerB) ? 'PASS' : 'FAIL', { note: recall.includes(markerA) ? 'continuation reply recalls marker A; earlier turns intact' : 'continuation reply did not contain marker A' });
  await shot(page, 'live-A-after-continue.png');

  await page.getByRole('navigation', { name: 'Workspace navigation' }).getByRole('button', { name: 'Sign out' }).click();
  await page.waitForURL(u => u.pathname.startsWith('/auth'), { timeout: 60_000 });
  const afterLogout = await descriptor(page);
  step('AC003-logout-invalidates', afterLogout.status === 401 ? 'PASS' : 'FAIL', { note: `descriptor after sign-out → ${afterLogout.status}` });
  await login(page, creds); creds = null;
  step('login-2', 'PASS');
  const d2 = await descriptor(page);
  step('AC003-same-user', d2.body && d2.body.user.id === userA ? 'PASS' : 'FAIL', { note: 'pseudonymous equality only' });
  await page.goto(urlA);
  const afterRelogin = await settle(page, 4); const textRelogin = await threadText(page);
  step('AC012-reopen-after-relogin', afterRelogin.turns === 4 && textRelogin.includes(markerA) && !textRelogin.includes(markerB) ? 'PASS' : 'FAIL', { note: `${afterRelogin.turns} turns from ADK history` });
  await page.goto(`${BASE}/chat?agent=${EXPECTED.agent}`);
  await page.locator('.ws-recents .ws-recent-row strong', { hasText: titleB }).first().waitFor({ timeout: 70_000 });
  const rows = await page.locator('.ws-recents .ws-recent-row strong').allInnerTexts();
  const ia = rows.indexOf(titleA), ib = rows.indexOf(titleB);
  step('AC006-AC007-list', ia >= 0 && ib >= 0 && ib < ia ? 'PASS' : 'FAIL', { note: `A and B listed with first-message titles; B (newer-created) before A; ${rows.length} rows in total (other titles not recorded)` });
  writeEvidence(steps.every(s => s.result === 'PASS') ? 'PASS' : 'FAIL', { sessions: { A: sessionA, B: sessionB }, markers: { A: markerA, B: markerB } });
}

main();
