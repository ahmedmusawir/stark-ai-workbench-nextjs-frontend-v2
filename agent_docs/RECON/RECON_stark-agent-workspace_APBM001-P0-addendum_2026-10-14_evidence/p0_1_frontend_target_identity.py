#!/usr/bin/env python3
"""APBM001 P0-1: frontend target identity. OWNER-RUN (Tony), local, read-only.

Run from the repository root:
    python3 -I agent_docs/RECON/RECON_stark-agent-workspace_APBM001-P0-addendum_2026-10-14_evidence/p0_1_frontend_target_identity.py

Reads only four named settings from .env.local (or the path given as the first
argument) and prints PUBLIC identifiers derived from them:
  - chat mode (live/mock/other)
  - the Supabase project ref (public: it is part of the browser-visible project URL)
  - the class of each ADK bundle URL: loopback/private/Cloud Run service+region/other

It never prints keys, passwords, tokens, full URLs, paths or query strings, and
ignores every other line in the file. The output is safe to paste back.
"""
import ipaddress
import json
import re
import sys
from urllib.parse import urlsplit

WANTED = ("NEXT_PUBLIC_CHAT_MODE", "NEXT_PUBLIC_SUPABASE_URL", "ADK_BUNDLE_URL_V1", "ADK_BUNDLE_URL_V2_LOCAL")


def read_wanted(path):
    values = {}
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            m = re.match(r"\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$", line)
            if not m or m.group(1) not in WANTED:
                continue
            raw = m.group(2)
            if raw[:1] in ("'", '"'):
                raw = raw[1:].split(raw[0], 1)[0]
            else:
                raw = raw.split(" #", 1)[0].strip()
            values[m.group(1)] = raw  # dotenv semantics: last assignment wins
    return values


def classify_url(url):
    try:
        parts = urlsplit(url)
        host = (parts.hostname or "").lower()
        has_creds = bool(parts.username or parts.password)
    except ValueError:
        return {"class": "unparseable"}
    out = {"scheme": parts.scheme or None, "credentials_in_url": has_creds}
    if not host:
        out["class"] = "no-host"
        return out
    try:
        ip = ipaddress.ip_address(host)
        out["class"] = "loopback" if ip.is_loopback else ("private-ip" if ip.is_private else "public-ip")
        return out
    except ValueError:
        pass
    if host == "localhost" or host.endswith(".localhost"):
        out["class"] = "loopback"
        return out
    m = re.fullmatch(r"([a-z0-9-]+)\.([a-z0-9-]+)\.run\.app", host)
    if m:
        label, region = m.groups()
        pm = re.fullmatch(r"(.+)-(\d{6,})", label)
        out.update({"class": "cloud-run", "region": region,
                    "service": pm.group(1) if pm else None,
                    "project_number": pm.group(2) if pm else None,
                    "host_label": label})
        return out
    if host.endswith(".run.app"):
        out.update({"class": "cloud-run-legacy-url", "host_label": host.split(".", 1)[0]})
        return out
    out["class"] = "other-host"
    return out


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else ".env.local"
    values = read_wanted(path)
    report = {"p0": "APBM001-P0-1 frontend target identity v1",
              "settings_present": {name: name in values and values[name] != "" for name in WANTED}}
    mode = values.get("NEXT_PUBLIC_CHAT_MODE", "")
    report["chat_mode"] = mode if mode in ("live", "mock") else ("unset" if not mode else "other")
    supa = values.get("NEXT_PUBLIC_SUPABASE_URL", "")
    if supa:
        host = (urlsplit(supa).hostname or "").lower()
        m = re.fullmatch(r"([a-z0-9]{15,30})\.supabase\.co", host)
        report["supabase_project_ref"] = m.group(1) if m else None
        report["supabase_url_class"] = "supabase.co" if m else "custom-or-other-domain"
    for name in ("ADK_BUNDLE_URL_V1", "ADK_BUNDLE_URL_V2_LOCAL"):
        if values.get(name):
            report[name + "_class"] = classify_url(values[name])
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
