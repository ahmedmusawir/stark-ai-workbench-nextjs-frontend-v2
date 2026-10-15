import { defineConfig } from '@playwright/test';
import path from 'node:path';
// APBM001 engineering self-verification: the existing workspace regression plus APBM001 browser
// checks against the isolated synthetic fixture. All output stays inside the APBM001 module so
// APBM000 evidence is never rewritten; the APBM000 configs remain untouched and reproducible.
// Each attempt keeps its own folder (Playwright clears outputDir per run); default = attempt-001.
const attempt = /^attempt-\d{3}$/.test(process.env.APBM001_ATTEMPT ?? '') ? process.env.APBM001_ATTEMPT! : 'attempt-001';
const evidence = path.resolve('agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE', attempt, 'browser');
const port = 43181;
process.env.WORKSPACE_EVIDENCE_DIR = evidence;
process.env.WORKSPACE_BASE_URL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: __dirname, testMatch: ['workspace.spec.ts', 'apbm001.spec.ts'], fullyParallel: false, workers: 1, retries: 0, timeout: 30000,
  outputDir: path.join(evidence, 'artifacts'),
  reporter: [['list'], ['json', { outputFile: path.join(evidence, 'playwright-results.json') }]],
  use: { baseURL: `http://127.0.0.1:${port}`, browserName: 'chromium', launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] }, viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1, trace: 'off', screenshot: 'only-on-failure' },
  webServer: { command: 'node tests/workspace/harness.cjs', cwd: path.resolve(__dirname, '../..'), url: `http://127.0.0.1:${port}`, reuseExistingServer: false, timeout: 90000, env: { NODE_OPTIONS: '--require=./tests/workspace/network-guard.cjs', APBM_WORKSPACE_PORT: String(port) } },
});
