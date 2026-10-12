from pathlib import Path
import re,json,base64,shutil
from bs4 import BeautifulSoup
P=Path(__file__).resolve().parent;R=P/'reference'
original=BeautifulSoup((R/'canonical-workspace.html').read_text(),'html.parser')
css=(R/'preview.css').read_text();tokens=(P/'TOKENS.css').read_text()
icons=json.loads(re.search(r'const icons=(.*?);const palettes=',(R/'preview.js').read_text()).group(1))
icons.update({'copy':'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>','audio':'<path d="M11 4 6 8H2v8h4l5 4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>','search':'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>','back':'<path d="M20 12H4m6-6-6 6 6 6"/>','refresh':'<path d="M20 7V2l-3 3a9 9 0 1 0 3 11M20 7h-5"/>'})
(P/'icons.json').write_text(json.dumps(icons))
def icon(n):return '<svg viewBox="0 0 24 24" aria-hidden="true">'+icons[n]+'</svg>'
def theme():return '<button class="theme ghost" data-theme-toggle aria-label="Switch to light mode">'+icon('sun')+'<span>Light mode</span></button>'
def nav(drawer=False):
 return '<aside class="sidebar '+('' if drawer else 'desktop-nav')+'">'+('<div class="drawer-top"><span class="eyebrow">Navigation</span><button class="icon" data-close aria-label="Close navigation">'+icon('x')+'</button></div>' if drawer else '')+'<a href="agents-directory.html" class="brand" data-route="directory"><span class="brand-mark">S</span><div>STARK<div class="brand-note">Agent Workspace</div></div></a><a class="btn primary" data-new href="conversation.html?state=empty">'+icon('plus')+'New chat</a><nav aria-label="Agents"><a href="agents-directory.html" class="nav-item" data-route="directory">'+icon('grid')+'All agents</a><div class="eyebrow nav-label">Your agents</div><div class="nav-list" data-agent-list></div></nav><section class="session-nav" aria-label="Conversations" hidden><div class="eyebrow nav-label">Conversations</div><div data-session-list class="nav-list"></div></section><div class="nav-bottom">'+theme()+'<div class="account"><span class="avatar">TS</span><div>Lab workspace<div class="small muted" data-preview-only>Design preview</div></div></div></div></aside>'
def mobile():return '<div class="mobile-top"><button class="icon" id="open-nav" aria-label="Open navigation" aria-haspopup="dialog">'+icon('menu')+'</button><span class="mobile-title">STARK WORKSPACE</span>'+theme()+'</div>'
def toolbar(states):
 return '<footer class="review-footer review-tools" data-preview-only><span>Design review only · fictional fixtures</span><label>State <select id="review-state">'+''.join(f'<option value="{val}">{name}</option>' for val,name in states)+'</select></label><label>Roster <select id="review-roster"><option value="primary">Primary fixture</option><option value="alternate">Alternate fixture</option></select></label><a href="style-tile.html">Style tile</a><button class="btn outline" id="hide-review">Hide review tools</button></footer>'
