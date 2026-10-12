#!/usr/bin/env python3
"""Q1 intake instrument (disposable): compare independent baseline/candidate full-Jest
JSON results by exact full test name, and cross-check against the Engineer's list.
Usage: q1_jest_compare.py BASELINE.json CANDIDATE.json OUT.json
"""
import json, re, sys, pathlib

REPO = pathlib.Path(__file__).resolve().parents[5]
ENG = REPO / "agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001"
ANSI = re.compile(r"\x1b\[[0-9;]*m")


def results(p):
    d = json.loads(pathlib.Path(p).read_text())
    out = {}
    for suite in d["testResults"]:
        f = str(pathlib.Path(suite["name"]).as_posix())
        f = f[f.index("src/"):]
        for t in suite["assertionResults"]:
            first = ANSI.sub("", (t.get("failureMessages") or [""])[0]).strip().split("\n")[0]
            out[(f, t["fullName"])] = {"status": t["status"], "first_line": first}
        if suite.get("testExecError") or (suite["status"] == "failed" and not suite["assertionResults"]):
            out[(f, "<suite exec error>")] = {"status": "failed", "first_line": ANSI.sub("", suite.get("message", ""))[:300]}
    totals = {k: d[k] for k in ["numPassedTestSuites", "numFailedTestSuites", "numPassedTests", "numFailedTests", "numTotalTests"]}
    return out, totals


base, bt = results(sys.argv[1])
cand, ct = results(sys.argv[2])
failed = lambda r: {k for k, v in r.items() if v["status"] == "failed"}
bf, cf = failed(base), failed(cand)
eng = {(x["file"], x["test"]) for x in json.loads((ENG / "jest-comparison.json").read_text())["retained"]}

retained = []
for k in sorted(bf & cf):
    retained.append({"file": k[0], "test": k[1], "baseline_first_line": base[k]["first_line"],
                     "candidate_first_line": cand[k]["first_line"],
                     "first_line_equal": base[k]["first_line"] == cand[k]["first_line"]})
res = {
    "baseline_totals": bt, "candidate_totals": ct,
    "new_failures": [{"file": f, "test": t, "baseline_status": base.get((f, t), {}).get("status", "absent")} for f, t in sorted(cf - bf)],
    "resolved": [{"file": f, "test": t, "candidate_status": cand.get((f, t), {}).get("status", "absent")} for f, t in sorted(bf - cf)],
    "retained_count": len(retained),
    "retained": retained,
    "engineer_list_match": {
        "engineer_count": len(eng),
        "in_engineer_not_independent": sorted(map(list, eng - (bf & cf))),
        "in_independent_not_engineer": sorted(map(list, (bf & cf) - eng)),
    },
    "removed_tests": sorted(map(list, set(base) - set(cand))),
}
pathlib.Path(sys.argv[3]).write_text(json.dumps(res, indent=2) + "\n")
print(json.dumps({k: v for k, v in res.items() if k != "retained"}, indent=1))
print("retained first-line differences:", [r["test"] for r in retained if not r["first_line_equal"]])
