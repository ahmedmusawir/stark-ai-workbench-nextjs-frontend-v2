import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/workspace', testMatch:'workspace.spec.ts', fullyParallel:false, workers:1, retries:0, timeout:30000,
  outputDir:'./agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001/browser-artifacts',
  reporter:[['list'],['json',{outputFile:'./agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001/playwright-results.json'}]],
  use:{baseURL:'http://127.0.0.1:43170',browserName:'chromium',launchOptions:{executablePath:'/opt/google/chrome/chrome',args:['--disable-background-networking']},viewport:{width:1280,height:1000},deviceScaleFactor:1,trace:'off',screenshot:'only-on-failure'},
  webServer:{command:'node tests/workspace/harness.cjs',url:'http://127.0.0.1:43170',reuseExistingServer:false,timeout:90000,env:{NODE_OPTIONS:'--require=./tests/workspace/network-guard.cjs'}},
});
