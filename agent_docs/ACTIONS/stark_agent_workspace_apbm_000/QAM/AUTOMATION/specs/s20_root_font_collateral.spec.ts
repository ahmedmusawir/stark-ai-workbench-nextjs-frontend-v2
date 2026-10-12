// Attempt-002 root-font collateral (plan v0.3 §4): synthetic text/form/table OUTSIDE the workspace at 375/1280, both themes, with
// the committed WOFF2 subsets loaded and deliberately blocked (same-origin abort = fallback control). Served bytes must equal the
// committed files. This is fixture evidence of root font wiring, not an authenticated-route or performance benchmark.
import { test, expect, record, SHOTS, setTheme } from './_qa';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const FONT_DIR = path.resolve('src/app/fonts/inter');
const SUBSETS = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'vietnamese'];
const committed = Object.fromEntries(SUBSETS.map(s => [s, crypto.createHash('sha256').update(fs.readFileSync(path.join(FONT_DIR, `inter-${s}.woff2`))).digest('hex')]));

test('S-20 root font collateral: committed subsets load and match bytes; blocked fonts fall back without overflow; both themes at 375/1280', async ({ browser }) => {
  test.setTimeout(120000); const results: Record<string, unknown> = {};
  for (const blocked of [false, true]) for (const theme of ['dark', 'light'] as const) for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } }); const p = await ctx.newPage(); await setTheme(p, theme);
    const served: Record<string, string> = {}; const fontReqs: string[] = [];
    if (blocked) await p.route('**/fonts/inter/**', r => r.abort()); // fallback control (same-origin; not egress)
    p.on('response', async r => { const u = new URL(r.url()); const m = u.pathname.match(/^\/fonts\/inter\/inter-([a-z-]+)\.woff2$/); if (m && r.ok()) served[m[1]] = crypto.createHash('sha256').update(await r.body()).digest('hex'); });
    p.on('request', r => { const u = new URL(r.url()); if (u.pathname.startsWith('/fonts/')) fontReqs.push(u.pathname); });
    await p.goto('/collateral'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    const m = await p.evaluate(() => ({
      html: document.documentElement.className, bodyClass: document.body.className, bodyFont: getComputedStyle(document.body).fontFamily,
      interAvailable: document.fonts.check('16px Inter'), loadedFaces: [...document.fonts].filter(f => f.family.replace(/"/g, '') === 'Inter' && f.status === 'loaded').map(f => f.unicodeRange.slice(0, 20)),
      bg: getComputedStyle(document.body).backgroundColor, overflow: document.documentElement.scrollWidth - innerWidth,
      // tw/th = rendered text advance via a DOM Range (block boxes alone cannot show glyph differences).
      probes: Object.fromEntries([...document.querySelectorAll<HTMLElement>('[data-font-probe]')].map(e => { const r = document.createRange(); r.selectNodeContents(e); const t = r.getBoundingClientRect();
        return [e.dataset.fontProbe!, { font: getComputedStyle(e).fontFamily, w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height, tw: t.width, th: t.height }]; })),
      preloadLinks: document.querySelectorAll('link[rel=preload][as=font]').length,
    }));
    const key = `${blocked ? 'blocked' : 'loaded'}-${theme}-${width}`;
    await p.screenshot({ path: path.join(SHOTS, `s20-collateral-${key}.png`), fullPage: true });
    results[key] = { ...m, served, fontReqs };
    expect(m.html).toBe(theme); expect(m.bodyClass).toContain('inter-font'); expect(m.bodyFont).toMatch(/^Inter, "?Inter Fallback"?$/);
    expect(m.overflow).toBeLessThanOrEqual(1);
    if (!blocked) {
      expect(Object.keys(served).sort()).toEqual([...SUBSETS].sort()); // all seven subsets exercised by the probes
      for (const s of SUBSETS) expect(served[s], `served bytes for ${s}`).toBe(committed[s]);
      expect(m.loadedFaces.length).toBe(7);
    } else {
      expect(Object.keys(served)).toEqual([]); expect(m.loadedFaces.length).toBe(0);
    }
    await ctx.close();
  }
  // Fallback layout difference (recorded, not graded): rendered text advance of each probe, blocked minus loaded, per theme/width.
  const diff: Record<string, Record<string, number>> = {};
  for (const theme of ['dark', 'light']) for (const width of [375, 1280]) {
    const L = (results[`loaded-${theme}-${width}`] as any).probes, B = (results[`blocked-${theme}-${width}`] as any).probes;
    diff[`${theme}-${width}`] = Object.fromEntries(Object.keys(L).map(k => [k, Math.round((B[k].tw - L[k].tw) * 100) / 100])); }
  record(process.env.QA_S20_RECORD || 's20-root-font-collateral', { committed, systemInterHiddenByFontconfig: !!process.env.FONTCONFIG_FILE, results, textAdvanceDeltaBlockedMinusLoaded: diff });
});
