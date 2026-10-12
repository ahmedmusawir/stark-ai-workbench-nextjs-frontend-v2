#!/usr/bin/env python3
"""Attempt-002 production-output audit (plan v0.3 §5, Stage F). Read-only over .next; seeded controls use a scratch copy only.
Usage: python3 -I a2_output_audit.py <repo> <build_cmd_json> <prebuild_json> <scratch_dir> <out_json>
Checks: build freshness (BUILD_ID new + written after build start), BUILD_ID/route/build manifests + hashes, /chat route and auth-guard
relationship in compiled output, fixture/QA marker + forbidden-import scan of fresh server/static output (seeded positive control),
emitted WOFF2 bytes = the seven committed subsets and compiled CSS resolving every subset, font preload presence (recorded).
"""
import hashlib, json, os, re, shutil, sys, datetime
repo, build_cmd, prebuild, scratch, out = sys.argv[1:6]
N = os.path.join(repo, '.next'); sha = lambda p: hashlib.sha256(open(p, 'rb').read()).hexdigest()
MARK = re.compile(rb'workspaceFixture|Fixture reply|fixture-user|Isolated workspace fixture|qa-fixture|window\.qa\b|__qaXss|QA isolated workspace fixture|qa-harness|QA_FIXTURE_READY')
FORBID = re.compile(rb'tests/workspace|stark_agent_workspace_apbm_000/QAM|fixture-entry|network-guard')
res = {'audit': 'a2_output_audit.py', 'at': datetime.datetime.now().astimezone().isoformat(timespec='seconds')}
cmd = json.load(open(build_cmd)); pre = json.load(open(prebuild))
start = datetime.datetime.fromisoformat(cmd['started']).timestamp()
bid = os.path.join(N, 'BUILD_ID'); res['build_exit'] = cmd['exit']
res['build_id'] = open(bid).read().strip() if os.path.isfile(bid) else None
res['fresh'] = bool(res['build_id']) and cmd['exit'] == 0 and os.path.getmtime(bid) >= start and res['build_id'] != pre.get('build_id')
res['prebuild'] = pre
mans = {}
for m in ['build-manifest.json', 'app-build-manifest.json', 'app-path-routes-manifest.json', 'routes-manifest.json', 'prerender-manifest.json', 'required-server-files.json', 'server/app-paths-manifest.json', 'server/middleware-manifest.json']:
    p = os.path.join(N, m)
    if os.path.isfile(p): mans[m] = {'sha256': sha(p), 'bytes': os.path.getsize(p)}
res['manifests'] = mans
routes = json.load(open(os.path.join(N, 'app-path-routes-manifest.json'))) if os.path.isfile(os.path.join(N, 'app-path-routes-manifest.json')) else {}
res['chat_route'] = {k: v for k, v in routes.items() if v == '/chat'}
def files(d):
    for dp, _, fs in os.walk(d):
        for f in fs:
            if f.endswith(('.js', '.html', '.json', '.rsc', '.css', '.txt', '.body', '.meta')): yield os.path.join(dp, f)
scan_dirs = [os.path.join(N, 'static'), os.path.join(N, 'server')]
def scan(dirs):
    hits, forb, n = [], [], 0
    for d in dirs:
        for p in files(d):
            n += 1; b = open(p, 'rb').read()
            if MARK.search(b): hits.append(os.path.relpath(p, repo))
            if FORBID.search(b): forb.append(os.path.relpath(p, repo))
    return n, hits, forb
