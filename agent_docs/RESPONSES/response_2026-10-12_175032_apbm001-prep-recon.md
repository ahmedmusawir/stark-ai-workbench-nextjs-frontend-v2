# 🛑 APBM_001 preparation recon complete. Read-only. APBM_001 NOT LAUNCHED.

**Canonical report:** `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-prep_2026-10-12.md`
**Evidence:** `agent_docs/RECON/RECON_stark-agent-workspace_APBM001-prep_2026-10-12_evidence/` (baseline Git, source anchors, Day-0 sweep, test inventory, final state)
**Package:** `/home/moose/Downloads/APBM001_PREP_RECON_2026-10-12_175032_BDT.zip`. The SHA-256 and member verification are in the receipt beside it (`…_RECEIPT.txt`).

**Baseline / ownership:** branch `frontend-apbm-0001`, HEAD `f0fbf2282737ea3a63fc78d553cd31fc570821d5` (equals `main` and `origin/main`). No tracked changes, nothing staged. The only untracked files are this session's records and recon deliverables, and the baseline matched what the assignment expected. **Claudy accepts checkout ownership as Engineer. Cody becomes QA Executor. Tony keeps all Git operations.**

## Headline (see report §1)

1. **Transcripts live in ADK; navigation lives only in Supabase `chat_sessions`.** The new workspace keeps chats in memory and saves no local pointers. If the catalogue fails, earlier chats can't be found after a reload (§4).
2. **The agent APIs trust the `user_id` the browser sends.** There is no server-side identity check (§5.3).
3. **Failures look like "empty".** A missing session shows as an empty chat, and the next send silently recreates it under the same ID. Failed list reads show as "A fresh start" (§5.5).
4. **A → B → A backend switching isn't safe.** Catalogue rows carry no backend identity, and the silent recreate itself produces the colliding IDs (§5.7).
5. **DIRECTOR-OBS-001 stays UNTRIAGED-live.** One confirmed source behaviour explains the visual symptom: after New Chat the sidebar hides every conversation (`Workspace.tsx:115`). The leading hypothesis for "nothing saved" is that the `chat_sessions` table is missing or mis-provisioned. Its setup SQL was still a pending manual step in July, and BIM-004's own spec predicts this exact symptom (§6).

## Plain English

The new workspace looks right and talks to the agents. Two things make it unreliable live. First, its memory of which chats exist depends entirely on one Supabase table, whose deployed state nobody has checked. Second, when something fails, the UI often shows "empty" instead of an error, and a missing chat can be silently recreated. The fixes are all frontend and server-route work inside the existing seams; no UI redesign is needed. Three outside factors could still block "APBM_001 = last frontend build phase":
- the ADK backend not keeping sessions durably,
- the ADK service being callable directly without auth,
- no permission to migrate the shared Supabase project.

## What the Architect needs to decide (report §10)

- **Contracts:** freeze the identity, history-error, catalogue-recovery and backend-namespace contracts. Draft ACs AC001-01…14 are in §10.3.
- **Rulings:** UUID session IDs; sidebar continuity in the draft view; the legacy `/mission-control` session panel.
- **Tony's go-ahead for live evidence:** start with **P0**, two owner-run read-only SQL metadata queries plus an ADK deployment attestation, no model calls. Then **P1/P2**, capped at ≤3 sessions and ≤5 model submissions in total (§7.3).

**Boundaries kept:**
- No product, test, dependency or config edits; no builds, suites or live calls.
- Git was used read-only.
- Never read: `.env`, credentials, ZIPs or digest-bearing records.
- APBM_000's Gate Q PASS, its NONCOMPLIANT verdict, PD-002-01 and PD-Q5-01 are preserved.

**Skill conflicts:** I recorded where the assignment overrode the skill (report §0.3): read-only Git; no build or audit; env names taken from code; the existing `RECON/` folder casing.
