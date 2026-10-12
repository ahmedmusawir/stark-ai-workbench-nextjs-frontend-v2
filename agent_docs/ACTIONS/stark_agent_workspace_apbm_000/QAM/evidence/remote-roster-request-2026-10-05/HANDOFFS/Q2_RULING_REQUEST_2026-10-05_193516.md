## APBM_000: release recorded, Q2 HELD at commit verification (one ruling needed)

Your release is recorded verbatim: **D4 = ALLOW** the font build, **D7 = OMIT**. I verified the commit as you asked, and verification stopped Q2 before any testing ran. **No acceptance test has run. Gate Q is not issued.** I didn't touch your manifest, and I won't.

### Why it stopped
- Your new commit **`f21564c`** ("keep this must…") is on top of `9a65cdd` and pushed.
- It changes **product config** relative to the approved candidate `22ce03b`:
  - `agents.manifest.json`: Hermes roster → your remote ADK roster
  - `agents.manifest-hermes.json`: added
  - `agents.manifest copy.json`: deleted
- The Lead-approved plan says that if product or config differs from the candidate at Q2-0, Q2 stops for a **fresh Lead binding**. I can't wave that through myself, and the plan forbids me from changing the manifest back. So it's a ruling, not a fix.

### The facts the ruling needs (read-only, isolated diagnostics)
- **Your roster fixes the old tests.** Full Jest at `f21564c` gives **286 pass / 1 fail** (was 250 / 37 on the candidate). All 36 class A/B inherited failures pass, and the only one left is class C (the chatStore storage defect, which isn't roster-related, exactly as Q1 said). So the repo's code and tests were written for **your** roster. The Hermes roster in the baseline was the odd one out.
- Only `src/config/manifest.ts` reads `agents.manifest.json`. The `-hermes` file and the deleted "copy" file are imported by nothing, so they're inert.
- Bundles and urlEnv are unchanged. **Agent IDs did change**, which conflicts with the literal wording of R000-03 / AC000-21 ("agent IDs unchanged") unless the Architect rules otherwise.
- `next-env.d.ts` was regenerated again by a `next dev` run at 19:23. It's harmless, it's gitignored, and nothing is running now.

### Ruling question (owners: Architect for R000-03/AC000-21 scope, QA Lead for the rebind)
> **Should APBM_000's product candidate be rebound from `22ce03b` to `f21564c`, with the remote ADK roster ruled the active configuration under R000-03/AC000-21 (bundles/urlEnv unchanged, inherited A/B failures no longer present, C still conditional)? Or should Q2 keep `22ce03b` and run in a read-only `git archive` extract while the branch carries the Director's config?**

**My recommendation: rebind to `f21564c`.**
- It's what you actually run.
- The QA checkout stays untouched, with no extract and no config conflict.
- The A/B waivers become unnecessary.
- The delta is 3 config files, and the plan stays v0.2 unchanged.

### Git (not run; your call)
```bash
git add -- agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/HANDOFFS/DIRECTOR_Q2_RELEASE_2026-10-05_193516.md agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/HANDOFFS/Q2_RULING_REQUEST_2026-10-05_193516.md agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/q2-prep-003 agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/QAM_STATE.json agent_docs/RESPONSES/response_2026-10-05_193516_apbm-000-q2-held-ruling-request.md
git diff --cached --name-only    # expect only these QAM paths + 1 RESPONSES file; nothing under config/
git commit -m "APBM-000 Q2: Director release recorded; held at Q2-0 on f21564c config delta; ruling request"
git push
```

### NEXT MOVE
1. **Send this ONE file to the Architect (JARVIS Master) and the QA Lead (JARVIS):**
   `~/Downloads/APBM000_Q2_Ruling-Request_2026-10-05_193516.zip`
   It contains this report, your release record, the identity and Jest diagnostics, and the current state.
2. **Ask them for the ruling question above.** The Architect amends R000-03/AC000-21 for the roster, and the Lead rebinds the candidate to `f21564c`.
3. **Commit** with the Git block when convenient.
4. **When the ruling comes back,** paste it to me. Your release still stands, so I'll re-verify and start Q2 immediately, with no need to send the release again.
5. Keep using `next dev` freely. I'll account for the regenerated `next-env.d.ts` at Q2-0 and won't touch your config.
