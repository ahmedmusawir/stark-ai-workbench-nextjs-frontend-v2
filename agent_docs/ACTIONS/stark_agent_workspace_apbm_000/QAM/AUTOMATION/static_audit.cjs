#!/usr/bin/env node
/* Q2-5 static audit (disposable, read-only): X-02 hardcoded agents, X-12 import closure, X-14 theme props,
 * X-15 CSS scope, X-20 source separation (+ build marker scan when a successful build exists).
 * Every rule also runs against a seeded negative input in QAM/AUTOMATION/negative/ which MUST be flagged.
 * usage: node static_audit.cjs OUT.json */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '../../../../..'); const NEG = path.join(__dirname, 'negative');
const rel = p => path.relative(ROOT, p);
const read = p => fs.readFileSync(p, 'utf8');
const WS = ['src/components/workspace', 'src/app/(cyberize)/chat'].flatMap(d => fs.readdirSync(path.join(ROOT, d)).map(f => path.join(ROOT, d, f)))
  .filter(f => /\.(tsx?|scss)$/.test(f) && !/MessageBubble|MessageActions|ChatPageContent|ChatInput|MessageList|SessionPanel/.test(f));
const out = { rules: {} };

// X-02: no agent-specific branches/literals (old + approved rosters)
const AGENT_TERMS = /architect_agent|hermes|designer_agent|devops_agent|ghl_mcp|greeting|jarvis|calc_agent|product_agent|moose_mcp|Harmes|GHL CRM|MOOSE CRM/i;
const x02 = files => files.flatMap(f => read(f).split('\n').map((l, i) => AGENT_TERMS.test(l) ? `${rel(f)}:${i + 1}` : null).filter(Boolean));
out.rules.X02 = { scanned: WS.map(rel), hits: x02(WS), control_seeded_flagged: x02([path.join(NEG, 'seeded_hardcoded_agent.tsx')]).length > 0 };

