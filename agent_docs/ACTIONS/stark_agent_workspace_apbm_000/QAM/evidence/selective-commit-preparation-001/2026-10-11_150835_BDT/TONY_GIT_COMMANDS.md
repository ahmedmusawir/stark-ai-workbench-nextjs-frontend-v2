# Tony selective commit — APBM_000 repaired candidate

Run the first block to stage only the 269 explicitly listed paths and inspect the staged diff. This block requires the expected parent/branch and an empty starting index. Do not run the second block until you have reviewed that diff.

```bash
(
  set -e
  cd /home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2
  test "$(git branch --show-current)" = qa/frontend-apbm-000
  test "$(git rev-parse HEAD)" = 9c50884d4c4513b6969311d5be7c05828104ed3d
  test -z "$(git diff --cached --name-only)"
  git --literal-pathspecs add --pathspec-from-file=agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/addmember-test-repair-001/2026-10-11_134025_BDT/staging-paths.txt
  git diff --cached --check
  git diff --cached --stat
  git diff --cached --name-status
  git diff --cached
)
```

After inspection, run the commit block. The APBM-000 prefix follows recent technical module commits; the message states the repair without claiming certification.

```bash
(
  set -e
  cd /home/moose/nextjs/10XLAB/stark-ai-workbench-nextjs-frontend-v2
  test "$(git branch --show-current)" = qa/frontend-apbm-000
  test "$(git rev-parse HEAD)" = 9c50884d4c4513b6969311d5be7c05828104ed3d
  git diff --cached --check
  git commit -m "APBM-000: workspace/font repairs and maintained test lifecycle"
  git rev-parse HEAD
)
```

Cody did not execute staging, commit, push, merge or branch changes. Send the resulting full SHA and QAM/HANDOFFS/QA_LEAD_REPAIRED_CANDIDATE_INTAKE_001.md to QA Lead. The parent HEAD is not the repaired candidate. Updated candidate-bound plan and next-attempt approval remain required; Gate Q pending, D4 ALLOW and D7 OMIT retained.
