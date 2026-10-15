import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
// APBM001 browser checks in real Chromium against the isolated synthetic fixture (no production
// services, auth or network). Fixture evidence only — never live-acceptance evidence (AC011/AC012).
const base=process.env.WORKSPACE_BASE_URL??'http://127.0.0.1:43181';
const evidence=path.resolve(process.env.WORKSPACE_EVIDENCE_DIR??'agent_docs/ACTIONS/stark_agent_workspace_apbm_001/ENGINEERING_EVIDENCE/attempt-001/browser');
const JOURNAL='stark-workspace-recovery-v1';
const KEY='0123456789abcdef';
type Entry={action:string;message?:string;title?:string;session?:string};
const ledger=(page:Page)=>page.evaluate(()=>(window as unknown as {workspaceFixture:{ledger:Entry[]}}).workspaceFixture.ledger);
const count=async(page:Page,action:string)=>(await ledger(page)).filter(x=>x.action===action).length;
const nav=(page:Page)=>page.getByRole('navigation',{name:'Workspace navigation'});
test.beforeEach(async({page})=>{
 await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==base){await route.abort();throw Error('Unexpected outbound browser request (address omitted)')}await route.continue()});
 page.on('pageerror',error=>{throw error});
});
test('AC013 sidebar keeps conversation links through drafts at desktop and inside the mobile drawer',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/?view=workspace');await page.getByRole('button',{name:'New chat',exact:true}).click();
 await expect(page).toHaveURL(/new=d[0-9a-f]{8}/);await expect(nav(page).getByRole('link',{name:'Planning the next research session'})).toBeVisible();
 await nav(page).getByRole('button',{name:'New chat'}).click();await expect(nav(page).getByRole('link',{name:'Comparing approaches to a new idea'})).toBeVisible();
 await nav(page).getByRole('link',{name:'Comparing approaches to a new idea'}).click();await expect(page.getByText('Only session B content.')).toBeVisible();
 await page.screenshot({path:path.join(evidence,'screenshots/ac013-desktop-conversation-sidebar.png')});
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation menu'}).click();const drawer=page.getByRole('dialog',{name:'Navigation'});
 await expect(drawer.getByRole('link',{name:'Planning the next research session'})).toBeVisible();await drawer.getByRole('button',{name:'New chat'}).click();await expect(drawer).not.toBeVisible();await expect(page).toHaveURL(/new=d[0-9a-f]{8}/);
 await page.getByRole('button',{name:'Open navigation menu'}).click();await expect(drawer.getByRole('link',{name:'Comparing approaches to a new idea'})).toBeVisible();
 await page.screenshot({path:path.join(evidence,'screenshots/ac013-mobile-drawer-during-draft.png')});
 await drawer.getByRole('link',{name:'Planning the next research session'}).click();await expect(page.getByText('Here is a',{exact:false})).toBeVisible();
 expect(await count(page,'create')+await count(page,'send')).toBe(0);
});
test('AC014 each draft is fresh; a consumed draft is replaced in history and back/forward agree with the sent session',async({page})=>{
 await page.goto('/?view=workspace');await page.getByRole('button',{name:'New chat',exact:true}).click();const first=page.url();
 await page.getByLabel('Message',{exact:true}).fill('Abandoned draft text');await page.getByRole('button',{name:'New chat',exact:true}).click();expect(page.url()).not.toBe(first);await expect(page.getByLabel('Message',{exact:true})).toHaveValue('');
 await page.getByLabel('Message',{exact:true}).fill('Send from draft two');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('Fixture reply: Send from draft two')).toBeVisible();
 const session=new URL(page.url()).searchParams.get('session');expect(session).toMatch(/^[0-9a-f-]{36}$/);
 await page.goBack();await expect(page).toHaveURL(first);await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Abandoned draft text');await expect(page.locator('.ws-turn')).toHaveCount(0);
 await page.goForward();await expect(page).toHaveURL(new RegExp('session='+session));await expect(page.getByText('Fixture reply: Send from draft two')).toBeVisible();
 expect((await ledger(page)).filter(x=>x.action==='create'||x.action==='send').map(x=>x.action+':'+x.session)).toEqual(['create:'+session,'send:'+session]);
});
test('AC015 a slow send settles into its own conversation while another is open',async({page})=>{
 await page.goto('/?view=conversation&fixture=send-slow');await expect(page.getByText('Here is a',{exact:false})).toBeVisible();await page.getByLabel('Message',{exact:true}).fill('Slow one');await page.getByRole('button',{name:'Send message'}).click();
 await nav(page).getByRole('link',{name:'Comparing approaches to a new idea'}).click();await expect(page.getByText('Only session B content.')).toBeVisible();await page.waitForTimeout(1700);
 await expect(page.getByText('Fixture reply: Slow one')).toHaveCount(0);await expect(page.getByRole('heading',{name:'Waiting for a reply'})).toHaveCount(0);
 await nav(page).getByRole('link',{name:'Planning the next research session'}).click();await expect(page.getByText('Fixture reply: Slow one')).toBeVisible();
});
test('AC016–AC018 an uncertain send survives reload, Check history never resends, and only explicit acknowledgement unlocks',async({page})=>{
 await page.goto('/?view=workspace&fixture=send-uncertain');await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('Marker that must not be stored');await page.getByRole('button',{name:'Send message'}).click();
 await expect(page.getByRole('heading',{name:'Send outcome unknown'})).toBeVisible();await expect(page.getByText('We could not confirm the last send. Check the conversation before sending again.')).toBeVisible();
 const stored=await page.evaluate(key=>localStorage.getItem(key),JOURNAL);expect(stored).toContain('"stage":"uncertain"');expect(stored).not.toContain('Marker');
 await page.reload();await expect(page.getByRole('heading',{name:'Send outcome unknown'})).toBeVisible();await expect(page.getByText('Here is a',{exact:false})).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toBeDisabled();
 await page.screenshot({path:path.join(evidence,'screenshots/ac018-uncertain-after-reload.png')});
 await page.getByRole('button',{name:'Check history'}).click();await expect(page.getByRole('heading',{name:'Send outcome unknown'})).toBeVisible();
 await page.getByRole('button',{name:'I reviewed the history — continue'}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'Send outcome unknown'})).toHaveCount(0);await expect(page.getByLabel('Message',{exact:true})).toBeEnabled();
 expect(await page.evaluate(key=>localStorage.getItem(key),JOURNAL)).toBe('[]');expect(await count(page,'send')+await count(page,'create')).toBe(0);expect(await count(page,'history')).toBeGreaterThanOrEqual(2);
});
test('AC016 a lost create keeps its UUID locatable from the list after reload',async({page})=>{
 await page.goto('/?view=workspace&fixture=create-uncertain');await page.getByLabel('Start a new conversation',{exact:true}).fill('Create may be lost');await page.getByRole('button',{name:'Send message'}).click();
 await expect(page.getByRole('heading',{name:'Send outcome unknown'})).toBeVisible();const session=new URL(page.url()).searchParams.get('session')!;expect(await count(page,'send')).toBe(0);
 await page.goto('/?view=workspace');await expect(page.getByRole('link',{name:new RegExp('Unconfirmed conversation '+session.slice(0,8))})).toBeVisible();await expect(page.getByText('Send not confirmed')).toBeVisible();
});
test('AC019 blocked recovery storage refuses the send before any write; reading still works; nothing new persists',async({page})=>{
 await page.addInitScript(key=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k:string,v:string){if(k===key)throw new DOMException('quota','QuotaExceededError');return original.call(this,k,v)}},JOURNAL);
 await page.goto('/?view=conversation');await expect(page.getByText('Here is a',{exact:false})).toBeVisible();await page.getByLabel('Message',{exact:true}).fill('Needs a marker first');await page.getByRole('button',{name:'Send message'}).click();
 await expect(page.getByText(/could not save the recovery marker/)).toBeVisible();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('Needs a marker first');expect(await count(page,'send')+await count(page,'create')).toBe(0);
 await nav(page).getByRole('link',{name:'Comparing approaches to a new idea'}).click();await expect(page.getByText('Only session B content.')).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),JOURNAL)).toBeNull();
 await page.getByRole('button',{name:'Switch to light mode'}).filter({visible:true}).click();await expect(page.locator('html')).toHaveClass('light');
});
test('AC004/AC005 keyed roster: unbound and stale links never open against this target; unavailable agent is honest',async({page})=>{
 await page.goto('/?roster=keyed&query='+encodeURIComponent('agent=atlas&session=a'));await expect(page.getByRole('heading',{name:'Confirm this conversation link'})).toBeVisible();expect(await count(page,'history')).toBe(0);
 await page.getByRole('button',{name:'Open with the current service'}).click();await expect(page).toHaveURL(new RegExp('bk='+KEY));await expect(page.getByText('Here is a',{exact:false})).toBeVisible();
 await page.goto('/?roster=keyed&query='+encodeURIComponent('agent=atlas&session=a&bk=fedcba9876543210'));await expect(page.getByRole('heading',{name:'Conversation link from another configuration'})).toBeVisible();await expect(page.getByRole('button',{name:'Open with the current service'})).toHaveCount(0);expect(await count(page,'history')).toBe(0);
 await page.goto('/?roster=keyed');const card=page.getByRole('main').getByRole('link',{name:/Ghost Agent/});await expect(card.getByText('Not available on this agent service')).toBeVisible();await card.click();
 await expect(page.getByRole('heading',{name:'Agent unavailable'})).toBeVisible();await expect(page.getByRole('button',{name:'Send message'})).toHaveCount(0);expect(await count(page,'list')).toBe(0);
 await page.screenshot({path:path.join(evidence,'screenshots/ac005-agent-unavailable.png')});
});
for(const theme of ['dark','light'])for(const width of [390,768,1023,1024,1440])test(`AC022 visual boundary ${theme} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.addInitScript(value=>localStorage.setItem('theme',value),theme);
 for(const [name,url] of [['directory','/'],['draft','/?query='+encodeURIComponent('agent=atlas&new=d00000001')],['conversation','/?view=conversation']] as const){
  await page.goto(url);await expect(page.locator('.ws-root')).toBeVisible();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('html')).toHaveClass(theme);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  if(width>=1024){await expect(page.locator('.ws-sidebar.ws-desktop')).toBeVisible();await expect(page.getByRole('button',{name:'Open navigation menu'})).toBeHidden();}
  else{await expect(page.locator('.ws-sidebar.ws-desktop')).toBeHidden();await expect(page.getByRole('button',{name:'Open navigation menu'})).toBeVisible();}
  if(name==='draft'&&width>=1024)await expect(nav(page).getByRole('link',{name:'Planning the next research session'})).toBeVisible();
  if(name==='conversation')await expect(page.locator('.ws-composer')).toHaveCSS('border-radius','16px');
  await page.screenshot({path:path.join(evidence,`screenshots/${name}-${theme}-${width}.png`)});
 }
});
