#!/usr/bin/env node
/* QA-owned font mediator for the Q2-4 build lane (plan v0.2 §11.2, D4=ALLOW).
 * Runs OUTSIDE the build namespace. The build itself runs inside `unshare -rn` (no network at all) and reads
 * fonts only through Next's NEXT_FONT_GOOGLE_MOCKED_RESPONSES hook, which this script prepares.
 * Policy (enforced in code before any socket): https only, port 443, exact hosts, exact CSS path+query derived
 * from Next's own URL builder for the layout's Inter({subsets:['latin']}) call, gstatic paths /s/inter/v<N>/<id>.woff2,
 * GET only, no userinfo, no IP literals, no redirects (non-200 = failure), TLS verification on (Node default).
 * usage: node font_mediator.cjs OUT_DIR            -> fetch + write mock module + request log
 *        node font_mediator.cjs --controls         -> expected-red policy controls (no network)
 */
const https = require('node:https'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), net = require('node:net');
const ROOT = path.resolve(__dirname, '../../../../..');
const G = p => require(path.join(ROOT, 'node_modules/next/dist/compiled/@next/font/dist/google', p));
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36';

function expectedCssUrl() {
  const v = G('validate-google-font-function-call').validateGoogleFontFunctionCall('Inter', { subsets: ['latin'] });
  const axes = G('get-font-axes').getFontAxes(v.fontFamily, v.weights, v.styles, v.selectedVariableAxes);
  return G('get-google-fonts-url').getGoogleFontsUrl(v.fontFamily, axes, v.display);
}
function policy(urlStr, cssUrl) {
  let u; try { u = new URL(urlStr); } catch { return 'unparseable'; }
  if (u.protocol !== 'https:') return 'scheme';
  if (u.username || u.password) return 'userinfo';
  if (u.port && u.port !== '443') return 'port';
  if (net.isIP(u.hostname)) return 'ip-literal';
  if (u.hostname === 'fonts.googleapis.com') return urlStr === cssUrl ? null : 'css-path-or-query-not-allowlisted';
  if (u.hostname === 'fonts.gstatic.com') return /^\/s\/inter\/v\d+\/[A-Za-z0-9_-]+\.woff2$/.test(u.pathname) && !u.search ? null : 'gstatic-path-not-allowlisted';
  return 'host-not-allowlisted';
}
function get(urlStr, cssUrl, log) {
  const denied = policy(urlStr, cssUrl);
  if (denied) { log.push({ url: redact(urlStr), method: 'GET', allowed: false, reason: denied }); return Promise.reject(Error('POLICY_DENY ' + denied)); }
  return new Promise((ok, no) => {
    const req = https.request(urlStr, { method: 'GET', headers: { 'User-Agent': UA } }, res => {
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => {
        const body = Buffer.concat(chunks);
        log.push({ url: urlStr, method: 'GET', allowed: true, status: res.statusCode, bytes: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex'), redirect_followed: false });
        if (res.statusCode !== 200) return no(Error('NON_200 ' + res.statusCode + ' (redirects are not followed)'));
        ok(body);
      });
    });
    req.on('error', no); req.end();
  });
}
const redact = s => { try { const u = new URL(s); return u.protocol + '//' + u.host + u.pathname; } catch { return '<unparseable>'; } };

async function run(out) {
  fs.mkdirSync(path.join(out, 'files'), { recursive: true });
  const cssUrl = expectedCssUrl(), log = [];
  const css = (await get(cssUrl, cssUrl, log)).toString('utf8');
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))];
  let local = css;
  for (const u of urls) {
    const buf = await get(u, cssUrl, log);
    const f = path.join(out, 'files', path.basename(new URL(u).pathname));
    fs.writeFileSync(f, buf); local = local.split(u).join(f);
  }
  fs.writeFileSync(path.join(out, 'mocked-responses.cjs'), 'module.exports = ' + JSON.stringify({ [cssUrl]: local }) + ';\n');
  const rec = { css_url: cssUrl, font_files: urls.length, requests: log, unexpected_attempts: log.filter(l => !l.allowed).length };
  fs.writeFileSync(path.join(out, 'mediator-log.json'), JSON.stringify(rec, null, 2) + '\n');
  console.log(JSON.stringify({ css_url: cssUrl, font_files: urls.length, requests: log.length, all_200: log.every(l => l.status === 200) }));
}
async function controls() {
  const cssUrl = expectedCssUrl(), log = [], res = {};
  const cases = {
    other_css_query: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    other_googleapis_path: 'https://fonts.googleapis.com/icon?family=Material+Icons',
    other_host: 'https://example.invalid/s/inter/v1/a.woff2',
    subdomain: 'https://evil.fonts.gstatic.com/s/inter/v1/a.woff2',
    gstatic_other_family: 'https://fonts.gstatic.com/s/roboto/v1/a.woff2',
    gstatic_query: 'https://fonts.gstatic.com/s/inter/v1/a.woff2?x=1',
    http_downgrade: 'http://fonts.gstatic.com/s/inter/v1/a.woff2',
    ip_literal: 'https://142.250.0.1/s/inter/v1/a.woff2',
    userinfo: 'https://u:p@fonts.gstatic.com/s/inter/v1/a.woff2',
    port_8443: 'https://fonts.gstatic.com:8443/s/inter/v1/a.woff2',
  };
  for (const [k, u] of Object.entries(cases)) res[k] = await get(u, cssUrl, log).then(() => 'NOT_BLOCKED', e => e.message.startsWith('POLICY_DENY') ? 'DENIED' : 'ERR ' + e.message);
  res.allowed_css_url_passes_policy = policy(cssUrl, cssUrl) === null;
  // redirect handling: a 3xx from an allowed URL must be treated as failure (no follow). Verified by code path: any non-200 rejects.
  res.all_controls_denied = Object.entries(res).every(([k, v]) => k === 'allowed_css_url_passes_policy' ? v === true : (k === 'all_controls_denied' || v === 'DENIED'));
  console.log(JSON.stringify({ css_url: cssUrl, results: res, log }, null, 2));
  if (!res.all_controls_denied) process.exit(1);
}
(process.argv[2] === '--controls' ? controls() : run(path.resolve(process.argv[2]))).catch(e => { console.error('MEDIATOR_FAIL', e.message); process.exit(1); });
