# Selective candidate staging — Director action only

Engineer performed no Git mutation. `staging-paths.txt` is an explicit, repository-relative allowlist for Tony's review: 28 product/test/script changes, the supplied frozen module/Designer assets (needed for independent Q1 and fixture fonts), and this run's safe factual documentation/evidence. It excludes old response deletions, earlier recon/probe/theme packages, root log histories, dependencies/build/env files and handoff ZIP binaries. Review the source diff and evidence before staging; this is not permission to sweep unrelated work.

After review, Tony may stage exactly the listed paths from repository root with this command (not executed by Engineer):

```bash
git --literal-pathspecs add --pathspec-from-file=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001/staging-paths.txt
```

Inspect the staged diff, then commit only the reviewed APBM_000 scope. Root CHANGELOG/RECOVERY/session/response files contain earlier work as well; include only the intended new log hunks as a separate reviewed documentation decision. The ZIP and its receipt are review artifacts, not required runtime files; retain them without blindly staging binaries. The export receipt is generated after archive validation and is deliberately absent from its own archive.

Actual engineering branch is frontend-apbm. Tony or the authorized next owner, not this Engineer run, creates/prepares intended qa/frontend-apbm-000 after pinning the committed candidate. Independent QA enters QAM/AGENTS.md, verifies full input hashes/current status, drafts Q1 plan and returns it for QA Lead approval. Do not start Q2 simply because engineering self-checks passed. Resolve the retained failure disposition through the Lead's existing rule.
