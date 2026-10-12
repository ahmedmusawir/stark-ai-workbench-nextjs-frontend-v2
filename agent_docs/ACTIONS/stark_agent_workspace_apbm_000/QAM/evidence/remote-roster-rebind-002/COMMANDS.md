# Read-only preparation commands

Run from the repository root. These are config/identity preparation diagnostics, not Q2 acceptance. Existing tools were inspected and left unchanged. No shell/environment contents are captured.

```bash
python3 agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/rebind_evidence.py agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/remote-roster-rebind-002/config-evidence
python3 agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/q2_identity_v2.py --candidate f21564cacb563ecddbf78b1685086c9489bf1c26 --amendment agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/roster_amendment_2026-10-05.json --approved agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/q2_approved_qam_records.json --out agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/remote-roster-rebind-002/identity-current-strict.json
python3 agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/q2_identity_v2.py --candidate f21564cacb563ecddbf78b1685086c9489bf1c26 --amendment agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/roster_amendment_2026-10-05.json --approved agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/AUTOMATION/q2_approved_qam_records.json --accept-next-env-dev-variant --out agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/remote-roster-rebind-002/identity-current-bounded-variant.json
```

Outputs refuse overwrite. Reproduction needs a fresh approved evidence destination. Raw JSON carries timestamps/tool hashes and verdicts. The strict instrument's process exits zero even when raw verdict is red: use the literal verdict/blocking count, not exit code, to assess identity. The proposed bounded run is not Lead acceptance of its flag. No self-tests/acceptance suite were rerun; prior tool controls remain historical input.

Commit-successor lists and current-config equality were independently collected using git --no-optional-locks diff/show/rev-parse and local SHA256. Only the three config blob contents were exported; no environment values were read. Entry status was clean. Session/report/state/evidence are inside QAM; package CRC/index verification is separate from acceptance.
