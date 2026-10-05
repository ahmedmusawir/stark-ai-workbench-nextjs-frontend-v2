const { chromium } = require(process.cwd() + '/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--disable-background-networking'] });
  const p = await b.newPage(); const origins = new Set();
  p.on('request', r => origins.add(new URL(r.url()).origin));
  await p.goto('http://127.0.0.1:43181/'); await p.waitForSelector('h1', { timeout: 15000 });
  console.log(JSON.stringify({ browser: b.version(), h1: await p.textContent('h1'), origins: [...origins] }));
  await b.close();
})().catch(e => { console.error('SMOKE_FAIL', e.message); process.exit(1); });