fresh_files = [p for d in scan_dirs for p in files(d) if os.path.getmtime(p) >= start - 1]
all_files = [p for d in scan_dirs for p in files(d)]
n, hits, forb = scan(scan_dirs)
res['marker_scan'] = {'files_scanned': n, 'fresh_files': len(fresh_files), 'stale_files_in_scan_dirs': len(all_files) - len(fresh_files), 'marker_hits': hits, 'forbidden_import_hits': forb}
# Seeded positive control on a scratch copy (never inside .next).
ctl = os.path.join(scratch, 'seeded-output'); shutil.rmtree(ctl, ignore_errors=True); os.makedirs(os.path.join(ctl, 'server'))
shutil.copy(sorted(fresh_files)[0], os.path.join(ctl, 'server', 'copied.js')) if fresh_files else None
open(os.path.join(ctl, 'server', 'seeded.js'), 'wb').write(b'console.log("Fixture reply"); require("../tests/workspace/fixture-entry");')
_, chits, cforb = scan([ctl]); res['seeded_control'] = {'marker_flagged': any('seeded.js' in h for h in chits), 'forbidden_flagged': any('seeded.js' in h for h in cforb)}
shutil.rmtree(ctl, ignore_errors=True)
# Auth relationship: the compiled (cyberize) layout still calls the protectPage guard and /chat sits under it.
guard_src = open(os.path.join(repo, 'src/app/(cyberize)/layout.tsx')).read()
lay = [p for p in all_files if re.search(r'server/app/\(cyberize\)/layout|server/app/\(cyberize\)/chat/page\.js$', p)]
res['auth_relation'] = {'source_layout_calls_protectPage': bool(re.search(r'protectPage\s*\(', guard_src)),
                        'compiled_chat_page': [os.path.relpath(p, repo) for p in lay],
                        'compiled_references_auth_redirect': sorted({os.path.relpath(p, repo) for p in all_files if '/server/' in p and (b'protectPage' in open(p, 'rb').read() or b'"/auth"' in open(p, 'rb').read())})[:20]}
# Fonts: emitted bytes and compiled CSS resolution.
fontdir = os.path.join(repo, 'src/app/fonts/inter'); committed = {f: sha(os.path.join(fontdir, f)) for f in os.listdir(fontdir) if f.endswith('.woff2')}
emitted = {}
for p in all_files + [os.path.join(dp, f) for dp, _, fs in os.walk(os.path.join(N, 'static')) for f in fs if f.endswith('.woff2')]:
    if p.endswith('.woff2'): emitted[os.path.relpath(p, N)] = sha(p)
by_hash = {h: [k for k, v in emitted.items() if v == h] for h in committed.values()}
css = [p for p in all_files if p.endswith('.css') and '/static/' in p]
faces = []
for p in css:
    t = open(p, encoding='utf8', errors='replace').read()
    for m in re.finditer(r'@font-face\s*\{([^}]*)\}', t):
        body = m.group(1); u = re.search(r'url\(([^)]+)\)', body); fam = re.search(r'font-family:\s*([^;]+)', body)
        faces.append({'css': os.path.relpath(p, repo), 'family': fam.group(1).strip() if fam else None, 'url': u.group(1).strip('\'"') if u else None,
                      'range': (re.search(r'unicode-range:\s*([^;]+)', body) or [None, None])[1]})
resolved = {}
for f, h in committed.items():
    names = [os.path.basename(k) for k in by_hash[h]]
    resolved[f] = [x for x in faces if x['url'] and os.path.basename(x['url']) in names and (x['family'] or '').strip('\'"') == 'Inter']
res['fonts'] = {'committed': committed, 'emitted_woff2': emitted, 'committed_emitted_byte_equal': {f: bool(by_hash[h]) for f, h in committed.items()},
                'css_files': [os.path.relpath(p, repo) for p in css], 'inter_faces': len([x for x in faces if (x['family'] or '').strip('\'"') == 'Inter']),
                'each_subset_resolved_by_css': {f: len(v) > 0 for f, v in resolved.items()}, 'fallback_face_present': any((x['family'] or '').strip('\'"') == 'Inter Fallback' for x in faces)}
html = [p for p in all_files if p.endswith(('.html', '.rsc', '.body'))]
res['font_preload'] = {'html_files': len(html), 'files_with_font_preload': [os.path.relpath(p, repo) for p in html if re.search(rb'rel="preload"[^>]*as="font"|as="font"[^>]*rel="preload"', open(p, 'rb').read())],
                       'note': 'next/font automatic Latin preload removed by the repair; recorded, not graded'}
F = res['fonts']
res['verdict'] = {'fresh_build': res['fresh'], 'chat_route': bool(res['chat_route']), 'auth_guard_source': res['auth_relation']['source_layout_calls_protectPage'],
                  'no_markers': not hits, 'no_forbidden_imports': not forb, 'seeded_control_flagged': all(res['seeded_control'].values()),
                  'fonts_byte_equal': all(F['committed_emitted_byte_equal'].values()), 'css_resolves_all_subsets': all(F['each_subset_resolved_by_css'].values())}
res['verdict']['all'] = all(res['verdict'].values())
json.dump(res, open(out, 'w'), indent=2); print(json.dumps(res['verdict']))
