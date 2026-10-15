import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
// APBM001: base/evidence come from the running config; defaults reproduce the APBM000 run.
const base=process.env.WORKSPACE_BASE_URL??'http://127.0.0.1:43170';
const evidence=path.resolve(process.env.WORKSPACE_EVIDENCE_DIR??'agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001');
const ledger=(page:Page)=>page.evaluate(()=>(window as unknown as {workspaceFixture:{ledger:Array<{action:string;message?:string;title?:string;session?:string}>}}).workspaceFixture.ledger);
test.beforeEach(async({page})=>{
 await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==base){await route.abort();throw Error('Unexpected outbound browser request (address omitted)')}await route.continue()});
 page.on('pageerror',error=>{throw error});
});
for(const view of ['directory','workspace','conversation'])for(const theme of ['dark','light'])for(const width of [375,768,1280])test(`render ${view} ${theme} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.addInitScript(value=>localStorage.setItem('theme',value),theme);await page.goto(`/?view=${view}`);await expect(page.locator('.ws-root')).toBeVisible();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('html')).toHaveClass(theme);
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 const colors=await page.locator('.ws-root').evaluate(el=>({bg:getComputedStyle(el).backgroundColor,radius:getComputedStyle(el).getPropertyValue('--radius')}));expect(colors.bg).toBe(theme==='dark'?'rgb(63, 63, 70)':'rgb(255, 255, 255)');expect(colors.radius.trim()).toBe('.75rem');if(view==='directory')await expect(page.locator('.ws-agent-card').first()).toHaveCSS('border-radius','12px');if(view==='workspace')await expect(page.locator('.ws-composer')).toHaveCSS('border-radius','16px');
 await expect(page.locator('#unscoped-sibling')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');expect(await page.locator('#unscoped-sibling').evaluate(el=>getComputedStyle(el).getPropertyValue('--background'))).toBe('');
 if(view==='conversation'){
  await expect(page.getByText('Here is a', {exact:false})).toBeVisible();
  const scroll=await page.locator('.ws-thread-scroll').boundingBox(),composer=await page.locator('.ws-compose-wrap').boundingBox();expect(scroll!.y+scroll!.height).toBeLessThanOrEqual(composer!.y+1);expect(composer!.y+composer!.height).toBeLessThanOrEqual(901);
  expect(await page.getByRole('region',{name:'Code block'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();expect(await page.getByRole('region',{name:'Message table'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
  await expect(page.locator('.ws-thread script')).toHaveCount(0);
 }
 await page.screenshot({path:path.join(evidence,`screenshots/${view}-${theme}-${width}.png`),fullPage:view!=='conversation'});
});
test('directory filter, neutral alternate roster and safe navigation/back',async({page})=>{
 await page.goto('/?roster=alternate');await page.getByLabel('Find an agent').fill('REVIEW');await expect(page.locator('.ws-agent-card')).toHaveCount(1);await expect(page.getByRole('heading',{name:'Moss Review'})).toBeVisible();await page.getByLabel('Find an agent').fill('unmatched');await expect(page.getByRole('heading',{name:'No matching agents'})).toBeVisible();await page.getByLabel('Find an agent').fill('Orbit');await page.locator('.ws-agent-card').click();await expect(page.getByRole('heading',{name:'Orbit Notes'})).toBeVisible();expect(page.url()).toContain('orbit%2F%CE%B2');await page.goBack();await expect(page.getByRole('heading',{name:'Your agents'})).toBeVisible();await page.goForward();await expect(page.getByRole('heading',{name:'Orbit Notes'})).toBeVisible();
});
test('default dark, saved light and legacy system are preserved',async({page})=>{
 await page.goto('/');await expect(page.locator('html')).toHaveClass('dark');await page.getByRole('button',{name:'Switch to light mode'}).filter({visible:true}).click();await page.reload();await expect(page.locator('html')).toHaveClass('light');await page.evaluate(()=>localStorage.setItem('theme','system'));await page.emulateMedia({colorScheme:'light'});await page.reload();await expect(page.locator('html')).toHaveClass('light');expect(await page.evaluate(()=>localStorage.getItem('theme'))).toBe('system');
});
test('invalid query cannot invoke services; empty/loading/unavailable roster distinct',async({page})=>{
 await page.goto('/?query='+encodeURIComponent('agent=atlas&new=1&session=a'));await expect(page.getByRole('heading',{name:'Workspace unavailable'})).toBeVisible();expect(await ledger(page)).toEqual([]);
 for(const [fixture,title] of [['directory-empty','No agents configured'],['directory-loading','Loading agents…'],['directory-unavailable','Agent configuration unavailable']]){await page.goto('/?fixture='+fixture);await expect(page.getByText(title,{exact:true})).toBeVisible();expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);}
});
test('fresh drafts, whitespace/IME and double-submit guard; allocated ID binds once (APBM001)',async({page})=>{
 await page.goto('/?view=workspace');await page.getByRole('button',{name:'New chat',exact:true}).click();expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);await page.getByLabel('Message',{exact:true}).fill('Discard me');await page.getByRole('button',{name:'New chat',exact:true}).click();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('');await page.getByLabel('Message',{exact:true}).fill('   ');await expect(page.getByRole('button',{name:'Send message'})).toBeDisabled();await page.getByLabel('Message',{exact:true}).fill('A deliberate message');await page.getByLabel('Message',{exact:true}).dispatchEvent('keydown',{key:'Enter',isComposing:true});expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);await page.getByLabel('Message',{exact:true}).press('Shift+Enter');await expect(page.getByLabel('Message',{exact:true})).toHaveValue(/\n/);await page.getByLabel('Message',{exact:true}).press('Enter');await page.getByLabel('Message',{exact:true}).dispatchEvent('keydown',{key:'Enter'});await expect(page).toHaveURL(/session=[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/);await expect(page.getByText('Fixture reply: A deliberate message')).toBeVisible();expect((await ledger(page)).filter(x=>x.action==='create')).toHaveLength(1);expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(1);
});
test('navigation drawer traps focus, restores opener, closes at breakpoint and portal cleans up',async({page})=>{
 await page.setViewportSize({width:768,height:900});await page.goto('/?view=workspace');await page.getByRole('button',{name:'Open navigation menu'}).click();const dialog=page.getByRole('dialog',{name:'Navigation'});await expect(dialog).toBeVisible();await expect(page.getByRole('button',{name:'Close Navigation'})).toBeFocused();await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))).toBeTruthy();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open navigation menu'})).toBeFocused();await page.getByRole('button',{name:'Open navigation menu'}).click();await page.setViewportSize({width:1024,height:900});await expect(dialog).not.toBeVisible();expect(await page.evaluate(()=>!!document.activeElement?.closest('.ws-desktop'))).toBeTruthy();await page.evaluate(()=>(window as unknown as {workspaceFixture:{unmount():void}}).workspaceFixture.unmount());await expect(page.locator('[data-workspace-portal]')).toHaveCount(0);expect(await page.evaluate(()=>document.body.style.pointerEvents)).not.toBe('none');
});
test('context disclosure and nested dialogs isolate edits by agent/user and reset on reload',async({page})=>{
 await page.setViewportSize({width:768,height:900});await page.goto('/?view=workspace');const disclosure=page.getByRole('button',{name:'Demo context',exact:true});await expect(disclosure).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('button',{name:'Edit demo instructions'})).not.toBeVisible();await disclosure.click();await expect(disclosure).toHaveAttribute('aria-expanded','true');await page.getByRole('button',{name:'Edit demo instructions'}).click();await page.getByLabel('Demo instructions',{exact:true}).fill('Only Atlas demo');await page.getByRole('button',{name:'Apply to demo'}).click();await expect(page.getByRole('button',{name:'Edit demo instructions'})).toBeFocused();await expect(page.getByText('Only Atlas demo')).toBeVisible();await page.getByRole('button',{name:'Add sample document',exact:true}).click();await page.getByRole('button',{name:'Research checklist.md',exact:true}).click();await page.getByRole('button',{name:'Preview Research checklist.md'}).click();await expect(page.getByText(/Fictional sample: define/)).toBeVisible();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Remove Research checklist.md'}).click();await expect(page.getByRole('button',{name:'Add sample document',exact:true})).toBeFocused();
 await page.setViewportSize({width:1280,height:900});await page.getByRole('link',{name:'Echo',exact:true}).click();await expect(page.getByText('Only Atlas demo')).toHaveCount(0);await page.getByRole('link',{name:'Atlas',exact:true}).first().click();await expect(page.getByText('Only Atlas demo')).toBeVisible();await page.evaluate(()=>(window as unknown as {workspaceFixture:{resetIdentity():void}}).workspaceFixture.resetIdentity());await expect(page.getByText('Only Atlas demo')).toHaveCount(0);await page.reload();await expect(page.getByText('Only Atlas demo')).toHaveCount(0);expect((await ledger(page)).some(x=>['send','rename','archive'].includes(x.action))).toBeFalsy();await expect(page.locator('input[type=file]')).toHaveCount(0);
});
test('context focus gets safe destination when narrow resize hides content',async({page})=>{
 await page.goto('/?view=workspace');await page.getByRole('button',{name:'Edit demo instructions'}).focus();await page.setViewportSize({width:768,height:900});await expect(page.getByRole('button',{name:'Demo context',exact:true})).toBeFocused();await expect(page.getByRole('button',{name:'Edit demo instructions'})).not.toBeVisible();
});
test('APBM001: read failures and write outcomes constrain callbacks (metadata-warning retired)',async({page})=>{
 for(const [fixture,title] of [['missing','Conversation not found'],['unavailable','History unavailable'],['access-unavailable','Conversation access unavailable']]){
  await page.goto('/?view=conversation&fixture='+fixture);await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toBeDisabled();
  if(fixture==='unavailable'){await page.getByRole('button',{name:'Try loading again'}).click();await expect(page.getByRole('heading',{name:title})).toBeVisible();}
  expect((await ledger(page)).filter(x=>x.action==='send'||x.action==='create')).toHaveLength(0);
 }
 for(const [fixture,title] of [['send-pending','Waiting for a reply'],['send-uncertain','Send outcome unknown'],['send-not-sent','Message not sent'],['send-missing','Conversation not found']]){
  await page.evaluate(()=>localStorage.removeItem('stark-workspace-recovery-v1'));await page.goto('/?view=conversation&fixture='+fixture);await expect(page.getByText('Here is a',{exact:false})).toBeVisible();await page.getByLabel('Message',{exact:true}).fill('Deliberate');await page.getByRole('button',{name:'Send message'}).click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  if(fixture==='send-not-sent')await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Deliberate');else await expect(page.getByLabel('Message',{exact:true})).toBeDisabled();
  if(fixture==='send-uncertain'){await page.getByRole('button',{name:'Check history'}).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();expect((await ledger(page)).filter(x=>x.action==='history').length).toBeGreaterThan(1);}
  expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(1);expect((await ledger(page)).filter(x=>x.action==='create')).toHaveLength(0);
  // A pending send abandoned by reload is stale: it reopens as uncertain, never as delivered or failed.
  if(fixture==='send-pending'){await page.reload();await expect(page.getByRole('heading',{name:'Send outcome unknown',exact:true})).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toBeDisabled();}
 }
});
test('APBM001 deferral: no rename/archive controls or archive promise; titles render as literal text',async({page})=>{
 await page.goto('/?view=workspace');await expect(page.getByRole('link',{name:/Planning the next/})).toBeVisible();await expect(page.getByRole('button',{name:/Actions for/})).toHaveCount(0);
 expect(await page.locator('.ws-root').innerText()).not.toMatch(/archive|rename|delete/i);await expect(page.getByText('Started',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('<b>literal</b> & punctuation');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('<b>literal</b> & punctuation',{exact:true}).first()).toBeVisible();await expect(page.locator('.ws-thread b')).toHaveCount(0);
 expect((await ledger(page)).filter(x=>x.action==='create')[0].title).toBe('<b>literal</b> & punctuation');
});
test('late history cannot paint another session; clipboard fallback and no raw HTML',async({page})=>{
 await page.goto('/?view=conversation&fixture=late-history');await page.getByRole('link',{name:'Comparing approaches to a new idea'}).click();await expect(page.getByText('Only session B content.')).toBeVisible();await page.waitForTimeout(750);await expect(page.getByText('Question in session a')).toHaveCount(0);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('fixture denied'))}}));await page.getByRole('button',{name:'Copy conversation as Markdown'}).click();await expect(page.getByLabel('Text to copy manually')).toHaveValue(/## Atlas/);
});
test('portal light/dark tokens present on first visible frame and modal Escape restores trigger',async({page})=>{
 for(const theme of ['light','dark']){await page.addInitScript(value=>localStorage.setItem('theme',value),theme);await page.goto('/?view=conversation');await page.getByRole('button',{name:'Open demo instructions and context'}).click();const dialog=page.getByRole('dialog',{name:'Demo context',exact:true});await expect(dialog).toBeVisible();await expect(dialog).toHaveCSS('background-color',theme==='dark'?'rgb(39, 39, 42)':'rgb(255, 255, 255)');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open demo instructions and context'})).toBeFocused();}
});

test('modal background inert, backdrop dismissal and listener/portal cleanup',async({page})=>{
 await page.goto('/?view=conversation');await page.getByRole('button',{name:'Open demo instructions and context'}).click();await expect.poll(()=>page.locator('.ws-root').evaluate(el=>(el as HTMLElement).inert)).toBeTruthy();await page.locator('.ws-overlay').click({position:{x:3,y:3}});await expect(page.getByRole('dialog',{name:'Demo context',exact:true})).not.toBeVisible();await expect(page.getByRole('button',{name:'Open demo instructions and context'})).toBeFocused();expect(await page.locator('.ws-root').evaluate(el=>(el as HTMLElement).inert)).toBeFalsy();
});
test('real copy payloads and speech lifecycle with explicit browser doubles',async({page})=>{
 await page.addInitScript(()=>{
  const state={copies:[] as string[],spoken:0,cancelled:0};Object.assign(window,{fixtureCapabilities:state});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(t:string)=>{state.copies.push(t)}}});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){state.cancelled++},speak(utterance:{onstart?:()=>void}){state.spoken++;utterance.onstart?.()},getVoices(){return[]}}});
 });
 await page.goto('/?view=conversation');await page.getByRole('button',{name:'Copy code',exact:true}).click();await page.getByRole('button',{name:'Copy conversation as Markdown'}).click();const copies=await page.evaluate(()=>(window as unknown as {fixtureCapabilities:{copies:string[]}}).fixtureCapabilities.copies);expect(copies[0]).toContain('const conversation');expect(copies[0]).not.toContain('```');expect(copies[1]).toContain('**clear starting point**');await page.getByRole('button',{name:'Read aloud',exact:true}).click();await expect(page.getByRole('button',{name:'Stop reading',exact:true})).toBeVisible();await page.getByRole('button',{name:'Stop reading',exact:true}).click();expect(await page.evaluate(()=>(window as unknown as {fixtureCapabilities:{spoken:number}}).fixtureCapabilities.spoken)).toBe(1);
});
test('APBM001: confirmed create keeps its allocated ID and repeats only deliberate continuation sends',async({page})=>{
 await page.goto('/?view=workspace');await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('First');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('Fixture reply: First')).toBeVisible();
 const session=new URL(page.url()).searchParams.get('session');await page.getByLabel('Message',{exact:true}).fill('Second');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('Fixture reply: Second')).toBeVisible();
 const entries=await ledger(page);expect(entries.filter(x=>x.action==='create').map(x=>x.session)).toEqual([session]);expect(entries.filter(x=>x.action==='send').map(x=>x.session)).toEqual([session,session]);
});

test('send failures preserve the attempt: uncertain keeps the visible attempt, not-sent restores the draft (partial recents retired)',async({page})=>{
 for(const fixture of ['send-uncertain','send-not-sent']){await page.goto('/?view=workspace&fixture='+fixture);await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('Keep this attempt');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByRole('heading',{name:fixture==='send-uncertain'?'Send outcome unknown':'Message not sent'})).toBeVisible();if(fixture==='send-uncertain'){await expect(page.getByText('Keep this attempt',{exact:true})).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toBeDisabled()}else await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Keep this attempt');expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(1);}
});
