# q2-prep-003: commit verification after Director release (diagnostic; NOT Q2 acceptance evidence)

Approved product reference 22ce03ba… · execution HEAD f21564cacb563ecddbf78b1685086c9489bf1c26 · plan v0.2 8ddb743f…0337 (byte-exact at HEAD) · Q1B_REVIEW ce02c5cb… (byte-exact at HEAD).

| File | What it is |
|---|---|
| identity-head-f21564c.json | `q2_identity.py` run on the live checkout. **PRODUCT_DRIFT_OR_IDENTITY_FAILURE**, 11 blocking, all `config/agents.manifest*` plus generated `next-env.d.ts`. Committed delta vs candidate: manifest.json M, manifest-hermes.json A, "manifest copy.json" D. `next-env.d.ts` was regenerated again by a Director `next dev` run at 19:23 (dev route-types import; no dev server is running now). |
| jest-head-f21564c.json / .log | Full Jest at f21564c. Run inside `unshare -rn` (lo only), `env -i`, Node guard, `--runInBand --ci`. **38/1 suites, 286 pass / 1 fail / 287.** Exit 1. |
| jest-compare-candidate-vs-head.json | `q1_jest_compare.py` vs the Q1 candidate (22ce03b) run: **0 new, 36 resolved, 1 retained**. All 24 class-A + 12 class-B inherited failures pass with the remote roster. The single remaining failure is class C (`chatStore … SSR guard …`), matching the Q1 classification that C is not roster-caused. |

Facts for the ruling:
- Only `src/config/manifest.ts` imports `config/agents.manifest.json`. Nothing imports `agents.manifest-hermes.json` or the deleted "copy" file, so both are inert data files.
- Bundles/urlEnv are unchanged by the roster swap (`v1→ADK_BUNDLE_URL_V1`, `v2-local→ADK_BUNDLE_URL_V2_LOCAL`).
- Agent IDs differ from the baseline/candidate roster, which conflicts with the literal R000-03 / AC000-21 "agent IDs unchanged" preservation unless the Architect rules.
