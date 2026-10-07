// QA-owned isolated fixture harness (disposable). Derived from the Engineer harness; parameterized for QA entry/port/CSS variant.
// Serves only: page HTML (any non-asset path), /bundle.js, /style.css (with workspace CSS), /style-nows.css (without), 4 Inter fonts.
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
  const fonts = [400, 500, 600, 700].map(w => `@font-face{font-family:Inter;src:url('/fonts/Inter-${w}.ttf');font-weight:${w};font-display:swap}`).join('');
  fs.writeFileSync(path.join(out, 'style.css'), fonts + '\n' + globals + '\n' + ws + '\nbody{margin:0;font-family:Inter,sans-serif}');
  fs.writeFileSync(path.join(out, 'style-nows.css'), fonts + '\n' + globals + '\nbody{margin:0;font-family:Inter,sans-serif}');
  await new Promise((ok, no) => webpack({ mode: 'development', context: root, entry, output: { path: out, filename: 'bundle.js' }, devtool: false,
    resolve: { extensions: ['.tsx', '.ts', '.js'], alias: { '@': path.join(root, 'src') } },
    module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, 'qa-ts-loader.cjs') }, { test: /\.json$/, type: 'json' }] },
    plugins: [{ apply(c) { c.hooks.normalModuleFactory.tap('QaNoProductionServices', f => f.hooks.beforeResolve.tap('QaNoProductionServices', d => { if (d && FORBIDDEN.test(d.request)) throw Error('Forbidden production dependency in QA fixture harness: ' + d.request); })); } }] },
    (err, stats) => (err || stats.hasErrors()) ? no(err || Error(stats.toString({ all: false, errors: true }))) : ok()));
  const page = css => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QA isolated workspace fixture</title><link rel="stylesheet" href="/${css}"></head><body><div id="qa-sibling"><h1>Sibling heading</h1><p>Sibling paragraph <a href="#x">link</a></p><button type="button">Sibling button</button><input aria-label="Sibling input" value="v"></div><div id="fixture-root"></div><script src="/bundle.js"></script></body></html>`;
  const server = http.createServer((req, res) => {
    const p = new URL(req.url, 'http://localhost').pathname;
    if (['/bundle.js', '/style.css', '/style-nows.css'].includes(p)) { res.setHeader('Content-Type', p.endsWith('js') ? 'application/javascript; charset=utf-8' : 'text/css; charset=utf-8'); return fs.createReadStream(path.join(out, p.slice(1))).pipe(res); }
    if (/^\/fonts\/Inter-(400|500|600|700)\.ttf$/.test(p)) { res.setHeader('Content-Type', 'font/ttf'); return fs.createReadStream(path.join(root, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/DESIGN/assets', path.basename(p))).pipe(res); }
    if (p.includes('.') || p.includes('..')) { res.writeHead(404); return res.end('Not found'); }
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(page(p.startsWith('/nows') ? 'style-nows.css' : 'style.css'));
  });
  server.listen(Number(process.env.QA_PORT || 43181), '127.0.0.1', () => console.log('QA_FIXTURE_READY loopback-only; synthetic services; no production auth'));
  for (const s of ['SIGTERM', 'SIGINT']) process.on(s, () => server.close(() => { cleanup(); process.exit(0); }));
})().catch(e => { console.error('QA_HARNESS_FAIL ' + e.message); cleanup(); process.exit(1); });