context=str(original.select_one('#context-wrap'))
context=context.replace('id="context-wrap"','id="context-wrap"')
# Canonical content is inherited. Only navigation/fixture boundaries are completed.
work=original.select_one('#main-content')
work.select_one('.review-footer').decompose()
for el in work.select('[data-agent-name]'):el.string='Jarvis'
work.select_one('#agent-description')['data-agent-description']=''
work.select_one('#recent-list').clear()
work.select_one('#documents').clear()
work.select_one('.section-head small')['data-preview-only']=''
work.select_one('#send-help span:last-child')['data-preview-only']=''
work.append(BeautifulSoup(toolbar([('populated','Populated'),('empty','Empty'),('loading','Loading'),('unavailable','List unavailable'),('partial','Metadata unavailable'),('recovered','Recovery list')]),'html.parser'))
workspace=str(work)
crumb='<header class="topbar"><div class="crumbs"><a href="agents-directory.html" data-route="directory" class="muted">Agents</a>'+icon('chevron')+'<span data-agent-name>Jarvis</span></div><span class="badge" data-preview-only>Design preview</span></header>'
directory='''<header class="topbar"><div class="crumbs"><span>Agents</span></div><span class="badge" data-preview-only>Design preview</span></header><main id="main-content" class="content directory-content" tabindex="-1"><div class="directory-heading"><div class="eyebrow">Your workspace</div><h1>Your agents</h1><p class="muted">Choose an agent. Pick up a conversation or start something new.</p></div><form class="agent-filter" role="search" id="filter-form"><label for="agent-filter">Find an agent</label><div class="filter-field">'''+icon('search')+'''<input id="agent-filter" type="search" placeholder="Search names or descriptions" autocomplete="off"><button class="icon" type="button" id="clear-filter" aria-label="Clear agent filter" hidden>'''+icon('x')+'''</button></div></form><p class="agent-count muted small" id="agent-count" role="status"></p><div class="agent-grid" id="agent-grid"></div>'''+toolbar([('populated','Populated'),('empty','No agents configured'),('no-results','No filter results'),('loading','Loading'),('unavailable','Configuration unavailable')])+'''</main>'''
conversation='''<header class="topbar conversation-header"><div class="thread-heading"><div class="crumbs small"><a data-route="directory" href="agents-directory.html" class="muted">Agents</a>'''+icon('chevron')+'''<a data-route="workspace" href="workspace.html" data-agent-name>Jarvis</a></div><h1 id="thread-title">Planning the next research session</h1></div><button class="btn outline" id="open-context" aria-label="Open demo instructions and context" aria-haspopup="dialog">'''+icon('file')+'''<span>Context</span><span class="badge">Demo</span></button></header><main id="main-content" class="conversation-main" tabindex="-1"><div id="thread-scroll" class="thread-scroll" tabindex="0" aria-label="Conversation messages"><div id="thread-content" class="thread-content"></div></div><div class="chat-compose-wrap"><form id="chat-composer" class="chat-composer"><label for="message" class="sr-only">Message to selected agent</label><textarea id="message" rows="1" placeholder="Ask Jarvis…" aria-describedby="chat-help"></textarea><button id="send" class="send primary" type="submit" disabled aria-label="Send message">'''+icon('arrow')+'''</button></form><div id="chat-help" class="chat-help muted">Enter to send · Shift + Enter for a new line</div></div>'''+toolbar([('populated','Populated'),('empty','Empty draft'),('loading','History loading'),('unavailable','History unavailable'),('missing','Missing session'),('pending','Pending reply'),('uncertain','Uncertain send'),('failed','Confirmed not sent'),('metadata','Metadata save issue'),('unauthorized','Permission denied')])+'''</main>'''
base_dialogs='<dialog id="nav-dialog" aria-label="Navigation">'+nav(True)+'</dialog><dialog id="modal" aria-labelledby="modal-title"><div class="dialog-top"><h2 id="modal-title"></h2><button class="icon" data-close aria-label="Close dialog">'+icon('x')+'</button></div><div id="modal-body" class="dialog-body"></div></dialog><div id="feedback" role="status" aria-live="polite"></div>'
contextdialog='<dialog id="context-dialog" aria-labelledby="context-title"><div class="dialog-top"><h2 id="context-title">Instructions &amp; context</h2><button class="icon" data-close aria-label="Close context">'+icon('x')+'</button></div>'+context+'</dialog>'
style=BeautifulSoup((R/'style-tile.html').read_text(),'html.parser').select_one('main')
style.select_one('a[href="canonical-workspace.html"]')['href']='workspace.html'
style.select_one('.review-footer').clear();style.select_one('.review-footer').append('Canonical visual direction approved · 4 October 2026 · final design return v1.0')
# Append actual inherited code appearance specimen.
code_tile=BeautifulSoup('<section class="tile-block wide"><h2>07 / Existing chat presentation</h2><div class="tile-chat-sample"><div class="user-message">Keep the familiar chat layout.</div><div><span class="eyebrow">Assistant</span><p class="small">Right-aligned user bubbles, readable assistant prose, and oneDark / oneLight code surfaces.</p><div class="code-block"><div class="code-head">JavaScript · specimen</div><pre><code><span class="syntax-keyword">const</span> topic = <span class="syntax-string">"Research"</span>;</code></pre></div></div></div></section>','html.parser')
style.select_one('.tile-grid').append(code_tile)
fonts=''
for w in (400,500,600,700):fonts+=f'@font-face{{font-family:Inter;font-style:normal;font-weight:{w};font-display:swap;src:url(data:font/ttf;base64,{base64.b64encode((P/f"assets/Inter-{w}.ttf").read_bytes()).decode()}) format("truetype");}}'
bootstrap="""try{const q=new URLSearchParams(location.search);const s=q.get('theme')||localStorage.getItem('stark-design-theme')||'dark';document.documentElement.classList.toggle('dark',s==='dark');document.documentElement.dataset.review=q.get('review')==='0'?'false':'true'}catch{document.documentElement.classList.add('dark')}"""
fixtures=json.loads((P/'fixtures.json').read_text())
script='const icons='+json.dumps(icons)+';const fixtures='+json.dumps(fixtures)+';const palettes='+ (P/'token-values.json').read_text()+';\n'+(P/'interactions.js').read_text()
fullcss=fonts+tokens+(P/'CHAT_TOKENS.css').read_text()+css+(P/'screens.css').read_text()
for name,body,kind in [('agents-directory.html',directory,'directory'),('workspace.html',crumb+workspace,'workspace'),('conversation.html',conversation,'conversation'),('style-tile.html',str(style),'tile')]:
 if kind!='tile':body='<a class="skip" href="#main-content">Skip to content</a>'+nav()+'<div class="main">'+mobile()+body+'</div>'
 body+=base_dialogs+(contextdialog if kind=='conversation' else '')
 (P/name).write_text('<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stark Agent Workspace — '+kind+'</title><script>'+bootstrap+'</script><style>'+fullcss+'</style></head><body data-page="'+kind+'">'+body+'<script>'+script+'</script></body></html>')
(P/'BASE.css').write_text(css)
print('Built 4 linked self-contained design pages')
