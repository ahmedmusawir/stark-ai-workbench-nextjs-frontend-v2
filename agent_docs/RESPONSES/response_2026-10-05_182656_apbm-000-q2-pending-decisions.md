## APBM_000: Q1b approved, Q2 blocked on 3 items (consolidated pending-decision report)

Moving on to Q2. The QA Lead (JARVIS) approved **plan v0.2**. I checked the installed files and they match the Lead's index byte for byte (plan `8ddb743f…`, review `ce02c5cb…`, finding `11f614bf…`, continuation `43f923be…`). **Q2 still can't start.** I didn't start it, and Gate Q is not issued.

### Your live try-out (recorded, not judged)
- Your words are recorded verbatim in `QAM/FINDINGS/DIRECTOR-OBS-001_EXECUTOR-ADDENDUM-001.md`. The Lead had already registered the observation as **DIRECTOR-OBS-001** ("previous chat disappears / nothing saved"; untriaged, provisionally Medium).
- **Important fact I found:** you didn't run the committed roster. At 13:33 today `config/agents.manifest.json` was switched locally to greeting/jarvis/calc/product/ghl_mcp/moose_mcp. The committed Hermes roster is sitting next to it as the untracked `agents.manifest_hermes.json`. Bundles and urlEnv are unchanged.
- **The Lead won't accept "wait for APBM_001" as the answer to "nothing is remembered."** Q2 includes offline A+B session tests to work out whether the **new UI** loses a saved chat (a phase-000 defect) or whether the existing catalog never returned it (inherited). No live diagnostics unless the Architect scopes them and you authorize them.
- Your try-out does **not** count as the D7 comfort check, per the Lead's ruling.

### Q2 blockers
| # | Blocker | Owner | Fix |
|---|---|---|---|
| 1 | **Config drift:** working-tree `agents.manifest.json` ≠ candidate (sha `6c27f420…` vs `638e95a1…`), plus the untracked `agents.manifest_hermes.json` | Tony | Restore the candidate manifest and move the extra file out of the repo (commands below) |
| 2 | Q1b records installed but **not committed** (plan, review, finding, continuation, index, my addendum/state/manifest updates) | Tony | Commit (Git block below) |
| 3 | **Director decisions missing:** D4 (font-only build access), D7 (fixture comfort check or omit), and an explicit Q2 release | Tony | Reply with the release text below |
| 4 | Module-root `QA_HANDOFF.md` pointer is still on disk and tracked. The Lead expects only `QAM/HANDOFFS/QA_HANDOFF.md`. | Architect/Cody | Documentation correction outside QAM. I don't edit it. **Doesn't block Q2.** |

N1 (63 extra doc paths in your commit) still needs acknowledging. It doesn't block anything.

### What D4 means
- **ALLOW:** the Q2 production build may reach only `fonts.googleapis.com` and `fonts.gstatic.com`, with enforcement I must prove first, and Next may read `.env.local` (values never captured).
- **NO ACCESS:** independent build proof is recorded BLOCKED. That leaves AC000-20/22 and the class-C inherited-failure closure incomplete, so full Gate Q isn't possible yet. All other checks still run.

### Restore the candidate manifest (not run by me)
```bash
cp config/agents.manifest.json ~/agents.manifest_old-roster_2026-10-05.json   # keep your live-test roster outside the repo
cp config/agents.manifest_hermes.json config/agents.manifest.json            # back to candidate bytes (sha 638e95a1…)
mv config/agents.manifest_hermes.json ~/agents.manifest_hermes.json
git status --porcelain config/                                               # must print nothing
```

### Git (not run; your call)
```bash
git add agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM agent_docs/RESPONSES/response_2026-10-05_114929_apbm-000-q1-qa-intake.md agent_docs/RESPONSES/response_2026-10-05_182656_apbm-000-q2-pending-decisions.md
git commit -m "APBM-000 Q1b: Lead-approved plan v0.2, review, DIRECTOR-OBS-001 + executor addendum, QAM state"
git push
```
Do this **after** restoring the manifest, so `config/` isn't staged by accident.

### NEXT MOVE
1. **Restore the manifest** (block above), then **commit** (Git block).
2. **Reply to me with this release text**, filled in:
   > Q2 RELEASE, Director Tony, 2026-10-05 [time]. I release the APBM_000 Q2 body for product candidate 22ce03ba3871ea53e5253f2e3f060a1bab3226a3 under Lead-approved QA-APBM000-PLAN v0.2 (SHA256 8ddb743f1be09d624bf79c8a602ad05fbd3cffbffbc2d8c6cfbaee16f8b80337). D4: [ALLOW font-only build per plan §11.2 / NO ACCESS, build BLOCKED]. D7: [controlled fixture comfort check / OMIT]. N1: acknowledged.
3. **Forward this bundle to the Architect/Cody** (root pointer correction, item 4) and to **the QA Lead** (FYI: your observation addendum and the current state):
   `~/Downloads/APBM000_Q2_Pending-Decisions_2026-10-05_182656.zip`
4. Then point me back at `QAM/CLAUDE.md`. I'll verify identity and run Q2 within the approved bounds.

Report saved: `agent_docs/RESPONSES/response_2026-10-05_182656_apbm-000-q2-pending-decisions.md`
