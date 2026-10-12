// QA-owned isolated fixture harness (disposable). Derived from the Engineer harness; parameterized for QA entry/port/CSS variant.
// Serves only: page HTML (any non-asset path), /bundle.js, /style.css (with workspace CSS), /style-nows.css (without), and the
// committed product WOFF2 subsets under /fonts/inter/. Attempt-002 (plan v0.3 §3): product src/app/fonts/inter.css is used verbatim
// except the recorded local URL rewrite './inter/' -> '/fonts/inter/'; body carries the root layout classes; normal pages are clean;
// sibling furniture exists only on the /iso and /iso-nows CSS-isolation variants; /collateral is a synthetic non-workspace surface.
require(require('node:path').resolve(__dirname, '../../../../../tests/workspace/network-guard.cjs'));
const path = require('node:path'), fs = require('node:fs'), os = require('node:os'), http = require('node:http');
for (const k of Object.keys(process.env)) if (!['PATH', 'HOME', 'LANG', 'TMPDIR', 'QA_PORT', 'QA_ENTRY', 'NODE_OPTIONS'].includes(k)) delete process.env[k];
const root = path.resolve(__dirname, '../../../../..'), out = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-fixture-'));
const entry = process.env.QA_ENTRY ? path.resolve(process.env.QA_ENTRY) : path.join(__dirname, 'qa-fixture-entry.tsx');
const FORBIDDEN = /services\/|utils\/supabase|store\/useAuthStore|store\/chatStore|productionAdapter|WorkspaceEntry|instructionsService|@google-cloud|api\/agent\/instructions/;
const webpack = require(path.join(root, 'node_modules/next/dist/compiled/webpack/webpack')).webpack, sass = require(path.join(root, 'node_modules/sass'));
const cleanup = () => fs.rmSync(out, { recursive: true, force: true });
(async () => {
  const ws = sass.compile(path.join(root, 'src/app/(cyberize)/chat/workspace.scss')).css;
  const globals = (await require(path.join(root, 'node_modules/postcss'))([require(path.join(root, 'node_modules/tailwindcss'))({ config: path.join(root, 'tailwind.config.ts') })])
    .process(sass.compile(path.join(root, 'src/app/globals.scss')).css, { from: undefined })).css;
  const productFontCss = fs.readFileSync(path.join(root, 'src/app/fonts/inter.css'), 'utf8');
  const fonts = productFontCss.replaceAll('./inter/', '/fonts/inter/'); // the only rewrite: local serving URL
  fs.writeFileSync(path.join(out, 'style.css'), fonts + '\n' + globals + '\n' + ws);
  fs.writeFileSync(path.join(out, 'style-nows.css'), fonts + '\n' + globals);
  await new Promise((ok, no) => webpack({ mode: 'development', context: root, entry, output: { path: out, filename: 'bundle.js' }, devtool: false,
    resolve: { extensions: ['.tsx', '.ts', '.js'], alias: { '@': path.join(root, 'src') } },
    module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, 'qa-ts-loader.cjs') }, { test: /\.json$/, type: 'json' }] },
    plugins: [{ apply(c) { c.hooks.normalModuleFactory.tap('QaNoProductionServices', f => f.hooks.beforeResolve.tap('QaNoProductionServices', d => { if (d && FORBIDDEN.test(d.request)) throw Error('Forbidden production dependency in QA fixture harness: ' + d.request); })); } }] },
    (err, stats) => (err || stats.hasErrors()) ? no(err || Error(stats.toString({ all: false, errors: true }))) : ok()));
  const BODY = 'inter-font bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100'; // src/app/layout.tsx body classes
  const SIBLING = '<div id="qa-sibling"><h1>Sibling heading</h1><p>Sibling paragraph <a href="#x">link</a></p><button type="button">Sibling button</button><input aria-label="Sibling input" value="v"></div>';
  const page = (css, sibling) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QA isolated workspace fixture</title><link rel="stylesheet" href="/${css}"></head><body class="${BODY}">${sibling ? SIBLING : ''}<div id="fixture-root"></div><script src="/bundle.js"></script></body></html>`;
  // Synthetic root-font collateral surface outside the workspace: text, form and table. The theme is applied as next-themes does
  // (class attribute on <html>, default dark) from the stored preference; no workspace bundle or CSS scope is involved.
  const collateral = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QA root font collateral</title><script>try{document.documentElement.className=localStorage.getItem('theme')||'dark'}catch(e){document.documentElement.className='dark'}</script><link rel="stylesheet" href="/style.css"></head><body class="${BODY}"><main id="qa-collateral" style="max-width:640px;padding:16px"><h1 data-font-probe="h1">Account settings</h1><p data-font-probe="latin">Latin abc ÀÉÎ — 0123456789</p><p data-font-probe="latin-ext">Latin extended Łódź Ŧ ğ</p><p data-font-probe="cyrillic">Cyrillic Привет</p><p data-font-probe="cyrillic-ext">Cyrillic extended Ѧ Ꙋ</p><p data-font-probe="greek">Greek Καλημέρα</p><p data-font-probe="greek-ext">Greek extended ἄἐ</p><p data-font-probe="vietnamese">Vietnamese tiếng Việt</p><form onsubmit="return false"><label data-font-probe="label">Email <input data-font-probe="input" value="person@example.test"></label> <button data-font-probe="button" type="button">Save changes</button></form><table data-font-probe="table"><thead><tr><th>Name</th><th>Role</th></tr></thead><tbody><tr><td>Synthetic row</td><td>Member</td></tr></tbody></table></main></body></html>`;
  const server = http.createServer((req, res) => {
    const p = new URL(req.url, 'http://localhost').pathname;
    if (['/bundle.js', '/style.css', '/style-nows.css'].includes(p)) { res.setHeader('Content-Type', p.endsWith('js') ? 'application/javascript; charset=utf-8' : 'text/css; charset=utf-8'); return fs.createReadStream(path.join(out, p.slice(1))).pipe(res); }
    if (/^\/fonts\/inter\/inter-(latin|latin-ext|cyrillic|cyrillic-ext|greek|greek-ext|vietnamese)\.woff2$/.test(p)) { res.setHeader('Content-Type', 'font/woff2'); return fs.createReadStream(path.join(root, 'src/app/fonts/inter', path.basename(p))).pipe(res); }
    if (p.includes('.') || p.includes('..')) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (p === '/collateral') return res.end(collateral);
    res.end(page(p.startsWith('/nows') || p.startsWith('/iso-nows') ? 'style-nows.css' : 'style.css', p.startsWith('/iso')));
  });
  server.listen(Number(process.env.QA_PORT || 43181), '127.0.0.1', () => console.log('QA_FIXTURE_READY loopback-only; synthetic services; no production auth'));
  for (const s of ['SIGTERM', 'SIGINT']) process.on(s, () => server.close(() => { cleanup(); process.exit(0); }));
})().catch(e => { console.error('QA_HARNESS_FAIL ' + e.message); cleanup(); process.exit(1); });
