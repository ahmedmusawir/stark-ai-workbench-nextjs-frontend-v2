// QA config for the D6 Engineer-spec copy (path/port-only). Uses the unmodified Engineer harness on QA port 43182; QA-owned outputs only.
import { defineConfig } from '@playwright/test';
import path from 'node:path';
const ROOT = path.resolve(__dirname, '../../../../..');
const Q = path.join(ROOT, 'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM');
export default defineConfig({
  testDir: `${Q}/AUTOMATION/engineer-spec-copy`, testMatch: 'workspace.spec.ts', fullyParallel: false, workers: 1, retries: 0, timeout: 30000,
  outputDir: `${Q}/evidence/q2-attempt-001/q2-7/artifacts`,
  reporter: [['list'], ['json', { outputFile: `${Q}/evidence/q2-attempt-001/q2-7/playwright-results.json` }]],
  use: { baseURL: 'http://127.0.0.1:43182', browserName: 'chromium', launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] }, viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1, trace: 'off', screenshot: 'only-on-failure' },
  webServer: { command: 'node tests/workspace/harness.cjs', cwd: ROOT, url: 'http://127.0.0.1:43182', reuseExistingServer: false, timeout: 90000, env: { APBM_WORKSPACE_PORT: '43182', NODE_OPTIONS: '--require=./tests/workspace/network-guard.cjs' } },
});
