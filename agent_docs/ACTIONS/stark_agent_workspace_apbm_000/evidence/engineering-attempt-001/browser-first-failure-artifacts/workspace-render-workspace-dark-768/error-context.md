# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace.spec.ts >> render workspace dark 768
- Location: tests/workspace/workspace.spec.ts:10:134

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "12px"
Received: ".75rem"
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#ws-main"
  - generic [ref=e5]:
    - button "Open navigation menu" [ref=e6] [cursor=pointer]:
      - img [ref=e7]
    - strong [ref=e8]: STARK WORKSPACE
    - button "Switch to light mode" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
  - generic [ref=e16]:
    - banner [ref=e17]:
      - generic [ref=e18]:
        - link "Agents" [ref=e19] [cursor=pointer]:
          - /url: /chat
        - img [ref=e20]
        - link "Atlas" [ref=e22] [cursor=pointer]:
          - /url: /chat?agent=atlas
    - main [ref=e23]:
      - generic [ref=e24]:
        - img [ref=e26]
        - generic [ref=e29]:
          - heading "Atlas" [level=1] [ref=e30]
          - paragraph [ref=e31]: Research and planning workspace.
      - generic [ref=e32]:
        - text: Start a new conversation
        - textbox "Start a new conversation" [ref=e33]:
          - /placeholder: What would you like to work on?
        - generic [ref=e34]:
          - generic [ref=e35]:
            - img [ref=e36]
            - text: Atlas
          - generic [ref=e38]: Enter to send · Shift + Enter for a new line
          - button "Send message" [disabled] [ref=e39]:
            - img [ref=e40]
      - paragraph [ref=e42]: One agent. Separate conversations.
      - generic [ref=e43]:
        - button "Demo context" [ref=e45] [cursor=pointer]:
          - text: Demo context
          - img [ref=e46]
        - generic [ref=e48]:
          - heading "Recent conversations" [level=2] [ref=e49]
          - generic [ref=e50]:
            - link "Planning the next research session 10/4/2026" [ref=e51] [cursor=pointer]:
              - /url: /chat?agent=atlas&session=a
              - img [ref=e52]
              - generic [ref=e54]:
                - strong [ref=e55]: Planning the next research session
                - generic [ref=e56]: 10/4/2026
            - button "Actions for Planning the next research session" [ref=e57] [cursor=pointer]:
              - img [ref=e58]
          - generic [ref=e62]:
            - link "Comparing approaches to a new idea 10/3/2026" [ref=e63] [cursor=pointer]:
              - /url: /chat?agent=atlas&session=b
              - img [ref=e64]
              - generic [ref=e66]:
                - strong [ref=e67]: Comparing approaches to a new idea
                - generic [ref=e68]: 10/3/2026
            - button "Actions for Comparing approaches to a new idea" [ref=e69] [cursor=pointer]:
              - img [ref=e70]
          - paragraph [ref=e74]: Each conversation keeps its own history.
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | import path from 'node:path';
  3  | const base='http://127.0.0.1:43170';
  4  | const evidence=path.resolve('agent_docs/ACTIONS/stark_agent_workspace_apbm_000/evidence/engineering-attempt-001');
  5  | const ledger=(page:Page)=>page.evaluate(()=>(window as unknown as {workspaceFixture:{ledger:Array<{action:string;message?:string;title?:string;session?:string}>}}).workspaceFixture.ledger);
  6  | test.beforeEach(async({page})=>{
  7  |  await page.route('**/*',async route=>{const url=new URL(route.request().url());if(url.origin!==base){await route.abort();throw Error('Unexpected outbound browser request (address omitted)')}await route.continue()});
  8  |  page.on('pageerror',error=>{throw error});
  9  | });
  10 | for(const view of ['directory','workspace','conversation'])for(const theme of ['dark','light'])for(const width of [375,768,1280])test(`render ${view} ${theme} ${width}`,async({page})=>{
  11 |  await page.setViewportSize({width,height:900});await page.addInitScript(value=>localStorage.setItem('theme',value),theme);await page.goto(`/?view=${view}`);await expect(page.locator('.ws-root')).toBeVisible();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('html')).toHaveClass(theme);
  12 |  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
> 13 |  const colors=await page.locator('.ws-root').evaluate(el=>({bg:getComputedStyle(el).backgroundColor,radius:getComputedStyle(el).getPropertyValue('--radius')}));expect(colors.bg).toBe(theme==='dark'?'rgb(63, 63, 70)':'rgb(255, 255, 255)');expect(colors.radius.trim()).toBe('12px');
     |                                                                                                                                                                                                                                                                            ^ Error: expect(received).toBe(expected) // Object.is equality
  14 |  await expect(page.locator('#unscoped-sibling')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');expect(await page.locator('#unscoped-sibling').evaluate(el=>getComputedStyle(el).getPropertyValue('--background'))).toBe('');
  15 |  if(view==='conversation'){
  16 |   await expect(page.getByText('Here is a', {exact:false})).toBeVisible();
  17 |   const scroll=await page.locator('.ws-thread-scroll').boundingBox(),composer=await page.locator('.ws-compose-wrap').boundingBox();expect(scroll!.y+scroll!.height).toBeLessThanOrEqual(composer!.y+1);expect(composer!.y+composer!.height).toBeLessThanOrEqual(901);
  18 |   expect(await page.getByRole('region',{name:'Code block'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();expect(await page.getByRole('region',{name:'Message table'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
  19 |   await expect(page.locator('.ws-thread script')).toHaveCount(0);
  20 |  }
  21 |  await page.screenshot({path:path.join(evidence,`screenshots/${view}-${theme}-${width}.png`),fullPage:view!=='conversation'});
  22 | });
  23 | test('directory filter, neutral alternate roster and safe navigation/back',async({page})=>{
  24 |  await page.goto('/?roster=alternate');await page.getByLabel('Find an agent').fill('REVIEW');await expect(page.locator('.ws-agent-card')).toHaveCount(1);await expect(page.getByText('Moss Review')).toBeVisible();await page.getByLabel('Find an agent').fill('unmatched');await expect(page.getByRole('heading',{name:'No matching agents'})).toBeVisible();await page.getByLabel('Find an agent').fill('Orbit');await page.locator('.ws-agent-card').click();await expect(page.getByRole('heading',{name:'Orbit Notes'})).toBeVisible();expect(page.url()).toContain('orbit%2F%CE%B2');await page.goBack();await expect(page.getByRole('heading',{name:'Your agents'})).toBeVisible();
  25 | });
  26 | test('default dark, saved light and legacy system are preserved',async({page})=>{
  27 |  await page.goto('/');await expect(page.locator('html')).toHaveClass('dark');await page.getByRole('button',{name:'Switch to light mode'}).filter({visible:true}).click();await page.reload();await expect(page.locator('html')).toHaveClass('light');await page.evaluate(()=>localStorage.setItem('theme','system'));await page.emulateMedia({colorScheme:'light'});await page.reload();await expect(page.locator('html')).toHaveClass('light');expect(await page.evaluate(()=>localStorage.getItem('theme'))).toBe('system');
  28 | });
  29 | test('invalid query cannot invoke services; empty/loading/unavailable roster distinct',async({page})=>{
  30 |  await page.goto('/?query='+encodeURIComponent('agent=atlas&new=1&session=a'));await expect(page.getByRole('heading',{name:'Workspace unavailable'})).toBeVisible();expect(await ledger(page)).toEqual([]);
  31 |  for(const [fixture,title] of [['directory-empty','No agents configured'],['directory-loading','Loading agents…'],['directory-unavailable','Agent configuration unavailable']]){await page.goto('/?fixture='+fixture);await expect(page.getByText(title,{exact:true})).toBeVisible();expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);}
  32 | });
  33 | test('fresh drafts, whitespace/IME and double-submit guard; durable returned ID binds once',async({page})=>{
  34 |  await page.goto('/?view=workspace');await page.getByRole('button',{name:'New chat',exact:true}).click();expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);await page.getByLabel('Message',{exact:true}).fill('Discard me');await page.getByRole('button',{name:'New chat',exact:true}).click();await expect(page.getByLabel('Message',{exact:true})).toHaveValue('');await page.getByLabel('Message',{exact:true}).fill('   ');await expect(page.getByRole('button',{name:'Send message'})).toBeDisabled();await page.getByLabel('Message',{exact:true}).fill('A deliberate message');await page.getByLabel('Message',{exact:true}).dispatchEvent('keydown',{key:'Enter',isComposing:true});expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);await page.getByLabel('Message',{exact:true}).press('Shift+Enter');await expect(page.getByLabel('Message',{exact:true})).toHaveValue(/\n/);await page.getByLabel('Message',{exact:true}).press('Enter');await page.getByLabel('Message',{exact:true}).dispatchEvent('keydown',{key:'Enter'});await expect(page).toHaveURL(/session=created-1/);expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(1);await expect(page.getByText('Fixture reply: A deliberate message')).toBeVisible();
  35 | });
  36 | test('navigation drawer traps focus, restores opener, closes at breakpoint and portal cleans up',async({page})=>{
  37 |  await page.setViewportSize({width:768,height:900});await page.goto('/?view=workspace');await page.getByRole('button',{name:'Open navigation menu'}).click();const dialog=page.getByRole('dialog',{name:'Navigation'});await expect(dialog).toBeVisible();await expect(page.getByRole('button',{name:'Close Navigation'})).toBeFocused();await page.keyboard.press('Shift+Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))).toBeTruthy();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open navigation menu'})).toBeFocused();await page.getByRole('button',{name:'Open navigation menu'}).click();await page.setViewportSize({width:1024,height:900});await expect(dialog).not.toBeVisible();expect(await page.evaluate(()=>!!document.activeElement?.closest('.ws-desktop'))).toBeTruthy();await page.evaluate(()=>(window as unknown as {workspaceFixture:{unmount():void}}).workspaceFixture.unmount());await expect(page.locator('[data-workspace-portal]')).toHaveCount(0);expect(await page.evaluate(()=>document.body.style.pointerEvents)).not.toBe('none');
  38 | });
  39 | test('context disclosure and nested dialogs isolate edits by agent/user and reset on reload',async({page})=>{
  40 |  await page.setViewportSize({width:768,height:900});await page.goto('/?view=workspace');const disclosure=page.getByRole('button',{name:'Demo context',exact:true});await expect(disclosure).toHaveAttribute('aria-expanded','false');await expect(page.getByRole('button',{name:'Edit demo instructions'})).not.toBeVisible();await disclosure.click();await expect(disclosure).toHaveAttribute('aria-expanded','true');await page.getByRole('button',{name:'Edit demo instructions'}).click();await page.getByLabel('Demo instructions',{exact:true}).fill('Only Atlas demo');await page.getByRole('button',{name:'Apply to demo'}).click();await expect(page.getByRole('button',{name:'Edit demo instructions'})).toBeFocused();await expect(page.getByText('Only Atlas demo')).toBeVisible();await page.getByRole('button',{name:'Add sample document',exact:true}).click();await page.getByRole('button',{name:'Research checklist.md',exact:true}).click();await page.getByRole('button',{name:'Preview Research checklist.md'}).click();await expect(page.getByText(/Fictional sample: define/)).toBeVisible();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Remove Research checklist.md'}).click();await expect(page.getByRole('button',{name:'Add sample document',exact:true})).toBeFocused();
  41 |  await page.setViewportSize({width:1280,height:900});await page.getByRole('link',{name:'Echo',exact:true}).click();await expect(page.getByText('Only Atlas demo')).toHaveCount(0);await page.getByRole('link',{name:'Atlas',exact:true}).first().click();await expect(page.getByText('Only Atlas demo')).toBeVisible();await page.evaluate(()=>(window as unknown as {workspaceFixture:{resetIdentity():void}}).workspaceFixture.resetIdentity());await expect(page.getByText('Only Atlas demo')).toHaveCount(0);await page.reload();await expect(page.getByText('Only Atlas demo')).toHaveCount(0);expect((await ledger(page)).some(x=>['send','rename','archive'].includes(x.action))).toBeFalsy();await expect(page.locator('input[type=file]')).toHaveCount(0);
  42 | });
  43 | test('context focus gets safe destination when narrow resize hides content',async({page})=>{
  44 |  await page.goto('/?view=workspace');await page.getByRole('button',{name:'Edit demo instructions'}).focus();await page.setViewportSize({width:768,height:900});await expect(page.getByRole('button',{name:'Demo context',exact:true})).toBeFocused();await expect(page.getByRole('button',{name:'Edit demo instructions'})).not.toBeVisible();
  45 | });
  46 | test('missing/unavailable/access/uncertain/pending/failed/metadata states constrain callbacks',async({page})=>{
  47 |  for(const [fixture,title] of [['missing','Conversation not found'],['unavailable','History unavailable'],['access-unavailable','Conversation access unavailable'],['uncertain','Send outcome unknown'],['pending','Waiting for a reply'],['not-sent','Message not sent'],['metadata-warning','Conversation started; title not saved']]){
  48 |   await page.goto('/?view=conversation&fixture='+fixture);await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();
  49 |   if(!['not-sent','metadata-warning'].includes(fixture))await expect(page.getByLabel('Message',{exact:true})).toBeDisabled();
  50 |   if(fixture==='uncertain'){await page.getByRole('button',{name:'Check history'}).click();await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();expect((await ledger(page)).filter(x=>x.action==='history').length).toBeGreaterThan(1);}
  51 |   if(fixture==='unavailable'){await page.getByRole('button',{name:'Try loading again'}).click();await expect(page.getByRole('heading',{name:title})).toBeVisible();}
  52 |   if(fixture==='not-sent')await expect(page.getByLabel('Message',{exact:true})).toHaveValue('My preserved draft');
  53 |   if(fixture==='metadata-warning'){await page.getByRole('button',{name:'Check conversation list'}).click();await expect(page).toHaveURL(/view=conversation/);}
  54 |   expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(0);
  55 |  }
  56 | });
  57 | test('recents partial/recovered states and safe literal metadata actions with failure retention',async({page})=>{
  58 |  await page.goto('/?view=workspace&fixture=recovered');await expect(page.getByRole('heading',{name:'Recovery view'})).toBeVisible();await expect(page.getByText('Some listed conversations may have been archived.')).toBeVisible();await expect(page.getByRole('button',{name:/Actions for/})).toHaveCount(0);
  59 |  await page.goto('/?view=workspace');await page.getByRole('button',{name:/Actions for/}).first().click();await page.getByLabel('Conversation title').fill('  ');await expect(page.getByRole('button',{name:'Save name'})).toBeDisabled();await page.getByLabel('Conversation title').fill('<literal> & punctuation');await page.getByRole('button',{name:'Save name'}).click();await expect(page.getByRole('link',{name:/<literal> & punctuation/})).toBeVisible();await expect(page.getByRole('button',{name:'Actions for <literal> & punctuation'})).toBeFocused();await page.getByRole('button',{name:'Actions for <literal> & punctuation'}).click();await page.getByRole('button',{name:'Archive conversation'}).click();await expect(page.getByRole('heading',{name:'Recent conversations'})).toBeFocused();await expect(page.getByRole('link',{name:/<literal> & punctuation/})).toHaveCount(0);
  60 |  await page.goto('/?view=workspace&fixture=metadata-failure');await page.getByRole('button',{name:/Actions for/}).first().click();await page.getByLabel('Conversation title').fill('Rejected title');await page.getByRole('button',{name:'Save name'}).click();await expect(page.getByRole('alert')).toContainText('have been kept');await page.keyboard.press('Escape');await expect(page.getByRole('link',{name:/Planning the next/})).toBeVisible();
  61 | });
  62 | test('late history cannot paint another session; clipboard fallback and no raw HTML',async({page})=>{
  63 |  await page.goto('/?view=conversation&fixture=late-history');await page.getByRole('link',{name:'Comparing approaches to a new idea'}).click();await expect(page.getByText('Only session B content.')).toBeVisible();await page.waitForTimeout(750);await expect(page.getByText('Question in session a')).toHaveCount(0);
  64 |  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('fixture denied'))}}));await page.getByRole('button',{name:'Copy conversation as Markdown'}).click();await expect(page.getByLabel('Text to copy manually')).toHaveValue(/## Atlas/);
  65 | });
  66 | test('portal light/dark tokens present on first visible frame and modal Escape restores trigger',async({page})=>{
  67 |  for(const theme of ['light','dark']){await page.addInitScript(value=>localStorage.setItem('theme',value),theme);await page.goto('/?view=conversation');await page.getByRole('button',{name:'Open demo instructions and context'}).click();const dialog=page.getByRole('dialog',{name:'Demo context',exact:true});await expect(dialog).toBeVisible();await expect(dialog).toHaveCSS('background-color',theme==='dark'?'rgb(39, 39, 42)':'rgb(255, 255, 255)');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open demo instructions and context'})).toBeFocused();}
  68 | });
  69 | 
```