# Rendering and check evidence

Run recorded2026-10-04. Evidence concerns the supplied standalone design files only. It is not Gate Q or application/backend validation.

## Rendering method

Playwright driving local headless Chromium153.0.8010.0, device scale2. Each fresh context loads a local file, pins theme through a preview-only query, hides review controls with `review=0`, awaits `document.fonts.ready` and two animation frames, then renders. Viewports:375×900,768×1000,1280×1000 CSS pixels. PNG physical width is twice the CSS width. Directory/workspace/tile captures are full page; conversation captures the viewport because its thread scrolls independently. Supplemental chat code capture demonstrates content further down that scroll region.

82 PNGs:70 measured cases plus12 named supplementary views. `RENDER_CHECKS.json` records each measured URL combination, dimensions, font status, composer bounds, browser version and errors; `additionalEvidence` lists supplementary filenames. Base24 images cover every screen × both themes × all three widths. The additional46 measured jobs cover named state and alternate roster variations. Supplementary12 cover mobile navigation/context/code/focus, desktop directory focus and expanded mobile workspace context.

Results:0 horizontal page overflow cases;0 out-of-viewport composers; all Inter font checks true;0 script errors;0 external HTTP requests. Component table/code overflow is intentionally internal and keyboard focusable.

## Interaction and contrast

`INTERACTION_CHECKS.json`:63 passed assertions. Covers default/persisted theme, configured/alternate roster, local filtering, no fallback agent links during empty/unavailable/loading directory states, screen/session navigation, invalid IDs, drawer trap/Escape/resize restoration, permanent demo disclosure, nested modal return, fixture resets, blocked send states, uncertain history checks without resend, preserved failed draft, new draft pending without invented earlier history, Markdown copy payload, unsupported read-aloud fixture, rename quoting/archive, no external HTTP and isolated route/portal token inheritance.

`CONTRAST_CHECKS.json`:66 sRGB/WCAG calculated pairs.60 core pairs plus6 displayed syntax-code pairs. Normal/status text threshold4.5:1; essential control/focus boundary threshold3:1. All recorded pairs pass. Smallest displayed code pair4.77:1. Disabled controls/decorative dividers are not relied on as essential boundaries. This is pair-level evidence, not a blanket accessibility certification or qualification of all syntax highlighting classes.

`ARTIFACT_CHECKS.json`:recalculated contrast, PNG inventory equality, duplicate static IDs, static local-link integrity, and equality between scoped token values and portable core+chat files. All pass. `verify_artifacts.py` can reproduce these non-browser checks.

## Visual inspection

Reviewed representative full renders and grouped views of directory dark desktop/light mobile; workspace light desktop/dark expanded mobile; conversation dark desktop/light tablet; light mobile table/code; dark mobile uncertain outcome; mobile dark drawer/light context modal; both-theme focus examples and dark tablet style tile. Earlier canonical render review established the unchanged core workspace/tile direction. Link controls were corrected to retain10px corners and mobile context received an explicit accessible name; both are included in final renders/checks.

The final screenshot set is indexed individually in ARTIFACT_INDEX.md. No screenshot is presented as a live application capture. The inherited chat treatment comes from the supplied source extraction.

## Reproducing

Dependencies: Python3 with beautifulsoup4; Node with Playwright; an available Chromium executable. Fonts and readable artifact sources are bundled; no font/network fetch is needed. Runtime/browser binaries are not bundled.

```sh
python3 build_final.py
DESIGN_CHROMIUM=/absolute/path/to/chromium node render_final.cjs
DESIGN_CHROMIUM=/absolute/path/to/chromium node check_final.cjs
python3 verify_artifacts.py
sha256sum -c SHA256SUMS.txt
```

Set `CODEX_PRIMARY_RUNTIME_NODE_MODULES` to the directory containing Playwright if running outside the original environment, or adapt the require path to a locally installed Playwright module. Checksum validation applies to the shipped files before regeneration; browser-dependent raster differences or rewritten reports after rerunning change hashes. `reference/` holds the canonical inputs needed by the builder; open final root screens for review. Changes to final CSS/JS require running build_final.py before rendering because HTML is self-contained.

## Remaining implementation validation

Real mobile keyboard/viewport and zoom; screen-reader announcement timing; production Radix portals/focus; real app CSS isolation on route transitions; existing theme storage semantics; actual clipboard and speech support; API state races and durable history; authenticated user/backend separation; metadata/RLS and reconciliation. The preview sends no real messages, performs no upload and publishes no instructions.
