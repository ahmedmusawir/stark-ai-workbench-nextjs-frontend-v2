# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace.spec.ts >> render conversation light 1280
- Location: tests/workspace/workspace.spec.ts:10:134

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#ws-main"
  - navigation "Workspace navigation" [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: S
      - generic [ref=e8]:
        - text: STARK
        - generic [ref=e9]: Agent Workspace
    - button "New chat" [ref=e10] [cursor=pointer]:
      - img [ref=e11]
      - text: New chat
    - link "All agents" [ref=e12] [cursor=pointer]:
      - /url: /chat
      - img [ref=e13]
      - generic [ref=e15]: All agents
    - generic [ref=e16]:
      - paragraph [ref=e17]: Your agents
      - link "Atlas" [ref=e19] [cursor=pointer]:
        - /url: /chat?agent=atlas
        - img [ref=e20]
        - generic [ref=e22]: Atlas
      - link "Echo" [ref=e24] [cursor=pointer]:
        - /url: /chat?agent=echo
        - img [ref=e25]
        - generic [ref=e27]: Echo
      - link "Studio" [ref=e29] [cursor=pointer]:
        - /url: /chat?agent=studio
        - img [ref=e30]
        - generic [ref=e32]: Studio
    - generic [ref=e33]:
      - paragraph [ref=e34]: Conversations
      - link "Planning the next research session" [ref=e36] [cursor=pointer]:
        - /url: /chat?agent=atlas&session=a
        - img [ref=e37]
        - generic [ref=e39]: Planning the next research session
      - link "Comparing approaches to a new idea" [ref=e41] [cursor=pointer]:
        - /url: /chat?agent=atlas&session=b
        - img [ref=e42]
        - generic [ref=e44]: Comparing approaches to a new idea
    - button "Switch to dark mode" [ref=e46] [cursor=pointer]:
      - img [ref=e47]
      - generic [ref=e49]: Dark mode
  - generic [ref=e50]:
    - banner [ref=e51]:
      - generic [ref=e52]:
        - link "Agents" [ref=e53] [cursor=pointer]:
          - /url: /chat
        - img [ref=e54]
        - link "Atlas" [ref=e56] [cursor=pointer]:
          - /url: /chat?agent=atlas
        - img [ref=e57]
        - generic [ref=e59]: Planning the next research session
      - button "Open demo instructions and context" [ref=e60] [cursor=pointer]:
        - img [ref=e61]
        - generic [ref=e64]: Context
    - main [ref=e65]:
      - generic [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]: Atlas
          - button "Copy conversation as Markdown" [ref=e71] [cursor=pointer]:
            - img [ref=e72]
            - generic [ref=e75]: Copy conversation as Markdown
        - generic [ref=e77]:
          - generic [ref=e78]: Question in session a
          - button "Copy message" [ref=e81] [cursor=pointer]:
            - img [ref=e82]
            - generic [ref=e85]: Copy message
        - generic [ref=e87]:
          - paragraph [ref=e88]: Atlas
          - generic [ref=e89]:
            - paragraph [ref=e90]:
              - text: Here is a
              - strong [ref=e91]: clear starting point
              - text: for this conversation.
            - region "Message table" [ref=e92]:
              - table [ref=e93]:
                - rowgroup [ref=e94]:
                  - row "Approach Notes Owner Status Timing Evidence Alternatives Outcome" [ref=e95]:
                    - columnheader "Approach" [ref=e96]
                    - columnheader "Notes" [ref=e97]
                    - columnheader "Owner" [ref=e98]
                    - columnheader "Status" [ref=e99]
                    - columnheader "Timing" [ref=e100]
                    - columnheader "Evidence" [ref=e101]
                    - columnheader "Alternatives" [ref=e102]
                    - columnheader "Outcome" [ref=e103]
                - rowgroup [ref=e104]:
                  - row "Plan A bounded next step Researcher Reviewing Tomorrow Reference Alternative Pending" [ref=e105]:
                    - cell "Plan" [ref=e106]
                    - cell "A bounded next step" [ref=e107]
                    - cell "Researcher" [ref=e108]
                    - cell "Reviewing" [ref=e109]
                    - cell "Tomorrow" [ref=e110]
                    - cell "Reference" [ref=e111]
                    - cell "Alternative" [ref=e112]
                    - cell "Pending" [ref=e113]
                  - row "Compare long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_ Researcher Reviewing Tomorrow Reference Alternative Pending" [ref=e114]:
                    - cell "Compare" [ref=e115]
                    - cell "long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_" [ref=e116]
                    - cell "Researcher" [ref=e117]
                    - cell "Reviewing" [ref=e118]
                    - cell "Tomorrow" [ref=e119]
                    - cell "Reference" [ref=e120]
                    - cell "Alternative" [ref=e121]
                    - cell "Pending" [ref=e122]
            - generic [ref=e124]:
              - generic [ref=e125]:
                - generic [ref=e126]: typescript
                - button "Copy code" [ref=e128] [cursor=pointer]:
                  - img [ref=e129]
                  - generic [ref=e132]: Copy code
              - region "Code block" [ref=e133]:
                - code [ref=e135]:
                  - text: const conversation = "long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_";
                  - text: console.log(conversation);
            - paragraph [ref=e136]:
              - link "Reference long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_long_identifier_" [ref=e137] [cursor=pointer]:
                - /url: https://example.invalid/reference
            - text: <script>window.badMarkup=true</script>
          - generic [ref=e138]:
            - button "Copy message" [ref=e140] [cursor=pointer]:
              - img [ref=e141]
              - generic [ref=e144]: Copy message
            - button "Read aloud" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
        - status [ref=e150]: Reply received
      - generic [ref=e151]:
        - generic [ref=e152]:
          - generic [ref=e153]: Message
          - textbox "Message" [ref=e154]:
            - /placeholder: Message Atlas…
          - button "Send message" [disabled] [ref=e156]:
            - img [ref=e157]
        - paragraph [ref=e159]: Enter to send · Shift + Enter for a new line
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
  13 |  const colors=await page.locator('.ws-root').evaluate(el=>({bg:getComputedStyle(el).backgroundColor,radius:getComputedStyle(el).getPropertyValue('--radius')}));expect(colors.bg).toBe(theme==='dark'?'rgb(63, 63, 70)':'rgb(255, 255, 255)');expect(colors.radius.trim()).toBe('.75rem');if(view==='directory')await expect(page.locator('.ws-agent-card').first()).toHaveCSS('border-radius','12px');if(view==='workspace')await expect(page.locator('.ws-composer')).toHaveCSS('border-radius','16px');
  14 |  await expect(page.locator('#unscoped-sibling')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');expect(await page.locator('#unscoped-sibling').evaluate(el=>getComputedStyle(el).getPropertyValue('--background'))).toBe('');
  15 |  if(view==='conversation'){
  16 |   await expect(page.getByText('Here is a', {exact:false})).toBeVisible();
  17 |   const scroll=await page.locator('.ws-thread-scroll').boundingBox(),composer=await page.locator('.ws-compose-wrap').boundingBox();expect(scroll!.y+scroll!.height).toBeLessThanOrEqual(composer!.y+1);expect(composer!.y+composer!.height).toBeLessThanOrEqual(901);
> 18 |   expect(await page.getByRole('region',{name:'Code block'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();expect(await page.getByRole('region',{name:'Message table'}).evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
     |                                                                                                                                                                                                                                 ^ Error: expect(received).toBeTruthy()
  19 |   await expect(page.locator('.ws-thread script')).toHaveCount(0);
  20 |  }
  21 |  await page.screenshot({path:path.join(evidence,`screenshots/${view}-${theme}-${width}.png`),fullPage:view!=='conversation'});
  22 | });
  23 | test('directory filter, neutral alternate roster and safe navigation/back',async({page})=>{
  24 |  await page.goto('/?roster=alternate');await page.getByLabel('Find an agent').fill('REVIEW');await expect(page.locator('.ws-agent-card')).toHaveCount(1);await expect(page.getByRole('heading',{name:'Moss Review'})).toBeVisible();await page.getByLabel('Find an agent').fill('unmatched');await expect(page.getByRole('heading',{name:'No matching agents'})).toBeVisible();await page.getByLabel('Find an agent').fill('Orbit');await page.locator('.ws-agent-card').click();await expect(page.getByRole('heading',{name:'Orbit Notes'})).toBeVisible();expect(page.url()).toContain('orbit%2F%CE%B2');await page.goBack();await expect(page.getByRole('heading',{name:'Your agents'})).toBeVisible();
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
  70 | test('modal background inert, backdrop dismissal and listener/portal cleanup',async({page})=>{
  71 |  await page.goto('/?view=conversation');await page.getByRole('button',{name:'Open demo instructions and context'}).click();await expect.poll(()=>page.locator('.ws-root').evaluate(el=>(el as HTMLElement).inert)).toBeTruthy();await page.locator('.ws-overlay').click({position:{x:3,y:3}});await expect(page.getByRole('dialog',{name:'Demo context',exact:true})).not.toBeVisible();await expect(page.getByRole('button',{name:'Open demo instructions and context'})).toBeFocused();expect(await page.locator('.ws-root').evaluate(el=>(el as HTMLElement).inert)).toBeFalsy();
  72 | });
  73 | test('real copy payloads and speech lifecycle with explicit browser doubles',async({page})=>{
  74 |  await page.addInitScript(()=>{
  75 |   const state={copies:[] as string[],spoken:0,cancelled:0};Object.assign(window,{fixtureCapabilities:state});
  76 |   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(t:string)=>{state.copies.push(t)}}});
  77 |   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{cancel(){state.cancelled++},speak(utterance:{onstart?:()=>void}){state.spoken++;utterance.onstart?.()},getVoices(){return[]}}});
  78 |  });
  79 |  await page.goto('/?view=conversation');await page.getByRole('button',{name:'Copy code',exact:true}).click();await page.getByRole('button',{name:'Copy conversation as Markdown'}).click();const copies=await page.evaluate(()=>(window as unknown as {fixtureCapabilities:{copies:string[]}}).fixtureCapabilities.copies);expect(copies[0]).toContain('const conversation');expect(copies[0]).not.toContain('```');expect(copies[1]).toContain('**clear starting point**');await page.getByRole('button',{name:'Read aloud',exact:true}).click();await expect(page.getByRole('button',{name:'Stop reading',exact:true})).toBeVisible();await page.getByRole('button',{name:'Stop reading',exact:true}).click();expect(await page.evaluate(()=>(window as unknown as {fixtureCapabilities:{spoken:number}}).fixtureCapabilities.spoken)).toBe(1);
  80 | });
  81 | test('metadata-warning successful send keeps returned ID and repeats only deliberate sends',async({page})=>{
  82 |  await page.goto('/?view=workspace&fixture=send-metadata');await page.getByRole('button',{name:'New chat',exact:true}).click();await page.getByLabel('Message',{exact:true}).fill('First');await page.getByRole('button',{name:'Send message'}).click();await expect(page).toHaveURL(/session=created-1/);await expect(page.getByRole('heading',{name:'Conversation started; title not saved'})).toBeVisible();await page.getByRole('button',{name:'Check conversation list'}).click();expect((await ledger(page)).filter(x=>x.action==='send')).toHaveLength(1);await page.getByLabel('Message',{exact:true}).fill('Second');await page.getByRole('button',{name:'Send message'}).click();await expect(page.getByText('Fixture reply: Second')).toBeVisible();const sends=(await ledger(page)).filter(x=>x.action==='send');expect(sends[1].session).toBe('created-1');
  83 | });
  84 | 
```