// Engineering-only fixture: same maintained Workspace + verified production CSS
// fonts. Never boot a Next route, production auth or service module. Namespace
// enforcement belongs to run_browser.py; independent QA instruments untouched.
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), http = require('node:http');
const root = path.resolve(__dirname, '../../../../../..');
require(path.join(root, 'tests/workspace/network-guard.cjs'));
for (const key of Object.keys(process.env)) if (!['PATH', 'HOME', 'LANG', 'TMPDIR'].includes(key)) delete process.env[key];
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'apbm-repair-browser-'));
const webpack = require('next/dist/compiled/webpack/webpack').webpack;
const fontDir = path.join(root, 'src/app/fonts/inter');
const provenance = JSON.parse(fs.readFileSync(path.join(fontDir, 'PROVENANCE.json'), 'utf8'));
const fonts = fs.readFileSync(path.join(root, 'src/app/fonts/inter.css'), 'utf8').replaceAll('./inter/', '/font-files/');
let before = fs.readFileSync(path.join(__dirname, 'font-before.css'), 'utf8');
const cacheMatches = JSON.parse(fs.readFileSync(path.join(__dirname, 'font-cache-matches.json'), 'utf8'));
for (const match of before.matchAll(/url\("\.\.\/media\/([^"]+)"\)/g)) {
  const entry = cacheMatches[match[1]];
  const asset = provenance.assets.find(a => entry && a.sha256 === entry.sha256);
  if (!asset) throw Error('Unverified prior font asset');
  before = before.replace(match[0], `url('/font-files/${asset.file}')`);
}
before = before.replace(/\.inter_[^{]+\{/, '.inter-font {');
const globals = require('sass').compile(path.join(root, 'src/app/globals.scss')).css;
const css = require('sass').compile(path.join(root, 'src/app/(cyberize)/chat/workspace.scss')).css;
const probe = `<main id="font-typography" style="max-width:600px;padding:16px"><h1 data-font-probe>Account and workspace</h1><p data-font-probe>Latin abc · extended Łódź · Cyrillic Я · extended Ѧ · Greek Ω · extended ἄ · Vietnamese tiếng Việt</p><label data-font-probe>Email <input value="synthetic@example.invalid"></label><button data-font-probe>Sign in</button><table data-font-probe><tbody><tr><td>Projects</td><td>Conversations</td></tr></tbody></table>${[100,400,500,600,700,900].map(w=>`<p data-font-probe style="font-weight:${w}">Inter variable weight ${w}: Workspace planning 0123456789</p>`).join('')}<p data-font-probe style="font-family:'Inter Fallback'">Explicit established Arial fallback metrics</p></main>`;
(async () => {
  const generated = await require('postcss')([require('tailwindcss')({ config: path.join(root, 'tailwind.config.ts') })]).process(globals, { from: undefined });
  const probeCss = '#font-typography input,#font-typography button{border:1px solid #888;padding:8px}';
  for (const [name, font] of [['after', fonts], ['before', before]]) fs.writeFileSync(path.join(out, `${name}.css`), font + '\n' + generated.css + '\n' + css + '\n' + probeCss);
  await new Promise((ok, no) => webpack({ mode: 'development', context: root,
    entry: path.join(root, 'tests/workspace/fixture-entry.tsx'), output: { path: out, filename: 'bundle.js' }, devtool: false,
    resolve: { extensions: ['.tsx', '.ts', '.js'], alias: { '@': path.join(root, 'src') } },
    module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.join(root, 'tests/workspace/ts-loader.cjs') }] },
    plugins: [{ apply(compiler) { compiler.hooks.normalModuleFactory.tap('RepairNoProductionServices', factory => factory.hooks.beforeResolve.tap('RepairNoProductionServices', data => {
      if (data && /services\/|utils\/supabase|store\/useAuthStore|productionAdapter|WorkspaceEntry/.test(data.request)) throw Error('Forbidden production dependency in engineering fixture');
    })); } }],
  }, (error, stats) => error || stats.hasErrors() ? no(error || Error(stats.toString({ all: false, errors: true }))) : ok()));
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1'), pathname = url.pathname;
    if (pathname === '/' || pathname === '/typography') {
      const variant = url.searchParams.get('font') === 'before' ? 'before' : 'after';
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline engineering repair fixture</title><link rel="stylesheet" href="/${variant}.css"></head><body class="inter-font">${pathname === '/typography' ? probe : '<div id="fixture-root"></div><script src="/bundle.js"></script>'}</body></html>`);
    }
    if (['/bundle.js', '/after.css', '/before.css'].includes(pathname)) {
      res.setHeader('Content-Type', pathname.endsWith('.js') ? 'application/javascript' : 'text/css');
      return fs.createReadStream(path.join(out, pathname.slice(1))).pipe(res);
    }
    const asset = provenance.assets.find(a => '/font-files/' + a.file === pathname);
    if (asset) { res.setHeader('Content-Type', 'font/woff2'); return fs.createReadStream(path.join(fontDir, asset.file)).pipe(res); }
    res.writeHead(404); res.end('Not found');
  });
  server.listen(43183, '127.0.0.1', () => console.log('ENGINEERING_REPAIR_FIXTURE_READY; local-only, synthetic services, product fonts'));
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => { fs.rmSync(out, { recursive: true, force: true }); process.exit(0); }));
})().catch(error => { console.error(error.message); fs.rmSync(out, { recursive: true, force: true }); process.exit(1); });
