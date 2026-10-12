// QA outer wrapper for secondary Engineer-copy suites (attempt-002, plan v0.3 §3): re-exports Playwright with the mandatory
// exact-origin policy/page-error auto fixtures from ../specs/_qa. Assertion bodies of the copied suites are unchanged.
export * from '@playwright/test';
export { test, expect } from '../specs/_qa';