// X-12: transitive import closure from /chat page and workspace sources; forbidden targets
function resolve(from, spec) {
  let base = spec.startsWith('@/') ? path.join(ROOT, 'src', spec.slice(2)) : spec.startsWith('.') ? path.resolve(path.dirname(from), spec) : null;
  if (!base) return { pkg: spec };
  for (const c of [base, base + '.ts', base + '.tsx', base + '.js', base + '/index.ts', base + '/index.tsx']) if (fs.existsSync(c) && fs.statSync(c).isFile()) return { file: c };
  return { missing: spec };
}
function closure(entries) {
  const seen = new Set(), pkgs = new Set(), edges = [];
  const q = [...entries];
  while (q.length) {
    const f = q.pop(); if (seen.has(f) || !/\.(tsx?|jsx?)$/.test(f)) continue; seen.add(f);
    for (const m of read(f).matchAll(/(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)|^\s*import\s*['"]([^'"]+)['"]/gm)) {
      const spec = m[1] || m[2] || m[3] || m[4]; const r = resolve(f, spec); edges.push([rel(f), spec]);
      if (r.file) q.push(r.file); else if (r.pkg) pkgs.add(r.pkg);
    }
  }
  return { files: [...seen].map(rel).sort(), pkgs: [...pkgs].sort(), edges };
}
const FORBID = /instructionsService|@google-cloud|api\/agent\/instructions/;
const fileInput = files => files.filter(f => /type\s*=\s*["']file["']|type:\s*["']file["']/.test(read(path.join(ROOT, f))));
const c = closure([path.join(ROOT, 'src/app/(cyberize)/chat/page.tsx'), ...WS.filter(f => /\.tsx?$/.test(f))]);
const wsOnly = closure(WS.filter(f => /\.tsx?$/.test(f) && !/WorkspaceEntry|productionAdapter|chat[\\/]page\.tsx$/.test(f)));
out.rules.X12 = { closure_files: c.files.length, forbidden_hits: c.edges.filter(([, s]) => FORBID.test(s)).concat(c.files.filter(f => FORBID.test(f)).map(f => [f, '(file)'])),
  file_inputs_in_workspace_sources: fileInput(WS.map(rel)), presentation_closure_service_imports: wsOnly.files.filter(f => /src\/services\/|utils\/supabase|useAuthStore/.test(f)),
  packages: c.pkgs, control_seeded_flagged: closure([path.join(NEG, 'seeded_instructions_import.ts')]).edges.some(([, s]) => FORBID.test(s)) };

// X-14: fixture ThemeProvider props must equal root layout props
const props = s => { const m = s.match(/<ThemeProvider([\s\S]*?)>/); return m ? m[1].replace(/\s+/g, ' ').replace(/=\{true\}/g, '').trim().split(' ').sort().join(' ') : null; };
const rootProps = props(read(path.join(ROOT, 'src/app/layout.tsx'))), fixProps = props(read(path.join(__dirname, 'qa-fixture-entry.tsx')));
out.rules.X14 = { root_layout_props: rootProps, qa_fixture_props: fixProps, equal: rootProps === fixProps };

// X-15: CSS scope (compiled SCSS, every selector branch incl. nested at-rules)
const sass = require(path.join(ROOT, 'node_modules/sass')), postcss = require(path.join(ROOT, 'node_modules/postcss'));
function cssScope(file) {
  const css = sass.compile(file).css, bad = [], at = [];
  postcss.parse(css).walkRules(r => {
    if (r.parent && r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
    for (const sel of r.selectors) if (!sel.includes('[data-workspace-theme]')) bad.push(sel);
  });
  postcss.parse(css).walkAtRules(a => { if (!/^(charset|media|supports|keyframes|-webkit-keyframes|font-face|layer|container)$/.test(a.name)) at.push('@' + a.name); });
  return { rules_checked: css.length, unscoped_selectors: bad, unexpected_at_rules: at };
}
const blob = (rev, p) => cp.execFileSync('git', ['--no-optional-locks', 'show', `${rev}:${p}`], { cwd: ROOT });
const same = p => Buffer.compare(blob('20ef380bdd6eed5e111d953d6404992add7a88a6', p), fs.readFileSync(path.join(ROOT, p))) === 0;
out.rules.X15 = { workspace_scss: cssScope(path.join(ROOT, 'src/app/(cyberize)/chat/workspace.scss')),
  tokens_scss: cssScope(path.join(ROOT, 'src/app/(cyberize)/chat/_workspace-tokens.scss')),
  globals_scss_unchanged_vs_baseline: same('src/app/globals.scss'), tailwind_config_unchanged_vs_baseline: same('tailwind.config.ts'),
  control_seeded_flagged: cssScope(path.join(NEG, 'seeded_global_leak.scss')).unscoped_selectors.length > 0 };

// X-20: product/fixture separation (source); build markers only on a successful build
const srcFiles = cp.execFileSync('git', ['--no-optional-locks', 'ls-files', 'src'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(f => /\.(tsx?|jsx?)$/.test(f));
const MARK = /workspaceFixture|Fixture reply|fixture-user|Isolated workspace fixture|qa-fixture|window\.qa\b|__qaXss/;
out.rules.X20 = {
  src_imports_tests_or_QAM: srcFiles.filter(f => /from\s+['"][^'"]*(tests\/workspace|\/QAM\/)/.test(read(path.join(ROOT, f)))),
  fixture_markers_in_product_source: srcFiles.filter(f => !f.includes('__tests__') && MARK.test(read(path.join(ROOT, f)))),
  workspace_source_review_toolbar_or_fixture_controls: WS.map(rel).filter(f => /toolbar|fixture|preview selector|sample account/i.test(read(path.join(ROOT, f)).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''))),
  layout_keeps_protectPage: /protectPage\s*\(/.test(read(path.join(ROOT, 'src/app/(cyberize)/layout.tsx'))),
  build_marker_scan: fs.existsSync(path.join(ROOT, '.next/BUILD_ID')) ? 'RUN' : 'BLOCKED: no successful production build (Q2-4 BLOCKED)',
  control_seeded_marker_flagged: MARK.test(read(path.join(NEG, 'seeded_marker.js'))) };
if (out.rules.X20.build_marker_scan === 'RUN') {
  const hits = []; const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|html|json|rsc|css)$/.test(e.name) && MARK.test(read(p))) hits.push(rel(p)); });
  ['.next/static', '.next/server'].forEach(d => fs.existsSync(path.join(ROOT, d)) && walk(path.join(ROOT, d))); out.rules.X20.build_marker_hits = hits;
}
const r = out.rules;
out.verdict = {
  X02: !r.X02.hits.length && r.X02.control_seeded_flagged, X12: !r.X12.forbidden_hits.length && !r.X12.file_inputs_in_workspace_sources.length && !r.X12.presentation_closure_service_imports.length && r.X12.control_seeded_flagged,
  X14: r.X14.equal, X15: !r.X15.workspace_scss.unscoped_selectors.length && !r.X15.tokens_scss.unscoped_selectors.length && r.X15.globals_scss_unchanged_vs_baseline && r.X15.tailwind_config_unchanged_vs_baseline && r.X15.control_seeded_flagged,
  X20_source: !r.X20.src_imports_tests_or_QAM.length && !r.X20.fixture_markers_in_product_source.length && r.X20.layout_keeps_protectPage && r.X20.control_seeded_marker_flagged };
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 2) + '\n'); console.log(JSON.stringify(out.verdict), '| build markers:', r.X20.build_marker_scan);
