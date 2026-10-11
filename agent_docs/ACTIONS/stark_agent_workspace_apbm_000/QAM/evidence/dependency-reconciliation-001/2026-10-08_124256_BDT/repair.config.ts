import { defineConfig } from '@playwright/test';
import path from 'node:path';
const evidence = path.resolve('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/dependency-reconciliation-001/2026-10-08_124256_BDT');
export default defineConfig({
  testDir: path.join(__dirname, 'browser'), testMatch: 'repair.spec.ts', workers: 1, retries: 0, timeout: 30000,
  outputDir: path.join(evidence, 'browser-artifacts'),
  reporter: [['list'], ['json', { outputFile: path.join(evidence, 'browser-results.json') }]],
  use: { baseURL: 'http://127.0.0.1:43176', browserName: 'chromium',
    launchOptions: { executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] },
    viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, screenshot: 'only-on-failure', trace: 'off' },
  webServer: { command: `node ${path.resolve('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/QAM/evidence/engineering-repair-001/browser_harness.cjs')}`,
    url: 'http://127.0.0.1:43176', reuseExistingServer: false, timeout: 90000 },
});
