## APBM_000: remote-roster rebind evidence complete, awaiting QA Lead binding

The Architect's bounded amendment is installed and its index is verified (9/9). The evidence it asked for is complete, and **your cloud roster is untouched**. **No acceptance testing has run. Q2 and Gate Q are pending.**

**Missing file:** the Lead instruction your message points to (`QAM/HANDOFFS/LEAD_REMOTE_ROSTER_PREP_2026-10-05.md`) **does not exist anywhere on disk**. I found only `~/Downloads/APBM000_REMOTE_ROSTER_AMENDMENT_v1_0.zip` (the Architect amendment) and followed its evidence list. If the Lead wrote a separate prep file, it hasn't reached this machine.

### Evidence results (`QAM/evidence/remote-roster-rebind-001/`)
- **Verdict AMENDMENT_EVIDENCE_CONSISTENT.**
  - The complete three-file patch and the exact old/new file bodies are exported.
  - All hashes match the Architect's table.
  - The **only** product change from `22ce03b` to `f21564c` is those 3 config files. The other 43 paths are QAM records and docs.
- **Bundles and urlEnv are unchanged.** All 6 agents map to `v1`.
- **Only `manifest.ts` (and its test) uses the active manifest.** The `-hermes` file and the deleted "copy" file are unused.
- **Identity tooling v2** is a new file; v1 is preserved byte-exact.
  - It accepts **only** these exact 3 transitions.
  - Self-test: **7/7 expected-red controls fired**, including a wrong amendment hash and the roster change without the amendment.
  - Live result for candidate `f21564c`: **PRODUCT_EQUIVALENT (0 blocking)** with the bounded `next-env.d.ts` allowance, and **1 blocking item** in strict mode (the dev-generated `next-env.d.ts`).
- Diagnostic Jest at `f21564c`: **286 pass / 1 fail**. Only the class-C SSR-guard failure remains.

### What the QA Lead must decide
| # | Decision | Executor recommendation |
|---|---|---|
| L1 | Bind product candidate **`f21564cacb563ecddbf78b1685086c9489bf1c26`** under the Architect amendment (the exact 3-file delta) | Bind. Evidence is consistent. |
| L2 | Approve identity tool **`q2_identity_v2.py` (cf0968a2…)** + `roster_amendment_2026-10-05.json` (8da8cb0b…) for Q2-0 | Approve |
| L3 | `next-env.d.ts`: accept the exact dev-variant (bounded flag), or require restoring the pinned build variant before Q2-0 | Accept the bounded variant. Tony runs `next dev`, and `next build` regenerates it during Q2 anyway (pre/post hash recorded). |
| L4 | Inherited failures: retire the 36 A/B waivers. C stays conditional at its exact name. Q2-2 must reproduce exactly 286/1 with only C. | As stated |
| L5 | Issue the effective plan/candidate addendum: v0.2 bytes (8ddb743f…) plus this binding, with actual document hashes | Lead authors |
| L6 | Other anomalies: the root pointer (Cody-authorized removal, not blocking), the untracked RESPONSES 193516 (excluded), and the self-referential records list | Classify individually as listed |

After the Lead approves, I need **one** confirmation from you. This is the Architect's text, used verbatim:
> "Extend my Q2 release to candidate f21564cacb563ecddbf78b1685086c9489bf1c26 under the QA Lead's revised approval incorporating the 5 October remote-roster amendment. Keep my font-build permission and skip the optional visual check. Begin after candidate verification."

D4 = ALLOW and D7 = OMIT stay as already recorded. You aren't asked again.

### Git (not run; QAM only, RESPONSES excluded)
```bash
git add -- agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM
git diff --cached --name-only | grep -v "^agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/" || echo "OK: only QAM staged"
git diff --cached --name-only | wc -l      # expect the count stated in NEXT MOVE
git commit -m "APBM-000: Architect remote-roster amendment + rebind evidence, identity v2 (awaiting Lead binding)"
git push
```
`agent_docs/RESPONSES/response_2026-10-05_193516_apbm-000-q2-held-ruling-request.md` stays untracked, as the Architect instructed. Nothing under `config/`, `src/` or the root pointer is staged.

### NEXT MOVE
1. **Send the QA Lead this one file:** `~/Downloads/APBM000_Roster-Rebind-Review_2026-10-05_215715.zip`. Decisions L1–L6 are listed first inside it.
2. Ask the Lead whether `LEAD_REMOTE_ROSTER_PREP_2026-10-05.md` exists. If it does, send it to me and I'll check this work against it.
3. Commit with the Git block (optional now, required before Q2).
4. **When the Lead's revised approval arrives,** paste it to me. I'll verify it, then ask you for the single confirmation above. Q2 starts only after that.
